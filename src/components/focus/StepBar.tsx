"use client";

// ステップステータスバー（Focus / Relax 共用）

import { motion } from "framer-motion";

export type StepDef = { key: string; label: string };

// Focus ステップ定義
export const FOCUS_STEPS: StepDef[] = [
  { key: "setup",   label: "準備" },
  { key: "coffee",  label: "珈琲" },
  { key: "session", label: "集中" },
  { key: "break",   label: "休憩" },
  { key: "summary", label: "完了" },
];

// Relax ステップ定義
export const RELAX_STEPS: StepDef[] = [
  { key: "setup",   label: "準備" },
  { key: "coffee",  label: "珈琲" },
  { key: "session", label: "呼吸" },
  { key: "done",    label: "完了" },
];

type Props = {
  steps:   StepDef[];
  current: string;
};

export default function StepBar({ steps, current }: Props) {
  const currentIndex = steps.findIndex((s) => s.key === current);

  return (
    <div className="flex items-center justify-center gap-0 px-6 pt-10 pb-2">
      {steps.map((step, i) => {
        const isActive    = i === currentIndex;
        const isCompleted = i < currentIndex;
        const isLast      = i === steps.length - 1;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div className="relative">
                {isCompleted && (
                  <div className="w-5 h-5 rounded-full bg-[#EF9F27]/20 border border-[#EF9F27]/40 flex items-center justify-center">
                    <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                      <path d="M1 3L3 5L7 1" stroke="#EF9F27" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                {isActive && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-5 h-5 rounded-full border border-[#EF9F27] bg-[#EF9F27]/15 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1.5 h-1.5 rounded-full bg-[#EF9F27]"
                    />
                  </motion.div>
                )}
                {!isActive && !isCompleted && (
                  <div className="w-5 h-5 rounded-full border border-white/15 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/20" />
                  </div>
                )}
              </div>
              <span className={`text-[9px] font-light tracking-wider ${
                isActive ? "text-[#EF9F27]" : isCompleted ? "text-[#EF9F27]/50" : "text-white/20"
              }`}>
                {step.label}
              </span>
            </div>

            {!isLast && (
              <div className="w-8 h-px mx-1 mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10" />
                {isCompleted && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ transformOrigin: "left" }}
                    className="absolute inset-0 bg-[#EF9F27]/40"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
