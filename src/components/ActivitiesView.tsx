'use client';

import React from 'react';
import { Discipline, SkillLevel } from '@/types';
import { Layers, ArrowRight } from 'lucide-react';

interface ActivitiesViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  skillLevel: SkillLevel;
  onSelectDiscipline: (d: Discipline) => void;
  onChangeSkillLevel: (lvl: SkillLevel) => void;
  onGoToStudio: () => void;
}

export function ActivitiesView({
  disciplines,
  activeDiscipline,
  skillLevel,
  onSelectDiscipline,
  onChangeSkillLevel,
  onGoToStudio,
}: ActivitiesViewProps) {
  const levels: { id: SkillLevel; label: string }[] = [
    { id: 'beginner', label: 'Beginner (Step-by-Step)' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced / Elite' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C2410C] uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Activity & Sport Selector
          </span>
          <h2 className="text-2xl font-black text-[#182030] mt-1">Choose Your Discipline</h2>
          <p className="text-xs text-[#5A6578]">Switch between private AI lessons across multiple sports and skills in one tap</p>
        </div>

        {/* Global Skill Level Switcher */}
        <div className="bg-[#F4EFE6] p-2.5 rounded-xl border border-[#E6E0D4] flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider pl-1">Level:</span>
          <div className="flex gap-1">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => onChangeSkillLevel(lvl.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  skillLevel === lvl.id
                    ? 'bg-[#C2410C] text-white font-black shadow-xs'
                    : 'bg-white text-[#5A6578] hover:text-[#182030]'
                }`}
              >
                {lvl.id.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sport Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {disciplines.map((d) => {
          const isActive = d.id === activeDiscipline.id;
          return (
            <div
              key={d.id}
              className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between gap-4 transition-all ${
                isActive
                  ? 'border-[#C2410C] shadow-md shadow-[#C2410C]/10 bg-[#FFFDF9]'
                  : 'bg-white border-[#E6E0D4] hover:border-[#D97706]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={d.coachPersona.avatar}
                    alt={d.coachPersona.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#C2410C]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#182030] flex items-center gap-2">
                      {d.name}
                      {isActive && (
                        <span className="text-[9px] font-black uppercase bg-[#C2410C] text-white px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#C2410C] font-medium">Coach {d.coachPersona.name} • {d.coachPersona.title}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-[#92400E] bg-[#FEF3C7] px-2.5 py-1 rounded-full border border-[#FDE68A]">
                  {d.overallScore} / 10
                </span>
              </div>

              <p className="text-xs text-[#5A6578] leading-relaxed">
                {d.description}
              </p>

              {/* Step-by-Step Preview for Beginner */}
              <div className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#5A6578] uppercase tracking-wider block">
                  Current Drill Focus
                </span>
                <p className="font-bold text-[#182030]">{d.prescribedDrill}</p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-[#5A6578]">
                  {d.subcomponents.length} Sub-skills Monitored
                </span>

                <button
                  onClick={() => {
                    onSelectDiscipline(d);
                    onGoToStudio();
                  }}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold shadow-xs'
                      : 'bg-[#F4EFE6] hover:bg-[#E6E0D4] text-[#182030] border border-[#E6E0D4]'
                  }`}
                >
                  {isActive ? 'Continue Lesson' : 'Switch to Sport'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
