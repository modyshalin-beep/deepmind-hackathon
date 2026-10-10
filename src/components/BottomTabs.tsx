'use client';

import React from 'react';
import { Video, Target, Film, Users, Layers } from 'lucide-react';

interface BottomTabsProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  unreadClipsCount?: number;
}

export function BottomTabs({ activeTab, onChangeTab, unreadClipsCount }: BottomTabsProps) {
  const tabs = [
    { id: 'studio', label: 'AI Studio', icon: Video },
    { id: 'activities', label: 'Activities', icon: Layers },
    { id: 'mastery', label: '10k-Hr Mastery', icon: Target },
    { id: 'film', label: 'Film Study', icon: Film, badge: unreadClipsCount },
    { id: 'club', label: 'The Club', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/90 backdrop-blur-2xl border-t border-slate-800 px-3 py-2">
      <div className="max-w-lg mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl ${isActive ? 'bg-emerald-950/80 border border-emerald-800' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] tracking-tight">{tab.label}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="absolute top-1 right-2 bg-emerald-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
