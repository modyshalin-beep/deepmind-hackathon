'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Discipline, SessionReport, SkillLevel, CourseModule } from '@/types';
import { 
  CoachHaloStatus, LessonPhase, ConversationalExchange, 
  speakCoachFeedback, stopCoachSpeaking, primeSpeechSynthesis,
  generateCoachResponseToUserSpeech, generateLiveSessionReport 
} from '@/lib/geminiLiveSimulator';
import { AudioWaveform } from '@/components/AudioWaveform';
import { 
  Camera, Volume2, Mic, Award, ArrowLeft, Play, Square, Pause, 
  CheckCircle2, BookOpen, Settings, HelpCircle, Eye, AlertCircle, 
  Send, VolumeX, ChevronRight, Activity, ScanLine 
} from 'lucide-react';

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

export function StudioView({ 
  disciplines, 
  activeDiscipline, 
  activeModule, 
  skillLevel, 
  onSelectDiscipline, 
  onOpenOnboarding, 
  onSessionComplete, 
  onExitLesson 
}: StudioViewProps) {
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [lessonSeconds, setLessonSeconds] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [haloStatus, setHaloStatus] = useState<CoachHaloStatus>('ready');
  const [currentCoachSpeech, setCurrentCoachSpeech] = useState<string>('');
  const [lastUserSpeech, setLastUserSpeech] = useState<string>('');
  const [customVoiceInput, setCustomVoiceInput] = useState<string>('');
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const isRecordingAudioRef = useRef<boolean>(false);
  const [motionState, setMotionState] = useState<'idle' | 'moving' | 'settled'>('idle');
  const [activeVisionFeedback, setActiveVisionFeedback] = useState<{
    praisePoint: string;
    correctionPoint: string;
    alignmentScore: number;
    title: string;
  } | null>(null);
  const [conversations, setConversations] = useState<ConversationalExchange[]>([]);
  const [autoBurstsCount, setAutoBurstsCount] = useState(0);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState<boolean | null>(null);
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDeviceId, setSelectedAudioDeviceId] = useState<string>('');
  const [completedReport, setCompletedReport] = useState<SessionReport | null>(null);
  const [stepHoldCountdown, setStepHoldCountdown] = useState<number | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const latestSpeechTranscriptRef = useRef<string>('');
  
  // Motion Engine & Pacing Refs
  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPixelFrameRef = useRef<Uint8ClampedArray | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastCaptureTimeRef = useRef<number>(0);
  const settleStartTimeRef = useRef<number | null>(null);
  const isMovingRef = useRef<boolean>(false);
  const ambientNoiseFloorRef = useRef<number>(12);

  const lessonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const max10sStepTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStepIndexRef = useRef<number>(0);
  const isLessonActiveRef = useRef<boolean>(false);
  const isCoachSpeakingRef = useRef<boolean>(false);
  const hasInspectedCurrentStepRef = useRef<boolean>(false);

  const currentSteps = activeModule?.beginnerSteps || activeDiscipline.beginnerStepByStepPrep;

  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
    hasInspectedCurrentStepRef.current = false;
  }, [currentStepIndex]);

  useEffect(() => {
    isRecordingAudioRef.current = isRecordingAudio;
  }, [isRecordingAudio]);

  const formatCleanStepText = (rawText: string = ''): string => {
    return rawText
      .replace(/^Great form!?\s*/i, '')
      .replace(/^Step\s*\d+:\s*/i, '')
      .trim();
  };

  const getScoreColorBadge = (score: number) => {
    if (score < 7.0) {
      return 'bg-rose-50 text-rose-700 border-rose-300';
    } else if (score < 8.3) {
      return 'bg-[#E9D78E]/30 text-[#6B5A10] border-[#E9D78E]';
    } else {
      return 'bg-[#B5C99A]/30 text-[#42592B] border-[#B5C99A]';
    }
  };

  const handleTestVoicePlayback = () => {
    primeSpeechSynthesis();
    stopCoachSpeaking();
    setCurrentCoachSpeech(`Hello! Coach ${activeDiscipline.coachPersona.name} testing voice output.`);
    speakCoachFeedback(`Hello! This is Coach ${activeDiscipline.coachPersona.name} testing voice output.`);
  };

  const captureCameraFrameBase64 = (): string | null => {
    if (!videoRef.current) return null;
    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 360;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      console.warn('Could not capture canvas frame:', e);
      return null;
    }
  };

  const handleNextStep = useCallback(() => {
    if (max10sStepTimerRef.current) clearTimeout(max10sStepTimerRef.current);
    setStepHoldCountdown(null);

    const currIdx = currentStepIndexRef.current;
    if (currIdx < currentSteps.length - 1) {
      const nextIdx = currIdx + 1;
      setCurrentStepIndex(nextIdx);
      currentStepIndexRef.current = nextIdx;
      hasInspectedCurrentStepRef.current = false;

      const cleanText = formatCleanStepText(currentSteps[nextIdx]);
      const message = `Step ${nextIdx + 1}: ${cleanText}`;
      setCurrentCoachSpeech(message);
      speakCoachFeedback(message);
    } else {
      const message = `Full prep complete! Holding full drill execution!`;
      setCurrentCoachSpeech(message);
      speakCoachFeedback(message);
    }
  }, [currentSteps]);

  // Camera Inspection via Gemini 2.5 Flash Vision API
  const analyzeCameraFrameWithGeminiVision = async (userPromptText: string = '') => {
    if (hasInspectedCurrentStepRef.current) return;
    hasInspectedCurrentStepRef.current = true;

    const frameBase64 = captureCameraFrameBase64();
    const savedKey = typeof window !== 'undefined' ? localStorage.getItem('pocket_coach_gemini_key') || '' : '';

    try {
      setHaloStatus('burst_capturing');
      const res = await fetch('/api/gemini-vision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          frameBase64,
          disciplineId: activeDiscipline.id,
          skillLevel,
          userPrompt: userPromptText || `Step ${currentStepIndexRef.current + 1}: ${currentSteps[currentStepIndexRef.current]}`,
          apiKey: savedKey,
        }),
      });

      const data = await res.json();
      setActiveVisionFeedback({
        praisePoint: data.praisePoint,
        correctionPoint: data.correctionPoint,
        alignmentScore: data.alignmentScore,
        title: `Camera Analysis: ${activeDiscipline.name}`,
      });

      if (!isRecordingAudioRef.current) {
        const spokenFeedback = data.coachSpeech || `I see your posture on camera! Alignment verified.`;
        stopCoachSpeaking();
        setHaloStatus('coach_speaking');
        setCurrentCoachSpeech(spokenFeedback);

        isCoachSpeakingRef.current = true;
        await speakCoachFeedback(spokenFeedback);

        // 10-Second Posture Practice Hold Timer, then auto-advance
        let countdown = 10;
        setStepHoldCountdown(countdown);

        if (max10sStepTimerRef.current) clearInterval(max10sStepTimerRef.current);
        max10sStepTimerRef.current = setInterval(() => {
          countdown -= 1;
          setStepHoldCountdown(countdown);

          if (countdown <= 0) {
            if (max10sStepTimerRef.current) clearInterval(max10sStepTimerRef.current);
            setStepHoldCountdown(null);
            handleNextStep();
          }
        }, 1000);
      }
    } catch (err) {
      console.warn('Vision analysis error:', err);
    } finally {
      setHaloStatus('ready');
    }
  };

  // Adaptive Pixel-Delta Camera Motion & Settle Engine
  const runMotionDetectionLoop = useCallback(() => {
    if (!videoRef.current || !isLessonActiveRef.current) return;

    if (!motionCanvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      motionCanvasRef.current = canvas;
    }

    const canvas = motionCanvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (ctx && videoRef.current.readyState >= 2) {
      ctx.drawImage(videoRef.current, 0, 0, 64, 64);
      const frameData = ctx.getImageData(0, 0, 64, 64).data;

      if (prevPixelFrameRef.current) {
        let pixelDeltaSum = 0;
        const prevData = prevPixelFrameRef.current;

        for (let i = 0; i < frameData.length; i += 8) {
          const diffR = Math.abs(frameData[i] - prevData[i]);
          const diffG = Math.abs(frameData[i + 1] - prevData[i + 1]);
          const diffB = Math.abs(frameData[i + 2] - prevData[i + 2]);
          pixelDeltaSum += diffR + diffG + diffB;
        }

        const avgDelta = pixelDeltaSum / (frameData.length / 8);
        const now = Date.now();

        if (avgDelta > ambientNoiseFloorRef.current) {
          isMovingRef.current = true;
          settleStartTimeRef.current = null;
          setMotionState('moving');
        } else {
          if (isMovingRef.current) {
            if (!settleStartTimeRef.current) {
              settleStartTimeRef.current = now;
            } else if (now - settleStartTimeRef.current > 1200) {
              isMovingRef.current = false;
              setMotionState('settled');

              if (now - lastCaptureTimeRef.current > 4000) {
                lastCaptureTimeRef.current = now;
                analyzeCameraFrameWithGeminiVision();
              }
            }
          }
        }
      }
      prevPixelFrameRef.current = new Uint8ClampedArray(frameData);
    }

    if (isLessonActiveRef.current) {
      animFrameIdRef.current = requestAnimationFrame(runMotionDetectionLoop);
    }
  }, [activeDiscipline, skillLevel]);

  // Audio stream setup
  const startCameraStream = async (audioDeviceId?: string) => {
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' },
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
      });

      mediaStreamRef.current = stream;
      setActiveStream(stream);
      setCameraPermissionGranted(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.warn('Camera stream error:', err);
      setCameraPermissionGranted(false);
    }
  };

  useEffect(() => {
    startCameraStream();

    navigator.mediaDevices?.enumerateDevices().then((devices) => {
      const audioIns = devices.filter(d => d.kind === 'audioinput');
      setAudioDevices(audioIns);
      if (audioIns.length > 0) {
        setSelectedAudioDeviceId(audioIns[0].deviceId);
      }
    });

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
      if (max10sStepTimerRef.current) clearInterval(max10sStepTimerRef.current);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      stopCoachSpeaking();
    };
  }, []);

  // Timer loop
  useEffect(() => {
    if (isLessonActive) {
      lessonTimerRef.current = setInterval(() => {
        setLessonSeconds(prev => prev + 1);
      }, 1000);
      animFrameIdRef.current = requestAnimationFrame(runMotionDetectionLoop);
    } else {
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    }

    return () => {
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLessonActive, runMotionDetectionLoop]);

  // Voice recording & transcription
  const startAudioRecording = () => {
    if (!activeStream) return;
    try {
      stopCoachSpeaking();
      isCoachSpeakingRef.current = false;
      audioChunksRef.current = [];

      const recorder = new MediaRecorder(activeStream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = async () => {
        setIsRecordingAudio(false);
        isRecordingAudioRef.current = false;
        await transcribeAndHandleUserSpeech();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingAudio(true);
      isRecordingAudioRef.current = true;
      setHaloStatus('user_speaking');
    } catch (e) {
      console.warn('Could not start MediaRecorder:', e);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const transcribeAndHandleUserSpeech = async () => {
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    if (audioBlob.size < 500) {
      setHaloStatus('ready');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string)?.split(',')[1];
        if (!base64Audio) return;

        const savedKey = typeof window !== 'undefined' ? localStorage.getItem('pocket_coach_gemini_key') || '' : '';

        const res = await fetch('/api/gemini-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ audioBase64: base64Audio, apiKey: savedKey }),
        });

        const data = await res.json();
        if (data.transcript && data.transcript.trim()) {
          handleUserVoiceInput(data.transcript);
        } else if (latestSpeechTranscriptRef.current) {
          handleUserVoiceInput(latestSpeechTranscriptRef.current);
        } else {
          setHaloStatus('ready');
        }
      };
      reader.readAsDataURL(audioBlob);
    } catch (err) {
      console.warn('Audio transcription error:', err);
      setHaloStatus('ready');
    }
  };

  const handleUserVoiceInput = async (userInputText: string) => {
    if (!userInputText.trim()) return;

    setLastUserSpeech(userInputText);
    const userExchange: ConversationalExchange = {
      id: `ex-${Date.now()}`,
      speaker: 'user',
      text: userInputText,
      timestampSeconds: lessonSeconds,
    };
    setConversations(prev => [...prev, userExchange]);

    const { responseText, advanceStep } = generateCoachResponseToUserSpeech(
      userInputText,
      activeDiscipline,
      skillLevel,
      currentStepIndex
    );

    if (advanceStep && currentStepIndex < currentSteps.length - 1) {
      handleNextStep();
    }

    setHaloStatus('coach_speaking');
    setCurrentCoachSpeech(responseText);

    const coachExchange: ConversationalExchange = {
      id: `ex-coach-${Date.now()}`,
      speaker: 'coach',
      text: responseText,
      timestampSeconds: lessonSeconds,
    };
    setConversations(prev => [...prev, coachExchange]);

    isCoachSpeakingRef.current = true;
    await speakCoachFeedback(
      responseText,
      () => {
        setHaloStatus('coach_speaking');
        isCoachSpeakingRef.current = true;
      },
      () => {
        setHaloStatus('ready');
        isCoachSpeakingRef.current = false;
      }
    );
  };

  const startPrivateLesson = async () => {
    primeSpeechSynthesis();
    setIsLessonActive(true);
    isLessonActiveRef.current = true;
    setLessonSeconds(0);
    setCurrentStepIndex(0);
    currentStepIndexRef.current = 0;
    setAutoBurstsCount(0);
    setConversations([]);
    setHaloStatus('ready');

    const step1 = formatCleanStepText(currentSteps[0] || 'Place your feet in ready position.');
    const lessonTitle = activeModule ? activeModule.title : activeDiscipline.name;
    const welcome = `Welcome to live ${lessonTitle}! Step 1: ${step1} Move into pose—I will inspect your camera posture when you settle!`;

    setCurrentCoachSpeech(welcome);
    await speakCoachFeedback(welcome);
  };

  const endPrivateLesson = () => {
    if (max10sStepTimerRef.current) clearInterval(max10sStepTimerRef.current);
    stopCoachSpeaking();
    isCoachSpeakingRef.current = false;
    setIsLessonActive(false);
    isLessonActiveRef.current = false;

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
              {stepHoldCountdown !== null && (
                <span className="text-[11px] bg-[#B5C99A]/40 text-[#42592B] px-2 py-0.5 rounded-full font-bold">
                  ⏱️ Hold {stepHoldCountdown}s
                </span>
              )}
              <span>•</span>
              <span className="font-bold text-[#A4C2F4]">{formatTime(lessonSeconds)}</span>
            </div>
          )}

          <button
            onClick={handleTestVoicePlayback}
            className="bg-[#F7F3EE] hover:bg-white text-[#3E4348] text-xs font-bold px-3 py-1.5 rounded-2xl border border-[#E8E2D8] flex items-center gap-1.5 transition cursor-pointer"
            title="Test Voice Output"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#A4C2F4]" />
            <span className="hidden sm:inline">Voice Test</span>
          </button>

          {audioDevices.length > 0 && (
            <select
              value={selectedAudioDeviceId}
              onChange={(e) => {
                setSelectedAudioDeviceId(e.target.value);
                startCameraStream(e.target.value);
              }}
              disabled={isLessonActive}
              className="bg-[#F7F3EE] text-[#3E4348] text-xs font-semibold rounded-2xl px-2.5 py-1.5 border border-[#E8E2D8] focus:outline-none disabled:opacity-50"
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
            className="bg-[#F7F3EE] hover:bg-white text-[#3E4348] text-xs font-bold p-2 rounded-2xl border border-[#E8E2D8] flex items-center transition disabled:opacity-50 cursor-pointer shadow-xs"
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

        {/* Motion Settle Status Traffic Light Badge Overlay */}
        {isLessonActive && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <div className={`text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md flex items-center gap-1.5 shadow-sm border ${
              motionState === 'moving'
                ? 'bg-rose-50/95 text-rose-700 border-rose-300 animate-pulse'
                : motionState === 'settled'
                ? 'bg-emerald-50/95 text-emerald-800 border-emerald-300'
                : 'bg-amber-50/95 text-amber-800 border-amber-300'
            }`}>
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>
                {motionState === 'moving'
                  ? 'Positioning Body...'
                  : motionState === 'settled'
                  ? 'Pose Settled (Inspected)'
                  : 'Settle into Pose'}
              </span>
            </div>
          </div>
        )}

        {/* Halo Border Overlay */}
        <div className={`absolute inset-0 pointer-events-none rounded-3xl border-4 transition-all duration-300 ${
          haloStatus === 'user_speaking'
            ? 'border-[#E8A5A5] shadow-[inset_0_0_50px_rgba(232,165,165,0.45)]'
            : haloStatus === 'coach_speaking'
            ? 'border-[#A4C2F4] shadow-[inset_0_0_40px_rgba(164,194,244,0.45)]'
            : isLessonActive
            ? 'border-[#B5C99A]/70 shadow-[inset_0_0_30px_rgba(181,201,154,0.3)]'
            : 'border-white/10'
        }`} />

        {/* Soundwave & Interrupt Header */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <AudioWaveform
            stream={activeStream}
            isListening={isLessonActive}
            isCoachSpeaking={haloStatus === 'coach_speaking'}
            onVoiceActivity={() => {}}
          />

          {isLessonActive && (
            <button
              onClick={() => {
                stopCoachSpeaking();
                isCoachSpeakingRef.current = false;
                handleUserVoiceInput("Wait, hold on a second");
              }}
              className="bg-white/90 hover:bg-white text-rose-600 text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-xs flex items-center gap-1 border border-rose-200 cursor-pointer pointer-events-auto"
            >
              <VolumeX className="w-3.5 h-3.5" /> Pause Voice
            </button>
          )}
        </div>

        {/* Dynamic Gemini Vision Real Camera Inspection Card Overlay */}
        {isLessonActive && activeVisionFeedback && (
          <div className="absolute top-14 left-3 max-w-sm z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-[#A4C2F4] shadow-md space-y-2 animate-fade-in text-xs text-[#3E4348]">
            <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-1.5">
              <span className="font-bold text-[#E8A5A5] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Eye className="w-3.5 h-3.5 animate-pulse" /> Gemini Vision Inspection
              </span>
              <span className={`font-black text-xs px-2 py-0.5 rounded-full font-mono border ${getScoreColorBadge(activeVisionFeedback.alignmentScore)}`}>
                {activeVisionFeedback.alignmentScore} / 10
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-start gap-1.5 text-[#42592B]">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="text-[11px]">{activeVisionFeedback.praisePoint}</span>
              </div>
              <div className="flex items-start gap-1.5 text-[#9E3E3E]">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span className="text-[11px]">{activeVisionFeedback.correctionPoint}</span>
              </div>
            </div>
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

      {/* Voice Prompt & Interaction Controls */}
      {isLessonActive && (
        <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] space-y-2 shadow-xs">
          <div className="flex items-center gap-2">
            <button
              onMouseDown={startAudioRecording}
              onMouseUp={stopAudioRecording}
              onTouchStart={startAudioRecording}
              onTouchEnd={stopAudioRecording}
              className={`flex-1 font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-xs ${
                isRecordingAudio
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348]'
              }`}
            >
              <Mic className="w-4 h-4" />
              {isRecordingAudio ? 'Recording... Release to Ask' : 'Hold to Speak / Ask Coach'}
            </button>

            <button
              onClick={handleNextStep}
              className="bg-[#F7F3EE] hover:bg-white text-[#3E4348] text-xs font-bold py-2.5 px-3.5 rounded-xl border border-[#E8E2D8] flex items-center gap-1 shrink-0 cursor-pointer"
            >
              Next Step <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Voice Shortcuts */}
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#E8E2D8]">
            <button
              onClick={() => handleUserVoiceInput("Inspect my posture on camera")}
              className="bg-[#FAF9F6] hover:bg-white text-[#3E4348] text-xs py-1 px-2.5 rounded-lg border border-[#E8E2D8] flex items-center gap-1 transition cursor-pointer"
            >
              <ScanLine className="w-3 h-3 text-[#A4C2F4]" /> &quot;Inspect posture&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("What pose is this?")}
              className="bg-[#FAF9F6] hover:bg-white text-[#3E4348] text-xs py-1 px-2.5 rounded-lg border border-[#E8E2D8] flex items-center gap-1 transition cursor-pointer"
            >
              <HelpCircle className="w-3 h-3 text-[#E9D78E]" /> &quot;What pose is this?&quot;
            </button>

            <button
              onClick={handleNextStep}
              className="bg-[#FAF9F6] hover:bg-white text-[#3E4348] text-xs font-bold py-1 px-2.5 rounded-lg border border-[#E8E2D8] flex items-center gap-1 transition cursor-pointer"
            >
              <CheckCircle2 className="w-3 h-3 text-[#B5C99A]" /> &quot;Ready for next step&quot;
            </button>
          </div>
        </div>
      )}

      {/* Main Action Trigger */}
      <div>
        {!isLessonActive ? (
          <button
            onClick={startPrivateLesson}
            className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm sm:text-base py-3.5 px-6 rounded-2xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer transform active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" /> Start Practice Session
          </button>
        ) : (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[#42592B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B5C99A] animate-ping" />
              Live Camera & Audio Inspection Active
            </span>

            <button
              onClick={endPrivateLesson}
              className="bg-[#E8A5A5] hover:bg-[#df9090] text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-2xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
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
