"use client";

// ボタン内オーブアニメーション
// 仕様: 3層グロウ + リサージュ浮遊 + scaleX/Y 形状変化 + 呼吸
// ボタンに overflow-hidden が必須

import { motion } from "framer-motion";

// ─── 型 ───────────────────────────────────────────
type OrbCfg = {
  scale:        number;   // メイン=1.0 / サブ≈0.65
  opScale:      number;   // 輝度スケール
  initX:        number;   // 初期X オフセット（px）
  moveX:        number[];
  moveY:        number[];
  moveDur:      number;
  moveDelay:    number;
  moveTimes:    number[];
  morphDur:     number;
  morphDelay:   number;
  breathDur:    number;
  breathDelay:  number;
};

// ─── 1オーブ ──────────────────────────────────────
function OrbGroup({ cfg }: { cfg: OrbCfg }) {
  // 基本サイズ（ボタン高さ≈54px 基準）
  const coreSize  = Math.round(54 * 1.25 * cfg.scale);  // ≈68px
  const innerSize = Math.round(54 * 2.5  * cfg.scale);  // ≈135px
  const outerSize = Math.round(54 * 5.0  * cfg.scale);  // ≈270px
  const op = cfg.opScale;

  return (
    // 位置アンカー：ボタン中央 + 初期オフセット
    <motion.div
      className="absolute"
      style={{
        left:       "50%",
        top:        "50%",
        width:      outerSize,
        height:     outerSize,
        marginLeft: -outerSize / 2,
        marginTop:  -outerSize / 2,
        translateX: cfg.initX,
      }}
      // 浮遊（リサージュ的、X/Y 独立周期）
      animate={{ x: cfg.moveX, y: cfg.moveY }}
      transition={{
        duration: cfg.moveDur,
        repeat:   Infinity,
        ease:     "easeInOut",
        delay:    cfg.moveDelay,
        times:    cfg.moveTimes,
      }}
    >
      {/* 形状変化ラッパー（scaleX / scaleY を独立）*/}
      <motion.div
        style={{ width: "100%", height: "100%" }}
        animate={{
          scaleX: [1, 1.07, 0.94, 1.06, 0.97, 1.05, 1],
          scaleY: [1, 0.95, 1.08, 0.96, 1.05, 0.94, 1],
        }}
        transition={{
          duration: cfg.morphDur,
          repeat:   Infinity,
          ease:     "easeInOut",
          delay:    cfg.morphDelay,
          times:    [0, 0.16, 0.33, 0.50, 0.67, 0.84, 1],
        }}
      >
        {/* Layer 3: アウターグロウ */}
        <div style={{
          position:    "absolute",
          width:       outerSize,
          height:      outerSize,
          marginLeft:  -outerSize / 2,
          marginTop:   -outerSize / 2,
          borderRadius:"50%",
          background:  `rgba(239,159,39,${(0.16 * op).toFixed(2)})`,
          filter:      "blur(20px)",
          mixBlendMode:"screen",
        }} />

        {/* Layer 2: インナーグロウ */}
        <div style={{
          position:    "absolute",
          width:       innerSize,
          height:      innerSize,
          marginLeft:  -innerSize / 2,
          marginTop:   -innerSize / 2,
          borderRadius:"50%",
          background:  `rgba(239,159,39,${(0.42 * op).toFixed(2)})`,
          filter:      "blur(10px)",
          mixBlendMode:"screen",
        }} />

        {/* Layer 1: コア（呼吸）*/}
        <motion.div
          style={{
            position:    "absolute",
            width:       coreSize,
            height:      coreSize,
            marginLeft:  -coreSize / 2,
            marginTop:   -coreSize / 2,
            borderRadius:"50%",
            background:  "#EF9F27",
            filter:      "blur(5px)",
            mixBlendMode:"screen",
          }}
          animate={{ opacity: [0.65, 0.90, 0.68, 0.85, 0.72, 0.88, 0.65] }}
          transition={{
            duration: cfg.breathDur,
            repeat:   Infinity,
            ease:     "easeInOut",
            delay:    cfg.breathDelay,
            times:    [0, 0.16, 0.33, 0.50, 0.67, 0.84, 1],
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ─── メイン export ────────────────────────────────
export default function ButtonOrb() {
  // オーブ1：メイン（左寄り始まり、16s、右〜中央を大きく漂う）
  const orb1: OrbCfg = {
    scale:      1.0,
    opScale:    1.0,
    initX:      -50,
    moveX:      [0,  68,  22, -58, -72,  28, 0],
    moveY:      [0,  -9,  14,  -4,   9, -11, 0],
    moveDur:    16,
    moveDelay:  0,
    moveTimes:  [0, 0.15, 0.32, 0.50, 0.68, 0.85, 1],
    morphDur:   8,
    morphDelay: 0,
    breathDur:  5,
    breathDelay:0,
  };

  // オーブ2：サブ（右寄り始まり、19s、左〜中央を漂う）
  const orb2: OrbCfg = {
    scale:      0.65,
    opScale:    0.65,
    initX:      50,
    moveX:      [0, -62, -28,  50,  66, -22, 0],
    moveY:      [0,  10, -13,   8,  -6,  14, 0],
    moveDur:    19,
    moveDelay:  3,
    moveTimes:  [0, 0.17, 0.35, 0.53, 0.70, 0.87, 1],
    morphDur:   7,
    morphDelay: 2,
    breathDur:  6,
    breathDelay:1.5,
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      <OrbGroup cfg={orb1} />
      <OrbGroup cfg={orb2} />
    </div>
  );
}
