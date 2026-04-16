"use client";

// グローバル音声管理ストア
// - 画面遷移後も音楽を継続再生するため、コンポーネント外でAudioを保持
// - 新しいセッションが始まったら前の音楽をフェードアウトして切り替え

import { create } from "zustand";

// 音量を滑らかに変化させてコールバックを呼ぶ
function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  durationMs: number,
  onDone?: () => void,
): void {
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
}

type NowPlayingMeta = {
  label:  string;       // 表示用テキスト（例: "Focus · 波"）
  route:  string;       // セッションページのパス（例: "/app/focus"）
  mode:   "focus" | "relax";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;          // FocusConfig | RelaxConfig（ページ側でキャスト）
};

type TimerSnap = {
  remainingSeconds: number; // 保存時点の残り秒数
  savedAt: number;          // Date.now() at save（一時停止中は0）
  isPaused: boolean;
};

type AudioStore = {
  audio: HTMLAudioElement | null;
  meta:  NowPlayingMeta | null;
  timerSnap: TimerSnap | null;
  // 新しい音声を登録（既存があればフェードアウトして差し替え）
  setAudio: (audio: HTMLAudioElement, meta: NowPlayingMeta) => void;
  // タイマー状態を保存（アンマウント・一時停止時）
  saveTimerSnap: (snap: TimerSnap) => void;
  // 明示的にフェードアウトして停止（セッション終了時）
  stopAndClear: () => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,
  meta:  null,
  timerSnap: null,

  saveTimerSnap: (snap) => set({ timerSnap: snap }),

  setAudio: (audio, meta) => {
    const prev = get().audio;
    if (prev && prev !== audio) {
      // 前の音楽をフェードアウトしてから解放
      fadeVolume(prev, 0, 800, () => {
        prev.pause();
      });
    }
    set({ audio, meta });
  },

  stopAndClear: () => {
    const { audio } = get();
    if (audio) audio.pause();
    set({ audio: null, meta: null, timerSnap: null });
  },
}));
