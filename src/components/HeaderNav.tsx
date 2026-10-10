'use client';

import React, { useState, useEffect } from 'react';
import { CoachProfile } from '@/types';
import { Headphones, Battery, Key, Check } from 'lucide-react';

interface HeaderNavProps {
  coachProfile: CoachProfile;
  activeTab: string;
}

export function HeaderNav({ coachProfile, activeTab }: HeaderNavProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pocket_coach_gemini_key');
      if (saved) setApiKey(saved);
    }
  }, []);

  const handleSaveKey = (val: string) => {
    setApiKey(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pocket_coach_gemini_key', val);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
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

        {/* API Key Input & AirPods Connection Badge */}
        <div className="flex items-center gap-2">
          {showKeyInput ? (
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleSaveKey(e.target.value)}
                placeholder="Paste Gemini API Key"
                className="bg-transparent text-xs text-white px-2 py-1 focus:outline-none w-36 sm:w-48 font-mono"
              />
              <button
                onClick={() => setShowKeyInput(false)}
                className="bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-1 rounded-lg"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : 'Done'}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowKeyInput(true)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">{apiKey ? 'API Key Active' : 'Set Gemini Key'}</span>
            </button>
          )}

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
