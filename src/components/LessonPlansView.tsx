'use client';

import React, { useState } from 'react';
import { Discipline, CoachProfile, CourseModule } from '@/types';
import { 
  Play, CheckCircle2, Lock, Clock, BookOpen, RotateCcw, 
  Target, Award, Calendar, ChevronDown, ChevronUp
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
  activeDiscipline,
  coachProfile,
  onStartLesson,
}: LessonPlansViewProps) {
  const currentSkillProgress = coachProfile.skillsProgress?.[activeDiscipline.id];
  const activeModule = activeDiscipline.modules?.find(
    m => m.id === currentSkillProgress?.currentModuleId
  ) || activeDiscipline.modules?.find(m => m.status === 'in_progress') || activeDiscipline.modules?.[0];

  const totalModules = activeDiscipline.modules?.length || 3;
  const completedCount = currentSkillProgress?.completedModuleIds?.length || 0;
  const progressPercent = currentSkillProgress?.progressPercent || Math.round((completedCount / totalModules) * 100);

  // Current skill level & milestone goal
  const currentLevelNumber = completedCount >= 4 ? 3 : completedCount >= 2 ? 2 : 1;
  const levelNames = ['Level 1: Foundation', 'Level 2: Technique & Control', 'Level 3: Game Speed & Precision'];
  const currentLevelLabel = levelNames[currentLevelNumber - 1] || 'Level 1: Foundation';
  const nextLevelGoal = activeModule?.microFocus 
    ? `Master ${activeModule.microFocus.toLowerCase()} to unlock ${levelNames[Math.min(currentLevelNumber, 2)]}`
    : `Complete upcoming drills to unlock Level ${currentLevelNumber + 1}`;

  const getDisciplineIconEmoji = (id: string) => {
    switch (id) {
      case 'tennis': return '🎾';
      case 'boxing': return '🥊';
      case 'dance': return '💃';
      case 'cooking': return '🔪';
      case 'guitar': return '🎸';
      case 'yoga': return '🧘';
      case 'golf': return '⛳';
      default: return '⚡';
    }
  };

  // Group modules into stages
  const stages: { stageNumber: number; title: string; modules: CourseModule[] }[] = [];
  const allModules = activeDiscipline.modules || [];
  
  if (allModules.length <= 3) {
    stages.push({
      stageNumber: 1,
      title: 'Stage 1: Core Setup & Fundamentals',
      modules: allModules.slice(0, 2),
    });
    if (allModules.length > 2) {
      stages.push({
        stageNumber: 2,
        title: 'Stage 2: Technique & Pacing Execution',
        modules: allModules.slice(2),
      });
    }
  } else {
    stages.push({
      stageNumber: 1,
      title: 'Stage 1: Foundational Stroke Mechanics',
      modules: allModules.slice(0, 2),
    });
    stages.push({
      stageNumber: 2,
      title: 'Stage 2: Dynamics & Match Pacing',
      modules: allModules.slice(2, 4),
    });
    if (allModules.length > 4) {
      stages.push({
        stageNumber: 3,
        title: 'Stage 3: Advanced Biomechanics',
        modules: allModules.slice(4),
      });
    }
  }

  // Determine which stage has the in-progress module (default expanded)
  const defaultExpandedStageNumber = stages.find(s => 
    s.modules.some(m => m.status === 'in_progress')
  )?.stageNumber || (stages[0]?.stageNumber ?? 1);

  // Collapsible state: only relevant/active stage expanded by default
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {};
    stages.forEach(s => {
      initial[s.stageNumber] = s.stageNumber === defaultExpandedStageNumber;
    });
    return initial;
  });

  const toggleStage = (stageNum: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageNum]: !prev[stageNum]
    }));
  };

  const currentSchedule = currentSkillProgress?.schedule || coachProfile.schedule;

  return (
    <div className="flex flex-col gap-6 pb-24">
      
      {/* ---------------- 1. MERGED UNIFIED HERO CARD (GOAL + PROGRESS + UP NEXT) ---------------- */}
      <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border-2 border-emerald-500/50 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-5 relative overflow-hidden">
        {/* Glow Ambient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Meta Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
              {getDisciplineIconEmoji(activeDiscipline.id)}
            </span>
            <div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                {activeDiscipline.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">{activeDiscipline.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              {currentLevelLabel}
            </span>
            <span className="bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {currentSchedule ? `${currentSchedule.daysPerWeek}d • ${currentSchedule.minutesPerDay}m` : '3d • 30m'}
            </span>
          </div>
        </div>

        {/* Progress Bar & Goal */}
        <div className="space-y-2.5 relative z-10">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <strong className="text-white">Goal:</strong> {nextLevelGoal}
            </span>
            <span className="font-mono text-emerald-400 font-bold shrink-0 ml-2">
              {completedCount}/{totalModules} ({progressPercent}%)
            </span>
          </div>

          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800/80">
            <div
              className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(8, progressPercent)}%` }}
            />
          </div>
        </div>

        {/* Embedded Up Next Section (Single Click Launch) */}
        {activeModule && (
          <div className="pt-4 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Play className="w-2.5 h-2.5 fill-slate-950" /> Up Next Drill
                </span>
                <span className="text-xs font-mono text-slate-400">
                  Module {activeModule.order} • {activeModule.estimatedMinutes}m
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {activeModule.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">
                Target: {activeModule.microFocus}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <img
                src={activeDiscipline.coachPersona.avatar}
                alt={activeDiscipline.coachPersona.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-400 hidden sm:block"
                title={`Coach ${activeDiscipline.coachPersona.name}`}
              />
              <button
                onClick={() => onStartLesson(activeDiscipline, activeModule)}
                className="w-full md:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm py-3 px-6 rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-slate-950" /> Start Practice Session
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- 2. COLLAPSIBLE STAGES CURRICULUM ---------------- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Curriculum Roadmap
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {stages.length} Stages • Tap to expand/collapse
          </span>
        </div>

        {stages.map((stage) => {
          const isExpanded = expandedStages[stage.stageNumber];
          const stageCompleted = stage.modules.every(m => m.status === 'completed');
          const stageInProgress = stage.modules.some(m => m.status === 'in_progress');
          const completedInStage = stage.modules.filter(m => m.status === 'completed').length;

          return (
            <div 
              key={stage.stageNumber} 
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
            >
              {/* Collapsible Header */}
              <button
                onClick={() => toggleStage(stage.stageNumber)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/60 transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg text-[11px] font-mono font-bold flex items-center justify-center border ${
                    stageCompleted
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                      : stageInProgress
                      ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                      : 'bg-slate-850 border-slate-700 text-slate-400'
                  }`}>
                    {stageCompleted ? '✓' : stage.stageNumber}
                  </span>
                  
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      {stage.title}
                      {stageInProgress && (
                        <span className="text-[9px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-black uppercase">
                          Active Stage
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {completedInStage} of {stage.modules.length} Modules Completed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-xs font-mono hidden sm:inline">
                    {isExpanded ? 'Collapse' : 'Expand'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsible Module List */}
              {isExpanded && (
                <div className="p-4 pt-1 border-t border-slate-800/60 space-y-2.5 bg-slate-950/40">
                  {stage.modules.map((mod) => {
                    const isCompleted = mod.status === 'completed';
                    const isInProgress = mod.status === 'in_progress';
                    const isLocked = mod.status === 'locked';

                    return (
                      <div
                        key={mod.id}
                        className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                          isInProgress
                            ? 'bg-slate-850 border-emerald-400/80 shadow-md ring-1 ring-emerald-500/30'
                            : isCompleted
                            ? 'bg-slate-900/90 border-slate-800'
                            : 'bg-slate-950/60 border-slate-800/40 opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold ${
                            isCompleted
                              ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                              : isInProgress
                              ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                              : 'bg-slate-900 border-slate-800 text-slate-500'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : mod.order}
                          </div>

                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                              {mod.title}
                              {isInProgress && (
                                <span className="text-[9px] font-mono bg-emerald-500 text-slate-950 px-1.5 py-0.2 rounded font-black uppercase">
                                  Current
                                </span>
                              )}
                            </h5>
                            <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{mod.subtitle}</p>
                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" /> {mod.estimatedMinutes}m drill
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3 text-emerald-400/80" /> {mod.microFocus}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Button */}
                        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                          {isCompleted && (
                            <button
                              onClick={() => onStartLesson(activeDiscipline, mod)}
                              className="text-xs font-bold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Replay
                            </button>
                          )}

                          {isInProgress && (
                            <button
                              onClick={() => onStartLesson(activeDiscipline, mod)}
                              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-md"
                            >
                              <Play className="w-3.5 h-3.5 fill-slate-950" /> Start Drill
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
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
