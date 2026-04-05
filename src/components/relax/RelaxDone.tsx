"use client";

// Relax完了画面
// 日替わりの一言 + 音楽・お菓子のペアリング提案

import { useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getDailyPrompt } from "@/lib/getDailyPrompt";
import { getPairing } from "@/lib/getPairing";
import { useHistoryStore } from "@/store/historyStore";
import type { RelaxConfig } from "./RelaxSetup";

// Spotify ロゴ（ミニマル SVG）
function IconSpotify() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1" fill="none" />
      <path d="M5 10.2 C6.8 9.4 9.2 9.3 11 10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M4.5 8.0 C6.8 7.0 9.8 6.9 11.5 7.8" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M4 5.8 C6.8 4.6 10.2 4.5 12 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

type Props = { mood: RelaxConfig["mood"]; duration: number };

export default function RelaxDone({ mood, duration }: Props) {
  const pairing = getPairing(mood);
  const prompt  = getDailyPrompt();
  const { addSession, markCoffeeRecommendShown, shouldShowCoffeeRecommend } = useHistoryStore();
  const showCoffee = shouldShowCoffeeRecommend();

  useEffect(() => {
    addSession({ type: "relax", duration, mood });
    if (showCoffee) markCoffeeRecommendShown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col px-6 pt-16 pb-24 overflow-y-auto"
    >
      <div className="max-w-sm mx-auto w-full flex flex-col gap-8">

        {/* タイトル */}
        <div>
          <p className="text-[#EF9F27]/60 text-xs font-light tracking-[0.4em] mb-3">
            ☽ Slow drip
          </p>
          <h1 className="text-[#e8e6e1] text-2xl font-light tracking-wide mb-4">
            お疲れさまでした。
          </h1>
          <p className="text-[#e8e6e1]/50 text-sm font-light leading-[2]">
            {prompt}
          </p>
        </div>

        {/* ペアリング */}
        <div className="border-t border-white/8 pt-6 flex flex-col gap-3">
          <p className="text-[#e8e6e1]/30 text-xs font-light tracking-[0.3em] mb-1">
            今日のペアリング
          </p>

          {/* 音楽 */}
          <a
            href={pairing.music.spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 border border-white/8 px-4 py-3 hover:border-white/20 hover:bg-white/3 transition-all duration-300 group"
          >
            <span className="text-[#e8e6e1]/40 group-hover:text-[#e8e6e1]/70 transition-colors duration-300 shrink-0">
              <IconSpotify />
            </span>
            <div>
              <p className="text-[#e8e6e1]/70 text-xs font-light tracking-wider mb-0.5">音楽</p>
              <p className="text-[#e8e6e1]/50 text-sm font-light">{pairing.music.title} — {pairing.music.artist} →</p>
            </div>
          </a>

          {/* お菓子 */}
          <div className="flex items-center gap-3 border border-white/8 px-4 py-3">
            <span className="text-[#e8e6e1]/25 text-base shrink-0">◇</span>
            <div>
              <p className="text-[#e8e6e1]/70 text-xs font-light tracking-wider mb-0.5">お菓子</p>
              <p className="text-[#e8e6e1]/50 text-sm font-light">{pairing.snack}</p>
            </div>
          </div>

          {/* 珈琲豆レコメンド（前回表示から7日以上経過時のみ） */}
          {showCoffee && <a
            href="https://mumucoffee.theshop.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 border border-[#EF9F27]/20 bg-[#EF9F27]/5 px-5 py-4 hover:bg-[#EF9F27]/10 hover:border-[#EF9F27]/35 transition-all duration-300 group"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none"
              className="shrink-0 mt-0.5 text-[#EF9F27]/60 group-hover:text-[#EF9F27] transition-colors duration-300"
              stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="11" cy="11" rx="7" ry="4.5" transform="rotate(-30 11 11)" />
              <path d="M5.5 14 C8 11.5 14 10.5 16.5 8" />
            </svg>
            <div>
              <p className="text-[#EF9F27]/80 text-sm font-light leading-relaxed mb-1">
                珈琲豆は足りていますか？
              </p>
              <span className="text-[#EF9F27]/50 text-xs font-light tracking-wider group-hover:text-[#EF9F27]/80 transition-colors duration-300">
                mumuの珈琲豆を見る →
              </span>
            </div>
          </a>}
        </div>

        {/* ホームへ */}
        <Link
          href="/app"
          className="text-center text-[#e8e6e1]/30 text-sm font-light tracking-wider hover:text-[#e8e6e1]/60 transition-colors duration-300 mt-4"
        >
          ← ホームに戻る
        </Link>

      </div>
    </motion.div>
  );
}
