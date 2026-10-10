'use client';

import React from 'react';
import { Discipline, CoachProfile } from '@/types';
import { Target, Award, TrendingUp, BookOpen, Clock, AlertCircle, CheckCircle2, ChevronRight, ShieldCheck } from 'lucide-react';

interface MasteryViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  coachProfile: CoachProfile;
  onSelectDiscipline: (d: Discipline) => void;
}

export function MasteryView({ disciplines, activeDiscipline, coachProfile, onSelectDiscipline }: MasteryViewProps) {
  const progressPercent = Math.min(100, (coachProfile.totalHoursLogged / coachProfile.targetHours) * 100);

  const strengths = activeDiscipline.subcomponents.filter(s => s.category === 'strength');
  const weaknesses = activeDiscipline.subcomponents.filter(s => s.category === 'weakness');
  const developing = activeDiscipline.subcomponents.filter(s => s.category === 'developing');

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* 10,000 Hour Tracker Header Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                10,000-HOUR DELIBERATE PRACTICE ENGINE
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-2">Student Mastery Dossier</h2>
            <p className="text-xs text-slate-400">Methodical progression tracked by your private AI coach</p>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Deliberate Hours</span>
              <span className="text-lg font-black text-emerald-400">{coachProfile.totalHoursLogged} <span className="text-xs font-normal text-slate-400">/ 10,000 hrs</span></span>
            </div>
            <Clock className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-300">Mastery Level Progression</span>
            <span className="text-emerald-400">{progressPercent.toFixed(1)}% Completed</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, progressPercent)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Discipline Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {disciplines.map((d) => {
          const isSelected = d.id === activeDiscipline.id;
          return (
            <button
              key={d.id}
              onClick={() => onSelectDiscipline(d)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-950/40'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>{d.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-black/20 text-slate-950 font-black' : 'bg-slate-800 text-emerald-400'}`}>
                {d.overallScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Coach Persona & Adaptable Curriculum Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <img
              src={activeDiscipline.coachPersona.avatar}
              alt={activeDiscipline.coachPersona.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500"
            />
            <div>
              <h3 className="text-base font-bold text-white">{activeDiscipline.coachPersona.name}</h3>
              <p className="text-xs text-emerald-400 font-medium">{activeDiscipline.coachPersona.title}</p>
            </div>
          </div>

          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Persistent Memory Active
          </span>
        </div>

        {/* Coach Prescription Nudge */}
        <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 flex flex-col gap-2">
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Coach's Adaptable Lesson Plan
          </span>
          <h4 className="text-sm font-bold text-white">{activeDiscipline.prescribedDrill}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            &quot;We are taking your strengths (Ball Toss at 8.8) and using them as an anchor while we force you out of your comfort zone on <strong className="text-emerald-300">{activeDiscipline.microFocus}</strong>. Every rep is monitored in 30 FPS Agentic Video bursts to ensure 10,000-hour mastery quality.&quot;
          </p>
        </div>
      </div>

      {/* Skill Matrix Breakdown: Strengths vs. Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths Column */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Validated Strengths (8.0+)
            </h4>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {strengths.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {strengths.map((s) => (
              <div key={s.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="font-black text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">{s.score}/10</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Areas / Weaknesses Column */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4" /> Coach Priority Focus (Weaknesses)
            </h4>
            <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-bold">
              {weaknesses.length + developing.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {[...weaknesses, ...developing].map((s) => (
              <div key={s.id} className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-white">{s.name}</span>
                  <span className="font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800/80">{s.score}/10</span>
                </div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-400 h-full rounded-full" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Long-Term Coach Log Timeline */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-400" /> Persistent Coach Memory Log
        </h3>

        <div className="space-y-3">
          {coachProfile.coachNotesLog.map((log) => (
            <div key={log.id} className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span className="font-bold text-emerald-400">{log.date}</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] text-slate-300 font-mono uppercase">{log.disciplineId}</span>
              </div>
              <p className="text-slate-200 mt-0.5">{log.note}</p>
              <span className="text-[11px] text-emerald-300 font-medium italic mt-1 bg-emerald-950/40 p-2 rounded border border-emerald-900/50">
                👉 Prescription: {log.prescription}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
