// 珈琲豆ページ

import type { Metadata } from "next";
import BeansContent from "./BeansContent";

export const metadata: Metadata = {
  title: "珈琲豆",
  description:
    "スペシャルティコーヒーをていねいに焙煎。エチオピア シダモ（浅煎り）、インドネシア マンデリン（深煎り）をお届けします。",
  openGraph: {
    title: "珈琲豆 | 灯台の珈琲焙煎所mumu",
    description: "スペシャルティコーヒーをていねいに焙煎しています。",
    url: "https://mumucoffee-feel.com/beans",
  },
};

export default function BeansPage() {
  return <BeansContent />;
}
