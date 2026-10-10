export interface SkillSubcomponent {
  id: string;
  name: string;
  score: number; // 1 to 10 scale
  category: 'strength' | 'weakness' | 'developing';
  history: { date: string; score: number }[];
}

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface BaselineOption {
  level: SkillLevel;
  title: string;
  badge: string;
  definition: string;
  realWorldScenario: string;
  focusArea: string;
}

export interface CourseModule {
  id: string;
  disciplineId: string;
  order: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  status: 'completed' | 'in_progress' | 'locked';
  microFocus: string;
  prescribedDrill: string;
  keyObjectives: string[];
  beginnerSteps?: string[];
}

export interface Discipline {
  id: string;
  name: string;
  shortName: string;
  category: string;
  iconName: string;
  tagline: string;
  description: string;
  coachPersona: {
    name: string;
    title: string;
    avatar: string;
    voiceStyle: string;
  };
  microFocus: string;
  prescribedDrill: string;
  beginnerStepByStepPrep: string[];
  overallScore: number;
  subcomponents: SkillSubcomponent[];
  systemInstruction: string;
  baselineOptions?: BaselineOption[];
  modules?: CourseModule[];
}

export interface KeyframeNote {
  timeOffsetSeconds: number;
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
  videoUrl: string;
  thumbnailUrl: string;
  fpsCaptured: number;
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
  scoreChange: number;
  coachSummary: string;
  keyTakeaways: string[];
  modelRepClip: VideoClip;
  adjustmentRepClip: VideoClip;
  highFpsBurstsCaptured: number;
  moduleId?: string;
}

export interface PracticeSchedule {
  daysPerWeek: number;
  minutesPerDay: number;
  totalWeeklyMinutes: number;
}

export interface EnrolledSkillProgress {
  disciplineId: string;
  skillLevel: SkillLevel;
  primaryGoal: string;
  schedule?: PracticeSchedule;
  completedModuleIds: string[];
  currentModuleId: string;
  progressPercent: number; // 0-100
  lastPracticedDate?: string;
  hoursSpent: number;
}

export interface CoachProfile {
  studentName: string;
  skillLevel: SkillLevel;
  totalHoursLogged: number;
  targetHours: number; // 10000
  memberSince: string;
  activeDisciplineId: string;
  enrolledDisciplineIds?: string[];
  skillsProgress?: Record<string, EnrolledSkillProgress>;
  schedule?: PracticeSchedule;
  audioGuidanceEnabled: boolean;
  batteryLevel?: number;
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
