// 読み物ページ

import type { Metadata } from "next";
import JournalContent from "./JournalContent";

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

export default function JournalPage() {
  return <JournalContent />;
}
