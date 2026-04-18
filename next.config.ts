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
};

export default withSerwist(nextConfig);
