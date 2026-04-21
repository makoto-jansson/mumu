"use client";

// ダッシュボード (My cup) ページ (/app/dashboard)
// 今週のサマリー・週間カレンダー・ストリーク・EC導線

import { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHistoryStore, type SessionEntry } from "@/store/historyStore";
import { useRoutineStore } from "@/store/routineStore";

// ─── 定数 ────────────────────────────────────────────
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

// ISO日付文字列（YYYY-MM-DD）
function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

// 今週の月〜日の日付配列を生成
function getWeekDays() {
  const today = new Date();
  const dow = today.getDay(); // 0=日
  // 月曜起算：月=0, 火=1, ... 日=6
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return d;
  });
}

// ストリーク計算（連続使用日数）
function calcStreak(sessions: SessionEntry[]) {
  const usedDays = new Set(sessions.map((s) => toDateStr(new Date(s.date))));
  let streak = 0;
  const d = new Date();
  // 今日もカウント対象
  while (usedDays.has(toDateStr(d))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

// ─── 週間カレンダー ───────────────────────────────────
type WeekCalendarProps = {
  weekDays: Date[];
  sessions: SessionEntry[];
};

function WeekCalendar({ weekDays, sessions }: WeekCalendarProps) {
  const today = toDateStr(new Date());
  const DAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

  // 日付ごとのセッション一覧
  const sessionsByDate = useMemo(() => {
    const map: Record<string, SessionEntry[]> = {};
    for (const s of sessions) {
      const d = toDateStr(new Date(s.date));
      if (!map[d]) map[d] = [];
      map[d].push(s);
    }
    return map;
  }, [sessions]);

  return (
    <div className="flex gap-1.5">
      {weekDays.map((day, i) => {
        const dateStr = toDateStr(day);
        const daySessions = sessionsByDate[dateStr] ?? [];
        const isToday = dateStr === today;
        const isFuture = day > new Date();

        return (
          <div key={dateStr} className="flex-1 flex flex-col items-center gap-1.5">
            {/* 曜日 */}
            <span
              className={`text-[9px] font-light ${
                isToday ? "text-[#a3a957]" : "text-[#e8e6e1]/30"
              }`}
            >
              {DAY_LABELS[i]}
            </span>

            {/* ドット（セッション数 = ドット数、最大4） */}
            <div className="flex flex-col items-center gap-0.5 min-h-[52px] justify-center">
              {isFuture ? (
                <div className="w-3 h-3 rounded-full border border-white/8" />
              ) : daySessions.length === 0 ? (
                <div className="w-3 h-3 rounded-full border border-white/12" />
              ) : (
                daySessions.slice(0, 4).map((s, j) => (
                  <div
                    key={j}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: MODE_COLORS[s.type] ?? "#e8e6e1" }}
                  />
                ))
              )}
            </div>

            {/* 日付 */}
            <span
              className={`text-[9px] font-light ${
                isToday ? "text-[#a3a957]" : "text-[#e8e6e1]/20"
              }`}
            >
              {day.getDate()}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── 今週のルーティン達成状況 ─────────────────────────
type RoutineStatusProps = {
  weekDays: Date[];
  sessions: SessionEntry[];
};

function RoutineStatus({ weekDays, sessions }: RoutineStatusProps) {
  const { entries } = useRoutineStore();
  const today = toDateStr(new Date());

  const sessionsByDate = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    for (const s of sessions) {
      const d = toDateStr(new Date(s.date));
      if (!map[d]) map[d] = new Set();
      map[d].add(s.type);
    }
    return map;
  }, [sessions]);

  const weekRoutines = weekDays.flatMap((day) => {
    const dayOfWeek = day.getDay();
    return entries
      .filter((e) => e.day === dayOfWeek)
      .map((e) => ({
        ...e,
        date: toDateStr(day),
        dayLabel: ["日", "月", "火", "水", "木", "金", "土"][dayOfWeek],
        done: (sessionsByDate[toDateStr(day)] ?? new Set()).has(e.mode),
        isPast: toDateStr(day) <= today,
      }));
  });

  if (weekRoutines.length === 0) return null;

  const done = weekRoutines.filter((r) => r.done && r.isPast).length;
  const total = weekRoutines.filter((r) => r.isPast).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em]">今週の達成</p>
        {total > 0 && (
          <span className="text-[#e8e6e1]/40 text-[11px] font-light">
            {done} / {total}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1.5">
        {weekRoutines.slice(0, 8).map((r) => {
          const color = MODE_COLORS[r.mode];
          return (
            <div key={r.id + r.date} className="flex items-center gap-3">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{
                  backgroundColor: r.done ? color : "transparent",
                  border: `1px solid ${color}${r.done ? "ff" : "50"}`,
                }}
              />
              <span className="text-[#e8e6e1]/35 text-[11px] font-light">
                {r.dayLabel} {r.slot}
              </span>
              <span
                className="text-[10px] font-light"
                style={{ color: `${color}${r.done ? "cc" : "50"}` }}
              >
                {MODE_LABEL[r.mode]}
              </span>
              {r.done && (
                <span className="text-[#e8e6e1]/25 text-[9px] font-light ml-auto">✓</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── メインページ ─────────────────────────────────────
export default function DashboardPage() {
  const { sessions } = useHistoryStore();

  const weekDays = useMemo(() => getWeekDays(), []);
  const todayStr = toDateStr(new Date());
  const weekStart = toDateStr(weekDays[0]);

  // 今週のセッション
  const thisWeekSessions = useMemo(
    () => sessions.filter((s) => toDateStr(new Date(s.date)) >= weekStart),
    [sessions, weekStart]
  );

  // 今日のセッション
  const todaySessions = useMemo(
    () => sessions.filter((s) => toDateStr(new Date(s.date)) === todayStr),
    [sessions, todayStr]
  );

  // 合計セッション数
  const totalSessions = sessions.length;

  // ストリーク
  const streak = useMemo(() => calcStreak(sessions), [sessions]);

  // モード別の今週セッション数
  const modeCount = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of thisWeekSessions) {
      map[s.type] = (map[s.type] ?? 0) + 1;
    }
    return map;
  }, [thisWeekSessions]);

  return (
    <div className="min-h-screen px-5 pt-10 pb-24">

      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col gap-1"
      >
        <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.4em]">MY CUP</p>
        <h1 className="text-[#e8e6e1] text-lg font-light tracking-wide">今週の記録</h1>
      </motion.div>

      {/* サマリーカード */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-8"
      >
        {[
          { label: "今日", value: todaySessions.length, unit: "回" },
          { label: "今週", value: thisWeekSessions.length, unit: "回" },
          { label: "連続", value: streak, unit: "日" },
        ].map(({ label, value, unit }) => (
          <div key={label} className="border border-white/8 px-3 py-4 flex flex-col items-center gap-1">
            <span className="text-[#e8e6e1]/25 text-[10px] font-light tracking-wider">{label}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-[#e8e6e1]/80 text-2xl font-light">{value}</span>
              <span className="text-[#e8e6e1]/30 text-[10px] font-light">{unit}</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* 週間カレンダー */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em] mb-4">
          週間カレンダー
        </p>
        <WeekCalendar weekDays={weekDays} sessions={sessions} />

        {/* カラー凡例 */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-4">
          {Object.entries(MODE_LABEL).map(([mode, label]) => (
            <div key={mode} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MODE_COLORS[mode] }} />
              <span className="text-[#e8e6e1]/30 text-[9px] font-light">{label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 今週のルーティン達成状況 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-8 border-t border-white/6 pt-6"
      >
        <RoutineStatus weekDays={weekDays} sessions={sessions} />
      </motion.div>

      {/* モード別集計 */}
      {thisWeekSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mb-8 border-t border-white/6 pt-6"
        >
          <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em] mb-4">
            今週のモード
          </p>
          <div className="flex flex-col gap-2">
            {Object.entries(modeCount)
              .sort((a, b) => b[1] - a[1])
              .map(([mode, count]) => {
                const maxCount = Math.max(...Object.values(modeCount));
                return (
                  <div key={mode} className="flex items-center gap-3">
                    <span className="text-[#e8e6e1]/40 text-[11px] font-light w-14 shrink-0">
                      {MODE_LABEL[mode]}
                    </span>
                    <div className="flex-1 h-0.5 bg-white/6 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${(count / maxCount) * 100}%`,
                          backgroundColor: MODE_COLORS[mode],
                        }}
                      />
                    </div>
                    <span className="text-[#e8e6e1]/30 text-[11px] font-light w-6 text-right shrink-0">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* ルーティン設定へ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mb-6 border-t border-white/6 pt-6"
      >
        <Link
          href="/app/routine"
          className="flex items-center justify-between px-4 py-3 border border-white/8 hover:border-white/20 transition-colors duration-200 group"
        >
          <span className="text-[#e8e6e1]/50 text-sm font-light tracking-wide">
            ルーティンを設定する
          </span>
          <span className="text-[#e8e6e1]/30 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </Link>
      </motion.div>

      {/* 累計 */}
      {totalSessions > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mb-8"
        >
          <p className="text-[#e8e6e1]/20 text-[10px] font-light text-center">
            これまでのセッション合計 {totalSessions} 回
          </p>
        </motion.div>
      )}

      {/* EC導線（常設） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t border-white/6 pt-6"
      >
        <a
          href="https://mumucoffee.theshop.jp/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 py-3 border border-white/6 hover:border-white/15 transition-colors duration-200 group"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[#e8e6e1]/35 text-sm font-light tracking-wide">
              珈琲豆を探す
            </span>
            <span className="text-[#e8e6e1]/20 text-[10px] font-light">
              灯台の珈琲焙煎所 mumu
            </span>
          </div>
          <span className="text-[#e8e6e1]/20 group-hover:translate-x-0.5 transition-transform duration-200">→</span>
        </a>
      </motion.div>

    </div>
  );
}
