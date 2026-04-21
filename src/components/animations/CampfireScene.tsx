"use client";

// 焚き火セッション用アニメーション — 森の中の焚き火
// FocusScene と同じ細線モノクロスタイル（#e8e6e1 on #0e0e0e）

import { motion } from "framer-motion";

// ─────────────────────────────────────────────────
// 空（背景 + 月 + 星）
// ─────────────────────────────────────────────────
function Sky() {
  const STARS: [number, number, number, number][] = [
    [80,  18, 0.7, 0],  [140, 12, 0.6, 1],  [200, 30, 0.7, 2],
    [260, 22, 0.5, 3],  [60,  38, 0.5, 5],
    [170, 45, 0.6, 6],  [100, 52, 0.4, 8],
    [350, 35, 0.6, 10], [190, 15, 0.5, 11],
  ];

  return (
    <>
      <rect width="360" height="240" fill="#0e0e0e" />

      {/* 月（三日月） */}
      <circle cx="295" cy="40" r="18" stroke="#e8e6e1" strokeWidth="0.8" opacity="0.45" fill="none" />
      <circle cx="299" cy="37" r="14" fill="#0e0e0e" />

      {/* 星々（まばたき） */}
      {STARS.map(([x, y, r, i]) => (
        <motion.circle
          key={i} cx={x} cy={y} r={r}
          fill="#e8e6e1"
          animate={{ opacity: [0.10, 0.45, 0.10] }}
          transition={{
            duration: 4.5 + i * 0.55,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.38,
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────
// 森のシルエット（左右の松の木、細線）
// ─────────────────────────────────────────────────
function Forest() {
  return (
    <>
      {/* 左側・奥の木（低め・薄め） */}
      <path d="M10 172 L32 118 L54 172 Z"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinejoin="round" fill="none" opacity="0.14" />
      <path d="M48 172 L72 108 L96 172 Z"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinejoin="round" fill="none" opacity="0.12" />

      {/* 左側・手前の木（大きめ・やや濃い） */}
      <path d="M-8 172 L22 78 L52 172 Z"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.22" />
      <path d="M52 172 L85 88 L118 172 Z"
        stroke="#e8e6e1" strokeWidth="0.75" strokeLinejoin="round" fill="none" opacity="0.18" />

      {/* 右側・奥の木（低め・薄め） */}
      <path d="M270 172 L292 120 L314 172 Z"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinejoin="round" fill="none" opacity="0.14" />
      <path d="M308 172 L330 110 L352 172 Z"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinejoin="round" fill="none" opacity="0.12" />

      {/* 右側・手前の木（大きめ・やや濃い） */}
      <path d="M242 172 L272 82 L302 172 Z"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.22" />
      <path d="M308 172 L338 90 L368 172 Z"
        stroke="#e8e6e1" strokeWidth="0.75" strokeLinejoin="round" fill="none" opacity="0.18" />
    </>
  );
}

// ─────────────────────────────────────────────────
// 地面
// ─────────────────────────────────────────────────
function Ground() {
  return (
    <line x1="0" y1="172" x2="360" y2="172"
      stroke="#e8e6e1" strokeWidth="0.6" opacity="0.28" />
  );
}

// ─────────────────────────────────────────────────
// 焚き火の光のグロー（地面周辺のほんのりした明るさ）
// ─────────────────────────────────────────────────
function FireGlow() {
  return (
    <motion.ellipse
      cx="180" cy="172" rx="55" ry="12"
      fill="#e8e6e1"
      animate={{ opacity: [0.025, 0.055, 0.025] }}
      transition={{ duration: 2.0, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

// ─────────────────────────────────────────────────
// 薪（クロスした2本）
// ─────────────────────────────────────────────────
function Logs() {
  return (
    <>
      <line x1="158" y1="174" x2="202" y2="167"
        stroke="#e8e6e1" strokeWidth="1.4" strokeLinecap="round" opacity="0.48" />
      <line x1="158" y1="167" x2="202" y2="174"
        stroke="#e8e6e1" strokeWidth="1.4" strokeLinecap="round" opacity="0.48" />
    </>
  );
}

// ─────────────────────────────────────────────────
// 炎（アニメーション — 3層: 外・中・先端）
// ─────────────────────────────────────────────────
function Flames() {
  return (
    <>
      {/* 外側の炎（一番大きく・薄め） */}
      <motion.path
        d="M166 168 C160 150 165 132 180 120 C195 132 200 150 194 168 Z"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinejoin="round" fill="none" opacity="0.22"
        animate={{
          d: [
            "M166 168 C160 150 165 132 180 120 C195 132 200 150 194 168 Z",
            "M168 168 C158 148 166 130 180 118 C194 130 202 148 192 168 Z",
            "M166 168 C161 151 165 133 180 121 C195 133 199 151 194 168 Z",
          ],
        }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
      />

      {/* 中央の炎（やや濃い） */}
      <motion.path
        d="M170 168 C166 155 168 142 180 133 C192 142 194 155 190 168 Z"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinejoin="round" fill="none" opacity="0.40"
        animate={{
          d: [
            "M170 168 C166 155 168 142 180 133 C192 142 194 155 190 168 Z",
            "M171 168 C165 153 169 140 180 131 C191 140 195 153 189 168 Z",
            "M170 168 C167 156 168 143 180 134 C192 143 193 156 190 168 Z",
          ],
        }}
        transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 先端の炎（細くて揺れる） */}
      <motion.path
        d="M176 134 C175 126 178 118 180 113 C182 118 185 126 184 134"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.22"
        animate={{
          d: [
            "M176 134 C175 126 178 118 180 113 C182 118 185 126 184 134",
            "M175 134 C173 125 177 116 180 111 C183 116 187 125 185 134",
            "M177 134 C175 127 178 119 180 114 C182 119 185 127 183 134",
          ],
        }}
        transition={{ duration: 1.0, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
    </>
  );
}

// ─────────────────────────────────────────────────
// 火の粉（上に浮いて消える）
// ─────────────────────────────────────────────────
const EMBERS: { cx: number; initY: number; dx: number; delay: number; dur: number }[] = [
  { cx: 178, initY: 130, dx: -6,  delay: 0.0, dur: 3.0 },
  { cx: 181, initY: 128, dx:  5,  delay: 1.2, dur: 2.8 },
  { cx: 176, initY: 132, dx: -3,  delay: 2.4, dur: 3.4 },
  { cx: 183, initY: 125, dx:  8,  delay: 0.7, dur: 2.6 },
  { cx: 179, initY: 130, dx: -9,  delay: 3.2, dur: 3.1 },
  { cx: 182, initY: 127, dx:  4,  delay: 1.8, dur: 2.9 },
];

function Embers() {
  return (
    <>
      {EMBERS.map((e, i) => (
        <motion.circle
          key={i}
          r="0.9"
          fill="#e8e6e1"
          animate={{
            cx: [e.cx, e.cx + e.dx],
            cy: [e.initY, e.initY - 40, e.initY - 70],
            opacity: [0.55, 0.25, 0],
          }}
          transition={{
            duration: e.dur,
            delay: e.delay,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────
// CampfireScene（メイン）
// ─────────────────────────────────────────────────
export default function CampfireScene() {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="hidden"
      aria-label="森の中の焚き火"
    >
      {/* 1. 空（背景 + 月 + 星） */}
      <Sky />

      {/* 2. 森のシルエット */}
      <Forest />

      {/* 3. 地面 */}
      <Ground />

      {/* 4. 焚き火のグロー */}
      <FireGlow />

      {/* 5. 薪 */}
      <Logs />

      {/* 6. 炎 */}
      <Flames />

      {/* 7. 火の粉 */}
      <Embers />
    </svg>
  );
}
