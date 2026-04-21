"use client";

// カフェセッション用アニメーション — 窓際の夜
// 窓・夜景・蛍・机の上の本（小さく詳細）・花・コーヒー
// カーテンなし

import { motion } from "framer-motion";

// 蛍（窓の外）
const FIREFLIES: { cx: number; cy: number; dx: number; dy: number; dur: number; delay: number; r: number }[] = [
  { cx:  72, cy:  38, dx:  6, dy: -3, dur: 3.6, delay: 0.0, r: 1.1 },
  { cx: 102, cy:  65, dx: -5, dy:  4, dur: 4.2, delay: 0.9, r: 1.0 },
  { cx:  65, cy:  92, dx:  7, dy: -5, dur: 3.8, delay: 2.0, r: 1.2 },
  { cx: 138, cy:  52, dx: -4, dy:  3, dur: 4.5, delay: 0.4, r: 0.9 },
  { cx: 160, cy:  82, dx:  5, dy: -4, dur: 3.4, delay: 1.6, r: 1.0 },
  { cx: 200, cy:  42, dx: -6, dy:  3, dur: 4.0, delay: 0.7, r: 1.1 },
  { cx: 238, cy:  70, dx:  4, dy: -3, dur: 3.7, delay: 2.3, r: 0.9 },
  { cx: 268, cy:  52, dx: -5, dy:  4, dur: 4.3, delay: 1.2, r: 1.0 },
  { cx: 290, cy:  88, dx:  5, dy: -4, dur: 3.5, delay: 0.3, r: 1.2 },
  { cx: 115, cy: 115, dx: -4, dy:  3, dur: 4.6, delay: 1.8, r: 0.9 },
  { cx: 228, cy: 108, dx:  6, dy: -5, dur: 3.9, delay: 3.0, r: 1.0 },
  { cx: 278, cy: 130, dx: -4, dy:  4, dur: 4.1, delay: 0.5, r: 0.9 },
];

