"use client";

// Reclaim 画面遷移オーケストレーター
// intro → (coffee) → sense → feel → settle → done

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import ReclaimIntro from "@/components/reclaim/ReclaimIntro";
import ReclaimSense from "@/components/reclaim/ReclaimSense";
import ReclaimFeel, { type FeelResult } from "@/components/reclaim/ReclaimFeel";
import ReclaimSettle from "@/components/reclaim/ReclaimSettle";
import ReclaimDone from "@/components/reclaim/ReclaimDone";
import CoffeeTime from "@/components/focus/CoffeeTime";
import { RECLAIM_STEPS } from "@/components/focus/StepBar";

type Phase = "intro" | "coffee" | "sense" | "feel" | "settle" | "done";

export default function ReclaimPage() {
  const [phase, setPhase]   = useState<Phase>("intro");
  const [hasCoffee, setHasCoffee] = useState(false);

  // セッションデータ
  const [senseResponse, setSenseResponse] = useState("");
  const [feelResults, setFeelResults]     = useState<FeelResult[]>([]);

  const handleCoffee = useCallback(() => {
    setHasCoffee(true);
    setPhase("coffee");
  }, []);
  const handleSkipCoffee = useCallback(() => {
    setHasCoffee(false);
    setPhase("sense");
  }, []);
  const handleCoffeeDone = useCallback(() => setPhase("sense"), []);

  const handleSense = useCallback((response: string) => {
    setSenseResponse(response);
    setPhase("feel");
  }, []);

  const handleFeel = useCallback((results: FeelResult[]) => {
    setFeelResults(results);
    setPhase("settle");
  }, []);

  const handleSettle = useCallback(() => {
    setPhase("done");
  }, []);

  const handleRestart = useCallback(() => {
    setSenseResponse("");
    setFeelResults([]);
    setPhase("intro");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "intro" && (
        <ReclaimIntro key="intro" onCoffee={handleCoffee} onSkip={handleSkipCoffee} />
      )}
      {phase === "coffee" && (
        <CoffeeTime
          key="coffee"
          steps={RECLAIM_STEPS}
          stepKey="sense"
          onComplete={handleCoffeeDone}
          onSkip={handleCoffeeDone}
        />
      )}
      {phase === "sense" && (
        <ReclaimSense key="sense" hasCoffee={hasCoffee} onDone={handleSense} />
      )}
      {phase === "feel" && (
        <ReclaimFeel key="feel" onDone={handleFeel} />
      )}
      {phase === "settle" && (
        <ReclaimSettle key="settle" feelResults={feelResults} onDone={handleSettle} />
      )}
      {phase === "done" && (
        <ReclaimDone
          key="done"
          senseResponse={senseResponse}
          feelResults={feelResults}
          onRestart={handleRestart}
        />
      )}
    </AnimatePresence>
  );
}
