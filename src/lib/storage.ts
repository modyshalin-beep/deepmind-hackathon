import { VideoClip, CoachProfile, SessionReport, UserAccount } from '@/types';
import { INITIAL_COACH_PROFILE, INITIAL_VIDEO_CLIPS, INITIAL_SESSIONS } from './mockData';

const PROFILE_KEY = 'pocket_coach_profile_v1';
const CLIPS_KEY = 'pocket_coach_clips_v1';
const SESSIONS_KEY = 'pocket_coach_sessions_v1';
const CURRENT_USER_KEY = 'pocket_coach_current_user_v1';
const USERS_KEY = 'pocket_coach_registered_users_v1';
const MAX_STORAGE_MB = 1024; // 1 GB simulated storage cap

export const DEMO_USER: UserAccount = {
  id: 'usr-demo-1',
  name: 'Alex Rivera',
  email: 'alex@pocketcoach.ai',
  skillLevel: 'beginner',
  primaryDisciplineId: 'yoga',
  createdAt: '2026-09-01T08:00:00Z',
};

export function loadCurrentUser(): UserAccount | null {
  if (typeof window === 'undefined') return DEMO_USER;
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return DEMO_USER;
    return JSON.parse(raw);
  } catch {
    return DEMO_USER;
  }
}

export function saveCurrentUser(user: UserAccount | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_USER_KEY);
    } else {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save current user', err);
  }
}

export function loadRegisteredUsers(): UserAccount[] {
  if (typeof window === 'undefined') return [DEMO_USER];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [DEMO_USER];
    return JSON.parse(raw);
  } catch {
    return [DEMO_USER];
  }
}

export function saveRegisteredUsers(users: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users', err);
  }
}

export function loadCoachProfile(): CoachProfile {
  if (typeof window === 'undefined') return INITIAL_COACH_PROFILE;
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return INITIAL_COACH_PROFILE;
    return JSON.parse(raw);
  } catch {
    return INITIAL_COACH_PROFILE;
  }
}

export function saveCoachProfile(profile: CoachProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.error('Failed to save profile', err);
  }
}

export function loadVideoClips(): VideoClip[] {
  if (typeof window === 'undefined') return INITIAL_VIDEO_CLIPS;
  try {
    const raw = localStorage.getItem(CLIPS_KEY);
    if (!raw) return INITIAL_VIDEO_CLIPS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_VIDEO_CLIPS;
  }
}

export function saveVideoClips(clips: VideoClip[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CLIPS_KEY, JSON.stringify(clips));
  } catch (err) {
    console.error('Failed to save video clips', err);
  }
}

export function loadSessions(): SessionReport[] {
  if (typeof window === 'undefined') return INITIAL_SESSIONS;
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    if (!raw) return INITIAL_SESSIONS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_SESSIONS;
  }
}

export function saveSessions(sessions: SessionReport[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions', err);
  }
}

export function calculateStorageUsage(clips: VideoClip[]): { usedMB: number; totalMB: number; percent: number; milestoneClipsCount: number } {
  const usedMB = clips.reduce((acc, clip) => acc + (clip.sizeMB || 10), 0);
  const roundedMB = Math.round(usedMB * 10) / 10;
  const percent = Math.min(100, Math.round((roundedMB / MAX_STORAGE_MB) * 100));
  const milestoneClipsCount = clips.filter(c => c.isMilestone).length;
  return {
    usedMB: roundedMB,
    totalMB: MAX_STORAGE_MB,
    percent,
    milestoneClipsCount,
  };
}

export function pruneNonMilestoneClips(clips: VideoClip[]): VideoClip[] {
  // Keep all milestone clips, plus the newest 3 non-milestone clips
  const milestoneClips = clips.filter(c => c.isMilestone);
  const nonMilestoneClips = clips
    .filter(c => !c.isMilestone)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  return [...milestoneClips, ...nonMilestoneClips];
}
