'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { CoachProfile, Discipline } from '@/types';
import { 
  ChevronDown, Plus, Sparkles, Check, 
  Activity, Zap, Utensils, Heart, Target, Music,
  Headphones, Battery, User, LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

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
  const { user, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const studentName = user?.name || coachProfile.studentName || 'Athlete';
  const initial = studentName.charAt(0).toUpperCase();

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

  const handleSignOut = () => {
    setShowUserMenu(false);
    signOutUser();
    window.location.href = '/sign-in';
  };

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-3.5 h-3.5 text-[#FF7F2D]" />;
      case 'boxing': return <Zap className="w-3.5 h-3.5 text-[#FF7F2D]" />;
      case 'dance': return <Sparkles className="w-3.5 h-3.5 text-[#9C7BAC]" />;
      case 'cooking': return <Utensils className="w-3.5 h-3.5 text-[#4CB1FF]" />;
      case 'guitar': return <Music className="w-3.5 h-3.5 text-[#9C7BAC]" />;
      case 'yoga': return <Heart className="w-3.5 h-3.5 text-[#FF7F2D]" />;
      case 'golf': return <Target className="w-3.5 h-3.5 text-[#7CB078]" />;
      default: return <Activity className="w-3.5 h-3.5 text-[#FF7F2D]" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F2F8FC]/90 backdrop-blur-xl border-b border-[#D0E6FF] px-4 py-2.5">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        
        {/* Brand & Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7F2D] to-[#9C7BAC] flex items-center justify-center font-black text-white shadow-sm shadow-[#FF7F2D]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm tracking-tight text-[#2D2E2E] hidden sm:inline">POCKET COACH</span>
              <span className="text-[9px] font-bold bg-[#F5FAF5] text-[#7CB078] border border-[#7CB078]/40 px-1.5 py-0.5 rounded font-mono uppercase">
                AI LIVE
              </span>
            </div>
            <p className="text-[10px] text-[#4A4B4B] font-medium hidden md:block">10k-Hour Deliberate Practice</p>
          </div>
        </Link>

        {/* Intuitive Skill Switcher Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="bg-white hover:bg-[#F5F6FC] border border-[#D0E6FF] hover:border-[#9C7BAC] px-3.5 py-1.5 rounded-full flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-1.5">
              {getDisciplineIcon(activeDiscipline.id)}
              <span className="text-xs font-bold text-[#2D2E2E]">
                {activeDiscipline.shortName || activeDiscipline.name}
              </span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-[#4A4B4B] transition-transform ${isDropdownOpen ? 'rotate-180 text-[#FF7F2D]' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white border border-[#D0E6FF] rounded-2xl p-2 shadow-2xl z-50 space-y-1 animate-fade-in">
              <span className="text-[10px] font-bold text-[#4A4B4B] uppercase tracking-wider px-2 py-1 block">
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
                        ? 'bg-[#FEF6F4] text-[#2D2E2E] font-bold border border-[#FF7F2D]/30'
                        : 'hover:bg-[#F5F6FC] text-[#4A4B4B]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getDisciplineIcon(d.id)}
                      <span className="text-xs">{d.name}</span>
                    </div>
                    {isActive && <Check className="w-3.5 h-3.5 text-[#FF7F2D]" />}
                  </button>
                );
              })}

              <div className="pt-1 border-t border-[#D0E6FF] space-y-0.5">
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onOpenAddSkill();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-bold text-[#FF7F2D] hover:bg-[#FEF6F4] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Learn Another Skill...</span>
                </button>

                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onTriggerOnboarding();
                  }}
                  className="w-full px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs font-medium text-[#4A4B4B] hover:text-[#2D2E2E] hover:bg-[#F5F6FC] transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9C7BAC]" />
                  <span>Restart Onboarding Intake</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Section: Onboarding button, AirPods & Athlete Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onTriggerOnboarding}
            className="bg-[#FEF6F4] hover:bg-[#ffede5] text-[#FF7F2D] border border-[#FF7F2D]/40 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs hidden sm:flex"
            title="Open Onboarding Flow"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF7F2D]" />
            <span>Onboarding</span>
          </button>

          {/* AirPods Hardware Badge */}
          <div className="bg-white border border-[#D0E6FF] px-3 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4CB1FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4CB1FF]"></span>
            </span>
            <Headphones className="w-3.5 h-3.5 text-[#4CB1FF]" />
            <span className="text-xs font-semibold text-[#4A4B4B] hidden md:inline">AirPods Pro</span>
            <span className="text-[10px] font-mono text-[#4A4B4B] border-l border-[#D0E6FF] pl-1.5 flex items-center gap-1">
              <Battery className="w-3 h-3 text-[#4A4B4B]" /> {coachProfile.batteryLevel}%
            </span>
          </div>

          {/* Athlete Profile / Auth Pill */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="bg-white hover:bg-[#F5F6FC] border border-[#D0E6FF] hover:border-[#9C7BAC] pl-1.5 pr-2.5 py-1 rounded-full flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#9C7BAC] to-[#4CB1FF] text-white font-black text-xs flex items-center justify-center">
                {initial}
              </div>
              <span className="text-xs font-bold text-[#4A4B4B] hidden sm:inline max-w-[100px] truncate">
                {studentName}
              </span>
              <ChevronDown className="w-3 h-3 text-[#4A4B4B]" />
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#D0E6FF] rounded-2xl p-2 shadow-xl z-50 animate-fade-in space-y-1">
                <div className="px-3 py-2 border-b border-[#D0E6FF]">
                  <span className="text-[10px] font-bold text-[#4A4B4B] uppercase tracking-wider block">Athlete Profile</span>
                  <p className="text-xs font-bold text-[#2D2E2E] truncate">{studentName}</p>
                  {user?.email && <p className="text-[10px] text-[#4A4B4B] font-mono truncate">{user.email}</p>}
                </div>

                <Link
                  href="/sign-in"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#4A4B4B] hover:bg-[#F5F6FC] rounded-xl transition"
                >
                  <User className="w-3.5 h-3.5 text-[#FF7F2D]" /> Switch Athlete
                </Link>

                <Link
                  href="/sign-up"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#4A4B4B] hover:bg-[#F5F6FC] rounded-xl transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#9C7BAC]" /> Register New Athlete
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-xl transition text-left cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
