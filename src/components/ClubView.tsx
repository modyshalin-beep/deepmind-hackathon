'use client';

import React, { useState } from 'react';
import { LocalMatchPartner, Discipline } from '@/types';
import { Users, ShieldCheck, MapPin, Sparkles, Award, MessageSquare, UserPlus, CheckCircle2 } from 'lucide-react';

interface ClubViewProps {
  localMatches: LocalMatchPartner[];
  activeDiscipline: Discipline;
}

export function ClubView({ localMatches, activeDiscipline }: ClubViewProps) {
  const [requestedMatchIds, setRequestedMatchIds] = useState<string[]>([]);

  const toggleRequestMatch = (id: string) => {
    setRequestedMatchIds(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> The Club & Verified Local Matchmaking
          </span>
          <h2 className="text-2xl font-black text-white mt-1">AI Skill-Verified Partners</h2>
          <p className="text-xs text-slate-400">Match with peers whose skill score is verified by Gemini AI live coaching</p>
        </div>

        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 px-3 py-2 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <div className="font-bold">Your Verified {activeDiscipline.name} Level</div>
            <div className="text-[10px] text-emerald-400">{activeDiscipline.overallScore} / 10 Score Verified by Coach</div>
          </div>
        </div>
      </div>

      {/* Local Match Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-emerald-400" /> Nearby Skill-Matched Partners (Within 5 Miles)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localMatches.map((partner) => {
            const isRequested = requestedMatchIds.includes(partner.id);
            return (
              <div key={partner.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white flex items-center gap-1">
                        {partner.name}
                        {partner.verifiedByCoach && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-950" />}
                      </h4>
                      <span className="text-xs font-black text-emerald-400 bg-emerald-950 px-2.5 py-0.5 rounded-full border border-emerald-800">
                        {partner.skillScore} Skill Score
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-500" /> {partner.locationName} ({partner.distanceMiles} mi)</span>
                      <span>•</span>
                      <span className="text-emerald-300 font-medium">{partner.matchPercentage}% Compatibility Match</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-850 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">AI Coach Verified Proof</span>
                  <p className="text-slate-200 italic">&quot;{partner.recentBreakthrough}&quot;</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    {partner.badge}
                  </span>

                  <button
                    onClick={() => toggleRequestMatch(partner.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 ${
                      isRequested
                        ? 'bg-slate-800 text-emerald-400 border border-emerald-700'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-950/40'
                    }`}
                  >
                    {isRequested ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {isRequested ? 'Match Request Sent' : 'Request Match & Practice'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
