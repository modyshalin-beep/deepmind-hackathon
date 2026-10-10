'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function SignInPage() {
  const router = useRouter();
  const { signInWithEmail, signInAsDemoAthlete } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);
    const result = await signInWithEmail(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/');
    } else {
      setError(result.error || 'Failed to sign in. Please verify your credentials.');
    }
  };

  const handleQuickDemoLogin = () => {
    signInAsDemoAthlete();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#FBF8F1] text-[#182030] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#FEF3C7] selection:text-[#92400E]">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#FEF3C7]/80 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-[#FFEDD5]/80 rounded-full blur-3xl pointer-events-none" />

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
      <div className="w-full max-w-md bg-white border border-[#E6E0D4] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3" /> Athlete Sign In
          </span>
          <h1 className="text-2xl font-black text-[#182030]">Welcome Back</h1>
          <p className="text-xs text-[#5A6578] mt-1">Sign in to resume your deliberate practice and film reviews</p>
        </div>

        {/* 1-Click Fast Demo Athlete Access */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isLoading}
          className="w-full mb-4 bg-[#F4EFE6] hover:bg-[#E6E0D4] border border-[#E6E0D4] hover:border-[#D97706] text-[#182030] text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-between transition cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-[#C2410C] flex items-center justify-center text-white">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-left">
              <span className="block text-[#182030] group-hover:text-[#C2410C] transition-colors font-bold">Instant Demo Sign In</span>
              <span className="text-[10px] text-[#5A6578]">Alex Rivera (Beginner • 42.5 hrs)</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#5A6578] group-hover:text-[#C2410C] group-hover:translate-x-0.5 transition-all" />
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#E6E0D4] w-full" />
          <span className="bg-white px-3 text-[10px] uppercase font-bold text-[#5A6578] tracking-wider absolute">
            or continue with your email
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
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
                placeholder="athlete@domain.com"
                className="w-full bg-[#F4EFE6] border border-[#E6E0D4] focus:border-[#C2410C] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#182030] placeholder-[#5A6578] focus:outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#182030] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('On-device mode: enter any password or tap Instant Demo Sign In above.')}
                className="text-[11px] text-[#1D4ED8] hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#5A6578] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <div className="flex items-center justify-between text-xs text-[#5A6578] py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E6E0D4] text-[#C2410C] focus:ring-0 accent-[#C2410C]"
              />
              <span>Remember this device</span>
            </label>
            <span className="text-[10px] text-[#C2410C] font-mono">AirPods Ready</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#C2410C] hover:bg-[#9a3412] disabled:opacity-60 text-white font-black text-sm py-3.5 px-4 rounded-xl shadow-md shadow-[#C2410C]/25 flex items-center justify-center gap-2 transition cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Signing In...
              </span>
            ) : (
              <>
                Sign In to Studio <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer switcher */}
        <div className="mt-6 pt-5 border-t border-[#E6E0D4] text-center">
          <p className="text-xs text-[#5A6578]">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#C2410C] font-bold hover:underline">
              Create an Athlete Account
            </Link>
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-[#5A6578]">
        <ShieldCheck className="w-4 h-4 text-[#1D4ED8]" />
        <span>Private on-device model • Zero cloud subscription or credits required</span>
      </div>
    </div>
  );
}
