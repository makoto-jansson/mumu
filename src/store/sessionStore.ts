"use client";

// 現在進行中のセッション状態管理
// Focus / Relax どちらが動いているかをグローバルに把握する

import { create } from "zustand";

type SessionMode = "focus" | "relax";

type SessionState = {
  isActive:  boolean;
  mode:      SessionMode | null;
  startedAt: number | null;
  sets:      number;

  startSession:   (mode: SessionMode) => void;
  endSession:     () => void;
  incrementSets:  () => void;
};

export const useSessionStore = create<SessionState>((set) => ({
  isActive:  false,
  mode:      null,
  startedAt: null,
  sets:      0,

  startSession:  (mode) => set({ isActive: true, mode, startedAt: Date.now(), sets: 0 }),
  endSession:    ()     => set({ isActive: false, mode: null, startedAt: null, sets: 0 }),
  incrementSets: ()     => set((s) => ({ sets: s.sets + 1 })),
}));
