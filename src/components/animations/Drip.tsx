"use client";

// コーヒードリップアニメーション（Endel風ミニマル線画）
// ドリッパー → サーバーの流れを表現
//
// レイアウト（viewBox 0 0 200 280）:
//   y=55-74  : 湯気
//   y=78-150 : ドリッパー
//   y=145-195: 水滴の落下区間
//   y=195-235: サーバー

import { motion } from "framer-motion";

// ドリッパーから落ちる水滴
function Drop({ delay }: { delay: number }) {
  return (
    <motion.ellipse
      cx="100" cy="0" rx="2.5" ry="3.5"
      fill="#EF9F27"
      initial={{ cy: 145, opacity: 0 }}
      animate={{
        cy:      [145, 145, 195, 195],
        opacity: [0,   0.85, 0.85, 0],
        ry:      [3.5, 4.5, 4.5, 2.5],
      }}
      transition={{
        duration: 2.0,
        delay,
        repeat: Infinity,
        repeatDelay: 1.4,
        ease: "easeIn",
        times: [0, 0.08, 0.88, 1],
      }}
    />
  );
}

// サーバー内の波紋
function Ripple({ delay }: { delay: number }) {
  return (
    <motion.ellipse
      cx="100" cy="218"
      rx="0" ry="0"
      fill="none"
      stroke="#EF9F27"
      strokeWidth="0.8"
      initial={{ rx: 0, ry: 0, opacity: 0.5 }}
      animate={{ rx: [0, 16], ry: [0, 4], opacity: [0.5, 0] }}
      transition={{
        duration: 1.1,
        delay,
        repeat: Infinity,
        repeatDelay: 2.0,
        ease: "easeOut",
      }}
    />
  );
}

export default function Drip() {
  return (
    <svg
      viewBox="0 0 200 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-44 h-64"
      aria-label="コーヒーをドリップするイラスト"
    >
      {/* ── 湯気（ドリッパー上） ── */}
      {[0, 1].map((i) => (
        <motion.path
          key={i}
          d={i === 0 ? "M88 74 C86 67 90 63 87 57" : "M103 72 C101 65 105 61 103 55"}
          stroke="#e8e6e1"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0"
          animate={{ opacity: [0, 0.2, 0], y: [0, -3, 0] }}
          transition={{
            duration: 2.8,
            delay: i * 1.0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ── ドリッパー ── */}
      {/* 上部リム */}
      <line x1="68" y1="78" x2="132" y2="78" stroke="#e8e6e1" strokeWidth="1.5" strokeLinecap="round" />
      {/* 本体（逆三角形） */}
      <path
        d="M70 80 L100 142 L130 80 Z"
        stroke="#e8e6e1" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* 内部リブ */}
      <line x1="88"  y1="88" x2="96"  y2="122" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.3" />
      <line x1="100" y1="88" x2="100" y2="130" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.3" />
      <line x1="112" y1="88" x2="104" y2="122" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.3" />
      {/* 先端の口 */}
      <path d="M97 142 L100 150 L103 142" stroke="#e8e6e1" strokeWidth="1.2" strokeLinejoin="round" />

      {/* ── 落ちる水滴 ── */}
      <Drop delay={0} />
      <Drop delay={3.4} />

      {/* ── サーバー（コーヒーカップ） ── */}
      {/* 上部リム */}
      <line x1="72" y1="195" x2="128" y2="195" stroke="#e8e6e1" strokeWidth="1.5" strokeLinecap="round" />
      {/* 本体 */}
      <path
        d="M74 195 C72 205 70 218 74 230 L126 230 C130 218 128 205 126 195 Z"
        stroke="#e8e6e1" strokeWidth="1.5" strokeLinejoin="round"
      />
      {/* 側面ハンドル（外壁にぴったり接続したループ） */}
      {/*
        右外壁の位置:
          y=201 → x≈127.2
          y=222 → x≈128.1
        ループの外端: x≈148
      */}
      <path
        d="M127 201 C146 196 148 227 128 222"
        stroke="#e8e6e1" strokeWidth="1.3" strokeLinecap="round" fill="none"
      />
      {/* ハンドル台座 */}
      <rect x="88" y="230" width="24" height="5" rx="2.5" stroke="#e8e6e1" strokeWidth="1.2" />

      {/* 珈琲液面（ゆっくり上昇） */}
      <motion.path
        d="M75 227 C88 224 112 224 125 227 L125 230 L75 230 Z"
        fill="#EF9F27" opacity="0.15"
        animate={{ d: [
          "M75 227 C88 224 112 224 125 227 L125 230 L75 230 Z",
          "M75 208 C88 205 112 205 125 208 L125 230 L75 230 Z",
        ]}}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      />

      {/* 波紋 */}
      <Ripple delay={2.0} />
      <Ripple delay={5.0} />
    </svg>
  );
}
