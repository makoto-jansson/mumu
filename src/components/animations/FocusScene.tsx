"use client";

// 集中セッション用アニメーション — ReclaimSense 細線イラストスタイル
// 夜の海 + 遠くの山 + 灯台（薄いストローク・fill なし・モノクロ）

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// ─────────────────────────────────────────────────
// 定数（灯台の光周期）
// ─────────────────────────────────────────────────
const CYCLE    = 10;  // 周期（秒）
const FADE_IN  = 2.5;
const HOLD     = 1.5;
const FADE_OUT = 2.5;

function eio(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function getBrightness(t: number): number {
  const m = ((t % CYCLE) + CYCLE) % CYCLE;
  if (m < FADE_IN)                   return eio(m / FADE_IN);
  if (m < FADE_IN + HOLD)            return 1;
  if (m < FADE_IN + HOLD + FADE_OUT) return eio(1 - (m - FADE_IN - HOLD) / FADE_OUT);
  return 0;
}

type MV = ReturnType<typeof useMotionValue<number>>;

// ─────────────────────────────────────────────────
// 流れ星（右上→左下の斜め）
// ─────────────────────────────────────────────────
const SS_COS = Math.cos(15 * Math.PI / 180);
const SS_SIN = Math.sin(15 * Math.PI / 180);

function ShootingStar({ sx, sy, delay, repeatDelay }: {
  sx: number; sy: number; delay: number; repeatDelay: number;
}) {
  const pf     = Math.min(1, Math.max(0, (sy - 10) / 80));
  const sw     = 0.22 + pf * 0.22;
  const peakOp = 0.36 + pf * 0.44;
  const dur    = 0.42 + pf * 0.20;
  const travel = 65  + pf * 35;
  const tail   = 14  + pf * 10;

  return (
    <motion.g
      animate={{
        x: [0, -travel * SS_COS],
        y: [0,  travel * SS_SIN],
        opacity: [0, peakOp, peakOp, 0],
      }}
      transition={{
        duration: dur,
        delay,
        repeat: Infinity,
        repeatDelay,
        ease: "easeIn",
        times: [0, 0.06, 0.78, 1],
      }}
    >
      <line
        x1={sx} y1={sy}
        x2={sx + tail * SS_COS} y2={sy - tail * SS_SIN}
        stroke="#e8e6e1" strokeWidth={sw} strokeLinecap="round"
      />
    </motion.g>
  );
}

// ─────────────────────────────────────────────────
// Sky：背景 + 月 + 星 + 流れ星
// ─────────────────────────────────────────────────
function Sky() {
  const STARS: [number, number, number, number][] = [
    [80,  18, 0.7, 0],  [140, 12, 0.6, 1],  [200, 30, 0.7, 2],
    [260, 22, 0.5, 3],  [320, 16, 0.7, 4],  [60,  38, 0.5, 5],
    [170, 45, 0.6, 6],  [230, 55, 0.5, 7],  [100, 52, 0.4, 8],
    [280, 48, 0.6, 9],  [350, 35, 0.6, 10], [190, 15, 0.5, 11],
    [130, 65, 0.4, 12], [305, 68, 0.5, 13], [42,  60, 0.4, 14],
  ];

  return (
    <>
      <rect width="360" height="240" fill="#0a0a0a" />

      {/* 流れ星 */}
      <ShootingStar sx={280} sy={15}  delay={5}  repeatDelay={44} />
      <ShootingStar sx={320} sy={62}  delay={18} repeatDelay={55} />
      <ShootingStar sx={240} sy={36}  delay={33} repeatDelay={48} />
      <ShootingStar sx={310} sy={24}  delay={52} repeatDelay={60} />

      {/* 月（三日月） */}
      <circle cx="295" cy="40" r="18" stroke="#e8e6e1" strokeWidth="0.8" opacity="0.45" fill="none" />
      {/* 少しずらした塗りで三日月を表現 */}
      <circle cx="299" cy="37" r="14" fill="#0a0a0a" />

      {/* 月の右下あたりに小さな星 */}
      <circle cx="324" cy="58" r="0.6" fill="#e8e6e1" opacity="0.20" />

      {/* 星々（まばたき） */}
      {STARS.map(([x, y, r, i]) => (
        <motion.circle
          key={i} cx={x} cy={y} r={r}
          fill="#e8e6e1"
          animate={{ opacity: [0.10, 0.45, 0.10] }}
          transition={{
            duration: 4.5 + i * 0.55,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.38,
          }}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────
// 遠くの山のシルエット（細線）
// ─────────────────────────────────────────────────
function Mountains() {
  return (
    <path
      d="M0 130 L20 108 L38 118 L58 94 L80 112 L105 86 L130 104 L160 78 L190 96 L220 82 L250 98 L280 76 L308 90 L330 80 L355 94 L360 92 L360 130 Z"
      stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round"
      fill="none" opacity="0.20"
    />
  );
}

// ─────────────────────────────────────────────────
// 地平線
// ─────────────────────────────────────────────────
function Horizon() {
  return (
    <line
      x1="0" y1="140" x2="360" y2="140"
      stroke="#e8e6e1" strokeWidth="0.6" opacity="0.35"
    />
  );
}

// ─────────────────────────────────────────────────
// 波（ストロークのみ、アニメーション）
// ─────────────────────────────────────────────────
function Waves() {
  const LAYERS = [
    { y: 148, amp: 4,  alpha: 0.22, sw: 0.7, dur: 13.0, delay: 0.0 },
    { y: 162, amp: 7,  alpha: 0.13, sw: 0.6, dur:  9.5, delay: 0.9 },
    { y: 180, amp: 10, alpha: 0.08, sw: 0.5, dur:  7.5, delay: 1.6 },
  ];

  return (
    <g>
      {LAYERS.map((l, i) => (
        <motion.path
          key={i}
          d={`M0 ${l.y} C90 ${l.y - l.amp} 270 ${l.y + l.amp} 360 ${l.y}`}
          stroke="#e8e6e1"
          strokeWidth={l.sw}
          strokeLinecap="round"
          fill="none"
          opacity={l.alpha}
          animate={{
            d: [
              `M0 ${l.y} C90 ${l.y - l.amp} 270 ${l.y + l.amp} 360 ${l.y}`,
              `M0 ${l.y} C90 ${l.y + l.amp} 270 ${l.y - l.amp} 360 ${l.y}`,
            ],
          }}
          transition={{
            duration: l.dur,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: l.delay,
          }}
        />
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────────
// 灯台の光の水面反射（細い縦線 3本、brightness 連動）
// ─────────────────────────────────────────────────
function Reflection({ clock }: { clock: MV }) {
  const brightness = useTransform(clock, (t) => {
    const shifted = ((t - 0.8) % CYCLE + CYCLE) % CYCLE;
    return getBrightness(shifted);
  });
  const opacityA = useTransform(brightness, [0, 1], [0, 0.12]);
  const opacityB = useTransform(brightness, [0, 1], [0, 0.18]);

  return (
    <g>
      <motion.line x1="59" y1="141" x2="56" y2="200" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" style={{ opacity: opacityA }} />
      <motion.line x1="62" y1="141" x2="62" y2="210" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" style={{ opacity: opacityB }} />
      <motion.line x1="65" y1="141" x2="68" y2="200" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" style={{ opacity: opacityA }} />
    </g>
  );
}

// ─────────────────────────────────────────────────
// 灯台（IllustAbout スタイル — テーパー塔 + 灯室 + 光線）
//   中心 x=62、地平線 y=140 の上に配置
// ─────────────────────────────────────────────────
function SceneLighthouse({ clock }: { clock: MV }) {
  const brightness  = useTransform(clock, getBrightness);
  const coreOpacity = useTransform(brightness, [0, 1], [0.30, 0.80]);
  const glowOpacity = useTransform(brightness, [0, 1], [0,    0.06]);
  const rayOpacity  = useTransform(brightness, [0, 1], [0,    0.20]);
  const rayOpacity2 = useTransform(brightness, [0, 1], [0,    0.12]);

  return (
    <g>
      {/* 丘の輪郭（灯台の土台）*/}
      <path
        d="M22 140 C40 137 54 133 62 130 C70 133 82 137 98 140"
        stroke="#e8e6e1" strokeWidth="0.7" fill="none" opacity="0.28"
      />

      {/* 光のグロー（brightness 連動）*/}
      <motion.circle cx="62" cy="109" r="18" fill="#e8e6e1" style={{ opacity: glowOpacity }} />

      {/* 塔本体（IllustAbout と同じテーパー形）*/}
      <path
        d="M58 138 L60 110 L64 110 L66 138 Z"
        stroke="#e8e6e1" strokeWidth="0.75" fill="#0a0a0a" strokeLinejoin="round" strokeOpacity="0.45"
      />

      {/* 灯室（シンプルな rect）*/}
      <rect x="59" y="105" width="6" height="5" rx="0.5"
        stroke="#e8e6e1" strokeWidth="0.7" fill="#0a0a0a" strokeOpacity="0.50"
      />

      {/* 基部（水平線）*/}
      <line x1="52" y1="138" x2="72" y2="138"
        stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.40"
      />

      {/* 光線（左）: brightness 連動 */}
      <motion.path d="M59 107 L-30 178" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" style={{ opacity: rayOpacity }} />
      <motion.path d="M59 107 L16 158" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" style={{ opacity: rayOpacity2 }} />

      {/* 光線（右）: brightness 連動 */}
      <motion.path d="M65 107 L380 165" stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" style={{ opacity: rayOpacity }} />
      <motion.path d="M65 107 L295 150" stroke="#e8e6e1" strokeWidth="0.4" strokeLinecap="round" style={{ opacity: rayOpacity2 }} />

      {/* 光源コア（brightness 連動）*/}
      <motion.circle cx="62" cy="107.5" r="1.5" fill="#e8e6e1" style={{ opacity: coreOpacity }} />
    </g>
  );
}

// ─────────────────────────────────────────────────
// FocusScene（メイン）
// ─────────────────────────────────────────────────
export default function FocusScene() {
  const clock = useMotionValue(0);

  useEffect(() => {
    const c = animate(clock, CYCLE, {
      duration: CYCLE,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
    return () => c.stop();
  }, [clock]);

  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="hidden"
      aria-label="夜の海と遠くの灯台"
    >
      {/* 1. 空（背景 + 月 + 星 + 流れ星） */}
      <Sky />

      {/* 2. 遠くの山シルエット（細線） */}
      <Mountains />

      {/* 3. 地平線 */}
      <Horizon />

      {/* 4. 波（ストロークのみ） */}
      <Waves />

      {/* 5. 水面反射（brightness 連動） */}
      <Reflection clock={clock} />

      {/* 6. 灯台（細線スタイル） */}
      <SceneLighthouse clock={clock} />
    </svg>
  );
}
