'use client';

import React, { useState } from 'react';
import { Discipline, SkillLevel, CoachProfile, PracticeSchedule } from '@/types';
import {
  Sparkles, CheckCircle2, ArrowRight, ArrowLeft,
  Activity, Utensils, Heart, Target, BookOpen, Calendar,
  Zap, Check, Play, Music
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
      case 'tennis': return <Activity className="w-5 h-5 text-[#FF7F2D]" />;
      case 'boxing': return <Zap className="w-5 h-5 text-[#FF7F2D]" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-[#9C7BAC]" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-[#4CB1FF]" />;
      case 'guitar': return <Music className="w-5 h-5 text-[#9C7BAC]" />;
      case 'yoga': return <Heart className="w-5 h-5 text-[#FF7F2D]" />;
      case 'golf': return <Target className="w-5 h-5 text-[#7CB078]" />;
      default: return <Activity className="w-5 h-5 text-[#FF7F2D]" />;
    }
  };

  const currentLevel = skillLevels[currentAssessingDiscipline.id] || 'beginner';
  const baselineOptions = currentAssessingDiscipline.baselineOptions || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#D0E6FF] rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl flex flex-col gap-5 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#4A4B4B]">
            <span className="flex items-center gap-1.5 text-[#FF7F2D] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              {currentStep === 1 && (isAddingSkillOnly ? 'Select Skill to Add' : 'Step 1 of 3: Choose Skills')}
              {currentStep === 2 && 'Step 2 of 3: Baseline & Schedule'}
              {currentStep === 3 && 'Step 3 of 3: Personalized Syllabus'}
            </span>
            <span className="text-[#4A4B4B]">{Math.round((currentStep / 3) * 100)}%</span>
          </div>
          <div className="w-full bg-[#D0E6FF] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#FF7F2D] to-[#9C7BAC] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ---------------- STEP 1: SELECT SKILLS ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#2D2E2E]">
                {isAddingSkillOnly ? 'Add a New Skill' : 'What would you like to master?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#4A4B4B]">
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
                        ? 'bg-[#FEF6F4] border-[#FF7F2D] shadow-xs text-[#2D2E2E]'
                        : 'bg-[#F5F6FC] border-[#D0E6FF] text-[#4A4B4B] hover:border-[#9C7BAC]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-[#D0E6FF] shrink-0 mt-0.5">
                        {getDisciplineIcon(d.id)}
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-[#2D2E2E]">{d.name}</span>
                        <p className="text-[11px] text-[#4A4B4B] line-clamp-1 mt-0.5">{d.tagline}</p>
                        <span className="text-[10px] text-[#FF7F2D] font-mono mt-1 block font-bold">
                          Coach {d.coachPersona.name} • {d.modules?.length || 3} modules
                        </span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-[#FF7F2D] border-[#FF7F2D] text-white' : 'border-[#D0E6FF] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#4A4B4B] pt-1">
              <span>{selectedDisciplineIds.length} skill{selectedDisciplineIds.length > 1 ? 's' : ''} selected</span>
              {onClose && (
                <button onClick={onClose} className="hover:text-[#2D2E2E] underline cursor-pointer">
                  Cancel
                </button>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedDisciplineIds.length === 0}
              className="w-full bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-sm py-3.5 rounded-2xl shadow-md shadow-[#FF7F2D]/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
                className="inline-flex items-center gap-1 text-xs text-[#4A4B4B] hover:text-[#2D2E2E] transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs font-mono text-[#FF7F2D] font-bold">
                {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#2D2E2E]">
                Baseline for {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </h2>
              <p className="text-xs text-[#4A4B4B]">
                Choose your experience level so your AI coach adapts cues accordingly.
              </p>
            </div>

            {/* Baseline Level Cards */}
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
                        ? 'bg-[#FEF6F4] border-[#FF7F2D] shadow-xs text-[#2D2E2E]'
                        : 'bg-[#F5F6FC] border border-[#D0E6FF] text-[#4A4B4B] hover:border-[#9C7BAC]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#FF7F2D] bg-[#FF7F2D]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-sm text-[#2D2E2E]">{opt.title}</span>
                        <span className="text-[10px] font-mono bg-white text-[#FF7F2D] px-2 py-0.5 rounded border border-[#D0E6FF]">
                          {opt.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#4A4B4B] mt-1 pl-6 leading-relaxed">
                      {opt.definition}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Practice Schedule */}
            <div className="bg-[#F5F6FC] p-4 rounded-2xl border border-[#D0E6FF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#2D2E2E] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF7F2D]" /> Practice Commitment:
                </span>
                <span className="text-xs font-mono font-bold text-[#FF7F2D] bg-[#FEF6F4] px-2.5 py-0.5 rounded-full border border-[#FF7F2D]/30">
                  {daysPerWeek} days • {minutesPerDay} min = {weeklyHoursDisplay} hrs/wk
                </span>
              </div>

              {/* Days Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#4A4B4B] font-medium">Days per week:</span>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        daysPerWeek === d
                          ? 'bg-[#FF7F2D] text-white border-[#FF7F2D]'
                          : 'bg-white text-[#4A4B4B] border-[#D0E6FF] hover:text-[#2D2E2E]'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes per session Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#4A4B4B] font-medium">Minutes per session:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesPerDay(mins)}
                      className={`py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                        minutesPerDay === mins
                          ? 'bg-[#FF7F2D] text-white border-[#FF7F2D]'
                          : 'bg-white text-[#4A4B4B] border-[#D0E6FF] hover:text-[#2D2E2E]'
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
              className="w-full bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-sm py-3.5 rounded-2xl shadow-md shadow-[#FF7F2D]/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              Generate Lesson Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 3: SYLLABUS READY ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#FEF6F4] text-[#FF7F2D] border border-[#FF7F2D]/40 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Syllabus Configured
              </div>
              <h2 className="text-2xl font-black text-[#2D2E2E]">
                Meet Coach {currentAssessingDiscipline.coachPersona.name}
              </h2>
              <p className="text-xs text-[#4A4B4B]">
                Ready to guide your {currentLevel.toUpperCase()} sessions with real-time audio and video analysis.
              </p>
            </div>

            {/* Coach Card */}
            <div className="bg-[#F5F6FC] border border-[#D0E6FF] rounded-2xl p-4 flex items-center gap-3.5">
              <img
                src={currentAssessingDiscipline.coachPersona.avatar}
                alt={currentAssessingDiscipline.coachPersona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7F2D] shrink-0"
              />
              <div>
                <span className="font-bold text-sm text-[#2D2E2E] block">
                  {currentAssessingDiscipline.coachPersona.name}
                </span>
                <span className="text-xs text-[#4A4B4B] block">
                  {currentAssessingDiscipline.coachPersona.title}
                </span>
                <span className="text-[11px] text-[#FF7F2D] font-mono mt-0.5 block font-bold">
                  Voice style: {currentAssessingDiscipline.coachPersona.voiceStyle}
                </span>
              </div>
            </div>

            {/* First Module Up Next */}
            <div className="bg-white border border-[#D0E6FF] rounded-2xl p-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#FF7F2D] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> First Lesson:
                </span>
                <span className="text-[10px] font-mono text-[#4A4B4B]">
                  {currentAssessingDiscipline.modules?.[0]?.estimatedMinutes || 12} mins
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#2D2E2E]">
                {currentAssessingDiscipline.modules?.[0]?.title || currentAssessingDiscipline.prescribedDrill}
              </h4>
              <p className="text-xs text-[#4A4B4B]">
                {currentAssessingDiscipline.modules?.[0]?.subtitle || currentAssessingDiscipline.microFocus}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleFinish(true)}
                className="w-full bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-sm py-3.5 rounded-2xl shadow-md shadow-[#FF7F2D]/25 flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" /> Start Lesson 1 Now
              </button>

              <button
                onClick={() => handleFinish(false)}
                className="w-full bg-[#F5F6FC] hover:bg-[#D0E6FF]/40 text-[#4A4B4B] font-bold text-xs py-3 rounded-2xl transition cursor-pointer border border-[#D0E6FF]"
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
