'use client';

import React from 'react';
import Link from 'next/link';
import { Discipline } from '@/types';
import { useAuth } from '@/context/AuthContext';
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
  const { user } = useAuth();
  
  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-5 h-5 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-5 h-5 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-5 h-5 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-5 h-5 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-5 h-5 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-5 h-5 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-5 h-5 text-[#B5C99A]" />;
      default: return <Activity className="w-5 h-5 text-[#A4C2F4]" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#3E4348] flex flex-col font-sans selection:bg-[#A4C2F4]/40 selection:text-[#3E4348]">
      {/* Top Simple Brand Bar */}
      <header className="border-b border-[#E8E2D8] px-6 py-4 bg-[#FAF9F6]/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E8A5A5] via-[#A4C2F4] to-[#E9D78E] flex items-center justify-center font-black text-[#3E4348] text-base shadow-xs">
              P
            </div>
            <span className="font-black text-base tracking-tight text-[#3E4348]">POCKET COACH</span>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <button
                onClick={onExploreDemo}
                className="bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] text-xs font-black px-4 py-2 rounded-2xl shadow-xs transition cursor-pointer flex items-center gap-1.5 transform active:scale-95"
              >
                <span>Enter Studio ({user.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="text-xs font-bold text-[#E8A5A5] hover:text-[#3E4348] hover:underline px-3 py-1.5 transition"
                >
                  Sign In
                </Link>
                <button
                  onClick={onExploreDemo}
                  className="text-xs font-bold text-[#3E4348] hover:bg-white px-4 py-2 rounded-2xl border border-[#E8E2D8] hover:border-[#A4C2F4] transition cursor-pointer shadow-xs"
                >
                  Explore Dashboard
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Hero Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-8 flex flex-col items-center justify-center gap-10 text-center">
        {/* Hero Title & Value Proposition */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-[#E8A5A5]/25 border border-[#E8A5A5]/50 text-[#9E3E3E] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Gentle, Cozy AI Coaching
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#3E4348] leading-tight">
            Your Friendly AI Mentor for Physical Skills.
          </h1>

          <p className="text-sm sm:text-base text-[#6E757C] leading-relaxed max-w-xl mx-auto">
            Prop your phone and practice peacefully. Pocket Coach watches your movement via camera and guides you with warm, supportive voice cues in real time.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onStartOnboarding()}
              className="w-full sm:w-auto bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black text-base py-3.5 px-8 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto bg-[#FAF9F6] hover:bg-white text-[#3E4348] font-bold text-sm py-3.5 px-6 rounded-2xl border border-[#E8E2D8] transition cursor-pointer shadow-xs"
            >
              View Sample Lesson Plans
            </button>
          </div>
        </div>

        {/* 3 Visual Pillars (Un-nested) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full text-left">
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-[#E8A5A5]/20 flex items-center justify-center text-[#E8A5A5]">
              <Video className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#3E4348] text-sm">Gentle Vision Guidance</h3>
            <p className="text-xs text-[#6E757C] leading-relaxed">
              Checks posture, joint angles, and flow in real time.
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-[#A4C2F4]/20 flex items-center justify-center text-[#30538A]">
              <Volume2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#3E4348] text-sm">Audio Cues</h3>
            <p className="text-xs text-[#6E757C] leading-relaxed">
              Quiet voice cues keep you centered in your practice.
            </p>
          </div>

          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 space-y-1.5 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-[#B5C99A]/20 flex items-center justify-center text-[#42592B]">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-[#3E4348] text-sm">Bite-Sized Progress</h3>
            <p className="text-xs text-[#6E757C] leading-relaxed">
              Calm practice bursts tailored to your rhythm.
            </p>
          </div>
        </div>

        {/* Visual Skills Showcase (Un-nested) */}
        <div className="w-full space-y-2.5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#6E757C] uppercase tracking-wider">
              Choose a Skill:
            </span>
            <span className="text-[11px] text-[#E8A5A5] font-mono font-bold">{disciplines.length} Skills</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
            {disciplines.map((d) => (
              <button
                key={d.id}
                onClick={() => onStartOnboarding(d.id)}
                className="bg-white hover:bg-[#FAF9F6] border border-[#E8E2D8] hover:border-[#A4C2F4] rounded-2xl p-3 flex flex-col items-center justify-center gap-1.5 text-center transition group cursor-pointer shadow-xs"
              >
                <div className="text-lg">
                  {getDisciplineIcon(d.id)}
                </div>
                <span className="text-xs font-bold text-[#3E4348] group-hover:text-[#E8A5A5] transition">
                  {d.shortName || d.name}
                </span>
                <span className="text-[10px] text-[#6E757C]">
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
