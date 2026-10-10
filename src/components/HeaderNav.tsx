'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { CoachProfile } from '@/types';
import { Headphones, Battery, User, LogOut, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderNavProps {
  coachProfile: CoachProfile;
  activeTab: string;
}

export function HeaderNav({ coachProfile, activeTab }: HeaderNavProps) {
  const { user, signOutUser } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const studentName = user?.name || coachProfile.studentName || 'Athlete';
  const initial = studentName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    setShowUserMenu(false);
    signOutUser();
    window.location.href = '/sign-in';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F2F8FC]/90 backdrop-blur-xl border-b border-[#D0E6FF] px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* App Title & Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7F2D] to-[#9C7BAC] flex items-center justify-center font-black text-white shadow-sm shadow-[#FF7F2D]/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-[#2D2E2E] leading-none">POCKET COACH</h1>
              <span className="text-[9px] font-bold bg-[#F5FAF5] text-[#7CB078] border border-[#7CB078]/40 px-1.5 py-0.5 rounded font-mono uppercase">
                AI LIVE
              </span>
            </div>
            <p className="text-[10px] text-[#4A4B4B] font-medium">10k-Hour Deliberate Practice Mentor</p>
          </div>
        </Link>

        {/* Right Action Cluster: AirPods & Athlete Profile */}
        <div className="flex items-center gap-2 sm:gap-2.5">
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
