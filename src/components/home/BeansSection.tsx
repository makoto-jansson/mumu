"use client";

// 「味わう」セクション — 珈琲豆の紹介
// /beans ページへのリンク

import { motion } from "framer-motion";
import Link from "next/link";

export default function BeansSection() {
  return (
    <section className="py-32 px-6 bg-[#0f0f0f]">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* セクションタイトル */}
          <p className="text-[#e8e6e1]/40 text-xs font-light tracking-[0.4em] mb-10">
            ── 味わう ──
          </p>

          <h2 className="text-[#e8e6e1] text-2xl md:text-3xl font-light leading-loose tracking-wide mb-6">
            スペシャルティコーヒーを、
            <br />
            ていねいに焙煎しています。
          </h2>

          {/* テキストリンク + 矢印（ミニマルなCTA） */}
          <Link
            href="/beans"
            className="inline-flex items-center gap-2 text-[#e8e6e1]/60 text-sm font-light tracking-wider group hover:text-[#e8e6e1] transition-colors duration-300 relative"
          >
            珈琲豆を見る
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            {/* hover時にアンダーライン */}
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
