'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { INITIAL_DISCIPLINES } from '@/lib/mockData';
import { SkillLevel } from '@/types';

export default function SignUpPage() {
  const router = useRouter();
  const { signUpWithEmail } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedDisciplineId, setSelectedDisciplineId] = useState('yoga');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<SkillLevel>('beginner');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    const result = await signUpWithEmail(
      email,
      password,
      fullName,
      selectedDisciplineId,
      selectedSkillLevel
    );
    setIsLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Failed to create athlete account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#3E4348] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#A4C2F4]/40 selection:text-[#3E4348]">
      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8A5A5] via-[#A4C2F4] to-[#E9D78E] flex items-center justify-center font-black text-[#3E4348] text-lg shadow-sm group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight text-[#3E4348] block leading-none">POCKET COACH</span>
            <span className="text-[11px] text-[#E8A5A5] font-mono tracking-widest uppercase font-bold">Mindful Practice</span>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#E8A5A5]/25 text-[#9E3E3E] border border-[#E8A5A5]/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-[#E8A5A5]" /> New Athlete Registration
          </span>
          <h1 className="text-2xl font-black text-[#3E4348]">Start Mindful Practice</h1>
          <p className="text-xs text-[#6E757C] mt-1">Create your profile for gentle, real-time AI guided mentoring</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-2xl font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#3E4348] mb-1.5 uppercase tracking-wider">
              Your Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nat"
                className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E4348] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nat@example.com"
                className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#3E4348] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-10 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6E757C] hover:text-[#3E4348]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Discipline Chooser */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#3E4348] mb-2 uppercase tracking-wider">
              Primary Practice Focus
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_DISCIPLINES.map((d) => {
                const isSelected = selectedDisciplineId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDisciplineId(d.id)}
                    className={`p-3 rounded-2xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-white border-[#A4C2F4] text-[#3E4348] ring-2 ring-[#A4C2F4]/30 shadow-xs'
                        : 'bg-[#F7F3EE] border border-[#E8E2D8] text-[#6E757C] hover:text-[#3E4348]'
                    }`}
                  >
                    <span className="truncate">{d.name.split(' ')[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#3E4348] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Level Selection */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#3E4348] mb-2 uppercase tracking-wider">
              Starting Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner' as SkillLevel, label: 'Beginner' },
                { id: 'intermediate' as SkillLevel, label: 'Intermediate' },
                { id: 'advanced' as SkillLevel, label: 'Advanced' },
              ].map((lvl) => {
                const isSelected = selectedSkillLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedSkillLevel(lvl.id)}
                    className={`py-2 px-2.5 rounded-2xl border text-center text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#A4C2F4] text-[#3E4348] border-[#A4C2F4] shadow-xs'
                        : 'bg-[#F7F3EE] border border-[#E8E2D8] text-[#6E757C] hover:text-[#3E4348]'
                    }`}
                  >
                    {lvl.label}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#E8A5A5] hover:bg-[#df9090] disabled:opacity-60 text-white font-black text-sm py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer mt-4 transform active:scale-95"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting Up Profile...
              </span>
            ) : (
              <>
                Create Account & Enter Studio <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-6 pt-5 border-t border-[#E8E2D8] text-center">
          <p className="text-xs text-[#6E757C]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#A4C2F4] font-bold hover:text-[#3E4348] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-[#6E757C]">
        <ShieldCheck className="w-4 h-4 text-[#B5C99A]" />
        <span>Private on-device model • Low-pressure mindful guidance</span>
      </div>
    </div>
  );
}
