"use client";

// Spark My Grid — 自分のテーマでオズボーン9マスを埋めるステップ

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import StepBar, { SPARK_STEPS } from "@/components/focus/StepBar";
import SparkAmbient from "./SparkAmbient";
import type { KeptTheme, OsborneCategory } from "./SparkShuffle";
import { playClick } from "@/lib/playSound";

const CATEGORIES: OsborneCategory[] = [
  "adapt", "apply", "modify",
  "magnify", "minify", "substitute",
  "rearrange", "reverse", "combine",
];

const CATEGORY_LABEL: Record<OsborneCategory, string> = {
  adapt:      "転用",
  apply:      "応用",
  modify:     "変更",
  magnify:    "拡大",
  minify:     "縮小",
  substitute: "代用",
  rearrange:  "再配置",
  reverse:    "逆転",
  combine:    "結合",
};

const CATEGORY_QUESTION: Record<OsborneCategory, string> = {
  adapt:      "他に使い道は？",
  apply:      "似たものはある？",
  modify:     "変えてみたら？",
  magnify:    "大きくしたら？",
  minify:     "小さくしたら？",
  substitute: "他のもので置き換えたら？",
  rearrange:  "並べ替えたら？",
  reverse:    "逆にしたら？",
  combine:    "組み合わせたら？",
};

export type MyGridResult = {
  theme: string;
  cells: Partial<Record<OsborneCategory, string>>;
};

type Props = {
  kept: KeptTheme[];
  onDone: (result: MyGridResult) => void;
};

export default function SparkMyGrid({ kept, onDone }: Props) {
  const [theme, setTheme] = useState("");
  const [cells, setCells] = useState<Partial<Record<OsborneCategory, string>>>({});
  const [focusedCell, setFocusedCell] = useState<OsborneCategory | null>(null);
  const [showKept, setShowKept] = useState(true);
  const inputRefs = useRef<Partial<Record<OsborneCategory, HTMLInputElement>>>({});

  const handleCellChange = (cat: OsborneCategory, value: string) => {
    setCells((prev) => ({ ...prev, [cat]: value }));
  };

  const handleSkip = () => {
    onDone({ theme: "", cells: {} });
  };

  const handleDone = () => {
    onDone({ theme, cells });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0e0e0e] flex flex-col overflow-y-auto"
    >
      {/* アンビエント背景（半分の明るさ）*/}
      <SparkAmbient dimmed />

      <div className="relative z-10 flex flex-col min-h-full">
        <StepBar steps={SPARK_STEPS} current="mygrid" />

        <div className="max-w-sm mx-auto w-full px-4 pt-4 pb-28 flex flex-col gap-5">

          {/* タイトル */}
          <div>
            <h2 className="text-[#e8e6e1] text-lg font-light tracking-wide">
              あなたのテーマで考えよう
            </h2>
          </div>

          {/* キープしたアイデア（参照用チップ）*/}
          {kept.length > 0 && showKept && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.3em]">
                  キープしたアイデア
                </span>
                <button
                  onClick={() => { playClick(); setShowKept(false); }}
                  className="text-[#e8e6e1]/20 text-[10px] hover:text-[#e8e6e1]/40 transition-colors"
                >
                  非表示
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {kept.slice(0, 8).map((item, i) => (
                  <span
                    key={i}
                    className="border border-white/10 px-2 py-0.5 text-[10px] text-[#e8e6e1]/40 font-light"
                  >
                    {item.themeLabel}
                  </span>
                ))}
                {kept.length > 8 && (
                  <span className="text-[10px] text-[#e8e6e1]/20 font-light self-center">
                    +{kept.length - 8}
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* テーマ入力 */}
          <div>
            <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.3em] mb-2">
              テーマ
            </p>
            <input
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="例：新しい珈琲の売り方"
              className="w-full bg-transparent border border-white/10 px-4 py-3 text-[#e8e6e1] text-sm font-light placeholder-[#e8e6e1]/20 focus:outline-none focus:border-white/25 transition-colors duration-200"
            />
          </div>

          {/* 9マスグリッド */}
          <div>
            <div className={`grid grid-cols-3 gap-px bg-white/6 transition-opacity duration-300 ${
              !theme ? "opacity-40" : "opacity-100"
            }`}>
              {CATEGORIES.map((cat) => {
                const isFocused = focusedCell === cat;
                const hasValue = !!(cells[cat]?.trim());
                return (
                  <div
                    key={cat}
                    className={`flex flex-col p-2.5 min-h-[88px] transition-all duration-150 ${
                      hasValue
                        ? "bg-[#141414] border border-[#a3a957]/20"
                        : isFocused
                        ? "bg-white/4 border border-white/15"
                        : "bg-[#141414]"
                    }`}
                  >
                    <span className={`text-[9px] font-light tracking-wider mb-1 ${
                      hasValue ? "text-[#a3a957]/60" : "text-white/25"
                    }`}>
                      {CATEGORY_LABEL[cat]}
                    </span>
                    {isFocused ? (
                      <input
                        ref={(el) => { if (el) inputRefs.current[cat] = el; }}
                        autoFocus
                        value={cells[cat] ?? ""}
                        onChange={(e) => handleCellChange(cat, e.target.value)}
                        onBlur={() => setFocusedCell(null)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") setFocusedCell(null);
                        }}
                        disabled={!theme}
                        className="flex-1 bg-transparent text-[11px] text-[#e8e6e1] font-light focus:outline-none min-w-0"
                        placeholder={CATEGORY_QUESTION[cat]}
                      />
                    ) : (
                      <button
                        onClick={() => { if (theme) { playClick(); setFocusedCell(cat); } }}
                        disabled={!theme}
                        className="flex-1 text-left text-[11px] font-light leading-snug"
                      >
                        {hasValue ? (
                          <span className="text-[#e8e6e1]/70">{cells[cat]}</span>
                        ) : (
                          <span className="text-[#e8e6e1]/15">{CATEGORY_QUESTION[cat]}</span>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* スキップ / 完了 */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => { playClick(); handleDone(); }}
              className="w-full py-3.5 border border-[#a3a957]/40 text-[#a3a957]/80 text-sm font-light tracking-wider hover:bg-[#a3a957]/10 hover:border-[#a3a957]/60 transition-all duration-300 flex items-center justify-center gap-2"
            >
              完了
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => { playClick(); handleSkip(); }}
              className="w-full py-2 text-[#e8e6e1]/25 text-xs font-light tracking-wider hover:text-[#e8e6e1]/50 transition-colors duration-200"
            >
              スキップ →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
