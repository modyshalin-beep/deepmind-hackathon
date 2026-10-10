'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Mic } from 'lucide-react';

interface AudioWaveformProps {
  stream: MediaStream | null;
  isListening: boolean;
  isCoachSpeaking: boolean;
  onVoiceActivity?: (volumePercent: number, isSpeaking: boolean) => void;
}

export function AudioWaveform({ stream, isListening, isCoachSpeaking, onVoiceActivity }: AudioWaveformProps) {
  const [barHeights, setBarHeights] = useState<number[]>([15, 25, 40, 20, 15, 30, 20]);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [volumePercent, setVolumePercent] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const speechHoldTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!stream || !isListening) {
      setIsSpeaking(false);
      setBarHeights([15, 20, 25, 20, 15, 20, 15]);
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.5;
      analyserRef.current = analyser;

      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateBars = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const normVolume = Math.min(100, Math.round((average / 128) * 100));
        setVolumePercent(normVolume);

        const speakingThreshold = 18;
        const currentSpeaking = normVolume > speakingThreshold && !isCoachSpeaking;

        if (currentSpeaking) {
          setIsSpeaking(true);
          if (speechHoldTimerRef.current) clearTimeout(speechHoldTimerRef.current);
          if (onVoiceActivity) onVoiceActivity(normVolume, true);
        } else {
          if (!speechHoldTimerRef.current) {
            speechHoldTimerRef.current = setTimeout(() => {
              setIsSpeaking(false);
              if (onVoiceActivity) onVoiceActivity(0, false);
              speechHoldTimerRef.current = null;
            }, 300);
          }
        }

        const newHeights = [
          Math.max(15, (dataArray[1] / 255) * 100),
          Math.max(20, (dataArray[3] / 255) * 100),
          Math.max(25, (dataArray[5] / 255) * 100),
          Math.max(20, (dataArray[7] / 255) * 100),
          Math.max(15, (dataArray[9] / 255) * 100),
          Math.max(25, (dataArray[11] / 255) * 100),
          Math.max(15, (dataArray[13] / 255) * 100),
        ];
        setBarHeights(newHeights);

        animFrameRef.current = requestAnimationFrame(updateBars);
      };

      updateBars();
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
    <div className="bg-[#FAF9F6]/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#E8E2D8] flex items-center gap-3 shadow-xs">
      <div className="flex items-center gap-1.5">
        <Mic className={`w-4 h-4 transition-all ${isSpeaking ? 'text-[#E8A5A5] animate-pulse scale-110' : 'text-[#6E757C]'}`} />
        <span className={`text-[11px] font-bold uppercase font-mono ${isSpeaking ? 'text-[#E8A5A5]' : 'text-[#6E757C]'}`}>
          {isSpeaking ? `VOICE DETECTED (${volumePercent}%)` : 'STUDENT MIC READY'}
        </span>
      </div>

      {/* Animated Soundwave Equalizer Bars */}
      <div className="flex items-center gap-1 h-6 px-1">
        {barHeights.map((h, idx) => (
          <div
            key={idx}
            className={`w-1 rounded-full transition-all duration-75 ${
              isSpeaking
                ? 'bg-gradient-to-t from-[#E8A5A5] via-[#A4C2F4] to-[#B5C99A]'
                : 'bg-[#E8E2D8]'
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
    </div>
  );
}
