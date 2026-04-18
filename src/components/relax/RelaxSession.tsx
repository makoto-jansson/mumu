"use client";

// Relaxセッション画面
// 灯台の光が呼吸サイクルに合わせて明滅 → ユーザーはその光に合わせて呼吸する

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";

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
import { useTimer } from "@/hooks/useTimer";
import { useBreath } from "@/hooks/useBreath";
import type { RelaxConfig } from "./RelaxSetup";

type Props = {
  config: RelaxConfig;
  onDone: () => void;
};

// ─────────────────────────────────────────────────
// 花束（ペンプロッター風）
// ローズ曲線 r = R·cos(n·θ) の花 + 茎 + 葉
//
// brightness → 吸う時に花が浮かび上がる
// scaleMV   → 全体がわずかに拡縮
// ─────────────────────────────────────────────────

// ローズ曲線パスを生成（原点中心）
function roseO(r: number, n: number, steps = 180): string {
  const pts = Array.from({ length: steps + 1 }, (_, i) => {
    const theta = (i / steps) * Math.PI * 2;
    const rho = r * Math.cos(n * theta);
    return `${(rho * Math.cos(theta)).toFixed(2)},${(rho * Math.sin(theta)).toFixed(2)}`;
  });
  return `M ${pts.join(" L ")} Z`;
}

