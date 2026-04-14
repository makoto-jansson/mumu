"use client";

// 集中セッション画面
// - フルスクリーン固定でBottomNavを隠す
// - 残り時間を大きく表示
// - 霧の海と灯台アニメーション
// - 一時停止・終了ボタン

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTimer } from "@/hooks/useTimer";
import FocusScene from "@/components/animations/FocusScene";
import type { FocusConfig } from "./FocusSetup";

// Focus_music フォルダ内の全トラック（音楽モード）
const FOCUS_TRACKS = [
  "Analog Pad Joy.wav",
  "C major Neonfog.wav",
  "Cozy Tape Hiss.wav",
  "Glowing Click-Pad Loop.wav",
  "Lantern-Off Reverb (1).wav",
  "Lantern-Off Reverb.wav",
  "Pink Noise Hush.wav",
  "Tape-Hissed Pad.wav",
  "Vinyl Crackle Loop.wav",
  "Warm Analog Pad.wav",
].map(f => `/sounds/Focus_music/${encodeURIComponent(f)}`);

// cafe_sound フォルダ内の全トラック（カフェモード）
const CAFE_TRACKS = [
  "482990__priesjensen__people-talking-at-cafe-ambience.wav",
  "746428__douglasbrucelookca__miss-michelles-cafe-in-discovery-mountain-small-cafe-ambience-room-tone-small-crowd.wav",
  "811996__ultra-edward__quiet-village-with-a-creaking-cafe-sign.wav",
].map(f => `/sounds/cafe_sound/${encodeURIComponent(f)}`);

// campfire crackling_sound フォルダ内の全トラック（焚き火モード）
const CAMPFIRE_TRACKS = [
  "40699__spandau__campfire.wav",
  "588401__funwithsound__campfire-close-crackling-sticks.mp3",
  "729396__heckfricker__campfire-02.wav",
].map(f => `/sounds/campfire crackling_sound/${encodeURIComponent(f)}`);

// ocean_sound フォルダ内の全トラック（波モード）
const OCEAN_TRACKS = [
  "534915__lucas_schacht__ocean-waves-06.wav",
  "618238__yaboiboimane__calm-meditative-ocean-waves-sound-effect.mp3",
  "693389__derjuli__ocean-waves.wav",
].map(f => `/sounds/ocean_sound/${encodeURIComponent(f)}`);

type Props = {
  config: FocusConfig;
  onBreak: (actualMinutes: number) => void;
};

