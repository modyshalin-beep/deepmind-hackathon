'use client';

import React, { useState } from 'react';
import { Discipline, SkillLevel, CoachProfile, PracticeSchedule } from '@/types';
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface OnboardingModalProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  coachProfile: CoachProfile;
  isOpen: boolean;
  preselectedSkillId?: string;
  isAddingSkillOnly?: boolean;
  onClose?: () => void;
  onCompleteOnboarding: (data: {
    selectedDisciplineIds: string[];
    skillLevels: Record<string, SkillLevel>;
    goals: Record<string, string>;
    schedules?: Record<string, PracticeSchedule>;
    schedule: PracticeSchedule;
    startLessonImmediately?: boolean;
    primaryDisciplineId: string;
  }) => void;
}

export function OnboardingModal({
  disciplines,
  activeDiscipline,
  coachProfile,
  isOpen,
  preselectedSkillId,
  isAddingSkillOnly = false,
  onCompleteOnboarding,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  // Selected disciplines
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>(() => {
    if (preselectedSkillId) return [preselectedSkillId];
    if (isAddingSkillOnly) return [disciplines[0].id];
    if (coachProfile.enrolledDisciplineIds && coachProfile.enrolledDisciplineIds.length > 0) {
      return coachProfile.enrolledDisciplineIds;
    }
    return [activeDiscipline.id];
  });

  // Level per skill
  const [skillLevels, setSkillLevels] = useState<Record<string, SkillLevel>>(() => {
    const initial: Record<string, SkillLevel> = {};
    disciplines.forEach(d => {
      initial[d.id] = coachProfile.skillsProgress?.[d.id]?.skillLevel || 'beginner';
    });
    return initial;
  });

  // Days per week and minutes per session per skill
  const [skillSchedules, setSkillSchedules] = useState<Record<string, { daysPerWeek: number; minutesPerDay: number }>>(() => {
    const initial: Record<string, { daysPerWeek: number; minutesPerDay: number }> = {};
    disciplines.forEach(d => {
      const existing = coachProfile.skillsProgress?.[d.id]?.schedule;
      initial[d.id] = {
        daysPerWeek: existing?.daysPerWeek || 3,
        minutesPerDay: existing?.minutesPerDay || 30,
      };
    });
    return initial;
  });

  if (!isOpen) return null;

  const toggleDiscipline = (id: string) => {
    if (selectedDisciplineIds.includes(id)) {
      if (selectedDisciplineIds.length > 1) {
        setSelectedDisciplineIds(prev => prev.filter(d => d !== id));
      }
    } else {
      setSelectedDisciplineIds(prev => [...prev, id]);
    }
  };

  const getDisciplineIconEmoji = (id: string) => {
    switch (id) {
      case 'tennis': return '🎾';
      case 'boxing': return '🥊';
      case 'dance': return '💃';
      case 'cooking': return '🔪';
      case 'guitar': return '🎸';
      case 'yoga': return '🧘';
      case 'golf': return '⛳';
      default: return '⚡';
    }
  };

  const handleFinish = () => {
    const goals: Record<string, string> = {};
    const schedules: Record<string, PracticeSchedule> = {};

    selectedDisciplineIds.forEach(id => {
      const disc = disciplines.find(d => d.id === id);
      goals[id] = disc?.microFocus || 'Master fundamentals';
      
      const sched = skillSchedules[id] || { daysPerWeek: 3, minutesPerDay: 30 };
      schedules[id] = {
        daysPerWeek: sched.daysPerWeek,
        minutesPerDay: sched.minutesPerDay,
        totalWeeklyMinutes: sched.daysPerWeek * sched.minutesPerDay
      };
    });

    const primaryId = selectedDisciplineIds[0] || activeDiscipline.id;
    const primarySchedule = schedules[primaryId] || { daysPerWeek: 3, minutesPerDay: 30, totalWeeklyMinutes: 90 };

    onCompleteOnboarding({
      selectedDisciplineIds: isAddingSkillOnly
        ? Array.from(new Set([...(coachProfile.enrolledDisciplineIds || []), ...selectedDisciplineIds]))
        : selectedDisciplineIds,
      skillLevels,
      goals,
      schedules,
      schedule: primarySchedule,
      startLessonImmediately: false,
      primaryDisciplineId: primaryId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[92vh] overflow-y-auto">
        
        {/* Step 1: Select Skills */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-2 font-mono">
                Step 1 of 2
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isAddingSkillOnly ? 'Add a Skill to Master' : 'What would you like to learn?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Select one or multiple skills. Each skill gets a dedicated curriculum.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {disciplines.map((d) => {
                const isSelected = selectedDisciplineIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDiscipline(d.id)}
                    className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 shadow-md text-white'
                        : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                        {getDisciplineIconEmoji(d.id)}
                      </span>
                      <div>
                        <span className="font-bold text-xs sm:text-sm block truncate">{d.shortName || d.name}</span>
                        <span className="text-[10px] text-slate-400 line-clamp-1">{d.category}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-md bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-400">
                {selectedDisciplineIds.length} skill{selectedDisciplineIds.length > 1 ? 's' : ''} selected
              </span>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              disabled={selectedDisciplineIds.length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              Continue to Skill Setup <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Tailor Level & Custom Schedule for EACH Selected Skill */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                Step 2 of 2: Set Level & Schedule
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Customize Each Skill
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Choose your experience level and how many days and minutes you want to practice each week:
              </p>
            </div>

            {/* Compact Card per Selected Skill */}
            <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
              {selectedDisciplineIds.map((id) => {
                const disc = disciplines.find(d => d.id === id);
                if (!disc) return null;

                const currentLevel = skillLevels[id] || 'beginner';
                const currentSched = skillSchedules[id] || { daysPerWeek: 3, minutesPerDay: 30 };
                const weeklyHours = ((currentSched.daysPerWeek * currentSched.minutesPerDay) / 60).toFixed(1);

                return (
                  <div
                    key={id}
                    className="bg-slate-850/90 border border-slate-750 rounded-2xl p-4 space-y-3.5 shadow-md"
                  >
                    {/* Skill Header & Weekly Calculation */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{getDisciplineIconEmoji(id)}</span>
                        <span className="font-bold text-sm text-white">
                          {disc.name}
                        </span>
                      </div>

                      <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                        {currentSched.daysPerWeek}d • {currentSched.minutesPerDay}m ({weeklyHours} hrs/wk)
                      </span>
                    </div>

                    {/* Baseline Level Selector (1-Tap) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Baseline Level:
                      </span>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'beginner', label: 'Beginner' },
                          { id: 'intermediate', label: 'Intermediate' },
                          { id: 'advanced', label: 'Advanced' },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setSkillLevels(prev => ({ ...prev, [id]: lvl.id as SkillLevel }))}
                            className={`py-1.5 px-1 rounded-xl text-xs font-bold border transition text-center cursor-pointer ${
                              currentLevel === lvl.id
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {lvl.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Days Per Week Selector (1 to 7 Days) */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Days per week:
                      </span>
                      <div className="grid grid-cols-7 gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((days) => (
                          <button
                            key={days}
                            type="button"
                            onClick={() => setSkillSchedules(prev => ({
                              ...prev,
                              [id]: { ...(prev[id] || { minutesPerDay: 30 }), daysPerWeek: days }
                            }))}
                            className={`py-1 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                              currentSched.daysPerWeek === days
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-black'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Session Duration Selector */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                        Minutes per session:
                      </span>
                      <div className="grid grid-cols-5 gap-1">
                        {[15, 30, 45, 60, 90].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setSkillSchedules(prev => ({
                              ...prev,
                              [id]: { ...(prev[id] || { daysPerWeek: 3 }), minutesPerDay: mins }
                            }))}
                            className={`py-1 rounded-lg text-xs font-bold border transition text-center cursor-pointer ${
                              currentSched.minutesPerDay === mins
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Training Roadmap <Sparkles className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
