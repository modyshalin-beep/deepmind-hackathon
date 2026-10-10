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
    <div className="min-h-screen bg-[#F7F3EE] text-[#3E4348] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#A4C2F4]/40 selection:text-[#3E4348]">
      {/* Brand Header */}
      <div className="mb-8 text-center relative z-10">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E8A5A5] via-[#A4C2F4] to-[#E9D78E] flex items-center justify-center font-black text-[#3E4348] text-xs shadow-sm group-hover:scale-105 transition-transform">
            10K
          </div>
          <div className="text-left">
            <span className="text-xl font-black tracking-tight text-[#3E4348] block leading-none">TenK</span>
            <span className="text-[11px] text-[#E8A5A5] font-mono tracking-widest uppercase font-bold">Mindful Practice</span>
          </div>
        </Link>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest bg-[#E8A5A5]/25 text-[#9E3E3E] border border-[#E8A5A5]/40 px-3 py-1 rounded-full inline-flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3 h-3 text-[#E8A5A5]" /> Athlete Sign In
          </span>
          <h1 className="text-2xl font-black text-[#3E4348]">Welcome Back</h1>
          <p className="text-xs text-[#6E757C] mt-1">Sign in to resume your peaceful deliberate practice</p>
        </div>

        {/* 1-Click Fast Demo Athlete Access */}
        <button
          type="button"
          onClick={handleQuickDemoLogin}
          disabled={isLoading}
          className="w-full mb-4 bg-[#F7F3EE] hover:bg-white border border-[#E8E2D8] hover:border-[#A4C2F4] text-[#3E4348] text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-between transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-xl bg-[#A4C2F4] flex items-center justify-center text-[#3E4348]">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div className="text-left">
              <span className="block text-[#3E4348] group-hover:text-[#E8A5A5] transition-colors font-bold">Instant Demo Sign In</span>
              <span className="text-[10px] text-[#6E757C]">Alex Rivera (Intermediate • 42.5 hrs)</span>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-[#6E757C] group-hover:text-[#E8A5A5] group-hover:translate-x-0.5 transition-all" />
        </button>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#E8E2D8] w-full" />
          <span className="bg-[#FAF9F6] px-3 text-[10px] uppercase font-bold text-[#6E757C] tracking-wider absolute">
            or continue with your email
          </span>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs px-3.5 py-2.5 rounded-2xl font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        {/* Sign In Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
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
                placeholder="athlete@domain.com"
                className="w-full bg-[#F7F3EE] border border-[#E8E2D8] focus:border-[#A4C2F4] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-[#3E4348] placeholder-[#6E757C]/60 focus:outline-none transition shadow-2xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#3E4348] uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('On-device mode: enter any password or tap Instant Demo Sign In above.')}
                className="text-[11px] text-[#A4C2F4] hover:underline font-bold"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6E757C] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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

          <div className="flex items-center justify-between text-xs text-[#6E757C] py-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#E8E2D8] text-[#A4C2F4] focus:ring-0 accent-[#A4C2F4]"
              />
              <span>Remember this device</span>
            </label>
            <span className="text-[10px] text-[#42592B] font-mono font-bold">AirPods Ready</span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#A4C2F4] hover:bg-[#8bb2f2] disabled:opacity-60 text-[#3E4348] font-black text-sm py-3.5 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 transition cursor-pointer mt-2 transform active:scale-95"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-[#3E4348] border-t-transparent rounded-full animate-spin" />
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
        <div className="mt-6 pt-5 border-t border-[#E8E2D8] text-center">
          <p className="text-xs text-[#6E757C]">
            Don&apos;t have an account?{' '}
            <Link href="/sign-up" className="text-[#E8A5A5] font-bold hover:text-[#3E4348] hover:underline">
              Create an Athlete Account
            </Link>
          </p>
        </div>
      </div>

      {/* Security note */}
      <div className="mt-6 flex items-center gap-2 text-[11px] text-[#6E757C]">
        <ShieldCheck className="w-4 h-4 text-[#B5C99A]" />
        <span>Private on-device model • Zero cloud subscription or credits required</span>
      </div>
    </div>
  );
}
