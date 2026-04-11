"use client";

// 過去セッション履歴 + 珈琲レコメンド表示制御
// Zustand persist で localStorage に保存
// 90 日以上古いセッションは addSession 時に自動削除

import { create } from "zustand";
import { persist } from "zustand/middleware";

const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
const SEVEN_DAYS  =  7 * 24 * 60 * 60 * 1000;

export type SessionEntry = {
  id:        string;
  type:      "focus" | "relax" | "walk";
  date:      string;   // ISO 8601
  duration:  number;   // 分
  task?:     string;   // Focus のみ
  mood?:     string;   // Relax のみ
  sets?:     number;   // Focus のみ
  theme?:    string;   // Walk のみ
  scenes?:   string[]; // Walk のみ（シーンID配列）
  memoCount?: number;  // Walk のみ
};

type HistoryState = {
  sessions:              SessionEntry[];
  lastCoffeeRecommendAt: number | null;

  addSession:               (entry: Omit<SessionEntry, "id" | "date">) => void;
  markCoffeeRecommendShown: () => void;
  shouldShowCoffeeRecommend: () => boolean;
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      sessions:              [],
      lastCoffeeRecommendAt: null,

      addSession: (entry) => {
        const now    = Date.now();
        const cutoff = now - NINETY_DAYS;
        set((state) => ({
          sessions: [
            // 90 日超えを除去してから追加
            ...state.sessions.filter((s) => new Date(s.date).getTime() > cutoff),
            {
              ...entry,
              id:   `${now}-${Math.random().toString(36).slice(2, 7)}`,
              date: new Date(now).toISOString(),
            },
          ],
        }));
      },

      markCoffeeRecommendShown: () =>
        set({ lastCoffeeRecommendAt: Date.now() }),

      shouldShowCoffeeRecommend: () => {
        const { lastCoffeeRecommendAt } = get();
        if (lastCoffeeRecommendAt === null) return true;
        return Date.now() - lastCoffeeRecommendAt > SEVEN_DAYS;
      },
    }),
    { name: "mumu-history" }
  )
);
