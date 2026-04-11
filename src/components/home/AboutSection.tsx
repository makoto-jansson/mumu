"use client";

// 「mumuについて」セクション
// カード型レイアウト + 細線イラスト

import { motion } from "framer-motion";
import Link from "next/link";

// 細線イラスト: 灯台 + 光 + 海
function IllustAbout() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      {/* 星 */}
      <circle cx="10" cy="8"  r="0.8" fill="#e8e6e1" opacity="0.3" />
      <circle cx="28" cy="5"  r="0.6" fill="#e8e6e1" opacity="0.2" />
      <circle cx="55" cy="10" r="0.7" fill="#e8e6e1" opacity="0.25" />
      <circle cx="72" cy="6"  r="0.8" fill="#e8e6e1" opacity="0.2" />

      {/* 灯台の塔 */}
      <path d="M36 44 L38 14 L42 14 L44 44 Z"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round" opacity="0.45" />
      {/* 灯台の灯室 */}
      <rect x="37" y="10" width="6" height="5" rx="0.5"
        stroke="#e8e6e1" strokeWidth="0.7" opacity="0.5" />
      {/* 灯室の光源 */}
      <circle cx="40" cy="12.5" r="1.2" fill="#e8e6e1" opacity="0.5" />
      {/* 灯台の基部 */}
      <path d="M32 44 L48 44" stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

      {/* 光線（左） */}
      <path d="M37 12 L8 28" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
      <path d="M37 12 L12 22" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" opacity="0.12" />
      {/* 光線（右） */}
      <path d="M43 12 L72 28" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
      <path d="M43 12 L68 22" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" opacity="0.12" />

      {/* 地平線 */}
      <line x1="0" y1="44" x2="80" y2="44" stroke="#e8e6e1" strokeWidth="0.6" opacity="0.3" />

      {/* 海の波 */}
      <path d="M0 48 C13 46 27 50 40 48 C53 46 67 50 80 48"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />
      <path d="M0 52 C10 50 25 54 45 52 C60 50 70 53 80 52"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />

      {/* 光の水面反射 */}
      <line x1="38" y1="45" x2="36" y2="54" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.15" />
      <line x1="40" y1="45" x2="40" y2="56" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" />
      <line x1="42" y1="45" x2="44" y2="54" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.15" />
    </svg>
  );
}

export default function AboutSection() {
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
            ── mumuについて ──
          </p>

          <Link
            href="/about"
            className="group block border border-white/8 hover:border-white/18 transition-all duration-400 bg-[#0e0e0e] hover:bg-[#101010]"
          >
            <div className="px-6 md:px-12 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-5">
              <div className="shrink-0 md:w-28 flex justify-start">
                <IllustAbout />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#e8e6e1]/85 text-xl font-light leading-relaxed tracking-wide">
                    感性が、ふと、<br />
                    戻ってくるような珈琲を届けたい。
                  </h2>
                  <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
                    灯台の珈琲焙煎所mumu。なぜ、つくるのか。
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#EF9F27]/60 text-xs font-light tracking-wider group-hover:text-[#EF9F27] transition-colors duration-300">
                  ストーリーを読む
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
