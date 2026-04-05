"use client";

// アプリホーム画面
// - 小さい灯台アニメーション
// - 4つのモードカード（Focus / Relax / Spark / Reclaim）
// - Spark・Reclaimは Coming soon
// - 下部にBASEへのリンク

import { motion } from "framer-motion";
import Link from "next/link";
import Lighthouse from "@/components/animations/Lighthouse";
import Waves from "@/components/animations/Waves";

// モードカードの定義
const modes = [
  {
    href: "/app/focus",
    emoji: "☀",
    name: "Focus brew",
    nameJa: "集中する",
    description: "珈琲とともに、深く集中する時間をつくる",
    available: true,
  },
  {
    href: "/app/relax",
    emoji: "🌊",
    name: "Slow drip",
    nameJa: "リラックスする",
    description: "呼吸を整え、ゆっくりとほぐれる時間",
    available: true,
  },
  {
    href: "#",
    emoji: "⚡",
    name: "Spark",
    nameJa: "アイデアを爆発させる",
    description: "行き詰まりを突破する、感性の着火剤",
    available: false,
  },
  {
    href: "#",
    emoji: "🔮",
    name: "Reclaim",
    nameJa: "感性を取り戻す",
    description: "問いかけジャーナリングで、自分に戻る",
    available: false,
  },
];

export default function AppHome() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-5 pt-12">

      {/* 灯台アニメーション + 波 + キャッチコピーのヒーローエリア */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full flex flex-col items-center"
      >
        {/* 灯台（小さめ） */}
        <div className="scale-50 origin-top">
          <Lighthouse />
        </div>

        {/* 波アニメーション */}
        <div className="relative w-full h-16 -mt-16">
          <Waves />
        </div>

        {/* メインキャッチコピー */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-[#e8e6e1] text-xl font-light tracking-[0.2em] mt-4 mb-6"
        >
          感性を、取り戻す。
        </motion.p>
      </motion.div>

      {/* すべてのモード */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-sm"
      >
        <p className="text-[#e8e6e1]/40 text-xs font-light tracking-[0.3em] mb-4">
          すべてのモード
        </p>

        <div className="flex flex-col gap-3">
          {modes.map((mode, index) => (
            <motion.div
              key={mode.name}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: "easeOut" }}
            >
              {mode.available ? (
                // 利用可能なモード: リンクとして機能
                <Link
                  href={mode.href}
                  className="group flex items-center gap-4 border border-white/10 px-5 py-4 hover:border-white/25 hover:bg-white/[0.02] transition-all duration-300"
                >
                  <span className="text-xl w-7 text-center">{mode.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#e8e6e1] text-sm font-light tracking-wide">
                        {mode.name}
                      </span>
                      <span className="text-[#e8e6e1]/40 text-xs font-light">
                        {mode.nameJa}
                      </span>
                    </div>
                    <p className="text-[#e8e6e1]/40 text-xs font-light mt-0.5 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                  <span className="text-[#e8e6e1]/30 text-sm transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              ) : (
                // Coming soon なモード
                <div className="flex items-center gap-4 border border-white/[0.06] px-5 py-4 opacity-50">
                  <span className="text-xl w-7 text-center">{mode.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[#e8e6e1] text-sm font-light tracking-wide">
                        {mode.name}
                      </span>
                      <span className="text-[#e8e6e1]/40 text-xs font-light">
                        {mode.nameJa}
                      </span>
                    </div>
                    <p className="text-[#e8e6e1]/40 text-xs font-light mt-0.5 leading-relaxed">
                      {mode.description}
                    </p>
                  </div>
                  <span className="text-[#e8e6e1]/20 text-[10px] font-light tracking-widest border border-white/10 px-2 py-0.5">
                    soon
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* BASEへのリンク（常設EC導線） */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 mb-4 text-center"
        >
          <a
            href="https://mumucoffee.theshop.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#e8e6e1]/30 text-xs font-light tracking-wider hover:text-[#e8e6e1]/60 transition-colors duration-300"
          >
            mumuの珈琲豆はこちら
            <span>→</span>
          </a>
        </motion.div>

      </motion.div>
    </div>
  );
}
