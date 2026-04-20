// グラデーション背景 — SectionBlock 内に絶対配置してフィルム写真のような陰影を作る
// radialGradient 3〜2層 + feTurbulence グレインで質感を演出
// section ごとに色温度を変えて「時間の移ろい」を表現

export type SectionType = "hero" | "tools" | "beans" | "journal" | "about";

type Stop = {
  cx: string;
  cy: string;
  r: string;
  color: string;
  opacity: number;
};

// セクションごとの背景グラデーション設定
// seed は feTurbulence のノイズ種（重複させない）
const GRADIENTS: Record<SectionType, { seed: number; stops: Stop[] }> = {
  // Hero: 3色すべて使って世界観の提示
  hero: {
    seed: 11,
    stops: [
      { cx: "20%", cy: "30%", r: "65%", color: "#2c6671", opacity: 0.42 },
      { cx: "85%", cy: "75%", r: "55%", color: "#123656", opacity: 0.35 },
      { cx: "60%", cy: "15%", r: "40%", color: "#60ae9d", opacity: 0.28 },
    ],
  },
  // 01 整える: 朝の光・起動の印象
  tools: {
    seed: 22,
    stops: [
      { cx: "75%", cy: "40%", r: "65%", color: "#60ae9d", opacity: 0.35 },
      { cx: "15%", cy: "75%", r: "55%", color: "#2c6671", opacity: 0.28 },
    ],
  },
  // 02 珈琲: 深み・香り
  beans: {
    seed: 33,
    stops: [
      { cx: "20%", cy: "30%", r: "60%", color: "#123656", opacity: 0.38 },
      { cx: "85%", cy: "75%", r: "55%", color: "#2c6671", opacity: 0.28 },
      { cx: "60%", cy: "20%", r: "35%", color: "#60ae9d", opacity: 0.22 },
    ],
  },
  // 03 読む: 余白・静けさ（薄め）
  journal: {
    seed: 44,
    stops: [
      { cx: "50%", cy: "50%", r: "70%", color: "#60ae9d", opacity: 0.22 },
      { cx: "90%", cy: "80%", r: "40%", color: "#2c6671", opacity: 0.18 },
    ],
  },
  // 04 mumuについて: 瞑想・着地（強め）
  about: {
    seed: 55,
    stops: [
      { cx: "50%", cy: "55%", r: "75%", color: "#123656", opacity: 0.48 },
      { cx: "30%", cy: "70%", r: "55%", color: "#2c6671", opacity: 0.3 },
      { cx: "20%", cy: "15%", r: "35%", color: "#60ae9d", opacity: 0.22 },
    ],
  },
};

export default function GradientBackground({ type }: { type: SectionType }) {
  const { seed, stops } = GRADIENTS[type];
  const prefix = `${type}-grad`;

  return (
    <svg
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
      preserveAspectRatio="none"
      viewBox="0 0 820 460"
      aria-hidden="true"
    >
      <defs>
        {stops.map((stop, i) => (
          <radialGradient
            key={i}
            id={`${prefix}-${i}`}
            cx={stop.cx}
            cy={stop.cy}
            r={stop.r}
          >
            <stop offset="0%" stopColor={stop.color} stopOpacity={stop.opacity} />
            <stop offset="100%" stopColor={stop.color} stopOpacity={0} />
          </radialGradient>
        ))}
        <filter id={`${prefix}-grain`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.75"
            numOctaves="3"
            seed={seed}
          />
          <feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0.12 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
      {/* 生成り白のベース */}
      <rect width="100%" height="100%" fill="#fdf8ef" />
      {/* 各 radialGradient を重ねる */}
      {stops.map((_, i) => (
        <rect key={i} width="100%" height="100%" fill={`url(#${prefix}-${i})`} />
      ))}
      {/* フィルムグレイン */}
      <rect width="100%" height="100%" filter={`url(#${prefix}-grain)`} />
    </svg>
  );
}
