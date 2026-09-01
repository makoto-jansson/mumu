// 読みもの（コラム）の詳細ページ /column/[id]（microCMS「columns」の1記事）
// v2の帯レイアウト(SiteChromeV2)で囲み、本文HTMLを .article-body でprose整形する。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import RoasterProfile from "@/components/about/RoasterProfile";
import RelatedColumns from "@/components/column/RelatedColumns";
import { getColumn, formatPostDate } from "@/lib/microcms";

const BASE_URL = "https://www.mumucoffee-feel.com";

export const revalidate = 60;

function toPlain(html: string, len = 110): string {
  return html
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, len);
}

// 本文HTMLの「よくある質問」節から Q&A を抽出（FAQPage構造化データ用）。
// 基礎記事(<strong>Q. …</strong>)・産地記事(<strong>質問？</strong>)の両形式に対応。
function parseFaq(html: string): { q: string; a: string }[] {
  const h = html.search(/<h2[^>]*>\s*よくある質問/);
  if (h < 0) return [];
  let seg = html.slice(h);
  const after = seg.slice(5).search(/<h2/i);
  if (after > 0) seg = seg.slice(0, after + 5);
  const items: { q: string; a: string }[] = [];
  const re = /<p>\s*<strong>\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seg))) {
    const q = m[1].replace(/^Q[.．]?\s*/, "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    const a = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (q && a) items.push({ q, a });
  }
  return items;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getColumn(id);
  if (!post) return { title: "記事が見つかりません" };
  const description = toPlain(post.content);
  return {
    title: post.title,
    description,
    alternates: { canonical: `${BASE_URL}/column/${id}` },
    openGraph: {
      title: post.title,
      description,
      url: `${BASE_URL}/column/${id}`,
      type: "article",
      images: post.eyecatch ? [{ url: post.eyecatch.url }] : undefined,
    },
  };
}

export default async function ColumnPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getColumn(id);
  if (!post) notFound();

  const url = `${BASE_URL}/column/${id}`;
  const description = toPlain(post.content, 140);
  const image = post.eyecatch?.url || `${BASE_URL}/opengraph-image`;
  const faq = parseFaq(post.content);

  // 構造化データ: Article ＋（あれば）FAQPage ＋ Breadcrumb。
  // 既存の Organization(#organization)・Person(/about#mako) と @id で連携。
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: post.title,
        description,
        image: [image],
        datePublished: post.publishedAt,
        dateModified: post.updatedAt || post.publishedAt,
        inLanguage: "ja",
        author: { "@type": "Person", "@id": `${BASE_URL}/about#mako`, name: "マコ" },
        publisher: { "@id": `${BASE_URL}/#organization` },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@type": "CollectionPage", "@id": `${BASE_URL}/column` },
      },
      ...(faq.length
        ? [{
            "@type": "FAQPage",
            "@id": `${url}#faq`,
            mainEntity: faq.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "読みもの", item: `${BASE_URL}/column` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
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
      <article className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* 可視パンくず（BreadcrumbList構造化データと対応） */}
          <nav aria-label="パンくず" className="mb-14 text-[11px] tracking-[0.15em] text-ink-secondary/70 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-ink-primary transition-colors">ホーム</Link>
            <span aria-hidden="true">/</span>
            <Link href="/column" className="hover:text-ink-primary transition-colors">読みもの</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink-primary/80 truncate max-w-[16rem]">{post.title}</span>
          </nav>

          <p className="text-ink-secondary/60 text-[11px] tracking-[0.2em] mb-4">
            {formatPostDate(post.publishedAt)}
          </p>
          <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-10">
            {post.title}
          </h1>

          {post.eyecatch && (
            <div className="relative mb-12 overflow-hidden rounded-xl">
              <Image
                src={post.eyecatch.url}
                alt={post.title}
                width={post.eyecatch.width}
                height={post.eyecatch.height}
                className="w-full h-auto"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          )}

          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* 記事末尾に著者プロフィール（about下部と同一・E-E-A-T強化） */}
          <RoasterProfile />

          {/* プロフィールの下に関連記事レコメンド（カード型） */}
          <RelatedColumns currentId={id} />
        </div>
      </article>
      </SiteChromeV2>
    </>
  );
}
