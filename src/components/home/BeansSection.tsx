"use client";

// 「味わう」セクション — 珈琲豆の紹介
// カード型レイアウト + 細線イラスト

import { motion } from "framer-motion";
import Link from "next/link";

// 細線イラスト: カップ + 湯気 + 豆
function IllustBeans() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      {/* 豆（左） */}
      <ellipse cx="12" cy="38" rx="5" ry="7" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.35" transform="rotate(-15 12 38)" />
      <path d="M9 33 C12 38 9 43 12 45" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.25" transform="rotate(-15 12 38)" />

      {/* カップ本体 */}
      <path d="M28 30 L30 50 L52 50 L54 30 Z"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinejoin="round" opacity="0.45" />
      {/* カップの縁 */}
      <line x1="27" y1="30" x2="55" y2="30" stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      {/* ハンドル */}
      <path d="M54 36 C60 36 62 42 56 44"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      {/* ソーサー */}
      <path d="M23 52 C26 50 56 50 59 52"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />

      {/* 湯気（3本） */}
      <path d="M36 26 C36 22 38 20 37 16"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
      <path d="M41 24 C41 20 43 18 42 13"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
      <path d="M46 26 C46 22 48 20 47 16"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.16" />

      {/* 豆（右） */}
      <ellipse cx="68" cy="36" rx="5" ry="7" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.3" transform="rotate(20 68 36)" />
      <path d="M65 31 C68 36 65 41 68 43" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" transform="rotate(20 68 36)" />

      {/* 地平線 */}
      <line x1="0" y1="52" x2="80" y2="52" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

export default function BeansSection() {
  return (
    <section className="py-20 px-5 bg-[#0c0c0c]">
      <div className="max-w-sm mx-auto md:max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.45em] mb-6">
            ── 珈琲 ──
          </p>

          <Link
            href="/beans"
            className="group block border border-white/8 hover:border-white/18 transition-all duration-400 bg-[#0e0e0e] hover:bg-[#101010]"
          >
            <div className="px-6 md:px-12 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-5">
              <div className="shrink-0 md:w-28 flex justify-start">
                <IllustBeans />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#e8e6e1]/85 text-xl font-light leading-relaxed tracking-wide">
                    スペシャルティコーヒーを、<br />
                    ていねいに焙煎しています。
                  </h2>
                  <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
                    産地・焙煎度・風味。一杯の物語を届けたい。
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#e8e6e1]/35 text-xs font-light tracking-wider group-hover:text-[#e8e6e1]/60 transition-colors duration-300">
                  珈琲豆を見る
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
