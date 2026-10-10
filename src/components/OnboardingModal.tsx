'use client';

import React, { useState } from 'react';
import { Discipline, SkillLevel, CoachProfile, PracticeSchedule } from '@/types';
import {
  ArrowRight, ArrowLeft,
  Activity, Utensils, Heart, Target, BookOpen, Calendar,
  Zap, Check, Play, Music, User, Mail, Lock, Eye, EyeOff, Sparkles
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
  
  const [selectedDisciplineIds, setSelectedDisciplineIds] = useState<string[]>(() => {
    if (preselectedSkillId) return [preselectedSkillId];
    if (isAddingSkillOnly) return [disciplines[0].id];
    if (coachProfile.enrolledDisciplineIds && coachProfile.enrolledDisciplineIds.length > 0) {
      return coachProfile.enrolledDisciplineIds;
    }
    return [activeDiscipline.id];
  });

  const [assessingDisciplineId, setAssessingDisciplineId] = useState<string>(
    preselectedSkillId || selectedDisciplineIds[0] || activeDiscipline.id
  );

  const [skillLevels, setSkillLevels] = useState<Record<string, SkillLevel>>(() => {
    const initial: Record<string, SkillLevel> = {};
    disciplines.forEach(d => {
      initial[d.id] = coachProfile.skillsProgress?.[d.id]?.skillLevel || 'beginner';
    });
    return initial;
  });

  const [daysPerWeek, setDaysPerWeek] = useState<number>(
    coachProfile.schedule?.daysPerWeek || 3
  );
  const [minutesPerDay, setMinutesPerDay] = useState<number>(
    coachProfile.schedule?.minutesPerDay || 30
  );

  const [athleteName, setAthleteName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const totalWeeklyMinutes = daysPerWeek * minutesPerDay;

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
      case 'tennis': return <Activity className="w-4 h-4 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-4 h-4 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-4 h-4 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-4 h-4 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-4 h-4 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-4 h-4 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-4 h-4 text-[#B5C99A]" />;
      default: return <Activity className="w-4 h-4 text-[#A4C2F4]" />;
    }
  };

  const currentLevel = skillLevels[currentAssessingDiscipline.id] || 'beginner';
  const baselineOptions = currentAssessingDiscipline.baselineOptions || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-[#E8E2D8] rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl flex flex-col gap-4 my-auto max-h-[92vh] overflow-y-auto">
        
        {/* Progress Bar (Minimal) */}
        <div className="flex items-center justify-between text-xs text-[#6E757C]">
          <span className="font-semibold text-[#3E4348]">
            {currentStep === 1 && 'Choose Skills'}
            {currentStep === 2 && 'Baseline & Schedule'}
            {currentStep === 3 && 'Syllabus Preview'}
            {currentStep === 4 && 'Save Profile'}
          </span>
          <span className="font-mono text-[11px]">{currentStep}/4</span>
        </div>
        <div className="w-full bg-[#E8E2D8] h-1 rounded-full overflow-hidden -mt-2">
          <div 
            className="bg-[#A4C2F4] h-full transition-all duration-300 rounded-full"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        {/* ---------------- STEP 1: SELECT SKILLS (FLATTENED) ---------------- */}
        {currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#3E4348]">
                {isAddingSkillOnly ? 'Add a Skill' : 'What would you like to practice?'}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
              {disciplines.map((d) => {
                const isSelected = selectedDisciplineIds.includes(d.id);
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDiscipline(d.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#A4C2F4] text-[#3E4348] ring-1 ring-[#A4C2F4]'
                        : 'bg-white border-[#E8E2D8] text-[#6E757C] hover:border-[#E8A5A5]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getDisciplineIcon(d.id)}
                      <div>
                        <span className="font-bold text-xs block text-[#3E4348]">{d.name}</span>
                        <span className="text-[10px] text-[#6E757C]">Coach {d.coachPersona.name.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#A4C2F4] border-[#A4C2F4] text-[#3E4348]' : 'border-[#E8E2D8]'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextStep}
              disabled={selectedDisciplineIds.length === 0}
              className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 2: BASELINE & SCHEDULE (FLATTENED) ---------------- */}
        {currentStep === 2 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1 text-xs text-[#6E757C] hover:text-[#3E4348] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs font-bold text-[#E8A5A5]">
                {currentAssessingDiscipline.name}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-[#3E4348]">
              Your Experience & Schedule
            </h2>

            {/* Baseline Level List */}
            <div className="space-y-1.5">
              {baselineOptions.map((opt) => {
                const isSelected = currentLevel === opt.level;
                return (
                  <div
                    key={opt.level}
                    onClick={() => {
                      setSkillLevels(prev => ({ ...prev, [currentAssessingDiscipline.id]: opt.level }));
                    }}
                    className={`p-3 rounded-2xl border cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#FAF9F6] border-[#A4C2F4] text-[#3E4348] ring-1 ring-[#A4C2F4]'
                        : 'bg-white border-[#E8E2D8] text-[#6E757C] hover:border-[#E8A5A5]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#3E4348]">{opt.title}</span>
                      <span className="text-[10px] text-[#6E757C] font-mono">{opt.badge}</span>
                    </div>
                    <p className="text-[11px] text-[#6E757C] mt-0.5">
                      {opt.definition}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Schedule (Flattened, no nested box) */}
            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#3E4348] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#E8A5A5]" /> Commitment:
                </span>
                <span className="text-xs text-[#6E757C] font-mono">{daysPerWeek} days/wk • {minutesPerDay} min/session</span>
              </div>

              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDaysPerWeek(d)}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      daysPerWeek === d
                        ? 'bg-[#A4C2F4] text-[#3E4348] border-[#A4C2F4]'
                        : 'bg-white text-[#6E757C] border-[#E8E2D8]'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {[15, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setMinutesPerDay(mins)}
                    className={`flex-1 py-1 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      minutesPerDay === mins
                        ? 'bg-[#A4C2F4] text-[#3E4348] border-[#A4C2F4]'
                        : 'bg-white text-[#6E757C] border-[#E8E2D8]'
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleNextStep}
              className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              See Lesson Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ---------------- STEP 3: SYLLABUS READY (CLEAN) ---------------- */}
        {currentStep === 3 && (
          <div className="space-y-3">
            <div>
              <span className="text-[10px] font-mono text-[#E8A5A5] uppercase font-bold block">Syllabus Ready</span>
              <h2 className="text-xl font-black text-[#3E4348]">
                Coach {currentAssessingDiscipline.coachPersona.name}
              </h2>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#FAF9F6] rounded-2xl border border-[#E8E2D8]">
              <img
                src={currentAssessingDiscipline.coachPersona.avatar}
                alt={currentAssessingDiscipline.coachPersona.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E8A5A5] shrink-0"
              />
              <div className="text-xs">
                <span className="font-bold text-[#3E4348] block">{currentAssessingDiscipline.name}</span>
                <span className="text-[#6E757C] text-[11px] block">{currentAssessingDiscipline.coachPersona.voiceStyle} coaching</span>
              </div>
            </div>

            <div className="p-3 bg-white rounded-2xl border border-[#E8E2D8] space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#E8A5A5] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> First Session:
                </span>
                <span className="text-[10px] text-[#6E757C] font-mono">
                  {currentAssessingDiscipline.modules?.[0]?.estimatedMinutes || 12}m
                </span>
              </div>
              <h4 className="text-sm font-bold text-[#3E4348]">
                {currentAssessingDiscipline.modules?.[0]?.title || currentAssessingDiscipline.prescribedDrill}
              </h4>
              <p className="text-xs text-[#6E757C]">
                {currentAssessingDiscipline.modules?.[0]?.subtitle}
              </p>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  if (user) {
                    handleFinish(true);
                  } else {
                    setCurrentStep(4);
                  }
                }}
                className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 rounded-2xl shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
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
                className="w-full text-[#6E757C] hover:text-[#3E4348] font-bold text-xs py-2 transition cursor-pointer text-center"
              >
                View All Lesson Plans
              </button>
            </div>
          </div>
        )}

        {/* ---------------- STEP 4: SIGN UP (CLEAN, DIRECT) ---------------- */}
        {currentStep === 4 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-1 text-xs text-[#6E757C] hover:text-[#3E4348] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
              <span className="text-xs font-mono text-[#E8A5A5] font-bold">
                Save & Start
              </span>
            </div>

            <div>
              <h2 className="text-xl font-black text-[#3E4348]">
                Create Your Profile
              </h2>
              <p className="text-xs text-[#6E757C]">
                Save your progress with Coach {currentAssessingDiscipline.coachPersona.name}.
              </p>
            </div>

            {authError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3 py-2 rounded-xl font-medium">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={handleSignUpAndStart} className="space-y-2.5">
              <div>
                <input
                  type="text"
                  value={athleteName}
                  onChange={(e) => setAthleteName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full bg-[#FAF9F6] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl px-3.5 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full bg-[#FAF9F6] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl px-3.5 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition"
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (6+ chars)"
                  className="w-full bg-[#FAF9F6] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-3.5 pr-9 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E757C] hover:text-[#3E4348]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer mt-1 disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-[#3E4348]" /> Save & Enter Studio
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleFastDemoAndStart}
                className="text-xs text-[#6E757C] hover:text-[#3E4348] underline cursor-pointer"
              >
                ⚡ Continue as Demo Athlete
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
