// sitemap.xml を自動生成（Next.js の App Router 組み込み機能）
// https://mumucoffee-feel.com/sitemap.xml でアクセス可能になる
// 固定ページに加え、microCMSの記事URL（日誌 /journal/[id]・読みもの /column/[id]）も含める。

import type { MetadataRoute } from "next";
import { getAllPosts, getAllColumns } from "@/lib/microcms";

const BASE_URL = "https://www.mumucoffee-feel.com";

// sitemap.ts は「特殊なRoute Handler」で、ページと違い revalidate では再検証されず
// ビルド時の内容が配信され続ける（Next 16系の仕様）。実際に2026-09-10以降の記事12本が
// サイトマップから抜け落ちていたため、dynamic 指定でリクエストごとに生成する。
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/beans`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/journal`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/column`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  // CMSの記事URL（取得失敗時は空配列にフォールバック）
  const [posts, columns] = await Promise.all([getAllPosts(), getAllColumns()]);

  // lastModified は更新日時を優先する。公開日のままだと、記事をリライトしても
  // Googleに「更新された」と伝わらず再クロールされない（2026-10-22に判明）。
  const journalPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${BASE_URL}/journal/${p.id}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const columnPages: MetadataRoute.Sitemap = columns.map((p) => ({
    url: `${BASE_URL}/column/${p.id}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...journalPages, ...columnPages];
}
