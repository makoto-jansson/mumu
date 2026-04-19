// Aboutページ — mumuのストーリーを伝えるページ

import type { Metadata } from "next";
import AboutContent from "./AboutContent";

const BASE_URL = "https://mumucoffee-feel.com";

export const metadata: Metadata = {
  title: "mumuのストーリー",
  description:
    "「感性が、ふと、戻ってくるような珈琲を届けたい」灯台の珈琲焙煎所mumu（ムーム）のコンセプトとストーリー。",
  openGraph: {
    title: "mumuのストーリー | 灯台の珈琲焙煎所mumu",
    description: "感性が、ふと、戻ってくるような珈琲を届けたい。",
    url: `${BASE_URL}/about`,
  },
  alternates: {
    canonical: `${BASE_URL}/about`,
  },
};

// Person構造化データ — 焙煎者マコのE-E-A-T強化用
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/about#mako`,
  name: "マコ",
  alternateName: "Mako",
  url: `${BASE_URL}/about`,
  image: `${BASE_URL}/profile.jpg`,
  jobTitle: "焙煎者・アプリ開発者",
  description:
    "灯台の珈琲焙煎所mumuを運営。「感性が、ふと、戻ってくる」をコンセプトに、自家焙煎珈琲豆のオンラインショップと瞑想アプリの開発を行っています。",
  worksFor: {
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "灯台の珈琲焙煎所mumu",
    url: BASE_URL,
  },
  knowsAbout: [
    "スペシャルティコーヒー",
    "コーヒー焙煎",
    "Aillio焙煎機",
    "瞑想",
    "ウェルビーイング",
    "集中・リラックス・発想の習慣化",
    "Webアプリケーション開発",
  ],
  sameAs: [
    "https://www.instagram.com/mumu_coffee_roaster/",
    "https://note.com/mumu_coffee",
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutContent />
    </>
  );
}
