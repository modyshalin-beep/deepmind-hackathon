'use client';

import React, { useState } from 'react';
import { Discipline, CoachProfile, CourseModule, SkillLevel } from '@/types';
import { 
  Play, CheckCircle2, Lock, Clock, Sparkles, BookOpen, 
  ArrowRight, Plus, Activity, Utensils, Heart, Target, 
  ChevronRight, RotateCcw, Zap, Music
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
      case 'tennis': return <Activity className="w-4 h-4 text-emerald-400" />;
      case 'boxing': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'dance': return <Sparkles className="w-4 h-4 text-fuchsia-400" />;
      case 'cooking': return <Utensils className="w-4 h-4 text-cyan-400" />;
      case 'guitar': return <Music className="w-4 h-4 text-violet-400" />;
      case 'yoga': return <Heart className="w-4 h-4 text-rose-400" />;
      case 'golf': return <Target className="w-4 h-4 text-emerald-400" />;
      default: return <Activity className="w-4 h-4 text-emerald-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* ---------------- 1. TOP STATS BAR ---------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            Lesson Plans
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Your Training Roadmap</h2>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Enrolled</span>
            <span className="text-sm font-black text-white">{enrolledDisciplines.length} Skills</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-mono">Schedule</span>
            <span className="text-sm font-black text-emerald-400">
              {coachProfile.schedule ? `${coachProfile.schedule.daysPerWeek}d / wk` : '3d / wk'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- 2. HERO: UP NEXT LESSON (1-TAP LAUNCH) ---------------- */}
      {activeModule && (
        <div className="bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/50 rounded-3xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-slate-950" /> Up Next
                </span>
                <span className="text-xs font-semibold text-emerald-400">
                  {roadmapDiscipline.name} • Module {activeModule.order} of {roadmapDiscipline.modules?.length || 3}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  {activeModule.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 line-clamp-2">
                  {activeModule.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-slate-400">
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" /> {activeModule.estimatedMinutes}m drill
                </span>
                <span className="bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                  Focus: {activeModule.microFocus}
                </span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
              <div className="flex items-center gap-2.5 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                <img
                  src={roadmapDiscipline.coachPersona.avatar}
                  alt={roadmapDiscipline.coachPersona.name}
                  className="w-9 h-9 rounded-full object-cover border border-emerald-400"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Coach {roadmapDiscipline.coachPersona.name}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">Live Camera & Voice</span>
                </div>
              </div>

              <button
                onClick={() => onStartLesson(roadmapDiscipline, activeModule)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3 px-6 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Practice Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. ENROLLED SKILLS (CAROUSEL / GRID) ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">My Skills</h3>
          <button
            onClick={onOpenAddSkill}
            className="text-xs font-bold text-emerald-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-emerald-500 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
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
                    ? 'bg-slate-850/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {getDisciplineIcon(d.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{d.name}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Level: <strong className="text-emerald-400 capitalize">{currentLevel}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-900">
                    {percent}%
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800/80">
                  <span className="text-slate-400 truncate">
                    {completedCount} of {totalModules} modules
                  </span>
                  {nextModule && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDiscipline(d);
                        onStartLesson(d, nextModule);
                      }}
                      className="text-emerald-400 hover:text-white font-bold flex items-center gap-1"
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
            className="p-4 rounded-2xl border-2 border-dashed border-slate-800 hover:border-emerald-500/60 transition flex flex-col items-center justify-center gap-2 text-center text-slate-400 hover:text-white bg-slate-900/40 cursor-pointer min-h-[120px]"
          >
            <div className="w-8 h-8 rounded-full bg-slate-850 flex items-center justify-center text-slate-400">
              <Plus className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold">Add Another Skill</span>
          </button>
        </div>
      </div>

      {/* ---------------- 4. MODULES TIMELINE ROADMAP ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            {roadmapDiscipline.name} Modules
          </h3>
          <span className="text-xs text-slate-400">
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
                    ? 'bg-slate-850 border-emerald-400/80 shadow-md'
                    : isCompleted
                    ? 'bg-slate-900/90 border-slate-800'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isCompleted
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : isInProgress
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {mod.title}
                      {isInProgress && (
                        <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 px-2 py-0.2 rounded font-black uppercase">
                          Current
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                      Target: {mod.microFocus} • {mod.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Button Action */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                  {isCompleted && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Replay
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Play className="w-3.5 h-3.5 fill-slate-950" /> Start Lesson
                    </button>
                  )}

                  {isLocked && (
                    <span className="text-xs text-slate-500 flex items-center gap-1 px-3 py-1.5 font-mono">
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
