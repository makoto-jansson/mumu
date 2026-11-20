// robots.txt を自動生成（Next.js の App Router 組み込み機能）
// https://mumucoffee-feel.com/robots.txt でアクセス可能になる

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /app 配下はクロールを許可したうえで noindex で除外する。
    // robots.txt で Disallow すると、Googleはページ内の noindex を読めない。
    // 記事からアプリへ内部リンクを張るとURLだけ発見され、中身を読めないまま
    // 「このページの情報はありません」という空の検索結果として登録されうるため、
    // Disallow は外して noindex（src/app/app/layout.tsx）だけに任せる。
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://www.mumucoffee-feel.com/sitemap.xml",
  };
}
