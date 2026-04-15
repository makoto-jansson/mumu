"use client";

// Relaxモード — 画面遷移オーケストレーター
// setup → coffee → session → done

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import RelaxSetup, { type RelaxConfig } from "@/components/relax/RelaxSetup";
import CoffeeTime from "@/components/focus/CoffeeTime";
import RelaxSession from "@/components/relax/RelaxSession";
import RelaxDone from "@/components/relax/RelaxDone";
import { RELAX_STEPS } from "@/components/focus/StepBar";
import { useAudioStore } from "@/store/audioStore";

type Phase = "setup" | "coffee" | "session" | "done";

export default function RelaxPage() {
  const { audio, meta } = useAudioStore();

  // 再生中のRelaxセッションがあれば直接sessionフェーズに復元
  const hasActiveSession = !!(audio && meta?.mode === "relax" && meta.config);
  const [phase,  setPhase]  = useState<Phase>(hasActiveSession ? "session" : "setup");
  const [config, setConfig] = useState<RelaxConfig | null>(
    hasActiveSession ? (meta!.config as RelaxConfig) : null
  );

  const handleStart = useCallback((cfg: RelaxConfig) => {
    setConfig(cfg);
    setPhase("coffee");
  }, []);

  const handleSkip       = useCallback((cfg: RelaxConfig) => {
    setConfig(cfg);
    setPhase("session");
  }, []);

  const handleCoffeeDone = useCallback(() => setPhase("session"), []);
  const handleDone       = useCallback(() => setPhase("done"),    []);

  return (
    <AnimatePresence mode="wait">
      {phase === "setup" && (
        <RelaxSetup key="setup" onStart={handleStart} onSkip={handleSkip} />
      )}
      {phase === "coffee" && (
        <CoffeeTime key="coffee" steps={RELAX_STEPS} onComplete={handleCoffeeDone} onSkip={handleCoffeeDone} />
      )}
      {phase === "session" && config && (
        <RelaxSession key="session" config={config} onDone={handleDone} />
      )}
      {phase === "done" && config && (
        <RelaxDone key="done" mood={config.mood} duration={config.duration} />
      )}
    </AnimatePresence>
  );
}
