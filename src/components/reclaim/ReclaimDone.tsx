"use client";

// Reclaim 完了画面
// 灯台（遅い回転）+ 感性スナップショット + あなたの言葉（senseResponseのみ）
// + ひとこと入力（任意）
// 珈琲補充提案は絶対に出さない

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useHistoryStore } from "@/store/historyStore";
import ReclaimSnapshot from "./ReclaimSnapshot";
import type { FeelResult } from "./ReclaimFeel";
import nameData from "@/data/reclaimNamePrompts.json";
import { playClick } from "@/lib/playSound";

type Props = {
  senseResponse: string;
  feelResults: FeelResult[];
  onRestart: () => void;
};

export default function ReclaimDone({
  senseResponse,
  feelResults,
  onRestart,
}: Props) {
  const { addSession } = useHistoryStore();
  const [doneResponse, setDoneResponse] = useState("");

  useEffect(() => {
    addSession({ type: "reclaim", duration: 0 });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // close.messages からランダム1つ
  const closeMessage = useMemo(() => {
    const messages = nameData.close.messages as string[];
    return messages[Math.floor(Math.random() * messages.length)];
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9 }}
      className="fixed inset-0 bg-[#0e0e0e] flex flex-col overflow-y-auto"
    >
      <div className="max-w-sm mx-auto w-full px-6 pt-28 pb-24 flex flex-col gap-8">

        {/* タイトル */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              className="text-[#1D9E75]/60" stroke="currentColor"
              strokeWidth="1.2" strokeLinecap="round">
              <path d="M12 12 C12 10 14 8 16 10 C18 12 16 16 12 16 C8 16 5 12 7 8 C9 4 15 3 19 7 C22 10 21 17 17 20" />
            </svg>
            <p className="text-[#1D9E75]/60 text-xs font-light tracking-[0.4em]">Reclaim</p>
          </div>
        </div>

        {/* 感性スナップショット */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em] mb-3">
            今日のスナップショット
          </p>
          <ReclaimSnapshot feelResults={feelResults} />
        </motion.div>

        {/* あなたの言葉（senseResponseのみ） */}
        {senseResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="border-t border-white/8 pt-6"
          >
            <p className="text-[#e8e6e1]/25 text-[10px] font-light tracking-[0.3em] mb-3">
              あなたの言葉
            </p>
            <p className="text-[#e8e6e1]/60 text-sm font-light leading-relaxed">
              「{senseResponse}」
            </p>
          </motion.div>
        )}

        {/* 締めの言葉 + ひとこと入力 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="border-t border-white/8 pt-6 flex flex-col gap-5"
        >
          <p className="text-[#e8e6e1]/40 text-sm font-light leading-[2]">
            {closeMessage}
          </p>

          {/* ひとこと入力（任意） */}
          <input
            type="text"
            value={doneResponse}
            onChange={(e) => setDoneResponse(e.target.value)}
            className="w-full bg-transparent border border-white/10 px-4 py-3.5 text-[#e8e6e1]/80 text-sm font-light placeholder-[#e8e6e1]/25 focus:outline-none focus:border-white/25 transition-colors duration-200"
            placeholder="今日の感性に、ひとこと"
          />
        </motion.div>

        {/* ボタン */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="flex flex-col gap-3"
        >
          <button
            onClick={() => { playClick(); onRestart(); }}
            className="w-full py-3.5 border border-white/10 text-[#e8e6e1]/35 text-sm font-light tracking-wider hover:border-white/20 hover:text-[#e8e6e1]/60 transition-all duration-300"
          >
            もう一度 Reclaim
          </button>

          <Link
            href="/app"
            className="text-center text-[#e8e6e1]/25 text-sm font-light tracking-wider hover:text-[#e8e6e1]/55 transition-colors duration-300 py-2"
          >
            ← ホームに戻る
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
