'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';

interface AudioWaveformProps {
  stream: MediaStream | null;
  isListening: boolean;
  isCoachSpeaking: boolean; // Ignore echo while coach speaks
  onVoiceActivity?: (volumePercent: number) => void;
}

export function AudioWaveform({ stream, isListening, isCoachSpeaking, onVoiceActivity }: AudioWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>([15, 10, 25, 18, 30, 12, 22, 15, 28, 14, 20, 10]);
  const [volumePercent, setVolumePercent] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!stream || !isListening) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      setVolumePercent(0);
      setIsSpeaking(false);
      return;
    }

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAmplitude = () => {
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        const newHeights: number[] = [];

        for (let i = 0; i < dataArray.length; i++) {
          const value = dataArray[i];
          sum += value;
          const height = Math.max(10, Math.min(100, Math.round((value / 255) * 100)));
          newHeights.push(height);
        }

        const avgVolume = Math.round((sum / (dataArray.length * 255)) * 100);
        setVolumePercent(avgVolume);
        setBarHeights(newHeights.length >= 12 ? newHeights.slice(0, 12) : [...newHeights, ...Array(12 - newHeights.length).fill(10)]);

        // Voice Activity Detection with Echo Suppression (Ignore audio when coach is talking)
        const isUserSpeakingVol = avgVolume > 22 && !isCoachSpeaking;

        if (isUserSpeakingVol) {
          setIsSpeaking(true);
          if (onVoiceActivity) onVoiceActivity(avgVolume);

          if (speechHoldTimerRef.current) clearTimeout(speechHoldTimerRef.current);
          speechHoldTimerRef.current = setTimeout(() => {
            setIsSpeaking(false);
          }, 800); // Stable 800ms hold to prevent flickering
        }

        animFrameRef.current = requestAnimationFrame(updateAmplitude);
      };

      updateAmplitude();
    } catch (err) {
      console.warn('AudioContext setup error:', err);
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (speechHoldTimerRef.current) clearTimeout(speechHoldTimerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try { audioCtxRef.current.close(); } catch {}
      }
    };
  }, [stream, isListening, isCoachSpeaking, onVoiceActivity]);

  return (
    <div className="bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 flex items-center gap-3 shadow-lg">
      <div className="flex items-center gap-1.5">
        <Mic className={`w-4 h-4 transition-all ${isSpeaking ? 'text-emerald-400 animate-pulse scale-110' : 'text-slate-400'}`} />
        <span className={`text-[11px] font-bold uppercase font-mono ${isSpeaking ? 'text-emerald-400' : 'text-slate-400'}`}>
          {isSpeaking ? `STUDENT VOICE DETECTED (${volumePercent}%)` : 'STUDENT MIC READY'}
        </span>
      </div>

      {/* Animated Soundwave Equalizer Bars */}
      <div className="flex items-center gap-1 h-6 px-1">
        {barHeights.map((h, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-75 ${
              isSpeaking
                ? 'bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                : 'bg-slate-700'
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
