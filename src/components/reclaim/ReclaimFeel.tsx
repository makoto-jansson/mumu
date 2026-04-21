"use client";

// Reclaim Step 2: 対比カード
// 左半分=A（琥珀）、右半分=B（緑）。タップで即選択。スワイプも可。

import { useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import StepBar, { RECLAIM_STEPS } from "@/components/focus/StepBar";
import AmbientOrbs from "@/components/animations/AmbientOrbs";
import { selectSessionCards, type ReclaimCard } from "@/lib/selectSessionCards";
import { playClick } from "@/lib/playSound";

export type FeelResult = {
  cardId: string;
  layer: string;
  axis: string;
  choice: "a" | "b";
};

const LAYER_LABEL: Record<string, string> = {
  sensory:  "感覚",
  scene:    "情景",
  tempo:    "時間感覚",
  relation: "関係性",
  abstract: "抽象",
  values:   "価値観",
};

const SWIPE_THRESHOLD = 80;

type CardProps = {
  card: ReclaimCard;
  index: number;
  total: number;
  onChoose: (choice: "a" | "b") => void;
};

function SwipeCard({ card, index, total, onChoose }: CardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-6, 6]);
  // ドラッグ中に左右の色が強まる
  const aGlow = useTransform(x, [-SWIPE_THRESHOLD, 0], [0.18, 0.06]);
  const bGlow = useTransform(x, [0, SWIPE_THRESHOLD], [0.06, 0.18]);

  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (info.offset.x < -SWIPE_THRESHOLD) {
        animate(x, -500, { duration: 0.2 }).then(() => onChoose("a"));
      } else if (info.offset.x > SWIPE_THRESHOLD) {
        animate(x, 500, { duration: 0.2 }).then(() => onChoose("b"));
      } else {
        animate(x, 0, { type: "spring", stiffness: 400, damping: 30 });
      }
    },
    [x, onChoose]
  );

  return (
    <div className="flex flex-col gap-5">

      {/* 進捗 + レイヤー */}
      <div className="flex items-center justify-between">
        <span className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em]">
          {index + 1} / {total}
        </span>
        <span className="text-[#e8e6e1]/30 text-[10px] font-light tracking-widest border border-white/8 px-2 py-0.5">
          {LAYER_LABEL[card.layer]}
        </span>
      </div>

      {/* ガイド文 */}
      <p className="text-[#e8e6e1]/30 text-[11px] font-light tracking-wider text-center">
        どちらが今の気分？　タップして選ぶ
      </p>

      {/* 左右分割カード */}
      <motion.div
        style={{ x, rotate }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.5}
        onDragEnd={handleDragEnd}
        className="grid grid-cols-2 gap-2 cursor-grab active:cursor-grabbing select-none touch-none"
      >
        {/* A — 左・琥珀 */}
        <motion.button
          onClick={() => { playClick(); onChoose("a"); }}
          style={{
            backgroundColor: useTransform(
              aGlow,
              (v) => `rgba(239,159,39,${v})`
            ),
          }}
          className="relative flex flex-col justify-between px-4 py-6 border border-[#a3a957]/20 hover:border-[#a3a957]/50 transition-colors duration-200 min-h-[200px] text-center items-center group"
          whileTap={{ scale: 0.97 }}
        >
          {/* ラベル */}
          <span className="text-[#a3a957]/60 text-[10px] font-light tracking-[0.4em] group-hover:text-[#a3a957]/90 transition-colors">
            A
          </span>
          {/* テキスト */}
          <p className="text-[#e8e6e1]/80 text-sm font-light leading-relaxed tracking-wide mt-4">
            {card.a}
          </p>
          {/* 方向ヒント */}
          <span className="text-[#a3a957]/30 text-[10px] font-light mt-4 group-hover:text-[#a3a957]/60 transition-colors">
            ← こちら
          </span>
        </motion.button>

        {/* B — 右・緑 */}
        <motion.button
          onClick={() => { playClick(); onChoose("b"); }}
          style={{
            backgroundColor: useTransform(
              bGlow,
              (v) => `rgba(29,158,117,${v})`
            ),
          }}
          className="relative flex flex-col justify-between px-4 py-6 border border-[#1D9E75]/20 hover:border-[#1D9E75]/50 transition-colors duration-200 min-h-[200px] text-center items-center group"
          whileTap={{ scale: 0.97 }}
        >
          {/* ラベル */}
          <span className="text-[#1D9E75]/60 text-[10px] font-light tracking-[0.4em] group-hover:text-[#1D9E75]/90 transition-colors ">
            B
          </span>
          {/* テキスト */}
          <p className="text-[#e8e6e1]/80 text-sm font-light leading-relaxed tracking-wide mt-4">
            {card.b}
          </p>
          {/* 方向ヒント */}
          <span className="text-[#1D9E75]/30 text-[10px] font-light mt-4 group-hover:text-[#1D9E75]/60 transition-colors ">
            こちら →
          </span>
        </motion.button>
      </motion.div>

      {/* スワイプヒント（初回のみ控えめに） */}
      {index === 0 && (
        <motion.p
          initial={{ opacity: 0.4 }}
          animate={{ opacity: [0.4, 0.15, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-center text-[#e8e6e1]/25 text-[10px] font-light tracking-wider"
        >
          左右にスワイプでも選べます
        </motion.p>
      )}
    </div>
  );
}

type Props = {
  onDone: (results: FeelResult[]) => void;
};

export default function ReclaimFeel({ onDone }: Props) {
  const [cards] = useState<ReclaimCard[]>(selectSessionCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<FeelResult[]>([]);

  const handleChoose = useCallback(
    (choice: "a" | "b") => {
      const card = cards[currentIndex];
      const newResults: FeelResult[] = [
        ...results,
        { cardId: card.id, layer: card.layer, axis: card.axis, choice },
      ];
      setResults(newResults);

      if (currentIndex + 1 >= cards.length) {
        onDone(newResults);
      } else {
        setCurrentIndex((i) => i + 1);
      }
    },
    [cards, currentIndex, results, onDone]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0e0e0e] flex flex-col overflow-y-auto"
    >
      <div className="opacity-50">
        <AmbientOrbs />
      </div>

      <div className="relative z-10 flex flex-col min-h-full">
        <StepBar steps={RECLAIM_STEPS} current="feel" />

        <div className="max-w-sm mx-auto w-full px-6 pt-20 pb-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
            >
              <SwipeCard
                card={cards[currentIndex]}
                index={currentIndex}
                total={cards.length}
                onChoose={handleChoose}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
