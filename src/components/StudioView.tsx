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
    <div className="flex flex-col gap-4 pb-24">
      {onExitLesson && (
        <button
          onClick={onExitLesson}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition w-fit cursor-pointer bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Lesson Plans
        </button>
      )}

      {/* 2-Way Conversational Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Interactive Video & Audio Channel Active
              </span>
              <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                {skillLevel} Level
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">
              {activeModule ? `${activeModule.title}: ${activeModule.prescribedDrill}` : activeDiscipline.prescribedDrill}
            </h2>
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
                className="bg-slate-800 text-emerald-300 text-xs font-semibold rounded-xl px-2.5 py-2 border border-slate-700 focus:outline-none disabled:opacity-50"
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
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <Settings className="w-3.5 h-3.5 text-emerald-400" /> Sport / Level
            </button>
          </div>
        </div>

        {/* Current Step Pacing Card */}
        {isLessonActive && (
          <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                Step {currentStepIndex + 1} of {currentSteps.length}: <strong className="text-emerald-400 font-mono">
                  {currentSteps[currentStepIndex]}
                </strong>
              </span>
              <span className="font-mono text-emerald-400 font-bold">{formatTime(lessonSeconds)}</span>
            </div>

            <p className="text-[11px] text-slate-300 italic">
              👉 Speak into mic! Say <strong className="text-emerald-300">&quot;Ready&quot;</strong>, <strong className="text-emerald-300">&quot;What is this?&quot;</strong>, or <strong className="text-emerald-300">&quot;Wait&quot;</strong> in your AirPods.
            </p>
          </div>
        )}
      </div>

      {/* Main Viewfinder / Camera HUD */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex items-center justify-center">
        {cameraPermissionGranted !== false ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transform -scale-x-100"
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <Camera className="w-12 h-12 mb-2 text-slate-600" />
            <p className="text-sm font-medium">Camera preview active (VAD Soundwave Active)</p>
          </div>
        )}

        {/* Halo Border Overlay (Clean, no flickering) */}
        <div className={`absolute inset-0 pointer-events-none rounded-2xl border-4 transition-all duration-300 ${
          haloStatus === 'user_speaking'
            ? 'border-emerald-400 shadow-[inset_0_0_50px_rgba(16,185,129,0.6)]'
            : haloStatus === 'coach_speaking'
            ? 'border-cyan-400 shadow-[inset_0_0_40px_rgba(6,182,212,0.4)]'
            : isLessonActive
            ? 'border-emerald-500/70 shadow-[inset_0_0_30px_rgba(16,185,129,0.2)]'
            : 'border-slate-800'
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
            <span className="bg-cyan-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5" /> Coach Speaking
            </span>
          )}
        </div>

        {/* Dynamic AI Visual Reaction Overlay on Video Feed */}
        {isLessonActive && activeVisualReaction && (
          <div className="absolute top-16 left-4 max-w-xs z-10 bg-slate-950/90 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/80 shadow-2xl space-y-1.5 animate-fade-in">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Eye className="w-4 h-4 animate-pulse" />
              <span>{activeVisualReaction.title}</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-snug">
              {activeVisualReaction.detail}
            </p>
          </div>
        )}

        {/* Live Subtitles Banner */}
        {currentCoachSpeech && (
          <div className="absolute bottom-4 inset-x-6 z-10">
            <div className="bg-slate-950/90 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 backdrop-blur-md shadow-xl text-center space-y-1">
              {lastUserSpeech && (
                <p className="text-[11px] text-emerald-300 italic font-mono">
                  🗣️ Student: &quot;{lastUserSpeech}&quot;
                </p>
              )}
              <p className="text-slate-100 font-bold">
                🎙️ <strong className="text-emerald-400">{activeDiscipline.coachPersona.name}:</strong> &quot;{currentCoachSpeech}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Quick Voice Input Triggers for Testing */}
      {isLessonActive && (
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
            🗣️ Speak into AirPods (or tap quick voice shortcuts to test video reactions):
          </span>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleUserVoiceInput("What is this pose?")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> &quot;What is this posture?&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("Wait, hold on a second")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Pause className="w-3.5 h-3.5 text-amber-400" /> &quot;Wait, hold on!&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("Ready! Next step")}
              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold py-2 px-3 rounded-xl border border-emerald-800 flex items-center gap-1.5 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> &quot;Ready for next step!&quot;
            </button>
          </div>
        </div>
      )}

      {/* Main Action Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        {!isLessonActive ? (
          <button
            onClick={startPrivateLesson}
            className="w-full flex-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base py-4 px-6 rounded-xl shadow-lg shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all"
          >
            <Play className="w-5 h-5 fill-current" /> Start Two-Way Live Lesson
          </button>
        ) : (
          <div className="w-full flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-950/80 px-3 py-2.5 rounded-xl border border-emerald-800">
              <Mic className="w-4 h-4 text-emerald-400" />
              Student Mic Active (VAD Echo Filter On)
            </div>

            <button
              onClick={endPrivateLesson}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-md flex items-center justify-center gap-1.5"
            >
              <Square className="w-4 h-4 fill-current" /> End Lesson
            </button>
          </div>
        )}
      </div>

      {/* Post Session Summary Modal */}
      {completedReport && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">Interactive Lesson Film Study</h3>
              </div>
              <span className="text-xs bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-1 rounded-full font-bold">
                Score: {completedReport.overallScore} (+{completedReport.scoreChange})
              </span>
            </div>

            <p className="text-sm text-slate-300">
              {completedReport.coachSummary}
            </p>

            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Lesson Highlights</span>
              <ul className="text-xs text-slate-200 space-y-1.5 list-disc pl-4">
                {completedReport.keyTakeaways.map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setCompletedReport(null)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm py-2.5 px-5 rounded-xl flex items-center gap-2"
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
