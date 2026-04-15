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
import { useAudioStore } from "@/store/audioStore";
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

// 音量をなめらかに変化させる（setIntervalベース）
function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  durationMs: number,
  onDone?: () => void
): ReturnType<typeof setInterval> {
  const steps    = 30;
  const stepMs   = durationMs / steps;
  const startVol = audio.volume;
  const delta    = (target - startVol) / steps;
  let   count    = 0;
  const id = setInterval(() => {
    count++;
    audio.volume = Math.max(0, Math.min(1, startVol + delta * count));
    if (count >= steps) {
      clearInterval(id);
      audio.volume = target;
      onDone?.();
    }
  }, stepMs);
  return id;
}

export default function FocusSession({ config, onBreak }: Props) {
  const durationSec = config.duration * 60;
  const { timeLeft, isFinished, formatted, start, pause, resume } = useTimer(durationSec);
  const [isPaused, setIsPaused] = useState(false);
  // 画面タップでナビ表示切り替え（初期は非表示）
  const [navVisible, setNavVisible] = useState(false);
  // HTMLAudioElement のみで管理（Web Audio API不使用 → iOS自動再生＆バックグラウンド対応）
  const audioElRef   = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setAudio, stopAndClear } = useAudioStore();

  // タイマー開始 + ランダムBGM再生
  useEffect(() => {
    start();
    const pool  = config.ambient === "波"   ? OCEAN_TRACKS
                : config.ambient === "焚き火" ? CAMPFIRE_TRACKS
                : config.ambient === "カフェ" ? CAFE_TRACKS
                : FOCUS_TRACKS;
    const track = pool[Math.floor(Math.random() * pool.length)];

    const audio = new Audio(track);
    audio.loop   = true;
    audio.volume = 0.35;
    audioElRef.current = audio;
    // グローバルストアに登録（既存の音楽は自動停止）
    setAudio(audio, { label: `Focus · ${config.ambient}`, route: "/app/focus" });

    // ロック画面・コントロールセンターにメタデータを表示
    if ("mediaSession" in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Focus" });
    }

    audio.play().catch(console.error);

    // アンマウント時は音楽を止めない（他ページ遷移後も継続再生）
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー完了
  useEffect(() => {
    if (isFinished) {
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      const a = audioElRef.current;
      if (a) fadeVolume(a, 0, 1200, () => stopAndClear());
      setTimeout(() => onBreak(config.duration), 1200);
    }
  }, [isFinished, config.duration, onBreak, stopAndClear]);

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
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    const a = audioElRef.current;
    if (a) fadeVolume(a, 0, 800, () => stopAndClear());
    setTimeout(() => onBreak(elapsedMin), 800);
  };

  const progress = timeLeft / durationSec;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[40] bg-[#0a0a0a] flex flex-col items-center justify-center px-0"
      onClick={() => setNavVisible(v => !v)}
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

      {/* ボタン行（一時停止 + 終了）— タップがナビトグルに伝播しないよう止める */}
      <div className="flex items-start gap-10" onClick={e => e.stopPropagation()}>

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

      {/* BGMメモ — ナビ表示時はナビの上に出す */}
      <p className={`absolute text-[#e8e6e1]/15 text-xs font-light tracking-wider transition-all duration-300 ${navVisible ? "bottom-24" : "bottom-8"}`}>
        {`♪ ${config.ambient}`}
      </p>

      {/* ナビ非表示時のカバー（BottomNavをz-[60]で塞ぐ） */}
      <AnimatePresence>
        {!navVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed bottom-0 left-0 right-0 h-16 z-[60] bg-[#0a0a0a]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
