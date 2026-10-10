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
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#F7F3EE]/95 backdrop-blur-2xl border-t border-[#E8E2D8] px-4 py-2.5 shadow-sm">
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
                  ? 'text-[#3E4348] font-black scale-105'
                  : 'text-[#6E757C] hover:text-[#3E4348] font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-2xl transition-all ${isActive ? 'bg-[#E8A5A5]/30 border border-[#E8A5A5]/60 text-[#3E4348] shadow-xs' : ''}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] tracking-tight">{tab.label}</span>

              {tab.badge && tab.badge > 0 ? (
                <span className="absolute top-1 right-1/4 bg-[#E8A5A5] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
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
