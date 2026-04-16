"use client";

// Reclaim Step 1: 感覚を開く
// 日替わりの五感問いかけ → 任意記述 → 次へ

import { useState } from "react";
import { motion } from "framer-motion";
import StepBar, { RECLAIM_STEPS } from "@/components/focus/StepBar";
import AmbientOrbs from "@/components/animations/AmbientOrbs";
import { getDailySensePrompt } from "@/lib/getDailySensePrompt";
import { playClick } from "@/lib/playSound";

// ミニマルな風景イラスト（海 + 地平線 + 月）
const LANDSCAPE_ICON = (
  <svg width="80" height="48" viewBox="0 0 80 48" fill="none">
    {/* 月 */}
    <circle cx="60" cy="12" r="5" stroke="#e8e6e1" strokeWidth="0.8" opacity="0.45" />
    <circle cx="62.5" cy="10.5" r="3.8" fill="#0a0a0a" />

    {/* 星 */}
    <circle cx="20" cy="8"  r="0.8" fill="#e8e6e1" opacity="0.3" />
    <circle cx="35" cy="5"  r="0.6" fill="#e8e6e1" opacity="0.2" />
    <circle cx="10" cy="14" r="0.5" fill="#e8e6e1" opacity="0.25" />
    <circle cx="48" cy="7"  r="0.7" fill="#e8e6e1" opacity="0.2" />

    {/* 遠くの山のシルエット */}
    <path
      d="M0 34 L14 20 L22 28 L32 16 L42 26 L52 18 L62 28 L80 18 L80 34 Z"
      stroke="#e8e6e1" strokeWidth="0.7" opacity="0.2" strokeLinejoin="round"
    />

    {/* 地平線 */}
    <line x1="0" y1="34" x2="80" y2="34" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35" />

    {/* 海の波（3本、間隔を変えて） */}
    <path d="M0 38 C13 36 27 40 40 38 C53 36 67 40 80 38"
      stroke="#e8e6e1" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" />
    <path d="M0 42 C10 40 20 44 35 42 C50 40 65 44 80 42"
      stroke="#e8e6e1" strokeWidth="0.6" opacity="0.15" strokeLinecap="round" />
    <path d="M0 46 C15 44 30 48 50 46 C65 44 72 47 80 46"
      stroke="#e8e6e1" strokeWidth="0.5" opacity="0.1" strokeLinecap="round" />

    {/* 月の水面への反射 */}
    <line x1="58" y1="35" x2="56" y2="48" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.12" strokeLinecap="round" />
    <line x1="60" y1="35" x2="60" y2="48" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.18" strokeLinecap="round" />
    <line x1="62" y1="35" x2="64" y2="48" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.12" strokeLinecap="round" />
  </svg>
);

type Props = {
  hasCoffee: boolean;
  onDone: (response: string, promptId: string) => void;
};

export default function ReclaimSense({ hasCoffee, onDone }: Props) {
  // マウント時に1度だけ決定
  const [sense] = useState(() => getDailySensePrompt(hasCoffee));
  const [response, setResponse] = useState("");

  const handleDone = () => onDone(response.trim(), sense.selectedPrompt.id);
  const handleSkip = () => onDone("", sense.selectedPrompt.id);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-y-auto"
    >
      {/* アンビエント背景（50%輝度） */}
      <div className="opacity-50">
        <AmbientOrbs />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <StepBar steps={RECLAIM_STEPS} current="sense" />

        <div className="max-w-sm mx-auto w-full px-6 pt-8 pb-24 flex flex-col gap-8">

          {/* 五感ラベル */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center gap-2 text-center"
          >
            {LANDSCAPE_ICON}
            <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.4em]">
              {sense.label}
            </p>
          </motion.div>

          {/* instruction */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[#e8e6e1]/60 text-sm font-light leading-[2] text-center"
          >
            {sense.instruction}
          </motion.p>

          <div className="border-t border-white/6" />

          {/* 問い */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-[#e8e6e1] text-lg font-light leading-[1.9] tracking-wide"
          >
            {sense.selectedPrompt.prompt}
          </motion.p>

          {/* 入力欄（1行） */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col gap-2"
          >
            <input
              type="text"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-[#e8e6e1]/80 text-sm font-light placeholder-[#e8e6e1]/20 focus:outline-none focus:border-white/25 transition-colors duration-200"
              placeholder={sense.selectedPrompt.hint}
            />
          </motion.div>

          {/* ボタン */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col gap-3"
          >
            <button
              onClick={() => { playClick(); handleDone(); }}
              className="w-full py-3.5 border border-[#1D9E75]/40 text-[#1D9E75]/80 text-sm font-light tracking-wider hover:bg-[#1D9E75]/8 hover:border-[#1D9E75]/60 transition-all duration-300"
            >
              感じました
            </button>
            <button
              onClick={() => { playClick(); handleSkip(); }}
              className="w-full py-2 text-[#e8e6e1]/25 text-xs font-light tracking-wider hover:text-[#e8e6e1]/50 transition-colors duration-200"
            >
              書かずに進む →
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
