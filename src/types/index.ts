export interface SkillSubcomponent {
  id: string;
  name: string;
  score: number; // 1 to 10 scale
  category: 'strength' | 'weakness' | 'developing';
  history: { date: string; score: number }[];
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Discipline {
  id: string;
  name: string;
  category: string;
  iconName: string;
  description: string;
  coachPersona: {
    name: string;
    title: string;
    avatar: string;
    voiceStyle: string;
  };
  microFocus: string;
  prescribedDrill: string;
  beginnerStepByStepPrep: string[]; // Step by step setup explanation for beginners
  overallScore: number;
  subcomponents: SkillSubcomponent[];
  systemInstruction: string;
}

export interface KeyframeNote {
  timeOffsetSeconds: number; // e.g. 1.2s
  label: string;
  description: string;
  type: 'good' | 'warning' | 'alert';
}

export interface VideoClip {
  id: string;
  title: string;
  disciplineId: string;
  createdAt: string; // ISO date
  durationSeconds: number;
  videoUrl: string; // blob URL or sample video URL
  thumbnailUrl: string;
  fpsCaptured: number; // e.g. 30 FPS
  isMilestone: boolean;
  sizeMB: number;
  tags: string[];
  repType: 'model' | 'adjustment' | 'practice';
  keyframeNotes: KeyframeNote[];
  coachVoiceoverText: string;
}

export interface SessionReport {
  id: string;
  disciplineId: string;
  timestamp: string;
  durationMinutes: number;
  overallScore: number;
  scoreChange: number; // e.g. +0.4
  coachSummary: string;
  keyTakeaways: string[];
  modelRepClip: VideoClip;
  adjustmentRepClip: VideoClip;
  highFpsBurstsCaptured: number;
}

export interface CoachProfile {
  studentName: string;
  skillLevel: SkillLevel; // Default: 'beginner'
  totalHoursLogged: number;
  targetHours: number; // 10000
  memberSince: string;
  activeDisciplineId: string;
  airPodsConnected: boolean;
  batteryLevel: number;
  hasCompletedOnboarding: boolean;
  coachNotesLog: {
    id: string;
    date: string;
    disciplineId: string;
    note: string;
    prescription: string;
  }[];
}

export interface LocalMatchPartner {
  id: string;
  name: string;
  avatar: string;
  disciplineId: string;
  skillScore: number;
  distanceMiles: number;
  locationName: string;
  matchPercentage: number;
  verifiedByCoach: boolean;
  recentBreakthrough: string;
  badge: string;
}
