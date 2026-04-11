"use client";

// 「整える」セクション — Webアプリの紹介
// カード型レイアウト + 細線イラスト

import { motion } from "framer-motion";
import Link from "next/link";

// 細線イラスト: 4つのモードを抽象的に表現（集中の同心楕円・波・枝・螺旋）
function IllustTools() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      {/* Focus: 同心楕円 */}
      <ellipse cx="16" cy="20" rx="6" ry="4" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.4" transform="rotate(15 16 20)" />
      <ellipse cx="16" cy="20" rx="11" ry="7" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.2" transform="rotate(-10 16 20)" />
      <circle cx="16" cy="20" r="1.2" fill="#e8e6e1" opacity="0.5" />

      {/* Relax: 波線 */}
      <path d="M28 16 C32 13 36 19 40 16 C44 13 48 19 52 16"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M28 20 C32 17 36 23 40 20 C44 17 48 23 52 20"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />

      {/* Spark: 枝分かれ */}
      <line x1="66" y1="28" x2="66" y2="10" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <line x1="66" y1="10" x2="62" y2="6" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.35" />
      <line x1="66" y1="10" x2="70" y2="6" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.35" />
      <line x1="65" y1="15" x2="61" y2="20" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
      <line x1="67" y1="15" x2="71" y2="20" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
      <circle cx="66" cy="28" r="1" fill="#e8e6e1" opacity="0.5" />

      {/* Reclaim: 螺旋 */}
      <path d="M16 42 C16 40 18 38 20 40 C22 42 20 46 16 46 C12 46 9 42 11 38 C13 34 19 33 23 37"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

      {/* 地平線 */}
      <line x1="0" y1="52" x2="80" y2="52" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.15" />
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
            <div className="px-6 pt-8 pb-6 flex flex-col gap-5">
              <IllustTools />

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
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
