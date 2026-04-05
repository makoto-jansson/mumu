"use client";

// 2分間の呼吸ガイド
// 吸う(4s) → 止める(4s) → 吐く(4s) のサイクルを繰り返す
// 2分経過後に onComplete を呼ぶ

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";

type BreathPhase = "inhale" | "hold" | "exhale";

const PHASE_DURATION = 4; // 各フェーズ4秒
const CYCLE = PHASE_DURATION * 3; // 12秒/サイクル
const TOTAL = 120; // 2分 = 120秒

const phaseLabel: Record<BreathPhase, string> = {
  inhale: "吸う",
  hold: "止める",
  exhale: "吐く",
};

type Props = {
  onComplete: () => void;
  onSkip: () => void;
};

export default function BreathGuide({ onComplete, onSkip }: Props) {
  const { timeLeft, isFinished, formatted, start } = useTimer(TOTAL);
  const [phase, setPhase] = useState<BreathPhase>("inhale");

  // タイマー開始
  useEffect(() => {
    start();
  }, [start]);

  // 経過時間から現在のフェーズを計算
  useEffect(() => {
    const elapsed = TOTAL - timeLeft;
    const posInCycle = elapsed % CYCLE;
    if (posInCycle < PHASE_DURATION) setPhase("inhale");
    else if (posInCycle < PHASE_DURATION * 2) setPhase("hold");
    else setPhase("exhale");
  }, [timeLeft]);

  // 2分経過で完了
  useEffect(() => {
    if (isFinished) onComplete();
  }, [isFinished, onComplete]);

  // 円のスケール（フェーズごとに変化）
  const circleScale = phase === "inhale" ? 1.5 : phase === "hold" ? 1.5 : 1;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col items-center justify-center px-6"
    >
      {/* 残り時間 */}
      <p className="text-[#e8e6e1]/30 text-sm font-light tracking-[0.3em] mb-16">
        {formatted}
      </p>

      {/* 呼吸の円アニメーション */}
      <div className="relative flex items-center justify-center mb-16">
        {/* 外側のリング */}
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: PHASE_DURATION, ease: "easeInOut" }}
          className="w-40 h-40 rounded-full border border-[#EF9F27]/20"
        />
        {/* 内側の塗り */}
        <motion.div
          animate={{ scale: circleScale }}
          transition={{ duration: PHASE_DURATION, ease: "easeInOut" }}
          className="absolute w-32 h-32 rounded-full bg-[#EF9F27]/10"
        />
        {/* フェーズラベル */}
        <AnimatePresence mode="wait">
          <motion.p
            key={phase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute text-[#e8e6e1] text-lg font-light tracking-[0.2em]"
          >
            {phaseLabel[phase]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* 説明テキスト */}
      <p className="text-[#e8e6e1]/40 text-sm font-light text-center leading-relaxed mb-12">
        珈琲を淹れながら、
        <br />
        ゆっくり呼吸を整えましょう。
      </p>

      {/* スキップ */}
      <button
        onClick={onSkip}
        className="text-[#e8e6e1]/25 text-xs font-light tracking-wider hover:text-[#e8e6e1]/50 transition-colors duration-300"
      >
        スキップ →
      </button>
    </motion.div>
  );
}
