"use client";

// Relaxモード開始前画面
// 気分・時間を選んでスタート

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ButtonOrb from "@/components/animations/ButtonOrb";
import StepBar, { RELAX_STEPS } from "@/components/focus/StepBar";
import RollerPicker from "@/components/focus/RollerPicker";
import { playClick, preloadClick, playZyunnbi } from "@/lib/playSound";
import { useAudioStore } from "@/store/audioStore";

export type RelaxConfig = {
  mood:     "疲れた" | "もやもや" | "ぼんやりしたい";
  duration: number;
};

const MOODS: RelaxConfig["mood"][] = ["疲れた", "もやもや", "ぼんやりしたい"];
// 3・5分 + 10分以降は5分刻みで60分まで
const RELAX_OPTIONS = [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60];

type Props = {
  onStart: (config: RelaxConfig) => void;
  onSkip:  (config: RelaxConfig) => void;
};

export default function RelaxSetup({ onStart, onSkip }: Props) {
  const [mood,     setMood]     = useState<RelaxConfig["mood"]>("ぼんやりしたい");
  const [duration, setDuration] = useState(5);
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[#0a0a0a] flex flex-col max-w-sm mx-auto"
    >
      <StepBar steps={RELAX_STEPS} current="setup" />

      <div className="flex-1 px-6 pt-4 pb-24 flex flex-col overflow-y-auto">
        {/* 戻るリンク */}
        <Link
          href="/app"
          className="text-[#e8e6e1]/40 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300 inline-flex items-center gap-2 mb-8"
        >
          <span>←</span> 戻る
        </Link>

        {/* ヘッダー */}
        <div className="mb-8">
          <p className="text-[#EF9F27]/70 text-xs font-light tracking-[0.3em] mb-3">☽ Relax</p>
          <h1 className="text-[#e8e6e1] text-xl font-light leading-relaxed tracking-wide mb-2">
            珈琲を淹れて、
            <br />
            ゆっくり始めましょう。
          </h1>
          <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
            呼吸に合わせて、静かに整えていきます。
          </p>
        </div>

        {/* 気分選択 */}
        <div className="mb-8">
          <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em] mb-3">
            今の気分
          </p>
          <div className="flex flex-col gap-2">
            {MOODS.map((m) => (
              <button
                key={m}
                onClick={() => { playClick(); setMood(m); }}
                className={`w-full py-3 px-4 text-left text-sm font-light tracking-wide border transition-all duration-200 ${
                  mood === m
                    ? "border-[#EF9F27]/50 text-[#EF9F27] bg-[#EF9F27]/8"
                    : "border-white/8 text-[#e8e6e1]/50 hover:border-white/20"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* 時間選択（ロール式） */}
        <div className="mb-10">
          <RollerPicker
            value={duration}
            onChange={setDuration}
            options={RELAX_OPTIONS}
            label="何分リラックスする？"
          />
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-4 mt-auto">
          <button
            onClick={() => { cancelZyunnbiRef.current?.(); playClick(); onStart({ mood, duration }); }}
            className="relative overflow-hidden w-full py-4 bg-[#EF9F27]/10 border border-[#EF9F27]/40 text-[#EF9F27] text-sm font-light tracking-[0.2em] hover:bg-[#EF9F27]/20 transition-all duration-300"
          >
            <ButtonOrb />
            <span className="relative z-10">準備できました</span>
          </button>
          <button
            onClick={() => { cancelZyunnbiRef.current?.(); playClick(); onSkip({ mood, duration }); }}
            className="text-[#e8e6e1]/30 text-sm font-light tracking-wider hover:text-[#e8e6e1]/60 transition-colors duration-300"
          >
            珈琲なしで始める →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
