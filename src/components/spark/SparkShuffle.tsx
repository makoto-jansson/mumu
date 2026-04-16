"use client";

// Spark Shuffle — 9マスカード × 裏返しタップ × テーマ単位スワイプ

import { useState, useMemo, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import StepBar, { SPARK_STEPS } from "@/components/focus/StepBar";
import SparkAmbient from "./SparkAmbient";
import sparkData from "@/data/sparkCardsV2.json";
import { playClick } from "@/lib/playSound";

// ---- 型定義 ----
export type OsborneCategory =
  | "adapt" | "apply" | "modify"
  | "magnify" | "minify" | "substitute"
  | "rearrange" | "reverse" | "combine";

const CATEGORY_LABEL: Record<OsborneCategory, string> = {
  adapt:      "転用",
  apply:      "応用",
  modify:     "変更",
  magnify:    "拡大",
  minify:     "縮小",
  substitute: "代用",
  rearrange:  "再配置",
  reverse:    "逆転",
  combine:    "結合",
};

const CATEGORY_COLOR: Record<OsborneCategory, string> = {
  adapt:      "text-amber-400/70",
  apply:      "text-teal-300/70",
  modify:     "text-sky-400/70",
  magnify:    "text-orange-300/70",
  minify:     "text-violet-400/70",
  substitute: "text-pink-400/70",
  rearrange:  "text-lime-400/70",
  reverse:    "text-rose-400/70",
  combine:    "text-cyan-400/70",
};

const CATEGORIES: OsborneCategory[] = [
  "adapt", "apply", "modify",
  "magnify", "minify", "substitute",
  "rearrange", "reverse", "combine",
];

// テーマ単位で保存
export type KeptTheme = {
  themeId: string;
  themeLabel: string;
  keywords: Record<OsborneCategory, string>;
};

type ThemeCards = Record<OsborneCategory, string[]>;

type Theme = {
  id: string;
  label: string;
  cards: ThemeCards;
};

const SESSION_CARDS = 6;

function getThemesForScene(sceneId: string): Theme[] {
  const data = sparkData as {
    scenes: Array<{ id: string; label: string; themes: Theme[] }>;
  };
  let themes: Theme[];
  if (sceneId === "random") {
    themes = data.scenes.flatMap((s) => s.themes);
  } else {
    const scene = data.scenes.find((s) => s.id === sceneId);
    themes = scene ? scene.themes : data.scenes[0].themes;
  }
  const shuffled = [...themes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, SESSION_CARDS);
}

function pickKeywords(theme: Theme): Record<OsborneCategory, string> {
  const picked: Partial<Record<OsborneCategory, string>> = {};
  for (const cat of CATEGORIES) {
    const candidates = theme.cards[cat] ?? [];
    picked[cat] = candidates[Math.floor(Math.random() * candidates.length)] ?? "";
  }
  return picked as Record<OsborneCategory, string>;
}

// ---- 1マスのフリップセル ----
function FlipCell({
  cat,
  keyword,
  isFlipped,
  onFlip,
}: {
  cat: OsborneCategory;
  keyword: string;
  isFlipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div
      className="relative min-h-[82px] cursor-pointer"
      style={{ perspective: 600 }}
      onClick={() => { playClick(); onFlip(); }}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", position: "relative", width: "100%", height: "100%" }}
        className="min-h-[82px]"
      >
        {/* 表面：カテゴリ名のみ */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#141414] min-h-[82px]"
          style={{ backfaceVisibility: "hidden" }}
        >
          <span className={`text-[11px] font-light tracking-wider ${CATEGORY_COLOR[cat]}`}>
            {CATEGORY_LABEL[cat]}
          </span>
          <span className="text-white/10 text-[8px] mt-1.5 tracking-widest">tap</span>
        </div>

        {/* 裏面：キーワード */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#1a1a1a] min-h-[82px] px-2"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className={`text-[9px] font-light tracking-wider mb-1.5 ${CATEGORY_COLOR[cat]}`}>
            {CATEGORY_LABEL[cat]}
          </span>
          <span className="text-[#e8e6e1]/80 text-[11px] font-light leading-snug text-center">
            {keyword}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// ---- Props ----
type Props = {
  sceneId: string;
  onDone: (kept: KeptTheme[]) => void;
};

export default function SparkShuffle({ sceneId, onDone }: Props) {
  const themes = useMemo(() => getThemesForScene(sceneId), [sceneId]);
  const allKeywords = useMemo(() => themes.map((t) => pickKeywords(t)), [themes]);

  const [idx, setIdx] = useState(0);
  const [kept, setKept] = useState<KeptTheme[]>([]);
  // 現在カードのどのマスが表向きか
  const [flipped, setFlipped] = useState<Set<OsborneCategory>>(new Set());
  const animating = useRef(false);
  const [showHint, setShowHint] = useState(true);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-220, 220], [-12, 12]);
  const keepOp = useTransform(x, [30, 120], [0, 1]);
  const skipOp = useTransform(x, [-120, -30], [1, 0]);

  const current = themes[idx];
  const next = themes[idx + 1];
  const keywords = current ? allKeywords[idx] : null;
  const done = idx >= themes.length;

  const flipCell = (cat: OsborneCategory) => {
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  const advance = useCallback(
    (keep: boolean) => {
      if (keep && current && keywords) {
        setKept((k) => [
          ...k,
          { themeId: current.id, themeLabel: current.label, keywords },
        ]);
      }
      setFlipped(new Set());
      setIdx(idx + 1);
      x.set(0);
      animating.current = false;
      if (showHint) setShowHint(false);
    },
    [idx, current, keywords, x, showHint]
  );

  const swipe = useCallback(
    (dir: "keep" | "skip") => {
      if (animating.current) return;
      animating.current = true;
      const target = dir === "keep" ? window.innerWidth * 1.5 : -window.innerWidth * 1.5;
      animate(x, target, { duration: 0.28, ease: "easeOut" }).then(() => {
        advance(dir === "keep");
      });
    },
    [x, advance]
  );

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (animating.current) return;
    const threshold = window.innerWidth * 0.28;
    if (info.offset.x > threshold) swipe("keep");
    else if (info.offset.x < -threshold) swipe("skip");
    else animate(x, 0, { type: "spring", stiffness: 400, damping: 28 });
  };

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 bg-[#0a0a0a] flex flex-col"
      >
        <StepBar steps={SPARK_STEPS} current="shuffle" />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-8">
          <p className="text-[#e8e6e1]/50 text-sm font-light text-center">
            {kept.length > 0 ? `${kept.length}テーマをキープしました` : "カードが終わりました"}
          </p>
          <button
            onClick={() => { playClick(); onDone(kept); }}
            className="px-8 py-3 border border-[#EF9F27]/40 text-[#EF9F27]/80 text-sm font-light tracking-wider hover:bg-[#EF9F27]/10 transition-all duration-300"
          >
            次のステップへ →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-[#0a0a0a] flex flex-col"
    >
      <SparkAmbient />

      <div className="relative z-10 flex flex-col h-full">
        <StepBar steps={SPARK_STEPS} current="shuffle" />

        {/* kept カウンター */}
        <div className="flex justify-end px-6 max-w-sm mx-auto w-full h-5">
          {kept.length > 0 && (
            <span className="text-[#EF9F27]/50 text-[10px] font-light tracking-wider">
              {kept.length} kept
            </span>
          )}
        </div>

        {/* カードエリア */}
        <div className="flex-1 flex items-center justify-center relative px-4">

          {/* 次のカード（奥に薄く）*/}
          {next && (
            <div
              className="absolute w-full max-w-[320px]"
              style={{ transform: "scale(0.95) translateY(10px)" }}
            >
              <div className="bg-[#111111] border border-white/5 p-4">
                <div className="flex flex-col items-center gap-1 mb-3">
                  <span className="text-[#e8e6e1]/10 text-[9px] font-light tracking-[0.35em]">テーマ</span>
                  <span className="text-[#e8e6e1]/20 text-sm font-light">{next.label}</span>
                </div>
                <div className="grid grid-cols-3 gap-px bg-white/4">
                  {CATEGORIES.map((cat) => (
                    <div key={cat} className="bg-[#111111] flex items-center justify-center min-h-[82px]">
                      <span className={`text-[10px] font-light tracking-wider opacity-30 ${CATEGORY_COLOR[cat]}`}>
                        {CATEGORY_LABEL[cat]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 現在のカード */}
          <AnimatePresence mode="wait">
            {current && keywords && (
              <motion.div
                key={current.id}
                drag="x"
                style={{ x, rotate }}
                onDragEnd={handleDragEnd}
                dragMomentum={false}
                dragElastic={0.05}
                className="absolute w-full max-w-[320px] bg-[#111111] border border-white/8 select-none cursor-grab active:cursor-grabbing"
              >
                {/* KEEP スタンプ */}
                <motion.div
                  style={{ opacity: keepOp }}
                  className="absolute top-4 right-4 border-2 border-[#4ade80] text-[#4ade80] text-[10px] font-bold tracking-widest px-2 py-0.5 rotate-[-15deg] z-10 pointer-events-none"
                >
                  KEEP
                </motion.div>

                {/* PASS スタンプ */}
                <motion.div
                  style={{ opacity: skipOp }}
                  className="absolute top-4 left-4 border-2 border-[#f87171] text-[#f87171] text-[10px] font-bold tracking-widest px-2 py-0.5 rotate-[15deg] z-10 pointer-events-none"
                >
                  PASS
                </motion.div>

                <div className="p-4">
                  {/* テーマ名 */}
                  <div className="flex flex-col items-center gap-1 mb-3">
                    <span className="text-[#e8e6e1]/20 text-[9px] font-light tracking-[0.35em]">テーマ</span>
                    <span className="text-[#e8e6e1]/70 text-sm font-light tracking-wide">{current.label}</span>
                  </div>

                  {/* 9マスグリッド */}
                  <div className="grid grid-cols-3 gap-px bg-white/6">
                    {CATEGORIES.map((cat) => (
                      <FlipCell
                        key={cat}
                        cat={cat}
                        keyword={keywords[cat]}
                        isFlipped={flipped.has(cat)}
                        onFlip={() => flipCell(cat)}
                      />
                    ))}
                  </div>

                  {/* カード番号 */}
                  <div className="text-center mt-3">
                    <span className="text-[#e8e6e1]/20 text-[10px] font-light tracking-widest">
                      {idx + 1} / {themes.length}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 操作ボタン */}
        <div className="pb-20 px-6 max-w-sm mx-auto w-full">
          <div className="flex gap-3">
            <button
              onClick={() => { playClick(); swipe("skip"); }}
              className="flex-1 py-3 border border-white/12 text-[#e8e6e1]/35 text-sm font-light tracking-wider hover:border-white/25 hover:text-[#e8e6e1]/60 transition-all duration-200"
            >
              ← パス
            </button>
            <button
              onClick={() => { playClick(); swipe("keep"); }}
              className="flex-1 py-3 border border-[#4ade80]/25 text-[#4ade80]/50 text-sm font-light tracking-wider hover:border-[#4ade80]/45 hover:text-[#4ade80]/80 transition-all duration-200"
            >
              キープ →
            </button>
          </div>

          {/* 初回ヒント */}
          <AnimatePresence>
            {showHint && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-[#e8e6e1]/20 text-[10px] font-light mt-3 tracking-wider"
              >
                マスをタップして裏返す / スワイプでキープ or パス
              </motion.p>
            )}
          </AnimatePresence>

          {/* 途中で完了 */}
          <AnimatePresence>
            {kept.length >= 2 && (
              <motion.button
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => { playClick(); onDone(kept); }}
                className="w-full mt-3 py-2 text-[#EF9F27]/50 text-xs font-light tracking-wider hover:text-[#EF9F27]/80 transition-colors duration-200"
              >
                {kept.length}テーマキープ — 次のステップへ →
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
