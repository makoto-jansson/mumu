// robots.txt を自動生成（Next.js の App Router 組み込み機能）
// https://mumucoffee-feel.com/robots.txt でアクセス可能になる

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://mumucoffee-feel.com/sitemap.xml",
  };
}
