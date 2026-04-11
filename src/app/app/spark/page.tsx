"use client";

// Spark v2 — 画面遷移オーケストレーター
// guide → shuffle → mygrid → done

import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SparkGuide from "@/components/spark/SparkGuide";
import SparkShuffle from "@/components/spark/SparkShuffle";
import type { KeptTheme } from "@/components/spark/SparkShuffle";
import SparkMyGrid, { type MyGridResult } from "@/components/spark/SparkMyGrid";
import SparkDone from "@/components/spark/SparkDone";

type Phase = "guide" | "shuffle" | "mygrid" | "done";

export default function SparkPage() {
  const [phase,  setPhase]  = useState<Phase>("guide");
  const [kept,   setKept]   = useState<KeptTheme[]>([]);
  const [myGrid, setMyGrid] = useState<MyGridResult>({ theme: "", cells: {} });

  const handleGuide   = useCallback(()                => {             setPhase("shuffle"); }, []);
  const handleShuffle = useCallback((k: KeptTheme[])  => { setKept(k); setPhase("mygrid");  }, []);
  const handleMyGrid  = useCallback((r: MyGridResult) => { setMyGrid(r); setPhase("done");  }, []);

  const handleRestart = useCallback(() => {
    setKept([]);
    setMyGrid({ theme: "", cells: {} });
    setPhase("guide");
  }, []);

  return (
    <AnimatePresence mode="wait">
      {phase === "guide" && (
        <SparkGuide key="guide" onStart={handleGuide} />
      )}
      {phase === "shuffle" && (
        <SparkShuffle key="shuffle" sceneId="making" onDone={handleShuffle} />
      )}
      {phase === "mygrid" && (
        <SparkMyGrid key="mygrid" kept={kept} onDone={handleMyGrid} />
      )}
      {phase === "done" && (
        <SparkDone
          key="done"
          kept={kept}
          myGrid={myGrid}
          sceneLabel="ものをつくりたい"
          onRestart={handleRestart}
        />
      )}
    </AnimatePresence>
  );
}
