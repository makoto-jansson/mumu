"use client";

// 集中セッション用アニメーション
// 霧のかかった夜の海 + 遠くの丘の上の灯台
// 10秒周期でゆっくり明滅 → 水面に反射光
//
// レイヤー順（SVG は後ろが上）:
//   Sky → Waves → Reflection → Fog → Hill+Lighthouse body → Glow

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

// ─────────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────────
const CYCLE    = 10;   // 周期（秒）
const FADE_IN  = 2.5;  // フェードイン
const HOLD     = 1.5;  // 最大輝度キープ
const FADE_OUT = 2.5;  // フェードアウト
// 消灯 = 10 - 2.5 - 1.5 - 2.5 = 3.5 秒

// ease-in-out（2次近似）
function eio(t: number): number {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

// クロック値（0〜CYCLE）→ 輝度（0〜1）
function getBrightness(t: number): number {
  const m = ((t % CYCLE) + CYCLE) % CYCLE;
  if (m < FADE_IN)                           return eio(m / FADE_IN);
  if (m < FADE_IN + HOLD)                    return 1;
  if (m < FADE_IN + HOLD + FADE_OUT)         return eio(1 - (m - FADE_IN - HOLD) / FADE_OUT);
  return 0;
}

type MV = ReturnType<typeof useMotionValue<number>>;

// ─────────────────────────────────────────────────
// Sky：背景 + 星
// ─────────────────────────────────────────────────
// ShootingStar：流れ星（左上→右下の斜め、一瞬・短い）
//   方向: 約35°斜め下方向（右下へ流れる）
//   遠近: sy が小さい(高空・遠) → 細く短く淡く速い
//         sy が大きい(地平寄り・近) → 少し太く長く明るい
// ─────────────────────────────────────────────────
const SS_COS = Math.cos(15 * Math.PI / 180); // ≈ 0.966
const SS_SIN = Math.sin(15 * Math.PI / 180); // ≈ 0.259

function ShootingStar({ sx, sy, delay, repeatDelay }: {
  sx: number; sy: number; delay: number; repeatDelay: number;
}) {
  const pf      = Math.min(1, Math.max(0, (sy - 10) / 80));
  const sw      = 0.22 + pf * 0.22;        // 0.22–0.44
  const peakOp  = 0.36 + pf * 0.44;        // 0.36–0.80
  const dur     = 0.42 + pf * 0.20;        // 0.42–0.62 s
  const travel  = 65  + pf * 35;           // 65–100 px 移動
  const tail    = 14  + pf * 10;           // 14–24 px の尾

  return (
    <motion.g
      animate={{
        x: [0, -travel * SS_COS],   // 右→左
        y: [0,  travel * SS_SIN],   // 斜め下
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
      {/* 頭(sx,sy) → 尾は進行方向と逆（右上）へ */}
      <line
        x1={sx} y1={sy}
        x2={sx + tail * SS_COS} y2={sy - tail * SS_SIN}
        stroke="#e8e6e1" strokeWidth={sw} strokeLinecap="round"
      />
    </motion.g>
  );
}

// ─────────────────────────────────────────────────
// Sky：背景 + 星 + 流れ星
// ─────────────────────────────────────────────────
function Sky() {
  const STARS: [number, number, number, number][] = [
    [222, 18, 0.85, 0],  [272, 12, 0.70, 1],  [314, 30, 0.80, 2],
    [298, 54, 0.60, 3],  [342, 16, 0.75, 4],  [184, 38, 0.60, 5],
    [250, 66, 0.70, 6],  [334, 70, 0.55, 7],  [204, 82, 0.50, 8],
    [290, 90, 0.65, 9],  [170, 60, 0.50, 10], [354, 44, 0.70, 11],
    [242, 44, 0.60, 12], [308, 84, 0.55, 13], [226, 96, 0.50, 14],
  ];

  return (
    <>
      <rect width="360" height="240" fill="#0a0a0a" />

      {/* 流れ星（4本、位置・タイミングをばらけさせる） */}
      <ShootingStar sx={280} sy={15}  delay={5}  repeatDelay={44} />
      <ShootingStar sx={320} sy={62}  delay={18} repeatDelay={55} />
      <ShootingStar sx={240} sy={36}  delay={33} repeatDelay={48} />
      <ShootingStar sx={310} sy={24}  delay={52} repeatDelay={60} />

      {STARS.map(([x, y, r, i]) => (
        <motion.circle
          key={i} cx={x} cy={y} r={r}
          fill="#c8c6c1"
          animate={{ opacity: [0.12, 0.55, 0.12] }}
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
// Waves：4レイヤー、手前ほど振幅大・速度遅・alpha高
// 速度: 奥 13s / 中 9.5s / 中前 7.5s / 手前 6.2s（すべて6s以上）
// ─────────────────────────────────────────────────
function Waves() {
  const LAYERS = [
    { y: 145, amp: 3,  alpha: 0.10, dur: 13.0, delay: 0.0 },
    { y: 160, amp: 6,  alpha: 0.18, dur:  9.5, delay: 0.9 },
    { y: 178, amp: 9,  alpha: 0.24, dur:  7.5, delay: 1.6 },
    { y: 200, amp: 12, alpha: 0.30, dur:  6.2, delay: 2.3 },
  ];

  return (
    <g>
      {LAYERS.map((l, i) => (
        <motion.path
          key={i}
          d={`M0 ${l.y} C90 ${l.y - l.amp} 270 ${l.y + l.amp} 360 ${l.y} L360 240 L0 240 Z`}
          fill="#1D9E75"
          fillOpacity={l.alpha}
          animate={{
            d: [
              `M0 ${l.y} C90 ${l.y - l.amp} 270 ${l.y + l.amp} 360 ${l.y} L360 240 L0 240 Z`,
              `M0 ${l.y} C90 ${l.y + l.amp} 270 ${l.y - l.amp} 360 ${l.y} L360 240 L0 240 Z`,
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
// Reflection：灯台の光が水面を右→左にゆっくり移動
//   三角パスは廃止。波頭シマー楕円のみで構成。
//   ・10秒周期の clock に連動して x が右→左にスイープ
//   ・各楕円は独自リズムで rx / opacity が揺らぐ
// ─────────────────────────────────────────────────
// 5段階ステップ位置（右→左）: 手前の楕円が灯台(x=62)からどれだけ横にずれるか
// 最初のステップは右角まで届く遠い位置（pf=1.0 時に x=62+240=302, rx=52 で右端354付近）
const STEP_POSITIONS = [240, 160, 90, 25, -35];

// 波頭シマー設定：pf = perspective factor
//   水平線 y=145 を消点として (cy-145)/(218-145) で計算
//   → 奥(cy=151)でも微小なずれが生まれ、灯台光源からの斜め射影が自然になる
const SHIMMERS = [
  { cy: 151, rx: 10, peak: 0.32, dur: 2.2, delay: 0.0, pf: 0.08 },
  { cy: 163, rx: 16, peak: 0.24, dur: 2.9, delay: 0.6, pf: 0.25 },
  { cy: 178, rx: 26, peak: 0.16, dur: 3.2, delay: 1.2, pf: 0.45 },
  { cy: 197, rx: 38, peak: 0.10, dur: 2.7, delay: 0.3, pf: 0.71 },
  { cy: 218, rx: 52, peak: 0.06, dur: 3.6, delay: 1.7, pf: 1.00 },
];
type ShimmerCfg = typeof SHIMMERS[0];

// 各楕円を pf に応じた横オフセットで配置（灯台起点の斜め反射）
function ShimmerEllipse({ s, sweepX }: { s: ShimmerCfg; sweepX: MV }) {
  // 灯台 x=62 を起点に pf 倍だけ横にずれる
  const tx = useTransform(sweepX, (x) => x * s.pf);
  return (
    <motion.g style={{ x: tx }}>
      <motion.ellipse
        cx="62" cy={s.cy}
        rx={s.rx} ry="2.2"
        fill="#EF9F27"
        animate={{
          opacity: [0, s.peak, s.peak * 0.55, s.peak, 0],
          rx: [s.rx * 0.82, s.rx, s.rx * 1.08, s.rx, s.rx * 0.82],
        }}
        transition={{
          duration: s.dur,
          delay: s.delay,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.3, 0.5, 0.7, 1],
        }}
      />
    </motion.g>
  );
}

function Reflection({ clock, posClock }: { clock: MV; posClock: MV }) {
  const brightness = useTransform(clock, (t) => {
    const shifted = ((t - 0.8) % CYCLE + CYCLE) % CYCLE;
    return getBrightness(shifted);
  });

  // 輝度に連動した全体 opacity
  const shimmerMult = useTransform(brightness, [0, 1], [0, 1.0]);

  // posClock 0→40（40s）を10s刻みで4段階ステップ（右→左）
  const sweepX = useTransform(posClock, (t) => {
    const idx = Math.floor(t / CYCLE) % STEP_POSITIONS.length;
    return STEP_POSITIONS[idx];
  });

  return (
    <motion.g style={{ opacity: shimmerMult }}>
      {SHIMMERS.map((s, i) => (
        <ShimmerEllipse key={i} s={s} sweepX={sweepX} />
      ))}
    </motion.g>
  );
}

// ─────────────────────────────────────────────────
// Fog：2〜3 枚の霧レイヤー、ゆっくり水平ドリフト
// feGaussianBlur で滲ませる
// 奥ほど濃い（上のレイヤー = より大きい opacity）
// ─────────────────────────────────────────────────
function Fog() {
  const LAYERS = [
    { y: 132, h: 26, op: 0.10, blur: 16, dur: 55, dx: [ -12, 12] as [number, number] },
    { y: 139, h: 18, op: 0.14, blur: 11, dur: 42, dx: [  10,-10] as [number, number] },
    { y: 146, h: 13, op: 0.10, blur:  8, dur: 33, dx: [  -8,  8] as [number, number] },
  ];

  return (
    <g>
      <defs>
        {LAYERS.map((_, i) => (
          <filter key={i} id={`fsFog${i}`} x="-15%" y="-200%" width="130%" height="500%">
            <feGaussianBlur stdDeviation={LAYERS[i].blur} />
          </filter>
        ))}
      </defs>
      {LAYERS.map((f, i) => (
        <motion.rect
          key={i}
          x="-40" y={f.y} width="440" height={f.h}
          fill="#c8dcec"
          opacity={f.op}
          filter={`url(#fsFog${i})`}
          animate={{ x: f.dx }}
          transition={{
            duration: f.dur,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
          }}
        />
      ))}
    </g>
  );
}

// ─────────────────────────────────────────────────
// SceneLighthouse：TOPページ灯台デザイン縮小版（ハローなし）
//
//   中心 x=62
//   塔:     上6px / 下8px / 高18px  → y=120〜138
//   肩台座: 8px幅 / 2px高           → y=118〜120
//   ガラス室:6px幅 / 6px高          → y=112〜118
//   屋根:   3.5px高、apex y=108.5
//   飾り:   line + circle (r=1)
// ─────────────────────────────────────────────────
function SceneLighthouse({ clock }: { clock: MV }) {
  const brightness   = useTransform(clock, getBrightness);
  const coreOpacity  = useTransform(brightness, [0, 1], [0.45, 1.0]);
  const haloOpacity  = useTransform(brightness, [0, 1], [0,    0.08]);
  const haloOpacity2 = useTransform(brightness, [0, 1], [0,    0.16]);

  return (
    <g>
      {/* ── ガラス室グロー（brightness 連動、構造物の後ろに描画） ── */}
      <motion.circle cx="62" cy="114" r="16" fill="#EF9F27" style={{ opacity: haloOpacity }} />
      <motion.circle cx="62" cy="114" r="8"  fill="#EF9F27" style={{ opacity: haloOpacity2 }} />

      {/* ── 土台（横に広がる小さな丘） ── */}
      <path
        d="M18 145 C32 142 50 138 62 136 C72 136 84 140 102 144 L102 145 Z"
        fill="#080c1e"
      />

      {/* ── 塔本体（上6px・下8px・高18px）── */}
      <path
        d="M58 138 L59 120 L65 120 L66 138 Z"
        stroke="#e8e6e1" strokeWidth="0.75"
        fill="#080c1e" strokeLinejoin="round"
      />
      {/* 横縞 2本 */}
      <line x1="58.2" y1="134" x2="65.8" y2="134" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.30" />
      <line x1="58.6" y1="128" x2="65.4" y2="128" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.30" />

      {/* 肩台座（塔より幅広） */}
      <rect x="58" y="118" width="8" height="2"
        rx="0.4" stroke="#e8e6e1" strokeWidth="0.7" fill="#080c1e" />

      {/* ガラス室 */}
      <rect x="59" y="112" width="6" height="6"
        rx="0.4" stroke="#e8e6e1" strokeWidth="0.75" fill="#080c1e" />

      {/* バルコニー縦支柱 */}
      <line x1="59" y1="112" x2="59" y2="118" stroke="#e8e6e1" strokeWidth="0.55" opacity="0.50" />
      <line x1="65" y1="112" x2="65" y2="118" stroke="#e8e6e1" strokeWidth="0.55" opacity="0.50" />

      {/* 屋根（三角） */}
      <path d="M59 112 L62 108.5 L65 112 Z"
        stroke="#e8e6e1" strokeWidth="0.75" strokeLinejoin="round" fill="#080c1e" />

      {/* 頂部飾り */}
      <line x1="62" y1="108.5" x2="62" y2="106" stroke="#e8e6e1" strokeWidth="0.85" />
      <circle cx="62" cy="105.5" r="1.0" stroke="#e8e6e1" strokeWidth="0.75" />

      {/* バルコニー手すり水平 */}
      <line x1="57.5" y1="120" x2="66.5" y2="120" stroke="#e8e6e1" strokeWidth="0.8" />

      {/* 光源（常時 dim）*/}
      <circle cx="62" cy="115" r="1.8" fill="#EF9F27" opacity="0.48" />
      {/* brightness 連動コア */}
      <motion.circle cx="62" cy="115" r="1.1" fill="#EF9F27" style={{ opacity: coreOpacity }} />
    </g>
  );
}

// ─────────────────────────────────────────────────
// FocusScene（メイン）
// マスタークロックを生成し、Lighthouse・Reflection に渡す
// ─────────────────────────────────────────────────
export default function FocusScene() {
  const clock    = useMotionValue(0);
  const posClock = useMotionValue(0);

  useEffect(() => {
    const c1 = animate(clock, CYCLE, {
      duration: CYCLE,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
    const c2 = animate(posClock, CYCLE * STEP_POSITIONS.length, {
      duration: CYCLE * STEP_POSITIONS.length,
      repeat: Infinity,
      ease: "linear",
      repeatType: "loop",
    });
    return () => { c1.stop(); c2.stop(); };
  }, [clock, posClock]);

  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="hidden"
      aria-label="霧のかかった海と遠くの灯台"
    >
      {/* 1. 空（背景グラデ + 星） */}
      <Sky />

      {/* 2. 海の波（#1D9E75、4レイヤー） */}
      <Waves />

      {/* 3. 水面反射（灯台から 0.8s 遅延、丘シルエットで自然にマスク） */}
      <Reflection clock={clock} posClock={posClock} />

      {/* 4. 霧（地平線付近の水平帯） */}
      <Fog />

      {/* 5. 丘シルエット + 灯台本体 + 光のハロー */}
      <SceneLighthouse clock={clock} />
    </svg>
  );
}
