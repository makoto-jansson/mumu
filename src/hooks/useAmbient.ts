"use client";

// BGM再生フック
// Howler.js でループ再生・フェードアウト停止

import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";
import type { FocusConfig } from "@/components/focus/FocusSetup";

type Ambient = FocusConfig["ambient"];

const SOUND_MAP: Record<Ambient, string> = {
  "波":    "/sounds/wave.wav",
  "焚き火": "/sounds/fire.wav",
  "カフェ": "/sounds/cafe.wav",
  "音楽":  "/sounds/music.wav",
};

export function useAmbient() {
  const howlRef = useRef<Howl | null>(null);
  const currentRef = useRef<Ambient | null>(null);

  const play = useCallback((ambient: Ambient) => {
    // 同じ音が既に再生中なら何もしない
    if (currentRef.current === ambient && howlRef.current?.playing()) return;

    howlRef.current?.fade(howlRef.current.volume(), 0, 400);
    setTimeout(() => {
      howlRef.current?.unload();

      const howl = new Howl({
        src: [SOUND_MAP[ambient]],
        loop: true,
        volume: 0,
        html5: true, // モバイルバックグラウンド対応
      });
      howl.play();
      howl.fade(0, 0.65, 800);

      howlRef.current = howl;
      currentRef.current = ambient;
    }, 400);
  }, []);

  const fadeOutAndStop = useCallback((duration = 2000) => {
    const h = howlRef.current;
    if (!h) return;
    h.fade(h.volume(), 0, duration);
    setTimeout(() => {
      h.stop();
      h.unload();
      howlRef.current = null;
      currentRef.current = null;
    }, duration);
  }, []);

  const stop = useCallback(() => {
    howlRef.current?.stop();
    howlRef.current?.unload();
    howlRef.current = null;
    currentRef.current = null;
  }, []);

  // アンマウント時にクリーンアップ
  useEffect(() => {
    return () => {
      howlRef.current?.stop();
      howlRef.current?.unload();
    };
  }, []);

  return { play, stop, fadeOutAndStop };
}
