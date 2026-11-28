// mumuについて /about（v3・青×白 2026-11 リニューアル）
//
// 正本は Figma「PC｜mumuについて」66:371 /「スマホ｜mumuについて」67:155。
// 構成: パンくず → 頭（About mumu・キャッチ・アーチの絵） → mumuのこと → ストーリー → 焙煎しているひと → 次へ
// ★ ストーリーとプロフィールの文章はユーザー自筆。言い回しを直したり書き足したりしないこと。
//    2026-11-28 ユーザー判断で、プロフィールから音楽制作・瞑想アプリの話を外した（珈琲の話だけにする）。

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import LighthouseWindow from "@/components/site/LighthouseWindow";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import { INSTAGRAM_URL } from "@/components/home-v2/links";
import { getBeanViews, shopUrlWithUtm } from "@/lib/beans";
import s from "./about.module.css";

const BASE_URL = "https://www.mumucoffee-feel.com";
const NOTE_URL = "https://note.com/mumu_coffee";

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

// 豆の販売状況は lib/beans 側で1時間キャッシュ
export const revalidate = 3600;

// Person構造化データ — 焙煎者マコのE-E-A-T強化用
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${BASE_URL}/about#mako`,
  name: "マコ",
  alternateName: "Mako",
  url: `${BASE_URL}/about`,
  image: `${BASE_URL}/images/profile.jpg`,
  jobTitle: "焙煎者",
  description:
    "灯台の珈琲焙煎所mumuを運営。「感性が、ふと、戻ってくる」をコンセプトに、自家焙煎珈琲豆のオンラインショップを営んでいます。",
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
  ],
  sameAs: [INSTAGRAM_URL, NOTE_URL],
};

// プロフィール中の豆のリンク（販売中なら豆の詳細へ、なければ一覧へ）
async function beanLinks() {
  const beans = await getBeanViews();
  const pick = (kind: "light" | "dark") => beans.find((b) => b.roastKind === kind);
  return { light: pick("light"), dark: pick("dark") };
}

// ストーリー本文（段落ごと。段落の中の改行は配列で表す）
const STORY: string[][] = [
  ["目まぐるしく変化の激しい世の中で、私たちは、気付けば目の前のことに流され、振り回されてばかりです。"],
  [
    "いつの間にか、好きだった映画や音楽を楽しむ余裕すらなくなり、好きでもないアプリゲームやショート動画を眺めてしまう...。",
    "私含めそんな人がとても増えているように感じます。",
  ],
  [
    "そんな毎日に抗って、自分の「好き」を取り戻そうとしてみても、渦に吸い寄せらせるように、またすぐアプリを開いてしまう...。",
    "そしてこんなハズではなかったのに...。",
    "と少し落ち込む。",
  ],
  [
    "いっそのことスマホを捨てて山奥で暮らそう...なんて考えもよぎりますが、そんな度胸もありません。",
    "忙しない現代を生きていく上で、これはもう仕方のないコトのように感じます。",
  ],
  ["でも、こうして葛藤しながら、自分と社会を見つめるコト自体が、現代で自分を取り戻す唯一の方法のような気がしています。"],
  [
    "たまには珈琲でも飲みながらぼーっとしてみてください。",
    "珈琲って、ゆっくり味わうといろんな味がするんだなあ...と、じわじわ感性が戻ってきます。",
  ],
  [
    "そんな風に、疲れて何もできない毎日が続いていたとしても、ムームの珈琲が「感性を取り戻すきっかけ」を作れたらいいなと思っております。",
  ],
  ["灯台の珈琲焙煎所mumu（ムーム）は、感性が、ふと、戻ってくる瞬間を、珈琲を中心にお届けいたします。"],
];

// 改行つきの段落
function Lines({ lines }: { lines: string[] }) {
  return (
    <p>
      {lines.map((l, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {l}
        </span>
      ))}
    </p>
  );
}

