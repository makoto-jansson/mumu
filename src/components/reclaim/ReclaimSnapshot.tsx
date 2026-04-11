"use client";

// 感性スナップショット
// 6つのオーブが浮遊。layer別サイズ・輝度・カラーで今日の感性の形を表現

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import type { FeelResult } from "./ReclaimFeel";

const LAYER_COLORS: Record<string, string> = {
  sensory:  "#F59E0B", // amber-400
  scene:    "#38BDF8", // sky-400
  tempo:    "#34D399", // emerald-400
  relation: "#FB7185", // rose-400
  abstract: "#A78BFA", // violet-400
  values:   "#22D3EE", // cyan-400
};

const LAYER_LABEL: Record<string, string> = {
  sensory:  "感覚",
  scene:    "情景",
  tempo:    "時間感覚",
  relation: "関係性",
  abstract: "抽象",
  values:   "価値観",
};

type OrbData = {
  layer: string;
  size: number;
  opacity: number;
};

function calculateOrbs(feelResults: FeelResult[]): OrbData[] {
  const layers = ["sensory", "scene", "tempo", "relation", "abstract", "values"];
  return layers.map((layer) => {
    const layerResults = feelResults.filter((r) => r.layer === layer);
    const count = layerResults.length;
    const aCount = layerResults.filter((r) => r.choice === "a").length;
    const bias = count > 0 ? Math.abs(aCount / count - 0.5) * 2 : 0;
    return {
      layer,
      size: 24 + count * 12,
      opacity: 0.4 + bias * 0.5,
    };
  });
}

// 各オーブの固定レイアウト位置（6つ）
const ORB_POSITIONS = [
  { x: "20%", y: "20%" },
  { x: "65%", y: "10%" },
  { x: "80%", y: "45%" },
  { x: "55%", y: "75%" },
  { x: "20%", y: "65%" },
  { x: "42%", y: "38%" },
];

type Props = {
  feelResults: FeelResult[];
};

export default function ReclaimSnapshot({ feelResults }: Props) {
  const orbs = calculateOrbs(feelResults);
  const [tappedLayer, setTappedLayer] = useState<string | null>(null);

  const handleTap = useCallback((layer: string) => {
    setTappedLayer(layer);
    setTimeout(() => setTappedLayer(null), 1200);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative h-48 border border-white/6 bg-[#0d0d0d] overflow-hidden">
        {orbs.map((orb, i) => {
          const pos = ORB_POSITIONS[i];
          const color = LAYER_COLORS[orb.layer];
          // ランダム性のある浮遊周期（seedとして index を使用）
          const floatDuration = 3 + i * 0.7;
          const floatDelay = i * 0.4;

          return (
            <motion.button
              key={orb.layer}
              onClick={() => handleTap(orb.layer)}
              className="absolute rounded-full"
              style={{
                left: pos.x,
                top: pos.y,
                width: orb.size,
                height: orb.size,
                backgroundColor: color,
                opacity: orb.opacity,
                transform: "translate(-50%, -50%)",
                filter: `blur(${orb.size * 0.15}px)`,
              }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: floatDelay,
              }}
            />
          );
        })}

        {/* タップ時にlayer名を表示 */}
        {tappedLayer && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span
              className="text-xs font-light tracking-[0.3em] px-3 py-1 border border-white/15 bg-[#0a0a0a]/80"
              style={{ color: LAYER_COLORS[tappedLayer] }}
            >
              {LAYER_LABEL[tappedLayer]}
            </span>
          </motion.div>
        )}
      </div>
      <p className="text-[#e8e6e1]/20 text-[10px] font-light tracking-[0.3em] text-center">
        今日の感性の形
      </p>
    </div>
  );
}
