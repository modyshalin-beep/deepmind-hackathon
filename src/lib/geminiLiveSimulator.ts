import { Discipline, SessionReport, VideoClip, SkillLevel } from '@/types';

export type CoachHaloStatus = 'ready' | 'burst_capturing' | 'coach_speaking' | 'user_speaking' | 'framing_alert';

export type LessonPhase = 'warmup' | 'core_drills' | 'fatigue_push' | 'debrief';

export interface ConversationalExchange {
  id: string;
  speaker: 'coach' | 'user';
  text: string;
  timestampSeconds: number;
}

let globalAudioContext: AudioContext | null = null;
let currentSourceNode: AudioBufferSourceNode | null = null;
let activeAudioElement: HTMLAudioElement | null = null;
let latestSpeechId = 0; // Monotonic speech sequence guard

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!globalAudioContext) {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      globalAudioContext = new AudioCtx();
    }
  }
  if (globalAudioContext && globalAudioContext.state === 'suspended') {
    globalAudioContext.resume().catch(() => {});
  }
  return globalAudioContext;
}

export function primeSpeechSynthesis(): void {
  getAudioContext();
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.resume();
    } catch (e) {}
  }
}

// HARD STOP ANY PLAYING AUDIO INSTANTLY (100% Guaranteed Single Sentence)
export function stopCoachSpeaking(): void {
  latestSpeechId = Date.now(); // Invalidate any older pending speech promises!

  // Terminate Web Audio Source Node
  if (currentSourceNode) {
    try {
      currentSourceNode.stop(0);
      currentSourceNode.disconnect();
    } catch (e) {}
    currentSourceNode = null;
  }

  // Terminate HTML5 Audio Element
  if (activeAudioElement) {
    try {
      activeAudioElement.pause();
      activeAudioElement.currentTime = 0;
    } catch (e) {}
    activeAudioElement = null;
  }

  // Terminate SpeechSynthesis
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {}
  }
}

