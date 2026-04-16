"use client";

// Spark ガイド画面 — オズボーン説明 + 操作説明

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepBar, { SPARK_STEPS } from "@/components/focus/StepBar";
import { playClick } from "@/lib/playSound";

const OSBORNE_CELLS = [
  { label: "転用",   question: "他に使い道は？",         color: "text-amber-400/60"  },
  { label: "応用",   question: "似たものはある？",        color: "text-teal-300/60"   },
  { label: "変更",   question: "変えてみたら？",          color: "text-sky-400/60"    },
  { label: "拡大",   question: "大きくしたら？",          color: "text-orange-300/60" },
  { label: "縮小",   question: "小さくしたら？",          color: "text-violet-400/60" },
  { label: "代用",   question: "他のもので置き換えたら？", color: "text-pink-400/60"   },
  { label: "再配置", question: "並べ替えたら？",          color: "text-lime-400/60"   },
  { label: "逆転",   question: "逆にしたら？",            color: "text-rose-400/60"   },
  { label: "結合",   question: "組み合わせたら？",        color: "text-cyan-400/60"   },
];

const HOW_TO = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="8" y="8" width="12" height="12" rx="1" stroke="#EF9F27" strokeWidth="1.4" />
        <path d="M14 10v8M10 14h8" stroke="#EF9F27" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 1.5" />
      </svg>
    ),
    title: "マスをタップ — 裏返す",
    desc: "表はカテゴリ名のみ。タップするとキーワードが現れる。気になるマスだけ開いてみよう。",
    accent: "text-[#EF9F27]/80",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M6 14h16M16 8l6 6-6 6" stroke="#4ade80" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "右スワイプ — テーマをキープ",
    desc: "気になったテーマごとキープ。あとで「あなたの9マス」で使える。",
    accent: "text-[#4ade80]/80",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M22 14H6M12 8L6 14l6 6" stroke="#f87171" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "左スワイプ — パス",
    desc: "ピンとこなければ流してOK。次のテーマへ。",
    accent: "text-[#f87171]/80",
  },
];

type Props = {
  onStart: () => void;
};

export default function SparkGuide({ onStart }: Props) {
  const [page, setPage] = useState<"concept" | "howto">("concept");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-y-auto"
    >
      <StepBar steps={SPARK_STEPS} current="setup" />

      <div className="max-w-sm mx-auto w-full px-6 pt-6 pb-24 flex flex-col gap-6">

        {/* タイトル */}
        <div className="flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[#EF9F27]/60">
            <path d="M9 2L4 9h5l-2 5 7-8H9l2-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-[#EF9F27]/60 text-xs font-light tracking-[0.4em]">Spark</p>
        </div>

        {/* タブ */}
        <div className="flex border-b border-white/8">
          {(["concept", "howto"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => { playClick(); setPage(tab); }}
              className={`flex-1 pb-2.5 text-xs font-light tracking-wider transition-colors duration-200 ${
                page === tab
                  ? "text-[#EF9F27]/80 border-b border-[#EF9F27]/50 -mb-px"
                  : "text-[#e8e6e1]/25 hover:text-[#e8e6e1]/50"
              }`}
            >
              {tab === "concept" ? "オズボーンとは" : "操作ガイド"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {page === "concept" && (
            <motion.div
              key="concept"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-[#e8e6e1] text-lg font-light tracking-wide">
                  9つの視点で強制発想
                </h2>
                <p className="text-[#e8e6e1]/50 text-sm font-light leading-[1.9]">
                  オズボーンのチェックリストは、あらゆるテーマに9つの切り口を当てることでアイデアを強制的に広げる思考法です。
                </p>
                <p className="text-[#e8e6e1]/35 text-sm font-light leading-[1.9]">
                  「逆にしたら？」「組み合わせたら？」——
                  普段使わない角度から問いを立てると、思考の枠が外れます。
                </p>
              </div>

              {/* 9マスプレビュー */}
              <div>
                <p className="text-[#e8e6e1]/20 text-[10px] font-light tracking-[0.3em] mb-3">9つの視点</p>
                <div className="grid grid-cols-3 gap-px bg-white/6">
                  {OSBORNE_CELLS.map((cell) => (
                    <div key={cell.label} className="bg-[#141414] flex flex-col items-center justify-center px-2 py-3 gap-1.5">
                      <span className={`text-[10px] font-light tracking-wider ${cell.color}`}>{cell.label}</span>
                      <span className="text-[9px] text-[#e8e6e1]/20 font-light text-center leading-snug">{cell.question}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-white/6 px-4 py-4">
                <p className="text-[#e8e6e1]/30 text-[11px] font-light leading-[1.9]">
                  深く考えなくていい。<br />
                  「なんかおもしろい」と感じたら、それがサインです。
                </p>
              </div>

              <button
                onClick={() => { playClick(); setPage("howto"); }}
                className="text-right text-[#EF9F27]/40 text-xs font-light tracking-wider hover:text-[#EF9F27]/70 transition-colors"
              >
                操作ガイドを見る →
              </button>
            </motion.div>
          )}

          {page === "howto" && (
            <motion.div
              key="howto"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-3">
                <h2 className="text-[#e8e6e1] text-lg font-light tracking-wide">カードの使い方</h2>
                <p className="text-[#e8e6e1]/35 text-sm font-light leading-[1.9]">
                  1枚のカードにテーマと9マスが表示されます。最初は表面（カテゴリ名）だけが見えていて、タップすると裏返ってキーワードが現れます。
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {HOW_TO.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-4 border border-white/6 px-4 py-4"
                  >
                    <div className="shrink-0 mt-0.5">{item.icon}</div>
                    <div>
                      <p className={`text-sm font-light mb-1 ${item.accent}`}>{item.title}</p>
                      <p className="text-[#e8e6e1]/35 text-xs font-light leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="border border-[#EF9F27]/12 bg-[#EF9F27]/3 px-4 py-4">
                <p className="text-[#EF9F27]/55 text-[11px] font-light leading-[1.9]">
                  全部開かなくていい。気になるマスだけ覗いて、ピンときたらキープ。<br />
                  テンポよく流していくのがコツです。
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 開始ボタン */}
        <motion.button
          onClick={() => { playClick(); onStart(); }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full py-4 border border-[#EF9F27]/40 text-[#EF9F27]/80 text-sm font-light tracking-wider hover:bg-[#EF9F27]/10 hover:border-[#EF9F27]/60 transition-all duration-300 flex items-center justify-center gap-2"
        >
          カードをはじめる
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="opacity-70">
            <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
}
