"use client";

// 「読む」セクション — 読み物コンテンツの紹介
// /journal ページへのリンク

import { motion } from "framer-motion";
import Link from "next/link";

export default function JournalSection() {
  return (
    <section className="py-32 px-6 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* セクションタイトル */}
          <p className="text-[#e8e6e1]/40 text-xs font-light tracking-[0.4em] mb-10">
            ── 読む ──
          </p>

          <h2 className="text-[#e8e6e1] text-2xl md:text-3xl font-light leading-loose tracking-wide mb-6">
            珈琲と感性にまつわる読み物。
          </h2>

          {/* テキストリンク + 矢印 */}
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[#e8e6e1]/60 text-sm font-light tracking-wider group hover:text-[#e8e6e1] transition-colors duration-300 relative"
          >
            読み物を見る
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
