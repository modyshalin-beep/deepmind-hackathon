'use client';

import React, { useState } from 'react';
import { Discipline, CoachProfile, CourseModule } from '@/types';
import { 
  Play, CheckCircle2, Lock, Clock, BookOpen, 
  RotateCcw, ChevronDown, ChevronUp
} from 'lucide-react';

interface LessonPlansViewProps {
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  coachProfile: CoachProfile;
  onStartLesson: (discipline: Discipline, module: CourseModule) => void;
  onSelectDiscipline?: (d: Discipline) => void;
  onOpenAddSkill?: () => void;
}

export function LessonPlansView({
  disciplines,
  activeDiscipline,
  coachProfile,
  onStartLesson,
}: LessonPlansViewProps) {
  const currentSkillProgress = coachProfile.skillsProgress?.[activeDiscipline.id];
  const activeModule = activeDiscipline.modules?.find(
    m => m.id === currentSkillProgress?.currentModuleId
  ) || activeDiscipline.modules?.find(m => m.status === 'in_progress') || activeDiscipline.modules?.[0];

  const currentLevel = currentSkillProgress?.skillLevel || coachProfile.skillLevel || 'Beginner';
  const scheduleText = coachProfile.schedule 
    ? `${coachProfile.schedule.daysPerWeek}d/wk`
    : '3d/wk';

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
        title: 'Stage 2: Fluid Execution',
        modules: allModules.slice(2),
      });
    }
  } else {
    stages.push({
      stageNumber: 1,
      title: 'Stage 1: Foundation',
      modules: allModules.slice(0, 2),
    });
    stages.push({
      stageNumber: 2,
      title: 'Stage 2: Technique & Control',
      modules: allModules.slice(2, 4),
    });
    if (allModules.length > 4) {
      stages.push({
        stageNumber: 3,
        title: 'Stage 3: Game Speed',
        modules: allModules.slice(4),
      });
    }
  }

  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const toggleStage = (stageNum: number) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageNum]: !prev[stageNum]
    }));
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* ---------------- 1. HERO: UP NEXT LESSON (CLEAN, FLATTENED) ---------------- */}
      {activeModule && (
        <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 sm:p-6 shadow-xs">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-[#E8A5A5] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                  Up Next
                </span>
                <span className="text-xs font-semibold text-[#6E757C]">
                  {activeDiscipline.name} • Module {activeModule.order} of {activeDiscipline.modules?.length || 3}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#3E4348]">
                {activeModule.title}
              </h3>
              
              <p className="text-xs sm:text-sm text-[#6E757C] line-clamp-1">
                {activeModule.subtitle}
              </p>

              <div className="flex items-center gap-2 text-xs text-[#6E757C] pt-1">
                <span className="font-semibold text-[#3E4348]">{activeModule.estimatedMinutes}m drill</span>
                <span>•</span>
                <span className="capitalize">{currentLevel}</span>
                <span>•</span>
                <span>{scheduleText}</span>
                <span>•</span>
                <span className="text-[#E8A5A5] font-medium">{activeModule.microFocus}</span>
              </div>
            </div>

            {/* Launch & Coach (Flattened, no nested boxes) */}
            <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
              <div className="flex items-center gap-2.5 pr-2">
                <img
                  src={activeDiscipline.coachPersona.avatar}
                  alt={activeDiscipline.coachPersona.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E8A5A5]"
                />
                <div>
                  <span className="text-xs font-bold text-[#3E4348] block leading-tight">Coach {activeDiscipline.coachPersona.name}</span>
                  <span className="text-[10px] text-[#A4C2F4] block font-medium">Live Voice & Vision</span>
                </div>
              </div>

              <button
                onClick={() => onStartLesson(activeDiscipline, activeModule)}
                className="flex-1 md:flex-initial bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-sm py-3 px-5 rounded-2xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-[#3E4348]" /> Start Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. CURRICULUM ROADMAP (FLATTENED ACCORDION) ---------------- */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-black text-[#3E4348] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#A4C2F4]" />
            Roadmap
          </h3>
          <span className="text-xs text-[#6E757C]">
            {stages.length} Stages
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
              className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs"
            >
              {/* Header */}
              <button
                onClick={() => toggleStage(stage.stageNumber)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#FAF9F6] transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-xl text-xs font-bold flex items-center justify-center ${
                    stageCompleted
                      ? 'bg-[#B5C99A]/30 text-[#42592B]'
                      : stageInProgress
                      ? 'bg-[#A4C2F4] text-[#3E4348]'
                      : 'bg-[#F7F3EE] text-[#6E757C]'
                  }`}>
                    {stageCompleted ? '✓' : stage.stageNumber}
                  </span>
                  
                  <div>
                    <h4 className="text-sm font-bold text-[#3E4348] flex items-center gap-2">
                      {stage.title}
                      {stageInProgress && (
                        <span className="text-[9px] bg-[#E8A5A5]/25 text-[#9E3E3E] px-2 py-0.5 rounded-full font-bold uppercase">
                          Current
                        </span>
                      )}
                    </h4>
                    <span className="text-[11px] text-[#6E757C]">
                      {completedInStage} of {stage.modules.length} Completed
                    </span>
                  </div>
                </div>

                <div className="text-[#6E757C]">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Module List (Clean rows, un-nested) */}
              {isExpanded && (
                <div className="border-t border-[#E8E2D8] divide-y divide-[#E8E2D8]/60 bg-[#FAF9F6]/40">
                  {stage.modules.map((mod) => {
                    const isCompleted = mod.status === 'completed';
                    const isInProgress = mod.status === 'in_progress';
                    const isLocked = mod.status === 'locked';

                    return (
                      <div
                        key={mod.id}
                        className={`px-5 py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                          isInProgress ? 'bg-white' : ''
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                            isCompleted
                              ? 'text-[#42592B]'
                              : isInProgress
                              ? 'text-[#E8A5A5]'
                              : 'text-[#6E757C]'
                          }`}>
                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : mod.order}
                          </div>

                          <div>
                            <h5 className="text-xs sm:text-sm font-bold text-[#3E4348] flex items-center gap-2">
                              {mod.title}
                            </h5>
                            <p className="text-[11px] text-[#6E757C] line-clamp-1">{mod.subtitle}</p>
                            <span className="text-[10px] text-[#6E757C] font-mono mt-0.5 block">
                              {mod.estimatedMinutes}m • {mod.microFocus}
                            </span>
                          </div>
                        </div>

                        {/* Action */}
                        <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                          {isCompleted && (
                            <button
                              onClick={() => onStartLesson(activeDiscipline, mod)}
                              className="text-xs font-bold text-[#6E757C] hover:text-[#3E4348] px-3 py-1 rounded-xl hover:bg-[#F7F3EE] flex items-center gap-1 transition cursor-pointer"
                            >
                              <RotateCcw className="w-3.5 h-3.5" /> Replay
                            </button>
                          )}

                          {isInProgress && (
                            <button
                              onClick={() => onStartLesson(activeDiscipline, mod)}
                              className="bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] text-xs font-black px-3.5 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-xs transform active:scale-95"
                            >
                              <Play className="w-3.5 h-3.5 fill-[#3E4348]" /> Start
                            </button>
                          )}

                          {isLocked && (
                            <span className="text-xs text-[#6E757C]/60 flex items-center gap-1 px-3 py-1">
                              <Lock className="w-3.5 h-3.5" />
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
