"use client";

// Relaxセッション画面
// 灯台の光が呼吸サイクルに合わせて明滅 → ユーザーはその光に合わせて呼吸する

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import { Howl } from "howler";
import { useTimer } from "@/hooks/useTimer";
import { useBreath } from "@/hooks/useBreath";
import StepBar, { RELAX_STEPS } from "@/components/focus/StepBar";
import type { RelaxConfig } from "./RelaxSetup";

type Props = {
  config: RelaxConfig;
  onDone: () => void;
};

// ─────────────────────────────────────────────────
// 灯台（呼吸の中心UIとして大きく表示）
// scale: 呼吸サイクルのスケール値（1.0〜1.75）
// brightness: 輝度（0〜1）
// ─────────────────────────────────────────────────
function BreathLighthouse({
  scale: scaleMV,
  brightness,
}: {
  scale:      ReturnType<typeof useBreath>["scale"];
  brightness: ReturnType<typeof useBreath>["brightness"];
}) {
  // ハロー半径（吸う→大きく / 吐く→小さく）
  const outerR = useTransform(scaleMV, [1, 1.75], [48, 115]);
  const midR   = useTransform(scaleMV, [1, 1.75], [28, 68]);
  const innerR = useTransform(scaleMV, [1, 1.75], [14, 36]);

  // ハロー不透明度（brightness と連動）
  const outerOp  = useTransform(brightness, [0, 1], [0,    0.07]);
  const midOp    = useTransform(brightness, [0, 1], [0,    0.14]);
  const innerOp  = useTransform(brightness, [0, 1], [0.02, 0.26]);
  const coreOp   = useTransform(brightness, [0, 1], [0.40, 1.00]);
  const haloGlow = useTransform(brightness, [0, 1], [0,    0.18]);

  return (
    <svg
      viewBox="0 -70 280 450"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      {/* ─── ハロー（呼吸で膨らむ） ─── */}
      {/* ぼかしフィルタ */}
      <defs>
        <filter id="glowBlur" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>

      {/* アウターグロー（ぼかし付き） */}
      <motion.circle cx="140" cy="95" r={outerR}
        fill="#EF9F27" style={{ opacity: outerOp }} filter="url(#glowBlur)" />

      {/* ミドルグロー */}
      <motion.circle cx="140" cy="95" r={midR}
        fill="#EF9F27" style={{ opacity: midOp }} />

      {/* インナーグロー */}
      <motion.circle cx="140" cy="95" r={innerR}
        fill="#EF9F27" style={{ opacity: innerOp }} />

      {/* ガラス室周辺ハロー（常時わずかに光る） */}
      <motion.circle cx="140" cy="95" r="20"
        fill="#EF9F27" style={{ opacity: haloGlow }} />

      {/* ─── 灯台構造（幅2倍、中心 x=140）─── */}
      {/* 頂部飾り */}
      <line x1="140" y1="72" x2="140" y2="68"
        stroke="#e8e6e1" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="140" cy="67" r="2.5"
        stroke="#e8e6e1" strokeWidth="1.1" fill="#0a0a0a" />

      {/* 屋根（幅 ±10） */}
      <path d="M130 82 L140 72 L150 82 Z"
        stroke="#e8e6e1" strokeWidth="1.2" strokeLinejoin="round" fill="#0a0a0a" />

      {/* ガラス室（幅20） */}
      <rect x="130" y="82" width="20" height="14" rx="0.5"
        stroke="#e8e6e1" strokeWidth="1.2" fill="#0a0a0a" />
      {/* ガラス室 縦桟 */}
      <line x1="136" y1="82" x2="136" y2="96" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.35" />
      <line x1="144" y1="82" x2="144" y2="96" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.35" />

      {/* 肩台座（幅32） */}
      <rect x="124" y="96" width="32" height="3" rx="0.5"
        stroke="#e8e6e1" strokeWidth="1.2" fill="#0a0a0a" />
      {/* バルコニー支柱 */}
      <line x1="124" y1="96" x2="124" y2="102" stroke="#e8e6e1" strokeWidth="0.9" opacity="0.5" />
      <line x1="156" y1="96" x2="156" y2="102" stroke="#e8e6e1" strokeWidth="0.9" opacity="0.5" />

      {/* 塔本体（台形：上 ±12、下 ±18） */}
      <path d="M128 99 L122 265 L158 265 L152 99 Z"
        stroke="#e8e6e1" strokeWidth="1.2" fill="#0a0a0a" strokeLinejoin="round" />
      {/* 縞模様 */}
      <line x1="122.5" y1="155" x2="157.5" y2="155"
        stroke="#e8e6e1" strokeWidth="0.9" opacity="0.22" />
      <line x1="122.3" y1="205" x2="157.7" y2="205"
        stroke="#e8e6e1" strokeWidth="0.9" opacity="0.22" />

      {/* 丘シルエット */}
      <path
        d="M0 320 C50 295 95 278 140 275 C185 278 230 295 280 320 L280 380 L0 380 Z"
        fill="#080c1e"
      />

      {/* 波（2レイヤー、静的な曲線） */}
      <motion.path
        d="M0 335 C70 328 140 342 210 332 C245 327 265 334 280 335"
        stroke="#1D9E75" strokeWidth="0.9" strokeOpacity="0.18"
        animate={{ d: [
          "M0 335 C70 328 140 342 210 332 C245 327 265 334 280 335",
          "M0 335 C70 342 140 328 210 338 C245 343 265 334 280 335",
        ]}}
        transition={{ duration: 8, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
      />
      <motion.path
        d="M0 348 C60 341 130 354 200 346 C240 341 265 349 280 348"
        stroke="#1D9E75" strokeWidth="0.9" strokeOpacity="0.12"
        animate={{ d: [
          "M0 348 C60 341 130 354 200 346 C240 341 265 349 280 348",
          "M0 348 C60 355 130 342 200 350 C240 355 265 347 280 348",
        ]}}
        transition={{ duration: 11, repeat: Infinity, repeatType: "mirror", ease: "easeInOut", delay: 1.5 }}
      />

      {/* ─── 光源 ─── */}
      {/* 常時 dim */}
      <circle cx="140" cy="89" r="5.5" fill="#EF9F27" opacity="0.38" />
      {/* 呼吸連動コア */}
      <motion.circle cx="140" cy="89" r="3.5" fill="#EF9F27" style={{ opacity: coreOp }} />
    </svg>
  );
}

// ─────────────────────────────────────────────────
// RelaxSession
// ─────────────────────────────────────────────────
export default function RelaxSession({ config, onDone }: Props) {
  const durationSec = config.duration * 60;
  const { formatted, isFinished, start, pause, resume } = useTimer(durationSec);
  const { phase, label, scale, brightness } = useBreath(true);
  const howlRef = useRef<Howl | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const labelColor = "text-[#e8e6e1]";

  const handlePauseResume = () => {
    if (isPaused) { resume(); setIsPaused(false); }
    else          { pause();  setIsPaused(true);  }
  };

  const handleEnd = () => {
    howlRef.current?.fade(howlRef.current.volume(), 0, 800);
    setTimeout(onDone, 800);
  };

  // タイマー開始 + BGM
  useEffect(() => {
    start();
    const howl = new Howl({ src: ["/sounds/pour.wav"], loop: true, volume: 0, html5: true });
    howl.play();
    howl.fade(0, 0.18, 2000);
    howlRef.current = howl;
    return () => {
      howl.fade(howl.volume(), 0, 800);
      setTimeout(() => { howl.stop(); howl.unload(); }, 800);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー完了 → 完了画面へ
  useEffect(() => {
    if (isFinished) {
      howlRef.current?.fade(howlRef.current.volume(), 0, 1200);
      setTimeout(onDone, 1200);
    }
  }, [isFinished, onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-y-auto"
    >
      <StepBar steps={RELAX_STEPS} current="session" />

      {/* タイマー・ラベル・灯台・ボタンを密なひとかたまりに */}
      <div className="max-w-sm mx-auto w-full flex flex-col items-center pt-3 pb-24">
        {/* 残り時間 */}
        <p className="text-center text-[#e8e6e1]/20 text-xs font-light tracking-widest tabular-nums">
          {formatted}
        </p>

        {/* フェーズラベル（タイマーと同程度の余白） */}
        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`text-center text-sm font-light tracking-[0.45em] mt-3 ${labelColor}`}
        >
          {label}
        </motion.p>

        {/* 灯台（max-w-sm内全幅） */}
        <div className="w-full mt-3 px-4">
          <BreathLighthouse scale={scale} brightness={brightness} />
        </div>

        {/* ボタン行 */}
        <div className="flex gap-4 w-full mt-8 px-6">
          <button
            onClick={handlePauseResume}
            className="flex-1 py-3 border border-white/20 text-[#e8e6e1] text-sm font-light tracking-[0.15em] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isPaused ? "resume" : "pause"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isPaused ? "再開" : "一時停止"}
              </motion.span>
            </AnimatePresence>
          </button>
          <button
            onClick={handleEnd}
            className="flex-1 py-3 border border-white/20 text-[#e8e6e1] text-sm font-light tracking-[0.15em] hover:border-white/40 hover:bg-white/5 transition-all duration-300"
          >
            終了
          </button>
        </div>
      </div>
    </motion.div>
  );
}
