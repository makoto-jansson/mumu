// Aboutページ — mumuのストーリーを伝えるページ

import type { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "mumuのストーリー",
  description:
    "「感性が、ふと、戻ってくるような珈琲を届けたい」灯台の珈琲焙煎所mumu（ムーム）のコンセプトとストーリー。",
  openGraph: {
    title: "mumuのストーリー | 灯台の珈琲焙煎所mumu",
    description: "感性が、ふと、戻ってくるような珈琲を届けたい。",
    url: "https://mumucoffee-feel.com/about",
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
