"use client";

// Reclaim Step 3: 沈殿
// 深海に感性の粒子がゆっくり降り積もる30秒体験

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepBar, { RECLAIM_STEPS } from "@/components/focus/StepBar";
import type { FeelResult } from "./ReclaimFeel";
import { playClick } from "@/lib/playSound";

// ─ タイミング ────────────────────────────────────────
const INTRO_S   = 4;
const SETTLE_S  = 5;
const ANIMATE_S = 30;
const TOTAL_S   = INTRO_S + ANIMATE_S;

// ─ レイヤーカラー ────────────────────────────────────
const LAYER_COLORS: Record<string, string> = {
  sensory:  "#FBBF24",
  scene:    "#38BDF8",
  tempo:    "#34D399",
  relation: "#FB7185",
  abstract: "#A78BFA",
  values:   "#22D3EE",
};

// ─ SVG座標系 ─────────────────────────────────────────
const VW = 360;
const VH = 680;
const FLOOR_Y  = 520;
const SETTLE_Y = 535; // 全粒子の着底y（海底面）

// ─ 型定義 ────────────────────────────────────────────
type AnimPhase = "falling" | "settled";

type Particle = {
  id: string;
  color: string;
  r: number;
  startX: number;  // 出現x位置
  driftX: number;  // 落下中の横ずれ（小さく自然に）
  delay:    number;
  duration: number;
};

// ─ 粒子生成 ──────────────────────────────────────────
function createParticle(id: string, color: string): Particle {
  return {
    id,
    color,
    r:        3 + Math.random() * 6,
    startX:   60 + Math.random() * 240,   // 両壁を避けた中央帯
    driftX:   (Math.random() - 0.5) * 22, // ±11px、ゆっくり漂う程度
    delay:    Math.random() * 22,
    duration: 16 + Math.random() * 8,
  };
}

function makeParticles(feelResults: FeelResult[]): Particle[] {
  const particles: Particle[] = [];
  const allColors = Object.values(LAYER_COLORS);

  for (const result of feelResults) {
    const count = 3 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      particles.push(createParticle(
        `${result.cardId}_${i}`,
        LAYER_COLORS[result.layer] ?? "#e8e6e1",
      ));
    }
  }
  while (particles.length < 40) {
    const color = allColors[particles.length % allColors.length];
    particles.push(createParticle(`extra_${particles.length}`, color));
  }
  return particles;
}

