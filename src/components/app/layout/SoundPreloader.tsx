"use client";

// アプリ起動時に効果音をプリロードするコンポーネント
// ブラウザキャッシュに乗せておくことで再生時の遅延を防ぐ

import { useEffect } from "react";

const EFFECT_SOUNDS = [
  "/sounds/clicksound.wav",
  "/sounds/endsound.wav",
  "/sounds/zyunnbi.wav",
];

export default function SoundPreloader() {
  useEffect(() => {
    EFFECT_SOUNDS.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.load();
    });
  }, []);

  return null;
}
