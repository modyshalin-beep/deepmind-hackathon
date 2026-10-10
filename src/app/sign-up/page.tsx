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
    <div className="min-h-screen bg-[#FBF8F1] text-[#182030] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#FEF3C7] selection:text-[#92400E]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-[#FEF3C7]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-[#FFEDD5]/80 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#C2410C] to-[#D97706] flex items-center justify-center font-black text-white text-lg shadow-sm group-hover:scale-105 transition-transform">
            P
          </div>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight text-[#182030] block leading-none">POCKET COACH</span>
            <span className="text-[11px] text-[#C2410C] font-mono tracking-widest uppercase">10k-Hour Deliberate Practice</span>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white border border-[#E6E0D4] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3" /> New Athlete Registration
          </span>
          <h1 className="text-2xl font-black text-[#182030]">Start 10,000-Hour Mastery</h1>
          <p className="text-xs text-[#5A6578] mt-1">Create your athlete profile for personalized Gemini AI real-time mentoring</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Sign Up Form */}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#182030] mb-1.5 uppercase tracking-wider">
              Athlete Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#5A6578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jordan Lee"
                className="w-full bg-[#F4EFE6] border border-[#E6E0D4] focus:border-[#C2410C] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#182030] placeholder-[#5A6578] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182030] mb-1.5 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#5A6578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@domain.com"
                className="w-full bg-[#F4EFE6] border border-[#E6E0D4] focus:border-[#C2410C] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#182030] placeholder-[#5A6578] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#182030] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5A6578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full bg-[#F4EFE6] border border-[#E6E0D4] focus:border-[#C2410C] rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#182030] placeholder-[#5A6578] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5A6578] hover:text-[#182030]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Primary Discipline Chooser */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#182030] mb-2 uppercase tracking-wider">
              Primary Sport / Skill Focus
            </label>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_DISCIPLINES.map((d) => {
                const isSelected = selectedDisciplineId === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDisciplineId(d.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#FFEDD5] border-[#C2410C] text-[#182030] shadow-xs'
                        : 'bg-[#F4EFE6] border-[#E6E0D4] text-[#5A6578] hover:text-[#182030]'
                    }`}
                  >
                    <span className="truncate">{d.name.split(' ')[0]}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skill Level Selection */}
          <div className="pt-1">
            <label className="block text-xs font-bold text-[#182030] mb-2 uppercase tracking-wider">
              Starting Skill Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'beginner' as SkillLevel, label: 'Beginner' },
                { id: 'intermediate' as SkillLevel, label: 'Intermediate' },
                { id: 'advanced' as SkillLevel, label: 'Elite' },
              ].map((lvl) => {
                const isSelected = selectedSkillLevel === lvl.id;
                return (
                  <button
                    key={lvl.id}
                    type="button"
                    onClick={() => setSelectedSkillLevel(lvl.id)}
                    className={`py-2 px-2.5 rounded-xl border text-center text-xs font-bold transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#C2410C] text-white border-[#C2410C]'
                        : 'bg-[#F4EFE6] border-[#E6E0D4] text-[#5A6578] hover:text-[#182030]'
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
            className="w-full bg-[#C2410C] hover:bg-[#9a3412] disabled:opacity-60 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md shadow-[#C2410C]/25 flex items-center justify-center gap-2 transition cursor-pointer mt-4"
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
        <div className="mt-6 pt-5 border-t border-[#E6E0D4] text-center">
          <p className="text-xs text-[#5A6578]">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-[#C2410C] font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-[#5A6578]">
        <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
        <span>Private biometric & video models stored securely on-device</span>
      </div>
    </div>
  );
}
