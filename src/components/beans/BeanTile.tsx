// 豆のカード（TOP と /beans で共通）
// 写真・焙煎度・名前・味の言葉・価格／1杯あたり と、BASEの購入ボタン＋詳細リンクを並べる。

import Link from "next/link";
import Image from "next/image";
import BuyButton from "@/components/beans/BuyButton";
import type { BeanView } from "@/lib/beans";

export const beanLabel = (b: BeanView) => b.name.replace(/　/g, " ");

export default function BeanTile({
  bean,
  medium,
  campaign,
}: {
  bean: BeanView;
  medium: string; // UTM: どのページ種別から（top / beans）
  campaign: string; // UTM: どのページから
}) {
  return (
    <li className="flex gap-4 sm:gap-6 rounded-2xl border border-ink-primary/15 bg-white/60 p-4 sm:p-5">
      {bean.image && (
        <Link
          href={`/beans/${bean.slug}`}
          className="relative block w-24 sm:w-36 shrink-0 self-start aspect-[5/7] overflow-hidden rounded-lg bg-white"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image src={bean.image.url} alt="" fill sizes="(max-width: 640px) 96px, 144px" className="object-contain" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-full border border-ink-primary/30 px-2.5 text-[11px] text-ink-primary mb-2">
          {bean.roastShort}
        </span>
        <h3 className="font-mincho text-ink-primary text-lg leading-snug mb-2">
          <Link href={`/beans/${bean.slug}`} className="hover:opacity-75 transition-opacity">
            {beanLabel(bean)}
          </Link>
        </h3>
        <p className="text-ink-secondary text-[13px] leading-relaxed mb-2">{bean.flavor}</p>
        <p className="text-ink-secondary/70 text-[12px] mb-4">
          {bean.weight} / ¥{bean.price.toLocaleString()}
          {bean.pricePerCup && `（1杯あたり${bean.pricePerCup}）`}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <BuyButton bean={bean} medium={medium} campaign={campaign} content="tile" />
          <Link href={`/beans/${bean.slug}`} className="text-[13px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            詳しく見る
          </Link>
        </div>
      </div>
    </li>
  );
}
