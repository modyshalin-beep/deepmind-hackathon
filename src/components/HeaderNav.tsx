'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CoachProfile, Discipline } from '@/types';
import { 
  ChevronDown, Plus, Sparkles, Check, 
  Activity, Zap, Utensils, Heart, Target, Music, Video, Volume2
} from 'lucide-react';

interface HeaderNavProps {
  coachProfile: CoachProfile;
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  onSelectDiscipline: (d: Discipline) => void;
  onOpenAddSkill: () => void;
  onTriggerOnboarding: () => void;
  onShowLanding?: () => void;
}

export function HeaderNav({
  coachProfile,
  disciplines,
  activeDiscipline,
  onSelectDiscipline,
  onOpenAddSkill,
  onTriggerOnboarding,
  onShowLanding,
}: HeaderNavProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const enrolledIds = coachProfile.enrolledDisciplineIds || [activeDiscipline.id];
  const enrolledDisciplines = disciplines.filter(d => enrolledIds.includes(d.id));

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
      case 'boxing': return <Zap className="w-3.5 h-3.5 text-amber-400" />;
      case 'dance': return <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />;
      case 'cooking': return <Utensils className="w-3.5 h-3.5 text-cyan-400" />;
      case 'guitar': return <Music className="w-3.5 h-3.5 text-violet-400" />;
      case 'yoga': return <Heart className="w-3.5 h-3.5 text-rose-400" />;
      case 'golf': return <Target className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 shadow-md">
            P
          </div>
          <span className="font-black text-sm tracking-tight text-white hidden sm:inline">POCKET COACH</span>
        </div>

        {/* Intuitive Skill Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 px-3 py-1.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              {getDisciplineIcon(activeDiscipline.id)}
              <span className="text-xs font-bold text-white">
                {activeDiscipline.shortName || activeDiscipline.name}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180 text-emerald-400' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
                Your Enrolled Skills:
              </span>

              {enrolledDisciplines.map((d) => {
                const isActive = d.id === activeDiscipline.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDiscipline(d);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-xl flex items-center justify-between text-left transition cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950/80 text-white font-bold border border-emerald-800/80'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getDisciplineIcon(d.id)}
                      <span className="text-xs">{d.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                  </button>
                );
              })}

              <div className="pt-1 border-t border-slate-800 space-y-0.5">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenAddSkill();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-400 hover:bg-emerald-950/50 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Learn Another Skill...</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onTriggerOnboarding();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Restart Onboarding Intake</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Onboarding button & System Status Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTriggerOnboarding}
            className="bg-emerald-950/90 hover:bg-emerald-900 text-emerald-400 hover:text-emerald-300 border border-emerald-800/90 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm"
            title="Open Onboarding Flow"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Onboarding</span>
          </button>

          <div className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full flex items-center gap-2 text-[11px] font-mono text-slate-300">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-emerald-400 font-semibold hidden sm:inline">AI Coach Active</span>
          </div>
        </div>

      </div>
    </header>
  );
}
