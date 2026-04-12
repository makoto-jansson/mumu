"use client";

// アプリホーム画面
// - 今日のルーティン（上部）
// - 灯台アニメーション
// - 4つのモードカード（全て有効）
// - 下部にBASEへのリンク

import { motion } from "framer-motion";
import Link from "next/link";
import Lighthouse from "@/components/animations/LighthouseThin";
import Waves from "@/components/animations/WavesThin";
import TodayRoutine from "@/components/app/TodayRoutine";

// ─── モードアイコン ───────────────────────────────────
// Focus brew: 同心楕円の干渉パターン（集中・深度）
function IconFocus() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#e8e6e1" strokeWidth="1.1" strokeLinecap="round">
      <circle cx="12" cy="12" r="1.5" fill="#e8e6e1" stroke="none" />
      <ellipse cx="12" cy="12" rx="4.5" ry="3" transform="rotate(20 12 12)" />
      <ellipse cx="12" cy="12" rx="8.5" ry="5.5" transform="rotate(-15 12 12)" />
    </svg>
  );
}

// Slow drip: 有機的な波線（流れ・弛緩）
function IconRelax() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#e8e6e1" strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 9 C5 5.5 7 12.5 10 9 C13 5.5 15 12.5 18 9 C19.5 7.2 21 8 22 9" />
      <path d="M2 15 C5 11.5 7 18.5 10 15 C13 11.5 15 18.5 18 15 C19.5 13.2 21 14 22 15"
        opacity="0.45" />
    </svg>
  );
}

// Spark: 樹状・ニューラルな枝分かれ（ひらめき・発火）
function IconSpark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#e8e6e1" strokeWidth="1.1" strokeLinecap="round">
      <circle cx="12" cy="12" r="1.2" fill="#e8e6e1" stroke="none" />
      <line x1="12" y1="10.8" x2="12" y2="4" />
      <line x1="12" y1="4" x2="9" y2="1.5" />
      <line x1="12" y1="4" x2="15" y2="1.5" />
      <line x1="11.4" y1="11.3" x2="5.5" y2="16" />
      <line x1="5.5" y1="16" x2="3" y2="15" />
      <line x1="5.5" y1="16" x2="4.5" y2="19" />
      <line x1="12.6" y1="11.3" x2="18.5" y2="16" />
      <line x1="18.5" y1="16" x2="21" y2="15" />
      <line x1="18.5" y1="16" x2="19.5" y2="19" />
    </svg>
  );
}

// Reclaim: フィボナッチ螺旋（内側へ・感性の回帰）
function IconReclaim() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="#e8e6e1" strokeWidth="1.2" strokeLinecap="round">
      <path d="M12 12
        C12 10 14 8 16 10
        C18 12 16 16 12 16
        C8 16 5 12 7 8
        C9 4 15 3 19 7
        C22 10 21 17 17 20"
      />
    </svg>
  );
}

// ─── モードカードの定義 ───────────────────────────────
const modes = [
  {
    href: "/app/focus",
    icon: <IconFocus />,
    name: "Focus",
    nameJa: "集中する",
    description: "深く集中する時間をつくる",
    available: true,
  },
  {
    href: "/app/relax",
    icon: <IconRelax />,
    name: "Relax",
    nameJa: "リラックスする",
    description: "呼吸を整え、脳のゴミを排出する時間",
    available: true,
  },
  {
    href: "/app/spark",
    icon: <IconSpark />,
    name: "Spark",
    nameJa: "アイデアを爆発させる",
    description: "思考をかき混ぜてクリエイティブを生む",
    available: true,
  },
  {
    href: "/app/reclaim",
    icon: <IconReclaim />,
    name: "Reclaim",
    nameJa: "感性を取り戻す",
    description: "感性のメンテナンスをする",
    available: true,
  },
];

export default function AppHome() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-5 pt-4">

      {/* 今日のルーティン */}
      <div className="w-full max-w-sm">
        <TodayRoutine />
      </div>

      {/* 灯台アニメーション + キャッチコピー + 波 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative w-full flex flex-col items-center"
      >
        <Lighthouse />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-center mt-6"
        >
          <p className="text-[#e8e6e1] text-xl font-light tracking-[0.2em] mb-2">
            感性を、取り戻す。
          </p>
          <p className="text-[#e8e6e1]/50 text-sm font-light tracking-wider leading-relaxed">
            つくる人の、集中とひらめきのアプリ
          </p>
        </motion.div>

        <div className="relative w-full h-40 -mt-7">
          <Waves />
        </div>
      </motion.div>

      {/* すべてのモード */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-sm mt-4"
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
                <Link
                  href={mode.href}
                  className="group flex items-center gap-4 border border-white/10 px-5 py-4 hover:border-white/25 hover:bg-white/[0.02] transition-all duration-300"
                >
                  <span className="w-6 shrink-0 opacity-60 group-hover:opacity-90 transition-opacity duration-300">
                    {mode.icon}
                  </span>
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
                <div className="flex items-center gap-4 border border-white/[0.06] px-5 py-4 opacity-40">
                  <span className="w-6 shrink-0">
                    {mode.icon}
                  </span>
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

        {/* BASEへのリンク + HPに戻る */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-10 mb-4 text-center flex flex-col items-center gap-3"
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
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[#e8e6e1]/20 text-xs font-light tracking-wider hover:text-[#e8e6e1]/45 transition-colors duration-300"
          >
            ← HPに戻る
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}
