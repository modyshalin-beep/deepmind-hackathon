'use client';

import React, { useState } from 'react';
import { VideoClip, Discipline } from '@/types';
import { shareVideoOrCard } from '@/lib/webShare';
import { calculateStorageUsage, pruneNonMilestoneClips } from '@/lib/storage';
import { Play, Pause, Share2, Lock, Unlock, HardDrive, Trash2, Tag, CheckCircle2, AlertTriangle, Info, Sparkles, Download } from 'lucide-react';

interface FilmStudyViewProps {
  clips: VideoClip[];
  disciplines: Discipline[];
  onToggleMilestone: (clipId: string) => void;
  onPruneClips: () => void;
}

export function FilmStudyView({ clips, disciplines, onToggleMilestone, onPruneClips }: FilmStudyViewProps) {
  const [selectedClipId, setSelectedClipId] = useState<string>(clips[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [shareStatusText, setShareStatusText] = useState<string | null>(null);

  const selectedClip = clips.find(c => c.id === selectedClipId) || clips[0];
  const storageStats = calculateStorageUsage(clips);

  const handleShare = async (clip: VideoClip) => {
    const disciplineName = disciplines.find(d => d.id === clip.disciplineId)?.name || 'Sports & Skills';
    const result = await shareVideoOrCard({
      title: `${clip.title} - Pocket Coach AI`,
      text: `Check out my 30 FPS Agentic Video breakdown in ${disciplineName}! Coach commentary: "${clip.coachVoiceoverText}"`,
      url: clip.videoUrl,
    });

    if (result.success) {
      if (result.method === 'native') {
        setShareStatusText('Exported via Native OS Share sheet!');
      } else if (result.method === 'copied') {
        setShareStatusText('Clip link & breakdown copied to clipboard!');
      } else {
        setShareStatusText('Downloading video clip...');
      }
    } else {
      setShareStatusText(result.error || 'Share failed');
    }

    setTimeout(() => setShareStatusText(null), 3000);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header & On-Device Storage Manager Bar */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Film Study & Video Vault
          </span>
          <h2 className="text-2xl font-black text-white mt-1">Rep Review & OS Share</h2>
        </div>

        {/* Storage Meter & Auto-Prune Control */}
        <div className="bg-slate-850 p-3 rounded-xl border border-slate-800 flex items-center gap-4 w-full md:w-auto justify-between">
          <div className="flex items-center gap-2">
            <HardDrive className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <div className="font-bold text-white">{storageStats.usedMB} MB / {storageStats.totalMB} MB</div>
              <div className="text-[10px] text-slate-400">{storageStats.milestoneClipsCount} Milestone Clips Locked in Vault</div>
            </div>
          </div>

          <button
            onClick={onPruneClips}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-1.5 transition"
            title="Auto-prunes temporary non-milestone clips to free phone storage"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Prune Temp Clips
          </button>
        </div>
      </div>

      {shareStatusText && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs px-4 py-3 rounded-xl font-semibold shadow-lg text-center animate-fade-in">
          ✅ {shareStatusText}
        </div>
      )}

      {/* Main Interactive Video Player & Keyframe Breakdown */}
      {selectedClip && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  selectedClip.repType === 'model'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {selectedClip.repType === 'model' ? '🟢 Model Gold Standard' : '🟡 Adjustment Required'}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedClip.fpsCaptured} FPS Agentic Capture</span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">{selectedClip.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleMilestone(selectedClip.id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition ${
                  selectedClip.isMilestone
                    ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-slate-600'
                }`}
              >
                {selectedClip.isMilestone ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                {selectedClip.isMilestone ? 'Locked in Vault' : 'Lock Milestone'}
              </button>

              <button
                onClick={() => handleShare(selectedClip)}
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-400 flex items-center gap-1.5 shadow-md shadow-emerald-950/40"
              >
                <Share2 className="w-3.5 h-3.5" /> Share to Instagram/OS
              </button>
            </div>
          </div>

          {/* HTML5 Video Player */}
          <div className="relative w-full aspect-[16/9] bg-black rounded-xl overflow-hidden border border-slate-800 group">
            <video
              src={selectedClip.videoUrl}
              poster={selectedClip.thumbnailUrl}
              controls
              playsInline
              className="w-full h-full object-cover"
            />
          </div>

          {/* Coach Voiceover Annotation Banner */}
          <div className="bg-slate-850 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <span className="text-lg">🎙️</span>
            <div className="text-xs">
              <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-0.5">Coach Audio Feedback Annotation</span>
              <p className="text-slate-200 italic">&quot;{selectedClip.coachVoiceoverText}&quot;</p>
            </div>
          </div>

          {/* Keyframe Timeline Markers */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              ⏱️ Frame-by-Frame Sub-second Annotations (30 FPS)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {selectedClip.keyframeNotes.map((note, idx) => (
                <div key={idx} className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 flex items-start gap-2 text-xs">
                  <span className="font-mono bg-slate-950 text-emerald-400 px-2 py-0.5 rounded border border-slate-800 font-bold shrink-0">
                    +{note.timeOffsetSeconds}s
                  </span>
                  <div>
                    <span className="font-bold text-white block">{note.label}</span>
                    <p className="text-slate-300 text-[11px] mt-0.5">{note.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Clip Library Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          📼 Captured Video Clip Library ({clips.length} Saved)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {clips.map((clip) => {
            const isSelected = clip.id === selectedClipId;
            return (
              <div
                key={clip.id}
                onClick={() => setSelectedClipId(clip.id)}
                className={`bg-slate-900 rounded-xl border p-3 cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'border-emerald-500 shadow-lg shadow-emerald-950/50 bg-slate-850'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-black">
                  <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white/90 fill-current" />
                  </div>
                  {clip.isMilestone && (
                    <span className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow">
                      🔒 VAULT
                    </span>
                  )}
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                    {clip.durationSeconds}s
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{clip.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{new Date(clip.createdAt).toLocaleDateString()} • {clip.sizeMB} MB</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
