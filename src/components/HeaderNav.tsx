'use client';

import React from 'react';
import { CoachProfile } from '@/types';
import { Headphones, Battery, Sparkles, Shield, Flame } from 'lucide-react';

interface HeaderNavProps {
  coachProfile: CoachProfile;
  activeTab: string;
}

export function HeaderNav({ coachProfile, activeTab }: HeaderNavProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* App Title & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 shadow-md shadow-emerald-950/50">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-white leading-none">POCKET COACH</h1>
              <span className="text-[9px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-mono uppercase">
                AI LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">10k-Hour Private AI Mentor</p>
          </div>
        </div>

        {/* AirPods & Hardware Connection Badge */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-full flex items-center gap-2 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Headphones className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200 hidden sm:inline">AirPods Pro</span>
            <span className="text-[10px] font-mono text-emerald-400 border-l border-slate-800 pl-1.5 flex items-center gap-1">
              <Battery className="w-3 h-3 text-slate-400" /> {coachProfile.batteryLevel}%
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
