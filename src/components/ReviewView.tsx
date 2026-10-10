'use client';

import React, { useState } from 'react';
import { VideoClip, Discipline, CoachProfile } from '@/types';
import { 
  Film, Share2, Star, Play, BarChart3, Clock, Target, Award
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
  // Sub-tab: 'clips' vs 'mastery'
  const [subView, setSubView] = useState<'clips' | 'mastery'>('clips');

  // Currently playing clip
  const [activePlayingClipId, setActivePlayingClipId] = useState<string | null>(null);

  // Clips filtered strictly by active discipline (no redundant second filter)
  const skillClips = clips.filter(c => c.disciplineId === activeDiscipline.id);

  const handleShare = async (clip: VideoClip) => {
    await shareVideoOrCard({
      title: `${clip.title} - Pocket Coach AI`,
      text: `My 30 FPS video breakdown in ${activeDiscipline.name}! Coach feedback: "${clip.coachVoiceoverText}"`,
      url: window.location.href,
    });
  };

  const progress = coachProfile.skillsProgress?.[activeDiscipline.id];
  const hoursSpent = progress?.hoursSpent || 12;

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* ---------------- 1. HEADER & VIEW TOGGLE ---------------- */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
            {activeDiscipline.name}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">Review & Mastery</h2>
        </div>

        {/* Sub-view switcher */}
        <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setSubView('clips')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              subView === 'clips'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Clips ({skillClips.length})</span>
          </button>

          <button
            onClick={() => setSubView('mastery')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
              subView === 'mastery'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Skill Mastery</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. SUBVIEW: VIDEO CLIPS ---------------- */}
      {subView === 'clips' && (
        <div className="space-y-4">
          {skillClips.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center space-y-2">
              <Film className="w-8 h-8 text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-300 text-sm">No Recorded Clips Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete a session in Lesson Plans to capture 30 FPS video bursts and AI coach breakdown commentary for {activeDiscipline.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skillClips.map((clip) => {
                const isPlaying = activePlayingClipId === clip.id;

                return (
                  <div
                    key={clip.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
                  >
                    {/* Video Player or Thumbnail */}
                    <div className="relative aspect-video bg-black flex items-center justify-center">
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
                            className="absolute w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition cursor-pointer"
                          >
                            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                          </button>
                        </>
                      )}

                      {/* Rep Type Badge */}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold uppercase bg-slate-950/80 text-emerald-400 px-2 py-0.5 rounded border border-slate-800">
                        {clip.repType === 'model' ? '★ Model Rep' : 'Adjustment Rep'}
                      </span>

                      {/* FPS Badge */}
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono bg-slate-950/80 text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                        {clip.fpsCaptured} FPS
                      </span>
                    </div>

                    {/* Clip Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-white">{clip.title}</h4>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            {clip.durationSeconds}s drill rep
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleMilestone(clip.id)}
                            className={`p-1.5 rounded-lg border transition ${
                              clip.isMilestone
                                ? 'bg-amber-950/80 text-amber-400 border-amber-800'
                                : 'text-slate-500 border-slate-800 hover:text-white'
                            }`}
                            title="Star Milestone"
                          >
                            <Star className={`w-3.5 h-3.5 ${clip.isMilestone ? 'fill-amber-400' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleShare(clip)}
                            className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white transition"
                            title="Share Breakdown"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Coach Audio Commentary */}
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                        &quot;{clip.coachVoiceoverText}&quot;
                      </div>

                      {/* Keyframe Notes */}
                      {clip.keyframeNotes && clip.keyframeNotes.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">Keyframe Diagnostics:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {clip.keyframeNotes.map((note, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono bg-slate-850 text-slate-300 px-2 py-0.5 rounded border border-slate-800"
                              >
                                {note.timeOffsetSeconds}s: {note.label}
                              </span>
                            ))}
                          </div>
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

      {/* ---------------- 3. SUBVIEW: MASTERY ANALYTICS ---------------- */}
      {subView === 'mastery' && (
        <div className="space-y-4">
          {/* Target Skill Stats Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={activeDiscipline.coachPersona.avatar}
                alt={activeDiscipline.coachPersona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400"
              />
              <div>
                <h3 className="text-base font-bold text-white">{activeDiscipline.name}</h3>
                <span className="text-xs text-emerald-400 font-mono">
                  Coach {activeDiscipline.coachPersona.name} • {activeDiscipline.overallScore} / 10 Verified
                </span>
              </div>
            </div>

            <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Deliberate Practice</span>
              <span className="text-base font-black text-emerald-400">
                {hoursSpent}h logged
              </span>
            </div>
          </div>

          {/* Subcomponents Skill Ratings */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Biomechanics & Sub-Skill Breakdown
            </h4>

            <div className="space-y-3">
              {activeDiscipline.subcomponents.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{sub.name}</span>
                    <span className="font-mono text-emerald-400 font-bold">{sub.score} / 10</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full"
                      style={{ width: `${(sub.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Latest Notes Log */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Coach Prescription
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              &quot;Focusing on <strong className="text-emerald-400">{activeDiscipline.microFocus}</strong>. Every drill reinforces sub-second reaction timing and repeatable biomechanics.&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
