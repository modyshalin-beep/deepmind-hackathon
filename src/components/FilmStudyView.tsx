'use client';

import React, { useState } from 'react';
import { VideoClip, Discipline } from '@/types';
import { shareVideoOrCard } from '@/lib/webShare';
import { Share2, Lock, Unlock, Play, Sparkles, HardDrive, Trash2 } from 'lucide-react';

interface FilmStudyViewProps {
  clips: VideoClip[];
  disciplines: Discipline[];
  onToggleMilestone: (clipId: string) => void;
  onPruneClips: () => void;
}

export function FilmStudyView({ clips, disciplines, onToggleMilestone, onPruneClips }: FilmStudyViewProps) {
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '');
  const [shareStatusText, setShareStatusText] = useState<string | null>(null);

  const selectedClip = clips.find(c => c.id === selectedClipId) || clips[0];

  const totalStorageUsedMB = clips.reduce((acc, c) => acc + c.sizeMB, 0);
  const storageStats = {
    usedMB: Math.round(totalStorageUsedMB * 10) / 10,
    totalMB: 500,
    milestoneClipsCount: clips.filter(c => c.isMilestone).length,
  };

  const handleShare = async (clip: VideoClip) => {
    setShareStatusText('Opening OS Share Sheet...');
    const result = await shareVideoOrCard({
      title: clip.title,
      text: `🔥 New rep analyzed with Pocket Coach AI: "${clip.coachVoiceoverText}"`,
      url: window.location.href,
    });

    if (result.success) {
      setShareStatusText(result.method === 'native' ? 'Shared successfully!' : 'Copied link to clipboard!');
    } else {
      setShareStatusText(result.error || 'Share failed');
    }

    setTimeout(() => setShareStatusText(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header & On-Device Storage Manager Bar */}
      <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#C2410C] uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Film Study & Video Vault
          </span>
          <h2 className="text-2xl font-black text-[#182030] mt-1">Rep Review & OS Share</h2>
          <p className="text-xs text-[#5A6578]">Sub-second 30 FPS burst film analysis with coach voiceover bookmarks</p>
        </div>

        {/* Storage Meter & Auto-Prune Control */}
        <div className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] flex items-center gap-4 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-[#C2410C]" />
            <div className="text-xs">
              <div className="font-bold text-[#182030]">{storageStats.usedMB} MB / {storageStats.totalMB} MB</div>
              <div className="text-[10px] text-[#5A6578]">{storageStats.milestoneClipsCount} Milestone Clips Locked in Vault</div>
            </div>
          </div>

          <button
            onClick={onPruneClips}
            className="bg-white hover:bg-[#E6E0D4] text-[#182030] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E6E0D4] flex items-center gap-1.5 transition cursor-pointer"
            title="Auto-prunes temporary non-milestone clips to free phone storage"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Prune Temp Clips
          </button>
        </div>
      </div>

      {shareStatusText && (
        <div className="bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs px-4 py-3 rounded-xl font-semibold shadow-xs text-center animate-fade-in">
          ✅ {shareStatusText}
        </div>
      )}

      {/* Main Interactive Video Player & Keyframe Breakdown */}
      {selectedClip && (
        <div className="bg-white rounded-2xl border border-[#E6E0D4] p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-[#E6E0D4] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  selectedClip.repType === 'model'
                    ? 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                    : 'bg-[#FFEDD5] text-[#C2410C] border border-[#FED7AA]'
                }`}>
                  {selectedClip.repType === 'model' ? '🟢 Model Gold Standard' : '🟡 Adjustment Required'}
                </span>
                <span className="text-xs font-mono text-[#1D4ED8]">{selectedClip.fpsCaptured} FPS Agentic Capture</span>
              </div>
              <h3 className="text-lg font-bold text-[#182030] mt-1">{selectedClip.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleMilestone(selectedClip.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition cursor-pointer ${
                  selectedClip.isMilestone
                    ? 'bg-[#C2410C] text-white border-[#C2410C]'
                    : 'bg-[#F4EFE6] text-[#182030] border border-[#E6E0D4] hover:border-[#D97706]'
                }`}
              >
                {selectedClip.isMilestone ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {selectedClip.isMilestone ? 'Locked in Vault' : 'Lock Milestone'}
              </button>

              <button
                onClick={() => handleShare(selectedClip)}
                className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-bold px-3 py-1.5 rounded-xl border border-[#1D4ED8] flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share to Instagram/OS
              </button>
            </div>
          </div>

          {/* HTML5 Video Player */}
          <div className="relative w-full aspect-[16/9] bg-[#182030] rounded-xl overflow-hidden border border-[#E6E0D4] group">
            <video
              src={selectedClip.videoUrl}
              poster={selectedClip.thumbnailUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Coach Voiceover Annotation Banner */}
          <div className="bg-[#F4EFE6] p-3.5 rounded-xl border border-[#E6E0D4] flex items-start gap-3">
            <span className="text-lg">🎙️</span>
            <div className="text-xs">
              <span className="font-bold text-[#C2410C] uppercase tracking-wider block mb-0.5">Coach Audio Feedback Annotation</span>
              <p className="text-[#182030] italic">&quot;{selectedClip.coachVoiceoverText}&quot;</p>
            </div>
          </div>

          {/* Keyframe Timeline Markers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">
              ⏱️ Frame-by-Frame Sub-second Annotations (30 FPS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedClip.keyframeNotes.map((note, idx) => (
                <div key={idx} className="bg-[#F4EFE6] p-3 rounded-xl border border-[#E6E0D4] flex items-start gap-2 text-xs">
                  <span className="font-mono bg-white text-[#C2410C] px-2 py-0.5 rounded border border-[#E6E0D4] font-bold shrink-0">
                    +{note.timeOffsetSeconds}s
                  </span>
                  <div>
                    <span className="font-bold text-[#182030] block">{note.label}</span>
                    <p className="text-[#5A6578] text-[11px] mt-0.5">{note.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clip Library Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#5A6578] uppercase tracking-wider">
          📼 Captured Video Clip Library ({clips.length} Saved)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clips.map((clip) => {
            const isSelected = clip.id === selectedClipId;
            return (
              <div
                key={clip.id}
                onClick={() => setSelectedClipId(clip.id)}
                className={`rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-[#C2410C] shadow-md shadow-[#C2410C]/15 bg-[#FFFDF9]'
                    : 'bg-white border-[#E6E0D4] hover:border-[#D97706]'
                }`}
              >
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-[#182030]">
                  <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/90 fill-current" />
                  </div>
                  {clip.isMilestone && (
                    <span className="absolute top-2 left-2 bg-[#C2410C] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                      🔒 VAULT
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {clip.durationSeconds}s
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#182030] line-clamp-1">{clip.title}</h4>
                  <p className="text-[10px] text-[#5A6578] mt-0.5">{new Date(clip.createdAt).toLocaleDateString()} • {clip.sizeMB} MB</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
