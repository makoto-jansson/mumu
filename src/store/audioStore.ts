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

type AudioStore = {
  audio: HTMLAudioElement | null;
  // 新しい音声を登録（既存があればフェードアウトして差し替え）
  setAudio: (audio: HTMLAudioElement) => void;
  // 明示的にフェードアウトして停止（セッション終了時）
  stopAndClear: () => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,

  setAudio: (audio) => {
    const prev = get().audio;
    if (prev && prev !== audio) {
      // 前の音楽をフェードアウトしてから解放
      fadeVolume(prev, 0, 800, () => {
        prev.pause();
        prev.src = "";
      });
    }
    set({ audio });
  },

  stopAndClear: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      audio.src = "";
    }
    set({ audio: null });
  },
}));
