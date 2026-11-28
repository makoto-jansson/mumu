// mumu 公式サイト TOP（v3・青×白 × 太いセリフ 2026-11 リニューアル）
//
// 正本は Figma「PC｜トップ」5:37 /「スマホ｜トップ（390）」6:465。
// 構成: ファーストビュー → 珈琲豆 → はじめての方へ → よく読まれている読みもの → mumuについて
// 段階C（2026-11-25）で決めた構成・導線はそのまま、見た目だけを作り直した。

import Link from "next/link";
import Image from "next/image";
import SiteChrome from "@/components/site/SiteChrome";
import SectionTitle from "@/components/site/SectionTitle";
import BeanCard from "@/components/site/BeanCard";
import GuideBlock from "@/components/site/GuideBlock";
import ReadingCard, { type ReadingItem } from "@/components/site/ReadingCard";
import LighthouseWindow from "@/components/site/LighthouseWindow";
import StickyCta from "@/components/site/StickyCta";
import { buttonClass, siteStyles as s } from "@/components/site/ui";
import type { BeanView } from "@/lib/beans";
import h from "./home.module.css";

export default function Home({ beans = [], readings = [] }: { beans?: BeanView[]; readings?: ReadingItem[] }) {
  return (
    <SiteChrome ctaSpace>
      {/* ---------- ファーストビュー ---------- */}
      <section className={`${s.wrap} ${h.hero}`} aria-labelledby="hero-title">
        <p className={h.heroTitle} aria-hidden="true">
          <span className={`${s.label} ${h.vLabel}`}>Roaster</span>
          <span className={h.coffee}>Coffee</span>
        </p>
        <div className={h.pic}>
          <span className={h.picFrame}>
            <Image
              src="/v2/asa-e.jpg"
              alt="朝の丘に立つ灯台の絵"
              fill
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 900px) 420px, calc(100vw - 40px)"
            />
          </span>
          {/* 灯台のマーク: 前は周りの文字が回る印だったが、コンセプト（感性がふと戻る・情報に追われる毎日から離れる）
              に対して動きで目を引くので、回る文字をやめて丸窓だけを置く（2026-11-28 ユーザー判断） */}
          <LighthouseWindow size={128} className={h.heroMark} />
        </div>
        <h1 id="hero-title" className={h.catch}>
          <span className={s.srOnly}>灯台の珈琲焙煎所mumu　</span>
          感性が、ふと
          <br />
          戻ってくる一杯を。
        </h1>
        <p className={h.lead}>
          自家焙煎のスペシャルティコーヒー豆を、100gから。華やかな浅煎りと、ほろ苦い深煎りを、送料全国一律¥350でお届けします。
        </p>
        <div className={h.btns} id="hero-buttons">
          <a href="#beans" className={buttonClass("primary", "L")}>
            珈琲豆をえらぶ <span className={s.arrow} aria-hidden="true">→</span>
          </a>
          <Link href="/guide" className={buttonClass("outline", "L")}>
            はじめての方へ
          </Link>
        </div>
      </section>

      {/* ---------- 珈琲豆 ---------- */}
      <section id="beans" className={`${h.section} ${h.pale}`} aria-labelledby="beans-title" style={{ scrollMarginTop: 0 }}>
        <div className={`${s.wrap} ${h.beans}`}>
          <SectionTitle id="beans-title" en="The Beans" ja="珈琲豆" link={{ href: "/beans", label: "すべての豆と選び方" }} />
          {beans.length > 0 ? (
            <ul className={h.beanList}>
              {beans.map((b, i) => (
                <li key={b.slug}>
                  <BeanCard bean={b} index={i} medium="top" campaign="home" />
                </li>
              ))}
            </ul>
          ) : (
            <p className={h.empty}>ただいま準備中です。</p>
          )}
          <Link href="/beans" className={`${s.textLink} ${h.spLink}`}>
            すべての豆と選び方 <span className={s.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* ---------- はじめての方へ：買う前の不安を先に消す ---------- */}
      <GuideBlock tone="blue" button={{ href: "/guide#faq", label: "よくある質問を見る" }} />

      {/* ---------- よく読まれている読みもの ---------- */}
      {readings.length > 0 && (
        <section className={h.section} aria-labelledby="reading-title">
          <div className={`${s.wrap} ${h.reading} ${h.readingSection}`}>
            <div className={h.titleRow}>
              <SectionTitle
                id="reading-title"
                en="Reading"
                ja="よく読まれている読みもの"
                link={{ href: "/column", label: "すべて見る" }}
              />
            </div>
            <ul className={h.readingList}>
              {readings.slice(0, 3).map((r, i) => (
                <li key={r.id}>
                  <ReadingCard item={r} index={i} sizes="(min-width: 900px) 373px, 220px" />
                </li>
              ))}
            </ul>
            <Link href="/column" className={`${s.textLink} ${h.spLink}`}>
              すべて見る <span className={s.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      )}

      {/* ---------- mumuについて ---------- */}
      <section className={`${h.section} ${h.pale}`} aria-labelledby="about-title">
        <div className={`${s.wrap} ${h.about}`}>
          <LighthouseWindow size={300} className={h.aboutWindow} alt="灯台と焙煎小屋の線画" />
          <div className={h.aboutText}>
            <span className={`${s.label} ${h.aboutLabel}`} aria-hidden="true">
              About mumu
            </span>
            <h2 id="about-title" className={h.aboutTitle}>
              mumu（ムーム）のこと。
            </h2>
            <p className={h.aboutBody}>
              mumuは、小さな焙煎機で、少しずつ豆を煎っているお店です。
              <br className={h.brPc} />
              香りや味のちがいに、ふと気づく。そんな小さな楽しみが、
              <br className={h.brPc} />
              毎日にすこし増えるコーヒーをお届けしています。
            </p>
            <Link href="/about" className={buttonClass("outline", "L", h.aboutBtn)}>
              焙煎所と焙煎者のこと
            </Link>
          </div>
        </div>
      </section>

      <StickyCta watchId="hero-buttons" href="#beans" label="珈琲豆をえらぶ" />
    </SiteChrome>
  );
}