function fmt(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

// ─ 閉じた目 ──────────────────────────────────────────
function ClosedEyes() {
  return (
    <svg viewBox="0 0 72 22" width="72" height="22" fill="none">
      <path d="M 2 12 Q 14 19 26 12" stroke="rgba(232,230,225,0.35)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="7"  y1="12" x2="5"  y2="5"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="14" y1="15" x2="14" y2="7"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="21" y1="12" x2="23" y2="5"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M 46 12 Q 58 19 70 12" stroke="rgba(232,230,225,0.35)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="51" y1="12" x2="49" y2="5"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="58" y1="15" x2="58" y2="7"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
      <line x1="65" y1="12" x2="67" y2="5"  stroke="rgba(232,230,225,0.22)" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

// ─ 海藻 ──────────────────────────────────────────────
function SeaWeed({ x, baseY, height, period, phase }: {
  x: number; baseY: number; height: number; period: number; phase: number;
}) {
  const mid = baseY - height * 0.55;
  const top = baseY - height;
  return (
    <motion.path
      strokeWidth="0.8" stroke="#e8e6e1" strokeOpacity="0.28" fill="none" strokeLinecap="round"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      animate={{ d: [
        `M ${x} ${baseY} Q ${x - 8} ${mid} ${x} ${top}`,
        `M ${x} ${baseY} Q ${x + 8} ${mid} ${x} ${top}`,
        `M ${x} ${baseY} Q ${x - 8} ${mid} ${x} ${top}`,
      ] as any }}
      transition={{ repeat: Infinity, duration: period, ease: "easeInOut", delay: phase }}
    />
  );
}

// ─ 海底・側壁 イラスト ────────────────────────────────
function SeaScene({ glowing }: { glowing: boolean }) {
  return (
    <>
      {/* ════ 左壁シルエット（左岩山の始点 x=0,y=542 で止める） ════ */}
      <path
        d="M 0 200 L 15 215
           L 16 278
           L 44 328
           L 36 374
           L 34 415
           L 62 462
           L 50 505
           L 0 542"
        stroke="#e8e6e1" strokeWidth="0.8" strokeOpacity="0.22"
        fill="none" strokeLinejoin="round" strokeLinecap="round"
      />

      {/* ════ 右壁シルエット（右岩山の始点 x=360,y=542 で止める） ════ */}
      <path
        d="M 360 200 L 345 215
           L 344 278
           L 316 328
           L 324 374
           L 326 415
           L 298 462
           L 310 505
           L 360 542"
        stroke="#e8e6e1" strokeWidth="0.8" strokeOpacity="0.22"
        fill="none" strokeLinejoin="round" strokeLinecap="round"
      />

      {/* ════ 海底の風景（LANDSCAPE_ICON と同じトンマナ） ════ */}

      {/* 左の岩山シルエット（遠くの山と同じスタイル） */}
      <path
        d="M 0 542 L 28 524 L 48 534 L 70 519 L 96 532 L 118 542"
        stroke="#e8e6e1" strokeWidth="0.8" strokeOpacity="0.22"
        fill="none" strokeLinejoin="round"
      />
      {/* 右の岩山シルエット */}
      <path
        d="M 242 542 L 268 527 L 292 537 L 318 522 L 344 533 L 360 542"
        stroke="#e8e6e1" strokeWidth="0.8" strokeOpacity="0.22"
        fill="none" strokeLinejoin="round"
      />
      {/* 中央の小岩 */}
      <path
        d="M 148 542 L 166 531 L 182 537 L 200 528 L 218 542"
        stroke="#e8e6e1" strokeWidth="0.7" strokeOpacity="0.14"
        fill="none" strokeLinejoin="round"
      />

      {/* 海底面ライン（地平線スタイル） */}
      <line x1="0" y1="542" x2="360" y2="542"
        stroke="#e8e6e1" strokeWidth="0.6" strokeOpacity="0.32" />

      {/* 海底の層（波スタイル・3本、遠ざかるほど薄く） */}
      <path d="M 0 553 C 60 550 120 556 180 552 C 240 548 300 554 360 551"
        stroke="#e8e6e1" strokeWidth="0.7" strokeOpacity="0.15"
        fill="none" strokeLinecap="round" />
      <path d="M 0 566 C 70 563 140 568 210 564 C 280 560 330 566 360 563"
        stroke="#e8e6e1" strokeWidth="0.6" strokeOpacity="0.08"
        fill="none" strokeLinecap="round" />
      <path d="M 0 580 C 80 577 160 582 240 578 C 300 575 340 580 360 577"
        stroke="#e8e6e1" strokeWidth="0.5" strokeOpacity="0.05"
        fill="none" strokeLinecap="round" />

      {/* 海藻 */}
      <SeaWeed x={130} baseY={542} height={50} period={4.5} phase={0}   />
      <SeaWeed x={156} baseY={542} height={36} period={3.8} phase={1.0} />
      <SeaWeed x={238} baseY={542} height={44} period={5.0} phase={1.9} />
      <SeaWeed x={258} baseY={542} height={32} period={4.2} phase={0.5} />

      {/* 着底後の発光グロー */}
      <motion.ellipse
        cx={VW / 2} cy={FLOOR_Y + 20}
        rx={VW / 2 - 50} ry={16}
        fill="rgba(130,180,235,0.08)"
        style={{ filter: "blur(14px)" }}
        animate={{
          opacity: glowing ? 1 : 0,
          ry:      glowing ? [14, 20, 14] : 16,
        }}
        transition={
          glowing
            ? { opacity: { duration: 2.5 }, ry: { repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 } }
            : { duration: 0.5 }
        }
      />
    </>
  );
}

// ─ コンポーネント ────────────────────────────────────
type Props = { feelResults: FeelResult[]; onDone: () => void };

export default function ReclaimSettle({ feelResults, onDone }: Props) {
  const [introVisible, setIntroVisible] = useState(true);
  const [animPhase, setAnimPhase]       = useState<AnimPhase>("falling");
  const [countdown, setCountdown]       = useState(ANIMATE_S);
  const [exiting, setExiting]           = useState(false);

  const particles = useMemo(() => makeParticles(feelResults), [feelResults]);

  useEffect(() => {
    const t = setTimeout(() => setIntroVisible(false), INTRO_S * 1000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (introVisible) return;
    const t = setTimeout(() => setAnimPhase("settled"), (ANIMATE_S - SETTLE_S) * 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [introVisible]);

  useEffect(() => {
    if (introVisible) return;
    const iv = setInterval(() => {
      setCountdown((c) => { if (c <= 1) { clearInterval(iv); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(iv);
  }, [introVisible]);

  useEffect(() => {
    const t = setTimeout(() => { setExiting(true); setTimeout(onDone, 1000); }, TOTAL_S * 1000);
    return () => clearTimeout(t);
  }, [onDone]);

  const handleSkip = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setExiting(true);
    setTimeout(onDone, 800);
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden"
      style={{ background: "#07090e" }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: 1 }}
    >
      <StepBar steps={RECLAIM_STEPS} current="settle" />

      {/* ── 導入テキスト ── */}
      <AnimatePresence>
        {introVisible && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center px-14 pointer-events-none"
          >
            <div className="flex flex-col items-center gap-7">
              <ClosedEyes />
              <p className="text-[#e8e6e1]/45 text-[11px] font-light leading-[2.6] tracking-[0.22em] text-center">
                目を閉じてください。<br /><br />
                感じたことが、<br />
                静かに沈んでいくのを<br />
                待ちましょう。
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── 深海アニメーション ── */}
      <div className="relative flex-1">
        <AnimatePresence>
          {!introVisible && (
            <motion.div
              key="deep"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0"
            >
              {/* 深海グラデーション */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, #07090e 0%, #070a12 50%, #060c18 80%, #050b15 100%)",
                }}
              />

              <svg
                viewBox={`0 0 ${VW} ${VH}`}
                width="100%"
                height="100%"
                preserveAspectRatio="xMidYMid meet"
                style={{ display: "block", position: "absolute", inset: 0 }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <filter id="orb" x="-80%" y="-80%" width="260%" height="260%">
                    <feGaussianBlur stdDeviation="3" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {/* 1. 海底・側壁イラスト（背景） */}
                <SeaScene glowing={animPhase === "settled"} />

                {/* 2. 粒子（一定速度で降る） */}
                {particles.map((p) => (
                  <motion.circle
                    key={p.id}
                    r={p.r}
                    fill={p.color}
                    filter="url(#orb)"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    initial={{ cx: p.startX, cy: -20, opacity: 0 } as any}
                    animate={{
                      // 出現位置からわずかに横に漂いながら真下へ沈む
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      cx: (p.startX + p.driftX) as any,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      cy: SETTLE_Y as any,
                      opacity: [0, 0.68, 0.68, 0.48],
                    }}
                    transition={{
                      cx:      { duration: p.duration, ease: "linear", delay: p.delay },
                      cy:      { duration: p.duration, ease: "linear", delay: p.delay },
                      opacity: { duration: p.duration, delay: p.delay, times: [0, 0.15, 0.82, 1] },
                    }}
                  />
                ))}
              </svg>

              {/* カウントダウン + プログレスバー + スキップ */}
              <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3">
                <div
                  className="flex flex-col items-center gap-2.5 px-5 py-2.5 rounded-full"
                  style={{ background: "rgba(7,9,14,0.72)", backdropFilter: "blur(6px)" }}
                >
                  <span className="text-[#e8e6e1]/45 text-[11px] font-light tracking-[0.3em] tabular-nums">
                    {fmt(countdown)}
                  </span>
                  <div
                    className="relative overflow-hidden rounded-full"
                    style={{ width: "min(48vw, 180px)", height: "1.5px", background: "rgba(232,230,225,0.08)" }}
                  >
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 rounded-full"
                      style={{ background: "rgba(232,230,225,0.22)" }}
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: ANIMATE_S, ease: "linear" }}
                    />
                  </div>
                </div>
                {/* スキップボタン（常時表示） */}
                <button
                  onClick={(e) => { playClick(); handleSkip(e); }}
                  className="text-[#e8e6e1]/25 text-[11px] font-light tracking-[0.25em] hover:text-[#e8e6e1]/50 transition-colors duration-200"
                >
                  スキップ →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </motion.div>
  );
}
