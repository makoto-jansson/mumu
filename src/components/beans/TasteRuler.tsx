// 味のものさし（TOP と /beans で共通）
// 豆は少数なので絞り込みではなく、浅煎り＝華やか・すっきり ←→ 深煎り＝ほろ苦い・コク の1本で見せる。

import Link from "next/link";
import { beanLabel } from "@/components/beans/BeanTile";
import type { BeanView } from "@/lib/beans";

export default function TasteRuler({ beans }: { beans: BeanView[] }) {
  const light = beans.filter((b) => b.roastKind === "light");
  const dark = beans.filter((b) => b.roastKind !== "light");
  const list = (items: BeanView[]) => (
    <ul className="space-y-1.5">
      {items.map((b) => (
        <li key={b.slug}>
          <Link href={`/beans/${b.slug}`} className="text-ink-primary underline underline-offset-4 hover:opacity-75">
            {beanLabel(b)}
          </Link>
        </li>
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="taste-ruler" className="rounded-2xl border border-ink-primary/15 bg-white/60 p-5 sm:p-6">
      <h3 id="taste-ruler" className="font-mincho text-ink-primary text-lg mb-1">味で選ぶ</h3>
      <p className="text-[12px] text-ink-secondary/70 mb-5">
        迷ったら、ブラックで飲むなら浅煎り、ミルクを入れるなら深煎りから。
      </p>
      <div className="h-1.5 rounded-full bg-gradient-to-r from-ink-primary/15 to-ink-primary/60 mb-4" />
      <div className="grid grid-cols-2 gap-4 text-[13px]">
        <div>
          <p className="text-ink-secondary/70 text-[12px] mb-2">華やか・すっきり（浅煎り）</p>
          {list(light)}
        </div>
        <div className="text-right">
          <p className="text-ink-secondary/70 text-[12px] mb-2">ほろ苦い・コク（深煎り）</p>
          {list(dark)}
        </div>
      </div>
    </section>
  );
}
