'use client';

import React, { useState } from 'react';
import { VideoClip, Discipline, CoachProfile } from '@/types';
import { 
  Film, Share2, Star, Play, 
  BarChart3
} from 'lucide-react';
import { shareVideoOrCard } from '@/lib/webShare';

interface ReviewViewProps {
  clips: VideoClip[];
  disciplines: Discipline[];
  activeDiscipline: Discipline;
  coachProfile: CoachProfile;
  onToggleMilestone: (clipId: string) => void;
  onPruneClips: () => void;
}

export function ReviewView({
  clips,
  activeDiscipline,
  coachProfile,
  onToggleMilestone,
}: ReviewViewProps) {
  const [subView, setSubView] = useState<'clips' | 'mastery'>('clips');
  const [activePlayingClipId, setActivePlayingClipId] = useState<string | null>(null);

  const skillClips = clips.filter(c => c.disciplineId === activeDiscipline.id);

  const handleShare = async (clip: VideoClip) => {
    await shareVideoOrCard({
      title: `${clip.title} - Pocket Coach AI`,
      text: `My video practice breakdown in ${activeDiscipline.name}! Coach: "${clip.coachVoiceoverText}"`,
      url: window.location.href,
    });
  };

  const progress = coachProfile.skillsProgress?.[activeDiscipline.id];
  const hoursSpent = progress?.hoursSpent || 12;

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* ---------------- 1. HEADER & VIEW TOGGLE (FLATTENED) ---------------- */}
      <div className="bg-white border border-[#E8E2D8] rounded-3xl p-4 sm:p-5 flex items-center justify-between gap-3 shadow-xs">
        <div>
          <span className="text-[10px] font-mono text-[#E8A5A5] font-bold uppercase block">
            {activeDiscipline.name}
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#3E4348]">Review & Mastery</h2>
        </div>

        {/* View Toggle */}
        <div className="bg-[#F7F3EE] p-1 rounded-2xl flex items-center gap-1">
          <button
            onClick={() => setSubView('clips')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              subView === 'clips'
                ? 'bg-white text-[#3E4348] shadow-xs'
                : 'text-[#6E757C] hover:text-[#3E4348]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Clips ({skillClips.length})</span>
          </button>

          <button
            onClick={() => setSubView('mastery')}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
              subView === 'mastery'
                ? 'bg-white text-[#3E4348] shadow-xs'
                : 'text-[#6E757C] hover:text-[#3E4348]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Mastery</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. SUBVIEW: VIDEO CLIPS ---------------- */}
      {subView === 'clips' && (
        <div className="space-y-3">
          {skillClips.length === 0 ? (
            <div className="bg-white border border-[#E8E2D8] rounded-3xl p-8 text-center space-y-1 shadow-xs">
              <Film className="w-7 h-7 text-[#E8A5A5] mx-auto" />
              <h3 className="font-bold text-[#3E4348] text-sm">No Recorded Clips Yet</h3>
              <p className="text-xs text-[#6E757C]">Complete practice in Lesson Plans to capture video reps.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {skillClips.map((clip) => {
                const isPlaying = activePlayingClipId === clip.id;

                return (
                  <div
                    key={clip.id}
                    className="bg-white border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    {/* Video Player */}
                    <div className="relative aspect-video bg-[#3E4348] flex items-center justify-center">
                      {isPlaying ? (
                        <video
                          src={clip.videoUrl}
                          controls
                          autoPlay
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <img
                            src={clip.thumbnailUrl}
                            alt={clip.title}
                            className="w-full h-full object-cover opacity-80"
                          />
                          <button
                            onClick={() => setActivePlayingClipId(clip.id)}
                            className="absolute w-10 h-10 rounded-full bg-[#A4C2F4] text-[#3E4348] flex items-center justify-center shadow-sm hover:scale-110 transition cursor-pointer"
                          >
                            <Play className="w-4 h-4 fill-[#3E4348] ml-0.5" />
                          </button>
                        </>
                      )}

                      <span className="absolute top-2 left-2 text-[9px] font-bold uppercase bg-white/95 text-[#42592B] px-2 py-0.5 rounded-full">
                        {clip.repType === 'model' ? '★ Model' : 'Adjustment'}
                      </span>

                      <span className="absolute bottom-2 right-2 text-[9px] font-mono bg-black/70 text-white px-2 py-0.5 rounded-full">
                        {clip.durationSeconds}s • {clip.fpsCaptured} FPS
                      </span>
                    </div>

                    {/* Clip Info (Un-nested) */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#3E4348]">{clip.title}</h4>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleMilestone(clip.id)}
                            className="p-1 rounded-lg text-[#6E757C] hover:text-[#E8A5A5] transition cursor-pointer"
                            title="Star Milestone"
                          >
                            <Star className={`w-3.5 h-3.5 ${clip.isMilestone ? 'fill-[#E8A5A5] text-[#E8A5A5]' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleShare(clip)}
                            className="p-1 rounded-lg text-[#6E757C] hover:text-[#A4C2F4] transition cursor-pointer"
                            title="Share"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-[#6E757C] italic">
                        &quot;{clip.coachVoiceoverText}&quot;
                      </p>

                      {clip.keyframeNotes && clip.keyframeNotes.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {clip.keyframeNotes.map((note, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-mono bg-[#F7F3EE] text-[#3E4348] px-2 py-0.5 rounded-lg"
                            >
                              +{note.timeOffsetSeconds}s: {note.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ---------------- 3. SUBVIEW: MASTERY (UN-NESTED) ---------------- */}
      {subView === 'mastery' && (
        <div className="space-y-3">
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeDiscipline.coachPersona.avatar}
                alt={activeDiscipline.coachPersona.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#E8A5A5]"
              />
              <div>
                <h3 className="text-base font-bold text-[#3E4348]">{activeDiscipline.name}</h3>
                <span className="text-xs text-[#42592B] font-mono font-bold">
                  Coach {activeDiscipline.coachPersona.name} • {activeDiscipline.overallScore}/10
                </span>
              </div>
            </div>

            <span className="text-sm font-black text-[#3E4348] bg-[#F7F3EE] px-3.5 py-1.5 rounded-2xl border border-[#E8E2D8]">
              {hoursSpent}h logged
            </span>
          </div>

          {/* Sub-skills (Clean meters, un-nested) */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#6E757C] uppercase tracking-wider">
              Biomechanics Breakdown
            </h4>

            <div className="space-y-2.5">
              {activeDiscipline.subcomponents.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#3E4348]">{sub.name}</span>
                    <span className="font-mono text-[#3E4348] font-bold">{sub.score} / 10</span>
                  </div>
                  <div className="w-full bg-[#E8E2D8] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#A4C2F4] to-[#B5C99A] h-full rounded-full"
                      style={{ width: `${(sub.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Note */}
          <div className="bg-white border border-[#E8E2D8] rounded-3xl p-4 text-xs text-[#6E757C] shadow-xs">
            <span className="font-bold text-[#E8A5A5] block mb-0.5">Coach Prescription:</span>
            Focusing on <strong className="text-[#3E4348]">{activeDiscipline.microFocus}</strong> to build repeatable muscle memory.
          </div>
        </div>
      )}
    </div>
  );
}
