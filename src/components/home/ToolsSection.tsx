"use client";

// 「整える」セクション — Webアプリの紹介
// Phase 2でアプリが完成するまで「Coming soon」を表示
// スクロールで画面に入った時にフェードイン（whileInView）

import { motion } from "framer-motion";

export default function ToolsSection() {
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
            ── 整える ──
          </p>

          <h2 className="text-[#e8e6e1] text-2xl md:text-3xl font-light leading-loose tracking-wide mb-6">
            集中。リラックス。
            <br />
            アイデアの爆発。感性の回復。
          </h2>

          <p className="text-[#e8e6e1]/60 text-base font-light leading-relaxed mb-12">
            珈琲のある時間をつくるツール。
          </p>

          {/* Coming soon バッジ（Phase 2でボタンに差し替える） */}
          <span className="inline-block border border-[#e8e6e1]/20 text-[#e8e6e1]/40 text-xs font-light tracking-[0.3em] px-6 py-3">
            Coming soon
          </span>
        </motion.div>
      </div>
    </section>
  );
}
