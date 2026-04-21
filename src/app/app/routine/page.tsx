"use client";

// ルーティン設定ページ (/app/routine)
// 月〜日の7列タイムライン
// タップで追加モーダル、長押しで削除

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoutineStore, type TimeSlot, type ModeType, type RoutineEntry } from "@/store/routineStore";

// ─── 定数 ────────────────────────────────────────────
const DAYS = [
  { label: "月", value: 1 },
  { label: "火", value: 2 },
  { label: "水", value: 3 },
  { label: "木", value: 4 },
  { label: "金", value: 5 },
  { label: "土", value: 6 },
  { label: "日", value: 0 },
];

const SLOTS: TimeSlot[] = ["朝", "昼", "夜"];

const MODES: { value: ModeType; label: string; labelEn: string; color: string }[] = [
  { value: "focus",   label: "集中",     labelEn: "Focus",   color: "#a3a957" },
  { value: "relax",   label: "リラックス", labelEn: "Relax",   color: "#38BDF8" },
  { value: "spark",   label: "アイデア",  labelEn: "Spark",   color: "#A78BFA" },
  { value: "reclaim", label: "感性",     labelEn: "Reclaim", color: "#34D399" },
];

const MODE_MAP = Object.fromEntries(MODES.map((m) => [m.value, m]));

// 今日の曜日（0=日〜6=土）
const todayDay = new Date().getDay();

// ─── 追加モーダル ────────────────────────────────────
type AddModalProps = {
  day: number;
  onAdd: (slot: TimeSlot, mode: ModeType) => void;
  onClose: () => void;
};

function AddModal({ day, onAdd, onClose }: AddModalProps) {
  const [slot, setSlot] = useState<TimeSlot>("朝");
  const [mode, setMode] = useState<ModeType>("focus");
  const dayLabel = DAYS.find((d) => d.value === day)?.label ?? "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-end justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60" />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 32 }}
        className="relative w-full max-w-sm bg-[#111214] border-t border-white/10 px-6 pt-6 pb-28 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em]">
          {dayLabel}曜日にルーティンを追加
        </p>

        {/* 時間帯 */}
        <div className="flex flex-col gap-2">
          <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.25em]">時間帯</p>
          <div className="flex gap-2">
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`flex-1 py-2.5 text-sm font-light tracking-wider border transition-all duration-200 ${
                  slot === s
                    ? "border-[#a3a957]/60 text-[#a3a957] bg-[#a3a957]/8"
                    : "border-white/10 text-[#e8e6e1]/40 hover:border-white/20"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* モード */}
        <div className="flex flex-col gap-2">
          <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.25em]">モード</p>
          <div className="grid grid-cols-2 gap-2">
            {MODES.map((m) => (
              <button
                key={m.value}
                onClick={() => setMode(m.value)}
                className={`py-3 text-sm font-light tracking-wide border transition-all duration-200 flex flex-col items-center gap-0.5 ${
                  mode === m.value
                    ? "border-opacity-60 bg-opacity-8"
                    : "border-white/10 text-[#e8e6e1]/40 hover:border-white/20"
                }`}
                style={
                  mode === m.value
                    ? { borderColor: m.color, color: m.color, backgroundColor: `${m.color}14` }
                    : {}
                }
              >
                <span className="text-xs tracking-widest">{m.labelEn}</span>
                <span className="text-[10px] opacity-70">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 追加ボタン */}
        <button
          onClick={() => { onAdd(slot, mode); onClose(); }}
          className="w-full py-3.5 border border-[#a3a957]/40 text-[#a3a957]/80 text-sm font-light tracking-wider hover:bg-[#a3a957]/8 transition-all duration-200"
        >
          追加する
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── エントリーチップ ─────────────────────────────────
function EntryChip({ entry, onLongPress }: { entry: RoutineEntry; onLongPress: () => void }) {
  const m = MODE_MAP[entry.mode];
  let pressTimer: ReturnType<typeof setTimeout> | null = null;

  const handlePressStart = () => {
    pressTimer = setTimeout(onLongPress, 600);
  };
  const handlePressEnd = () => {
    if (pressTimer) clearTimeout(pressTimer);
  };

  return (
    <div
      className="flex flex-col items-center gap-0.5 px-1 py-1.5 border rounded-sm select-none cursor-pointer"
      style={{ borderColor: `${m.color}30`, backgroundColor: `${m.color}10` }}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <span className="text-[8px] font-light tracking-wider" style={{ color: m.color }}>
        {entry.slot}
      </span>
      <span className="text-[8px] font-light" style={{ color: `${m.color}99` }}>
        {m.labelEn}
      </span>
    </div>
  );
}

// ─── メインページ ─────────────────────────────────────
export default function RoutinePage() {
  const { entries, addEntry, removeEntry } = useRoutineStore();
  const [addingDay, setAddingDay] = useState<number | null>(null);

  const handleAdd = useCallback(
    (slot: TimeSlot, mode: ModeType) => {
      if (addingDay !== null) addEntry(addingDay, slot, mode);
    },
    [addingDay, addEntry]
  );

  return (
    <div className="min-h-screen px-4 pt-10 pb-24">
      {/* ヘッダー */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 flex flex-col gap-1"
      >
        <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.4em]">ROUTINE</p>
        <h1 className="text-[#e8e6e1] text-lg font-light tracking-wide">週間ルーティン</h1>
        <p className="text-[#e8e6e1]/35 text-xs font-light leading-relaxed">
          各曜日をタップしてモードを追加。長押しで削除。
        </p>
      </motion.div>

      {/* 7列タイムライン */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-7 gap-1.5"
      >
        {DAYS.map((day) => {
          const dayEntries = entries
            .filter((e) => e.day === day.value)
            .sort((a, b) => SLOTS.indexOf(a.slot) - SLOTS.indexOf(b.slot));
          const isToday = day.value === todayDay;

          return (
            <div key={day.value} className="flex flex-col gap-1.5">
              {/* 曜日ヘッダー */}
              <button
                onClick={() => setAddingDay(day.value)}
                className={`flex flex-col items-center gap-1 py-2 border transition-all duration-200 hover:border-white/20 ${
                  isToday ? "border-[#a3a957]/30 bg-[#a3a957]/5" : "border-white/8"
                }`}
              >
                <span
                  className={`text-[11px] font-light ${
                    isToday ? "text-[#a3a957]" : "text-[#e8e6e1]/50"
                  }`}
                >
                  {day.label}
                </span>
                <span className="text-[#e8e6e1]/20 text-[10px]">+</span>
              </button>

              {/* エントリー一覧 */}
              <div className="flex flex-col gap-1">
                {dayEntries.map((entry) => (
                  <EntryChip
                    key={entry.id}
                    entry={entry}
                    onLongPress={() => removeEntry(entry.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* 凡例 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex flex-wrap gap-x-5 gap-y-2"
      >
        {MODES.map((m) => (
          <div key={m.value} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: m.color }} />
            <span className="text-[#e8e6e1]/35 text-[10px] font-light">{m.labelEn}</span>
          </div>
        ))}
      </motion.div>

      {/* ヒント */}
      <p className="mt-4 text-[#e8e6e1]/20 text-[10px] font-light leading-relaxed">
        曜日をタップで追加 / エントリーを長押しで削除
      </p>

      {/* 追加モーダル */}
      <AnimatePresence>
        {addingDay !== null && (
          <AddModal
            day={addingDay}
            onAdd={handleAdd}
            onClose={() => setAddingDay(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
