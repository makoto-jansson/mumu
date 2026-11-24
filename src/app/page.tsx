// トップページ（2026リニューアル v2 — mumu-site-v2/index.html の忠実移植）
// 帯（左カラム）＋ 豆 ＋ Hero → mumuについて → 珈琲をえらぶ → 読みもの → Podcast → フッター
// 日誌（/journal）は記事0件のまま運用されなかったため 2026-11-24 に廃止（/column へ転送）
// 演出・レイアウトはすべて HomeV2（client component）と homeV2.module.css に集約。

import type { Metadata } from "next";
import HomeV2 from "@/components/home-v2/HomeV2";
import { getAllColumns, formatPostDate } from "@/lib/microcms";

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

export default async function Home() {
  // 読みもの（columns）最新3件（SEO記事へのトップ導線）
  const columns = await getAllColumns();
  const columnPosts = [...columns]
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
    .slice(0, 3)
    .map((p) => ({ id: p.id, date: formatPostDate(p.publishedAt), title: p.title }));
  return <HomeV2 columnPosts={columnPosts} />;
}
