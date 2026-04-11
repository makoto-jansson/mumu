"use client";

// 「整える」セクション — Webアプリの紹介
// カード型レイアウト + 細線イラスト

import { motion } from "framer-motion";
import Link from "next/link";

// 細線イラスト: 整いそうな夜明けの風景（山 + 地平線 + 海 + 月 + 星）
function IllustTools() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      {/* 月 */}
      <circle cx="62" cy="11" r="5.5" stroke="#e8e6e1" strokeWidth="0.8" opacity="0.42" />
      <circle cx="64.5" cy="9.5" r="4.2" fill="#0d0d0d" />

      {/* 星 */}
      <circle cx="8"  cy="7"  r="0.8" fill="#e8e6e1" opacity="0.28" />
      <circle cx="20" cy="4"  r="0.6" fill="#e8e6e1" opacity="0.2" />
      <circle cx="34" cy="9"  r="0.7" fill="#e8e6e1" opacity="0.22" />
      <circle cx="48" cy="5"  r="0.6" fill="#e8e6e1" opacity="0.18" />
      <circle cx="74" cy="14" r="0.6" fill="#e8e6e1" opacity="0.2" />

      {/* 遠くの山のシルエット */}
      <path d="M0 36 L10 22 L18 30 L28 14 L38 26 L50 16 L62 28 L72 18 L80 24 L80 36 Z"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round" opacity="0.2" />

      {/* 地平線 */}
      <line x1="0" y1="36" x2="80" y2="36" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35" />

      {/* 海の波（3本） */}
      <path d="M0 40 C13 38 27 42 40 40 C53 38 67 42 80 40"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
      <path d="M0 44 C10 42 22 46 38 44 C54 42 66 46 80 44"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.13" />
      <path d="M0 49 C15 47 32 51 50 49 C64 47 72 50 80 49"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.08" />

      {/* 月の水面への反射 */}
      <line x1="60" y1="37" x2="58" y2="50" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />
      <line x1="62" y1="37" x2="62" y2="52" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />
      <line x1="64" y1="37" x2="66" y2="50" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />
    </svg>
  );
}

export default function ToolsSection() {
  return (
    <section className="py-20 px-5 bg-[#0a0a0a]">
      <div className="max-w-sm mx-auto md:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.45em] mb-6">
            ── 整える ──
          </p>

          <Link
            href="/app"
            className="group block border border-white/8 hover:border-white/18 transition-all duration-400 bg-[#0d0d0d] hover:bg-[#0f0f0f]"
          >
            <div className="px-6 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-5">
              {/* イラスト（PCでは左固定） */}
              <div className="shrink-0 md:w-28 flex justify-start">
                <IllustTools />
              </div>

              {/* テキスト + CTA */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#e8e6e1]/85 text-xl font-light leading-relaxed tracking-wide">
                    集中。リラックス。<br />
                    アイデアの爆発。感性の回復。
                  </h2>
                  <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
                    珈琲のある時間をつくる、4つのモード。
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#e8e6e1]/35 text-xs font-light tracking-wider group-hover:text-[#e8e6e1]/60 transition-colors duration-300">
                  アプリを使ってみる
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
