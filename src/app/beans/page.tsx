// 珈琲豆の一覧 /beans（リニューアル段階Bで作り直し）
//
// 豆は少数なので、絞り込みタブではなく「味のものさし」1本で全体を見せ、
// 各カードから詳細（/beans/[slug]）へ、または直接BASEの個別商品ページへ進めるようにする。
// カードとものさしは TOP と共通（components/beans/BeanTile・TasteRuler）。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import BeanTile, { beanLabel } from "@/components/beans/BeanTile";
import TasteRuler from "@/components/beans/TasteRuler";
import { getBeanViews } from "@/lib/beans";

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

export default async function BeansPage() {
  const beans = await getBeanViews();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "灯台の珈琲焙煎所mumuの珈琲豆",
    itemListElement: beans.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/beans/${b.slug}`,
      name: beanLabel(b),
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
                <div className="mb-14">
                  <TasteRuler beans={beans} />
                </div>

                <h2 className="sr-only">豆の一覧</h2>
                <ul className="space-y-5 mb-14">
                  {beans.map((b) => (
                    <BeanTile key={b.slug} bean={b} medium="beans" campaign="index" />
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
