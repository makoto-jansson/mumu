"use client";

// Spark Done — 完了画面

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHistoryStore } from "@/store/historyStore";
import type { KeptTheme } from "./SparkShuffle";
import type { MyGridResult } from "./SparkMyGrid";
import { playClick } from "@/lib/playSound";

type Props = {
  kept: KeptTheme[];
  myGrid: MyGridResult;
  sceneLabel: string;
  onRestart: () => void;
};

export default function SparkDone({ kept, myGrid, sceneLabel, onRestart }: Props) {
  const [starred, setStarred] = useState<Set<number>>(new Set());
  const [reflection, setReflection] = useState("");
  const { addSession } = useHistoryStore();

  useEffect(() => {
    addSession({ type: "focus", duration: 0, task: `Spark: ${sceneLabel}` });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleStar = (i: number) => {
    setStarred((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  // MyGrid の入力済みマス
  const myGridEntries = Object.entries(myGrid.cells).filter(([, v]) => v?.trim());

  const hasAnything = kept.length > 0 || myGridEntries.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0e0e0e] flex flex-col overflow-y-auto"
    >
      <div className="max-w-sm mx-auto w-full px-6 pt-16 pb-24 flex flex-col gap-8">

        {/* タイトル */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#a3a957]/70">
              <path d="M9 2L4 9h5l-2 5 7-8H9l2-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="text-[#a3a957]/60 text-xs font-light tracking-[0.4em]">Spark</p>
          </div>
          <h1 className="text-[#e8e6e1] text-2xl font-light tracking-wide mb-3">
            お疲れさまでした。
          </h1>
          <p className="text-[#e8e6e1]/50 text-sm font-light leading-[2]">
            アイデアは寝かせると育ちます。<br />
            明日もう一度読んでみてください。
          </p>
        </div>

        {/* キープしたテーマ */}
        {kept.length > 0 ? (
          <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
            <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.3em] mb-1">
              キープしたテーマ
            </p>
            {kept.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.07 }}
                className="flex items-start gap-3 border border-white/8 px-4 py-3.5"
              >
                <button
                  onClick={() => { playClick(); toggleStar(i); }}
                  className={`shrink-0 mt-0.5 text-base transition-colors duration-200 ${
                    starred.has(i) ? "text-[#a3a957]" : "text-white/15 hover:text-white/40"
                  }`}
                >
                  {starred.has(i) ? "★" : "☆"}
                </button>
                <div className="flex flex-col gap-1.5 min-w-0">
                  <p className="text-[#e8e6e1]/80 text-sm font-light">
                    {item.themeLabel}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {Object.values(item.keywords).slice(0, 5).map((kw, j) => (
                      <span key={j} className="text-[#e8e6e1]/30 text-[10px] font-light border border-white/8 px-1.5 py-0.5">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : null}

        {/* あなたの9マス */}
        {myGrid.theme && myGridEntries.length > 0 && (
          <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
            <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.3em] mb-1">
              あなたの9マス
            </p>
            <p className="text-[#e8e6e1]/50 text-xs font-light mb-2">
              テーマ: {myGrid.theme}
            </p>
            <div className="border border-white/8 divide-y divide-white/6">
              {myGridEntries.map(([cat, value]) => (
                <div key={cat} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-[#a3a957]/40 text-[10px] font-light tracking-wider shrink-0 w-12">
                    {cat === "adapt" ? "転用" :
                     cat === "apply" ? "応用" :
                     cat === "modify" ? "変更" :
                     cat === "magnify" ? "拡大" :
                     cat === "minify" ? "縮小" :
                     cat === "substitute" ? "代用" :
                     cat === "rearrange" ? "再配置" :
                     cat === "reverse" ? "逆転" : "結合"}
                  </span>
                  <p className="text-[#e8e6e1]/70 text-sm font-light">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 何もキープしていない場合 */}
        {!hasAnything && (
          <div className="border-t border-white/10 pt-6">
            <p className="text-[#e8e6e1]/30 text-sm font-light leading-[2]">
              今回はキープなし。<br />
              見ているだけでも頭は動いています。
            </p>
          </div>
        )}

        {/* ふりかえり（任意）*/}
        <div className="flex flex-col gap-2">
          <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em]">
            ふりかえり（任意）
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="気づいたことをメモ..."
            rows={3}
            className="w-full bg-transparent border border-white/8 px-4 py-3 text-[#e8e6e1]/70 text-sm font-light placeholder-[#e8e6e1]/15 focus:outline-none focus:border-white/20 resize-none transition-colors duration-200"
          />
        </div>

        {/* もう一度 Spark */}
        <button
          onClick={() => { playClick(); onRestart(); }}
          className="w-full py-3.5 border border-white/12 text-[#e8e6e1]/40 text-sm font-light tracking-wider hover:border-white/25 hover:text-[#e8e6e1]/70 transition-all duration-300"
        >
          もう一度 Spark
        </button>

        {/* 珈琲でリラックス（常時表示）*/}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="border-t border-white/8 pt-6 flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <p className="text-[#e8e6e1]/50 text-sm font-light leading-[1.9]">
              アイデアを出したあとは、少し頭を休めましょう。
            </p>
            <p className="text-[#e8e6e1]/30 text-sm font-light leading-[1.9]">
              珈琲を一杯いれて、ゆっくりと。
            </p>
          </div>

          <motion.a
            href="https://mumucoffee.theshop.jp/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between border border-[#a3a957]/20 bg-[#a3a957]/4 px-5 py-4 hover:bg-[#a3a957]/10 hover:border-[#a3a957]/40 transition-all duration-300 group"
          >
            <div className="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                className="shrink-0 text-[#a3a957]/50 group-hover:text-[#a3a957]/80 transition-colors duration-300"
                stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <ellipse cx="10" cy="10" rx="6" ry="4" transform="rotate(-30 10 10)" />
                <path d="M5 12.5 C7 10.5 13 9.5 15 7.5" />
              </svg>
              <div>
                <p className="text-[#a3a957]/70 text-sm font-light group-hover:text-[#a3a957]/90 transition-colors duration-300">
                  mumuの珈琲豆を見る
                </p>
                <p className="text-[#a3a957]/35 text-[10px] font-light tracking-wider mt-0.5">
                  BASE SHOP
                </p>
              </div>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              className="text-[#a3a957]/30 group-hover:text-[#a3a957]/60 transition-colors duration-300">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.a>
        </motion.div>

        <Link
          href="/app"
          className="text-center text-[#e8e6e1]/30 text-sm font-light tracking-wider hover:text-[#e8e6e1]/60 transition-colors duration-300 mt-2"
        >
          ← ホームに戻る
        </Link>
      </div>
    </motion.div>
  );
}
