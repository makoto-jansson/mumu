// 味で選ぶ — Light ←→ Dark の線の上に豆の位置を打ち、下に豆の名前を並べる（/beans）
// Figma「PC｜豆の一覧」51:295 の「味で選ぶ」。豆が増えて同じ焙煎度が並んだら、名前を縦に積む。

import Link from "next/link";
import type { BeanView } from "@/lib/beans";
import site from "@/components/site/site.module.css";
import s from "./beanPage.module.css";

// 線の上の位置（左端=浅煎り、右端=深煎り）
const POS: Record<BeanView["roastKind"], number> = { light: 22, other: 50, dark: 80 };
const ORDER: BeanView["roastKind"][] = ["light", "other", "dark"];

export const beanName = (b: BeanView) => b.name.replace(/[\s　]+/g, " ");

export default function TasteMap({ beans }: { beans: BeanView[] }) {
  const groups = ORDER.map((kind) => ({ kind, beans: beans.filter((b) => b.roastKind === kind) })).filter(
    (g) => g.beans.length > 0
  );
  const rows = Math.max(1, ...groups.map((g) => g.beans.length));
  return (
    <section className={s.taste} aria-labelledby="taste-title">
      <div className={site.wrap}>
        <h2 id="taste-title" className={s.tasteTitle}>
          <span className={`${site.label} ${s.tasteLabel}`} aria-hidden="true">
            Taste
          </span>
          味で選ぶ
        </h2>
        <p className={s.tasteLead}>迷ったら、ブラックで飲むなら浅煎り、ミルクを入れるなら深煎りから。</p>

        <div className={s.ruler}>
          <div className={s.rulerEnds} aria-hidden="true">
            <span className={site.label}>Light</span>
            <span className={site.label}>Dark</span>
          </div>
          <div className={s.rulerLine} aria-hidden="true">
            {groups.map((g) => (
              <span key={g.kind} className={s.rulerDot} style={{ left: `${POS[g.kind]}%` }} />
            ))}
          </div>
          <div className={s.rulerNotes}>
            <span>
              華やか・すっきり<span className={s.pcOnly}>（浅煎り）</span>
            </span>
            <span>
              ほろ苦い・コク<span className={s.pcOnly}>（深煎り）</span>
            </span>
          </div>
          <ul className={s.rulerPills} style={{ "--rows": rows } as React.CSSProperties}>
            {groups.map((g) => (
              <li key={g.kind} style={{ "--pos": `${POS[g.kind]}%` } as React.CSSProperties}>
                {g.beans.map((b) => (
                  <Link key={b.slug} href={`/beans/${b.slug}`} className={s.pill}>
                    {beanName(b)}
                  </Link>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