export default function FocusSession({ config, onBreak }: Props) {
  const durationSec = config.duration * 60;
  const { timeLeft, isFinished, formatted, start, pause, resume } = useTimer(durationSec);
  const [isPaused, setIsPaused] = useState(false);
  // iOSではAudioContextがsuspendedで始まるため、タップが必要な場合はtrueにする
  const [needsInteraction, setNeedsInteraction] = useState(false);
  // HTMLAudioElement → createMediaElementSource → GainNode
  // HTMLAudioElement.loop はブラウザのメディアエンジンが処理 → iOS バックグラウンド再生可
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef     = useRef<GainNode | null>(null);
  const audioElRef  = useRef<HTMLAudioElement | null>(null);

  // タイマー開始 + ランダムBGM再生
  useEffect(() => {
    start();
    const pool  = config.ambient === "波"   ? OCEAN_TRACKS
                : config.ambient === "焚き火" ? CAMPFIRE_TRACKS
                : config.ambient === "カフェ" ? CAFE_TRACKS
                : FOCUS_TRACKS;
    const track = pool[Math.floor(Math.random() * pool.length)];

    const ctx  = new AudioContext();
    ctx.resume(); // iOS Safari 対応
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    gainRef.current     = gain;

    // HTMLAudioElement でバックグラウンド再生 + Web Audio API で音量制御
    const audio  = new Audio(track);
    audio.loop   = true;
    audioElRef.current = audio;
    const source = ctx.createMediaElementSource(audio);
    source.connect(gain);
    // iOSではsuspendedのためユーザー操作が必要。PCはそのまま再生
    if (ctx.state === "suspended") {
      setNeedsInteraction(true);
    } else {
      audio.play()
        .then(() => gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2))
        .catch(() => setNeedsInteraction(true));
    }

    // ロック画面・コントロールセンターにメタデータを表示
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Focus" });
    }

    return () => {
      const g = gainRef.current, c = audioCtxRef.current, a = audioElRef.current;
      if (g && c && c.state !== "closed") g.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
      setTimeout(() => { a?.pause(); c?.close(); }, 800);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isFinished) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      const g = gainRef.current, c = audioCtxRef.current;
      if (g && c && c.state !== "closed") g.gain.linearRampToValueAtTime(0, c.currentTime + 1.2);
      setTimeout(() => onBreak(config.duration), 1200);
    }
  }, [isFinished, config.duration, onBreak]);

  // iOSタップでAudioContextを起動し音声を開始する
  const handleUnlock = async () => {
    const ctx   = audioCtxRef.current;
    const audio = audioElRef.current;
    const gain  = gainRef.current;
    if (!ctx || !audio || !gain) return;
    try {
      await ctx.resume();
      await audio.play();
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 2);
      setNeedsInteraction(false);
    } catch (e) { console.error(e); }
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
      audioElRef.current?.play().catch(console.error);
      setIsPaused(false);
    } else {
      pause();
      audioElRef.current?.pause();
      setIsPaused(true);
    }
  };

  const handleEnd = () => {
    const elapsedMin = Math.max(1, Math.round((durationSec - timeLeft) / 60));
    const g = gainRef.current;
    const c = audioCtxRef.current;
    if (g && c && c.state !== "closed") {
      g.gain.linearRampToValueAtTime(0, c.currentTime + 0.8);
    }
    setTimeout(() => onBreak(elapsedMin), 800);
  };

  const progress = timeLeft / durationSec;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[100] bg-[#0a0a0a] flex flex-col items-center justify-center px-0"
    >
      {/* 残り時間（大きく） */}
      <motion.p
        className="text-[#e8e6e1] font-light tabular-nums tracking-widest mb-6"
        style={{ fontSize: "clamp(3rem, 15vw, 5rem)" }}
      >
        {formatted}
      </motion.p>

      {/* 霧の海と灯台アニメーション */}
      <div className="w-full max-w-sm">
        <FocusScene />
      </div>

      {/* タスクメモ */}
      {config.task ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.5 }}
          className="text-[#e8e6e1]/40 text-sm font-light tracking-wider mt-3 mb-10"
        >
          {config.task}
        </motion.p>
      ) : (
        <div className="mb-10" />
      )}

      {/* 進捗バー */}
      <div className="w-32 h-px bg-white/10 mb-10">
        <motion.div
          className="h-full bg-[#EF9F27]/50"
          style={{ width: `${(1 - progress) * 100}%` }}
        />
      </div>

      {/* ボタン行（一時停止 + 終了） */}
      <div className="flex items-start gap-10">

        {/* 一時停止 / 再開 */}
        <button
          onClick={handlePauseResume}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
            <AnimatePresence mode="wait">
              {isPaused ? (
                <motion.svg
                  key="play"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  width="14" height="16" viewBox="0 0 14 16" fill="none"
                >
                  <path d="M1 1L13 8L1 15V1Z" fill="#e8e6e1" opacity="0.6" />
                </motion.svg>
              ) : (
                <motion.svg
                  key="pause"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  width="14" height="16" viewBox="0 0 14 16" fill="none"
                >
                  <rect x="1" y="1" width="4" height="14" fill="#e8e6e1" opacity="0.6" />
                  <rect x="9" y="1" width="4" height="14" fill="#e8e6e1" opacity="0.6" />
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
          <span className="text-[#e8e6e1]/25 text-xs font-light tracking-wider">
            {isPaused ? "再開" : "一時停止"}
          </span>
        </button>

        {/* 終了 */}
        <button
          onClick={handleEnd}
          className="flex flex-col items-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-white/40 transition-colors duration-300">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="1" y="1" width="10" height="10" rx="1" fill="#e8e6e1" opacity="0.6" />
            </svg>
          </div>
          <span className="text-[#e8e6e1]/25 text-xs font-light tracking-wider">終了</span>
        </button>

      </div>

      {/* BGMメモ */}
      <p className="absolute bottom-8 text-[#e8e6e1]/15 text-xs font-light tracking-wider">
        {`♪ ${config.ambient}`}
      </p>

      {/* iOS用：タップで音声起動オーバーレイ */}
      <AnimatePresence>
        {needsInteraction && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer"
            onClick={handleUnlock}
          >
            <p className="text-[#e8e6e1]/35 text-xs font-light tracking-[0.35em]">
              タップして開始
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
