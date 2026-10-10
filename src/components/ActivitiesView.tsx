'use client';

import React from 'react';
import { Discipline, SkillLevel } from '@/types';
import { Sparkles, CheckCircle2, Award, Play, ArrowRight, Activity, Heart, Utensils, Target, BookOpen, Layers } from 'lucide-react';

interface ActivitiesViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  skillLevel: SkillLevel;
  onSelectDiscipline: (d: Discipline) => void;
  onChangeSkillLevel: (level: SkillLevel) => void;
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
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Activity & Sport Selector
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Choose Your Discipline</h2>
          <p className="text-xs text-slate-400">Switch between private AI lessons across multiple sports and skills in one tap</p>
        </div>

        {/* Global Skill Level Switcher */}
        <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Level:</span>
          <div className="flex gap-1">
            {levels.map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => onChangeSkillLevel(lvl.id)}
                className={`text-xs font-bold px-2.5 py-1 rounded-lg transition ${
                  skillLevel === lvl.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
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
              className={`bg-slate-900 rounded-2xl border p-5 shadow-xl flex flex-col justify-between gap-4 transition-all ${
                isActive
                  ? 'border-emerald-500 shadow-emerald-950/40 bg-slate-850/80'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={d.coachPersona.avatar}
                    alt={d.coachPersona.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      {d.name}
                      {isActive && (
                        <span className="text-[9px] font-black uppercase bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">Coach {d.coachPersona.name} • {d.coachPersona.title}</p>
                  </div>
                </div>

                <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                  {d.overallScore} / 10
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {d.description}
              </p>

              {/* Step-by-Step Preview for Beginner */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Current Drill Focus
                </span>
                <p className="font-bold text-white">{d.prescribedDrill}</p>
              </div>

              {/* Action Button */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono text-slate-400">
                  {d.subcomponents.length} Sub-skills Monitored
                </span>

                <button
                  onClick={() => {
                    onSelectDiscipline(d);
                    onGoToStudio();
                  }}
                  className={`text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
                    isActive
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/50'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
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
