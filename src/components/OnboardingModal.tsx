'use client';

import React from 'react';
import { Discipline, SkillLevel } from '@/types';
import { Sparkles, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';

interface OnboardingModalProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  skillLevel: SkillLevel;
  onSelectDiscipline: (d: Discipline) => void;
  onChangeSkillLevel: (lvl: SkillLevel) => void;
  onCompleteOnboarding: () => void;
}

export function OnboardingModal({
  disciplines,
  activeDiscipline,
  skillLevel,
  onSelectDiscipline,
  onChangeSkillLevel,
  onCompleteOnboarding,
}: OnboardingModalProps) {
  const levels: { id: SkillLevel; title: string; desc: string; badge: string }[] = [
    {
      id: 'beginner',
      title: 'Beginner (Recommended)',
      desc: 'Coach provides conversational step-by-step guidance, checks setup pose before starting, and moves at your pace.',
      badge: 'Step-by-Step Guidance',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      desc: 'Coach provides rhythm coaching, tempo cues, and corrective alerts without repetitive beginner explanations.',
      badge: 'Pacing & Form Corrections',
    },
    {
      id: 'advanced',
      title: 'Advanced / Elite',
      desc: 'Coach focuses purely on high-velocity micro-adjustments, sub-second 30 FPS burst metrics, and fatigue push.',
      badge: 'High-Velocity Focus',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#E6E0D4] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Pocket Coach
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#182030]">Choose Your Activity & Level</h2>
          <p className="text-xs sm:text-sm text-[#5A6578]">
            If you don&apos;t choose a skill level, you are automatically set as a <strong className="text-[#C2410C]">Beginner</strong> so your coach guides you step-by-step!
          </p>
        </div>

        {/* Activity Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wider block">
            1. Select Your Discipline:
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {disciplines.map((d) => {
              const isSelected = d.id === activeDiscipline.id;
              return (
                <button
                  key={d.id}
                  onClick={() => onSelectDiscipline(d)}
                  className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between gap-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFEDD5] border-[#C2410C] text-[#182030] shadow-xs'
                      : 'bg-[#F4EFE6] border-[#E6E0D4] text-[#182030] hover:border-[#D97706]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#182030]">{d.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#C2410C] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#5A6578] line-clamp-1">{d.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill Level Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#5A6578] uppercase tracking-wider block">
            2. Select Your Skill Level:
          </label>
          <div className="space-y-2">
            {levels.map((lvl) => {
              const isSelected = skillLevel === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => onChangeSkillLevel(lvl.id)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFEDD5] border-[#C2410C] text-[#182030] shadow-xs'
                      : 'bg-[#F4EFE6] border-[#E6E0D4] text-[#182030] hover:border-[#D97706]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#C2410C] bg-[#C2410C]' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#182030]">{lvl.title}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-[#C2410C] border border-[#E6E0D4]">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#5A6578] mt-1">{lvl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Beginner Step-by-Step Preview Card */}
        {skillLevel === 'beginner' && (
          <div className="bg-[#F4EFE6] p-4 rounded-2xl border border-[#E6E0D4] space-y-2">
            <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Beginner Coach Preview: {activeDiscipline.name}
            </span>
            <p className="text-xs text-[#5A6578]">
              Coach {activeDiscipline.coachPersona.name} will explain the following step-by-step setup in your AirPods before starting:
            </p>
            <ul className="text-xs text-[#182030] space-y-1 list-disc pl-4 font-mono">
              {activeDiscipline.beginnerStepByStepPrep.slice(0, 3).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Onboarding Button */}
        <button
          onClick={onCompleteOnboarding}
          className="w-full bg-[#C2410C] hover:bg-[#9a3412] text-white font-black text-base py-4 rounded-2xl shadow-md shadow-[#C2410C]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          Start Private Lesson as {skillLevel.toUpperCase()} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
