// 読みもの（SEOコラム）一覧 /column（v3・青×白 2026-11 リニューアル）
//
// 正本は Figma「PC｜読みもの一覧」68:402 /「スマホ｜読みもの一覧」70:166。
// 構成: パンくず → ページの頭（カテゴリへの目次） → はじめに読む（入門ガイド） → カテゴリごと → 豆へ
// カテゴリごとに、新しい順の最初の3本（スマホは横にすべらせる）をカード、残りを1行リストで並べる。
// SEO/AIO: カテゴリ分類・構造化データ(CollectionPage/ItemList/Breadcrumb)。microCMS「columns」を limit100 で全件取得。

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageHead from "@/components/site/PageHead";
import ReadingCard from "@/components/site/ReadingCard";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import { getAllColumns } from "@/lib/microcms";
import { CATEGORY_LABEL, categoryOf, type ColumnCategory } from "@/lib/columnCategory";
import { excerpt } from "@/lib/articleHtml";
import c from "./column.module.css";

const BASE_URL = "https://www.mumucoffee-feel.com";

// はじめに読む記事（入門ガイド）
const FEATURED_ID = "coffee-beginners-guide";

export const metadata: Metadata = {
  title: "コーヒーの読みもの一覧",
  description:
    "コーヒーの基礎知識から産地・豆図鑑まで、灯台の珈琲焙煎所mumuが書くコーヒーの読みもの一覧。焙煎度・挽き方・保存・淹れ方・エチオピア/インドネシアなど産地の特徴を、図解つきでやさしく解説します。",
  openGraph: {
    title: "コーヒーの読みもの一覧 | 灯台の珈琲焙煎所mumu",
    description: "コーヒーの基礎知識と産地・豆図鑑。焙煎度・挽き方・保存・淹れ方・産地の特徴を図解つきで解説。",
    url: `${BASE_URL}/column`,
  },
  alternates: { canonical: `${BASE_URL}/column` },
};

// 記事追加をすぐ反映（60秒ごと再検証）
export const revalidate = 60;

const SECTIONS: { key: ColumnCategory; en: string; label: string; lead: string }[] = [
  {
    key: "basics",
    en: "Basics",
    label: "コーヒーの基礎知識",
    lead: "焙煎度・挽き方・保存・淹れ方・味わいなど、一杯をおいしくする土台の話。",
  },
  {
    key: "origins",
    en: "Origins",
    label: "産地・豆の図鑑",
    lead: "エチオピア・インドネシアをはじめ、世界の産地ごとの個性と選び方。",
  },
  { key: "reading", en: "Others", label: "そのほかの読みもの", lead: "コーヒーにまつわる、その他の話題。" },
];

