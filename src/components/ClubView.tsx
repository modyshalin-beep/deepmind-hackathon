'use client';

import React, { useState } from 'react';
import { LocalMatchPartner, Discipline } from '@/types';
import { Users, ShieldCheck, MapPin, UserPlus, CheckCircle2 } from 'lucide-react';

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
      <div className="bg-white rounded-2xl border border-[#D0E6FF] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#FF7F2D] uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> The Club & Verified Local Matchmaking
          </span>
          <h2 className="text-2xl font-black text-[#2D2E2E] mt-1">AI Skill-Verified Partners</h2>
          <p className="text-xs text-[#4A4B4B]">Match with peers whose skill score is verified by Gemini AI live coaching</p>
        </div>

        <div className="bg-[#F5FAF5] border border-[#7CB078]/40 text-[#7CB078] px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#7CB078] shrink-0" />
          <div>
            <div className="font-bold text-[#2D2E2E]">Your Verified {activeDiscipline.name} Level</div>
            <div className="text-[10px] text-[#7CB078] font-bold">{activeDiscipline.overallScore} / 10 Score Verified by Coach</div>
          </div>
        </div>
      </div>

      {/* Local Match Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#4A4B4B] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#FF7F2D]" /> Nearby Skill-Matched Partners (Within 5 Miles)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localMatches.map((partner) => {
            const isRequested = requestedMatchIds.includes(partner.id);
            return (
              <div key={partner.id} className="bg-white rounded-2xl border border-[#D0E6FF] p-4 shadow-xs flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#FF7F2D]" />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#2D2E2E] flex items-center gap-1">
                        {partner.name}
                        {partner.verifiedByCoach && <ShieldCheck className="w-3.5 h-3.5 text-[#4CB1FF]" />}
                      </h4>
                      <span className="text-xs font-black text-[#7CB078] bg-[#F5FAF5] px-2.5 py-0.5 rounded-full border border-[#7CB078]/40">
                        {partner.skillScore} Skill Score
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#4A4B4B] mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#4A4B4B]" /> {partner.locationName} ({partner.distanceMiles} mi)</span>
                      <span>•</span>
                      <span className="text-[#4CB1FF] font-medium">{partner.matchPercentage}% Match</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F5F6FC] p-2.5 rounded-xl border border-[#D0E6FF] text-xs">
                  <span className="text-[10px] font-bold text-[#4A4B4B] uppercase block mb-0.5">AI Coach Verified Proof</span>
                  <p className="text-[#2D2E2E] italic">&quot;{partner.recentBreakthrough}&quot;</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-[#4A4B4B] bg-[#F5F6FC] px-2 py-1 rounded border border-[#D0E6FF]">
                    {partner.badge}
                  </span>

                  <button
                    onClick={() => toggleRequestMatch(partner.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer ${
                      isRequested
                        ? 'bg-[#F5FAF5] text-[#7CB078] border border-[#7CB078]/40'
                        : 'bg-[#FF7F2D] hover:bg-[#e66c1e] text-white shadow-xs'
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
