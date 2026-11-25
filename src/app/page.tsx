// トップページ（v3・リニューアル段階C）
// ファーストビュー → 珈琲豆 → 安心材料 → よく読まれている読みもの → mumuについて → フッター
// 表示は HomeV2（サーバーコンポーネント）と homeV2.module.css。データ取得はここで行う。

import type { Metadata } from "next";
import HomeV2 from "@/components/home-v2/HomeV2";
import { getAllColumns } from "@/lib/microcms";
import { getBeanViews } from "@/lib/beans";

// microCMSの記事は追加後すぐ反映したいので60秒ごとに再検証
export const revalidate = 60;

// 指名検索（「mumuコーヒー」等）で拾われるよう、titleに「コーヒー豆」と区別できる店名を両方入れる。
// 旧title（「感性が、ふと、戻ってくる場所」）は「何の店か」が伝わらず、指名検索でも7〜11位だった。
const TITLE = "灯台の珈琲焙煎所mumu｜自家焙煎スペシャルティコーヒー豆の通販";
const DESCRIPTION =
  "灯台の珈琲焙煎所mumu（ムーム）の自家焙煎コーヒー豆。華やかな浅煎りのエチオピア、ほろ苦い深煎りのマンデリンなど、スペシャルティコーヒーを100gから販売しています。淹れ方や産地の読みものも。";

export const metadata: Metadata = {
  // レイアウトのtemplate（%s | ...）を使わず、TOP専用のtitleをそのまま使用
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    // og:image は app/opengraph-image.tsx が自動付与
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

// 「よく読まれている読みもの」に出す記事（GSCの検索クリック上位・2026-11-23週の週次レポートより）。
// 定期的に週次レポートを見て入れ替える。存在しないidは無視し、足りない分は新着で埋める。
const POPULAR_COLUMNS = [
  "coffee-region-flavor-map",
  "coffee-water-ratio",
  "coffee-milk-drinks",
  "kalita-dripper-guide",
];

export default async function Home() {
  const [beans, columns] = await Promise.all([getBeanViews(), getAllColumns()]);
  const popular = POPULAR_COLUMNS.map((id) => columns.find((c) => c.id === id)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  );
  const latest = [...columns]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .filter((c) => !POPULAR_COLUMNS.includes(c.id));
  const columnPosts = [...popular, ...latest]
    .slice(0, 4)
    .map((p) => ({ id: p.id, title: p.title }));
  return <HomeV2 beans={beans} columnPosts={columnPosts} />;
}
