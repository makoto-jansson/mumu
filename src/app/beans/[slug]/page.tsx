// 珈琲豆の詳細ページ /beans/[slug]（v3・青×白 2026-11 リニューアル）
//
// 「HPで選んで、BASEで払う」の“選ぶ”を担うページ。BASE（theshop.jp）にしか商品情報が無いと
// 検索での評価が自ドメインに貯まらないので、ここに産地・味・飲み方・関連記事まで書く。
// 正本は Figma「PC｜豆の詳細」6:117 /「スマホ｜豆の詳細」61:137。
// 構成: パンくず → パッケージ＋名前・値段・購入 → 産地の情報 → この豆をもっと知る → ほかの豆
// 購入ボタンはファーストビュー内と、スマホでそれを過ぎたら画面下に固定で出す。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import SectionTitle from "@/components/site/SectionTitle";
import ReadingCard, { type ReadingItem } from "@/components/site/ReadingCard";
import BeanCard from "@/components/site/BeanCard";
import StickyCta from "@/components/site/StickyCta";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import { beanName } from "@/components/beanPage/TasteMap";
import { ROAST_EN } from "@/components/beanPage/BeanRow";
import RoastScale from "@/components/beanPage/RoastScale";
import s from "@/components/beanPage/beanPage.module.css";
import { getBeanBySlug, getBeanViews, shopUrlWithUtm, type BeanView } from "@/lib/beans";
import { getAllColumns } from "@/lib/microcms";
import { CATEGORY_LABEL, categoryOf } from "@/lib/columnCategory";

const BASE_URL = "https://www.mumucoffee-feel.com";

export const revalidate = 60;

// 産地の表の行（値が無い行は出さない）
type OriginKey = "country" | "region" | "farm" | "variety" | "process";
const ORIGIN_ROWS: { key: OriginKey; en: string; ja: string }[] = [
  { key: "country", en: "Country", ja: "生産国" },
  { key: "region", en: "Region", ja: "生産地" },
  { key: "farm", en: "Farm", ja: "農園" },
  { key: "variety", en: "Variety", ja: "品種" },
  { key: "process", en: "Process", ja: "精製" },
];

