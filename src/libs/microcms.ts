// microCMS クライアントの初期化と型定義

import { createClient } from "microcms-js-sdk";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN が設定されていません");
}
if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY が設定されていません");
}

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// 珈琲豆の型定義（microCMSのスキーマに対応）
export type Bean = {
  id: string;
  name: string;
  roast: string;
  weight: string;
  price: number;
  pricePerCup: string;
  flavor: string;
  description: string;
  image?: {
    url: string;
    width: number;
    height: number;
  };
  shopUrl: string;
};

// ブログ記事（灯台守の日誌 / 読み物）の型定義（microCMS「blogs」エンドポイント）
export type BlogPost = {
  id: string;
  title: string;
  content: string; // リッチエディタのHTML
  publishedAt: string;
  eyecatch?: {
    url: string;
    width: number;
    height: number;
  };
  category?: {
    id: string;
    name?: string;
  };
};

// 最新の記事を取得（TOPの日誌セクション・一覧で使用）。
// blogsエンドポイント未整備や取得失敗時は空配列にフォールバックする。
export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  try {
    const data = await client.getList<BlogPost>({
      endpoint: "blogs",
      queries: { limit, fields: "id,title,publishedAt,eyecatch" },
    });
    return data.contents;
  } catch {
    return [];
  }
}

// 記事一覧（/journal）。失敗時は空配列。
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const data = await client.getList<BlogPost>({
      endpoint: "blogs",
      queries: { limit: 100, fields: "id,title,publishedAt,eyecatch" },
    });
    return data.contents;
  } catch {
    return [];
  }
}

// 記事詳細（/journal/[id]）。存在しなければ null。
export async function getPost(id: string): Promise<BlogPost | null> {
  try {
    return await client.get<BlogPost>({ endpoint: "blogs", contentId: id });
  } catch {
    return null;
  }
}

// ── 読みもの（SEOコラム）── 指示書により日誌とは別コンテンツ。
// microCMS「columns」エンドポイントを使用（スキーマはblogsと同一想定）。
// 未整備・取得失敗時は空/ null にフォールバックする。
export async function getAllColumns(): Promise<BlogPost[]> {
  try {
    const data = await client.getList<BlogPost>({
      endpoint: "columns",
      queries: { limit: 100, fields: "id,title,publishedAt,eyecatch" },
    });
    return data.contents;
  } catch {
    return [];
  }
}

export async function getColumn(id: string): Promise<BlogPost | null> {
  try {
    return await client.get<BlogPost>({ endpoint: "columns", contentId: id });
  } catch {
    return null;
  }
}

// ISO日時を「YYYY.MM.DD」に整形（日誌・読みものの日付表記用）
export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}
