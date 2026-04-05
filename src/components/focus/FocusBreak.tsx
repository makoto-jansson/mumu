"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";
import { getDailyPrompt } from "@/lib/getDailyPrompt";
import ButtonOrb from "@/components/animations/ButtonOrb";

const BREAK_SEC = 5 * 60;

type Props = {
  onNextSet: () => void;
  onFinish: () => void;
};

export default function FocusBreak({ onNextSet, onFinish }: Props) {
  const { formatted, start } = useTimer(BREAK_SEC);
  const prompt = getDailyPrompt();

  useEffect(() => { start(); }, [start]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center px-8"
    >
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-[#e8e6e1] text-xl font-light tracking-wide mb-12"
      >
        お疲れさまでした。
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="border border-white/10 px-8 py-6 max-w-xs text-center mb-12"
      >
        <p className="text-[#e8e6e1]/70 text-sm font-light leading-[2]">{prompt}</p>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-[#e8e6e1]/30 text-2xl font-light tracking-widest tabular-nums mb-14"
      >
        {formatted}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="flex flex-col gap-4 w-full max-w-xs"
      >
        <button
          onClick={onNextSet}
          className="relative overflow-hidden w-full py-4 bg-[#EF9F27]/10 border border-[#EF9F27]/40 text-[#EF9F27] text-sm font-light tracking-[0.2em] hover:bg-[#EF9F27]/20 transition-all duration-300"
        >
          <ButtonOrb />
          <span className="relative z-10">もう1セット集中する</span>
        </button>
        <button
          onClick={onFinish}
          className="w-full py-4 border border-white/10 text-[#e8e6e1]/50 text-sm font-light tracking-[0.2em] hover:border-white/25 hover:text-[#e8e6e1]/70 transition-all duration-300"
        >
          今日はここまで
        </button>
      </motion.div>
    </motion.div>
  );
}
