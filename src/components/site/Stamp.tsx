// 灯台の印（回る文字） — Figma 部品「Stamp / 灯台の印（回る文字）」36:79
// 青い輪に白い欧文が一周し、中央に灯台の丸窓。外側の文字だけがゆっくり回る（動きを減らす設定では止める）。

import LighthouseWindow from "./LighthouseWindow";
import s from "./site.module.css";

const TEXT = "SPECIALTY COFFEE · SMALL BATCH ROAST · ";
// 文字を乗せる円の半径（156の正方形の中）。輪は半径55〜78なので、その真ん中に字の高さが来るよう少し内側に置く
const R = 62.5;

export default function Stamp({ className = "", size }: { className?: string; size: number }) {
  return (
    <span className={`${s.stamp} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 156 156">
        {/* CSS変数は属性では効かないので style で塗る */}
        <circle cx="78" cy="78" r="78" style={{ fill: "var(--mumu-blue)" }} />
        <defs>
          {/* 真上から時計回りに一周する円 */}
          <path id="mumu-stamp-circle" d={`M78,${78 - R} a${R},${R} 0 1,1 0,${R * 2} a${R},${R} 0 1,1 0,${-R * 2}`} />
        </defs>
        <g className={s.stampText}>
          <text
            style={{
              fill: "var(--mumu-white)",
              fontFamily: "var(--font-playfair), 'Playfair Display', serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "11.5px",
              letterSpacing: 0,
            }}
          >
            <textPath href="#mumu-stamp-circle" textLength={2 * Math.PI * R - 1} lengthAdjust="spacing">
              {TEXT}
            </textPath>
          </text>
        </g>
      </svg>
      <LighthouseWindow size={Math.round(size * 0.705)} />
    </span>
  );
}
