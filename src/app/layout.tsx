// ルートレイアウト
// 全ページ共通のHeader・Footerを配置し、SEO / OGP metaを設定する

import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const BASE_URL = "https://mumucoffee-feel.com";

export const metadata: Metadata = {
  // デフォルトtitle（各ページで上書き可能）
  title: {
    default: "灯台の珈琲焙煎所mumu | 感性が、ふと、戻ってくる場所",
    template: "%s | 灯台の珈琲焙煎所mumu",
  },
  description:
    "灯台の珈琲焙煎所mumu（ムーム）。スペシャルティコーヒーの焙煎と、珈琲のある時間をつくるツールをお届けします。",
  metadataBase: new URL(BASE_URL),

  // OGP（SNSシェア時の表示）
  openGraph: {
    title: "灯台の珈琲焙煎所mumu",
    description: "感性が、ふと、戻ってくる場所。",
    url: BASE_URL,
    siteName: "灯台の珈琲焙煎所mumu",
    type: "website",
    locale: "ja_JP",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "灯台の珈琲焙煎所mumu",
      },
    ],
  },

  // Twitter / X カード
  twitter: {
    card: "summary_large_image",
    title: "灯台の珈琲焙煎所mumu",
    description: "感性が、ふと、戻ってくる場所。",
    images: ["/og-image.jpg"],
  },

  // robots（検索エンジンへの指示）
  robots: {
    index: true,
    follow: true,
  },
};

// 構造化データ（JSON-LD）— 組織情報をGoogleに伝える
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "灯台の珈琲焙煎所mumu",
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.jpg`,
  sameAs: [
    "https://www.instagram.com/mumu_coffee_roaster/",
    "https://note.com/mumu_coffee",
    "https://mumucoffee.theshop.jp/",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* 構造化データ（JSON-LD） */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
