// 読み物ページ

import type { Metadata } from "next";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import { getAllPosts, formatPostDate } from "@/libs/microcms";
import JournalContent from "./JournalContent";

// 記事追加をすぐ反映（60秒ごと再検証）
export const revalidate = 60;

export const metadata: Metadata = {
  title: "読み物",
  description: "珈琲と感性にまつわる読み物。灯台の珈琲焙煎所mumuが発信するコンテンツ。",
  openGraph: {
    title: "読み物 | 灯台の珈琲焙煎所mumu",
    description: "珈琲と感性にまつわる読み物。",
    url: "https://mumucoffee-feel.com/journal",
  },
  alternates: {
    canonical: "https://mumucoffee-feel.com/journal",
  },
};

export default async function JournalPage() {
  const posts = await getAllPosts();
  const items = posts.map((p) => ({
    id: p.id,
    date: formatPostDate(p.publishedAt),
    title: p.title,
  }));
  return (
    // v2の帯レイアウトで囲む（TOPと共通の帯・背景テクスチャ・回る豆・フッター）
    <SiteChromeV2>
      <JournalContent posts={items} />
    </SiteChromeV2>
  );
}
