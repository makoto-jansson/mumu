"use client";

// 効果音再生ユーティリティ
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}

export const playClick = () => playSound("/sounds/clicksound.wav", 0.2625);
export const preloadClick = () => {}; // 後方互換用（呼び出し元はそのままでOK）
