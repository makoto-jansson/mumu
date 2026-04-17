"use client";

// 効果音再生ユーティリティ

// クリック音専用キャッシュ（毎回new Audioを作らず使い回す）
let _clickAudio: HTMLAudioElement | null = null;

function getClickAudio(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!_clickAudio) {
    _clickAudio = new Audio("/sounds/clicksound.wav");
    _clickAudio.volume = 0.2625;
  }
  return _clickAudio;
}

export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}

export const playClick = () => {
  const audio = getClickAudio();
  if (!audio) return;
  // 再生中でも頭から再生し直す
  audio.currentTime = 0;
  audio.play().catch(console.error);
};

export const preloadClick = () => {
  // キャッシュを初期化してロードしておく
  const audio = getClickAudio();
  audio?.load();
};
