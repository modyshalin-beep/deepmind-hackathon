'use client';

import React, { useState } from 'react';
import { Discipline, CoachProfile, CourseModule } from '@/types';
import { 
  Play, CheckCircle2, Lock, Clock, BookOpen, 
  ArrowRight, Plus, Activity, Utensils, Heart, Target, 
  RotateCcw, Zap, Music, Sparkles
} from 'lucide-react';

interface LessonPlansViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  coachProfile: CoachProfile;
  onSelectDiscipline: (d: Discipline) => void;
  onStartLesson: (discipline: Discipline, module: CourseModule) => void;
  onOpenAddSkill: () => void;
}

export function LessonPlansView({
  disciplines,
  activeDiscipline,
  coachProfile,
  onSelectDiscipline,
  onStartLesson,
  onOpenAddSkill,
}: LessonPlansViewProps) {
  const enrolledIds = coachProfile.enrolledDisciplineIds || [activeDiscipline.id];
  const enrolledDisciplines = disciplines.filter(d => enrolledIds.includes(d.id));

  // Current roadmap viewing discipline
  const [roadmapDisciplineId, setRoadmapDisciplineId] = useState<string>(activeDiscipline.id);

  const roadmapDiscipline = 
    disciplines.find(d => d.id === roadmapDisciplineId) || 
    activeDiscipline;

  const currentSkillProgress = coachProfile.skillsProgress?.[roadmapDiscipline.id];
  const activeModule = roadmapDiscipline.modules?.find(
    m => m.id === currentSkillProgress?.currentModuleId
  ) || roadmapDiscipline.modules?.find(m => m.status === 'in_progress') || roadmapDiscipline.modules?.[0];

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-4 h-4 text-[#FF7F2D]" />;
      case 'boxing': return <Zap className="w-4 h-4 text-[#FF7F2D]" />;
      case 'dance': return <Sparkles className="w-4 h-4 text-[#9C7BAC]" />;
      case 'cooking': return <Utensils className="w-4 h-4 text-[#4CB1FF]" />;
      case 'guitar': return <Music className="w-4 h-4 text-[#9C7BAC]" />;
      case 'yoga': return <Heart className="w-4 h-4 text-[#FF7F2D]" />;
      case 'golf': return <Target className="w-4 h-4 text-[#7CB078]" />;
      default: return <Activity className="w-4 h-4 text-[#FF7F2D]" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* ---------------- 1. TOP STATS BAR ---------------- */}
      <div className="bg-white border border-[#D0E6FF] rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono text-[#FF7F2D] font-bold uppercase tracking-wider block">
            Lesson Plans
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#2D2E2E]">Your Training Roadmap</h2>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="bg-[#F5F6FC] px-3 py-1.5 rounded-xl border border-[#D0E6FF]">
            <span className="text-[10px] text-[#4A4B4B] block font-mono">Enrolled</span>
            <span className="text-sm font-black text-[#2D2E2E]">{enrolledDisciplines.length} Skills</span>
          </div>
          <div className="bg-[#F5F6FC] px-3 py-1.5 rounded-xl border border-[#D0E6FF]">
            <span className="text-[10px] text-[#4A4B4B] block font-mono">Schedule</span>
            <span className="text-sm font-black text-[#FF7F2D]">
              {coachProfile.schedule ? `${coachProfile.schedule.daysPerWeek}d / wk` : '3d / wk'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- 2. HERO: UP NEXT LESSON (1-TAP LAUNCH) ---------------- */}
      {activeModule && (
        <div className="bg-gradient-to-br from-[#FEF6F4] via-white to-[#F5F6FC] border border-[#FF7F2D]/40 rounded-3xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#FF7F2D] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-white" /> Up Next
                </span>
                <span className="text-xs font-semibold text-[#FF7F2D]">
                  {roadmapDiscipline.name} • Module {activeModule.order} of {roadmapDiscipline.modules?.length || 3}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#2D2E2E]">
                  {activeModule.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#4A4B4B] mt-1 line-clamp-2">
                  {activeModule.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-[#4A4B4B]">
                <span className="bg-white px-2.5 py-1 rounded-lg border border-[#D0E6FF] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF7F2D]" /> {activeModule.estimatedMinutes}m drill
                </span>
                <span className="bg-white px-2.5 py-1 rounded-lg border border-[#D0E6FF]">
                  Focus: {activeModule.microFocus}
                </span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 bg-white p-2.5 rounded-xl border border-[#D0E6FF]">
                <img
                  src={roadmapDiscipline.coachPersona.avatar}
                  alt={roadmapDiscipline.coachPersona.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#FF7F2D]"
                />
                <div>
                  <span className="text-xs font-bold text-[#2D2E2E] block">Coach {roadmapDiscipline.coachPersona.name}</span>
                  <span className="text-[10px] text-[#FF7F2D] block font-mono font-bold">Live Camera & Voice</span>
                </div>
              </div>

              <button
                onClick={() => onStartLesson(roadmapDiscipline, activeModule)}
                className="w-full bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-sm py-3 px-6 rounded-2xl shadow-md shadow-[#FF7F2D]/25 transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" /> Start Practice Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. ENROLLED SKILLS (CAROUSEL / GRID) ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#2D2E2E]">My Skills</h3>
          <button
            onClick={onOpenAddSkill}
            className="text-xs font-bold text-[#FF7F2D] hover:text-[#e66c1e] bg-white border border-[#D0E6FF] hover:border-[#FF7F2D] px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Learn Another Skill
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {enrolledDisciplines.map((d) => {
            const isViewing = d.id === roadmapDiscipline.id;
            const progress = coachProfile.skillsProgress?.[d.id];
            const currentLevel = progress?.skillLevel || 'beginner';
            const completedCount = progress?.completedModuleIds?.length || 0;
            const totalModules = d.modules?.length || 3;
            const percent = progress?.progressPercent || Math.round((completedCount / totalModules) * 100) || 20;

            const nextModule = d.modules?.find(m => m.id === progress?.currentModuleId) || 
                               d.modules?.find(m => m.status === 'in_progress') || 
                               d.modules?.[0];

            return (
              <div
                key={d.id}
                onClick={() => {
                  setRoadmapDisciplineId(d.id);
                  onSelectDiscipline(d);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isViewing
                    ? 'bg-[#FEF6F4] border-[#FF7F2D] shadow-xs ring-1 ring-[#FF7F2D]/40'
                    : 'bg-white border-[#D0E6FF] hover:border-[#9C7BAC]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-white border border-[#D0E6FF]">
                      {getDisciplineIcon(d.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2D2E2E]">{d.name}</h4>
                      <span className="text-[10px] text-[#4A4B4B] font-mono">
                        Level: <strong className="text-[#FF7F2D] capitalize">{currentLevel}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#7CB078] bg-[#F5FAF5] px-2 py-0.5 rounded border border-[#7CB078]/40">
                    {percent}%
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-[#D0E6FF] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#FF7F2D] h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#D0E6FF]">
                  <span className="text-[#4A4B4B] truncate">
                    {completedCount} of {totalModules} modules
                  </span>
                  {nextModule && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDiscipline(d);
                        onStartLesson(d, nextModule);
                      }}
                      className="text-[#FF7F2D] hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Resume</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Quick Add Card */}
          <button
            onClick={onOpenAddSkill}
            className="p-4 rounded-2xl border-2 border-dashed border-[#D0E6FF] hover:border-[#FF7F2D] transition flex flex-col items-center justify-center gap-2 text-center text-[#4A4B4B] hover:text-[#2D2E2E] bg-white/60 cursor-pointer min-h-[120px]"
          >
            <div className="w-8 h-8 rounded-full bg-[#F5F6FC] flex items-center justify-center text-[#4A4B4B]">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Add Another Skill</span>
          </button>
        </div>
      </div>

      {/* ---------------- 4. MODULES TIMELINE ROADMAP ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#2D2E2E] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#FF7F2D]" />
            {roadmapDiscipline.name} Modules
          </h3>
          <span className="text-xs text-[#4A4B4B]">
            {roadmapDiscipline.modules?.length || 3} progressive modules
          </span>
        </div>

        <div className="space-y-2.5">
          {roadmapDiscipline.modules?.map((mod) => {
            const isCompleted = mod.status === 'completed';
            const isInProgress = mod.status === 'in_progress';
            const isLocked = mod.status === 'locked';

            return (
              <div
                key={mod.id}
                className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                  isInProgress
                    ? 'bg-[#FEF6F4] border-[#FF7F2D]/80 shadow-xs'
                    : isCompleted
                    ? 'bg-white border-[#D0E6FF]'
                    : 'bg-[#F5F6FC]/60 border-[#D0E6FF]/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isCompleted
                      ? 'bg-[#F5FAF5] border-[#7CB078] text-[#7CB078]'
                      : isInProgress
                      ? 'bg-[#FF7F2D] border-[#FF7F2D] text-white'
                      : 'bg-[#F5F6FC] border-[#D0E6FF] text-[#4A4B4B]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#2D2E2E] flex items-center gap-2">
                      {mod.title}
                      {isInProgress && (
                        <span className="text-[9px] font-mono bg-[#FF7F2D] text-white px-2 py-0.2 rounded font-black uppercase">
                          Current
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#4A4B4B] mt-0.5 line-clamp-1">{mod.subtitle}</p>
                    <span className="text-[10px] text-[#4A4B4B]/80 font-mono mt-1 block">
                      Target: {mod.microFocus} • {mod.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Button Action */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                  {isCompleted && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="text-xs font-bold text-[#4A4B4B] hover:text-[#2D2E2E] bg-[#F5F6FC] px-3 py-1.5 rounded-xl border border-[#D0E6FF] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Replay
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="bg-[#FF7F2D] hover:bg-[#e66c1e] text-white text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" /> Start Lesson
                    </button>
                  )}

                  {isLocked && (
                    <span className="text-xs text-[#4A4B4B]/70 flex items-center gap-1 px-3 py-1.5 font-mono">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
