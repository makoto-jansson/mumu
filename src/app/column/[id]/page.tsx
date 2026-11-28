// 読みもの（コラム）の記事ページ /column/[id]（v3・青×白 2026-11 リニューアル）
//
// 正本は Figma「PC｜読みもの記事」6:270 /「スマホ｜読みもの記事」63:162。
// 構成: 記事の頭（パンくず・カテゴリ・題名・書いた人） → 目次＋本文 → 書いた人 → 次に読む
// 本文は microCMS のHTML。表示するときに lib/articleHtml で整える（要点の箱・見出しの番号・
// 豆カードの組み直し・旧デザインの色の置き換え・表の横すべり）。原稿は書き換えない。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import SectionTitle from "@/components/site/SectionTitle";
import ReadingCard, { type ReadingItem } from "@/components/site/ReadingCard";
import site from "@/components/site/site.module.css";
import AuthorBox from "@/components/column/AuthorBox";
import ArticleBeans from "@/components/column/ArticleBeans";
import { getAllColumns, getColumn, formatPostDate } from "@/lib/microcms";
import { getBeanViews } from "@/lib/beans";
import { CATEGORY_LABEL, categoryOf } from "@/lib/columnCategory";
import { hasBeanCard, parseFaq, renderArticle, toPlain } from "@/lib/articleHtml";
import a from "@/components/column/article.module.css";

const BASE_URL = "https://www.mumucoffee-feel.com";

export const revalidate = 60;

// 記事の頭に出すカテゴリ名（一覧ページの見出しと同じ）
const CATEGORY_JA = { basics: "コーヒーの基礎知識", origins: "産地・豆の図鑑", reading: "そのほかの読みもの" } as const;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
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

export default async function ColumnPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, beans, all] = await Promise.all([getColumn(id), getBeanViews(), getAllColumns()]);
  if (!post) notFound();

  const onSale = beans.filter((b) => b.onSale);
  // 販売中の豆だけに差し替える（BASEで非公開の豆へは飛ばさず、ショップトップのまま残す）
  const { html: body, toc } = renderArticle(post.content, { slug: id, beans: onSale, classes: a });
  const showBeanBlock = !hasBeanCard(post.content);
  const cat = categoryOf(id);

  // 次に読む: 同じカテゴリの新しい記事を先に、足りなければほかのカテゴリから（最大3本）
  const others = [...all].filter((p) => p.id !== id).sort((x, y) => (x.publishedAt < y.publishedAt ? 1 : -1));
  const next: ReadingItem[] = [
    ...others.filter((p) => categoryOf(p.id) === cat),
    ...others.filter((p) => categoryOf(p.id) !== cat),
  ]
    .slice(0, 3)
    .map((p) => ({ id: p.id, title: p.title, category: CATEGORY_LABEL[categoryOf(p.id)], image: p.eyecatch?.url }));

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
        ? [
            {
              "@type": "FAQPage",
              "@id": `${url}#faq`,
              mainEntity: faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChrome>
        <article>
          {/* ---------- 記事の頭 ---------- */}
          <header className={a.head}>
            <div className={`${site.wrap} ${a.headInner}`}>
              <Breadcrumbs
                inline
                items={[{ href: "/", label: "ホーム" }, { href: "/column", label: "読みもの" }, { label: post.title }]}
              />
              <div className={a.headMain}>
                <span className={`${site.label} ${a.headLabel}`} aria-hidden="true">
                  Reading
                </span>
                <div className={a.headText}>
                  <p className={a.headCat} aria-hidden="true">
                    {CATEGORY_LABEL[cat]}
                  </p>
                  <h1 className={a.title}>{post.title}</h1>
                  <p className={a.meta}>
                    <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
                    <span>{CATEGORY_JA[cat]}</span>
                    <span>文・マコ（灯台の珈琲焙煎所 mumu）</span>
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* ---------- 目次＋本文 ---------- */}
          <div className={`${site.wrap} ${a.layout}`}>
            {toc.length > 1 && (
              <nav className={a.toc} aria-labelledby="toc-title">
                <p id="toc-title" className={`${site.label} ${a.tocTitle}`}>
                  Contents<span className={site.srOnly}>（目次）</span>
                </p>
                <ol>
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`}>
                        <span className={`${site.label} ${a.tocNo}`} aria-hidden="true">
                          {t.no}
                        </span>
                        <span>{t.text}</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <div className={a.main}>
              {post.eyecatch && (
                <div className={a.eyecatch}>
                  <Image
                    src={post.eyecatch.url}
                    alt=""
                    width={post.eyecatch.width}
                    height={post.eyecatch.height}
                    sizes="(min-width: 900px) 720px, 100vw"
                    loading="eager"
                    fetchPriority="high"
                  />
                </div>
              )}
              <div className={a.body} dangerouslySetInnerHTML={{ __html: body }} />

              {/* 本文に豆カードが無い記事だけ、末尾で mumu の豆を紹介する */}
              {showBeanBlock && <ArticleBeans beans={onSale} slug={id} />}
            </div>
          </div>
        </article>

        {/* ---------- 書いた人（E-E-A-T） ---------- */}
        <AuthorBox />

        {/* ---------- 次に読む ---------- */}
        {next.length > 0 && (
          <section className={a.next} aria-labelledby="next-title">
            <div className={`${site.wrap} ${a.nextInner}`}>
              <div className={a.nextTitleRow}>
                <SectionTitle
                  id="next-title"
                  en={
                    <>
                      <span className={site.pcOnly}>Next </span>Reading
                    </>
                  }
                  ja="次に読む"
                  link={{ href: "/column", label: "すべて見る" }}
                />
              </div>
              <ul className={a.nextList}>
                {next.map((r, i) => (
                  <li key={r.id}>
                    <ReadingCard item={r} index={i} sizes="(min-width: 900px) 373px, 220px" />
                  </li>
                ))}
              </ul>
              <Link href="/column" className={`${site.textLink} ${a.spLink}`}>
                すべて見る <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </section>
        )}
      </SiteChrome>
    </>
  );
}
