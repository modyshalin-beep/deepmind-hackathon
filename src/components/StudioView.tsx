'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Discipline, SessionReport, SkillLevel } from '@/types';
import { CoachHaloStatus, LessonPhase, ConversationalExchange, speakCoachFeedback, stopCoachSpeaking, generateCoachResponseToUserSpeech, generateLiveSessionReport } from '@/lib/geminiLiveSimulator';
import { AudioWaveform } from '@/components/AudioWaveform';
import { Camera, Video, Volume2, Mic, MicOff, Sparkles, Award, ArrowRight, Zap, Play, Square, Pause, ShieldCheck, Flame, CheckCircle2, Clock, BookOpen, Settings, MessageSquare, HelpCircle, Eye, AlertCircle } from 'lucide-react';

interface StudioViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  skillLevel: SkillLevel;
  onSelectDiscipline: (d: Discipline) => void;
  onOpenOnboarding: () => void;
  onSessionComplete: (report: SessionReport) => void;
}

export function StudioView({ disciplines, activeDiscipline, skillLevel, onSelectDiscipline, onOpenOnboarding, onSessionComplete }: StudioViewProps) {
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
    if (advanceStep && currentStepIndex < activeDiscipline.beginnerStepByStepPrep.length - 1) {
      nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
    }

    // Trigger AI Visual Breakdown Overlay on Video Feed
    setActiveVisualReaction({
      title: `AI Visual Reaction: ${activeDiscipline.name}`,
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

    const step1 = activeDiscipline.beginnerStepByStepPrep[0] || 'Place your feet 4 feet apart.';
    const welcome = `Welcome to your 2-way live ${activeDiscipline.name} lesson! I am Coach ${activeDiscipline.coachPersona.name}. Let's do Step 1 together: ${step1} Speak into your AirPods or ask a question whenever you're set!`;

    setCurrentCoachSpeech(welcome);
    setActiveVisualReaction({
      title: `Step 1 Breakdown: ${activeDiscipline.name}`,
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
    setCompletedReport(report);
    onSessionComplete(report);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* 2-Way Conversational Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-[#C2410C] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Video & Audio Channel Active
              </span>
              <span className="text-[10px] font-black uppercase bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded-full">
                {skillLevel} Level
              </span>
            </div>
            <h2 className="text-lg font-bold text-[#182030] mt-0.5">{activeDiscipline.prescribedDrill}</h2>
          </div>

          {/* Microphone Selector & Settings */}
          <div className="flex items-center gap-2">
            {audioDevices.length > 0 && (
              <select
                value={selectedAudioDeviceId}
                onChange={(e) => {
                  setSelectedAudioDeviceId(e.target.value);
                  startCameraStream(e.target.value);
                }}
                disabled={isLessonActive}
                className="bg-[#F4EFE6] text-[#182030] text-xs font-semibold rounded-xl px-2.5 py-2 border border-[#E6E0D4] focus:outline-none disabled:opacity-50"
              >
                {audioDevices.map(d => (
                  <option key={d.deviceId} value={d.deviceId}>
                    🎙️ {d.label || `Mic Input (${d.deviceId.slice(0, 5)}...)`}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={onOpenOnboarding}
              disabled={isLessonActive}
              className="bg-[#F4EFE6] hover:bg-[#E6E0D4] text-[#182030] text-xs font-bold px-3 py-2 rounded-xl border border-[#E6E0D4] flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-[#C2410C]" /> Sport / Level
            </button>
          </div>
        </div>

        {/* Current Step Pacing Card */}
        {isLessonActive && (
          <div className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#182030] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#C2410C]" />
                Step {currentStepIndex + 1} of {activeDiscipline.beginnerStepByStepPrep.length}: <strong className="text-[#C2410C] font-mono">
                  {activeDiscipline.beginnerStepByStepPrep[currentStepIndex]}
                </strong>
              </span>
              <span className="font-mono text-[#1D4ED8] font-bold">{formatTime(lessonSeconds)}</span>
            </div>

            <p className="text-[11px] text-[#5A6578] italic">
              👉 Speak into mic! Say <strong className="text-[#C2410C]">&quot;Ready&quot;</strong>, <strong className="text-[#1D4ED8]">&quot;What is this?&quot;</strong>, or <strong className="text-[#D97706]">&quot;Wait&quot;</strong> in your AirPods.
            </p>
          </div>
        )}
      </div>

      {/* Main Viewfinder / Camera HUD */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-[#182030] rounded-2xl overflow-hidden border border-[#E6E0D4] shadow-lg flex items-center justify-center">
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
            <Camera className="w-12 h-12 mb-2 text-slate-400" />
            <p className="text-sm font-medium">Camera preview active (VAD Soundwave Active)</p>
          </div>
        )}

        {/* Halo Border Overlay (Clean, no flickering) */}
        <div className={`absolute inset-0 pointer-events-none rounded-2xl border-4 transition-all duration-300 ${
          haloStatus === 'user_speaking'
            ? 'border-[#C2410C] shadow-[inset_0_0_50px_rgba(194,65,12,0.5)]'
            : haloStatus === 'coach_speaking'
            ? 'border-[#D97706] shadow-[inset_0_0_40px_rgba(217,119,6,0.5)]'
            : isLessonActive
            ? 'border-[#C2410C]/70 shadow-[inset_0_0_30px_rgba(194,65,12,0.2)]'
            : 'border-white/10'
        }`} />

        {/* Live Soundwave Audio Channel Header */}
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-10 pointer-events-none">
          <AudioWaveform
            stream={activeStream}
            isListening={isLessonActive}
            isCoachSpeaking={haloStatus === 'coach_speaking'}
            onVoiceActivity={handleVoiceActivityDetected}
          />

          {haloStatus === 'coach_speaking' && (
            <span className="bg-[#D97706] text-white text-xs font-black px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Coach Speaking
            </span>
          )}
        </div>

        {/* Dynamic AI Visual Reaction Overlay on Video Feed */}
        {isLessonActive && activeVisualReaction && (
          <div className="absolute top-16 left-4 max-w-xs z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#D97706] shadow-xl space-y-1.5 animate-fade-in text-[#182030]">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#C2410C]">
              <Eye className="w-4 h-4 animate-pulse" />
              <span>{activeVisualReaction.title}</span>
            </div>
            <p className="text-[11px] text-[#5A6578] leading-snug">
              {activeVisualReaction.detail}
            </p>
          </div>
        )}

        {/* Live Subtitles Banner */}
        {currentCoachSpeech && (
          <div className="absolute bottom-4 inset-x-6 z-10">
            <div className="bg-white/95 text-[#182030] text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border border-[#E6E0D4] backdrop-blur-md shadow-xl text-center space-y-1">
              {lastUserSpeech && (
                <p className="text-[11px] text-[#1D4ED8] italic font-mono">
                  🗣️ Student: &quot;{lastUserSpeech}&quot;
                </p>
              )}
              <p className="text-[#182030] font-bold">
                🎙️ <strong className="text-[#C2410C]">{activeDiscipline.coachPersona.name}:</strong> &quot;{currentCoachSpeech}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quick Voice Input Triggers for Testing */}
      {isLessonActive && (
        <div className="bg-white p-3.5 rounded-2xl border border-[#E6E0D4] space-y-2 shadow-xs">
          <span className="text-[11px] text-[#5A6578] font-bold uppercase tracking-wider block">
            🗣️ Speak into AirPods (or tap quick voice shortcuts to test video reactions):
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleUserVoiceInput("What is this pose?")}
              className="bg-[#F4EFE6] hover:bg-[#E6E0D4] text-[#182030] text-xs py-2 px-3 rounded-xl border border-[#E6E0D4] flex items-center gap-1.5 transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#1D4ED8]" /> &quot;What is this posture?&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("Wait, hold on a second")}
              className="bg-[#F4EFE6] hover:bg-[#E6E0D4] text-[#182030] text-xs py-2 px-3 rounded-xl border border-[#E6E0D4] flex items-center gap-1.5 transition cursor-pointer"
            >
              <Pause className="w-3.5 h-3.5 text-[#D97706]" /> &quot;Wait, hold on!&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("Ready! Next step")}
              className="bg-[#FFEDD5] hover:bg-[#FED7AA] text-[#C2410C] text-xs font-bold py-2 px-3 rounded-xl border border-[#FDBA74] flex items-center gap-1.5 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#C2410C]" /> &quot;Ready for next step!&quot;
            </button>
          </div>
        </div>
      )}

      {/* Main Action Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E6E0D4] shadow-xs">
        {!isLessonActive ? (
          <button
            onClick={startPrivateLesson}
            className="w-full flex-1 bg-[#C2410C] hover:bg-[#9a3412] text-white font-black text-base py-4 px-6 rounded-xl shadow-md shadow-[#C2410C]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-current" /> Start Two-Way Live Lesson
          </button>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[#92400E] font-bold bg-[#FEF3C7] px-3 py-2.5 rounded-xl border border-[#FDE68A]">
              <Mic className="w-4 h-4 text-[#C2410C]" />
              Student Mic Active (VAD Echo Filter On)
            </div>

            <button
              onClick={endPrivateLesson}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Square className="w-4 h-4 fill-current" /> End Lesson
            </button>
          </div>
        )}
      </div>

      {/* Post Session Summary Modal */}
      {completedReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#E6E0D4] rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#C2410C]" />
                <h3 className="text-lg font-bold text-[#182030]">Interactive Lesson Film Study</h3>
              </div>
              <span className="text-xs bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2.5 py-1 rounded-full font-bold">
                Score: {completedReport.overallScore} (+{completedReport.scoreChange})
              </span>
            </div>

            <p className="text-sm text-[#5A6578]">
              {completedReport.coachSummary}
            </p>

            <div className="bg-[#F4EFE6] rounded-xl p-3 border border-[#E6E0D4]">
              <span className="text-xs font-bold text-[#5A6578] uppercase tracking-wider block mb-2">Lesson Highlights</span>
              <ul className="text-xs text-[#182030] space-y-1.5 list-disc pl-4">
                {completedReport.keyTakeaways.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setCompletedReport(null)}
                className="bg-[#C2410C] hover:bg-[#9a3412] text-white font-black text-sm py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer shadow-md shadow-[#C2410C]/25"
              >
                Review Milestone Film Clips <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
