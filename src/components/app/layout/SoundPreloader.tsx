"use client";

// アプリ起動時に効果音をプリロードするコンポーネント
// - clicksound: Web Audio API用にデコードしてバッファ保持
// - endsound / zyunnbi: HTMLAudioElement でキャッシュ

import { useEffect } from "react";
import { preloadClick } from "@/lib/playSound";

const PRELOAD_SOUNDS = [
  "/sounds/endsound.m4a",
  "/sounds/zyunnbi.m4a",
];

export default function SoundPreloader() {
  useEffect(() => {
    // クリック音を Web Audio API バッファにデコード
    preloadClick();
    // その他効果音をHTMLAudioElementでキャッシュ
    PRELOAD_SOUNDS.forEach((src) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.load();
    });
  }, []);

  return null;
}
