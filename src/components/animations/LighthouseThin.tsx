"use client";

// 灯台SVGアニメーション — 細線イラストスタイル
// 光線は fill なし・stroke 2本/side で表現
// 正面グロー: stroke-only の同心円でパルス

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DURATION = 13.3;

type Props = {
  slow?: boolean;
};

export default function Lighthouse({ slow = false }: Props) {
  const angle = useMotionValue(0);
  const duration = slow ? DURATION * 2 : DURATION;

  useEffect(() => {
    const controls = animate(angle, 360, {
      duration,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
    return controls.stop;
  }, [angle, duration]);

  // 右ビーム: sin(θ) → θ=90 で最大
  const rightOpacity = useTransform(angle, (a) =>
    Math.max(0, Math.sin((a * Math.PI) / 180))
  );

  // 左ビーム: −sin(θ) → θ=270 で最大
  const leftOpacity = useTransform(angle, (a) =>
    Math.max(0, -Math.sin((a * Math.PI) / 180))
  );

  // 正面グロー: |cos(θ)|
  const glowScale = useTransform(angle, (a) =>
    Math.abs(Math.cos((a * Math.PI) / 180))
  );

  return (
    <svg
      viewBox="0 0 200 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-48 h-72 md:w-64 md:h-96"
      overflow="visible"
      aria-label="灯台のイラスト"
    >
      {/* ── 光（光源位置 x=100, y=119） ── */}
      <g transform="translate(100, 119)">

        {/* 右向きビーム（細線 2本） */}
        <motion.g style={{ opacity: rightOpacity }}>
          <line x1="18" y1="-7"  x2="340" y2="-55" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.22" />
          <line x1="18" y1=" 7"  x2="340" y2=" 72" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" opacity="0.14" />
        </motion.g>

        {/* 左向きビーム（細線 2本） */}
        <motion.g style={{ opacity: leftOpacity }}>
          <line x1="-18" y1="-7"  x2="-340" y2="-55" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.22" />
          <line x1="-18" y1=" 7"  x2="-340" y2=" 72" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" opacity="0.14" />
        </motion.g>

        {/* 正面グロー（stroke-only 同心円） */}
        <motion.g style={{ scale: glowScale }}>
          <circle cx="0" cy="0" r="44" stroke="#e8e6e1" strokeWidth="0.4" opacity="0.08" />
          <circle cx="0" cy="0" r="24" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.12" />
          <circle cx="0" cy="0" r="10" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.18" />
        </motion.g>

      </g>

      {/* ── 灯台本体 ── */}

      {/* 基礎 */}
      <rect x="60" y="270" width="80" height="10" rx="2"
        stroke="#e8e6e1" strokeWidth="0.9" opacity="0.40" />

      {/* 塔の胴体（台形） */}
      <path
        d="M72 270 L80 150 L120 150 L128 270 Z"
        stroke="#e8e6e1" strokeWidth="0.9" strokeLinejoin="round" opacity="0.45"
      />

      {/* 横縞（装飾） */}
      <line x1="74" y1="230" x2="126" y2="230" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.28" />
      <line x1="77" y1="200" x2="123" y2="200" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.28" />
      <line x1="79" y1="170" x2="121" y2="170" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.28" />

      {/* 灯室台（肩の部分） */}
      <rect x="74" y="138" width="52" height="14" rx="1"
        stroke="#e8e6e1" strokeWidth="0.9" opacity="0.45" />

      {/* 灯室（ガラス窓） */}
      <rect x="82" y="100" width="36" height="38" rx="2"
        stroke="#e8e6e1" strokeWidth="0.9" opacity="0.50" />

      {/* 光源（細線スタイル） */}
      <circle cx="100" cy="119" r="5" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35" />
      <circle cx="100" cy="119" r="2" fill="#e8e6e1" opacity="0.70" />

      {/* バルコニー縦支柱 */}
      <line x1="78" y1="138" x2="78" y2="100" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35" />
      <line x1="122" y1="138" x2="122" y2="100" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35" />

      {/* 屋根（三角） */}
      <path
        d="M80 100 L100 78 L120 100 Z"
        stroke="#e8e6e1" strokeWidth="0.9" strokeLinejoin="round" opacity="0.45"
      />

      {/* 頂点の飾り */}
      <line x1="100" y1="78" x2="100" y2="68" stroke="#e8e6e1" strokeWidth="0.9" opacity="0.45" />
      <circle cx="100" cy="65" r="3" stroke="#e8e6e1" strokeWidth="0.9" opacity="0.45" />
    </svg>
  );
}
