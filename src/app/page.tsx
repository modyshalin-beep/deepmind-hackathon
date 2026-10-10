'use client';

import React, { useState, useEffect } from 'react';
import { Discipline, CoachProfile, VideoClip, SessionReport, LocalMatchPartner, SkillLevel } from '@/types';
import { INITIAL_DISCIPLINES, INITIAL_COACH_PROFILE, INITIAL_VIDEO_CLIPS, INITIAL_LOCAL_MATCHES } from '@/lib/mockData';
import { loadCoachProfile, saveCoachProfile, loadVideoClips, saveVideoClips, loadSessions, saveSessions, pruneNonMilestoneClips } from '@/lib/storage';
import { HeaderNav } from '@/components/HeaderNav';
import { BottomTabs } from '@/components/BottomTabs';
import { StudioView } from '@/components/StudioView';
import { ActivitiesView } from '@/components/ActivitiesView';
import { MasteryView } from '@/components/MasteryView';
import { FilmStudyView } from '@/components/FilmStudyView';
import { ClubView } from '@/components/ClubView';
import { OnboardingModal } from '@/components/OnboardingModal';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('studio');
  const [disciplines, setDisciplines] = useState<Discipline[]>(INITIAL_DISCIPLINES);
  const [activeDiscipline, setActiveDiscipline] = useState<Discipline>(INITIAL_DISCIPLINES[0]);
  const [coachProfile, setCoachProfile] = useState<CoachProfile>(INITIAL_COACH_PROFILE);
  const [videoClips, setVideoClips] = useState<VideoClip[]>(INITIAL_VIDEO_CLIPS);
  const [sessions, setSessions] = useState<SessionReport[]>([]);
  const [localMatches, setLocalMatches] = useState<LocalMatchPartner[]>(INITIAL_LOCAL_MATCHES);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);

  // Load persistent state on mount
  useEffect(() => {
    const profile = loadCoachProfile();
    const clips = loadVideoClips();
    const sess = loadSessions();

    setCoachProfile(profile);
    setVideoClips(clips);
    setSessions(sess);

    const activeDisc = INITIAL_DISCIPLINES.find(d => d.id === profile.activeDisciplineId) || INITIAL_DISCIPLINES[0];
    setActiveDiscipline(activeDisc);

    // If onboarding is not completed, show onboarding modal
    if (!profile.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleSelectDiscipline = (disc: Discipline) => {
    setActiveDiscipline(disc);
    const updatedProfile = { ...coachProfile, activeDisciplineId: disc.id };
    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);
  };

  const handleChangeSkillLevel = (level: SkillLevel) => {
    const updatedProfile = { ...coachProfile, skillLevel: level };
    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);
  };

  const handleCompleteOnboarding = () => {
    const updatedProfile = { ...coachProfile, hasCompletedOnboarding: true };
    setCoachProfile(updatedProfile);
    saveCoachProfile(updatedProfile);
    setShowOnboarding(false);
  };

  const handleSessionComplete = (report: SessionReport) => {
    // Add newly captured model & adjustment clips
    const updatedClips = [report.modelRepClip, report.adjustmentRepClip, ...videoClips];
    setVideoClips(updatedClips);
    saveVideoClips(updatedClips);

    // Save session
    const updatedSessions = [report, ...sessions];
    setSessions(updatedSessions);
    saveSessions(updatedSessions);

    // Update coach profile hours & discipline score
    const addedHours = report.durationMinutes / 60;
    const newTotalHours = Math.round((coachProfile.totalHoursLogged + addedHours) * 10) / 10;
    
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

    // Switch to film study tab
    setActiveTab('film');
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Navigation Header */}
      <HeaderNav coachProfile={coachProfile} activeTab={activeTab} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        {activeTab === 'studio' && (
          <StudioView
            disciplines={disciplines}
            activeDiscipline={activeDiscipline}
            skillLevel={coachProfile.skillLevel || 'beginner'}
            onSelectDiscipline={handleSelectDiscipline}
            onOpenOnboarding={() => setShowOnboarding(true)}
            onSessionComplete={handleSessionComplete}
          />
        )}

        {activeTab === 'activities' && (
          <ActivitiesView
            disciplines={disciplines}
            activeDiscipline={activeDiscipline}
            skillLevel={coachProfile.skillLevel || 'beginner'}
            onSelectDiscipline={handleSelectDiscipline}
            onChangeSkillLevel={handleChangeSkillLevel}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'mastery' && (
          <MasteryView
            disciplines={disciplines}
            activeDiscipline={activeDiscipline}
            coachProfile={coachProfile}
            onSelectDiscipline={handleSelectDiscipline}
          />
        )}

        {activeTab === 'film' && (
          <FilmStudyView
            clips={videoClips}
            disciplines={disciplines}
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
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal
          disciplines={disciplines}
          activeDiscipline={activeDiscipline}
          skillLevel={coachProfile.skillLevel || 'beginner'}
          onSelectDiscipline={handleSelectDiscipline}
          onChangeSkillLevel={handleChangeSkillLevel}
          onCompleteOnboarding={handleCompleteOnboarding}
        />
      )}

      {/* Bottom Tab Bar */}
      <BottomTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        unreadClipsCount={videoClips.length}
      />
    </div>
  );
}
