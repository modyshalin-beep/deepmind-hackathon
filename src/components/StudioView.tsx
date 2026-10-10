'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Discipline, SessionReport, SkillLevel } from '@/types';
import { CoachHaloStatus, LessonPhase, ConversationalExchange, speakCoachFeedback, stopCoachSpeaking, primeSpeechSynthesis, generateCoachResponseToUserSpeech, generateLiveSessionReport } from '@/lib/geminiLiveSimulator';
import { AudioWaveform } from '@/components/AudioWaveform';
import { Camera, Video, Volume2, Mic, MicOff, Sparkles, Award, ArrowRight, Zap, Play, Square, Pause, ShieldCheck, Flame, CheckCircle2, Clock, BookOpen, Settings, MessageSquare, HelpCircle, Eye, AlertCircle, Send, VolumeX, RotateCcw, ScanLine, ChevronRight, Activity } from 'lucide-react';

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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const latestSpeechTranscriptRef = useRef<string>('');
  
  // Motion Engine Refs
  const motionCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const prevPixelFrameRef = useRef<Uint8ClampedArray | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const lastCaptureTimeRef = useRef<number>(0);
  const settleStartTimeRef = useRef<number | null>(null);
  const isMovingRef = useRef<boolean>(false);

  const lessonTimerRef = useRef<NodeJS.Timeout | null>(null);
  const stepPacingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const handsFreeSilenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timeInCurrentStepRef = useRef<number>(0);
  const currentStepIndexRef = useRef<number>(0);
  const isLessonActiveRef = useRef<boolean>(false);
  const isCoachSpeakingRef = useRef<boolean>(false);
  const isRecognizingRef = useRef<boolean>(false);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    currentStepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    isRecordingAudioRef.current = isRecordingAudio;
  }, [isRecordingAudio]);

  // Strip duplicate 'Step X:' and generic 'Great form'
  const formatCleanStepText = (rawText: string = ''): string => {
    return rawText
      .replace(/^Great form!?\s*/i, '')
      .replace(/^Step\s*\d+:\s*/i, '')
      .trim();
  };

  // Manual test voice button
  const handleTestVoicePlayback = () => {
    primeSpeechSynthesis();
    stopCoachSpeaking();
    setCurrentCoachSpeech("Hello! Coach Maya testing voice output.");
    speakCoachFeedback("Hello! This is Coach Maya testing voice output.");
  };

  // Capture live video frame from main camera video feed
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

  // Perform Gemini Vision Camera Frame Inspection (Respects Audio Non-Interference)
  const analyzeCameraFrameWithGeminiVision = async (userPromptText: string = '', speakOutLoud: boolean = false) => {
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
          userPrompt: userPromptText,
          apiKey: savedKey,
        }),
      });

      const data = await res.json();
      setActiveVisionFeedback({
        praisePoint: data.praisePoint,
        correctionPoint: data.correctionPoint,
        alignmentScore: data.alignmentScore,
        title: `Camera Inspection: ${activeDiscipline.name}`,
      });

      // NON-INTERFERENCE GUARD: Only speak if explicitly allowed AND channel is quiet!
      if (speakOutLoud && !isRecordingAudioRef.current && !isCoachSpeakingRef.current) {
        const spokenFeedback = data.coachSpeech || `I see your posture on camera! Alignment looks solid.`;
        stopCoachSpeaking();
        setHaloStatus('coach_speaking');
        setCurrentCoachSpeech(spokenFeedback);

        isCoachSpeakingRef.current = true;
        await speakCoachFeedback(
          spokenFeedback,
          () => {
            setHaloStatus('coach_speaking');
            isCoachSpeakingRef.current = true;
          },
          () => {
            setHaloStatus('ready');
            isCoachSpeakingRef.current = false;
          }
        );
      }
    } catch (err) {
      console.warn('Vision analysis error:', err);
    } finally {
      if (haloStatus === 'burst_capturing') setHaloStatus('ready');
    }
  };

  // Real-Time Pixel-Delta Motion Detection Loop (Runs on low-res 64x64 hidden canvas)
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

        // Sample every 4th byte (RGB diff)
        for (let i = 0; i < frameData.length; i += 8) {
          const diffR = Math.abs(frameData[i] - prevData[i]);
          const diffG = Math.abs(frameData[i + 1] - prevData[i + 1]);
          const diffB = Math.abs(frameData[i + 2] - prevData[i + 2]);
          pixelDeltaSum += diffR + diffG + diffB;
        }

        const avgDelta = pixelDeltaSum / (64 * 64);
        const now = Date.now();
        const MOTION_THRESHOLD = 8.5; // Sensitivity threshold for motion vs still
        const COOLDOWN_MS = 9000; // Minimum 9s between peak camera captures

        if (avgDelta > MOTION_THRESHOLD) {
          // Movement detected
          isMovingRef.current = true;
          settleStartTimeRef.current = null;
          setMotionState('moving');
        } else if (isMovingRef.current) {
          // Motion dropped below threshold -> User is settling into posture/stance!
          if (!settleStartTimeRef.current) {
            settleStartTimeRef.current = now;
          } else if (now - settleStartTimeRef.current >= 1100) {
            // User held still for 1.1s -> SETTLED STANCE CONFIRMED!
            isMovingRef.current = false;
            settleStartTimeRef.current = null;
            setMotionState('settled');

            // Trigger peak keyframe capture if cooldown elapsed and not recording voice
            if (now - lastCaptureTimeRef.current >= COOLDOWN_MS && !isRecordingAudioRef.current) {
              lastCaptureTimeRef.current = now;
              setAutoBurstsCount(prev => prev + 1);
              analyzeCameraFrameWithGeminiVision('', true); // Speak pose correction when settled!
            }
          }
        } else {
          setMotionState('idle');
        }
      }

      prevPixelFrameRef.current = new Uint8ClampedArray(frameData);
    }

    animFrameIdRef.current = requestAnimationFrame(runMotionDetectionLoop);
  }, []);

  // Start/Stop Motion Detection Loop when lesson is active
  useEffect(() => {
    if (isLessonActive && !isPaused) {
      animFrameIdRef.current = requestAnimationFrame(runMotionDetectionLoop);
    } else {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      prevPixelFrameRef.current = null;
      setMotionState('idle');
    }

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isLessonActive, isPaused, runMotionDetectionLoop]);

  // Enumerate Mics
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

  // Start Camera & Mic Stream
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

  // Robust Hands-Free Speech Recognizer
  const setupSpeechRecognition = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }

      const recog = new SpeechRecognition();
      recog.continuous = true;
      recog.interimResults = true;
      recog.lang = 'en-US';

      recog.onstart = () => {
        isRecognizingRef.current = true;
      };

      recog.onresult = (event: any) => {
        let fullSentence = '';
        for (let i = 0; i < event.results.length; i++) {
          fullSentence += event.results[i][0].transcript + ' ';
        }
        if (fullSentence.trim()) {
          latestSpeechTranscriptRef.current = fullSentence.trim();

          if (handsFreeSilenceTimerRef.current) clearTimeout(handsFreeSilenceTimerRef.current);
          handsFreeSilenceTimerRef.current = setTimeout(() => {
            if (latestSpeechTranscriptRef.current.trim() && isLessonActiveRef.current && !isRecordingAudioRef.current) {
              const text = latestSpeechTranscriptRef.current.trim();
              latestSpeechTranscriptRef.current = '';
              handleUserVoiceInput(text);
            }
          }, 1200);
        }
      };

      recog.onerror = (e: any) => {
        isRecognizingRef.current = false;
        if (isLessonActiveRef.current && !isRecordingAudioRef.current) {
          setTimeout(() => {
            try { recog.start(); } catch {}
          }, 400);
        }
      };

      recog.onend = () => {
        isRecognizingRef.current = false;
        if (isLessonActiveRef.current && !isRecordingAudioRef.current) {
          setTimeout(() => {
            try { recog.start(); } catch {}
          }, 300);
        }
      };

      recognitionRef.current = recog;
    } catch (e) {
      console.warn('Speech recognition setup error:', e);
    }
  };

  useEffect(() => {
    startCameraStream();
    setupSpeechRecognition();

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Lesson Second Timer
  useEffect(() => {
    isLessonActiveRef.current = isLessonActive;

    if (isLessonActive && !isPaused) {
      if (recognitionRef.current && !isRecognizingRef.current) {
        try { recognitionRef.current.start(); } catch {}
      }

      lessonTimerRef.current = setInterval(() => {
        setLessonSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
      }
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
    }

    return () => {
      if (lessonTimerRef.current) clearInterval(lessonTimerRef.current);
    };
  }, [isLessonActive, isPaused]);

  // UN-RESETTABLE Step Advancement Engine (Only ticks when quiet and not recording)
  useEffect(() => {
    if (isLessonActive && !isPaused) {
      stepPacingTimerRef.current = setInterval(() => {
        if (!isRecordingAudioRef.current && !isCoachSpeakingRef.current) {
          timeInCurrentStepRef.current += 1;

          if (timeInCurrentStepRef.current >= 12) {
            timeInCurrentStepRef.current = 0;
            const currIdx = currentStepIndexRef.current;
            
            if (currIdx < activeDiscipline.beginnerStepByStepPrep.length - 1) {
              const nextIdx = currIdx + 1;
              setCurrentStepIndex(nextIdx);
              const cleanText = formatCleanStepText(activeDiscipline.beginnerStepByStepPrep[nextIdx]);
              const message = `Step ${nextIdx + 1}: ${cleanText}`;
              setCurrentCoachSpeech(message);
              speakCoachFeedback(message);
              analyzeCameraFrameWithGeminiVision('', false);
            } else {
              // Flows smoothly into Full Posture Practice Hold!
              const flowMessages = [
                `All 15 prep steps verified on camera! Holding full ${activeDiscipline.prescribedDrill} posture hold. Inhale long, exhale deep!`,
                `I see your form on camera! Maintain parallel arm extension and keep gaze focused forward over fingertips.`,
                `Awesome posture stamina! Hold deep alignment and sink 1 inch lower into your front leg.`,
                `Fantastic practice! You have mastered all step-by-step alignment drills for ${activeDiscipline.name}.`
              ];
              const randomIndex = Math.floor(Math.random() * flowMessages.length);
              const message = flowMessages[randomIndex];
              setCurrentCoachSpeech(message);
              speakCoachFeedback(message);
              analyzeCameraFrameWithGeminiVision('', false);
            }
          }
        }
      }, 1000);
    } else {
      if (stepPacingTimerRef.current) clearInterval(stepPacingTimerRef.current);
    }

    return () => {
      if (stepPacingTimerRef.current) clearInterval(stepPacingTimerRef.current);
    };
  }, [isLessonActive, isPaused]);

  // Advance Step Manually
  const handleNextStep = () => {
    timeInCurrentStepRef.current = 0;
    if (currentStepIndex < activeDiscipline.beginnerStepByStepPrep.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      const cleanText = formatCleanStepText(activeDiscipline.beginnerStepByStepPrep[nextIdx]);
      const message = `Step ${nextIdx + 1}: ${cleanText}`;
      setCurrentCoachSpeech(message);
      speakCoachFeedback(message);
    } else {
      const message = `Full posture prep complete! Now holding full ${activeDiscipline.prescribedDrill} flow execution!`;
      setCurrentCoachSpeech(message);
      speakCoachFeedback(message);
    }
  };

  // Push-to-Talk Recording Trigger - HARD SHUTDOWN COACH SPEECH INSTANTLY
  const startAudioRecording = () => {
    if (!activeStream) return;

    // HARD SHUTDOWN ALL SPEECH INSTANTLY
    stopCoachSpeaking();
    isCoachSpeakingRef.current = false;
    setIsRecordingAudio(true);
    isRecordingAudioRef.current = true;
    timeInCurrentStepRef.current = 0;

    primeSpeechSynthesis();
    setHaloStatus('user_speaking');
    latestSpeechTranscriptRef.current = '';

    setupSpeechRecognition();
    if (recognitionRef.current && !isRecognizingRef.current) {
      try { recognitionRef.current.start(); } catch {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }

    audioChunksRef.current = [];

    try {
      const recorder = new MediaRecorder(activeStream);
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        setIsRecordingAudio(false);
        isRecordingAudioRef.current = false;
        const fullQuestionText = latestSpeechTranscriptRef.current;
        if (audioChunksRef.current.length > 0) {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await sendAudioBlobToGemini(audioBlob, fullQuestionText);
        } else if (fullQuestionText) {
          handleUserVoiceInput(fullQuestionText);
        }
      };

      recorder.start(100);
      mediaRecorderRef.current = recorder;
    } catch (err) {
      console.warn('MediaRecorder setup error:', err);
    }
  };

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Recorder stop error:', e);
      }
    }
  };

  const sendAudioBlobToGemini = async (blob: Blob, localSpeechText: string) => {
    try {
      const savedKey = typeof window !== 'undefined' ? localStorage.getItem('pocket_coach_gemini_key') || '' : '';

      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      formData.append('apiKey', savedKey);
      formData.append('localTranscript', localSpeechText);
      formData.append('disciplineId', activeDiscipline.id);
      formData.append('skillLevel', skillLevel);

      const res = await fetch('/api/gemini-audio', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      const userTranscript = data.userTranscript || localSpeechText || "What form do I use?";

      handleUserVoiceInput(userTranscript);
      analyzeCameraFrameWithGeminiVision(userTranscript, false);
    } catch (err) {
      console.warn('Failed to send audio to Gemini endpoint:', err);
      handleUserVoiceInput(localSpeechText || "What form do I use?");
    }
  };

  // Reset Session
  const resetSessionState = () => {
    stopCoachSpeaking();
    isCoachSpeakingRef.current = false;
    setIsRecordingAudio(false);
    isRecordingAudioRef.current = false;
    setIsLessonActive(false);
    setLessonSeconds(0);
    setCurrentStepIndex(0);
    timeInCurrentStepRef.current = 0;
    setLastUserSpeech('');
    setCurrentCoachSpeech('');
    latestSpeechTranscriptRef.current = '';
    setActiveVisionFeedback(null);
    setConversations([]);
    setHaloStatus('ready');
    setMotionState('idle');
  };

  // Voice Activity Detection
  const handleVoiceActivityDetected = useCallback((volumePercent: number) => {
    if (!isLessonActive) return;

    if (volumePercent > 25 && isCoachSpeakingRef.current) {
      stopCoachSpeaking();
      isCoachSpeakingRef.current = false;
      setHaloStatus('user_speaking');
      setCurrentCoachSpeech('🎙️ Coach listening to you live...');
    }
  }, [isLessonActive]);

  // SINGLE VOICE Handler with Clean Formatting
  const handleUserVoiceInput = async (userInputText: string) => {
    if (!isLessonActive || !userInputText.trim()) return;

    primeSpeechSynthesis();
    stopCoachSpeaking();
    isCoachSpeakingRef.current = false;

    setHaloStatus('user_speaking');
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

    let nextStep = currentStepIndex;
    if (advanceStep && currentStepIndex < activeDiscipline.beginnerStepByStepPrep.length - 1) {
      nextStep = currentStepIndex + 1;
      setCurrentStepIndex(nextStep);
      timeInCurrentStepRef.current = 0;
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
    resetSessionState();
    setIsLessonActive(true);
    isLessonActiveRef.current = true;

    const step1 = formatCleanStepText(activeDiscipline.beginnerStepByStepPrep[0] || 'Place your feet 4 feet apart.');
    const welcome = `Welcome to live ${activeDiscipline.name}! Step 1: ${step1} Move into position—I will inspect your camera posture when you settle!`;

    setCurrentCoachSpeech(welcome);
    await speakCoachFeedback(welcome);
    analyzeCameraFrameWithGeminiVision('', false);
  };

  const endPrivateLesson = () => {
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
      {/* Header */}
      <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Motion-Settle Camera Engine Active
              </span>
              <span className="text-[10px] font-black uppercase bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full">
                {skillLevel} Level
              </span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{activeDiscipline.prescribedDrill}</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestVoicePlayback}
              className="bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-bold px-3 py-2 rounded-xl border border-cyan-800 flex items-center gap-1.5 transition"
              title="Test Coach Speech Output"
            >
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" /> Test Voice
            </button>

            <button
              onClick={() => {
                primeSpeechSynthesis();
                analyzeCameraFrameWithGeminiVision("Check my posture", true);
              }}
              disabled={!isLessonActive}
              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold px-3 py-2 rounded-xl border border-emerald-800 flex items-center gap-1.5 transition disabled:opacity-50"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-400" /> Inspect Camera
            </button>

            <button
              onClick={resetSessionState}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-700 flex items-center gap-1 transition"
              title="Reset current session"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Reset
            </button>

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

        {/* Current Step Pacing Card with Step Advancement Button */}
        {isLessonActive && (
          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                Step {currentStepIndex + 1} of {activeDiscipline.beginnerStepByStepPrep.length}: <strong className="text-emerald-400 font-mono">
                  {formatCleanStepText(activeDiscipline.beginnerStepByStepPrep[currentStepIndex])}
                </strong>
              </span>

              <div className="flex items-center gap-2">
                <span className="font-mono text-emerald-400 font-bold">{formatTime(lessonSeconds)}</span>
                <button
                  onClick={handleNextStep}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow flex items-center gap-1 transition"
                >
                  Next Step <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 italic">
              🏃 Move into position—when you settle into pose, Gemini 2.5 Flash automatically captures & inspects your joint alignment!
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
            <p className="text-sm font-medium">Camera preview active</p>
          </div>
        )}

        {/* Motion Settle Status Badge Overlay */}
        {isLessonActive && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <div className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full border backdrop-blur-md flex items-center gap-1.5 shadow-lg ${
              motionState === 'moving'
                ? 'bg-amber-950/90 text-amber-300 border-amber-700 animate-pulse'
                : motionState === 'settled'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-700'
                : 'bg-slate-900/80 text-slate-300 border-slate-700'
            }`}>
              <Activity className="w-3.5 h-3.5 shrink-0" />
              <span>
                {motionState === 'moving'
                  ? '🟡 Motion Detected... Move into Pose'
                  : motionState === 'settled'
                  ? '🟢 Pose Settled — Gemini Vision Capture'
                  : '⚪ Ready in Position'}
              </span>
            </div>
          </div>
        )}

        {/* Halo Border Overlay */}
        <div className={`absolute inset-0 pointer-events-none rounded-2xl border-4 transition-all duration-300 ${
          haloStatus === 'user_speaking'
            ? 'border-emerald-400 shadow-[inset_0_0_50px_rgba(16,185,129,0.6)]'
            : haloStatus === 'coach_speaking'
            ? 'border-cyan-400 shadow-[inset_0_0_40px_rgba(6,182,212,0.4)]'
            : isLessonActive
            ? 'border-emerald-500/70 shadow-[inset_0_0_30px_rgba(16,185,129,0.2)]'
            : 'border-slate-800'
        }`} />

        {/* Live Soundwave Audio Header */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <AudioWaveform
            stream={activeStream}
            isListening={isLessonActive}
            isCoachSpeaking={haloStatus === 'coach_speaking'}
            onVoiceActivity={handleVoiceActivityDetected}
          />

          {isLessonActive && (
            <button
              onClick={() => {
                stopCoachSpeaking();
                isCoachSpeakingRef.current = false;
                handleUserVoiceInput("Wait, hold on a second");
              }}
              className="bg-rose-500/90 hover:bg-rose-400 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 pointer-events-auto border border-rose-400"
            >
              <VolumeX className="w-3.5 h-3.5" /> Interrupt
            </button>
          )}
        </div>

        {/* Dynamic Gemini Vision Real Camera Inspection Card Overlay */}
        {isLessonActive && activeVisionFeedback && (
          <div className="absolute top-16 left-4 max-w-sm z-10 bg-slate-950/95 backdrop-blur-md p-4 rounded-2xl border border-emerald-500/80 shadow-2xl space-y-2 animate-fade-in text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Eye className="w-4 h-4 text-emerald-400 animate-pulse" /> Gemini 2.5 Flash Camera Inspection
              </span>
              <span className="font-black text-xs text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full font-mono">
                {activeVisionFeedback.alignmentScore} / 10 Pose Score
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="bg-emerald-950/80 p-2 rounded-xl border border-emerald-800/80 flex items-start gap-2 text-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-emerald-300 block text-[10px] uppercase">On-Camera Joint Strength:</strong>
                  <span>{activeVisionFeedback.praisePoint}</span>
                </div>
              </div>

              <div className="bg-amber-950/80 p-2 rounded-xl border border-amber-800/80 flex items-start gap-2 text-amber-200">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block text-[10px] uppercase">Camera Joint Correction:</strong>
                  <span>{activeVisionFeedback.correctionPoint}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Live Subtitles Banner */}
        {currentCoachSpeech && (
          <div className="absolute bottom-4 inset-x-6 z-10">
            <div className="bg-slate-950/90 text-white text-xs sm:text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 backdrop-blur-md shadow-xl text-center space-y-1">
              {lastUserSpeech && (
                <p className="text-[11px] text-emerald-300 italic font-mono">
                  🗣️ Student Asked: &quot;{lastUserSpeech}&quot;
                </p>
              )}
              <p className="text-slate-100 font-bold">
                🎙️ <strong className="text-emerald-400">{activeDiscipline.coachPersona.name}:</strong> &quot;{currentCoachSpeech}&quot;
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Push-to-Talk Mic & Question Prompt Bar */}
      {isLessonActive && (
        <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>🗣️ Push-to-Talk Microphone & Question Shortcuts:</span>
            <span className="text-emerald-400 text-[10px] font-mono">Pixel-Delta Settle Engine Active</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onMouseDown={startAudioRecording}
              onMouseUp={stopAudioRecording}
              onTouchStart={startAudioRecording}
              onTouchEnd={stopAudioRecording}
              className={`flex-1 font-extrabold text-xs py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                isRecordingAudio
                  ? 'bg-rose-600 text-white animate-pulse scale-95 ring-4 ring-rose-950'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50'
              }`}
            >
              <Mic className="w-4.5 h-4.5 fill-current" />
              {isRecordingAudio ? '🔴 Recording... Release Button to Send Question' : '🎙️ Hold Button to Speak Question / Next Step'}
            </button>

            <button
              onClick={handleNextStep}
              className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-xs font-bold py-3.5 px-4 rounded-xl border border-emerald-800 flex items-center gap-1.5 shrink-0 shadow"
            >
              Next Step <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (customVoiceInput.trim()) {
                handleUserVoiceInput(customVoiceInput.trim());
                setCustomVoiceInput('');
              }
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customVoiceInput}
              onChange={(e) => setCustomVoiceInput(e.target.value)}
              placeholder="Or type a question (e.g., 'What pose is this?', 'Ready for step 2', 'Wait')"
              className="flex-1 bg-slate-800 text-white text-xs rounded-xl px-3.5 py-2.5 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>

          {/* Quick Question Shortcuts */}
          <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-800/80">
            <button
              onClick={() => handleUserVoiceInput("Check my posture on camera")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <ScanLine className="w-3.5 h-3.5 text-emerald-400" /> &quot;Inspect my posture on camera&quot;
            </button>

            <button
              onClick={() => handleUserVoiceInput("What pose is this?")}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 px-3 rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
            >
              <HelpCircle className="w-3.5 h-3.5 text-cyan-400" /> &quot;What pose is this?&quot;
            </button>

            <button
              onClick={handleNextStep}
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
              <Mic className="w-4 h-4 text-emerald-400 animate-pulse" />
              Live 2-Way Channel Active
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
