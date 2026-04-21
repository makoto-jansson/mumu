"use client";

// 珈琲タイム画面（3分）
// ドリップアニメーションを見ながら珈琲を淹れる時間

import { useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";
import Drip from "@/components/animations/Drip";
import StepBar, { FOCUS_STEPS, type StepDef } from "./StepBar";

const COFFEE_SEC = 3 * 60; // 3分

type Props = {
  onComplete: () => void;
  onSkip: () => void;
  steps?: StepDef[];
  stepKey?: string; // StepBar の current key（デフォルト "coffee"）
  subtitle?: React.ReactNode; // 説明文（省略時はFocus用デフォルト）
};

export default function CoffeeTime({ onComplete, onSkip, steps = FOCUS_STEPS, stepKey = "coffee", subtitle }: Props) {
  const { isFinished, start } = useTimer(COFFEE_SEC);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (isFinished) onComplete();
  }, [isFinished, onComplete]);

  // drip音の再生（ループ）
  useEffect(() => {
    const audio = new Audio("/sounds/181715__keweldog__drip-coffee.wav");
    audio.loop   = true;
    audio.volume = 0.4;
    const promise = audio.play().catch(() => {});
    return () => { promise.then(() => audio.pause()).catch(() => {}); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0e0e0e] z-50 flex flex-col items-center px-6 overflow-y-auto"
    >
      <StepBar steps={steps} current={stepKey} />
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
          {subtitle ?? (
            <>
              一滴一滴、ていねいに。
              <br />
              それが集中の準備になります。
            </>
          )}
        </p>
      </motion.div>

      {/* スキップ */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={onSkip}
        className="border border-white/20 px-8 py-3 text-[#e8e6e1]/50 text-sm font-light tracking-wider hover:border-white/40 hover:text-[#e8e6e1]/80 transition-all duration-300"
      >
        スキップ →
      </motion.button>
      </div>
    </motion.div>
  );
}
