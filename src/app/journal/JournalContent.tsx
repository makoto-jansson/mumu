"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type JournalItem = { id: string; date: string; title: string };

export default function JournalContent({
  posts = [],
}: {
  posts?: JournalItem[];
}) {
  return (
    // 地色(bg-base)は敷かない — 背景の紙テクスチャ(PaperBackdrop)を透かすため
    <div className="min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="text-ink-secondary/70 text-sm font-light tracking-wider hover:text-ink-primary transition-colors duration-300 inline-flex items-center gap-2"
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
          <p className="text-grad-teal text-[10px] font-light tracking-[0.3em] mb-4">
            03
          </p>
          <p className="font-serif italic text-ink-secondary text-[11px] tracking-[0.2em] mb-6">
            — read
          </p>
          <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-loose tracking-wide">
            珈琲と感性にまつわる読み物。
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="border-t border-ink-primary/15"
        >
          {posts.length > 0 ? (
            <>
              {/* microCMS(blogs)の記事一覧 */}
              <div className="mb-16">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/journal/${p.id}`}
                    className="block py-7 border-b border-ink-primary/15 hover:bg-ink-primary/[0.03] transition-colors duration-300"
                  >
                    <p className="text-ink-secondary/60 text-[11px] tracking-[0.2em]">
                      {p.date}
                    </p>
                    <p className="font-mincho text-ink-primary text-lg mt-1.5 leading-relaxed">
                      {p.title}
                    </p>
                  </Link>
                ))}
              </div>
              <a
                href="https://note.com/mumu_coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-secondary text-sm font-light tracking-wider group hover:text-ink-primary transition-colors duration-300 relative"
              >
                noteでも綴っています
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-lime group-hover:w-full transition-all duration-300" />
              </a>
            </>
          ) : (
            <div className="pt-16">
              <p className="text-ink-secondary text-sm font-light leading-relaxed mb-2">
                記事はまだありません。
              </p>
              <p className="text-ink-secondary/80 text-sm font-light leading-relaxed mb-10">
                noteでmumuのストーリーを読むことができます。
              </p>
              <a
                href="https://note.com/mumu_coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-ink-primary text-sm font-light tracking-wider group hover:text-ink-secondary transition-colors duration-300 relative"
              >
                noteで読む
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-lime group-hover:w-full transition-all duration-300" />
              </a>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
}
