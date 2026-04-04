"use client";

// 波のSVGアニメーションコンポーネント
// - 3レイヤーで奥行きを表現
// - 各レイヤーが異なる速度で左右にゆらぐ
// - 色: #1D9E75（ティール）の透明度違いで重ねる

import { motion } from "framer-motion";

export default function Waves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">
      {/* 波レイヤー3（最背面・最も透明） */}
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,100 L0,100 Z"
          fill="#1D9E75"
          opacity="0.08"
        />
      </motion.svg>

      {/* 波レイヤー2（中間） */}
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,70 C360,30 720,90 1080,50 C1260,30 1380,70 1440,70 L1440,100 L0,100 Z"
          fill="#1D9E75"
          opacity="0.15"
        />
      </motion.svg>

      {/* 波レイヤー1（最前面・最も不透明） */}
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,80 C180,40 360,90 540,70 C720,50 900,85 1080,65 C1260,45 1380,80 1440,75 L1440,100 L0,100 Z"
          fill="#1D9E75"
          opacity="0.25"
        />
      </motion.svg>
    </div>
  );
}
