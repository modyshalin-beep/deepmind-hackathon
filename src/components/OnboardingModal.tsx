'use client';

import React, { useState } from 'react';
import { Discipline, SkillLevel, CoachProfile, PracticeSchedule } from '@/types';
import { 
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft, 
  Activity, Utensils, Heart, Target, BookOpen, Clock, 
  Zap, Check, Play, Music, Volume2, Calendar
} from 'lucide-react';

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
  onClose,
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

  // Current discipline being configured in Step 2
  const [assessingDisciplineId, setAssessingDisciplineId] = useState<string>(
    preselectedSkillId || selectedDisciplineIds[0] || activeDiscipline.id
  );

  // Skill levels map
  const [skillLevels, setSkillLevels] = useState<Record<string, SkillLevel>>(() => {
    const initial: Record<string, SkillLevel> = {};
    disciplines.forEach(d => {
      initial[d.id] = coachProfile.skillsProgress?.[d.id]?.skillLevel || 'beginner';
    });
    return initial;
  });

  // Schedule: Days per week + minutes per session
  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    coachProfile.schedule?.daysPerWeek || 3
  );
  const [minutesPerDay, setMinutesPerDay] = useState<number>(
    coachProfile.schedule?.minutesPerDay || 30
  );

  if (!isOpen) return null;

  const totalWeeklyMinutes = daysPerWeek * minutesPerDay;
  const weeklyHoursDisplay = (totalWeeklyMinutes / 60).toFixed(1);

  const toggleDiscipline = (id: string) => {
    if (selectedDisciplineIds.includes(id)) {
      if (selectedDisciplineIds.length > 1) {
        const next = selectedDisciplineIds.filter(d => d !== id);
        setSelectedDisciplineIds(next);
        if (assessingDisciplineId === id) setAssessingDisciplineId(next[0]);
      }
    } else {
      const next = [...selectedDisciplineIds, id];
      setSelectedDisciplineIds(next);
      setAssessingDisciplineId(id);
    }
  };

  const currentAssessingDiscipline = 
    disciplines.find(d => d.id === assessingDisciplineId) || 
    disciplines.find(d => selectedDisciplineIds.includes(d.id)) || 
    disciplines[0];

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!selectedDisciplineIds.includes(assessingDisciplineId)) {
        setAssessingDisciplineId(selectedDisciplineIds[0]);
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleFinish = (startLessonImmediately: boolean) => {
    const goals: Record<string, string> = {};
    selectedDisciplineIds.forEach(id => {
      const disc = disciplines.find(d => d.id === id);
      goals[id] = disc?.microFocus || 'Master fundamentals';
    });

    onCompleteOnboarding({
      selectedDisciplineIds: isAddingSkillOnly
        ? Array.from(new Set([...(coachProfile.enrolledDisciplineIds || []), ...selectedDisciplineIds]))
        : selectedDisciplineIds,
      skillLevels,
      goals,
      schedule: {
        daysPerWeek,
        minutesPerDay,
        totalWeeklyMinutes,
      },
      startLessonImmediately,
      primaryDisciplineId: assessingDisciplineId || selectedDisciplineIds[0],
    });
  };

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'boxing': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-fuchsia-400" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-cyan-400" />;
      case 'guitar': return <Music className="w-5 h-5 text-violet-400" />;
      case 'yoga': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'golf': return <Target className="w-5 h-5 text-emerald-400" />;
      default: return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  const currentLevel = skillLevels[currentAssessingDiscipline.id] || 'beginner';
  const baselineOptions = currentAssessingDiscipline.baselineOptions || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl flex flex-col gap-5 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {currentStep === 1 && (isAddingSkillOnly ? 'Select Skill to Add' : 'Step 1 of 3: Choose Skills')}
              {currentStep === 2 && 'Step 2 of 3: Baseline & Schedule'}
              {currentStep === 3 && 'Step 3 of 3: Personalized Syllabus'}
            </span>
            <span className="text-slate-500">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ---------------- STEP 1: SELECT SKILLS ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                {isAddingSkillOnly ? 'Add a New Skill' : 'What would you like to master?'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Select one or multiple skills. Each skill gets a dedicated AI coach and curriculum.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
              {disciplines.map((d) => {
                const isSelected = selectedDisciplineIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDiscipline(d.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 shadow-lg text-white'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                        {getDisciplineIcon(d.id)}
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-white">{d.name}</span>
                        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{d.tagline}</p>
                        <span className="text-[10px] text-emerald-400 font-mono mt-1 block">
                          Coach {d.coachPersona.name} • {d.modules?.length || 3} modules
                        </span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>{selectedDisciplineIds.length} skill{selectedDisciplineIds.length > 1 ? 's' : ''} selected</span>
              {onClose && (
                <button onClick={onClose} className="hover:text-white underline cursor-pointer">
                  Cancel
                </button>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedDisciplineIds.length === 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              Continue to Baseline & Schedule <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 2: BASELINE & SCHEDULE ---------------- */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Baseline for {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </h2>
              <p className="text-xs text-slate-400">
                Choose your experience level so your AI coach adapts cues accordingly.
              </p>
            </div>

            {/* Baseline Level Cards (Visual, Not Text-Heavy) */}
            <div className="space-y-2">
              {baselineOptions.map((opt) => {
                const isSelected = currentLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => {
                      setSkillLevels(prev => ({ ...prev, [currentAssessingDiscipline.id]: opt.level }));
                    }}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-950/80 border-emerald-400 shadow-md text-white'
                        : 'bg-slate-850/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-emerald-400 bg-emerald-500' : 'border-slate-600 bg-slate-900'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                        </div>
                        <span className="font-bold text-sm text-white">{opt.title}</span>
                        <span className="text-[10px] font-mono bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                          {opt.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 pl-6 leading-relaxed">
                      {opt.definition}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Practice Schedule: Days per week + Minutes per day */}
            <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Practice Commitment:
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                  {daysPerWeek} days • {minutesPerDay} min = {weeklyHoursDisplay} hrs/wk
                </span>
              </div>

              {/* Days Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Days per week:</span>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                        daysPerWeek === d
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes per session Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-slate-400 font-medium">Minutes per session:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesPerDay(mins)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                        minutesPerDay === mins
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Generate Lesson Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 3: SYLLABUS READY ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Syllabus Configured
              </div>
              <h2 className="text-2xl font-black text-white">
                Meet Coach {currentAssessingDiscipline.coachPersona.name}
              </h2>
              <p className="text-xs text-slate-400">
                Ready to guide your {currentLevel.toUpperCase()} sessions with real-time audio and video analysis.
              </p>
            </div>

            {/* Coach Card */}
            <div className="bg-slate-850 border border-slate-800 rounded-2xl p-4 flex items-center gap-3.5">
              <img
                src={currentAssessingDiscipline.coachPersona.avatar}
                alt={currentAssessingDiscipline.coachPersona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400 shrink-0"
              />
              <div>
                <span className="font-bold text-sm text-white block">
                  {currentAssessingDiscipline.coachPersona.name}
                </span>
                <span className="text-xs text-slate-400 block">
                  {currentAssessingDiscipline.coachPersona.title}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono mt-0.5 block">
                  Voice style: {currentAssessingDiscipline.coachPersona.voiceStyle}
                </span>
              </div>
            </div>

            {/* First Module Up Next */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> First Lesson:
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {currentAssessingDiscipline.modules?.[0]?.estimatedMinutes || 12} mins
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">
                {currentAssessingDiscipline.modules?.[0]?.title || currentAssessingDiscipline.prescribedDrill}
              </h4>
              <p className="text-xs text-slate-400">
                {currentAssessingDiscipline.modules?.[0]?.subtitle || currentAssessingDiscipline.microFocus}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleFinish(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Lesson 1 Now
              </button>

              <button
                onClick={() => handleFinish(false)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 rounded-2xl transition cursor-pointer"
              >
                View All Lesson Plans
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
