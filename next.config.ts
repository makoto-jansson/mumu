import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
  // 音声ファイルはprecacheしない（MIMEタイプの問題・大容量ファイルのため）
  // RuntimeCaching（NetworkFirst）で動的に扱う
  exclude: [/\/sounds\//],
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // microCMSの画像配信ドメインを許可
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  async redirects() {
    return [
      {
        // コラム「コーヒー豆の種類」のコンテンツID変更に伴う恒久リダイレクト（308）
        source: "/column/op5pjz1nt2f",
        destination: "/column/coffee-bean-types",
        permanent: true,
      },
    ];
  },
};

export default withSerwist(nextConfig);