// Latest-Only Speech Engine (Discards any older queued sentences!)
export async function speakCoachFeedback(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
  if (typeof window === 'undefined' || !text.trim()) {
    if (onEnd) onEnd();
    return;
  }

  // 1. Assign unique monotonic speech ID for this call
  const thisSpeechId = Date.now() + Math.random();
  latestSpeechId = thisSpeechId;

  // 2. Hard stop any previous audio playing
  stopCoachSpeaking();
  latestSpeechId = thisSpeechId; // Restore current ID as active

  const ctx = getAudioContext();

  if (ctx) {
    try {
      const cleanText = text.slice(0, 160);
      const ttsUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
      
      const response = await fetch(ttsUrl);
      
      // Guard: Discard if a newer speech request came in while fetching!
      if (latestSpeechId !== thisSpeechId) {
        if (onEnd) onEnd();
        return;
      }

      const arrayBuffer = await response.arrayBuffer();

      if (latestSpeechId !== thisSpeechId) {
        if (onEnd) onEnd();
        return;
      }

      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      if (latestSpeechId !== thisSpeechId) {
        if (onEnd) onEnd();
        return;
      }

      // Hard stop again right before connecting to audio context destination
      if (currentSourceNode) {
        try { currentSourceNode.stop(0); currentSourceNode.disconnect(); } catch (e) {}
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      currentSourceNode = source;

      if (onStart) onStart();

      return new Promise<void>((resolve) => {
        let isDone = false;
        const finish = () => {
          if (!isDone) {
            isDone = true;
            currentSourceNode = null;
            if (onEnd) onEnd();
            resolve();
          }
        };

        source.onended = finish;
        source.start(0);

        // Safety timeout (4.5s)
        setTimeout(finish, 4500);
      });
    } catch (err: any) {
      console.warn('Server TTS proxy decode error:', err);
    }
  }

  // SpeechSynthesis Fallback
  if ('speechSynthesis' in window && latestSpeechId === thisSpeechId) {
    try {
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;

      await new Promise<void>((resolve) => {
        let isDone = false;
        const finish = () => {
          if (!isDone) {
            isDone = true;
            if (onEnd) onEnd();
            resolve();
          }
        };

        utterance.onstart = () => { if (onStart) onStart(); };
        utterance.onend = finish;
        utterance.onerror = finish;

        window.speechSynthesis.speak(utterance);
        setTimeout(finish, 4000);
      });

      return;
    } catch (e) {}
  }

  if (onEnd) onEnd();
}

export function generateCoachResponseToUserSpeech(
  userInput: string,
  discipline: Discipline,
  skillLevel: SkillLevel,
  currentStepIndex: number
): { responseText: string; advanceStep: boolean } {
  const textLower = userInput.toLowerCase();

  // 1. Explicit Step Advancement ONLY on explicit phrase ("next step", "ready for step", "advance step")
  if (textLower.includes('next step') || textLower.includes('advance step') || textLower.includes('move on to step')) {
    const nextStepNum = Math.min(discipline.beginnerStepByStepPrep.length, currentStepIndex + 2);
    const nextStepText = discipline.beginnerStepByStepPrep[currentStepIndex + 1] || 'Hold posture steady and breathe deeply.';
    return {
      responseText: `Moving to Step ${nextStepNum}: ${nextStepText}`,
      advanceStep: true,
    };
  }

  // 2. Other Sports / Discipline Questions
  if (textLower.includes('pilates') || textLower.includes('tennis') || textLower.includes('golf') || textLower.includes('cooking') || textLower.includes('other sport')) {
    return {
      responseText: `Yes! I coach Yoga, Tennis, Golf, Cooking, and Pilates. You can switch anytime using the Sport button in the header.`,
      advanceStep: false,
    };
  }

  // 3. Pose / Drill Name Questions
  if (textLower.includes('name') || textLower.includes('what pose') || textLower.includes('which pose') || textLower.includes('what drill') || textLower.includes('what are we doing') || textLower.includes('what is this')) {
    const currentStepText = discipline.beginnerStepByStepPrep[currentStepIndex] || 'Setup posture and balance.';
    return {
      responseText: `We are practicing ${discipline.name}, specifically ${discipline.prescribedDrill}! Step ${currentStepIndex + 1}: ${currentStepText}`,
      advanceStep: false,
    };
  }

  // 4. Back / Spine / Head / Alignment Questions
  if (textLower.includes('back') || textLower.includes('spine') || textLower.includes('head') || textLower.includes('neck') || textLower.includes('torso') || textLower.includes('align') || textLower.includes('straight') || textLower.includes('posture')) {
    return {
      responseText: `Keep your spine long and tall! Stack shoulders directly over hips, gaze forward, and keep neck relaxed.`,
      advanceStep: false,
    };
  }

  // 5. Breathing / Stamina / Hold Time Questions
  if (textLower.includes('breath') || textLower.includes('breathe') || textLower.includes('hold') || textLower.includes('time') || textLower.includes('long') || textLower.includes('tired') || textLower.includes('burn')) {
    return {
      responseText: `Take deep, even belly breaths! Inhale to lengthen your spine, exhale to sink deep and anchor your stance.`,
      advanceStep: false,
    };
  }

  // 6. Arm / Hand Placement Questions
  if (textLower.includes('arm') || textLower.includes('hand') || textLower.includes('wrist') || textLower.includes('finger') || textLower.includes('grip')) {
    if (discipline.id === 'yoga') {
      return {
        responseText: `Extend both arms parallel to the floor, reaching through fingertips and relaxing shoulders down away from ears.`,
        advanceStep: false,
      };
    } else {
      return {
        responseText: `Keep lead arm extended smoothly and maintain a steady grip.`,
        advanceStep: false,
      };
    }
  }

  // 7. Leg / Knee / Stance / Feet Questions
  if (textLower.includes('leg') || textLower.includes('knee') || textLower.includes('foot') || textLower.includes('feet') || textLower.includes('stance') || textLower.includes('form') || textLower.includes('pose')) {
    if (discipline.id === 'yoga') {
      return {
        responseText: `For Warrior II, place feet 4 feet apart, turn front foot 90 degrees, and bend knee directly over ankle.`,
        advanceStep: false,
      };
    } else {
      return {
        responseText: `Keep feet shoulder-width apart and knees slightly flexed.`,
        advanceStep: false,
      };
    }
  }

  // 8. Pause / Wait Requests
  if (textLower.includes('wait') || textLower.includes('hold on') || textLower.includes('slow down') || textLower.includes('pause') || textLower.includes('stop')) {
    return {
      responseText: "Pausing drill! Take a breath, get comfortable in position, and let me know when you're set.",
      advanceStep: false,
    };
  }

  // 9. Universal Question Acknowledgment Fallback
  return {
    responseText: `I heard your question! For ${discipline.prescribedDrill}, maintain steady balance, lengthen your spine, and breathe deeply.`,
    advanceStep: false,
  };
}

export function generateLiveSessionReport(
  discipline: Discipline,
  durationMinutes: number,
  burstsCount: number,
  exchangesCount: number,
  capturedVideoBlobUrl?: string
): SessionReport {
  const dateStr = new Date().toISOString();
  const newScore = Math.min(9.9, Math.round((discipline.overallScore + 0.5) * 10) / 10);

  const modelRepClip: VideoClip = {
    id: `clip-lesson-model-${Date.now()}`,
    title: `Interactive Lesson Model Rep - ${discipline.name}`,
    disciplineId: discipline.id,
    createdAt: dateStr,
    durationSeconds: 5.2,
    videoUrl: capturedVideoBlobUrl || 'https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-outdoors-42289-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: true,
    sizeMB: 12.8,
    tags: [discipline.name, '2-Way Live Conversation', 'Automatic Agentic Burst', 'Milestone Vault'],
    repType: 'model',
    coachVoiceoverText: `Great step-by-step setup in ${discipline.name}. You spoke ${exchangesCount} times during live coaching, ensuring natural teacher pacing.`,
    keyframeNotes: [
      { timeOffsetSeconds: 1.0, label: 'Student Question Answered', description: 'Coach answered specific question on alignment.', type: 'good' },
      { timeOffsetSeconds: 2.1, label: '30 FPS Agentic Alignment', description: 'Captured optimal execution after student confirmed readiness.', type: 'good' },
    ]
  };

  const adjustmentRepClip: VideoClip = {
    id: `clip-lesson-adj-${Date.now()}`,
    title: `Form Adjustment - ${discipline.microFocus}`,
    disciplineId: discipline.id,
    createdAt: dateStr,
    durationSeconds: 4.8,
    videoUrl: capturedVideoBlobUrl || 'https://assets.mixkit.co/videos/preview/mixkit-tennis-player-serving-the-ball-41583-large.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&q=80&w=600',
    fpsCaptured: 30,
    isMilestone: false,
    sizeMB: 10.4,
    tags: [discipline.name, 'Form Correction'],
    repType: 'adjustment',
    coachVoiceoverText: 'Remember to ask your coach to pause or explain whenever a posture feels unfamiliar!',
    keyframeNotes: [
      { timeOffsetSeconds: 1.5, label: 'Knee Over-Flexion Adjusted', description: 'Captured by background agentic video engine.', type: 'alert' },
    ]
  };

  return {
    id: `sess-${Date.now()}`,
    disciplineId: discipline.id,
    timestamp: dateStr,
    durationMinutes: Math.max(1, durationMinutes),
    overallScore: newScore,
    scoreChange: 0.5,
    coachSummary: `Incredible two-way interactive session completed! You exchanged ${exchangesCount} voice messages with Coach ${discipline.coachPersona.name}, asking questions and pacing the lesson naturally. Background Agentic Video automatically processed ${burstsCount} High-FPS motion bursts. Overall ${discipline.name} skill score reached ${newScore}.`,
    keyTakeaways: [
      `Completed interactive 2-way live voice lesson with Coach ${discipline.coachPersona.name}.`,
      `Logged ${exchangesCount} spoken student-teacher voice exchanges.`,
      `Coach answered questions directly and waited for voice confirmation before advancing.`,
      `Background Agentic Video processed ${burstsCount} High-FPS motion bursts.`,
    ],
    modelRepClip,
    adjustmentRepClip,
    highFpsBurstsCaptured: burstsCount
  };
}
