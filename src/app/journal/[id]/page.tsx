// 日誌記事の詳細ページ（microCMS「blogs」の1記事）
// v2の帯レイアウト(SiteChromeV2)で囲み、本文HTMLを .article-body でprose整形する。

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import { getPost, formatPostDate } from "@/lib/microcms";

const BASE_URL = "https://www.mumucoffee-feel.com";

// 記事追加・更新をすぐ反映（60秒ごと再検証）
export const revalidate = 60;

// HTMLタグを除去して説明文を作る
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
  const post = await getPost(id);
  if (!post) return { title: "記事が見つかりません" };
  const description = toPlain(post.content);
  return {
    title: post.title,
    description,
    alternates: { canonical: `${BASE_URL}/journal/${id}` },
    openGraph: {
      title: post.title,
      description,
      url: `${BASE_URL}/journal/${id}`,
      type: "article",
      images: post.eyecatch ? [{ url: post.eyecatch.url }] : undefined,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <SiteChromeV2>
      <article className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* 一覧へ戻る */}
          <div className="mb-14">
            <Link
              href="/journal"
              className="text-ink-secondary/70 text-sm font-light tracking-wider hover:text-ink-primary transition-colors duration-300 inline-flex items-center gap-2"
            >
              <span>←</span> 日誌一覧へ
            </Link>
          </div>

          {/* 日付・タイトル */}
          <p className="text-ink-secondary/60 text-[11px] tracking-[0.2em] mb-4">
            {formatPostDate(post.publishedAt)}
          </p>
          <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-10">
            {post.title}
          </h1>

          {/* アイキャッチ */}
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

          {/* 本文（リッチエディタHTML） */}
          <div
            className="article-body"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </SiteChromeV2>
  );
}
