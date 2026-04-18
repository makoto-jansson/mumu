"use client";

// アプリ起動時に効果音をプリロードするコンポーネント
// - clicksound: Web Audio API用にデコードしてバッファ保持
// - endsound / zyunnbi: HTMLAudioElement でキャッシュ

import { useEffect } from "react";
import { preloadClick, preloadZyunnbi } from "@/lib/playSound";

const PRELOAD_SOUNDS = [
  "/sounds/endsound.m4a",
];

export default function SoundPreloader() {
  useEffect(() => {
    // Web Audio API バッファにデコード（zyunnbi も含める）
    preloadClick();
    preloadZyunnbi();
    // endsound は HTMLAudioElement でキャッシュ
    PRELOAD_SOUNDS.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.load();
    });
  }, []);

  return null;
}
