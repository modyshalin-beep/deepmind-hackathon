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
      <div className="bg-white rounded-2xl border border-[#D0E6FF] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FF7F2D] uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Activity & Sport Selector
          </span>
          <h2 className="text-2xl font-black text-[#2D2E2E] mt-1">Choose Your Discipline</h2>
          <p className="text-xs text-[#4A4B4B]">Switch between private AI lessons across multiple sports and skills in one tap</p>
        </div>

        {/* Global Skill Level Switcher */}
        <div className="bg-[#F5F6FC] p-2.5 rounded-xl border border-[#D0E6FF] flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#4A4B4B] uppercase tracking-wider pl-1">Level:</span>
          <div className="flex gap-1">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => onChangeSkillLevel(lvl.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  skillLevel === lvl.id
                    ? 'bg-[#FF7F2D] text-white font-black shadow-xs'
                    : 'bg-white text-[#4A4B4B] hover:text-[#2D2E2E]'
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
                  ? 'border-[#FF7F2D] shadow-md shadow-[#FF7F2D]/10 bg-[#FEF6F4]'
                  : 'bg-white border-[#D0E6FF] hover:border-[#9C7BAC]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={d.coachPersona.avatar}
                    alt={d.coachPersona.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7F2D]"
                  />
                  <div>
                    <h3 className="text-base font-bold text-[#2D2E2E] flex items-center gap-2">
                      {d.name}
                      {isActive && (
                        <span className="text-[9px] font-black uppercase bg-[#FF7F2D] text-white px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-[#FF7F2D] font-medium">Coach {d.coachPersona.name} • {d.coachPersona.title}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-[#7CB078] bg-[#F5FAF5] px-2.5 py-1 rounded-full border border-[#7CB078]/40">
                  {d.overallScore} / 10
                </span>
              </div>

              <p className="text-xs text-[#4A4B4B] leading-relaxed">
                {d.description}
              </p>

              {/* Step-by-Step Preview for Beginner */}
              <div className="bg-[#F5F6FC] p-3 rounded-xl border border-[#D0E6FF] text-xs space-y-1">
                <span className="text-[10px] font-bold text-[#4A4B4B] uppercase tracking-wider block">
                  Current Drill Focus
                </span>
                <p className="font-bold text-[#2D2E2E]">{d.prescribedDrill}</p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-[#4A4B4B]">
                  {d.subcomponents.length} Sub-skills Monitored
                </span>

                <button
                  onClick={() => {
                    onSelectDiscipline(d);
                    onGoToStudio();
                  }}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-bold shadow-xs'
                      : 'bg-[#F5F6FC] hover:bg-[#D0E6FF]/40 text-[#4A4B4B] border border-[#D0E6FF]'
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