export default async function AboutPage() {
  const { light, dark } = await beanLinks();
  const beanHref = (b: typeof light, content: string) =>
    b ? shopUrlWithUtm(b.shopUrl, { medium: "about", campaign: "profile", content }) : "/beans";

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
      <SiteChrome>
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: "mumuについて" }]} />

        {/* ---------- 頭 ---------- */}
        <section className={`${site.wrap} ${s.hero}`} aria-labelledby="about-title">
          <p className={s.heroEn} aria-hidden="true">
            <span className={`${site.label} ${s.heroLabel}`}>About</span>
            <span className={s.heroBig}>mumu</span>
          </p>
          <div className={s.heroPic}>
            <span className={s.heroPicFrame}>
              <Image
                src="/v2/yuu-e.jpg"
                alt="夕方の丘に立つ灯台の絵"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 900px) 400px, calc(100vw - 40px)"
              />
            </span>
          </div>
          <h1 id="about-title" className={s.heroTitle}>
            感性が、ふと、
            <br />
            戻ってくるような珈琲を
            <br />
            届けたい。
          </h1>
          <p className={s.heroName}>灯台の珈琲焙煎所 mumu（ムーム）</p>
        </section>

        {/* ---------- mumuのこと ---------- */}
        <section className={s.concept} aria-labelledby="concept-title">
          <div className={`${site.wrap} ${s.row}`}>
            <h2 id="concept-title" className={s.rowTitle}>
              <span className={`${site.label} ${s.rowEn}`} aria-hidden="true">
                Concept
              </span>
              mumuのこと
            </h2>
            <div className={s.text}>
              <p>
                灯台の珈琲焙煎所mumu（ムーム）は「感性が、ふと、戻ってくるような瞬間を届ける」をコンセプトに珈琲豆を焙煎しています。
              </p>
              <Lines
                lines={[
                  "主にスペシャルティコーヒーと呼ばれる、品質にこだわった個性豊かな珈琲豆を取り扱っており、個性のあるフレーバーと優しい甘さのある味づくりを目指しています。",
                  "浅煎り〜深煎りまでございます。",
                ]}
              />
            </div>
          </div>
        </section>

        {/* ---------- ストーリー ---------- */}
        <section className={s.story} aria-labelledby="story-title">
          <div className={`${site.wrap} ${s.row}`}>
            <div className={s.storyHead}>
              <LighthouseWindow size={240} className={s.storyWindow} />
              <h2 id="story-title" className={s.rowTitle}>
                <span className={`${site.label} ${s.rowEn}`} aria-hidden="true">
                  Story
                </span>
                ストーリー
              </h2>
            </div>
            <div className={`${s.text} ${s.storyText}`}>
              {STORY.map((lines, i) => (
                <Lines key={i} lines={lines} />
              ))}
              <p className={s.sign}>
                灯台の珈琲焙煎所 <span className={site.label}>mumu</span>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- 焙煎しているひと ---------- */}
        <section className={s.roasterSection} aria-labelledby="roaster-title">
          <div className={site.wrap}>
            <div className={s.roaster}>
              <div className={s.roasterSide}>
                <span className={s.photo}>
                  <Image src="/images/profile.jpg" alt="灯台の珈琲焙煎所mumu 焙煎者 マコ" fill sizes="(min-width: 900px) 280px, 180px" />
                </span>
                <ul className={`${s.sns} ${s.snsPc}`}>
                  <SnsButtons />
                </ul>
              </div>
              <div className={s.roasterText}>
                <p className={`${site.label} ${s.rowEn}`} aria-hidden="true">
                  Roaster
                </p>
                <h2 id="roaster-title" className={s.roasterName}>
                  マコ
                  <span className={s.roasterRole}>焙煎しているひと・灯台の珈琲焙煎所mumu</span>
                </h2>
                <p>
                  自家焙煎珈琲豆のオンラインショップを運営。「感性が、ふと、戻ってくる」をコンセプトに、珈琲豆を焙煎しています。
                </p>

                <h3 className={s.sub}>
                  <span className={site.label} aria-hidden="true">
                    Coffee
                  </span>
                  <Link href="/beans">珈琲</Link>
                </h3>
                <p>
                  焙煎は、Aillioという焙煎機で少量ずつ焙煎しています。取り扱っているのは、いまは
                  <a href={beanHref(light, "light")} {...(light ? { target: "_blank", rel: "noopener" } : {})}>
                    エチオピア（浅煎り）
                  </a>
                  と
                  <a href={beanHref(dark, "dark")} {...(dark ? { target: "_blank", rel: "noopener" } : {})}>
                    インドネシア（深煎り）
                  </a>
                  の2種類。初めての方にも気軽に試していただけるように「まず100gから」お届けしています。
                </p>

                <span className={s.rule} aria-hidden="true" />
                <p>
                  読んでくださって、ありがとうございます。豆のこと、mumuのことについて、Instagram や note でも少しずつ綴っています。お気軽に覗いてみてください。
                </p>
                <p className={`${site.label} ${s.roasterSign}`}>— マコ</p>
                <ul className={`${s.sns} ${s.snsSp}`}>
                  <SnsButtons />
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- 次へ ---------- */}
        <section className={s.next} aria-labelledby="next-title">
          <div className={`${site.wrap} ${s.nextInner}`}>
            <div>
              <p className={`${site.label} ${s.nextLabel}`} aria-hidden="true">
                Next
              </p>
              <h2 id="next-title" className={s.nextTitle}>
                珈琲と読みものへ
              </h2>
            </div>
            <div className={s.nextBtns}>
              <Link href="/beans" className={buttonClass("primary", "L")}>
                珈琲豆を見る <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
              <Link href="/column" className={buttonClass("outline", "L")}>
                読みものを見る <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </SiteChrome>
    </>
  );
}

// Instagram・note のボタン（PCは写真の下、スマホはプロフィールの最後）
function SnsButtons() {
  return (
    <>
      {[
        { href: INSTAGRAM_URL, label: "Instagram" },
        { href: NOTE_URL, label: "note" },
      ].map((l) => (
        <li key={l.label}>
          <a href={l.href} target="_blank" rel="noopener me" className={buttonClass("outline", "S")}>
            {l.label} <span className={site.arrow} aria-hidden="true">↗</span>
            <span className={site.srOnly}>（新しいタブで開きます）</span>
          </a>
        </li>
      ))}
    </>
  );
}
