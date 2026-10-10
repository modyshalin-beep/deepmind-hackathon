import { Discipline, SessionReport, VideoClip, SkillLevel } from '@/types';

export type CoachHaloStatus = 'ready' | 'burst_capturing' | 'coach_speaking' | 'user_speaking' | 'framing_alert';

export type LessonPhase = 'warmup' | 'core_drills' | 'fatigue_push' | 'debrief';

export interface ConversationalExchange {
  id: string;
  speaker: 'coach' | 'user';
  text: string;
  timestampSeconds: number;
}

export function speakCoachFeedback(text: string, onStart?: () => void, onEnd?: () => void): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel') || v.name.includes('Google')));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      if (onEnd) onEnd();
      resolve();
    };

    utterance.onerror = () => {
      if (onEnd) onEnd();
      resolve();
    };

    window.speechSynthesis.speak(utterance);
  });
}

export function stopCoachSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function generateCoachResponseToUserSpeech(
  userInput: string,
  discipline: Discipline,
  skillLevel: SkillLevel,
  currentStepIndex: number
): { responseText: string; advanceStep: boolean; customAnswer?: string } {
  const textLower = userInput.toLowerCase();

  // User asks what the pose/drill is or asks for explanation
  if (textLower.includes('what is') || textLower.includes('explain') || textLower.includes('dont know') || textLower.includes("don't know") || textLower.includes('how do i')) {
    if (discipline.id === 'yoga') {
      return {
        responseText: "No problem at all! Warrior 2 is a powerful standing posture. You stand wide on your mat, bend your front right knee over your ankle, and stretch your arms out parallel to the floor. Let's do Step 1 together: place your feet 4 feet apart.",
        advanceStep: false,
      };
    } else if (discipline.id === 'tennis') {
      return {
        responseText: "Backhand volley preparation means holding your continental grip like a hammer and turning your shoulders early before the ball comes. Take a balanced ready stance and let me know when you're set!",
        advanceStep: false,
      };
    } else if (discipline.id === 'cooking') {
      return {
        responseText: "The claw grip protects your fingers! Curl your fingertips inward like a bear paw, letting your knuckles guide the side of the knife blade safely.",
        advanceStep: false,
      };
    } else {
      return {
        responseText: "Let's break this down step-by-step. Get into a comfortable, balanced posture facing your phone tripod. Say 'ready' when you're in position!",
        advanceStep: false,
      };
    }
  }

  // User asks to slow down or wait
  if (textLower.includes('wait') || textLower.includes('hold on') || textLower.includes('slow down') || textLower.includes('pause') || textLower.includes('stop')) {
    return {
      responseText: "Taking a pause! Take your time, get comfortable. Whenever you're ready to continue, just say 'ready' or 'let's go'.",
      advanceStep: false,
    };
  }

  // User confirms readiness or completion ('ready', 'done', 'got it', 'okay', 'yes', 'next')
  if (textLower.includes('ready') || textLower.includes('done') || textLower.includes('got it') || textLower.includes('okay') || textLower.includes('ok') || textLower.includes('yes') || textLower.includes('next') || textLower.includes('go')) {
    const nextStepNum = currentStepIndex + 2;
    const nextStepText = discipline.beginnerStepByStepPrep[currentStepIndex + 1] || 'Now bend your knee and hold the position steady.';
    return {
      responseText: `Awesome job! Let's move to Step ${nextStepNum}: ${nextStepText} Say 'ready' when you have that set up!`,
      advanceStep: true,
    };
  }

  // General interactive speech
  return {
    responseText: `I heard you say "${userInput}". I'm watching your posture live in 30 FPS. Let me know when you're ready for the next step!`,
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
    title: `Conversational Lesson Model Rep - ${discipline.name}`,
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
      { timeOffsetSeconds: 1.0, label: 'Student Question Answered', description: 'Coach paused and explained stance details upon student voice question.', type: 'good' },
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
      `Coach waited for voice confirmation before advancing through step-by-step setup.`,
      `Background Agentic Video processed ${burstsCount} High-FPS motion bursts.`,
    ],
    modelRepClip,
    adjustmentRepClip,
    highFpsBurstsCaptured: burstsCount
  };
}