export default function CafeScene() {
  return (
    <svg
      viewBox="0 0 360 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full"
      overflow="hidden"
      aria-label="カフェの窓際、本と花とコーヒー"
    >
      <defs>
        <clipPath id="cafe-win">
          <rect x="51" y="19" width="258" height="168" />
        </clipPath>
      </defs>

      {/* 背景（壁） */}
      <rect width="360" height="240" fill="#0e0e0e" />

      {/* ── 窓の外（夜景） ── */}
      <rect x="51" y="19" width="258" height="168" fill="#0c0c14" />

      {/* 遠くの街並みシルエット */}
      <path
        d="M51 150 L72 150 L72 140 L84 140 L84 147 L96 147 L96 133 L110 133 L110 141 L124 141 L124 136 L138 136 L138 144 L152 144 L152 138 L166 138 L166 150 L180 150 L180 141 L196 141 L196 146 L212 146 L212 136 L226 136 L226 144 L240 144 L240 139 L254 139 L254 146 L266 146 L266 133 L278 133 L278 141 L292 141 L292 150 L309 150"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinejoin="round" fill="none" opacity="0.13"
      />

      {/* 街のあかり */}
      {([
        [78,143],[108,136],[128,139],[150,141],
        [198,143],[222,139],[246,141],[268,136],[284,138],
      ] as [number,number][]).map(([x,y],i) => (
        <motion.circle key={i} cx={x} cy={y} r="1.1" fill="#e8e6e1"
          animate={{ opacity:[0.08,0.26,0.08] }}
          transition={{ duration:3.5+i*0.4, repeat:Infinity, ease:"easeInOut", delay:i*0.38 }}
        />
      ))}

      {/* 月 */}
      <circle cx="260" cy="50" r="15" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.40" fill="none" />
      <circle cx="264" cy="47" r="11.5" fill="#0c0c14" />

      {/* 星 */}
      {([
        [80,36,0.6,0],[118,25,0.5,1],[148,43,0.6,2],
        [172,30,0.5,3],[218,50,0.5,4],[98,58,0.4,5],[295,68,0.4,6],
      ] as [number,number,number,number][]).map(([x,y,r,i]) => (
        <motion.circle key={i} cx={x} cy={y} r={r} fill="#e8e6e1"
          animate={{ opacity:[0.08,0.38,0.08] }}
          transition={{ duration:4+i*0.6, repeat:Infinity, ease:"easeInOut", delay:i*0.45 }}
        />
      ))}

      {/* 蛍（窓枠の内側にクリップ） */}
      <g clipPath="url(#cafe-win)">
        {FIREFLIES.map((f,i) => (
          <motion.circle key={i} r={f.r} fill="#e8e6e1"
            animate={{
              cx:      [f.cx, f.cx+f.dx, f.cx],
              cy:      [f.cy, f.cy+f.dy, f.cy],
              opacity: [0, 0.72, 0.15, 0.65, 0],
            }}
            transition={{ duration:f.dur, delay:f.delay, repeat:Infinity, ease:"easeInOut", times:[0,0.25,0.5,0.75,1] }}
          />
        ))}
      </g>

      {/* ── 窓枠 ── */}
      <rect x="50" y="18" width="260" height="170" stroke="#e8e6e1" strokeWidth="1.4" rx="2" opacity="0.45" />
      <line x1="50"  y1="103" x2="310" y2="103" stroke="#e8e6e1" strokeWidth="1.0" opacity="0.38" />
      <line x1="180" y1="18"  x2="180" y2="188" stroke="#e8e6e1" strokeWidth="1.0" opacity="0.38" />

      {/* ── 机の天板 ── */}
      <rect x="0" y="188" width="360" height="52" fill="#e8e6e1" fillOpacity="0.03" />
      <line x1="0" y1="188" x2="360" y2="188" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.22" />

      {/* ────────────────────────────────────────────
          閉じた本 — 3面構成（台形パース、窓と平行）
      ──────────────────────────────────────────── */}

      {/* ③ 右面（小口・ページの厚み）— 先に描いて表紙で隠す */}
      <path d="M130 214 L123 198 L123 210 L130 226 Z"
        stroke="#e8e6e1" strokeWidth="0.55" strokeLinejoin="round" strokeOpacity="0.28" fill="#0e0e0e" />

      {/* ② 手前面（ページ束） */}
      <path d="M60 214 L130 214 L130 226 L60 226 Z"
        stroke="#e8e6e1" strokeWidth="0.65" strokeLinejoin="round" strokeOpacity="0.38" fill="#0e0e0e" />

      {/* ページ束の横筋 */}
      <line x1="60" y1="216" x2="130" y2="216" stroke="#e8e6e1" strokeWidth="0.35" opacity="0.22" />
      <line x1="60" y1="218" x2="130" y2="218" stroke="#e8e6e1" strokeWidth="0.35" opacity="0.20" />
      <line x1="60" y1="220" x2="130" y2="220" stroke="#e8e6e1" strokeWidth="0.35" opacity="0.17" />
      <line x1="60" y1="222" x2="130" y2="222" stroke="#e8e6e1" strokeWidth="0.35" opacity="0.14" />
      <line x1="60" y1="224" x2="130" y2="224" stroke="#e8e6e1" strokeWidth="0.35" opacity="0.11" />

      {/* ① 上面（表紙） */}
      <path d="M60 214 L130 214 L123 198 L67 198 Z"
        stroke="#e8e6e1" strokeWidth="0.75" strokeLinejoin="round" strokeOpacity="0.52" fill="#0e0e0e" />

      {/* 表紙の飾り枠（インセット） */}
      <path d="M70 199 L120 199 L126 213 L64 213 Z"
        stroke="#e8e6e1" strokeWidth="0.38" strokeLinejoin="round" strokeOpacity="0.20" fill="none" />

      {/* ── コーヒーカップ（中央寄り） ── */}
      {/* 湯気 */}
      <motion.path d="M204 183 C201 176 205 168 203 161"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" fill="none"
        animate={{ opacity:[0,0.32,0], y:[0,-3,-7] }}
        transition={{ duration:2.8, repeat:Infinity, ease:"easeInOut", delay:0.0 }}
      />
      <motion.path d="M212 181 C209 173 213 165 211 158"
        stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" fill="none"
        animate={{ opacity:[0,0.27,0], y:[0,-4,-8] }}
        transition={{ duration:3.1, repeat:Infinity, ease:"easeInOut", delay:1.0 }}
      />
      <motion.path d="M220 183 C217 175 221 167 219 160"
        stroke="#e8e6e1" strokeWidth="0.55" strokeLinecap="round" fill="none"
        animate={{ opacity:[0,0.22,0], y:[0,-3,-7] }}
        transition={{ duration:2.6, repeat:Infinity, ease:"easeInOut", delay:1.8 }}
      />
      {/* ソーサー上面（カップより先に描いて背面に） */}
      <ellipse cx="209" cy="215" rx="26" ry="5"
        stroke="#e8e6e1" strokeWidth="0.6" strokeOpacity="0.30" fill="#0e0e0e" />
      {/* ソーサーのリム（内側の楕円） */}
      <ellipse cx="209" cy="215" rx="20" ry="3.5"
        stroke="#e8e6e1" strokeWidth="0.35" strokeOpacity="0.15" fill="none" />
      {/* カップ本体 */}
      <path d="M188 186 L230 186 L227 214 L191 214 Z"
        stroke="#e8e6e1" strokeWidth="0.7" strokeLinejoin="round" strokeOpacity="0.46" fill="#0e0e0e" />
      {/* 取っ手（外側） */}
      <path d="M230 193 C242 193 242 208 230 208"
        stroke="#e8e6e1" strokeWidth="0.65" strokeOpacity="0.38" fill="none" />
      {/* 取っ手（内側・肉厚感） */}
      <path d="M230 196 C236 196 236 206 230 206"
        stroke="#e8e6e1" strokeWidth="0.35" strokeOpacity="0.20" fill="none" />
      {/* 口の楕円（カップ本体の上に重ねて開口部を表現） */}
      <ellipse cx="209" cy="186" rx="21" ry="4.5"
        stroke="#e8e6e1" strokeWidth="0.6" strokeOpacity="0.36" fill="#0e0e0e" />
      {/* コーヒー液面（内側の楕円） */}
      <ellipse cx="209" cy="186" rx="17" ry="3.2"
        stroke="#e8e6e1" strokeWidth="0.35" strokeOpacity="0.18" fill="none" />

      {/* ── 花（一輪挿し・窓際・奥） ── */}
      {/* 花瓶（細め・すっきり） */}
      <path d="M298 210 L308 210 L310 198 L312 192 L294 192 L296 198 Z"
        stroke="#e8e6e1" strokeWidth="0.65" strokeLinejoin="round" fill="none" opacity="0.42" />
      {/* 花瓶の口（楕円） */}
      <ellipse cx="303" cy="192" rx="9" ry="2.5"
        stroke="#e8e6e1" strokeWidth="0.55" opacity="0.32" />
      {/* 花瓶のくびれ */}
      <line x1="295" y1="202" x2="311" y2="202"
        stroke="#e8e6e1" strokeWidth="0.35" opacity="0.16" />

      {/* 茎（少ししなる） */}
      <path d="M303 192 C303 180 304 168 303 152"
        stroke="#e8e6e1" strokeWidth="0.55" strokeLinecap="round" fill="none" opacity="0.40" />

      {/* 葉（左） */}
      <path d="M303 175 C297 170 291 163 294 156 C298 163 301 169 303 175"
        stroke="#e8e6e1" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity="0.28" />
      {/* 葉の中央脈 */}
      <path d="M303 175 C299 168 296 161 294 156"
        stroke="#e8e6e1" strokeWidth="0.3" strokeLinecap="round" fill="none" opacity="0.15" />

      {/* 花びら — チューリップ型 */}
      {/* 中央 */}
      <path d="M303 152 C300 145 299 136 303 129 C307 136 307 145 303 152"
        stroke="#e8e6e1" strokeWidth="0.65" strokeLinecap="round" fill="none" opacity="0.50" />
      {/* 左 */}
      <path d="M301 150 C295 143 294 133 298 127 C301 133 302 143 301 150"
        stroke="#e8e6e1" strokeWidth="0.55" strokeLinecap="round" fill="none" opacity="0.38" />
      {/* 右 */}
      <path d="M305 150 C311 143 312 133 308 127 C305 133 306 143 305 150"
        stroke="#e8e6e1" strokeWidth="0.55" strokeLinecap="round" fill="none" opacity="0.38" />
      {/* 外左 */}
      <path d="M299 148 C291 140 290 129 295 124 C298 131 299 141 299 148"
        stroke="#e8e6e1" strokeWidth="0.45" strokeLinecap="round" fill="none" opacity="0.24" />
      {/* 外右 */}
      <path d="M307 148 C315 140 316 129 311 124 C308 131 307 141 307 148"
        stroke="#e8e6e1" strokeWidth="0.45" strokeLinecap="round" fill="none" opacity="0.24" />
    </svg>
  );
}
