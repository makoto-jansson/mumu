"use client";

// Focusモード開始前画面
// ロールピッカーで時間を選択、タスク・BGMを設定して開始

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import RollerPicker from "./RollerPicker";
import StepBar, { FOCUS_STEPS } from "./StepBar";
import ButtonOrb from "@/components/animations/ButtonOrb";
import { playClick, preloadClick, playZyunnbi } from "@/lib/playSound";
import { useAudioStore } from "@/store/audioStore";

export type FocusConfig = {
  duration: number; // 5〜60の任意の分数
  task: string;
  ambient: "波" | "焚き火" | "カフェ" | "音楽";
};

// ─────────────────────────────────────────────────
// BGMアイコン（Endel / TE OP-1 風ミニマルSVG）
// ─────────────────────────────────────────────────
function IconWave() {
  return (
    <svg width="22" height="13" viewBox="0 0 22 13" fill="none"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d="M1 4 C3.5 1.5 5.5 1.5 8 4 C10.5 6.5 12.5 6.5 15 4 C17.5 1.5 19.5 1.5 21 4" />
      <path d="M1 9 C3.5 6.5 5.5 6.5 8 9 C10.5 11.5 12.5 11.5 15 9 C17.5 6.5 19.5 6.5 21 9" />
    </svg>
  );
}

function IconFire() {
  return (
    <svg width="12" height="16" viewBox="0 0 12 16" fill="none"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 1 C3.5 4 2 7 2 10 C2 12.5 3.8 14.5 6 14.5 C8.2 14.5 10 12.5 10 10 C10 7 8.5 4 6 1 Z" />
    </svg>
  );
}

function IconCafe() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3 L15 3 L13 12 L4 12 Z" />
      <path d="M15 5 C19 5 19 10 15 10" />
    </svg>
  );
}

function IconMusic() {
  return (
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none"
      stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
      <line x1="1.5"  y1="11" x2="1.5"  y2="8" />
      <line x1="4.5"  y1="13" x2="4.5"  y2="4" />
      <line x1="7.5"  y1="12" x2="7.5"  y2="2" />
      <line x1="10.5" y1="13" x2="10.5" y2="5" />
      <line x1="13.5" y1="11" x2="13.5" y2="8" />
    </svg>
  );
}


const AMBIENTS: { value: FocusConfig["ambient"]; Icon: () => React.ReactElement }[] = [
  { value: "波",    Icon: IconWave  },
  { value: "焚き火", Icon: IconFire  },
  { value: "カフェ", Icon: IconCafe  },
  { value: "音楽",  Icon: IconMusic },
];


// ─────────────────────────────────────────────────
// FocusSetup
// ─────────────────────────────────────────────────
type Props = {
  onStart: (config: FocusConfig) => void;
  onSkip: (config: FocusConfig) => void;
};

export default function FocusSetup({ onStart, onSkip }: Props) {
  const [duration, setDuration] = useState(25);
  const [task, setTask] = useState("");
  const [ambient, setAmbient] = useState<FocusConfig["ambient"]>("波");
  // zyunnbi キャンセル関数（画面遷移時に即停止するために使用）
  const cancelZyunnbiRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    preloadClick();
    // BGM再生中（セッションから戻ってきた場合）は準備音楽をスキップ
    const { audio: storeAudio } = useAudioStore.getState();
    if (storeAudio && !storeAudio.paused) return;

    const cancel = playZyunnbi();
    cancelZyunnbiRef.current = cancel;
    return () => {
      cancel();
      cancelZyunnbiRef.current = null;
    };
  }, []);

  const config: FocusConfig = { duration, task, ambient };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-sm mx-auto"
    >
      <StepBar steps={FOCUS_STEPS} current="setup" />

      <div className="flex-1 px-6 pt-4 pb-24 flex flex-col overflow-y-auto">
        {/* 戻るリンク */}
        <Link
          href="/app"
          className="text-[#e8e6e1]/40 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300 inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> 戻る
        </Link>

        {/* ヘッダーテキスト */}
        <div className="mb-8">
          <p className="text-[#EF9F27]/70 text-xs font-light tracking-[0.3em] mb-3">☀ Focus</p>
          <h1 className="text-[#e8e6e1] text-xl font-light leading-relaxed tracking-wide mb-2">
            珈琲を淹れてから
            <br />
            始めましょう。
          </h1>
          <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
            カフェインが集中力の立ち上がりを助けてくれます。
          </p>
        </div>

        {/* ロールピッカー（時間選択） */}
        <div className="mb-8">
          <RollerPicker value={duration} onChange={setDuration} />
        </div>

        {/* タスクメモ */}
        <div className="mb-8">
          <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em] mb-3">
            やること（任意）
          </p>
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="企画書の下書き..."
            className="w-full bg-transparent border border-white/6 px-4 py-3 text-[#e8e6e1] text-sm font-light placeholder-[#e8e6e1]/15 focus:outline-none focus:border-white/20 transition-colors duration-200"
          />
        </div>

        {/* BGM選択 */}
        <div className="mb-10">
          <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em] mb-3">BGM</p>
          <div className="flex gap-2">
            {AMBIENTS.map(({ value, Icon }) => (
              <button
                key={value}
                onClick={() => { playClick(); setAmbient(value); }}
                className={`relative overflow-hidden flex-1 flex flex-col items-center gap-2 py-3 border text-xs font-light transition-all duration-200 ${
                  ambient === value
                    ? "border-[#EF9F27] text-[#EF9F27] bg-[#EF9F27]/10"
                    : "border-white/10 text-[#e8e6e1]/50 hover:border-white/25"
                }`}
              >
                {ambient === value && <ButtonOrb />}
                <span className="relative z-10"><Icon /></span>
                <span className="relative z-10">{value}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4 mt-auto">
          <button
            onClick={() => { cancelZyunnbiRef.current?.(); playClick(); onStart(config); }}
            className="relative overflow-hidden w-full py-4 bg-[#EF9F27]/10 border border-[#EF9F27]/40 text-[#EF9F27] text-sm font-light tracking-[0.2em] hover:bg-[#EF9F27]/20 transition-all duration-300"
          >
            <ButtonOrb />
            <span className="relative z-10">準備できました</span>
          </button>
          <button
            onClick={() => { cancelZyunnbiRef.current?.(); playClick(); onSkip(config); }}
            className="text-[#e8e6e1]/30 text-sm font-light tracking-wider hover:text-[#e8e6e1]/60 transition-colors duration-300"
          >
            珈琲なしで始める →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
