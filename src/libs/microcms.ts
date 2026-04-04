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
