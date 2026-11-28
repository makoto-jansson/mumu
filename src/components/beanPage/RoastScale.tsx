// 焙煎度のものさし — 5つの点のうち、この豆の位置だけを大きな青丸にする（/beans/[slug]）
// Figma「PC｜豆の詳細」6:117 の「焙煎度」。

import type { BeanView } from "@/lib/beans";
import site from "@/components/site/site.module.css";
import s from "./beanPage.module.css";

const STEP: Record<BeanView["roastKind"], number> = { light: 0, other: 2, dark: 4 };

export default function RoastScale({ kind, label }: { kind: BeanView["roastKind"]; label: string }) {
  const at = STEP[kind];
  return (
    <div className={s.roast}>
      <p className={s.roastTitle}>
        焙煎度<span className={site.srOnly}>：{label}</span>
      </p>
      <div className={s.roastLine} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`${s.roastDot} ${i === at ? s.roastHere : ""}`} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
      <div className={s.roastNames} aria-hidden="true">
        <span>浅煎り</span>
        <span>中煎り</span>
        <span>深煎り</span>
      </div>
    </div>
  );
}
