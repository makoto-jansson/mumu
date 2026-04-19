"use client";

// 灯台のSVGアニメーションコンポーネント
// 正面から見た灯台の周りを光が1周するように見せる（擬似3D）
//
// 【アニメーションの仕組み】
//   右ビーム opacity = max(0, sin(θ))  … θ=0〜180の前半で点灯
//   左ビーム opacity = max(0, -sin(θ)) … θ=180〜360の後半で点灯
//   正面グロー scale = max(0, cos(θ))  … θ=0（正面）の時だけ大きくなる

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

const DURATION = 13.3; // 通常速度

type Props = {
  slow?: boolean;       // trueにすると2倍遅い（Reclaim導入/完了用）
  strokeColor?: string; // 灯台線の色（デフォルト: #e8e6e1 = 白系、明るい背景では #1a1a1a 等）
};

export default function Lighthouse({ slow = false, strokeColor = "#e8e6e1" }: Props) {
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

  // 右ビーム: sin(θ) → θ=90で1、θ=0/180で0
  const rightOpacity = useTransform(angle, (a) =>
    Math.max(0, Math.sin((a * Math.PI) / 180))
  );

  // 左ビーム: −sin(θ) → θ=270で1、θ=180/360で0
  const leftOpacity = useTransform(angle, (a) =>
    Math.max(0, -Math.sin((a * Math.PI) / 180))
  );

  // 正面グロー: |cos(θ)| → θ=0（右に向かう前）とθ=180（左に向かう前）の両方でピーク
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
      {/* ── 光（光源位置 x=100, y=119 を原点に） ── */}
      <g transform="translate(100, 119)">

        {/* 右向きビーム */}
        <motion.g style={{ opacity: rightOpacity }}>
          <path d="M0 0 L220 -70 L220 70 Z" fill="#EF9F27" opacity="0.2" />
          <path d="M0 0 L220 -35 L220 35 Z" fill="#EF9F27" opacity="0.3" />
          <path d="M0 0 L220 -14 L220 14 Z" fill="#EF9F27" opacity="0.4" />
        </motion.g>

        {/* 左向きビーム */}
        <motion.g style={{ opacity: leftOpacity }}>
          <path d="M0 0 L-220 -70 L-220 70 Z" fill="#EF9F27" opacity="0.2" />
          <path d="M0 0 L-220 -35 L-220 35 Z" fill="#EF9F27" opacity="0.3" />
          <path d="M0 0 L-220 -14 L-220 14 Z" fill="#EF9F27" opacity="0.4" />
        </motion.g>

        {/* 正面グロー（こちらを向いている時の楕円形の光） */}
        <motion.g style={{ scale: glowScale }}>
          <ellipse cx="0" cy="0" rx="52" ry="34" fill="#EF9F27" opacity="0.12" />
          <ellipse cx="0" cy="0" rx="30" ry="20" fill="#EF9F27" opacity="0.22" />
          <ellipse cx="0" cy="0" rx="13" ry="9"  fill="#EF9F27" opacity="0.40" />
        </motion.g>

      </g>

      {/* ── 灯台本体（光の前面に重ねて描画） ── */}

      {/* 基礎 */}
      <rect x="60" y="270" width="80" height="10" rx="2" stroke={strokeColor} strokeWidth="0.9" opacity="0.40" />

      {/* 塔の胴体（台形） */}
      <path
        d="M72 270 L80 150 L120 150 L128 270 Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* 塔の横縞（装飾） */}
      <line x1="74" y1="230" x2="126" y2="230" stroke={strokeColor} strokeWidth="0.6" opacity="0.28" />
      <line x1="77" y1="200" x2="123" y2="200" stroke={strokeColor} strokeWidth="0.6" opacity="0.28" />
      <line x1="79" y1="170" x2="121" y2="170" stroke={strokeColor} strokeWidth="0.6" opacity="0.28" />

      {/* 灯室台（肩の部分） */}
      <rect x="74" y="138" width="52" height="14" rx="1" stroke={strokeColor} strokeWidth="0.9" opacity="0.45" />

      {/* 灯室（ガラス窓） */}
      <rect x="82" y="100" width="36" height="38" rx="2" stroke={strokeColor} strokeWidth="0.9" opacity="0.50" />

      {/* 光源の輝き（常時点灯） */}
      <circle cx="100" cy="119" r="6" fill="#EF9F27" opacity="0.4" />
      <circle cx="100" cy="119" r="3" fill="#EF9F27" opacity="1" />

      {/* 屋根 */}
      <path
        d="M80 100 L100 78 L120 100 Z"
        stroke={strokeColor}
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* 頂点の飾り */}
      <line x1="100" y1="78" x2="100" y2="68" stroke={strokeColor} strokeWidth="0.9" opacity="0.45" />
      <circle cx="100" cy="65" r="3" stroke={strokeColor} strokeWidth="0.9" opacity="0.45" />

      {/* バルコニー縦手すり */}
      <line x1="78" y1="138" x2="78" y2="100" stroke={strokeColor} strokeWidth="0.6" opacity="0.35" />
      <line x1="122" y1="138" x2="122" y2="100" stroke={strokeColor} strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}
