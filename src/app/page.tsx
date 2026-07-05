// トップページ（2026リニューアル v2 — mumu-site-v2/index.html の忠実移植）
// 帯（左カラム）＋ 豆 ＋ Hero → mumuについて → 珈琲をえらぶ → 灯台守の日誌 → Podcast → フッター
// 演出・レイアウトはすべて HomeV2（client component）と homeV2.module.css に集約。

import type { Metadata } from "next";
import HomeV2 from "@/components/home-v2/HomeV2";
import { getRecentPosts, formatPostDate } from "@/libs/microcms";

// microCMSの記事は追加後すぐ反映したいので60秒ごとに再検証
export const revalidate = 60;

export const metadata: Metadata = {
  // レイアウトのtemplate（%s | ...）を使わず、TOP専用のtitleをそのまま使用
  title: { absolute: "灯台の珈琲焙煎所 mumu — 感性が、ふと、戻ってくる場所" },
  description:
    "灯台の珈琲焙煎所mumu（ムーム）。感性が、ふと戻ってくるような一杯を。灯台の一日にあわせて焙煎したスペシャルティコーヒーと、波の音のような時間をお届けします。",
  openGraph: {
    title: "灯台の珈琲焙煎所 mumu",
    description: "感性が、ふと、戻ってくる場所。",
    // og:image は app/opengraph-image.tsx が自動付与
  },
  twitter: {
    card: "summary_large_image",
    title: "灯台の珈琲焙煎所 mumu",
    description: "感性が、ふと、戻ってくる場所。",
  },
};

export default async function Home() {
  // 最新3件の日誌記事を取得し、表示用に整形して渡す（CMS未整備なら空配列）
  const posts = await getRecentPosts(3);
  const journalPosts = posts.map((p) => ({
    id: p.id,
    date: formatPostDate(p.publishedAt),
    title: p.title,
  }));
  return <HomeV2 journalPosts={journalPosts} />;
}
