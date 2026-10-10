'use client';

import React, { useState } from 'react';
import { VideoClip, Discipline, CoachProfile } from '@/types';
import { 
  Film, Share2, Star, Play, 
  Sparkles, Target, BarChart3, 
  Activity, Zap, Utensils, Heart, Music
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
  disciplines,
  activeDiscipline,
  coachProfile,
  onToggleMilestone,
  onPruneClips,
}: ReviewViewProps) {
  // Enrolled skills
  const enrolledIds = coachProfile.enrolledDisciplineIds || [activeDiscipline.id];
  const enrolledDisciplines = disciplines.filter(d => enrolledIds.includes(d.id));

  // Filter by skill
  const [selectedFilterSkillId, setSelectedFilterSkillId] = useState<string>('all');
  
  // Sub-tab: 'clips' vs 'mastery'
  const [subView, setSubView] = useState<'clips' | 'mastery'>('clips');

  // Currently playing clip
  const [activePlayingClipId, setActivePlayingClipId] = useState<string | null>(null);

  // Filtered clips
  const filteredClips = selectedFilterSkillId === 'all'
    ? clips
    : clips.filter(c => c.disciplineId === selectedFilterSkillId);

  // Discipline for mastery view
  const targetMasteryDiscipline = selectedFilterSkillId === 'all'
    ? activeDiscipline
    : (disciplines.find(d => d.id === selectedFilterSkillId) || activeDiscipline);

  const handleShare = async (clip: VideoClip) => {
    const disciplineName = disciplines.find(d => d.id === clip.disciplineId)?.name || 'Sports';
    await shareVideoOrCard({
      title: `${clip.title} - Pocket Coach AI`,
      text: `My video practice breakdown in ${disciplineName}! Coach: "${clip.coachVoiceoverText}"`,
      url: window.location.href,
    });
  };

  const getDisciplineIcon = (id: string) => {
    switch (id) {
      case 'tennis': return <Activity className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'boxing': return <Zap className="w-3.5 h-3.5 text-[#E9D78E]" />;
      case 'dance': return <Sparkles className="w-3.5 h-3.5 text-[#A4C2F4]" />;
      case 'cooking': return <Utensils className="w-3.5 h-3.5 text-[#B5C99A]" />;
      case 'guitar': return <Music className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'yoga': return <Heart className="w-3.5 h-3.5 text-[#E8A5A5]" />;
      case 'golf': return <Target className="w-3.5 h-3.5 text-[#B5C99A]" />;
      default: return <Activity className="w-3.5 h-3.5 text-[#A4C2F4]" />;
    }
  };

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* ---------------- 1. HEADER & VIEW TOGGLE ---------------- */}
      <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-[10px] font-mono text-[#E8A5A5] font-bold uppercase tracking-wider block">
            Review Hub
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#3E4348]">Video Reps & Skill Analytics</h2>
        </div>

        {/* Sub-view switcher */}
        <div className="bg-[#F7F3EE] p-1 rounded-2xl border border-[#E8E2D8] flex items-center gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setSubView('clips')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              subView === 'clips'
                ? 'bg-[#A4C2F4] text-[#3E4348] font-black shadow-xs'
                : 'text-[#6E757C] hover:text-[#3E4348]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Video Clips ({filteredClips.length})</span>
          </button>

          <button
            onClick={() => setSubView('mastery')}
            className={`flex-1 sm:flex-initial text-xs font-bold px-3.5 py-1.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              subView === 'mastery'
                ? 'bg-[#A4C2F4] text-[#3E4348] font-black shadow-xs'
                : 'text-[#6E757C] hover:text-[#3E4348]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Skill Mastery</span>
          </button>
        </div>
      </div>

      {/* ---------------- 2. SKILL FILTER PILLS ---------------- */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedFilterSkillId('all')}
          className={`text-xs font-bold px-3.5 py-1.5 rounded-2xl border transition shrink-0 cursor-pointer ${
            selectedFilterSkillId === 'all'
              ? 'bg-[#E8A5A5] text-white border-[#E8A5A5] font-black shadow-xs'
              : 'bg-[#FAF9F6] text-[#6E757C] border-[#E8E2D8] hover:border-[#A4C2F4]'
          }`}
        >
          All Enrolled Skills
        </button>

        {enrolledDisciplines.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedFilterSkillId(d.id)}
            className={`text-xs font-bold px-3.5 py-1.5 rounded-2xl border transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              selectedFilterSkillId === d.id
                ? 'bg-[#E8A5A5] text-white border-[#E8A5A5] font-black shadow-xs'
                : 'bg-[#FAF9F6] text-[#6E757C] border-[#E8E2D8] hover:border-[#A4C2F4]'
            }`}
          >
            {getDisciplineIcon(d.id)}
            <span>{d.shortName || d.name}</span>
          </button>
        ))}
      </div>

      {/* ---------------- 3. SUBVIEW: VIDEO CLIPS ---------------- */}
      {subView === 'clips' && (
        <div className="space-y-4">
          {filteredClips.length === 0 ? (
            <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-10 text-center space-y-2 shadow-xs">
              <Film className="w-8 h-8 text-[#E8A5A5] mx-auto" />
              <h3 className="font-bold text-[#3E4348] text-sm">No Recorded Clips Yet</h3>
              <p className="text-xs text-[#6E757C] max-w-sm mx-auto">
                Complete a practice session in Lesson Plans to capture 30 FPS video bursts and AI coach commentary.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClips.map((clip) => {
                const isPlaying = activePlayingClipId === clip.id;
                const disc = disciplines.find(d => d.id === clip.disciplineId);

                return (
                  <div
                    key={clip.id}
                    className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    {/* Video Player or Thumbnail */}
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
                            className="absolute w-12 h-12 rounded-full bg-[#A4C2F4] text-[#3E4348] flex items-center justify-center shadow-md hover:scale-110 transition cursor-pointer"
                          >
                            <Play className="w-5 h-5 fill-[#3E4348] ml-0.5" />
                          </button>
                        </>
                      )}

                      {/* Rep Type Badge */}
                      <span className="absolute top-2.5 left-2.5 text-[9px] font-mono font-bold uppercase bg-white/90 text-[#42592B] px-2.5 py-0.5 rounded-full border border-[#B5C99A]">
                        {clip.repType === 'model' ? '★ Model Rep' : 'Adjustment Rep'}
                      </span>

                      {/* FPS Badge */}
                      <span className="absolute bottom-2.5 right-2.5 text-[9px] font-mono bg-black/70 text-white px-2 py-0.5 rounded-full border border-white/20">
                        {clip.fpsCaptured} FPS
                      </span>
                    </div>

                    {/* Clip Info */}
                    <div className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-[#3E4348]">{clip.title}</h4>
                          <span className="text-[11px] text-[#E8A5A5] font-mono font-bold">
                            {disc?.name || 'Skill'} • {clip.durationSeconds}s
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onToggleMilestone(clip.id)}
                            className={`p-1.5 rounded-xl border transition cursor-pointer ${
                              clip.isMilestone
                                ? 'bg-[#E8A5A5]/25 text-[#9E3E3E] border-[#E8A5A5]/40'
                                : 'text-[#6E757C] border-[#E8E2D8] hover:border-[#A4C2F4]'
                            }`}
                            title="Star Milestone"
                          >
                            <Star className={`w-3.5 h-3.5 ${clip.isMilestone ? 'fill-[#E8A5A5]' : ''}`} />
                          </button>

                          <button
                            onClick={() => handleShare(clip)}
                            className="p-1.5 rounded-xl border border-[#E8E2D8] text-[#6E757C] hover:text-[#A4C2F4] hover:border-[#A4C2F4] transition cursor-pointer"
                            title="Share Breakdown"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Coach Audio Commentary */}
                      <div className="bg-[#F7F3EE] p-3 rounded-2xl border border-[#E8E2D8] text-xs text-[#3E4348] italic">
                        &quot;{clip.coachVoiceoverText}&quot;
                      </div>

                      {/* Keyframe Notes */}
                      {clip.keyframeNotes && clip.keyframeNotes.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="text-[10px] font-mono text-[#6E757C] uppercase block font-semibold">Keyframe Diagnostics:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {clip.keyframeNotes.map((note, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-mono bg-white text-[#3E4348] px-2.5 py-0.5 rounded-full border border-[#E8E2D8] font-medium"
                              >
                                +{note.timeOffsetSeconds}s: {note.label}
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

      {/* ---------------- 4. SUBVIEW: MASTERY ANALYTICS ---------------- */}
      {subView === 'mastery' && (
        <div className="space-y-4">
          {/* Target Skill Stats Banner */}
          <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <img
                src={targetMasteryDiscipline.coachPersona.avatar}
                alt={targetMasteryDiscipline.coachPersona.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#E8A5A5]"
              />
              <div>
                <h3 className="text-base font-bold text-[#3E4348]">{targetMasteryDiscipline.name}</h3>
                <span className="text-xs text-[#42592B] font-mono font-bold bg-[#B5C99A]/30 px-2.5 py-0.5 rounded-full border border-[#B5C99A]/50">
                  Coach {targetMasteryDiscipline.coachPersona.name} • {targetMasteryDiscipline.overallScore} / 10 Verified
                </span>
              </div>
            </div>

            <div className="bg-[#F7F3EE] px-4 py-2 rounded-2xl border border-[#E8E2D8] text-right">
              <span className="text-[10px] text-[#6E757C] uppercase font-mono block">Deliberate Practice</span>
              <span className="text-base font-black text-[#3E4348]">
                {coachProfile.skillsProgress?.[targetMasteryDiscipline.id]?.hoursSpent || 12}h logged
              </span>
            </div>
          </div>

          {/* Subcomponents Skill Ratings */}
          <div className="bg-[#FAF9F6] border border-[#E8E2D8] rounded-3xl p-5 space-y-3 shadow-xs">
            <h4 className="text-xs font-bold text-[#6E757C] uppercase tracking-wider">
              Biomechanics & Sub-Skill Breakdown
            </h4>

            <div className="space-y-3">
              {targetMasteryDiscipline.subcomponents.map((sub) => (
                <div key={sub.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#3E4348]">{sub.name}</span>
                    <span className="font-mono text-[#3E4348] font-bold">{sub.score} / 10</span>
                  </div>
                  <div className="w-full bg-[#E8E2D8] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#A4C2F4] to-[#B5C99A] h-full rounded-full"
                      style={{ width: `${(sub.score / 10) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coach Latest Notes Log */}
          <div className="bg-[#F7F3EE] border border-[#E8E2D8] rounded-3xl p-5 space-y-2">
            <h4 className="text-xs font-bold text-[#E8A5A5] uppercase tracking-wider">
              Coach Prescription
            </h4>
            <p className="text-xs text-[#3E4348] leading-relaxed">
              &quot;We are locking in your strengths while targeting <strong className="text-[#E8A5A5]">{targetMasteryDiscipline.microFocus}</strong>. Every practice session is calibrated to build muscle memory through deliberate, sub-second feedback.&quot;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
