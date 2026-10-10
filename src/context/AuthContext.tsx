'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  loadCurrentUser,
  saveCurrentUser,
  loadRegisteredUsers,
  saveRegisteredUsers,
  loadCoachProfile,
  saveCoachProfile,
  DEMO_USER,
} from '@/lib/storage';
import { SkillLevel, UserAccount } from '@/types';

interface AuthContextType {
  user: UserAccount | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmail: (
    email: string,
    pass: string,
    name: string,
    disciplineId?: string,
    skillLevel?: SkillLevel
  ) => Promise<{ success: boolean; error?: string }>;
  signOutUser: () => void;
  signInAsDemoAthlete: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  // Load current athlete session on mount
  useEffect(() => {
    const current = loadCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const signInWithEmail = async (email: string, _pass: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    const registeredUsers = loadRegisteredUsers();
    let matched = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!matched) {
      // Create new athlete profile for this email
      matched = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
        email: email.trim(),
        skillLevel: 'beginner',
        createdAt: new Date().toISOString(),
      };
      saveRegisteredUsers([matched, ...registeredUsers]);
    }

    setUser(matched);
    saveCurrentUser(matched);

    // Sync student name into coach profile
    const profile = loadCoachProfile();
    saveCoachProfile({
      ...profile,
      studentName: matched.name,
      skillLevel: matched.skillLevel || profile.skillLevel,
    });

    return { success: true };
  };

  const signUpWithEmail = async (
    email: string,
    _pass: string,
    name: string,
    disciplineId?: string,
    skillLevel?: SkillLevel
  ) => {
    const trimmedEmail = email.trim().toLowerCase();
    const registeredUsers = loadRegisteredUsers();

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      skillLevel: skillLevel || 'beginner',
      primaryDisciplineId: disciplineId || 'yoga',
      createdAt: new Date().toISOString(),
    };

    const updatedList = [
      newUser,
      ...registeredUsers.filter((u) => u.email.toLowerCase() !== trimmedEmail),
    ];
    saveRegisteredUsers(updatedList);
    setUser(newUser);
    saveCurrentUser(newUser);

    // Sync into coach profile
    const profile = loadCoachProfile();
    saveCoachProfile({
      ...profile,
      studentName: newUser.name,
      skillLevel: skillLevel || profile.skillLevel,
      activeDisciplineId: disciplineId || profile.activeDisciplineId,
      hasCompletedOnboarding: true,
    });

    return { success: true };
  };

  const signOutUser = () => {
    setUser(null);
    saveCurrentUser(null);
  };

  const signInAsDemoAthlete = () => {
    setUser(DEMO_USER);
    saveCurrentUser(DEMO_USER);
    const profile = loadCoachProfile();
    saveCoachProfile({
      ...profile,
      studentName: DEMO_USER.name,
      skillLevel: DEMO_USER.skillLevel || 'beginner',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signOutUser,
        signInAsDemoAthlete,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
