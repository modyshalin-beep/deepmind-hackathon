'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CoachProfile, Discipline } from '@/types';
import { ChevronDown, Plus, Sparkles, Check } from 'lucide-react';

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
            className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 px-3.5 py-1.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-sm"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{getDisciplineIconEmoji(activeDiscipline.id)}</span>
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
                      <span className="text-sm">{getDisciplineIconEmoji(d.id)}</span>
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

        {/* Right Section: Empty or minimalist balance spacer */}
        <div className="w-7 sm:w-28 flex justify-end" />

      </div>
    </header>
  );
}