// 読むのにかかる時間（分）。日本語の黙読は1分あたり約500字として、図解を除いた本文の文字数から出す
function readMinutes(html: string): number {
  const chars = (html || "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 500));
}

export default async function ColumnPage() {
  const posts = await getAllColumns();
  // 新しい順
  const sorted = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const grouped: Record<ColumnCategory, typeof sorted> = { basics: [], origins: [], reading: [] };
  for (const p of sorted) grouped[categoryOf(p.id)].push(p);
  const sections = SECTIONS.filter((s) => grouped[s.key].length > 0);
  const featured = sorted.find((p) => p.id === FEATURED_ID);

  // 構造化データ: CollectionPage + ItemList（全記事）+ Breadcrumb
  const itemList = {
    "@type": "ItemList",
    itemListElement: sorted.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/column/${p.id}`,
      name: p.title,
    })),
  };
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${BASE_URL}/column`,
        name: "コーヒーの読みもの一覧",
        description: "コーヒーの基礎知識と産地・豆図鑑。灯台の珈琲焙煎所mumuによるコーヒーの読みもの一覧。",
        url: `${BASE_URL}/column`,
        isPartOf: { "@type": "WebSite", name: "灯台の珈琲焙煎所mumu", url: BASE_URL },
        mainEntity: itemList,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "読みもの", item: `${BASE_URL}/column` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChrome>
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: "読みもの" }]} />
        <PageHead
          label="Column"
          en="Reading"
          size="xl"
          title="コーヒーの読みもの"
          after={
            sections.length > 0 && (
              <nav aria-label="カテゴリ" className={c.cats}>
                <ul>
                  <li>
                    <span className={c.catAll}>
                      すべて <span className={site.label}>{sorted.length}</span>
                    </span>
                  </li>
                  {sections.map((s) => (
                    <li key={s.key}>
                      <a href={`#${s.key}`}>
                        {s.label} <span className={site.label}>{grouped[s.key].length}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )
          }
        >
          焙煎度・挽き方・保存・淹れ方といった基礎から、エチオピアやインドネシアなど産地ごとの個性まで。
          <br className={site.brPc} />
          灯台の珈琲焙煎所mumuが、自家焙煎の実感と図解を交えて、コーヒーを少し深く楽しむための記事を綴っています。全
          {sorted.length}記事、カテゴリごとにまとめました。
        </PageHead>

        {sorted.length === 0 && <p className={`${site.wrap} ${c.empty}`}>ただいま準備中です。少しずつ綴っていきます。</p>}

        {/* ---------- はじめに読む ---------- */}
        {featured && (
          <section className={c.featured} aria-labelledby="featured-title">
            <div className={`${site.wrap} ${c.featuredInner}`}>
              <Link href={`/column/${featured.id}`} className={c.featuredPic} tabIndex={-1} aria-hidden="true">
                <Image
                  src={featured.eyecatch?.url ?? "/v2/yoru-e.jpg"}
                  alt=""
                  fill
                  sizes="(min-width: 900px) 480px, 100vw"
                />
              </Link>
              <div className={c.featuredText}>
                <p className={c.featuredTags}>
                  <span className={c.pill}>はじめに読む</span>
                  <span className={`${site.label} ${c.featuredLabel}`} aria-hidden="true">
                    Guide
                  </span>
                </p>
                <h2 id="featured-title" className={c.featuredTitle}>
                  <Link href={`/column/${featured.id}`}>{featured.title}</Link>
                </h2>
                <p className={c.featuredExcerpt}>{excerpt(featured.content, 80)}</p>
                <Link href={`/column/${featured.id}`} className={buttonClass("outline", "S", c.featuredBtn)}>
                  <span className={site.srOnly}>入門ガイドを</span>読む{" "}
                  <span className={site.arrow} aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ---------- カテゴリごと ---------- */}
        {sections.map((s) => {
          const list = grouped[s.key];
          const cards = list.slice(0, 3);
          const rest = list.slice(3);
          return (
            <section key={s.key} id={s.key} className={c.cat} aria-labelledby={`cat-${s.key}`}>
              <div className={`${site.wrap} ${c.catInner}`}>
                <div className={c.catHead}>
                  <p className={c.catEn} aria-hidden="true">
                    {s.en}
                  </p>
                  <div className={c.catText}>
                    <h2 id={`cat-${s.key}`} className={c.catTitle}>
                      {s.label}
                      <span className={c.catCount}>{list.length} 記事</span>
                    </h2>
                    <p className={c.catLead}>{s.lead}</p>
                  </div>
                </div>
                <ul className={c.cards}>
                  {cards.map((p, i) => (
                    <li key={p.id}>
                      <ReadingCard
                        item={{ id: p.id, title: p.title, category: CATEGORY_LABEL[s.key], image: p.eyecatch?.url }}
                        index={i}
                        sizes="(min-width: 900px) 373px, 220px"
                      />
                    </li>
                  ))}
                </ul>
                {/* 残りの記事: 雑誌の索引のような1行リスト（2026-11-28 設計し直し）。
                    最初の1行リストは題名だけで、どの行も同じ重さだったため「線と文字の連続」に見えた。
                    一覧は拾い読みして選ぶ場所なので、1行ごとに「番号 → 題名（太い明朝）→ 書き出し1行（細いゴシック）
                    → 読む時間」の階層を持たせ、題名と書き出しにははっきり差をつける。
                    各行のカテゴリ名は欄の見出しと重複するので出さない。番号は上のカード3本（01〜03）の続き */}
                {rest.length > 0 && (
                  <ol className={c.index} start={4}>
                    {rest.map((p, i) => (
                      <li key={p.id}>
                        <Link href={`/column/${p.id}`} className={c.indexRow}>
                          <span className={c.indexNo} aria-hidden="true">
                            {String(i + 4).padStart(2, "0")}
                          </span>
                          <span className={c.indexText}>
                            <span className={c.indexTitle}>{p.title}</span>
                            <span className={c.indexDek}>{excerpt(p.content, 80)}</span>
                          </span>
                          <span className={c.indexMeta}>
                            <span className={site.label}>{readMinutes(p.content)} min</span>
                            <span className={`${site.arrow} ${c.indexArrow}`} aria-hidden="true">
                              →
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </section>
          );
        })}

        {/* ---------- 豆へ ---------- */}
        <section className={c.next} aria-labelledby="next-title">
          <div className={`${site.wrap} ${c.nextInner}`}>
            <div>
              <p className={`${site.label} ${c.nextLabel}`} aria-hidden="true">
                Beans
              </p>
              <h2 id="next-title" className={c.nextTitle}>
                読んだら、淹れてみる。
              </h2>
            </div>
            <Link href="/beans" className={buttonClass("primary", "L", c.nextBtn)}>
              珈琲豆をえらぶ <span className={site.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </SiteChrome>
    </>
  );
}
