"use client";

// セッション終了画面
// - 合計セット数・時間
// - ふりかえりメモ（任意）
// - 2セット以上で珈琲補充の提案

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHistoryStore } from "@/store/historyStore";

type Props = {
  sets: number;
  totalMinutes: number;
  task: string;
};

function getEndMessage(minutes: number): string {
  if (minutes <= 15) return "よく集中できていましたよ。小さな波も、積み重なれば遠くまで届きます。";
  if (minutes <= 45) return "波が穏やかでした。いい航海でしたね。";
  return "長い航海でした。霧が晴れて、遠くまで見渡せます。";
}

export default function SessionSummary({ sets, totalMinutes, task }: Props) {
  const [reflection, setReflection] = useState("");
  const endMessage = getEndMessage(totalMinutes);
  const { addSession, markCoffeeRecommendShown, shouldShowCoffeeRecommend } = useHistoryStore();
  const showCoffee = shouldShowCoffeeRecommend();

  useEffect(() => {
    addSession({ type: "focus", duration: totalMinutes, task, sets });
    if (showCoffee) markCoffeeRecommendShown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[30] bg-[#0a0a0a] flex flex-col px-6 pt-16 pb-24 overflow-y-auto"
    >
      <div className="max-w-sm mx-auto w-full flex flex-col gap-8">

        {/* タイトル */}
        <div>
          <p className="text-[#EF9F27]/60 text-xs font-light tracking-[0.4em] mb-3">
            ☀ Focus
          </p>
          <h1 className="text-[#e8e6e1] text-2xl font-light tracking-wide mb-4">
            今日の集中
          </h1>
          <p className="text-[#e8e6e1]/50 text-sm font-light leading-relaxed">
            {endMessage}
          </p>
        </div>

        {/* サマリー */}
        <div className="border-t border-white/10 pt-6 flex flex-col gap-3">
          <div className="flex justify-between items-baseline">
            <span className="text-[#e8e6e1]/50 text-sm font-light tracking-wider">セッション</span>
            <span className="text-[#e8e6e1] text-lg font-light tabular-nums">{sets}セット</span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-[#e8e6e1]/50 text-sm font-light tracking-wider">合計時間</span>
            <span className="text-[#e8e6e1] text-lg font-light tabular-nums">{totalMinutes}分</span>
          </div>
          {task && (
            <div className="flex justify-between items-baseline">
              <span className="text-[#e8e6e1]/50 text-sm font-light tracking-wider">やったこと</span>
              <span className="text-[#e8e6e1]/70 text-sm font-light max-w-[60%] text-right">{task}</span>
            </div>
          )}
        </div>

        {/* ふりかえりメモ */}
        <div>
          <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em] mb-3">
            ふりかえり（任意）
          </p>
          <textarea
            value={reflection}
            onChange={(e) => setReflection(e.target.value)}
            placeholder="今日の集中で気づいたことを..."
            rows={3}
            className="w-full bg-transparent border border-white/10 px-4 py-3 text-[#e8e6e1] text-sm font-light placeholder-[#e8e6e1]/20 focus:outline-none focus:border-white/25 transition-colors duration-200 resize-none leading-relaxed"
          />
        </div>

        {/* 珈琲補充の提案（前回表示から7日以上経過時のみ） */}
        {showCoffee && <motion.a
          href="https://mumucoffee.theshop.jp/"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex items-start gap-4 border border-[#EF9F27]/20 bg-[#EF9F27]/5 px-5 py-4 hover:bg-[#EF9F27]/10 hover:border-[#EF9F27]/35 transition-all duration-300 group"
        >
          {/* 珈琲豆アイコン */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" className="shrink-0 mt-0.5 text-[#EF9F27]/60 group-hover:text-[#EF9F27] transition-colors duration-300" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
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
        </motion.a>}

        {/* ホームに戻る */}
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
