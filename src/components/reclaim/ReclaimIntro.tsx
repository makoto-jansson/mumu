"use client";

// Reclaim 導入画面
// 灯台（遅い回転）+ 珈琲あり/なし選択
// 購入提案は絶対にしない

import { motion } from "framer-motion";
import StepBar, { RECLAIM_STEPS } from "@/components/focus/StepBar";

type Props = {
  onCoffee: () => void;   // 珈琲を淹れて始める → CoffeeTime → sense
  onSkip: () => void;     // そのまま始める → 直接 sense
};

export default function ReclaimIntro({ onCoffee, onSkip }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-y-auto"
    >
      <StepBar steps={RECLAIM_STEPS} current="intro" />

      <div className="max-w-sm mx-auto w-full px-6 flex flex-col items-center">

        {/* テキスト */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center mt-16 flex flex-col gap-6"
        >
          <div className="flex items-center justify-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              className="text-[#1D9E75]/60" stroke="currentColor"
              strokeWidth="1.2" strokeLinecap="round">
              <path d="M12 12 C12 10 14 8 16 10 C18 12 16 16 12 16 C8 16 5 12 7 8 C9 4 15 3 19 7 C22 10 21 17 17 20" />
            </svg>
            <p className="text-[#1D9E75]/60 text-xs font-light tracking-[0.4em]">Reclaim</p>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className="text-[#e8e6e1] text-xl font-light tracking-wide leading-relaxed">
              感性を、取り戻す時間。
            </h1>
            <p className="text-[#e8e6e1]/40 text-sm font-light leading-[2]">
              正解はありません。<br />
              感じたことを、そのまま受け取ってください。
            </p>
          </div>

          {/* ボタン */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="flex flex-col gap-3 w-full pb-12"
          >
            <button
              onClick={onCoffee}
              className="w-full py-4 border border-[#1D9E75]/40 text-[#1D9E75]/80 text-sm font-light tracking-wider hover:bg-[#1D9E75]/8 hover:border-[#1D9E75]/60 transition-all duration-300"
            >
              珈琲を淹れて始める
            </button>
            <button
              onClick={onSkip}
              className="w-full py-2 text-[#e8e6e1]/25 text-xs font-light tracking-wider hover:text-[#e8e6e1]/50 transition-colors duration-200"
            >
              そのまま始める →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
