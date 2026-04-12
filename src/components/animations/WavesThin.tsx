"use client";

// 波のSVGアニメーション — 細線イラストスタイル
// stroke-only（fill なし）、#e8e6e1 低 opacity

import { motion } from "framer-motion";

export default function Waves() {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden pointer-events-none">

      {/* 波レイヤー3（最背面・最も薄い） */}
      <motion.svg
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
        animate={{ x: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60"
          stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round"
          fill="none" opacity="0.12"
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
          d="M0,70 C360,30 720,90 1080,50 C1260,30 1380,70 1440,70"
          stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round"
          fill="none" opacity="0.20"
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
          d="M0,80 C180,40 360,90 540,70 C720,50 900,85 1080,65 C1260,45 1380,80 1440,75"
          stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round"
          fill="none" opacity="0.28"
        />
      </motion.svg>

    </div>
  );
}
