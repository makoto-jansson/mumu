"use client";

// 「読む」セクション — 読み物コンテンツの紹介
// カード型レイアウト + 細線イラスト

import { motion } from "framer-motion";
import Link from "next/link";

// 細線イラスト: 開いた本 + 文字線 + 月
function IllustJournal() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      {/* 月（右上） */}
      <circle cx="68" cy="10" r="5" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.4" />
      <circle cx="70" cy="8.5" r="3.8" fill="#0c0c0c" />

      {/* 本の背表紙（中央） */}
      <line x1="40" y1="20" x2="40" y2="50" stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

      {/* 左ページ */}
      <path d="M40 20 C30 22 18 20 12 24 L12 50 C18 46 30 48 40 50 Z"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round" opacity="0.35" />
      {/* 左ページの文字線 */}
      <line x1="18" y1="30" x2="36" y2="29" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
      <line x1="17" y1="34" x2="35" y2="33" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.15" />
      <line x1="18" y1="38" x2="32" y2="37" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />
      <line x1="17" y1="42" x2="34" y2="41" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.1" />

      {/* 右ページ */}
      <path d="M40 20 C50 22 62 20 68 24 L68 50 C62 46 50 48 40 50 Z"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round" opacity="0.3" />
      {/* 右ページの文字線 */}
      <line x1="44" y1="30" x2="62" y2="29" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.18" />
      <line x1="45" y1="34" x2="63" y2="33" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.12" />
      <line x1="44" y1="38" x2="58" y2="37" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" opacity="0.1" />

      {/* 星 */}
      <circle cx="14" cy="10" r="0.8" fill="#e8e6e1" opacity="0.3" />
      <circle cx="24" cy="6"  r="0.6" fill="#e8e6e1" opacity="0.2" />
      <circle cx="52" cy="8"  r="0.7" fill="#e8e6e1" opacity="0.25" />
    </svg>
  );
}

export default function JournalSection() {
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
            ── 読む ──
          </p>

          <Link
            href="/journal"
            className="group block border border-white/8 hover:border-white/18 transition-all duration-400 bg-[#0d0d0d] hover:bg-[#0f0f0f]"
          >
            <div className="px-6 md:px-12 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-5">
              <div className="shrink-0 md:w-28 flex justify-start">
                <IllustJournal />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h2 className="text-[#e8e6e1]/85 text-xl font-light leading-relaxed tracking-wide">
                    珈琲と感性にまつわる、<br />
                    読み物。
                  </h2>
                  <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
                    焙煎、集中、創造性。思考の余白になる文章を。
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[#e8e6e1]/35 text-xs font-light tracking-wider group-hover:text-[#e8e6e1]/60 transition-colors duration-300">
                  読み物を見る
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
