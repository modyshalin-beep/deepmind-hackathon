'use client';

import React, { useState, useEffect } from 'react';
import { 
  Discipline, CoachProfile, VideoClip, SessionReport, 
  SkillLevel, CourseModule, PracticeSchedule, EnrolledSkillProgress, LocalMatchPartner 
} from '@/types';
import { INITIAL_DISCIPLINES, INITIAL_COACH_PROFILE, INITIAL_VIDEO_CLIPS, INITIAL_LOCAL_MATCHES } from '@/lib/mockData';
import { loadCoachProfile, saveCoachProfile, loadVideoClips, saveVideoClips, loadSessions, saveSessions, pruneNonMilestoneClips } from '@/lib/storage';
import { HeaderNav } from '@/components/HeaderNav';
import { BottomTabs } from '@/components/BottomTabs';
import { LandingPage } from '@/components/LandingPage';
import { LessonPlansView } from '@/components/LessonPlansView';
import { ReviewView } from '@/components/ReviewView';
import { ClubView } from '@/components/ClubView';
import { StudioView } from '@/components/StudioView';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function Home() {
  const [disciplines, setDisciplines] = useState<Discipline[]>(INITIAL_DISCIPLINES);
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(INITIAL_DISCIPLINES[0]);
  const [coachProfile, setCoachProfile] = useState<CoachProfile>(INITIAL_COACH_PROFILE);
  const [videoClips, setVideoClips] = useState<VideoClip[]>(INITIAL_VIDEO_CLIPS);
  const [sessions, setSessions] = useState<SessionReport[]>([]);
  const [localMatches, setLocalMatches] = useState<LocalMatchPartner[]>(INITIAL_LOCAL_MATCHES);

  // Navigation: 3 tabs (Lesson Plans, Review, The Club)
  const [activeTab, setActiveTab] = useState<'plans' | 'review' | 'club'>('plans');

  // Active Live Lesson Session (launches camera/voice coaching)
  const [activeLessonSession, setActiveLessonSession] = useState<{
    discipline: Discipline;
    module: CourseModule;
  } | null>(null);

  // Landing Page & Onboarding modal states
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingPreselectedSkill, setOnboardingPreselectedSkill] = useState<string | undefined>(undefined);
  const [isAddingSkillOnly, setIsAddingSkillOnly] = useState<boolean>(false);

  // Load persistent storage on initial mount
  useEffect(() => {
    const profile = loadCoachProfile();
    const clips = loadVideoClips();
    const sess = loadSessions();

    setCoachProfile(profile);
    setVideoClips(clips);
    setSessions(sess);

    const activeDisc = INITIAL_DISCIPLINES.find(d => d.id === profile.activeDisciplineId) || INITIAL_DISCIPLINES[0];
    setActiveDiscipline(activeDisc);

    // If user has already completed onboarding previously, skip landing page
    if (profile.hasCompletedOnboarding) {
      setShowLanding(false);
    }
  }, []);

  const handleSelectDiscipline = (disc: Discipline) => {
    setActiveDiscipline(disc);
    const updatedProfile = { ...coachProfile, activeDisciplineId: disc.id };
    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);
  };

  const handleOpenAddSkill = (preselectedSkillId?: string) => {
    setOnboardingPreselectedSkill(preselectedSkillId);
    setIsAddingSkillOnly(true);
    setShowOnboarding(true);
  };

  const handleStartOnboardingFromLanding = (preselectedSkillId?: string) => {
    setOnboardingPreselectedSkill(preselectedSkillId);
    setIsAddingSkillOnly(false);
    setShowOnboarding(true);
  };

  const handleStartLesson = (discipline: Discipline, module: CourseModule) => {
    setActiveDiscipline(discipline);
    setActiveLessonSession({ discipline, module });
  };

  const handleCompleteOnboarding = (data: {
    selectedDisciplineIds: string[];
    skillLevels: Record<string, SkillLevel>;
    goals: Record<string, string>;
    schedules?: Record<string, PracticeSchedule>;
    schedule: PracticeSchedule;
    startLessonImmediately?: boolean;
    primaryDisciplineId: string;
  }) => {
    const primaryDisc = disciplines.find(d => d.id === data.primaryDisciplineId) || disciplines[0];
    const updatedSkillsProgress: Record<string, EnrolledSkillProgress> = {
      ...(coachProfile.skillsProgress || {}),
    };

    data.selectedDisciplineIds.forEach(id => {
      const disc = disciplines.find(d => d.id === id);
      const existing = updatedSkillsProgress[id];
      const level = data.skillLevels[id] || 'beginner';
      const skillSched = data.schedules?.[id] || data.schedule;
      
      updatedSkillsProgress[id] = {
        disciplineId: id,
        skillLevel: level,
        primaryGoal: data.goals[id] || disc?.microFocus || 'Master fundamentals',
        schedule: skillSched,
        completedModuleIds: existing?.completedModuleIds || [],
        currentModuleId: existing?.currentModuleId || disc?.modules?.[0]?.id || '',
        progressPercent: existing?.progressPercent || 0,
        lastPracticedDate: 'Just enrolled',
        hoursSpent: existing?.hoursSpent || 0,
      };
    });

    const primaryModule = primaryDisc.modules?.find(
      m => m.id === updatedSkillsProgress[primaryDisc.id]?.currentModuleId
    ) || primaryDisc.modules?.[0];

    const updatedProfile: CoachProfile = {
      ...coachProfile,
      hasCompletedOnboarding: true,
      activeDisciplineId: primaryDisc.id,
      enrolledDisciplineIds: data.selectedDisciplineIds,
      schedule: data.schedule,
      skillLevel: data.skillLevels[primaryDisc.id] || 'beginner',
      skillsProgress: updatedSkillsProgress,
    };

    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);
    setActiveDiscipline(primaryDisc);
    setShowOnboarding(false);
    setShowLanding(false);

    if (data.startLessonImmediately && primaryModule) {
      setActiveLessonSession({ discipline: primaryDisc, module: primaryModule });
    } else {
      setActiveLessonSession(null);
      setActiveTab('plans');
    }
  };

  const handleSessionComplete = (report: SessionReport) => {
    // Save clips & session reports
    const updatedClips = [report.modelRepClip, report.adjustmentRepClip, ...videoClips];
    setVideoClips(updatedClips);
    saveVideoClips(updatedClips);

    const updatedSessions = [report, ...sessions];
    setSessions(updatedSessions);
    saveSessions(updatedSessions);

    // Update practice hours
    const addedHours = report.durationMinutes / 60;
    const newTotalHours = Math.round((coachProfile.totalHoursLogged + addedHours) * 10) / 10;
    
    // Advance completed module
    const currentProgress = coachProfile.skillsProgress?.[report.disciplineId];
    let updatedCompletedModules = currentProgress?.completedModuleIds || [];
    let nextModuleId = currentProgress?.currentModuleId || '';
    
    if (report.moduleId && !updatedCompletedModules.includes(report.moduleId)) {
      updatedCompletedModules = [...updatedCompletedModules, report.moduleId];
      const disc = disciplines.find(d => d.id === report.disciplineId);
      const currentIndex = disc?.modules?.findIndex(m => m.id === report.moduleId) ?? -1;
      if (disc && disc.modules && currentIndex >= 0 && currentIndex < disc.modules.length - 1) {
        nextModuleId = disc.modules[currentIndex + 1].id;
      }
    }

    const totalDiscModules = disciplines.find(d => d.id === report.disciplineId)?.modules?.length || 3;
    const newProgressPercent = Math.min(100, Math.round((updatedCompletedModules.length / totalDiscModules) * 100));

    const updatedSkillsProgress: Record<string, EnrolledSkillProgress> = {
      ...(coachProfile.skillsProgress || {}),
      [report.disciplineId]: {
        ...(currentProgress || {
          disciplineId: report.disciplineId,
          skillLevel: coachProfile.skillLevel,
          primaryGoal: activeDiscipline.microFocus,
          schedule: coachProfile.schedule,
          completedModuleIds: [],
          currentModuleId: '',
          progressPercent: 0,
          hoursSpent: 0,
        }),
        completedModuleIds: updatedCompletedModules,
        currentModuleId: nextModuleId,
        progressPercent: newProgressPercent,
        lastPracticedDate: 'Today',
        hoursSpent: Math.round(((currentProgress?.hoursSpent || 0) + addedHours) * 10) / 10,
      }
    };

    const updatedDisciplines = disciplines.map(d => {
      if (d.id === report.disciplineId) {
        return { ...d, overallScore: report.overallScore };
      }
      return d;
    });

    setDisciplines(updatedDisciplines);

    const updatedProfile: CoachProfile = {
      ...coachProfile,
      totalHoursLogged: newTotalHours,
      skillsProgress: updatedSkillsProgress,
      coachNotesLog: [
        {
          id: `cn-${Date.now()}`,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          disciplineId: report.disciplineId,
          note: report.coachSummary,
          prescription: `Drill ${report.keyTakeaways[2] || activeDiscipline.microFocus}`,
        },
        ...coachProfile.coachNotesLog,
      ],
    };

    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);

    // Close active lesson screen and redirect to Review tab
    setActiveLessonSession(null);
    setActiveTab('review');
  };

  const handleToggleMilestone = (clipId: string) => {
    const updated = videoClips.map(c => {
      if (c.id === clipId) {
        return { ...c, isMilestone: !c.isMilestone };
      }
      return c;
    });
    setVideoClips(updated);
    saveVideoClips(updated);
  };

  const handlePruneClips = () => {
    const pruned = pruneNonMilestoneClips(videoClips);
    setVideoClips(pruned);
    saveVideoClips(pruned);
  };

  // If user is on initial landing page, render LandingPage
  if (showLanding) {
    return (
      <>
        <LandingPage
          disciplines={disciplines}
          onStartOnboarding={handleStartOnboardingFromLanding}
          onExploreDemo={() => setShowLanding(false)}
        />

        <OnboardingModal
          disciplines={disciplines}
          activeDiscipline={activeDiscipline}
          coachProfile={coachProfile}
          isOpen={showOnboarding}
          preselectedSkillId={onboardingPreselectedSkill}
          isAddingSkillOnly={isAddingSkillOnly}
          onClose={() => setShowOnboarding(false)}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header with Intuitive Skill Switcher Dropdown */}
      <HeaderNav 
        coachProfile={coachProfile} 
        disciplines={disciplines}
        activeDiscipline={activeDiscipline}
        onSelectDiscipline={handleSelectDiscipline}
        onOpenAddSkill={() => handleOpenAddSkill()}
        onTriggerOnboarding={() => setShowLanding(true)}
        onShowLanding={() => setShowLanding(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {/* If user is inside an active lesson session, render StudioView */}
        {activeLessonSession ? (
          <StudioView
            disciplines={disciplines}
            activeDiscipline={activeLessonSession.discipline}
            activeModule={activeLessonSession.module}
            skillLevel={coachProfile.skillsProgress?.[activeLessonSession.discipline.id]?.skillLevel || coachProfile.skillLevel || 'beginner'}
            onSelectDiscipline={handleSelectDiscipline}
            onOpenOnboarding={() => handleOpenAddSkill()}
            onSessionComplete={handleSessionComplete}
            onExitLesson={() => setActiveLessonSession(null)}
          />
        ) : (
          <>
            {activeTab === 'plans' && (
              <LessonPlansView
                disciplines={disciplines}
                activeDiscipline={activeDiscipline}
                coachProfile={coachProfile}
                onSelectDiscipline={handleSelectDiscipline}
                onStartLesson={handleStartLesson}
                onOpenAddSkill={() => handleOpenAddSkill()}
              />
            )}

            {activeTab === 'review' && (
              <ReviewView
                clips={videoClips}
                disciplines={disciplines}
                activeDiscipline={activeDiscipline}
                coachProfile={coachProfile}
                onToggleMilestone={handleToggleMilestone}
                onPruneClips={handlePruneClips}
              />
            )}

            {activeTab === 'club' && (
              <ClubView
                localMatches={localMatches}
                activeDiscipline={activeDiscipline}
              />
            )}
          </>
        )}
      </main>

      {/* Progressive Multi-Skill Onboarding & Add-Skill Modal */}
      <OnboardingModal
        disciplines={disciplines}
        activeDiscipline={activeDiscipline}
        coachProfile={coachProfile}
        isOpen={showOnboarding}
        preselectedSkillId={onboardingPreselectedSkill}
        isAddingSkillOnly={isAddingSkillOnly}
        onClose={() => setShowOnboarding(false)}
        onCompleteOnboarding={handleCompleteOnboarding}
      />

      {/* Clean 2-Tab Bottom Navigation Bar (Hidden while practicing in StudioView) */}
      {!activeLessonSession && (
        <BottomTabs
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab as any)}
          unreadClipsCount={videoClips.length}
        />
      )}
    </div>
  );
}
