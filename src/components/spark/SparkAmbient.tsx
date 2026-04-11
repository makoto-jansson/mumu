"use client";

// Spark バックグラウンドアンビエント演出
// Endel的な環境演出: オーブ / 呼吸グロー / グリッド線パルス

import { useEffect, useRef } from "react";
import { motion, animate, useMotionValue } from "framer-motion";

// パーティクル設定
const NUM_ORBS = 6;

type OrbConfig = {
  size: number;
  color: string;
  opacity: number;
  blur: number;
  x: number;
  y: number;
  duration: number;
};

function randomOrbs(): OrbConfig[] {
  return Array.from({ length: NUM_ORBS }, (_, i) => ({
    size: 20 + Math.random() * 60,
    color: i % 2 === 0 ? "#EF9F27" : "#1D9E75",
    opacity: i % 2 === 0 ? 0.04 + Math.random() * 0.04 : 0.03 + Math.random() * 0.03,
    blur: 40,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 6 + Math.random() * 6,
  }));
}

function Orb({ config, dimmed }: { config: OrbConfig; dimmed?: boolean }) {
  const targetX = useRef(config.x);
  const targetY = useRef(config.y);
  const xVal = useMotionValue(config.x);
  const yVal = useMotionValue(config.y);

  useEffect(() => {
    let running = true;

    const move = () => {
      if (!running) return;
      targetX.current = Math.random() * 100;
      targetY.current = Math.random() * 100;
      const dur = config.duration + Math.random() * 4;

      Promise.all([
        animate(xVal, targetX.current, { duration: dur, ease: "easeInOut" }),
        animate(yVal, targetY.current, { duration: dur, ease: "easeInOut" }),
      ]).then(() => {
        if (running) move();
      });
    };
    move();

    return () => { running = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      style={{
        position: "absolute",
        width: config.size,
        height: config.size,
        borderRadius: "50%",
        backgroundColor: config.color,
        opacity: (dimmed ? config.opacity * 0.5 : config.opacity),
        filter: `blur(${config.blur}px)`,
        willChange: "transform, opacity",
        left: xVal.get() + "%",
        top: yVal.get() + "%",
        x: xVal,
        y: yVal,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
      }}
    />
  );
}

type Props = {
  dimmed?: boolean; // MyGrid では半分の明るさ
};

export default function SparkAmbient({ dimmed = false }: Props) {
  const orbs = useRef(randomOrbs());
  const glowOpacity = useMotionValue(0.02);

  // 呼吸グロー: 8秒サイクル
  useEffect(() => {
    const run = () => {
      animate(glowOpacity, 0.06, { duration: 4, ease: "easeInOut" }).then(() => {
        animate(glowOpacity, 0.02, { duration: 4, ease: "easeInOut" }).then(run);
      });
    };
    run();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: 0 }}
    >
      {/* オーブ群 */}
      {orbs.current.map((orb, i) => (
        <Orb key={i} config={orb} dimmed={dimmed} />
      ))}

      {/* 呼吸グロー（中央の大きな楕円）*/}
      <motion.div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          translateX: "-50%",
          translateY: "-50%",
          width: 280,
          height: 200,
          borderRadius: "50%",
          backgroundColor: "#EF9F27",
          opacity: glowOpacity,
          filter: "blur(60px)",
          willChange: "opacity",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
