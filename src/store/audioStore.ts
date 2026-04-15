"use client";

// グローバル音声管理ストア
// - 画面遷移後も音楽を継続再生するため、コンポーネント外でAudioを保持
// - 新しいセッションが始まったら前の音楽を停止して新しい音楽を開始

import { create } from "zustand";

type AudioStore = {
  audio: HTMLAudioElement | null;
  // 新しい音声を登録（既存があれば即停止してから差し替え）
  setAudio: (audio: HTMLAudioElement) => void;
  // 明示的に停止してクリア（セッション終了時）
  stopAndClear: () => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,

  setAudio: (audio) => {
    const prev = get().audio;
    if (prev && prev !== audio) {
      prev.pause();
      prev.src = "";
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
