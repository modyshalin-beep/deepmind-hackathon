'use client';

import React from 'react';
import { Discipline, CoachProfile } from '@/types';
import { Clock, AlertCircle, CheckCircle2, ShieldCheck, BookOpen } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-[#FEF3C7]/60 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#92400E] uppercase bg-[#FEF3C7] border border-[#FDE68A] px-2.5 py-0.5 rounded-full">
                10,000-HOUR DELIBERATE PRACTICE ENGINE
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#182030] mt-2">Student Mastery Dossier</h2>
            <p className="text-xs text-[#5A6578]">Methodical progression tracked by your private AI coach</p>
          </div>

          <div className="flex items-center gap-3 bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4]">
            <div className="text-right">
              <span className="text-[10px] text-[#5A6578] uppercase block font-semibold">Deliberate Hours</span>
              <span className="text-lg font-black text-[#C2410C]">{coachProfile.totalHoursLogged} <span className="text-xs font-normal text-[#5A6578]">/ 10,000 hrs</span></span>
            </div>
            <Clock className="w-6 h-6 text-[#C2410C]" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#5A6578]">Mastery Level Progression</span>
            <span className="text-[#C2410C] font-mono font-bold">{progressPercent.toFixed(1)}% Completed</span>
          </div>
          <div className="w-full bg-[#F4EFE6] h-3 rounded-full overflow-hidden p-0.5 border border-[#E6E0D4]">
            <div
              className="bg-gradient-to-r from-[#D97706] to-[#C2410C] h-full rounded-full transition-all duration-500 shadow-sm"
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
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#C2410C] text-white border-[#C2410C] shadow-xs'
                  : 'bg-white text-[#5A6578] border-[#E6E0D4] hover:border-[#D97706]'
              }`}
            >
              <span>{d.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-black/20 text-white font-black' : 'bg-[#F4EFE6] text-[#C2410C]'}`}>
                {d.overallScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Coach Persona & Adaptable Curriculum Card */}
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-3">
          <div className="flex items-center gap-3">
            <img
              src={activeDiscipline.coachPersona.avatar}
              alt={activeDiscipline.coachPersona.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#C2410C]"
            />
            <div>
              <h3 className="text-base font-bold text-[#182030]">{activeDiscipline.coachPersona.name}</h3>
              <p className="text-xs text-[#C2410C] font-medium">{activeDiscipline.coachPersona.title}</p>
            </div>
          </div>

          <span className="text-xs bg-[#F4EFE6] text-[#182030] px-3 py-1 rounded-lg border border-[#E6E0D4] flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D4ED8]" /> Persistent Memory Active
          </span>
        </div>

        {/* Coach Prescription Nudge */}
        <div className="bg-[#F4EFE6] p-4 rounded-xl border border-[#E6E0D4] flex flex-col gap-2">
          <span className="text-xs font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Coach&apos;s Adaptable Lesson Plan
          </span>
          <h4 className="text-sm font-bold text-[#182030]">{activeDiscipline.prescribedDrill}</h4>
          <p className="text-xs text-[#5A6578] leading-relaxed">
            &quot;We are taking your strengths (Ball Toss at 8.8) and using them as an anchor while we force you out of your comfort zone on <strong className="text-[#C2410C]">{activeDiscipline.microFocus}</strong>. Every rep is monitored in 30 FPS Agentic Video bursts to ensure 10,000-hour mastery quality.&quot;
          </p>
        </div>
      </div>

      {/* Skill Matrix Breakdown: Strengths vs. Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths Column */}
        <div className="bg-white rounded-2xl border border-[#E6E0D4] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-2.5">
            <h4 className="text-xs font-bold text-[#182030] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#D97706]" /> Validated Strengths (8.0+)
            </h4>
            <span className="text-[10px] bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-2 py-0.5 rounded-full font-bold">
              {strengths.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {strengths.map((s) => (
              <div key={s.id} className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#182030]">{s.name}</span>
                  <span className="font-black text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">{s.score}/10</span>
                </div>
                <div className="w-full bg-[#E6E0D4] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#D97706] h-full rounded-full shadow-xs" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Areas / Weaknesses Column */}
        <div className="bg-white rounded-2xl border border-[#E6E0D4] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-2.5">
            <h4 className="text-xs font-bold text-[#C2410C] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#C2410C]" /> Coach Priority Focus (Weaknesses)
            </h4>
            <span className="text-[10px] bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA] px-2 py-0.5 rounded-full font-bold">
              {weaknesses.length + developing.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {[...weaknesses, ...developing].map((s) => (
              <div key={s.id} className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#182030]">{s.name}</span>
                  <span className="font-black text-[#C2410C] bg-[#FFEDD5] px-2 py-0.5 rounded border border-[#FED7AA]">{s.score}/10</span>
                </div>
                <div className="w-full bg-[#E6E0D4] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C2410C] h-full rounded-full" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Long-Term Coach Log Timeline */}
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#5A6578] uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#C2410C]" /> Persistent Coach Memory Log
        </h3>

        <div className="space-y-3">
          {coachProfile.coachNotesLog.map((log) => (
            <div key={log.id} className="bg-[#F4EFE6] p-3.5 rounded-xl border border-[#E6E0D4] flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-[#5A6578]">
                <span className="font-bold text-[#C2410C]">{log.date}</span>
                <span className="bg-white px-2 py-0.5 rounded text-[10px] text-[#1D4ED8] font-mono uppercase border border-[#E6E0D4]">{log.disciplineId}</span>
              </div>
              <p className="text-[#182030] mt-0.5">{log.note}</p>
              <span className="text-[11px] text-[#92400E] font-medium italic mt-1 bg-[#FEF3C7] p-2 rounded border border-[#FDE68A]">
                👉 Prescription: {log.prescription}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