function RelaxLandscape({
  scale: scaleMV,
  brightness,
}: {
  scale:      ReturnType<typeof useBreath>["scale"];
  brightness: ReturnType<typeof useBreath>["brightness"];
}) {
  const glowScale = useTransform(scaleMV,   [1, 1.75], [0.95, 1.05]);
  const glowOp    = useTransform(brightness, [0, 1],   [0,    0.06]);
  const flowerOp  = useTransform(brightness, [0, 1],   [0.20, 0.62]);
  const stemOp    = useTransform(brightness, [0, 1],   [0.10, 0.32]);

  const gTO = "0px 0px"; // transform-origin: ローカル原点

  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
    >
      <rect width="360" height="240" fill="#0a0a0a" />

      {/* 全体がゆっくり浮遊 */}
      <motion.g
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      >
        {/* (180, 120) を原点として全要素を配置 */}
        <g transform="translate(180 120)">

          {/* 呼吸グロー（最背面）*/}
          <motion.circle cx="0" cy="-12" r="88"
            fill="#e8e6e1"
            style={{ opacity: glowOp, scale: glowScale }}
          />

          {/* ── 茎・葉・ラッピング ── */}
          <motion.g style={{ opacity: stemOp }}>
            {/* 茎 — それぞれの花から根元(0,72)へ */}
            <path d="M 0 -48 C 3 0 -2 40 0 72"
              stroke="#e8e6e1" strokeWidth="0.55" strokeLinecap="round" />
            <path d="M -40 -26 C -28 10 -12 45 0 72"
              stroke="#e8e6e1" strokeWidth="0.50" strokeLinecap="round" />
            <path d="M 40 -28 C 28 8 12 42 0 72"
              stroke="#e8e6e1" strokeWidth="0.50" strokeLinecap="round" />
            <path d="M -72 -2 C -48 22 -22 50 0 72"
              stroke="#e8e6e1" strokeWidth="0.42" strokeLinecap="round" />
            <path d="M 72 0 C 48 20 22 48 0 72"
              stroke="#e8e6e1" strokeWidth="0.42" strokeLinecap="round" />
            <path d="M -15 -5 C -10 22 -5 48 0 72"
              stroke="#e8e6e1" strokeWidth="0.35" strokeLinecap="round" />
            <path d="M 18 -2 C 14 24 8 50 0 72"
              stroke="#e8e6e1" strokeWidth="0.35" strokeLinecap="round" />

            {/* 葉 */}
            <ellipse cx="-22" cy="18" rx="11" ry="4.5"
              transform="rotate(-38 -22 18)"
              stroke="#e8e6e1" strokeWidth="0.38" opacity="0.70" />
            <ellipse cx="20" cy="20" rx="10" ry="4"
              transform="rotate(32 20 20)"
              stroke="#e8e6e1" strokeWidth="0.36" opacity="0.65" />
            <ellipse cx="-42" cy="32" rx="8" ry="3.5"
              transform="rotate(-22 -42 32)"
              stroke="#e8e6e1" strokeWidth="0.32" opacity="0.52" />
            <ellipse cx="38" cy="36" rx="7.5" ry="3"
              transform="rotate(18 38 36)"
              stroke="#e8e6e1" strokeWidth="0.30" opacity="0.48" />

            {/* 束ね（ラッピング）*/}
            <path d="M -12 72 L 0 80 L 12 72 L 9 64 L -9 64 Z"
              stroke="#e8e6e1" strokeWidth="0.40" strokeLinejoin="round" />
            <line x1="-7" y1="68" x2="7" y2="68"
              stroke="#e8e6e1" strokeWidth="0.28" opacity="0.55" />
          </motion.g>

          {/* ── 花 ── */}
          <motion.g style={{ opacity: flowerOp }}>

            {/* 中央メイン花（5枚花びら）at (0, -48) */}
            <g transform="translate(0 -48)">
              <motion.g style={{ transformOrigin: gTO }}
                animate={{ rotate: [0, 14, -9, 5, 0] }}
                transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}>
                <path d={roseO(42, 5)}
                  stroke="#e8e6e1" strokeWidth="0.55" strokeLinejoin="round" />
                <path d={roseO(25, 5)}
                  stroke="#e8e6e1" strokeWidth="0.32" opacity="0.50" strokeLinejoin="round" />
                <circle cx="0" cy="0" r="5"
                  stroke="#e8e6e1" strokeWidth="0.48" />
                <circle cx="0" cy="0" r="1.8"
                  fill="#e8e6e1" opacity="0.40" />
              </motion.g>
            </g>

            {/* 左の花（4枚花びら）at (-40, -26) */}
            <g transform="translate(-40 -26)">
              <motion.g style={{ transformOrigin: gTO }}
                animate={{ rotate: [0, -11, 7, 0] }}
                transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}>
                <path d={roseO(28, 4)}
                  stroke="#e8e6e1" strokeWidth="0.50" strokeLinejoin="round" />
                <circle cx="0" cy="0" r="3.8"
                  stroke="#e8e6e1" strokeWidth="0.42" />
              </motion.g>
            </g>

            {/* 右の花（4枚花びら）at (40, -28) */}
            <g transform="translate(40 -28)">
              <motion.g style={{ transformOrigin: gTO }}
                animate={{ rotate: [0, 9, -7, 0] }}
                transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}>
                <path d={roseO(26, 4)}
                  stroke="#e8e6e1" strokeWidth="0.48" strokeLinejoin="round" />
                <circle cx="0" cy="0" r="3.4"
                  stroke="#e8e6e1" strokeWidth="0.40" />
              </motion.g>
            </g>

            {/* 左外の花（3枚花びら）at (-72, -2) */}
            <g transform="translate(-72 -2)">
              <path d={roseO(20, 3)}
                stroke="#e8e6e1" strokeWidth="0.44" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="2.8"
                stroke="#e8e6e1" strokeWidth="0.38" />
            </g>

            {/* 右外の花（3枚花びら）at (72, 0) */}
            <g transform="translate(72 0)">
              <path d={roseO(19, 3)}
                stroke="#e8e6e1" strokeWidth="0.42" strokeLinejoin="round" />
              <circle cx="0" cy="0" r="2.6"
                stroke="#e8e6e1" strokeWidth="0.36" />
            </g>

            {/* 前面の小花 at (-15, -5) */}
            <g transform="translate(-15 -5)">
              <path d={roseO(13, 5)}
                stroke="#e8e6e1" strokeWidth="0.38" strokeLinejoin="round" opacity="0.82" />
            </g>

            {/* 前面の小花 at (18, -2) */}
            <g transform="translate(18 -2)">
              <path d={roseO(12, 4)}
                stroke="#e8e6e1" strokeWidth="0.36" strokeLinejoin="round" opacity="0.80" />
            </g>

            {/* つぼみ（左奥）at (-55, -40) */}
            <g transform="translate(-55 -40)">
              <circle cx="0" cy="0" r="6"
                stroke="#e8e6e1" strokeWidth="0.38" opacity="0.52" />
              <path d="M 0 -6 C -2 -10 2 -14 0 -16"
                stroke="#e8e6e1" strokeWidth="0.30" strokeLinecap="round" opacity="0.42" />
            </g>

            {/* つぼみ（右奥）at (58, -38) */}
            <g transform="translate(58 -38)">
              <circle cx="0" cy="0" r="5"
                stroke="#e8e6e1" strokeWidth="0.36" opacity="0.48" />
              <path d="M 0 -5 C -1.5 -9 1.5 -12 0 -14"
                stroke="#e8e6e1" strokeWidth="0.28" strokeLinecap="round" opacity="0.38" />
            </g>

          </motion.g>
        </g>
      </motion.g>
    </svg>
  );
}

