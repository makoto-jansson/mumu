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

const BASE_URL = "https://mumucoffee-feel.com";

export const revalidate = 60;

function toPlain(html: string, len = 110): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, len);
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

  return (
    <SiteChromeV2>
      <article className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="mb-14">
            <Link
              href="/column"
              className="text-ink-secondary/70 text-sm font-light tracking-wider hover:text-ink-primary transition-colors duration-300 inline-flex items-center gap-2"
            >
              <span>←</span> 読みもの一覧へ
            </Link>
          </div>

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
  );
}
