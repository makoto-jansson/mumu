// ルートレイアウト
// 全ページ共通のHeader・Footerを配置し、SEO / OGP metaを設定する

import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import InstallBanner from "@/components/layout/InstallBanner";
import GrainOverlay from "@/components/ui/GrainOverlay";

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

  // canonical URL（重複コンテンツ防止）
  alternates: {
    canonical: BASE_URL,
  },
};

// 構造化データ（JSON-LD）— 組織情報をGoogleに伝える
// @id で Person (/about#mako) と相互リンクする
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "灯台の珈琲焙煎所mumu",
  alternateName: "mumu",
  url: BASE_URL,
  logo: `${BASE_URL}/og-image.jpg`,
  description:
    "感性が、ふと、戻ってくる場所。スペシャルティコーヒーの焙煎と、珈琲のある時間をつくるツールをお届けします。",
  founder: {
    "@type": "Person",
    "@id": `${BASE_URL}/about#mako`,
    name: "マコ",
  },
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
        {/* Google Tag Manager */}
        <script dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-5SDPJNKR');` }} />
        {/* End Google Tag Manager */}

        {/* 構造化データ（JSON-LD） */}
        <meta name="theme-color" content="#0a0a0a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5SDPJNKR"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        {/* 全ページ共通のグレイン + ビネット */}
        <GrainOverlay />
        <ConditionalLayout>{children}</ConditionalLayout>
        <InstallBanner />
      </body>
    </html>
  );
}
