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
      <div className="bg-white rounded-2xl border border-[#D0E6FF] p-5 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-[#9C7BAC]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-[#9C7BAC] uppercase bg-[#F5F6FC] border border-[#9C7BAC]/40 px-2.5 py-0.5 rounded-full">
                10,000-HOUR DELIBERATE PRACTICE ENGINE
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#2D2E2E] mt-2">Student Mastery Dossier</h2>
            <p className="text-xs text-[#4A4B4B]">Methodical progression tracked by your private AI coach</p>
          </div>

          <div className="flex items-center gap-3 bg-[#F5F6FC] p-3 rounded-xl border border-[#D0E6FF]">
            <div className="text-right">
              <span className="text-[10px] text-[#4A4B4B] uppercase block font-semibold">Deliberate Hours</span>
              <span className="text-lg font-black text-[#FF7F2D]">{coachProfile.totalHoursLogged} <span className="text-xs font-normal text-[#4A4B4B]">/ 10,000 hrs</span></span>
            </div>
            <Clock className="w-6 h-6 text-[#FF7F2D]" />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#4A4B4B]">Mastery Level Progression</span>
            <span className="text-[#FF7F2D] font-mono font-bold">{progressPercent.toFixed(1)}% Completed</span>
          </div>
          <div className="w-full bg-[#F5F6FC] h-3 rounded-full overflow-hidden p-0.5 border border-[#D0E6FF]">
            <div
              className="bg-gradient-to-r from-[#FF7F2D] to-[#9C7BAC] h-full rounded-full transition-all duration-500 shadow-sm"
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
                  ? 'bg-[#FF7F2D] text-white border-[#FF7F2D] shadow-xs'
                  : 'bg-white text-[#4A4B4B] border-[#D0E6FF] hover:border-[#9C7BAC]'
              }`}
            >
              <span>{d.name}</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${isSelected ? 'bg-black/20 text-white font-black' : 'bg-[#F5F6FC] text-[#FF7F2D]'}`}>
                {d.overallScore}
              </span>
            </button>
          );
        })}
      </div>

      {/* Coach Persona & Adaptable Curriculum Card */}
      <div className="bg-white rounded-2xl border border-[#D0E6FF] p-5 shadow-xs flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-[#D0E6FF] pb-3">
          <div className="flex items-center gap-3">
            <img
              src={activeDiscipline.coachPersona.avatar}
              alt={activeDiscipline.coachPersona.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7F2D]"
            />
            <div>
              <h3 className="text-base font-bold text-[#2D2E2E]">{activeDiscipline.coachPersona.name}</h3>
              <p className="text-xs text-[#FF7F2D] font-medium">{activeDiscipline.coachPersona.title}</p>
            </div>
          </div>

          <span className="text-xs bg-[#F5F6FC] text-[#2D2E2E] px-3 py-1 rounded-lg border border-[#D0E6FF] flex items-center gap-1.5 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4CB1FF]" /> Persistent Memory Active
          </span>
        </div>

        {/* Coach Prescription Nudge */}
        <div className="bg-[#FEF6F4] p-4 rounded-xl border border-[#FF7F2D]/30 flex flex-col gap-2">
          <span className="text-xs font-bold text-[#FF7F2D] uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" /> Coach&apos;s Adaptable Lesson Plan
          </span>
          <h4 className="text-sm font-bold text-[#2D2E2E]">{activeDiscipline.prescribedDrill}</h4>
          <p className="text-xs text-[#4A4B4B] leading-relaxed">
            &quot;We are taking your strengths (Ball Toss at 8.8) and using them as an anchor while we force you out of your comfort zone on <strong className="text-[#FF7F2D]">{activeDiscipline.microFocus}</strong>. Every rep is monitored in 30 FPS Agentic Video bursts to ensure 10,000-hour mastery quality.&quot;
          </p>
        </div>
      </div>

      {/* Skill Matrix Breakdown: Strengths vs. Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strengths Column */}
        <div className="bg-white rounded-2xl border border-[#D0E6FF] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D0E6FF] pb-2.5">
            <h4 className="text-xs font-bold text-[#2D2E2E] uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#7CB078]" /> Validated Strengths (8.0+)
            </h4>
            <span className="text-[10px] bg-[#F5FAF5] text-[#7CB078] border border-[#7CB078]/40 px-2 py-0.5 rounded-full font-bold">
              {strengths.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {strengths.map((s) => (
              <div key={s.id} className="bg-[#F5F6FC] p-3 rounded-xl border border-[#D0E6FF] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2D2E2E]">{s.name}</span>
                  <span className="font-black text-[#7CB078] bg-[#F5FAF5] px-2 py-0.5 rounded border border-[#7CB078]/40">{s.score}/10</span>
                </div>
                <div className="w-full bg-[#D0E6FF] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#7CB078] h-full rounded-full shadow-xs" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Focus Areas / Weaknesses Column */}
        <div className="bg-white rounded-2xl border border-[#D0E6FF] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#D0E6FF] pb-2.5">
            <h4 className="text-xs font-bold text-[#FF7F2D] uppercase tracking-wider flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-[#FF7F2D]" /> Coach Priority Focus (Weaknesses)
            </h4>
            <span className="text-[10px] bg-[#FEF6F4] text-[#FF7F2D] border border-[#FF7F2D]/40 px-2 py-0.5 rounded-full font-bold">
              {weaknesses.length + developing.length} Subcomponents
            </span>
          </div>

          <div className="space-y-2.5">
            {[...weaknesses, ...developing].map((s) => (
              <div key={s.id} className="bg-[#F5F6FC] p-3 rounded-xl border border-[#D0E6FF] space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#2D2E2E]">{s.name}</span>
                  <span className="font-black text-[#FF7F2D] bg-[#FEF6F4] px-2 py-0.5 rounded border border-[#FF7F2D]/40">{s.score}/10</span>
                </div>
                <div className="w-full bg-[#D0E6FF] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#FF7F2D] h-full rounded-full" style={{ width: `${(s.score / 10) * 100}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Long-Term Coach Log Timeline */}
      <div className="bg-white rounded-2xl border border-[#D0E6FF] p-5 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-[#4A4B4B] uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-[#9C7BAC]" /> Persistent Coach Memory Log
        </h3>

        <div className="space-y-3">
          {coachProfile.coachNotesLog.map((log) => (
            <div key={log.id} className="bg-[#F5F6FC] p-3.5 rounded-xl border border-[#D0E6FF] flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between text-[#4A4B4B]">
                <span className="font-bold text-[#FF7F2D]">{log.date}</span>
                <span className="bg-white px-2 py-0.5 rounded text-[10px] text-[#9C7BAC] font-mono uppercase border border-[#D0E6FF]">{log.disciplineId}</span>
              </div>
              <p className="text-[#2D2E2E] mt-0.5">{log.note}</p>
              <span className="text-[11px] text-[#7CB078] font-medium italic mt-1 bg-[#F5FAF5] p-2 rounded border border-[#7CB078]/40">
                👉 Prescription: {log.prescription}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
