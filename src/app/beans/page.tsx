// 珈琲豆の一覧 /beans（リニューアル段階Bで作り直し）
//
// 豆は3種と少ないので、絞り込みタブではなく「味のものさし」1本で全体を見せ、
// 各カードから詳細（/beans/[slug]）へ、または直接BASEの個別商品ページへ進めるようにする。

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import BuyButton from "@/components/beans/BuyButton";
import { getBeanViews, type BeanView } from "@/lib/beans";

const BASE_URL = "https://www.mumucoffee-feel.com";
const TITLE = "珈琲豆の一覧｜自家焙煎スペシャルティコーヒー";
const DESCRIPTION =
  "灯台の珈琲焙煎所mumuの自家焙煎コーヒー豆。華やかな浅煎りのエチオピア シダモ、ほろ苦い深煎りのマンデリンを100gから。味の違いと選び方をまとめています。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE_URL}/beans` },
  alternates: { canonical: `${BASE_URL}/beans` },
};

// BASEの販売状況は lib/beans 側で1時間キャッシュ。豆データの更新は1分で反映
export const revalidate = 60;

const label = (b: BeanView) => b.name.replace(/　/g, " ");

function BeanTile({ bean }: { bean: BeanView }) {
  return (
    <li className="flex gap-4 sm:gap-6 rounded-2xl border border-ink-primary/15 bg-white/60 p-4 sm:p-5">
      {bean.image && (
        <Link href={`/beans/${bean.slug}`} className="relative block w-24 sm:w-36 shrink-0 self-start aspect-[5/7] overflow-hidden rounded-lg bg-white" tabIndex={-1} aria-hidden="true">
          <Image src={bean.image.url} alt="" fill sizes="(max-width: 640px) 96px, 144px" className="object-contain" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <span className="inline-block rounded-full border border-ink-primary/30 px-2.5 text-[11px] text-ink-primary mb-2">
          {bean.roastShort}
        </span>
        <h2 className="font-mincho text-ink-primary text-lg leading-snug mb-2">
          <Link href={`/beans/${bean.slug}`} className="hover:opacity-75 transition-opacity">
            {label(bean)}
          </Link>
        </h2>
        <p className="text-ink-secondary text-[13px] leading-relaxed mb-2">{bean.flavor}</p>
        <p className="text-ink-secondary/70 text-[12px] mb-4">
          {bean.weight} / ¥{bean.price.toLocaleString()}
          {bean.pricePerCup && `（1杯あたり${bean.pricePerCup}）`}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <BuyButton bean={bean} medium="beans" campaign="index" content="tile" />
          <Link href={`/beans/${bean.slug}`} className="text-[13px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            詳しく見る
          </Link>
        </div>
      </div>
    </li>
  );
}

export default async function BeansPage() {
  const beans = await getBeanViews();
  const light = beans.filter((b) => b.roastKind === "light");
  const dark = beans.filter((b) => b.roastKind !== "light");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "灯台の珈琲焙煎所mumuの珈琲豆",
    itemListElement: beans.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/beans/${b.slug}`,
      name: label(b),
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChromeV2>
        <div className="min-h-screen pt-32 pb-24 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-4">
              mumuの珈琲豆
            </h1>
            <p className="text-ink-secondary text-[15px] leading-loose mb-12">
              自家焙煎のスペシャルティコーヒーを、100gから。
              <br className="hidden sm:block" />
              購入はBASE（オンラインショップ）で、送料は全国一律¥350です。
            </p>

            {beans.length === 0 ? (
              <p className="text-ink-secondary text-sm">現在準備中です。しばらくお待ちください。</p>
            ) : (
              <>
                {/* 味のものさし：浅煎り＝華やか・すっきり ←→ 深煎り＝ほろ苦い・コク */}
                <section aria-labelledby="taste-map" className="mb-14 rounded-2xl border border-ink-primary/15 bg-white/60 p-5 sm:p-6">
                  <h2 id="taste-map" className="font-mincho text-ink-primary text-lg mb-1">味で選ぶ</h2>
                  <p className="text-[12px] text-ink-secondary/70 mb-5">迷ったら、ブラックで飲むなら浅煎り、ミルクを入れるなら深煎りから。</p>
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-ink-primary/15 to-ink-primary/60 mb-4" />
                  <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div>
                      <p className="text-ink-secondary/70 text-[12px] mb-2">華やか・すっきり（浅煎り）</p>
                      <ul className="space-y-1.5">
                        {light.map((b) => (
                          <li key={b.slug}>
                            <Link href={`/beans/${b.slug}`} className="text-ink-primary underline underline-offset-4 hover:opacity-75">{label(b)}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-right">
                      <p className="text-ink-secondary/70 text-[12px] mb-2">ほろ苦い・コク（深煎り）</p>
                      <ul className="space-y-1.5">
                        {dark.map((b) => (
                          <li key={b.slug}>
                            <Link href={`/beans/${b.slug}`} className="text-ink-primary underline underline-offset-4 hover:opacity-75">{label(b)}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </section>

                <ul className="space-y-5 mb-14">
                  {beans.map((b) => (
                    <BeanTile key={b.slug} bean={b} />
                  ))}
                </ul>
              </>
            )}

            <p className="text-[13px] text-ink-secondary leading-relaxed">
              送料・お届け日数・豆と粉の選び方は
              <Link href="/guide" className="text-ink-primary underline underline-offset-4 hover:opacity-75 mx-1">はじめての方へ</Link>
              にまとめています。
            </p>
          </div>
        </div>
      </SiteChromeV2>
    </>
  );
}