// 産地の絵（浅煎り＝朝、深煎り＝夜、その他＝夕方の灯台）
const ORIGIN_PIC: Record<BeanView["roastKind"], string> = {
  light: "/v2/asa-e.jpg",
  dark: "/v2/yoru-e.jpg",
  other: "/v2/yuu-e.jpg",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const bean = await getBeanBySlug(slug);
  if (!bean) return { title: "珈琲豆が見つかりません" };
  const title = `${beanName(bean)}（${bean.roastShort}）の珈琲豆`;
  const description = `${bean.flavor}。${bean.roastShort}・${bean.weight} ¥${bean.price.toLocaleString()}。灯台の珈琲焙煎所mumuが自家焙煎したスペシャルティコーヒーです。`;
  const url = `${BASE_URL}/beans/${slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: bean.image ? [{ url: bean.image.url }] : undefined,
    },
  };
}

export default async function BeanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [bean, all, columns] = await Promise.all([getBeanBySlug(slug), getBeanViews(), getAllColumns()]);
  if (!bean) notFound();

  const url = `${BASE_URL}/beans/${slug}`;
  const name = beanName(bean);
  const no = String(all.findIndex((b) => b.slug === slug) + 1).padStart(2, "0");
  const origin = bean.detail?.origin ?? {};
  const originRows = ORIGIN_ROWS.filter((r) => origin[r.key]).map((r) =>
    // ウォッシングステーション（精製所）の名前が入っている豆は、見出しもそれに合わせる
    r.key === "farm" && origin.farm?.includes("ステーション")
      ? { ...r, en: "Station", ja: "ウォッシングステーション" }
      : r
  );
  const related: ReadingItem[] = (bean.detail?.relatedColumns ?? [])
    .map((id) => columns.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({
      id: c.id,
      title: c.title,
      category: CATEGORY_LABEL[categoryOf(c.id)],
      image: c.eyecatch?.url,
    }));
  const others = all.filter((b) => b.slug !== slug);
  // おすすめの飲み方（説明文に同じ一文が入っている豆では重ねて出さない）
  const howTo =
    bean.detail?.howToEnjoy && !bean.description.includes(bean.detail.howToEnjoy) ? bean.detail.howToEnjoy : "";
  const buyUrl = (content: string) => shopUrlWithUtm(bean.shopUrl, { medium: "beans", campaign: slug, content });

  // 構造化データ: Product（このページでは購入できないので販売者向けリスティングは狙わず、
  // 価格つきの商品スニペット想定）＋ パンくず
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${url}#product`,
        name,
        description: bean.description,
        image: bean.image ? [bean.image.url] : undefined,
        brand: { "@id": `${BASE_URL}/#organization` },
        category: "コーヒー豆",
        offers: {
          "@type": "Offer",
          price: bean.price,
          priceCurrency: "JPY",
          availability: bean.onSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          url: bean.shopUrl,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "珈琲豆", item: `${BASE_URL}/beans` },
          { "@type": "ListItem", position: 3, name, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChrome ctaSpace={bean.onSale}>
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { href: "/beans", label: "珈琲豆" }, { label: name }]} />

        {/* ---------- パッケージ＋名前・値段・購入 ---------- */}
        <section className={`${site.wrap} ${s.product}`} aria-labelledby="bean-title">
          <div className={s.pkg}>
            <div className={s.pkgArch}>
              {bean.image && (
                <span className={s.pkgImg}>
                  <Image
                    src={bean.image.url}
                    alt={`${name}のパッケージ`}
                    fill
                    loading="eager"
                    fetchPriority="high"
                    sizes="(min-width: 900px) 290px, 60vw"
                  />
                </span>
              )}
            </div>
            <p className={s.roastStamp} aria-hidden="true">
              <span className={s.roastStampEn}>{ROAST_EN[bean.roastKind]}</span>
              <span className={s.roastStampJa}>{bean.roastShort}</span>
            </p>
          </div>

          <div className={s.buy}>
            <div className={s.nameBlock}>
              <span className={`${site.label} ${s.no}`} aria-hidden="true">
                No. {no}
              </span>
              <h1 id="bean-title" className={s.title}>
                {bean.detail?.nameEn && (
                  <span className={s.titleEn} lang="en">
                    {bean.detail.nameEn}
                  </span>
                )}
                <span className={s.titleJa}>{name}</span>
              </h1>
            </div>
            {/* 大きな明朝は短い「味の言葉」、くわしい説明は本文の書体で */}
            <p className={s.desc}>{bean.flavor}</p>
            {(bean.description || howTo) && (
              <p className={s.howTo}>
                {bean.description}
                {howTo}
              </p>
            )}

            <div className={s.buyBox}>
              <p className={s.buyPrice}>
                <span className={s.buyPriceNum}>¥{bean.price.toLocaleString()}</span>
                <span className={s.buyPriceUnit}>/ {bean.weight}</span>
                {bean.pricePerCup && <span className={s.buyPriceCup}>1杯あたり {bean.pricePerCup}</span>}
              </p>
              {bean.onSale ? (
                <a
                  id="buy-main"
                  href={buyUrl("hero")}
                  target="_blank"
                  rel="noopener"
                  className={buttonClass("primary", "L", s.buyBtn)}
                >
                  BASEで購入する <span className={site.arrow} aria-hidden="true">↗</span>
                  <span className={site.srOnly}>（新しいタブで開きます）</span>
                </a>
              ) : (
                <p className={s.howTo}>ただいま販売をお休みしています。</p>
              )}
              <dl className={s.facts}>
                <div>
                  <dt className={site.label}>Shipping</dt>
                  <dd>全国一律 ¥350</dd>
                </div>
                <div>
                  <dt className={site.label}>Delivery</dt>
                  <dd>7日以内に発送</dd>
                </div>
                <div>
                  <dt className={site.label}>Ground</dt>
                  <dd>粉は備考に「粉希望」</dd>
                </div>
              </dl>
            </div>

            <RoastScale kind={bean.roastKind} label={bean.roastShort} />
          </div>
        </section>

        {/* ---------- 産地の情報 ---------- */}
        {originRows.length > 0 && (
          <section className={`${s.section} ${s.pale}`} aria-labelledby="origin-title">
            <div className={`${site.wrap} ${s.origin}`}>
              <h2 id="origin-title" className={s.originTitle}>
                <span className={s.originEn} aria-hidden="true">
                  Origin
                </span>
                <span className={s.originJa}>産地の情報</span>
              </h2>
              <div className={s.originPicWrap}>
                <span className={s.originPic}>
                  <Image src={ORIGIN_PIC[bean.roastKind]} alt="" fill sizes="(min-width: 900px) 300px, 100vw" />
                </span>
              </div>
              <dl className={s.originList}>
                {originRows.map((r) => (
                  <div key={r.key}>
                    <dt>
                      <span className={`${site.label} ${s.originDtEn}`} aria-hidden="true">
                        {r.en}
                      </span>
                      <span className={s.originDtJa}>{r.ja}</span>
                    </dt>
                    <dd>{origin[r.key]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* ---------- この豆をもっと知る ---------- */}
        {related.length > 0 && (
          <section className={s.section} aria-labelledby="reading-title">
            <div className={`${site.wrap} ${s.reading}`}>
              <div className={s.titleRow}>
                <SectionTitle id="reading-title" en="Reading" ja="この豆をもっと知る" />
              </div>
              <ul className={s.readingList}>
                {related.slice(0, 4).map((r, i) => (
                  <li key={r.id}>
                    <ReadingCard item={r} index={i} tall sizes="(min-width: 900px) 276px, 220px" />
                  </li>
                ))}
              </ul>
              <Link href="/column" className={`${site.textLink} ${s.spLink}`}>
                すべて見る <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}

        {/* ---------- ほかの豆 ---------- */}
        {others.length > 0 && (
          <section className={`${s.section} ${s.pale}`} aria-labelledby="others-title">
            <div className={`${site.wrap} ${s.others}`}>
              <SectionTitle
                id="others-title"
                en="Other Beans"
                ja="ほかの豆"
                compact
                link={{ href: "/beans", label: "すべての豆と選び方" }}
              />
              <ul className={s.otherList}>
                {others.map((b) => (
                  <li key={b.slug}>
                    <BeanCard
                      bean={b}
                      index={all.findIndex((x) => x.slug === b.slug)}
                      medium="beans"
                      campaign={slug}
                      action="view"
                    />
                  </li>
                ))}
              </ul>
              <Link href="/beans" className={`${site.textLink} ${s.spLink}`}>
                すべての豆と選び方 <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}

        {bean.onSale && (
          <StickyCta
            watchId="buy-main"
            href={buyUrl("sticky")}
            label={`¥${bean.price.toLocaleString()}　BASEで購入する`}
            external
          />
        )}
      </SiteChrome>
    </>
  );
}
