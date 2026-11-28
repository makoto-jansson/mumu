// 珈琲豆の一覧 /beans（v3・青×白 2026-11 リニューアル）
//
// 正本は Figma「PC｜豆の一覧」51:295 /「スマホ｜豆の一覧」58:101。
// 構成: パンくず → ページの頭 → 味で選ぶ（Light←→Darkの線） → 豆の行 → はじめての方へ
// 各行から BASE の個別商品ページ（購入）と豆の詳細（/beans/[slug]）の両方へ進める。

import type { Metadata } from "next";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageHead from "@/components/site/PageHead";
import GuideBlock from "@/components/site/GuideBlock";
import site from "@/components/site/site.module.css";
import TasteMap, { beanName } from "@/components/beanPage/TasteMap";
import BeanRow from "@/components/beanPage/BeanRow";
import s from "@/components/beanPage/beanPage.module.css";
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
    "@graph": [
      {
        "@type": "ItemList",
        name: "灯台の珈琲焙煎所mumuの珈琲豆",
        itemListElement: beans.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${BASE_URL}/beans/${b.slug}`,
          name: beanName(b),
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "珈琲豆", item: `${BASE_URL}/beans` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChrome>
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: "珈琲豆" }]} />
        <PageHead label="Beans" en="The Beans" title="mumuの珈琲豆">
          自家焙煎のスペシャルティコーヒーを、100gから。
          <br className={site.brPc} />
          購入はBASE（オンラインショップ）で、送料は全国一律¥350です。
        </PageHead>

        {beans.length === 0 ? (
          <p className={`${site.wrap} ${s.note}`}>ただいま準備中です。しばらくお待ちください。</p>
        ) : (
          <>
            <TasteMap beans={beans} />
            <section className={s.list} aria-label="豆の一覧">
              <div className={site.wrap}>
                <ul className={s.rows}>
                  {beans.map((b, i) => (
                    <li key={b.slug}>
                      <BeanRow bean={b} index={i} />
                    </li>
                  ))}
                </ul>
                <p className={s.note}>
                  豆のままでお届けします。粉をご希望の方は、ご注文時の備考欄に「粉希望」とご記入ください。
                </p>
              </div>
            </section>
          </>
        )}

        <GuideBlock tone="pale" button={{ href: "/guide", label: "くわしく見る", arrow: true }} />
      </SiteChrome>
    </>
  );
}
