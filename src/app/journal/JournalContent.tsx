"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function JournalContent() {
  return (
    <div className="min-h-screen bg-[#f7f9f7] pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="text-[#1a1a1a]/40 text-sm font-light tracking-wider hover:text-[#1a1a1a] transition-colors duration-300 inline-flex items-center gap-2"
          >
            <span>←</span> ホームに戻る
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-[#1a1a1a]/40 text-xs font-light tracking-[0.4em] mb-6">
            読む
          </p>
          <h1 className="text-[#1a1a1a] text-2xl md:text-3xl font-light leading-loose tracking-wide">
            珈琲と感性にまつわる読み物。
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="border-t border-black/10 pt-16"
        >
          <p className="text-[#1a1a1a]/50 text-sm font-light leading-relaxed mb-2">
            記事はまだありません。
          </p>
          <p className="text-[#1a1a1a]/40 text-sm font-light leading-relaxed mb-10">
            noteでmumuのストーリーを読むことができます。
          </p>
          <a
            href="https://note.com/mumu_coffee"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[#1a1a1a]/60 text-sm font-light tracking-wider group hover:text-[#1a1a1a] transition-colors duration-300 relative"
          >
            noteで読む
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
          </a>
        </motion.div>

      </div>
    </div>
  );
}
