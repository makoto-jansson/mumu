"use client";

// ルーティン設定ストア
// 曜日 × 時間帯 × モードの組み合わせを管理
// Zustand persist で localStorage に保存

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TimeSlot = "朝" | "昼" | "夜";
export type ModeType = "focus" | "relax" | "spark" | "reclaim";

export type RoutineEntry = {
  id: string;
  day: number;   // 0=日, 1=月, 2=火, 3=水, 4=木, 5=金, 6=土
  slot: TimeSlot;
  mode: ModeType;
};

type RoutineState = {
  entries: RoutineEntry[];
  addEntry: (day: number, slot: TimeSlot, mode: ModeType) => void;
  removeEntry: (id: string) => void;
};

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set) => ({
      entries: [],

      addEntry: (day, slot, mode) => {
        set((state) => ({
          entries: [
            ...state.entries,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              day,
              slot,
              mode,
            },
          ],
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },
    }),
    { name: "mumu-routine" }
  )
);
