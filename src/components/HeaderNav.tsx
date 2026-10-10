'use client';

import React, { useState, useRef, useEffect } from 'react';
import { CoachProfile, Discipline } from '@/types';
import { 
  ChevronDown, Plus, Check, 
  Activity, Zap, Utensils, Heart, Target, Music, Sparkles,
  User, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

interface HeaderNavProps {
  coachProfile: CoachProfile;
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  onSelectDiscipline: (d: Discipline) => void;
  onOpenAddSkill: () => void;
  onShowLanding?: () => void;
}

export function HeaderNav({
  coachProfile,
  disciplines,
  activeDiscipline,
  onSelectDiscipline,
  onOpenAddSkill,
  onShowLanding,
}: HeaderNavProps) {
  const { user, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const studentName = user?.name || coachProfile.studentName || 'Athlete';
  const initial = studentName.charAt(0).toUpperCase();

  const enrolledIds = coachProfile.enrolledDisciplineIds || [activeDiscipline.id];
  const enrolledDisciplines = disciplines.filter(d => enrolledIds.includes(d.id));

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    setShowUserMenu(false);
    signOutUser();
    window.location.href = '/sign-in';
  };

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-3.5 h-3.5 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-3.5 h-3.5 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-3.5 h-3.5 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-3.5 h-3.5 text-[#B5C99A]" />;
      default: return <Activity className="w-3.5 h-3.5 text-[#A4C2F4]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F3EE]/95 backdrop-blur-xl border-b border-[#E8E2D8] px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand */}
        <button
          onClick={onShowLanding}
          className="flex items-center gap-2 group cursor-pointer text-left focus:outline-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E8A5A5] via-[#A4C2F4] to-[#E9D78E] flex items-center justify-center font-black text-[#3E4348] text-sm shadow-xs group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="font-black text-sm tracking-tight text-[#3E4348]">POCKET COACH</span>
        </button>

        {/* Skill Switcher Pill */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-[#FAF9F6] hover:bg-white border border-[#E8E2D8] hover:border-[#A4C2F4] px-3.5 py-1.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-xs text-xs font-bold text-[#3E4348]"
          >
            <div className="flex items-center gap-1.5">
              {getDisciplineIcon(activeDiscipline.id)}
              <span>{activeDiscipline.shortName || activeDiscipline.name}</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#6E757C] transition-transform ${isDropdownOpen ? 'rotate-180 text-[#E8A5A5]' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 bg-[#FAF9F6] border border-[#E8E2D8] rounded-2xl p-1.5 shadow-xl z-50 space-y-0.5 animate-fade-in">
              {enrolledDisciplines.map((d) => {
                const isActive = d.id === activeDiscipline.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      onSelectDiscipline(d);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-left transition cursor-pointer text-xs ${
                      isActive
                        ? 'bg-[#A4C2F4]/20 text-[#3E4348] font-bold'
                        : 'hover:bg-white text-[#6E757C] hover:text-[#3E4348]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getDisciplineIcon(d.id)}
                      <span>{d.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#3E4348]" />}
                  </button>
                );
              })}

              <div className="pt-1 border-t border-[#E8E2D8]">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenAddSkill();
                  }}
                  className="w-full px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-bold text-[#3E4348] hover:bg-[#E8A5A5]/20 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E8A5A5]" />
                  <span>Learn Another Skill</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Athlete Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="bg-[#FAF9F6] hover:bg-white border border-[#E8E2D8] hover:border-[#A4C2F4] pl-1.5 pr-2.5 py-1 rounded-full flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#A4C2F4] to-[#E8A5A5] text-[#3E4348] font-black text-xs flex items-center justify-center">
              {initial}
            </div>
            <span className="text-xs font-bold text-[#3E4348] hidden sm:inline max-w-[100px] truncate">
              {studentName}
            </span>
            <ChevronDown className="w-3 h-3 text-[#6E757C]" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-[#FAF9F6] border border-[#E8E2D8] rounded-2xl p-1.5 shadow-xl z-50 animate-fade-in space-y-0.5">
              <div className="px-3 py-1.5 border-b border-[#E8E2D8]">
                <p className="text-xs font-bold text-[#3E4348] truncate">{studentName}</p>
                {user?.email && <p className="text-[10px] text-[#6E757C] font-mono truncate">{user.email}</p>}
              </div>

              <Link
                href="/sign-in"
                onClick={() => setShowUserMenu(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-[#3E4348] hover:bg-white rounded-xl transition"
              >
                <User className="w-3.5 h-3.5 text-[#A4C2F4]" /> Switch Profile
              </Link>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
