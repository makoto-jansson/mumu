// サイト共通のOGP画像（cup.pngベース・1200×630）。
// この特殊ファイルにより、全ページの og:image が自動生成画像に設定される。
// 個別ページ（記事詳細のアイキャッチ等）は generateMetadata で上書き可能。

import { createBrandOg, OG_SIZE, OG_ALT, OG_CONTENT_TYPE } from "@/lib/brandOg";

// ローカル画像を fs で読むため Node.js ランタイムを明示（edgeバンドル回避）
export const runtime = "nodejs";
export const size = OG_SIZE;
export const alt = OG_ALT;
export const contentType = OG_CONTENT_TYPE;

export default async function OpengraphImage() {
  return createBrandOg();
}
