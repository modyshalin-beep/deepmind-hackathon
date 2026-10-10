'use client';

import React from 'react';
import { BookOpen, Film, Users } from 'lucide-react';

interface BottomTabsProps {
  activeTab: string;
  onChangeTab: (tab: string) => void;
  unreadClipsCount?: number;
}

export function BottomTabs({ activeTab, onChangeTab, unreadClipsCount }: BottomTabsProps) {
  const tabs = [
    { id: 'plans', label: 'Lesson Plans', icon: BookOpen },
    { id: 'review', label: 'Review', icon: Film, badge: unreadClipsCount },
    { id: 'club', label: 'The Club', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-slate-950/95 backdrop-blur-2xl border-t border-slate-800/90 px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all relative cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-emerald-950/90 border border-emerald-800 text-emerald-400 shadow-sm' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="absolute top-1 right-1/4 bg-emerald-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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
