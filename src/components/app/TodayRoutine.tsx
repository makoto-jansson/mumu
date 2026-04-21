"use client";

// 今日のルーティン（ホーム画面上部）
// 今日の曜日に設定されたルーティンを表示

import Link from "next/link";
import { useRoutineStore } from "@/store/routineStore";

const MODE_COLORS: Record<string, string> = {
  focus:   "#a3a957",
  relax:   "#38BDF8",
  spark:   "#A78BFA",
  reclaim: "#34D399",
};

const MODE_LABEL: Record<string, string> = {
  focus:   "Focus",
  relax:   "Relax",
  spark:   "Spark",
  reclaim: "Reclaim",
};

const MODE_HREF: Record<string, string> = {
  focus:   "/app/focus",
  relax:   "/app/relax",
  spark:   "/app/spark",
  reclaim: "/app/reclaim",
};

export default function TodayRoutine() {
  const { entries } = useRoutineStore();
  const todayDay = new Date().getDay(); // 0=日〜6=土

  const todayEntries = entries
    .filter((e) => e.day === todayDay)
    .sort((a, b) => {
      const order = ["朝", "昼", "夜"];
      return order.indexOf(a.slot) - order.indexOf(b.slot);
    });

  // 今日のルーティンがなければ何も表示しない
  if (todayEntries.length === 0) return null;

  return (
    <div className="mb-2 pt-2">
      <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.35em] mb-2.5">
        今日のルーティン
      </p>
      <div className="flex flex-wrap gap-2">
        {todayEntries.map((entry) => {
          const color = MODE_COLORS[entry.mode];
          return (
            <Link
              key={entry.id}
              href={MODE_HREF[entry.mode]}
              className="flex items-center gap-2 px-3 py-1.5 border transition-all duration-200 hover:opacity-80"
              style={{ borderColor: `${color}30`, backgroundColor: `${color}0a` }}
            >
              <span className="text-[10px] font-light" style={{ color: `${color}80` }}>
                {entry.slot}
              </span>
              <span className="text-[11px] font-light" style={{ color }}>
                {MODE_LABEL[entry.mode]}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
