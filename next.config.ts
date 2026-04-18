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
  // .m4a ファイルを正しい MIME タイプで配信（ブラウザの audio 再生に必須）
  headers: async () => [
    {
      source: "/sounds/:path*.m4a",
      headers: [{ key: "Content-Type", value: "audio/mp4" }],
    },
  ],
};

export default withSerwist(nextConfig);
