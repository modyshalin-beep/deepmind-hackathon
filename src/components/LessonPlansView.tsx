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
      case 'tennis': return <Activity className="w-4 h-4 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-4 h-4 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-4 h-4 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-4 h-4 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-4 h-4 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-4 h-4 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-4 h-4 text-[#B5C99A]" />;
      default: return <Activity className="w-4 h-4 text-[#A4C2F4]" />;
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* ---------------- 1. TOP STATS BAR ---------------- */}
      <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-5 flex items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono text-[#E8A5A5] font-bold uppercase tracking-wider block">
            Lesson Plans
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#3E4348]">Your Training Roadmap</h2>
        </div>

        <div className="flex items-center gap-3 text-right">
          <div className="bg-[#F7F3EE] px-3.5 py-1.5 rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] text-[#6E757C] block font-mono">Enrolled</span>
            <span className="text-sm font-black text-[#3E4348]">{enrolledDisciplines.length} Skills</span>
          </div>
          <div className="bg-[#F7F3EE] px-3.5 py-1.5 rounded-2xl border border-[#E8E2D8]">
            <span className="text-[10px] text-[#6E757C] block font-mono">Schedule</span>
            <span className="text-sm font-black text-[#3E4348]">
              {coachProfile.schedule ? `${coachProfile.schedule.daysPerWeek}d / wk` : '3d / wk'}
            </span>
          </div>
        </div>
      </div>

      {/* ---------------- 2. HERO: UP NEXT LESSON (1-TAP LAUNCH) ---------------- */}
      {activeModule && (
        <div className="bg-gradient-to-br from-[#FAF9F6] via-[#F7F3EE] to-[#FAF9F6] border border-[#E8A5A5]/60 rounded-3xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#E8A5A5] text-white text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-xs">
                  <Play className="w-2.5 h-2.5 fill-white" /> Up Next
                </span>
                <span className="text-xs font-semibold text-[#E8A5A5]">
                  {roadmapDiscipline.name} • Module {activeModule.order} of {roadmapDiscipline.modules?.length || 3}
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#3E4348]">
                  {activeModule.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#6E757C] mt-1 line-clamp-2">
                  {activeModule.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono text-[#6E757C]">
                <span className="bg-[#FAF9F6] px-3 py-1 rounded-xl border border-[#E8E2D8] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#A4C2F4]" /> {activeModule.estimatedMinutes}m drill
                </span>
                <span className="bg-[#FAF9F6] px-3 py-1 rounded-xl border border-[#E8E2D8]">
                  Focus: {activeModule.microFocus}
                </span>
              </div>
            </div>

            {/* Launch Action */}
            <div className="w-full md:w-auto shrink-0 flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5 bg-[#FAF9F6] p-2.5 rounded-2xl border border-[#E8E2D8]">
                <img
                  src={roadmapDiscipline.coachPersona.avatar}
                  alt={roadmapDiscipline.coachPersona.name}
                  className="w-9 h-9 rounded-full object-cover border border-[#E8A5A5]"
                />
                <div>
                  <span className="text-xs font-bold text-[#3E4348] block">Coach {roadmapDiscipline.coachPersona.name}</span>
                  <span className="text-[10px] text-[#A4C2F4] block font-mono font-bold">Live Camera & Voice</span>
                </div>
              </div>

              <button
                onClick={() => onStartLesson(roadmapDiscipline, activeModule)}
                className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3.5 px-6 rounded-2xl shadow-sm transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#3E4348]" /> Start Practice Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. ENROLLED SKILLS (CAROUSEL / GRID) ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#3E4348]">My Skills</h3>
          <button
            onClick={onOpenAddSkill}
            className="text-xs font-bold text-[#3E4348] hover:bg-white bg-[#FAF9F6] border border-[#E8E2D8] hover:border-[#A4C2F4] px-3.5 py-1.5 rounded-full transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-[#E8A5A5]" /> Learn Another Skill
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
                className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                  isViewing
                    ? 'bg-[#FAF9F6] border-[#A4C2F4] shadow-sm ring-2 ring-[#A4C2F4]/40'
                    : 'bg-[#FAF9F6] border-[#E8E2D8] hover:border-[#E8A5A5]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-2xl bg-white border border-[#E8E2D8]">
                      {getDisciplineIcon(d.id)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#3E4348]">{d.name}</h4>
                      <span className="text-[10px] text-[#6E757C] font-mono">
                        Level: <strong className="text-[#3E4348] capitalize">{currentLevel}</strong>
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-[#42592B] bg-[#B5C99A]/30 px-2.5 py-0.5 rounded-full border border-[#B5C99A]/50 font-bold">
                    {percent}%
                  </span>
                </div>

                {/* Mini Progress Bar */}
                <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#B5C99A] h-full rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E8E2D8]">
                  <span className="text-[#6E757C] truncate">
                    {completedCount} of {totalModules} modules
                  </span>
                  {nextModule && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectDiscipline(d);
                        onStartLesson(d, nextModule);
                      }}
                      className="text-[#E8A5A5] hover:text-[#3E4348] font-bold flex items-center gap-1 transition"
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
            className="p-4 rounded-3xl border-2 border-dashed border-[#E8E2D8] hover:border-[#A4C2F4] transition flex flex-col items-center justify-center gap-2 text-center text-[#6E757C] hover:text-[#3E4348] bg-[#FAF9F6]/60 cursor-pointer min-h-[120px]"
          >
            <div className="w-8 h-8 rounded-full bg-[#F7F3EE] flex items-center justify-center text-[#6E757C]">
              <Plus className="w-4 h-4 text-[#E8A5A5]" />
            </div>
            <span className="text-xs font-bold">Add Another Skill</span>
          </button>
        </div>
      </div>

      {/* ---------------- 4. MODULES TIMELINE ROADMAP ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#3E4348] flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#A4C2F4]" />
            {roadmapDiscipline.name} Modules
          </h3>
          <span className="text-xs text-[#6E757C]">
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
                className={`p-4 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                  isInProgress
                    ? 'bg-[#FAF9F6] border-[#E8A5A5] shadow-xs ring-1 ring-[#E8A5A5]/30'
                    : isCompleted
                    ? 'bg-[#FAF9F6] border-[#E8E2D8]'
                    : 'bg-[#F7F3EE]/60 border-[#E8E2D8]/60 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 border text-xs font-bold ${
                    isCompleted
                      ? 'bg-[#B5C99A]/30 border-[#B5C99A] text-[#42592B]'
                      : isInProgress
                      ? 'bg-[#E8A5A5] border-[#E8A5A5] text-white'
                      : 'bg-[#F7F3EE] border-[#E8E2D8] text-[#6E757C]'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-[#3E4348] flex items-center gap-2">
                      {mod.title}
                      {isInProgress && (
                        <span className="text-[9px] font-mono bg-[#E8A5A5] text-white px-2.5 py-0.5 rounded-full font-black uppercase">
                          Current
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-[#6E757C] mt-0.5 line-clamp-1">{mod.subtitle}</p>
                    <span className="text-[10px] text-[#6E757C]/80 font-mono mt-1 block">
                      Target: {mod.microFocus} • {mod.estimatedMinutes} mins
                    </span>
                  </div>
                </div>

                {/* Button Action */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                  {isCompleted && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="text-xs font-bold text-[#6E757C] hover:text-[#3E4348] bg-[#F7F3EE] px-3.5 py-1.5 rounded-2xl border border-[#E8E2D8] flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Replay
                    </button>
                  )}

                  {isInProgress && (
                    <button
                      onClick={() => onStartLesson(roadmapDiscipline, mod)}
                      className="bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] text-xs font-black px-4 py-2 rounded-2xl transition flex items-center gap-1.5 cursor-pointer shadow-xs transform active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-[#3E4348]" /> Start Lesson
                    </button>
                  )}

                  {isLocked && (
                    <span className="text-xs text-[#6E757C]/70 flex items-center gap-1 px-3 py-1.5 font-mono">
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