// ─────────────────────────────────────────────────
// RelaxSession
// ─────────────────────────────────────────────────
// relax_music フォルダ内の全トラック
const RELAX_TRACKS = [
  "Ab Major Starlight (1).m4a",
  "Ab Major Starlight.m4a",
  "Breathing Fuzz (1).m4a",
  "Breathing Fuzz.m4a",
  "Breathing Silences (1).m4a",
  "Breathing Silences (2).m4a",
  "Breathing Silences.m4a",
  "Breathing Space (1).m4a",
  "Breathing Space.m4a",
  "Glowing Pad Silence (1).m4a",
  "Glowing Pad Silence (2).m4a",
  "Glowing Pad Silence.m4a",
  "Lighthouse Coffee (1).m4a",
  "Lighthouse Coffee.m4a",
  "Lighthouse-Theremin Hum (1).m4a",
  "Lighthouse-Theremin Hum.m4a",
  "Moon-Tide Pad (1).m4a",
  "Moon-Tide Pad.m4a",
  "Velvet Fume Hush.m4a",
  "relax.m4a",
  "relax2.m4a",
].map(f => `/sounds/relax_music/${encodeURIComponent(f)}`);

export default function RelaxSession({ config, onDone }: Props) {
  const durationSec = config.duration * 60;
  const { timeLeft, formatted, isFinished, start, startFromRemaining, initPaused, pause, resume } = useTimer(durationSec);
  const { phase, label, scale, brightness } = useBreath(true);
  // HTMLAudioElement のみで管理（Web Audio API不使用 → iOS自動再生＆バックグラウンド対応）
  const audioElRef      = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeLeftRef     = useRef(durationSec);
  const sessionEndedRef = useRef(false); // 完了・手動終了時はtimerSnap保存をスキップ
  const { setAudio, stopAndClear, timerSnap, saveTimerSnap } = useAudioStore();
  const [isPaused, setIsPaused] = useState(false);
  // 画面タップでナビ表示切り替え（初期は非表示）
  const [navVisible, setNavVisible] = useState(false);
  const labelColor = "text-[#e8e6e1]";

  // timeLeftが変わるたびにrefを同期
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
      audioElRef.current?.play().catch(console.error);
      setIsPaused(false);
      saveTimerSnap({ remainingSeconds: timeLeftRef.current, savedAt: Date.now(), isPaused: false, route: "/app/relax" });
    } else {
      pause();
      audioElRef.current?.pause();
      setIsPaused(true);
      saveTimerSnap({ remainingSeconds: timeLeftRef.current, savedAt: 0, isPaused: true, route: "/app/relax" });
    }
  };

  // endsound を再生してからコールバックを呼ぶ
  const playEndSound = (callback: () => void) => {
    const se = new Audio("/sounds/endsound.m4a");
    se.volume = 0.175;
    se.play().catch(console.error);
    se.addEventListener("ended", callback, { once: true });
    // 読み込み失敗などで ended が来ない場合の保険
    setTimeout(callback, 4000);
  };

  const handleEnd = () => {
    sessionEndedRef.current = true;
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    // BGMを即停止 → endsound再生（鳴らしっぱなしで遷移）
    const a = audioElRef.current;
    if (a) a.pause();
    stopAndClear();
    const se = new Audio("/sounds/endsound.m4a");
    se.volume = 0.175;
    se.play().catch(console.error);
    onDone();
  };

  // タイマー開始 + ランダムBGM（HTMLAudioElement のみ → iOS バックグラウンド再生対応）
  useEffect(() => {
    const { audio: storeAudio, meta: storeMeta } = useAudioStore.getState();
    // 同一セッションへの復帰かどうかを判定
    // ルート・durationが一致する場合のみ復帰とみなす
    const isReturning = !!storeAudio && !storeAudio.paused
      && storeMeta?.route === "/app/relax"
      && storeMeta?.config?.duration === config.duration;

    // タイマー復元（同じセッションに戻ってきた場合のみ）
    // timerSnap.routeが"/app/relax"でない場合は別セッションのスナップなので無視
    if (timerSnap && isReturning && timerSnap.route === "/app/relax") {
      if (timerSnap.isPaused) {
        initPaused(timerSnap.remainingSeconds);
        setIsPaused(true);
      } else {
        const elapsed = (Date.now() - timerSnap.savedAt) / 1000;
        const adjusted = Math.max(0, timerSnap.remainingSeconds - elapsed);
        startFromRemaining(adjusted);
      }
      timeLeftRef.current = timerSnap.remainingSeconds;
    } else {
      start();
    }

    if (isReturning) {
      // ホームから戻ってきた場合：既存の音楽をそのまま引き継ぐ
      audioElRef.current = storeAudio;
      // StrictMode等でフェードタイマーが中断されていた場合は補正フェードを開始
      if (storeAudio.volume < 0.2) {
        fadeTimerRef.current = fadeVolume(storeAudio, 0.25, 1000);
      }
    } else {
      // 新規セッション：ランダムトラックを選んで再生
      const track = RELAX_TRACKS[Math.floor(Math.random() * RELAX_TRACKS.length)];

      const audio = new Audio(track);
      audio.loop   = true;
      // 0.001から開始（iOSは volume=0 だとオーディオセッションが起動しないため）
      audio.volume = 0.001;
      audioElRef.current = audio;
      // グローバルストアに登録（既存の音楽は自動停止）
      setAudio(audio, { label: "Relax · 呼吸", route: "/app/relax", mode: "relax", config });

      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Relax" });
      }

      audio.play().catch(console.error);
      // フェードイン（3秒かけて 0 → 0.25）
      fadeTimerRef.current = fadeVolume(audio, 0.25, 3000);
    }

    // アンマウント時はタイマー状態を保存（完了・手動終了済みの場合は保存しない）
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      if (!sessionEndedRef.current) {
        saveTimerSnap({
          remainingSeconds: timeLeftRef.current,
          savedAt: Date.now(),
          isPaused: false,
          route: "/app/relax",
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // タイマー完了 → 完了画面へ
  useEffect(() => {
    if (isFinished) {
      sessionEndedRef.current = true;
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      const a = audioElRef.current;
      if (a) fadeVolume(a, 0, 1200, () => {
        stopAndClear();
        playEndSound(onDone);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished, onDone, stopAndClear]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[40] bg-[#0a0a0a] flex flex-col items-center justify-center px-0"
      onClick={() => setNavVisible(v => !v)}
    >
      {/* 残り時間 */}
      <p className="text-[#e8e6e1]/20 text-xs font-light tracking-widest tabular-nums mb-3">
        {formatted}
      </p>

      {/* フェーズラベル */}
      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`text-sm font-light tracking-[0.45em] mb-4 ${labelColor}`}
      >
        {label}
      </motion.p>

      {/* 花束イラスト */}
      <div className="w-full max-w-sm px-4">
        <RelaxLandscape scale={scale} brightness={brightness} />
      </div>

      {/* ボタン行（一時停止 + 終了）— タップがナビトグルに伝播しないよう止める */}
      <div className="flex items-start gap-10 mt-10" onClick={e => e.stopPropagation()}>

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
        ♪ relax
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
