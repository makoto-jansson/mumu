"use client";

// 珈琲タイム画面（3分）
// ドリップアニメーションを見ながら珈琲を淹れる時間

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";
import Drip from "@/components/animations/Drip";
import StepBar, { FOCUS_STEPS, type StepDef } from "./StepBar";

const COFFEE_SEC = 3 * 60; // 3分

type Props = {
  onComplete: () => void;
  onSkip: () => void;
  steps?: StepDef[];
};

export default function CoffeeTime({ onComplete, onSkip, steps = FOCUS_STEPS }: Props) {
  const { formatted, isFinished, start } = useTimer(COFFEE_SEC);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isFinished) onComplete();
  }, [isFinished, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center px-6"
    >
      <StepBar steps={steps} current="coffee" />
      {/* コンテンツを縦中央に */}
      <div className="flex-1 flex flex-col items-center justify-center pb-24">

      {/* ドリップアニメーション */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="mb-10"
      >
        <Drip />
      </motion.div>

      {/* テキスト */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-[#e8e6e1] text-lg font-light tracking-wide mb-3">
          まずは珈琲を淹れましょう
        </p>
        <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
          一滴一滴、ていねいに。
          <br />
          それが集中の準備になります。
        </p>
      </motion.div>

      {/* タイマー */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[#EF9F27]/60 text-3xl font-light tracking-widest tabular-nums mb-12"
      >
        {formatted}
      </motion.p>

      {/* スキップ */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={onSkip}
        className="border border-white/20 px-8 py-3 text-[#e8e6e1]/50 text-sm font-light tracking-wider hover:border-white/40 hover:text-[#e8e6e1]/80 transition-all duration-300"
      >
        スキップ →
      </motion.button>
      </div>
    </motion.div>
  );
}
