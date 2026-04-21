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
import CampfireScene from "@/components/animations/CampfireScene";
import CafeScene from "@/components/animations/CafeScene";
import { useAudioStore } from "@/store/audioStore";
import { connectGain } from "@/lib/playSound";
import type { FocusConfig } from "./FocusSetup";

// Focus_music フォルダ内の全トラック（音楽モード）
const FOCUS_TRACKS = [
  "Analog Pad Joy.m4a",
  "C major Neonfog.m4a",
  "Cozy Tape Hiss.m4a",
  "Glowing Click-Pad Loop.m4a",
  "Lantern-Off Reverb (1).m4a",
  "Lantern-Off Reverb.m4a",
  "Pink Noise Hush.m4a",
  "Tape-Hissed Pad.m4a",
  "Vinyl Crackle Loop.m4a",
  "Warm Analog Pad.m4a",
].map(f => `/sounds/Focus_music/${encodeURIComponent(f)}`);

// cafe_sound フォルダ内の全トラック（カフェモード）
const CAFE_TRACKS = [
  "482990__priesjensen__people-talking-at-cafe-ambience.m4a",
  "746428__douglasbrucelookca__miss-michelles-cafe-in-discovery-mountain-small-cafe-ambience-room-tone-small-crowd.m4a",
  "811996__ultra-edward__quiet-village-with-a-creaking-cafe-sign.m4a",
].map(f => `/sounds/cafe_sound/${encodeURIComponent(f)}`);

// campfire crackling_sound フォルダ内の全トラック（焚き火モード）
const CAMPFIRE_TRACKS = [
  "40699__spandau__campfire.m4a",
  "588401__funwithsound__campfire-close-crackling-sticks.mp3",
  "729396__heckfricker__campfire-02.m4a",
].map(f => `/sounds/campfire crackling_sound/${encodeURIComponent(f)}`);

