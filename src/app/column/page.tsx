// 読みもの（SEOコラム）一覧 /column
// SEO/AIO最適化: カテゴリ分類・各記事の抜粋・構造化データ(CollectionPage/ItemList/Breadcrumb)。
// microCMS「columns」を limit100 で全件取得して表示する。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import { getAllColumns, formatPostDate } from "@/lib/microcms";

const BASE_URL = "https://www.mumucoffee-feel.com";

export const metadata: Metadata = {
  title: "コーヒーの読みもの一覧",
  description:
    "コーヒーの基礎知識から産地・豆図鑑まで、灯台の珈琲焙煎所mumuが書くコーヒーの読みもの一覧。焙煎度・挽き方・保存・淹れ方・エチオピア/インドネシアなど産地の特徴を、図解つきでやさしく解説します。",
  openGraph: {
    title: "コーヒーの読みもの一覧 | 灯台の珈琲焙煎所mumu",
    description:
      "コーヒーの基礎知識と産地・豆図鑑。焙煎度・挽き方・保存・淹れ方・産地の特徴を図解つきで解説。",
    url: `${BASE_URL}/column`,
  },
  alternates: { canonical: `${BASE_URL}/column` },
};

// 記事追加をすぐ反映（60秒ごと再検証）
export const revalidate = 60;

// 本文HTMLからプレーンな抜粋を作る（図解SVG等は除去）
function excerpt(html: string, len = 92): string {
  const text = (html || "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > len ? text.slice(0, len) + "…" : text;
}

// slug からカテゴリを判定（microCMSにカテゴリ項目が無いためサイト側で分類）。
// 未知のslugは "reading"（読みもの）に入れて必ず表示されるようにする。
const ORIGINS = new Set([
  "ethiopia-coffee", "mandheling-coffee", "brazil-coffee", "colombia-coffee",
  "guatemala-coffee", "kenya-coffee", "geisha-coffee", "tanzania-coffee",
  "blue-mountain-coffee", "coffee-belt", "coffee-region-flavor-map", "coffee-varieties",
  "costa-rica-coffee", "panama-coffee",
]);
function categoryOf(id: string): "basics" | "origins" | "reading" {
  if (ORIGINS.has(id)) return "origins";
  // コーヒーの基礎系（basics）はそれ以外の既知slug。まず基礎、なければ reading。
  return "basics";
}

const SECTIONS: { key: "basics" | "origins" | "reading"; label: string; lead: string }[] = [
  { key: "basics", label: "コーヒーの基礎知識", lead: "焙煎度・挽き方・保存・淹れ方・味わいなど、一杯をおいしくする土台の話。" },
  { key: "origins", label: "産地・豆の図鑑", lead: "エチオピア・インドネシアをはじめ、世界の産地ごとの個性と選び方。" },
  { key: "reading", label: "そのほかの読みもの", lead: "コーヒーにまつわる、その他の話題。" },
];

export default async function ColumnPage() {
  const posts = await getAllColumns();
  // 新しい順
  const sorted = [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));

  const grouped = { basics: [] as typeof sorted, origins: [] as typeof sorted, reading: [] as typeof sorted };
  for (const p of sorted) grouped[categoryOf(p.id)].push(p);

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
        description:
          "コーヒーの基礎知識と産地・豆図鑑。灯台の珈琲焙煎所mumuによるコーヒーの読みもの一覧。",
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteChromeV2>
        <div className="min-h-screen pt-32 pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            {/* パンくず */}
            <nav aria-label="パンくず" className="mb-10 text-[11px] tracking-[0.15em] text-ink-secondary/70">
              <Link href="/" className="hover:text-ink-primary transition-colors">ホーム</Link>
              <span className="mx-2">/</span>
              <span className="text-ink-primary">読みもの</span>
            </nav>

            {/* 見出し＋導入（AIO向けに要約を明示） */}
            <header className="mb-16">
              <p className="font-serif italic text-ink-secondary text-[11px] tracking-[0.2em] mb-6">— column</p>
              <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-6">
                コーヒーの読みもの
              </h1>
              <p className="text-ink-secondary text-[15px] leading-loose font-light">
                焙煎度・挽き方・保存・淹れ方といった基礎から、エチオピアやインドネシアなど産地ごとの個性まで。
                灯台の珈琲焙煎所mumuが、自家焙煎の実感と図解を交えて、コーヒーを少し深く楽しむための記事を綴っています。
                全{sorted.length}記事、カテゴリごとにまとめました。
              </p>
            </header>

            {sorted.length === 0 ? (
              <div className="border-t border-ink-primary/15 pt-16">
                <p className="text-ink-secondary text-sm font-light leading-relaxed">
                  ただいま準備中です。少しずつ綴っていきます。
                </p>
              </div>
            ) : (
              SECTIONS.filter((s) => grouped[s.key].length > 0).map((section) => (
                <section key={section.key} className="mb-16" aria-labelledby={`sec-${section.key}`}>
                  <div className="border-t border-ink-primary/15 pt-8 mb-2">
                    <h2 id={`sec-${section.key}`} className="font-mincho text-ink-primary text-lg font-medium tracking-wide">
                      {section.label}
                      <span className="ml-2 text-ink-secondary/50 text-xs font-sans">{grouped[section.key].length}</span>
                    </h2>
                    <p className="text-ink-secondary/80 text-[13px] font-light mt-2 leading-relaxed">{section.lead}</p>
                  </div>
                  <ul className="mt-2">
                    {grouped[section.key].map((p) => (
                      <li key={p.id}>
                        <Link
                          href={`/column/${p.id}`}
                          className="group block py-6 border-b border-ink-primary/10 hover:bg-ink-primary/[0.03] transition-colors duration-300"
                        >
                          <p className="text-ink-secondary/60 text-[11px] tracking-[0.2em]">
                            {formatPostDate(p.publishedAt)}
                          </p>
                          <h3 className="font-mincho text-ink-primary text-lg mt-1.5 leading-relaxed group-hover:opacity-80 transition-opacity">
                            {p.title}
                          </h3>
                          <p className="text-ink-secondary text-[13.5px] font-light mt-1.5 leading-relaxed line-clamp-2">
                            {excerpt(p.content)}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ))
            )}
          </div>
        </div>
      </SiteChromeV2>
    </>
  );
}
