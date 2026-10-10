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
      <div className="bg-[#FAF9F6] rounded-3xl border border-[#E8E2D8] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#E8A5A5] uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" /> The Club & Friendly Matchmaking
          </span>
          <h2 className="text-2xl font-black text-[#3E4348] mt-1">Skill-Matched Practice Partners</h2>
          <p className="text-xs text-[#6E757C]">Find friendly peers in your area for low-pressure practice and feedback</p>
        </div>

        <div className="bg-[#B5C99A]/30 border border-[#B5C99A]/50 text-[#42592B] px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#42592B] shrink-0" />
          <div>
            <div className="font-bold text-[#3E4348]">Your Verified {activeDiscipline.name} Level</div>
            <div className="text-[10px] text-[#42592B] font-bold">{activeDiscipline.overallScore} / 10 Score Verified by Coach</div>
          </div>
        </div>
      </div>

      {/* Local Match Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-[#6E757C] uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-[#E8A5A5]" /> Nearby Practice Partners (Within 5 Miles)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {localMatches.map((partner) => {
            const isRequested = requestedMatchIds.includes(partner.id);
            return (
              <div key={partner.id} className="bg-[#FAF9F6] rounded-3xl border border-[#E8E2D8] p-4 shadow-xs flex flex-col justify-between gap-4">
                <div className="flex items-start gap-3">
                  <img src={partner.avatar} alt={partner.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#E8A5A5]" />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#3E4348] flex items-center gap-1">
                        {partner.name}
                        {partner.verifiedByCoach && <ShieldCheck className="w-3.5 h-3.5 text-[#A4C2F4]" />}
                      </h4>
                      <span className="text-xs font-black text-[#42592B] bg-[#B5C99A]/30 px-2.5 py-0.5 rounded-full border border-[#B5C99A]/50">
                        {partner.skillScore} Skill Score
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-[#6E757C] mt-0.5">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-[#6E757C]" /> {partner.locationName} ({partner.distanceMiles} mi)</span>
                      <span>•</span>
                      <span className="text-[#30538A] font-bold">{partner.matchPercentage}% Compatibility</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F7F3EE] p-3 rounded-2xl border border-[#E8E2D8] text-xs">
                  <span className="text-[10px] font-bold text-[#6E757C] uppercase block mb-0.5">Recent Breakthrough</span>
                  <p className="text-[#3E4348] italic">&quot;{partner.recentBreakthrough}&quot;</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold text-[#6E757C] bg-[#F7F3EE] px-2.5 py-1 rounded-full border border-[#E8E2D8]">
                    {partner.badge}
                  </span>

                  <button
                    onClick={() => toggleRequestMatch(partner.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-2xl transition flex items-center gap-1.5 cursor-pointer ${
                      isRequested
                        ? 'bg-[#B5C99A]/30 text-[#42592B] border border-[#B5C99A]/50'
                        : 'bg-[#A4C2F4] hover:bg-[#8bb2f2] text-[#3E4348] font-black shadow-xs'
                    }`}
                  >
                    {isRequested ? <CheckCircle2 className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                    {isRequested ? 'Request Sent' : 'Connect & Practice'}
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
