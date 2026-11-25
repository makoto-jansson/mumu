// 珈琲豆の詳細ページ /beans/[slug]（新設・リニューアル段階B）
//
// 「HPで選んで、BASEで払う」の“選ぶ”を担うページ。BASE（theshop.jp）にしか商品情報が無いと
// 検索での評価が自ドメインに貯まらないので、ここに産地・味・飲み方・関連記事まで厚く書く。
// 購入ボタンはファーストビュー内と末尾の2か所。購入はBASEの個別商品ページで行う。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import BuyButton from "@/components/beans/BuyButton";
import { getBeanBySlug, getBeanViews } from "@/lib/beans";
import { getAllColumns } from "@/lib/microcms";

const BASE_URL = "https://www.mumucoffee-feel.com";

export const revalidate = 60;

// 産地表の行（値が無い行は出さない）
const ORIGIN_ROWS = [
  ["country", "生産国"],
  ["region", "生産地"],
  ["farm", "農園"],
  ["variety", "品種"],
  ["process", "精製"],
] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bean = await getBeanBySlug(slug);
  if (!bean) return { title: "珈琲豆が見つかりません" };
  const title = `${bean.name.replace(/　/g, " ")}（${bean.roastShort}）の珈琲豆`;
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

export default async function BeanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [bean, all, columns] = await Promise.all([
    getBeanBySlug(slug),
    getBeanViews(),
    getAllColumns(),
  ]);
  if (!bean) notFound();

  const url = `${BASE_URL}/beans/${slug}`;
  const name = bean.name.replace(/　/g, " ");
  const originRows = ORIGIN_ROWS.filter(([key]) => bean.detail?.origin[key]);
  const related = (bean.detail?.relatedColumns ?? [])
    .map((id) => columns.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const others = all.filter((b) => b.slug !== slug);
  const utm = { medium: "beans", campaign: slug };

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
          availability: bean.onSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChromeV2>
        <div className="min-h-screen pt-32 pb-24 px-6">
          <div className="max-w-3xl mx-auto">
            {/* パンくず */}
            <nav aria-label="パンくず" className="mb-10 text-[11px] tracking-[0.15em] text-ink-secondary/70 flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-ink-primary transition-colors">ホーム</Link>
              <span aria-hidden="true">/</span>
              <Link href="/beans" className="hover:text-ink-primary transition-colors">珈琲豆</Link>
              <span aria-hidden="true">/</span>
              <span className="text-ink-primary/80">{name}</span>
            </nav>

            {/* ファーストビュー：写真＋名前・価格・購入ボタン */}
            <section className="grid gap-8 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-start mb-16">
              {bean.image && (
                <div className="relative aspect-[5/7] w-full max-w-[320px] mx-auto md:mx-0 overflow-hidden rounded-xl border border-ink-primary/10 bg-white">
                  <Image
                    src={bean.image.url}
                    alt={`${name}の珈琲豆`}
                    fill
                    priority
                    sizes="(max-width: 768px) 320px, 300px"
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <span className="inline-block rounded-full border border-ink-primary/30 px-3 py-0.5 text-[12px] text-ink-primary mb-4">
                  {bean.roastShort}
                </span>
                <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-4">
                  {name}
                </h1>
                <p className="text-ink-primary/90 text-[15px] leading-relaxed mb-6">{bean.flavor}</p>
                <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[13px] text-ink-secondary mb-8">
                  <dt className="text-ink-secondary/60">価格</dt>
                  <dd>¥{bean.price.toLocaleString()}（{bean.weight}）</dd>
                  {bean.pricePerCup && (
                    <>
                      <dt className="text-ink-secondary/60">1杯あたり</dt>
                      <dd>{bean.pricePerCup}（豆12.5gで淹れた場合）</dd>
                    </>
                  )}
                  <dt className="text-ink-secondary/60">送料</dt>
                  <dd>全国一律 ¥350</dd>
                </dl>
                <BuyButton bean={bean} {...utm} content="hero" size="lg" />
                <p className="mt-4 text-[12px] text-ink-secondary/60 leading-relaxed">
                  購入はBASE（オンラインショップ）で行います。豆のままのお届けが基本で、粉もご用意できます。
                  <Link href="/guide" className="underline underline-offset-4 hover:text-ink-primary ml-1">
                    はじめての方へ
                  </Link>
                </p>
              </div>
            </section>

            {/* 味わい */}
            <section className="mb-14">
              <h2 className="font-mincho text-ink-primary text-xl tracking-wide mb-5">味わい</h2>
              <p className="text-ink-secondary text-[15px] leading-loose whitespace-pre-line">
                {bean.description}
              </p>
              {/* 焙煎度のものさし（浅煎り←→深煎り） */}
              <div className="mt-8" aria-label={`焙煎度：${bean.roastShort}`}>
                <div className="flex justify-between text-[12px] text-ink-secondary/70 mb-2">
                  <span>浅煎り（華やか・すっきり）</span>
                  <span>深煎り（ほろ苦い・コク）</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-ink-primary/10">
                  <span
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-ink-primary border-2 border-white shadow"
                    style={{ left: bean.roastKind === "light" ? "12%" : bean.roastKind === "dark" ? "88%" : "50%" }}
                  />
                </div>
              </div>
            </section>

            {/* おすすめの飲み方 */}
            {bean.detail?.howToEnjoy && (
              <section className="mb-14">
                <h2 className="font-mincho text-ink-primary text-xl tracking-wide mb-5">おすすめの飲み方</h2>
                <p className="text-ink-secondary text-[15px] leading-loose">{bean.detail.howToEnjoy}</p>
              </section>
            )}

            {/* 産地情報 */}
            {originRows.length > 0 && (
              <section className="mb-14">
                <h2 className="font-mincho text-ink-primary text-xl tracking-wide mb-5">産地の情報</h2>
                <table className="w-full text-[14px] border-t border-ink-primary/15">
                  <tbody>
                    {originRows.map(([key, label]) => (
                      <tr key={key} className="border-b border-ink-primary/15">
                        <th scope="row" className="w-28 py-3 pr-4 text-left font-normal text-ink-secondary/70 align-top">
                          {label}
                        </th>
                        <td className="py-3 text-ink-secondary">{bean.detail?.origin[key]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* この豆に合う読みもの */}
            {related.length > 0 && (
              <section className="mb-14">
                <h2 className="font-mincho text-ink-primary text-xl tracking-wide mb-5">この豆をもっと知る</h2>
                <ul className="divide-y divide-ink-primary/15 border-y border-ink-primary/15">
                  {related.map((c) => (
                    <li key={c.id}>
                      <Link href={`/column/${c.id}`} className="flex items-center justify-between gap-4 py-4 text-[14px] text-ink-secondary hover:text-ink-primary transition-colors">
                        <span>{c.title}</span>
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* 末尾の購入導線 */}
            <section className="mb-16 rounded-2xl border border-ink-primary/15 bg-white/60 p-6 md:p-8 text-center">
              <p className="font-mincho text-ink-primary text-lg mb-1">{name}</p>
              <p className="text-[13px] text-ink-secondary/70 mb-5">
                {bean.roastShort} / {bean.weight} / ¥{bean.price.toLocaleString()}・送料全国一律 ¥350
              </p>
              <BuyButton bean={bean} {...utm} content="bottom" size="lg" />
            </section>

            {/* ほかの豆 */}
            {others.length > 0 && (
              <section>
                <h2 className="font-mincho text-ink-primary text-xl tracking-wide mb-5">ほかの豆</h2>
                <ul className="grid gap-4 sm:grid-cols-2">
                  {others.map((b) => (
                    <li key={b.slug}>
                      <Link href={`/beans/${b.slug}`} className="flex items-center gap-4 rounded-xl border border-ink-primary/15 bg-white/60 p-3 hover:border-ink-primary/35 transition-colors">
                        {b.image && (
                          <span className="relative block w-14 shrink-0 aspect-[5/7] overflow-hidden rounded-md bg-white">
                            <Image src={b.image.url} alt="" fill sizes="56px" className="object-contain" />
                          </span>
                        )}
                        <span className="block min-w-0">
                          <span className="block text-[14px] text-ink-primary">{b.name.replace(/　/g, " ")}</span>
                          <span className="block text-[12px] text-ink-secondary/70">{b.roastShort}・¥{b.price.toLocaleString()}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </SiteChromeV2>
    </>
  );
}
