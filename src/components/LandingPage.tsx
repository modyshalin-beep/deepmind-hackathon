'use client';

import React from 'react';
import { Discipline } from '@/types';
import { 
  Sparkles, ArrowRight, Video, Volume2, 
  Activity, Zap, Heart, Utensils, Target, Music, 
  CheckCircle2
} from 'lucide-react';

interface LandingPageProps {
  disciplines: Discipline[];
  onStartOnboarding: (preselectedSkillId?: string) => void;
  onExploreDemo: () => void;
}

export function LandingPage({ disciplines, onStartOnboarding, onExploreDemo }: LandingPageProps) {
  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-5 h-5 text-[#FF7F2D]" />;
      case 'boxing': return <Zap className="w-5 h-5 text-[#FF7F2D]" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-[#9C7BAC]" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-[#4CB1FF]" />;
      case 'guitar': return <Music className="w-5 h-5 text-[#9C7BAC]" />;
      case 'yoga': return <Heart className="w-5 h-5 text-[#FF7F2D]" />;
      case 'golf': return <Target className="w-5 h-5 text-[#7CB078]" />;
      default: return <Activity className="w-5 h-5 text-[#FF7F2D]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F8FC] text-[#4A4B4B] flex flex-col font-sans selection:bg-[#D0E6FF] selection:text-[#4A4B4B]">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-[#D0E6FF] px-6 py-4 bg-white/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#FF7F2D] to-[#9C7BAC] flex items-center justify-center font-black text-white shadow-sm shadow-[#FF7F2D]/20">
              P
            </div>
            <span className="font-black text-base tracking-tight text-[#2D2E2E]">POCKET COACH</span>
          </div>

          <button
            onClick={onExploreDemo}
            className="text-xs font-bold text-[#4A4B4B] hover:text-[#2D2E2E] px-3.5 py-1.5 rounded-lg border border-[#D0E6FF] hover:bg-[#F5F6FC] transition cursor-pointer"
          >
            Explore Dashboard
          </button>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-10 text-center">
        {/* Hero Title & Value Proposition */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#FEF6F4] border border-[#FF7F2D]/40 text-[#FF7F2D] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Real-Time AI Coaching
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#2D2E2E] leading-tight">
            Your Private AI Mentor for Physical Skills.
          </h1>

          <p className="text-sm sm:text-base text-[#4A4B4B] leading-relaxed max-w-xl mx-auto">
            Prop your phone and practice. Pocket Coach watches your form via camera and provides live, conversational voice coaching as you move.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onStartOnboarding()}
              className="w-full sm:w-auto bg-[#FF7F2D] hover:bg-[#e66c1e] text-white font-black text-base py-3.5 px-8 rounded-2xl shadow-md shadow-[#FF7F2D]/25 flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto bg-white hover:bg-[#F5F6FC] text-[#2D2E2E] font-bold text-sm py-3.5 px-6 rounded-2xl border border-[#D0E6FF] transition cursor-pointer shadow-xs"
            >
              View Sample Lesson Plans
            </button>
          </div>
        </div>

        {/* 3 Visual Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="bg-white border border-[#D0E6FF] rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FEF6F4] border border-[#FF7F2D]/30 flex items-center justify-center text-[#FF7F2D]">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2D2E2E] text-sm">Computer Vision</h3>
            <p className="text-xs text-[#4A4B4B] leading-relaxed">
              Analyzes joint angles, swing path, and posture timing in real time.
            </p>
          </div>

          <div className="bg-white border border-[#D0E6FF] rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F2F8FC] border border-[#4CB1FF]/30 flex items-center justify-center text-[#4CB1FF]">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2D2E2E] text-sm">Live Audio Cues</h3>
            <p className="text-xs text-[#4A4B4B] leading-relaxed">
              Instant voice feedback in your ear so you never have to look down at your screen.
            </p>
          </div>

          <div className="bg-white border border-[#D0E6FF] rounded-2xl p-5 space-y-2 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F5FAF5] border border-[#7CB078]/40 flex items-center justify-center text-[#7CB078]">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#2D2E2E] text-sm">Structured Plans</h3>
            <p className="text-xs text-[#4A4B4B] leading-relaxed">
              Bite-sized modules tailored to your schedule and verified with milestone clips.
            </p>
          </div>
        </div>

        {/* Visual Skills Showcase */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A4B4B] uppercase tracking-wider">
              Choose What You Want to Master:
            </span>
            <span className="text-[11px] text-[#FF7F2D] font-mono font-bold">{disciplines.length} Skills Available</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
            {disciplines.map((d) => (
              <button
                key={d.id}
                onClick={() => onStartOnboarding(d.id)}
                className="bg-white hover:bg-[#F5F6FC] border border-[#D0E6FF] hover:border-[#9C7BAC] rounded-xl p-3 flex flex-col items-center justify-center gap-2 text-center transition group cursor-pointer shadow-xs"
              >
                <div className="p-2 rounded-lg bg-[#F5F6FC] group-hover:bg-[#FEF6F4] transition">
                  {getDisciplineIcon(d.id)}
                </div>
                <span className="text-xs font-bold text-[#2D2E2E] group-hover:text-[#FF7F2D] transition">
                  {d.shortName || d.name}
                </span>
                <span className="text-[10px] text-[#4A4B4B] line-clamp-1">
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
