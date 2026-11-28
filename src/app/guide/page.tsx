// はじめての方へ /guide（v3・青×白 2026-11 リニューアル）
//
// 「BASEに移って買う」前に抱く不安（送料・届く日数・豆か粉か・払い方・返品）を先に消すページ。
// 正本は Figma「PC｜はじめての方へ」54:335 /「スマホ｜はじめての方へ」59:121。
// 構成: パンくず → ページの頭（目次） → まずは、この3つ（青） → 本文7項目 → 豆をえらぶ（淡い青）
// ★ 記載内容は BASE の商品ページと特定商取引法ページ（2026-11-25時点）に合わせている。
//    BASE側の条件を変えたら、ここも必ず合わせて直すこと（食い違うと信頼を損なう）。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import PageHead from "@/components/site/PageHead";
import InfoItem from "@/components/site/InfoItem";
import { SHOP_URL } from "@/components/home-v2/links";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import g from "./guide.module.css";

const BASE_URL = "https://www.mumucoffee-feel.com";
const TITLE = "はじめての方へ｜送料・お届け・豆の選び方";
const DESCRIPTION =
  "灯台の珈琲焙煎所mumuで初めて珈琲豆を買う方へ。送料は全国一律¥350、豆のままと粉の選び方、お届けまでの日数、お支払い方法をまとめています。";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${BASE_URL}/guide` },
  alternates: { canonical: `${BASE_URL}/guide` },
};

// 目次（本文の各項目へのページ内リンク）
const TOC = [
  { id: "choose", label: "豆の選び方" },
  { id: "flow", label: "ご注文の流れ" },
  { id: "grind", label: "豆のまま／粉" },
  { id: "shipping", label: "送料・お届け" },
  { id: "payment", label: "お支払い方法" },
  { id: "storage", label: "届いたら" },
  { id: "faq", label: "よくある質問" },
];

// ご注文の流れ
const STEPS = [
  "このサイトで豆を選び、「BASEで購入する」を押します。",
  "オンラインショップ（BASE）の商品ページに移るので、カートに入れてご注文ください。",
  "粉をご希望の場合は、ご注文時の備考欄に「粉希望」とご記入ください。",
];

// お支払い方法（BASEの決済）
const PAYMENTS = [
  "クレジットカード",
  "PayPay",
  "Amazon Pay",
  "キャリア決済",
  "銀行振込",
  "コンビニ決済・Pay-easy",
  "あと払い（PAY ID）",
];

// よくある質問（表示とFAQPage構造化データで共用）
const FAQ: { q: string; a: string }[] = [
  {
    q: "粉で買うことはできますか？",
    a: "できます。基本は豆のままでお届けしていますが、ご注文時の備考欄に「粉希望」とご記入いただければ、中細挽き（ハンドドリップ向け）に挽いてお送りします。",
  },
  {
    q: "送料はいくらですか？",
    a: "全国一律¥350です。ゆうパケットポストでのお届けで、荷物の追跡もできます。",
  },
  {
    q: "注文してからどのくらいで届きますか？",
    a: "お支払いの確定後、7日以内に発送します。後払いの場合はご注文の確定後、7日以内の発送です。",
  },
  {
    q: "どの豆を選べばいいか分かりません。",
    a: "ブラックで香りを楽しみたいなら浅煎りのエチオピア シダモ、苦みやコクが好き・ミルクを入れて飲みたいなら深煎りのマンデリンがおすすめです。",
  },
  {
    q: "100gで何杯くらい淹れられますか？",
    a: "1杯に豆12.5gを使う場合、100gでおよそ8杯分です。1杯あたりは約150〜160円になります。",
  },
  {
    q: "返品はできますか？",
    a: "商品に欠陥がある場合を除き、基本的には返品をお受けしていません。",
  },
];

// 本文の1項目 — 上に2pxの線。PC: 左に欧文ラベル＋見出し、右に本文 / スマホ: 縦に積む
function Item({ id, en, title, children }: { id: string; en: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className={g.item} aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className={g.itemTitle}>
        <span className={`${site.label} ${g.itemEn}`} aria-hidden="true">
          {en}
        </span>
        {title}
      </h2>
      <div className={g.itemBody}>{children}</div>
    </section>
  );
}

export default function GuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${BASE_URL}/guide#faq`,
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "はじめての方へ", item: `${BASE_URL}/guide` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteChrome>
        <Breadcrumbs items={[{ href: "/", label: "ホーム" }, { label: "はじめての方へ" }]} />
        <PageHead
          label="Guide"
          en="First time?"
          title="はじめての方へ"
          after={
            <nav aria-label="このページの目次" className={g.toc}>
              <ul>
                {TOC.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          }
        >
          mumuの珈琲豆を初めて買う方に向けて、選び方から届くまでをまとめました。
        </PageHead>

        {/* ---------- まずは、この3つ ---------- */}
        <section className={`${g.point} ${site.onBlue}`} aria-labelledby="point-title">
          <div className={`${site.wrap} ${g.pointGrid}`}>
            <h2 id="point-title" className={g.pointTitle}>
              <span className={`${site.label} ${g.pointEn}`} aria-hidden="true">
                Point
              </span>
              まずは、この3つ
            </h2>
            <dl className={site.infoList}>
              <InfoItem label="Shipping" main="送料 全国一律 ¥350" note="ゆうパケットポスト・追跡あり" />
              <InfoItem label="Delivery" main="7日以内に発送" note="お支払いの確定後" />
              <InfoItem label="Size" main="100gから" note="約8杯分" />
            </dl>
          </div>
        </section>

        {/* ---------- 本文 ---------- */}
        <div className={`${site.wrap} ${g.body}`}>
          <Item id="choose" en="Choose" title="豆の選び方">
            <p>
              いま扱っているのは、華やかで果実のような酸味の浅煎りと、ほろ苦さとコクの深煎りです。ブラックで香りを楽しむなら浅煎り、ミルクを入れるなら深煎りから選ぶと失敗しにくいです。
            </p>
            <p>
              <Link href="/beans">珈琲豆の一覧</Link>で、味の違いを比べられます。
            </p>
          </Item>

          <Item id="flow" en="Order" title="ご注文の流れ">
            <ol className={g.steps}>
              {STEPS.map((step, i) => (
                <li key={i}>
                  <span className={g.stepNo} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className={g.small}>決済はBASEのシステムで行われるため、このサイトがカード情報などを預かることはありません。</p>
          </Item>

          <Item id="grind" en="Ground" title="豆のまま／粉">
            <p>基本は豆のままでお届けしています。挽きたてがいちばん香るので、ミルをお持ちなら豆のままがおすすめです。</p>
            <p>
              粉をご希望の場合は中細挽き（ハンドドリップ向け）に一律で挽いてお送りします。挽き目の目安は
              <Link href="/column/coffee-grind-size">挽き目の読みもの</Link>にまとめています。
            </p>
          </Item>

          <Item id="shipping" en="Shipping" title="送料・お届け">
            <p>送料は全国一律¥350です。ゆうパケットポストでのお届けで、荷物の追跡ができます。</p>
            <p>
              ご注文が2点までならポスト投函でお届けします。3点以上の場合は別の方法で発送することがありますが、送料は変わりません。
            </p>
            <p>お支払いの確定後、7日以内に発送します（後払いの場合はご注文の確定後7日以内）。</p>
          </Item>

          <Item id="payment" en="Payment" title="お支払い方法">
            <ul className={g.chips}>
              {PAYMENTS.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <p className={g.small}>詳しくはショップの表記をご確認ください。</p>
          </Item>

          <Item id="storage" en="After" title="届いたら">
            <p>
              珈琲豆は空気・湿気・光・熱で香りが抜けていきます。届いたら密閉できる容器に移し、直射日光の当たらない場所で保存してください。詳しくは
              <Link href="/column/coffee-storage">保存方法の読みもの</Link>へ。淹れ方は
              <Link href="/column/brewing-guide">淹れ方の読みもの</Link>にまとめています。
            </p>
          </Item>

          <Item id="faq" en="FAQ" title="よくある質問">
            <dl className={g.faq}>
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt>
                    <span className={g.q} aria-hidden="true">
                      Q.
                    </span>
                    <span className={g.question}>{f.q}</span>
                  </dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </Item>
        </div>

        {/* ---------- 豆をえらぶ ---------- */}
        <section className={g.next} aria-labelledby="next-title">
          <div className={`${site.wrap} ${g.nextInner}`}>
            <div className={g.nextHead}>
              <p className={g.nextEn} aria-hidden="true">
                <span className={`${site.label} ${g.nextLabel}`}>Beans</span>
                <span className={g.nextBig}>The Beans</span>
              </p>
              <h2 id="next-title" className={g.nextTitle}>
                あとは、豆をえらぶだけです。
              </h2>
            </div>
            <div className={g.nextActions}>
              <Link href="/beans" className={buttonClass("primary", "L", g.nextBtn)}>
                珈琲豆をえらぶ <span className={site.arrow} aria-hidden="true">→</span>
              </Link>
              <a href={SHOP_URL} target="_blank" rel="noopener" className={g.shopLink}>
                ショップ（BASE）を見る <span className={site.arrow} aria-hidden="true">↗</span>
                <span className={site.srOnly}>（新しいタブで開きます）</span>
              </a>
            </div>
          </div>
        </section>
      </SiteChrome>
    </>
  );
}
