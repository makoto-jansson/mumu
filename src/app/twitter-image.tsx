// Twitter(X)カード用画像。OGPと同じブランド画像を使う。

import { createBrandOg, OG_SIZE, OG_ALT, OG_CONTENT_TYPE } from "@/lib/brandOg";

// ローカル画像を fs で読むため Node.js ランタイムを明示（edgeバンドル回避）
export const runtime = "nodejs";
export const size = OG_SIZE;
export const alt = OG_ALT;
export const contentType = OG_CONTENT_TYPE;

export default async function TwitterImage() {
  return createBrandOg();
}
