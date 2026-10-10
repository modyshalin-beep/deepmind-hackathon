'use client';

import React from 'react';
import { Discipline } from '@/types';
import { 
  Sparkles, ArrowRight, Video, Volume2, ShieldCheck, 
  Activity, Zap, Heart, Utensils, Target, Music, 
  CheckCircle2, Play
} from 'lucide-react';

interface LandingPageProps {
  disciplines: Discipline[];
  onStartOnboarding: (preselectedSkillId?: string) => void;
  onExploreDemo: () => void;
}

export function LandingPage({ disciplines, onStartOnboarding, onExploreDemo }: LandingPageProps) {
  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-5 h-5 text-emerald-400" />;
      case 'boxing': return <Zap className="w-5 h-5 text-amber-400" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-fuchsia-400" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-cyan-400" />;
      case 'guitar': return <Music className="w-5 h-5 text-violet-400" />;
      case 'yoga': return <Heart className="w-5 h-5 text-rose-400" />;
      case 'golf': return <Target className="w-5 h-5 text-emerald-400" />;
      default: return <Activity className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-slate-800/80 px-6 py-4 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 flex items-center justify-center font-black text-slate-950 shadow-md shadow-emerald-950/50">
              P
            </div>
            <span className="font-black text-base tracking-tight text-white">POCKET COACH</span>
          </div>

          <button
            onClick={onExploreDemo}
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition"
          >
            Explore Dashboard
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-10 text-center">
        {/* Hero Title & Value Proposition */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-800/80 text-emerald-400 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time AI Coaching
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Your Private AI Mentor for Physical Skills.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mx-auto">
            Prop your phone and practice. Pocket Coach watches your form via camera and provides live, conversational voice coaching as you move.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onStartOnboarding()}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base py-3.5 px-8 rounded-2xl shadow-xl shadow-emerald-950/50 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-bold text-sm py-3.5 px-6 rounded-2xl border border-slate-800 transition"
            >
              View Sample Lesson Plans
            </button>
          </div>
        </div>

        {/* 3 Visual Pillars (Concise, Not Text-Heavy) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Computer Vision</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Analyzes joint angles, swing path, and posture timing in real time.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800/80 flex items-center justify-center text-cyan-400">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Live Audio Cues</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Instant voice feedback in your ear so you never have to look down at your screen.
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800/80 flex items-center justify-center text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-sm">Structured Plans</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bite-sized modules tailored to your schedule and verified with milestone clips.
            </p>
          </div>
        </div>

        {/* Visual Skills Showcase */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Choose What You Want to Master:
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">7 Skills Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {disciplines.map((d) => (
              <button
                key={d.id}
                onClick={() => onStartOnboarding(d.id)}
                className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/60 rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center transition group cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-slate-950 group-hover:bg-emerald-950/60 transition">
                  {getDisciplineIcon(d.id)}
                </div>
                <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                  {d.shortName || d.name}
                </span>
                <span className="text-[10px] text-slate-400 line-clamp-1">
                  Coach {d.coachPersona.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
