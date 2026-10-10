'use client';

import React from 'react';
import { Discipline } from '@/types';
import { Play } from 'lucide-react';

interface LandingPageProps {
  disciplines: Discipline[];
  onStartOnboarding: (preselectedSkillId?: string) => void;
  onExploreDemo: () => void;
}

export function LandingPage({ onStartOnboarding }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left">
        
        {/* Left: Clean Value Proposition */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 shadow-md">
              P
            </div>
            <span className="font-black text-xl tracking-tight text-white">POCKET COACH</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Learn Any Skill <br className="hidden md:block"/> With AI Vision.
          </h1>

          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-md mx-auto md:mx-0">
            Prop your phone and practice. Pocket Coach watches your form and provides live, conversational voice coaching as you move.
          </p>

          <div className="pt-4">
            <button
              onClick={() => onStartOnboarding()}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-lg py-4 px-10 rounded-2xl shadow-xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              Start Free Assessment <Play className="w-5 h-5 fill-slate-950" />
            </button>
          </div>
        </div>

        {/* Right: Visual Demonstration (Simulated Video Loop) */}
        <div className="flex-1 w-full max-w-sm relative aspect-[9/16] bg-slate-900 rounded-[2rem] border-8 border-slate-800 shadow-2xl overflow-hidden flex items-center justify-center">
          {/* Faux Video Background */}
          <img 
            src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800" 
            alt="AI Coaching Demo" 
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Simulated HUD Overlay */}
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-white bg-slate-950/60 backdrop-blur px-3 py-1.5 rounded-full w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Observing Form
            </div>

            <div className="space-y-2">
              {/* Skeleton Visualizer */}
              <div className="w-full h-32 border-2 border-emerald-400/50 rounded-xl relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center gap-4">
                  <div className="w-4 h-4 rounded-full bg-emerald-400" />
                  <div className="w-0.5 h-16 bg-emerald-400" />
                  <div className="w-4 h-4 rounded-full bg-emerald-400" />
                </div>
              </div>

              {/* Subtitles */}
              <div className="bg-slate-950/90 text-white text-sm font-medium px-4 py-3 rounded-xl border border-slate-700 backdrop-blur-md">
                <p>🎙️ <strong className="text-emerald-400">Coach:</strong> &quot;Drop your shoulders 2 inches. Perfect, hold that.&quot;</p>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