// ocean_sound フォルダ内の全トラック（波モード）
const OCEAN_TRACKS = [
  "534915__lucas_schacht__ocean-waves-06.m4a",
  "618238__yaboiboimane__calm-meditative-ocean-waves-sound-effect.mp3",
  "693389__derjuli__ocean-waves.m4a",
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
  // 音楽モードではトラック長に合わせて上書きされる
  const durationSec = config.duration * 60;
  const { timeLeft, isFinished, formatted, start, startFromRemaining, initPaused, pause, resume } = useTimer(durationSec);
  const [isPaused, setIsPaused] = useState(false);
  // 画面タップでナビ表示切り替え（初期は非表示）
  const [navVisible, setNavVisible] = useState(false);
  // HTMLAudioElement のみで管理（Web Audio API不使用 → iOS自動再生＆バックグラウンド対応）
  const audioElRef    = useRef<HTMLAudioElement | null>(null);
  const standbyAudio  = useRef<HTMLAudioElement | null>(null); // ギャップレスループ用スタンバイ
  const fadeTimerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  // GainNodeハンドル（iOS対応音量制御 - audio.volumeはiOSで無視されるため）
  const gainHandleRef = useRef<ReturnType<typeof connectGain>>(null);
  const timeLeftRef   = useRef(durationSec); // アンマウント時に最新値を参照するためのref
  const sessionEndedRef = useRef(false); // 完了・手動終了時はtimerSnap保存をスキップ
  const { setAudio, stopAndClear, timerSnap, saveTimerSnap } = useAudioStore();

  // timeLeftが変わるたびにrefを同期
  useEffect(() => { timeLeftRef.current = timeLeft; }, [timeLeft]);

  // タイマー開始 + ランダムBGM再生
  useEffect(() => {
    const { audio: storeAudio, meta: storeMeta } = useAudioStore.getState();
    // 同一セッションへの復帰かどうかを判定
    // ルート・duration・ambientが全て一致する場合のみ復帰とみなす
    const isReturning = !!storeAudio && !storeAudio.paused
      && storeMeta?.route === "/app/focus"
      && storeMeta?.config?.duration === config.duration
      && storeMeta?.config?.ambient === config.ambient;

    // タイマー復元（同じセッションに戻ってきた場合のみ）
    // timerSnap.routeが"/app/focus"でない場合は別セッションのスナップなので無視
    if (timerSnap && isReturning && timerSnap.route === "/app/focus") {
      if (timerSnap.isPaused) {
        initPaused(timerSnap.remainingSeconds);
        setIsPaused(true);
      } else {
        const elapsed = (Date.now() - timerSnap.savedAt) / 1000;
        const adjusted = Math.max(0, timerSnap.remainingSeconds - elapsed);
        startFromRemaining(adjusted);
      }
    } else {
      start();
    }

    const TARGET_VOL = 0.35;

    if (isReturning) {
      // ホームから戻ってきた場合：既存の音楽をそのまま引き継ぐ
      audioElRef.current = storeAudio;
      storeAudio.loop = true; // ギャップレスループは再設定不要、loop=trueで継続
      // StrictMode等でフェードタイマーが中断されていた場合は補正フェードを開始
      // iOS: audio.volumeは無視されるため connectGain を試み、失敗時のみ fadeVolume で補正
      if (storeAudio.volume < 0.3) {
        const handle = connectGain(storeAudio, storeAudio.volume || 0.001);
        if (handle) {
          gainHandleRef.current = handle;
          handle.fadeTo(TARGET_VOL, 1000);
        } else {
          // GainNodeが既に接続済みの場合（前回mountのhandleが継続中）は何もしない
          // audio.volumeが低い場合のみfadeVolume（非iOS向けフォールバック）
          if (storeAudio.volume < 0.3) {
            fadeTimerRef.current = fadeVolume(storeAudio, TARGET_VOL, 1000);
          }
        }
      }
    } else {
      // 新規セッション：ランダムトラックを選んで再生
      const pool  = config.ambient === "波"   ? OCEAN_TRACKS
                  : config.ambient === "焚き火" ? CAMPFIRE_TRACKS
                  : config.ambient === "カフェ" ? CAFE_TRACKS
                  : FOCUS_TRACKS;
      const track = pool[Math.floor(Math.random() * pool.length)];

      // 2つのAudio要素でギャップレスループ（loop=trueはブラウザ実装でギャップが生じるため）
      const audio  = new Audio(track);
      const audio2 = new Audio(track);
      // 0.001から開始（iOSは volume=0 だとオーディオセッションが起動しないため）
      audio.volume  = 0.001;
      audio2.volume = TARGET_VOL;
      audioElRef.current   = audio;
      standbyAudio.current = audio2;

      // グローバルストアに登録（既存の音楽は自動停止）
      setAudio(audio, { label: `Focus · ${config.ambient}`, route: "/app/focus", mode: "focus", config });

      // ロック画面・コントロールセンターにメタデータを表示
      // setActionHandler を登録しないと iOS がロック時に pause を送って止めてしまう
      if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Focus" });
        navigator.mediaSession.setActionHandler("play",  () => { audioElRef.current?.play().catch(() => {}); });
        navigator.mediaSession.setActionHandler("pause", () => { /* 一時停止を許可しない（バックグラウンド継続） */ });
        navigator.mediaSession.setActionHandler("stop",  () => { /* 同上 */ });
      }

      // トラック終了 0.15秒前にスタンバイを再生開始 → ループ切れ目なし
      const scheduleGaplessLoop = (active: HTMLAudioElement, sb: HTMLAudioElement) => {
        const handler = () => {
          if (!active.duration || active.currentTime < active.duration - 0.15) return;
          active.removeEventListener('timeupdate', handler);
          sb.currentTime = 0;
          // GainNodeを新しいaudio要素に接続してiOSでも音量を維持
          // （初めてconnectGainを呼ぶ要素は成功、2周目以降は失敗しaudio.volumeにフォールバック）
          const newHandle = connectGain(sb, TARGET_VOL);
          if (newHandle) {
            gainHandleRef.current = newHandle;
          } else {
            // GainNode接続失敗時はaudio.volumeで設定（iOS以外で機能）
            sb.volume = TARGET_VOL;
          }
          sb.play().catch(console.error);
          audioElRef.current   = sb;
          standbyAudio.current = active;
          useAudioStore.setState({ audio: sb });
          scheduleGaplessLoop(sb, active);
        };
        active.addEventListener('timeupdate', handler);
      };

      audio.play().catch(console.error);
      // GainNodeによるフェードイン（iOS対応）→ 失敗時はaudio.volumeベースにフォールバック
      const handle = connectGain(audio, 0.001);
      gainHandleRef.current = handle;
      const fadeDuration = config.ambient === "波" ? 4000 : config.ambient === "焚き火" ? 3000 : 1000;
      if (handle) {
        handle.fadeTo(TARGET_VOL, fadeDuration);
      } else {
        fadeTimerRef.current = fadeVolume(audio, TARGET_VOL, fadeDuration);
      }
      scheduleGaplessLoop(audio, audio2);
    }

    // アンマウント時はタイマー状態を保存（完了・手動終了済みの場合は保存しない）
    return () => {
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      // セッション終了時のみGainNodeを切断（画面遷移中はGainNodeを維持して音楽継続）
      if (sessionEndedRef.current) {
        gainHandleRef.current?.disconnect();
        gainHandleRef.current = null;
      }
      if (!sessionEndedRef.current) {
        saveTimerSnap({
          remainingSeconds: timeLeftRef.current,
          savedAt: Date.now(),
          isPaused: false, // 一時停止中かどうかはhandlePauseResumeで別途保存
          route: "/app/focus",
        });
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // endsound を再生してからコールバックを呼ぶ
  const playEndSound = (onDone: () => void) => {
    const se = new Audio("/sounds/endsound.m4a");
    se.volume = 0.175;
    se.play().catch(console.error);
    se.addEventListener("ended", onDone, { once: true });
    // 読み込み失敗などで ended が来ない場合の保険
    setTimeout(onDone, 4000);
  };

  // タイマー完了
  useEffect(() => {
    if (isFinished) {
      sessionEndedRef.current = true;
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
      if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
      const a      = audioElRef.current;
      const sb     = standbyAudio.current;
      const handle = gainHandleRef.current;
      const onFadeDone = () => {
        handle?.disconnect();
        gainHandleRef.current = null;
        stopAndClear();
        if (sb && sb !== a) sb.pause();
        playEndSound(() => onBreak(config.duration));
      };
      if (a) {
        if (handle) {
          // GainNodeによるフェードアウト（iOS対応）
          handle.fadeTo(0, 1200, onFadeDone);
        } else {
          fadeVolume(a, 0, 1200, onFadeDone);
        }
      }
    }
  }, [isFinished, config.duration, onBreak, stopAndClear]);

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
      audioElRef.current?.play().catch(console.error);
      setIsPaused(false);
      saveTimerSnap({ remainingSeconds: timeLeftRef.current, savedAt: Date.now(), isPaused: false, route: "/app/focus" });
    } else {
      pause();
      audioElRef.current?.pause();
      setIsPaused(true);
      saveTimerSnap({ remainingSeconds: timeLeftRef.current, savedAt: 0, isPaused: true, route: "/app/focus" });
    }
  };

  const handleEnd = () => {
    sessionEndedRef.current = true;
    const elapsedMin = Math.max(1, Math.round((durationSec - timeLeft) / 60));
    if (fadeTimerRef.current) clearInterval(fadeTimerRef.current);
    // GainNodeを切断してBGMを即停止 → endsound再生
    gainHandleRef.current?.disconnect();
    gainHandleRef.current = null;
    const a  = audioElRef.current;
    const sb = standbyAudio.current;
    if (a) a.pause();
    if (sb && sb !== a) sb.pause();
    stopAndClear();
    const se = new Audio("/sounds/endsound.m4a");
    se.volume = 0.175;
    se.play().catch(console.error);
    onBreak(elapsedMin);
  };

  const progress = timeLeft / durationSec;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-[40] bg-[#0e0e0e] flex flex-col items-center justify-center px-0"
      onClick={() => setNavVisible(v => !v)}
    >
      {/* 残り時間（大きく） */}
      <motion.p
        className="text-[#e8e6e1] font-light tabular-nums tracking-widest mb-6"
        style={{ fontSize: "clamp(3rem, 15vw, 5rem)" }}
      >
        {formatted}
      </motion.p>

      {/* シーンアニメーション（焚き火モードは森の焚き火、それ以外は灯台） */}
      <div className="w-full max-w-sm">
        {config.ambient === "焚き火" ? <CampfireScene />
          : config.ambient === "カフェ" ? <CafeScene />
          : <FocusScene />}
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
          className="h-full bg-[#a3a957]/50"
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
            className="fixed bottom-0 left-0 right-0 h-16 z-[60] bg-[#0e0e0e]"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
