"use client";

// Generative Ambient Background
// 海の等高線/フロー場をイメージした細い曲線群がゆっくり波打つ
// Noise-based Animation — 各ラインは独自の周期と位相でゆらぐ

import { motion } from "framer-motion";

// y: ライン縦位置（viewBox 0 0 360 850）
// amp: 波の振幅(px)
// op: 不透明度
// dur: 1往復の秒数
// delay: 開始ディレイ
const LINES = [
  { y:  70, amp: 10, op: 0.038, dur: 22, delay: 0.0 },
  { y: 155, amp: 14, op: 0.030, dur: 29, delay: 3.8 },
  { y: 245, amp: 12, op: 0.042, dur: 20, delay: 1.4 },
  { y: 340, amp: 16, op: 0.033, dur: 34, delay: 7.2 },
  { y: 435, amp: 11, op: 0.028, dur: 26, delay: 2.6 },
  { y: 530, amp: 15, op: 0.040, dur: 22, delay: 8.5 },
  { y: 628, amp: 13, op: 0.030, dur: 31, delay: 4.5 },
  { y: 722, amp: 18, op: 0.035, dur: 25, delay: 5.9 },
];

type LineProps = typeof LINES[0];

function FlowLine({ y, amp, op, dur, delay }: LineProps) {
  // 同一コマンド構成で2状態を定義 → Framer Motionがなめらかにモーフィング
  const p1 = `M0 ${y} C90 ${y - amp} 180 ${y + amp} 270 ${y - amp} C315 ${y - amp * 0.5} 360 ${y} 360 ${y}`;
  const p2 = `M0 ${y} C90 ${y + amp} 180 ${y - amp} 270 ${y + amp} C315 ${y + amp * 0.5} 360 ${y} 360 ${y}`;

  return (
    <motion.path
      d={p1}
      animate={{ d: [p1, p2] }}
      transition={{
        duration: dur,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
        delay,
      }}
      stroke="#e8e6e1"
      strokeWidth="0.55"
      fill="none"
      opacity={op}
    />
  );
}

export default function AmbientOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        viewBox="0 0 360 850"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {LINES.map((l, i) => (
          <FlowLine key={i} {...l} />
        ))}
      </svg>
    </div>
  );
}
