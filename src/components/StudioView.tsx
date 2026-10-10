'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Discipline, SessionReport, SkillLevel, CourseModule } from '@/types';
import { CoachHaloStatus, LessonPhase, ConversationalExchange, speakCoachFeedback, stopCoachSpeaking, generateCoachResponseToUserSpeech, generateLiveSessionReport } from '@/lib/geminiLiveSimulator';
import { AudioWaveform } from '@/components/AudioWaveform';
import { Camera, Video, Volume2, Mic, MicOff, Sparkles, Award, ArrowRight, ArrowLeft, Zap, Play, Square, Pause, ShieldCheck, Flame, CheckCircle2, Clock, BookOpen, Settings, MessageSquare, HelpCircle, Eye, AlertCircle } from 'lucide-react';

interface StudioViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  activeModule?: CourseModule;
  skillLevel: SkillLevel;
  onSelectDiscipline: (d: Discipline) => void;
  onOpenOnboarding: () => void;
  onSessionComplete: (report: SessionReport) => void;
  onExitLesson?: () => void;
}

export function StudioView({ disciplines, activeDiscipline, activeModule, skillLevel, onSelectDiscipline, onOpenOnboarding, onSessionComplete, onExitLesson }: StudioViewProps) {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lessonSeconds, setLessonSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [haloStatus, setHaloStatus] = useState<CoachHaloStatus>('ready');
  const [currentCoachSpeech, setCurrentCoachSpeech] = useState<string>('');
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [activeVisualReaction, setActiveVisualReaction] = useState<{ title: string; detail: string; stepNumber: number } | null>(null);
  const [conversations, setConversations] = useState<ConversationalExchange[]>([]);
  const [autoBurstsCount, setAutoBurstsCount] = useState(0);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [completedReport, setCompletedReport] = useState<SessionReport | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const lessonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoBurstIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isLessonActiveRef = useRef<boolean>(false);

  const recognitionRef = useRef<any>(null);

  const currentSteps = activeModule?.beginnerSteps || activeDiscipline.beginnerStepByStepPrep;

  // Fetch available audio devices (AirPods, Built-in Mic)
  const enumerateMicDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mics = devices.filter(d => d.kind === 'audioinput');
      setAudioDevices(mics);
      if (mics.length > 0 && !selectedAudioDeviceId) {
        setSelectedAudioDeviceId(mics[0].deviceId);
      }
    } catch (e) {
      console.warn('Could not enumerate audio devices:', e);
    }
  };

  // Initialize camera & mic stream
  const startCameraStream = async (deviceId?: string) => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }

      const audioConstraints: any = deviceId ? { deviceId: { exact: deviceId } } : true;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: audioConstraints,
      });

      mediaStreamRef.current = stream;
      setActiveStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraPermissionGranted(true);
      await enumerateMicDevices();
    } catch (err) {
      console.warn('Camera/mic access error:', err);
      setCameraPermissionGranted(false);
    }
  };

  useEffect(() => {
    startCameraStream();

    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = 'en-US';

        recog.onresult = (event: any) => {
          const lastIndex = event.results.length - 1;
          const transcript = event.results[lastIndex][0].transcript.trim();
          if (transcript) {
            handleUserVoiceInput(transcript);
          }
        };

        recog.onerror = (err: any) => {
          console.warn('Speech recognition error:', err);
        };

        recog.onend = () => {
          if (isLessonActiveRef.current) {
            try { recog.start(); } catch (e) {}
          }
        };

        recognitionRef.current = recog;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
    };
  }, []);

  // Lesson timer
  useEffect(() => {
    isLessonActiveRef.current = isLessonActive;

    if (isLessonActive && !isPaused) {
      lessonTimerRef.current = setInterval(() => {
        setLessonSeconds(prev => prev + 1);
      }, 1000);

      autoBurstIntervalRef.current = setInterval(() => {
        setAutoBurstsCount(prev => prev + 1);
        setHaloStatus('burst_capturing');
        setTimeout(() => {
          if (haloStatus === 'burst_capturing') setHaloStatus('ready');
        }, 1500);
      }, 12000);
    } else {
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
      if (autoBurstIntervalRef.current) clearInterval(autoBurstIntervalRef.current);
    }

    return () => {
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
      if (autoBurstIntervalRef.current) clearInterval(autoBurstIntervalRef.current);
    };
  }, [isLessonActive, isPaused, haloStatus]);

  // Handle Voice Activity Detection (VAD) without rapid flickering
  const handleVoiceActivityDetected = useCallback((volumePercent: number) => {
    if (!isLessonActive) return;
    if (haloStatus !== 'coach_speaking' && haloStatus !== 'user_speaking') {
      setHaloStatus('user_speaking');
    }
  }, [isLessonActive, haloStatus]);

  // Handle User Voice Input & Visual Reaction
  const handleUserVoiceInput = async (userInputText: string) => {
    if (!isLessonActive) return;

    stopCoachSpeaking();
    setHaloStatus('user_speaking');
    setLastUserSpeech(userInputText);

    const userExchange: ConversationalExchange = {
      id: `ex-${Date.now()}`,
      speaker: 'user',
      text: userInputText,
      timestampSeconds: lessonSeconds,
    };
    setConversations(prev => [...prev, userExchange]);

    // Generate response and active visual reaction
    const { responseText, advanceStep } = generateCoachResponseToUserSpeech(
      userInputText,
      activeDiscipline,
      skillLevel,
      currentStepIndex
    );

    let nextStep = currentStepIndex;
    if (advanceStep && currentStepIndex < currentSteps.length - 1) {
      nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
    }

    // Trigger AI Visual Breakdown Overlay on Video Feed
    setActiveVisualReaction({
      title: `AI Visual Reaction: ${activeModule ? activeModule.title : activeDiscipline.name}`,
      detail: responseText,
      stepNumber: nextStep + 1,
    });

    setTimeout(async () => {
      setHaloStatus('coach_speaking');
      setCurrentCoachSpeech(responseText);

      const coachExchange: ConversationalExchange = {
        id: `ex-coach-${Date.now()}`,
        speaker: 'coach',
        text: responseText,
        timestampSeconds: lessonSeconds,
      };
      setConversations(prev => [...prev, coachExchange]);

      await speakCoachFeedback(
        responseText,
        () => setHaloStatus('coach_speaking'),
        () => setHaloStatus('ready')
      );
    }, 700);
  };

  const startPrivateLesson = async () => {
    setIsLessonActive(true);
    isLessonActiveRef.current = true;
    setIsPaused(false);
    setLessonSeconds(0);
    setCurrentStepIndex(0);
    setAutoBurstsCount(0);
    setConversations([]);
    setHaloStatus('ready');

    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }

    const step1 = currentSteps[0] || 'Place your feet in ready position.';
    const lessonTitle = activeModule ? `${activeModule.title}` : activeDiscipline.name;
    const welcome = `Welcome to your 2-way live ${lessonTitle} lesson! I am Coach ${activeDiscipline.coachPersona.name}. Let's do Step 1 together: ${step1} Speak into your AirPods or ask a question whenever you're set!`;

    setCurrentCoachSpeech(welcome);
    setActiveVisualReaction({
      title: `Step 1 Breakdown: ${lessonTitle}`,
      detail: step1,
      stepNumber: 1,
    });

    await speakCoachFeedback(
      welcome,
      () => setHaloStatus('coach_speaking'),
      () => setHaloStatus('ready')
    );
  };

  const endPrivateLesson = () => {
    setIsLessonActive(false);
    isLessonActiveRef.current = false;
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    const durationMins = Math.max(1, Math.ceil(lessonSeconds / 60));
    const report = generateLiveSessionReport(
      activeDiscipline,
      durationMins,
      autoBurstsCount,
      conversations.length
    );
    if (activeModule) {
      report.moduleId = activeModule.id;
    }
    setCompletedReport(report);
    onSessionComplete(report);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-3 pb-24">
      {/* Streamlined Studio Header */}
      <div className="bg-white border border-[#E8E2D8] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onExitLesson && (
            <button
              onClick={onExitLesson}
              className="p-2 rounded-2xl hover:bg-[#F7F3EE] text-[#6E757C] hover:text-[#3E4348] transition cursor-pointer"
              title="Back to Lesson Plans"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#E8A5A5] uppercase">
                {activeDiscipline.name}
              </span>
              <span className="text-[10px] font-mono text-[#6E757C] capitalize">
                • {skillLevel}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-[#3E4348]">
              {activeModule ? activeModule.title : activeDiscipline.prescribedDrill}
            </h2>
          </div>
        </div>

        {/* Status / Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isLessonActive && (
            <div className="flex items-center gap-2 text-xs font-mono text-[#3E4348] bg-[#F7F3EE] px-3 py-1.5 rounded-2xl border border-[#E8E2D8]">
              <span className="font-bold text-[#E8A5A5]">Step {currentStepIndex + 1}/{currentSteps.length}</span>
              <span>•</span>
              <span className="font-bold text-[#A4C2F4]">{formatTime(lessonSeconds)}</span>
            </div>
          )}

          {audioDevices.length > 0 && (
            <select
              value={selectedAudioDeviceId}
              onChange={(e) => {
                setSelectedAudioDeviceId(e.target.value);
                startCameraStream(e.target.value);
              }}
              disabled={isLessonActive}
              className="bg-[#F7F3EE] text-[#3E4348] text-xs font-semibold rounded-2xl px-3 py-2 border border-[#E8E2D8] focus:outline-none disabled:opacity-50"
            >
              {audioDevices.map(d => (
                <option key={d.deviceId} value={d.deviceId}>
                  🎙️ {d.label || `Mic (${d.deviceId.slice(0, 5)}...)`}
                </option>
              ))}
            </select>
          )}

          <button
            onClick={onOpenOnboarding}
            disabled={isLessonActive}
            className="bg-[#F7F3EE] hover:bg-white text-[#3E4348] text-xs font-bold px-3 py-2 rounded-2xl border border-[#E8E2D8] flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Settings className="w-3.5 h-3.5 text-[#E8A5A5]" />
          </button>
        </div>
      </div>

      {/* Main Viewfinder / Camera HUD */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#3E4348] rounded-3xl overflow-hidden border border-[#E8E2D8] shadow-md flex items-center justify-center">
        {cameraPermissionGranted !== false ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <Camera className="w-10 h-10 mb-2 text-slate-400" />
            <p className="text-xs font-medium">Camera preview active</p>
          </div>
        )}

        {/* Halo Border Overlay (Clean, no flickering) */}
        <div className={`absolute inset-0 pointer-events-none rounded-3xl border-4 transition-all duration-300 ${
          haloStatus === 'user_speaking'
            ? 'border-[#E8A5A5] shadow-[inset_0_0_50px_rgba(232,165,165,0.45)]'
            : haloStatus === 'coach_speaking'
            ? 'border-[#A4C2F4] shadow-[inset_0_0_40px_rgba(164,194,244,0.45)]'
            : isLessonActive
            ? 'border-[#B5C99A]/70 shadow-[inset_0_0_30px_rgba(181,201,154,0.3)]'
            : 'border-white/10'
        }`} />

        {/* Live Soundwave Audio Channel Header */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-center z-10 pointer-events-none">
          <AudioWaveform
            stream={activeStream}
            isListening={isLessonActive}
            isCoachSpeaking={haloStatus === 'coach_speaking'}
            onVoiceActivity={handleVoiceActivityDetected}
          />

          {haloStatus === 'coach_speaking' && (
            <span className="bg-[#A4C2F4] text-[#3E4348] text-xs font-black px-3 py-1.5 rounded-2xl shadow-md flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Speaking
            </span>
          )}
        </div>

        {/* Dynamic AI Visual Reaction Overlay on Video Feed */}
        {isLessonActive && activeVisualReaction && (
          <div className="absolute top-14 left-3 max-w-xs z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-[#A4C2F4] shadow-md space-y-1 animate-fade-in text-[#3E4348]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#E8A5A5]">
              <Eye className="w-3.5 h-3.5 animate-pulse" />
              <span>{activeVisualReaction.title}</span>
            </div>
            <p className="text-[11px] text-[#6E757C] leading-snug">
              {activeVisualReaction.detail}
            </p>
          </div>
        )}

        {/* Live Subtitles Banner */}
        {currentCoachSpeech && (
          <div className="absolute bottom-3 inset-x-4 z-10">
            <div className="bg-white/95 text-[#3E4348] text-xs sm:text-sm font-medium px-4 py-2.5 rounded-2xl border border-[#E8E2D8] backdrop-blur-md shadow-md text-center space-y-0.5">
              {lastUserSpeech && (
                <p className="text-[11px] text-[#A4C2F4] italic font-mono font-bold">
                  🗣️ &quot;{lastUserSpeech}&quot;
                </p>
              )}
              <p className="text-[#3E4348] font-bold">
                🎙️ <strong className="text-[#E8A5A5]">{activeDiscipline.coachPersona.name}:</strong> &quot;{currentCoachSpeech}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Voice Prompt Shortcuts (Flattened, un-nested) */}
      {isLessonActive && (
        <div className="flex flex-wrap items-center justify-center gap-2 py-1">
          <button
            onClick={() => handleUserVoiceInput("What is this pose?")}
            className="bg-white hover:bg-[#F7F3EE] text-[#3E4348] text-xs py-1.5 px-3 rounded-full border border-[#E8E2D8] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-3 h-3 text-[#A4C2F4]" /> &quot;What is this?&quot;
          </button>

          <button
            onClick={() => handleUserVoiceInput("Wait, hold on a second")}
            className="bg-white hover:bg-[#F7F3EE] text-[#3E4348] text-xs py-1.5 px-3 rounded-full border border-[#E8E2D8] flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <Pause className="w-3 h-3 text-[#E9D78E]" /> &quot;Wait, hold on&quot;
          </button>

          <button
            onClick={() => handleUserVoiceInput("Ready! Next step")}
            className="bg-[#E8A5A5]/20 hover:bg-[#E8A5A5]/35 text-[#3E4348] text-xs font-bold py-1.5 px-3 rounded-full border border-[#E8A5A5]/40 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <CheckCircle2 className="w-3 h-3 text-[#B5C99A]" /> &quot;Ready for next step&quot;
          </button>
        </div>
      )}

      {/* Main Action Trigger */}
      <div>
        {!isLessonActive ? (
          <button
            onClick={startPrivateLesson}
            className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" /> Start Practice Session
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#42592B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B5C99A] animate-ping" />
              Mic Active (VAD Filter On)
            </span>

            <button
              onClick={endPrivateLesson}
              className="bg-[#E8A5A5] hover:bg-[#df9090] text-white font-bold text-xs sm:text-sm py-2.5 px-5 rounded-2xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Square className="w-3.5 h-3.5 fill-current" /> End Session
            </button>
          </div>
        )}
      </div>

      {/* Post Session Summary Modal */}
      {completedReport && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E8E2D8] rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#E8A5A5]" />
                <h3 className="text-lg font-bold text-[#3E4348]">Session Summary</h3>
              </div>
              <span className="text-xs bg-[#B5C99A]/30 text-[#42592B] border border-[#B5C99A]/50 px-2.5 py-1 rounded-full font-bold">
                Score: {completedReport.overallScore} (+{completedReport.scoreChange})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#6E757C]">
              {completedReport.coachSummary}
            </p>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#6E757C] uppercase tracking-wider block">Key Highlights</span>
              <ul className="text-xs text-[#3E4348] space-y-1 list-disc pl-4">
                {completedReport.keyTakeaways.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setCompletedReport(null)}
                className="bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-xs py-2.5 px-5 rounded-2xl transition cursor-pointer"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
