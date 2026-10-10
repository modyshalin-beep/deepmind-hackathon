'use client';

import React, { useState } from 'react';
import { Discipline, SkillLevel, CoachProfile, PracticeSchedule } from '@/types';
import {
  Sparkles, ArrowRight, ArrowLeft,
  Activity, Utensils, Heart, Target, BookOpen, Calendar,
  Zap, Check, Play, Music, User, Mail, Lock, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const { user, signUpWithEmail, signInAsDemoAthlete } = useAuth();
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

  // Sign up fields for Step 4
  const [athleteName, setAthleteName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSignUpAndStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!athleteName.trim()) {
      setAuthError('Please enter your name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setAuthError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);
    const result = await signUpWithEmail(
      email,
      password,
      athleteName,
      assessingDisciplineId || selectedDisciplineIds[0],
      skillLevels[assessingDisciplineId] || 'beginner'
    );
    setIsSubmitting(false);

    if (result.success) {
      handleFinish(true);
    } else {
      setAuthError(result.error || 'Failed to create account');
    }
  };

  const handleFastDemoAndStart = () => {
    signInAsDemoAthlete();
    handleFinish(true);
  };

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-5 h-5 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-5 h-5 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-5 h-5 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-5 h-5 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-5 h-5 text-[#B5C99A]" />;
      default: return <Activity className="w-5 h-5 text-[#A4C2F4]" />;
    }
  };

  const currentLevel = skillLevels[currentAssessingDiscipline.id] || 'beginner';
  const baselineOptions = currentAssessingDiscipline.baselineOptions || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl max-w-2xl w-full p-5 sm:p-8 shadow-2xl flex flex-col gap-5 my-auto max-h-[95vh] overflow-y-auto">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#6E757C]">
            <span className="flex items-center gap-1.5 text-[#3E4348] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#E8A5A5]" />
              {currentStep === 1 && (isAddingSkillOnly ? 'Select Skill to Add' : 'Step 1 of 4: Choose Skills')}
              {currentStep === 2 && 'Step 2 of 4: Baseline & Schedule'}
              {currentStep === 3 && 'Step 3 of 4: Personalized Syllabus'}
              {currentStep === 4 && 'Step 4 of 4: Save Progress & Sign Up'}
            </span>
            <span className="text-[#6E757C]">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-[#E8A5A5] via-[#A4C2F4] to-[#B5C99A] h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* ---------------- STEP 1: SELECT SKILLS ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#3E4348]">
                {isAddingSkillOnly ? 'Add a New Skill' : 'What would you like to practice?'}
              </h2>
              <p className="text-xs sm:text-sm text-[#6E757C]">
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
                    className={`p-3.5 rounded-3xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#A4C2F4] shadow-xs text-[#3E4348] ring-2 ring-[#A4C2F4]/30'
                        : 'bg-[#F7F3EE] border-[#E8E2D8] text-[#6E757C] hover:border-[#E8A5A5]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-2xl bg-white border border-[#E8E2D8] shrink-0 mt-0.5">
                        {getDisciplineIcon(d.id)}
                      </div>
                      <div>
                        <span className="font-bold text-sm block text-[#3E4348]">{d.name}</span>
                        <p className="text-[11px] text-[#6E757C] line-clamp-1 mt-0.5">{d.tagline}</p>
                        <span className="text-[10px] text-[#E8A5A5] font-mono mt-1 block font-bold">
                          Coach {d.coachPersona.name} • {d.modules?.length || 3} modules
                        </span>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected ? 'bg-[#A4C2F4] border-[#A4C2F4] text-[#3E4348]' : 'border-[#E8E2D8] bg-white'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-[#6E757C] pt-1">
              <span>{selectedDisciplineIds.length} skill{selectedDisciplineIds.length > 1 ? 's' : ''} selected</span>
              {onClose && (
                <button onClick={onClose} className="hover:text-[#3E4348] underline cursor-pointer">
                  Cancel
                </button>
              )}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedDisciplineIds.length === 0}
              className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transform active:scale-95"
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
                className="inline-flex items-center gap-1 text-xs text-[#6E757C] hover:text-[#3E4348] transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs font-mono text-[#E8A5A5] font-bold">
                {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3E4348]">
                Baseline for {currentAssessingDiscipline.shortName || currentAssessingDiscipline.name}
              </h2>
              <p className="text-xs text-[#6E757C]">
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
                    className={`p-3.5 rounded-3xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#A4C2F4] shadow-xs text-[#3E4348] ring-2 ring-[#A4C2F4]/30'
                        : 'bg-[#F7F3EE] border border-[#E8E2D8] text-[#6E757C] hover:border-[#E8A5A5]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#A4C2F4] bg-[#A4C2F4]' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-sm text-[#3E4348]">{opt.title}</span>
                        <span className="text-[10px] font-mono bg-white text-[#3E4348] px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
                          {opt.badge}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-[#6E757C] mt-1 pl-6 leading-relaxed">
                      {opt.definition}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Practice Schedule */}
            <div className="bg-[#F7F3EE] p-4 rounded-3xl border border-[#E8E2D8] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#3E4348] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#E8A5A5]" /> Practice Commitment:
                </span>
                <span className="text-xs font-mono font-bold text-[#3E4348] bg-white px-2.5 py-0.5 rounded-full border border-[#E8E2D8]">
                  {daysPerWeek} days • {minutesPerDay} min = {weeklyHoursDisplay} hrs/wk
                </span>
              </div>

              {/* Days Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#6E757C] font-medium">Days per week:</span>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDaysPerWeek(d)}
                      className={`py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                        daysPerWeek === d
                          ? 'bg-[#A4C2F4] text-[#3E4348] border-[#A4C2F4] shadow-xs'
                          : 'bg-white text-[#6E757C] border-[#E8E2D8] hover:text-[#3E4348]'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>

              {/* Minutes per session Selector */}
              <div className="space-y-1">
                <span className="text-[11px] text-[#6E757C] font-medium">Minutes per session:</span>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => setMinutesPerDay(mins)}
                      className={`py-1.5 rounded-2xl text-xs font-bold border transition cursor-pointer ${
                        minutesPerDay === mins
                          ? 'bg-[#A4C2F4] text-[#3E4348] border-[#A4C2F4] shadow-xs'
                          : 'bg-white text-[#6E757C] border-[#E8E2D8] hover:text-[#3E4348]'
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
              className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
            >
              Generate Lesson Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 3: SYLLABUS READY ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#B5C99A]/30 text-[#42592B] border border-[#B5C99A]/50 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> Syllabus Configured
              </div>
              <h2 className="text-2xl font-black text-[#3E4348]">
                Meet Coach {currentAssessingDiscipline.coachPersona.name}
              </h2>
              <p className="text-xs text-[#6E757C]">
                Ready to guide your {currentLevel.toUpperCase()} sessions with gentle real-time audio and video guidance.
              </p>
            </div>

            {/* Coach Card */}
            <div className="bg-[#F7F3EE] border border-[#E8E2D8] rounded-3xl p-4 flex items-center gap-3.5">
              <img
                src={currentAssessingDiscipline.coachPersona.avatar}
                alt={currentAssessingDiscipline.coachPersona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E8A5A5] shrink-0"
              />
              <div>
                <span className="font-bold text-sm text-[#3E4348] block">
                  {currentAssessingDiscipline.coachPersona.name}
                </span>
                <span className="text-xs text-[#6E757C] block">
                  {currentAssessingDiscipline.coachPersona.title}
                </span>
                <span className="text-[11px] text-[#E8A5A5] font-mono mt-0.5 block font-bold">
                  Voice style: {currentAssessingDiscipline.coachPersona.voiceStyle}
                </span>
              </div>
            </div>

            {/* First Module Up Next */}
            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-4 space-y-1.5 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8A5A5] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> First Practice Session:
                </span>
                <span className="text-[10px] font-mono text-[#6E757C]">
                  {currentAssessingDiscipline.modules?.[0]?.estimatedMinutes || 12} mins
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#3E4348]">
                {currentAssessingDiscipline.modules?.[0]?.title || currentAssessingDiscipline.prescribedDrill}
              </h4>
              <p className="text-xs text-[#6E757C]">
                {currentAssessingDiscipline.modules?.[0]?.subtitle || currentAssessingDiscipline.microFocus}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (user) {
                    handleFinish(true);
                  } else {
                    setCurrentStep(4);
                  }
                }}
                className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#3E4348]" /> Start Lesson 1 Now
              </button>

              <button
                onClick={() => {
                  if (user) {
                    handleFinish(false);
                  } else {
                    setCurrentStep(4);
                  }
                }}
                className="w-full bg-[#F7F3EE] hover:bg-white text-[#6E757C] font-bold text-xs py-3 rounded-2xl transition cursor-pointer border border-[#E8E2D8]"
              >
                View All Lesson Plans
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 4: SIGN UP TO SAVE PROGRESS ---------------- */}
        {currentStep === 4 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1 text-xs text-[#6E757C] hover:text-[#3E4348] transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Syllabus
              </button>
              <span className="text-xs font-mono text-[#E8A5A5] font-bold">
                Save & Begin
              </span>
            </div>

            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 bg-[#E8A5A5]/25 text-[#9E3E3E] border border-[#E8A5A5]/50 text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> Save Your Progress
              </div>
              <h2 className="text-2xl font-black text-[#3E4348]">
                Create Your Profile
              </h2>
              <p className="text-xs text-[#6E757C]">
                Save your progress with Coach {currentAssessingDiscipline.coachPersona.name} to track your mindful hours.
              </p>
            </div>

            {/* Configured Summary Badge */}
            <div className="bg-[#F7F3EE] p-3 rounded-3xl border border-[#E8E2D8] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-2xl bg-white border border-[#E8E2D8]">
                  {getDisciplineIcon(currentAssessingDiscipline.id)}
                </div>
                <div>
                  <span className="font-bold text-[#3E4348] block">{currentAssessingDiscipline.name}</span>
                  <span className="text-[10px] text-[#6E757C] font-mono">
                    {currentLevel.toUpperCase()} • {daysPerWeek}d/wk • {minutesPerDay}m/session
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-[#42592B] bg-[#B5C99A]/30 px-2.5 py-0.5 rounded-full border border-[#B5C99A]/50 font-bold">
                Lesson 1 Ready
              </span>
            </div>

            {/* Error Message */}
            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-2xl font-medium">
                ⚠️ {authError}
              </div>
            )}

            {/* Sign Up Form */}
            <form onSubmit={handleSignUpAndStart} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-[#3E4348] mb-1 uppercase tracking-wider">
                  Your Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="Nat"
                    className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3E4348] mb-1 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nat@example.com"
                    className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-3 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#3E4348] mb-1 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E757C] hover:text-[#3E4348]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-60 transform active:scale-95"
              >
                {isSubmitting ? (
                  <span>Saving & Starting Lesson...</span>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-[#3E4348]" /> Save Progress & Enter Studio Lesson 1
                  </>
                )}
              </button>
            </form>

            {/* Fast 1-Tap Demo Alternative */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={handleFastDemoAndStart}
                className="text-xs text-[#6E757C] hover:text-[#3E4348] underline font-medium cursor-pointer"
              >
                ⚡ Or continue instantly with Demo Athlete (Alex Rivera)
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
