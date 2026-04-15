"use client";

// Focusモード — 画面遷移を管理するオーケストレーター
//
// setup → coffee(3分ドリップ) → session → break → session... → summary

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import FocusSetup, { type FocusConfig } from "@/components/focus/FocusSetup";
import CoffeeTime from "@/components/focus/CoffeeTime";
import FocusSession from "@/components/focus/FocusSession";
import FocusBreak from "@/components/focus/FocusBreak";
import SessionSummary from "@/components/focus/SessionSummary";
import { useAudioStore } from "@/store/audioStore";

type Phase = "setup" | "coffee" | "session" | "break" | "summary";

export default function FocusPage() {
  const { audio, meta } = useAudioStore();

  // 再生中のFocusセッションがあれば直接sessionフェーズに復元
  const hasActiveSession = !!(audio && meta?.mode === "focus" && meta.config);
  const [phase, setPhase] = useState<Phase>(hasActiveSession ? "session" : "setup");
  const [config, setConfig] = useState<FocusConfig | null>(
    hasActiveSession ? (meta!.config as FocusConfig) : null
  );
  const [sets, setSets] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);

  const handleStart = useCallback((cfg: FocusConfig) => {
    setConfig(cfg);
    setPhase("coffee");
  }, []);

  const handleSkip = useCallback((cfg: FocusConfig) => {
    setConfig(cfg);
    setPhase("session");
  }, []);

  const handleCoffeeComplete = useCallback(() => {
    setPhase("session");
  }, []);

  const handleBreak = useCallback((actualMinutes: number) => {
    setSets((prev) => prev + 1);
    setTotalMinutes((prev) => prev + actualMinutes);
    setPhase("break");
  }, []);

  const handleNextSet = useCallback(() => {
    setPhase("session");
  }, []);

  const handleFinish = useCallback(() => {
    setPhase("summary");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "setup" && (
        <FocusSetup key="setup" onStart={handleStart} onSkip={handleSkip} />
      )}
      {phase === "coffee" && (
        <CoffeeTime key="coffee" onComplete={handleCoffeeComplete} onSkip={handleCoffeeComplete} />
      )}
      {phase === "session" && config && (
        <FocusSession key={`session-${sets}`} config={config} onBreak={handleBreak} />
      )}
      {phase === "break" && (
        <FocusBreak key="break" onNextSet={handleNextSet} onFinish={handleFinish} />
      )}
      {phase === "summary" && config && (
        <SessionSummary key="summary" sets={sets} totalMinutes={totalMinutes} task={config.task} />
      )}
    </AnimatePresence>
  );
}
