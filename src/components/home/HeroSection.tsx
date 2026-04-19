"use client";

// トップページ ヒーローセクション
// - フルスクリーン（100vh）、背景は暗色（#0a0a0a）
// - 灯台SVGアニメーション
// - 波SVGアニメーション（下部）
// - メインコピーのフェードイン（Framer Motion）
// - スクロールインジケーター

import { motion } from "framer-motion";
import Lighthouse from "@/components/animations/Lighthouse";
import Waves from "@/components/animations/Waves";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-[#f7f9f7] flex flex-col items-center justify-center overflow-hidden">
      {/* 灯台アニメーション */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-12"
      >
        <Lighthouse strokeColor="#1a1a1a" />
      </motion.div>

      {/* メインコピー */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: "easeOut" }}
        className="text-center px-6 z-10"
      >
        <h1 className="text-[#1a1a1a] text-3xl md:text-5xl font-light leading-relaxed tracking-widest mb-6">
          感性が、ふと、
          <br />
          戻ってくる場所。
        </h1>
        <p className="text-[#1a1a1a]/50 text-sm md:text-base font-light tracking-[0.3em]">
          灯台の珈琲焙煎所 mumu
        </p>
      </motion.div>

      {/* スクロールインジケーター */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-[#1a1a1a]/30 text-xs font-light tracking-[0.3em]">scroll</span>
        {/* 縦線が下に流れるアニメーション */}
        <div className="relative w-px h-10 bg-[#1a1a1a]/10 overflow-hidden">
          <motion.div
            className="absolute top-0 left-0 w-full bg-[#EF9F27]"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeIn" }}
            style={{ height: "40%" }}
          />
        </div>
      </motion.div>

      {/* 波アニメーション（最下部） */}
      <Waves />
    </section>
  );
}
