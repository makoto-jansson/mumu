"use client";

// 呼吸サイクルフック
// inhale 4s → hold 4s → exhale 6s（計14秒で1サイクル）

import { useState, useEffect } from "react";
import { useMotionValue, animate } from "framer-motion";

export type BreathPhase = "inhale" | "hold" | "exhale";

const CYCLE: { phase: BreathPhase; duration: number; scale: number; brightness: number }[] = [
  { phase: "inhale", duration: 4, scale: 1.75, brightness: 1.0 },
  { phase: "hold",   duration: 4, scale: 1.75, brightness: 1.0 },
  { phase: "exhale", duration: 6, scale: 1.0,  brightness: 0.0 },
];

const PHASE_LABEL: Record<BreathPhase, string> = {
  inhale: "吸う",
  hold:   "止める",
  exhale: "吐く",
};

export function useBreath(enabled: boolean = true) {
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const scale      = useMotionValue(1.0);
  const brightness = useMotionValue(0.0);

  useEffect(() => {
    if (!enabled) return;
    let stopped = false;

    async function run() {
      while (!stopped) {
        for (const step of CYCLE) {
          if (stopped) break;
          setPhase(step.phase);

          if (step.phase === "hold") {
            // 値を維持したまま指定時間だけ待つ
            await new Promise<void>((r) => setTimeout(r, step.duration * 1000));
          } else {
            await Promise.all([
              animate(scale,      step.scale,      { duration: step.duration, ease: "easeInOut" }),
              animate(brightness, step.brightness, { duration: step.duration, ease: "easeInOut" }),
            ]);
          }
        }
      }
    }

    run();
    return () => { stopped = true; };
  }, [enabled, scale, brightness]);

  return { phase, label: PHASE_LABEL[phase], scale, brightness };
}
