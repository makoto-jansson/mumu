// ルートレイアウト
// 全ページ共通のHeader・Footerを配置し、SEO / OGP metaを設定する

import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Zen_Maru_Gothic,
  Zen_Kaku_Gothic_New,
  Shippori_Mincho,
  Klee_One,
} from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/layout/ConditionalLayout";
import InstallBanner from "@/components/layout/InstallBanner";

const BASE_URL = "https://mumucoffee-feel.com";

// Cormorant Garamond（英文セリフ体・装飾用）
// Variable Font で upright と italic を軽量に提供
// Zen Maru Gothic（新トップページの基本書体）
// フォント指定はここで一元化 — 将来 DF新細丸ゴシック体 / イワタ福まるご に
// 差し替える際は、この定義と --font-zen-maru 変数だけを変更すればよい
const zenMaru = Zen_Maru_Gothic({
  weight: ["300", "400", "500"],
  // 日本語フォントは全unicode-rangeスライス（数百ファイル・数MB）が生成されるため
  // preloadせず、ページ内で実際に使うグリフのスライスだけをオンデマンド読込させる
  preload: false,
  variable: "--font-zen-maru",
  display: "swap",
});

// 新トップページ（v2）用の3書体。リファレンスはGoogle FontsのCDN <link> だが、
// レンダーブロッキングを避けるため next/font/google に移行。
// 和文フォントは全unicode-rangeスライスがpreloadされると壊滅的なため preload:false 必須。
// CSS変数 --font-gothic / --font-mincho / --font-hand として module.css から参照する。
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-gothic",
  display: "swap",
});

const shippori = Shippori_Mincho({
  weight: ["400", "500"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-mincho",
  display: "swap",
});

const kleeOne = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  preload: false,
  variable: "--font-hand",
  display: "swap",
});

const cormorant = localFont({
  // TTF 2ファイル計474KBが全ページでpreloadされLCPを圧迫していたため停止
  // （display:swapのため使用ページでは後追いで適用される）
  preload: false,
  src: [
    {
      path: "../fonts/Cormorant_Garamond/CormorantGaramond-VariableFont_wght.ttf",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../fonts/Cormorant_Garamond/CormorantGaramond-Italic-VariableFont_wght.ttf",
      weight: "300 700",
      style: "italic",
    },
  ],
  variable: "--font-cormorant",
  display: "swap",
});

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
    // og:image は app/opengraph-image.tsx（cup.pngベース1200×630）が自動付与する
  },

  // Twitter / X カード（twitter:image は app/twitter-image.tsx が自動付与）
  twitter: {
    card: "summary_large_image",
    title: "灯台の珈琲焙煎所mumu",
    description: "感性が、ふと、戻ってくる場所。",
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
  logo: `${BASE_URL}/opengraph-image`,
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
    <html
      lang="ja"
      className={`${cormorant.variable} ${zenMaru.variable} ${zenKaku.variable} ${shippori.variable} ${kleeOne.variable}`}
    >
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

        {/* グレインはConditionalLayout内で出し分け（新トップページは二重掛け防止のため非表示） */}
        <ConditionalLayout>{children}</ConditionalLayout>
        <InstallBanner />
      </body>
    </html>
  );
}
