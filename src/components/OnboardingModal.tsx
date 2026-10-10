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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white border border-[#D0E6FF] rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-[#FEF6F4] text-[#FF7F2D] border border-[#FF7F2D]/40 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Welcome to Pocket Coach
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#2D2E2E]">Choose Your Activity & Level</h2>
          <p className="text-xs sm:text-sm text-[#4A4B4B]">
            If you don&apos;t choose a skill level, you are automatically set as a <strong className="text-[#FF7F2D]">Beginner</strong> so your coach guides you step-by-step!
          </p>
        </div>

        {/* Activity Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#4A4B4B] uppercase tracking-wider block">
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
                      ? 'bg-[#FEF6F4] border-[#FF7F2D] text-[#2D2E2E] shadow-xs'
                      : 'bg-[#F5F6FC] border border-[#D0E6FF] text-[#2D2E2E] hover:border-[#9C7BAC]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#2D2E2E]">{d.name}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#FF7F2D] shrink-0" />}
                  </div>
                  <span className="text-[11px] text-[#4A4B4B] line-clamp-1">{d.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill Level Selection */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-[#4A4B4B] uppercase tracking-wider block">
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
                      ? 'bg-[#FEF6F4] border-[#FF7F2D] text-[#2D2E2E] shadow-xs'
                      : 'bg-[#F5F6FC] border border-[#D0E6FF] text-[#2D2E2E] hover:border-[#9C7BAC]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#FF7F2D] bg-[#FF7F2D]' : 'border-slate-300'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#2D2E2E]">{lvl.title}</span>
                      <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded text-[#FF7F2D] border border-[#D0E6FF]">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-[#4A4B4B] mt-1">{lvl.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Beginner Step-by-Step Preview Card */}
        {skillLevel === 'beginner' && (
          <div className="bg-[#F5F6FC] p-4 rounded-2xl border border-[#D0E6FF] space-y-2">
            <span className="text-xs font-bold text-[#FF7F2D] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Beginner Coach Preview: {activeDiscipline.name}
            </span>
            <p className="text-xs text-[#4A4B4B]">
              Coach {activeDiscipline.coachPersona.name} will explain the following step-by-step setup in your AirPods before starting:
            </p>
            <ul className="text-xs text-[#2D2E2E] space-y-1 list-disc pl-4 font-mono">
              {activeDiscipline.beginnerStepByStepPrep.slice(0, 3).map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Complete Onboarding Button */}
        <button
          onClick={onCompleteOnboarding}
          className="w-full bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-base py-4 rounded-2xl shadow-md shadow-[#FF7F2D]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          Start Private Lesson as {skillLevel.toUpperCase()} <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
