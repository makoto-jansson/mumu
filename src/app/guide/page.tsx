// はじめての方へ /guide（リニューアル段階Bで新設）
//
// 「BASEに移って買う」前に抱く不安（送料・届く日数・豆か粉か・払い方・返品）を先に消すページ。
// ★ 記載内容は BASE の商品ページと特定商取引法ページ（2026-11-25時点）に合わせている。
//    BASE側の条件を変えたら、ここも必ず合わせて直すこと（食い違うと信頼を損なう）。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import { SHOP_URL } from "@/components/home-v2/links";

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

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mb-14">
      <h2 id={id} className="font-mincho text-ink-primary text-xl tracking-wide mb-5">
        {title}
      </h2>
      <div className="text-ink-secondary text-[15px] leading-loose space-y-3">{children}</div>
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
      <SiteChromeV2>
        <div className="min-h-screen pt-32 pb-24 px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-relaxed tracking-wide mb-4">
              はじめての方へ
            </h1>
            <p className="text-ink-secondary text-[15px] leading-loose mb-12">
              mumuの珈琲豆を初めて買う方に向けて、選び方から届くまでをまとめました。
            </p>

            {/* 要点（ここだけ読めば買える） */}
            <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
              {[
                ["送料", "全国一律 ¥350"],
                ["お届け", "お支払い確定後 7日以内に発送"],
                ["容量", "100gから（約8杯分）"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-ink-primary/15 bg-white/60 p-4">
                  <dt className="text-[12px] text-ink-secondary/70 mb-1">{k}</dt>
                  <dd className="text-ink-primary text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>

            <Section id="choose" title="豆の選び方">
              <p>
                いま扱っているのは、華やかで果実のような酸味の<strong className="font-medium text-ink-primary">浅煎り</strong>と、
                ほろ苦さとコクの<strong className="font-medium text-ink-primary">深煎り</strong>です。
                ブラックで香りを楽しむなら浅煎り、ミルクを入れるなら深煎りから選ぶと失敗しにくいです。
              </p>
              <p>
                <Link href="/beans" className="text-ink-primary underline underline-offset-4 hover:opacity-75">珈琲豆の一覧</Link>
                で、味の違いを比べられます。
              </p>
            </Section>

            <Section id="flow" title="ご注文の流れ">
              <ol className="list-decimal pl-5 space-y-2">
                <li>このサイトで豆を選び、「BASEで購入する」を押します。</li>
                <li>オンラインショップ（BASE）の商品ページに移るので、カートに入れてご注文ください。</li>
                <li>粉をご希望の場合は、ご注文時の備考欄に「粉希望」とご記入ください。</li>
              </ol>
              <p className="text-[13px] text-ink-secondary/70">
                決済はBASEのシステムで行われるため、このサイトがカード情報などを預かることはありません。
              </p>
            </Section>

            <Section id="grind" title="豆のまま／粉">
              <p>
                基本は豆のままでお届けしています。挽きたてがいちばん香るので、ミルをお持ちなら豆のままがおすすめです。
              </p>
              <p>
                粉をご希望の場合は中細挽き（ハンドドリップ向け）に一律で挽いてお送りします。
                挽き目の目安は
                <Link href="/column/coffee-grind-size" className="text-ink-primary underline underline-offset-4 hover:opacity-75 mx-1">挽き目の読みもの</Link>
                にまとめています。
              </p>
            </Section>

            <Section id="shipping" title="送料・お届け">
              <p>送料は全国一律¥350です。ゆうパケットポストでのお届けで、荷物の追跡ができます。</p>
              <p>ご注文が2点までならポスト投函でお届けします。3点以上の場合は別の方法で発送することがありますが、送料は変わりません。</p>
              <p>お支払いの確定後、7日以内に発送します（後払いの場合はご注文の確定後7日以内）。</p>
            </Section>

            <Section id="payment" title="お支払い方法">
              <p>
                クレジットカード、PayPay、Amazon Pay、キャリア決済、銀行振込、コンビニ決済・Pay-easy、あと払い（PAY ID）がお使いいただけます。
                詳しくはショップの表記をご確認ください。
              </p>
            </Section>

            <Section id="storage" title="届いたら">
              <p>
                珈琲豆は空気・湿気・光・熱で香りが抜けていきます。届いたら密閉できる容器に移し、直射日光の当たらない場所で保存してください。
                詳しくは
                <Link href="/column/coffee-storage" className="text-ink-primary underline underline-offset-4 hover:opacity-75 mx-1">保存方法の読みもの</Link>
                へ。淹れ方は
                <Link href="/column/brewing-guide" className="text-ink-primary underline underline-offset-4 hover:opacity-75 mx-1">淹れ方の読みもの</Link>
                にまとめています。
              </p>
            </Section>

            <Section id="faq" title="よくある質問">
              <dl className="divide-y divide-ink-primary/15 border-y border-ink-primary/15">
                {FAQ.map((f) => (
                  <div key={f.q} className="py-4">
                    <dt className="text-ink-primary font-medium mb-1">Q. {f.q}</dt>
                    <dd className="text-[14px]">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </Section>

            <div className="flex flex-wrap gap-4 items-center">
              <Link href="/beans" className="inline-flex items-center gap-2 rounded-full bg-ink-primary text-white px-6 py-3 text-[14px] tracking-wider hover:opacity-85 transition-opacity">
                珈琲豆を選ぶ <span aria-hidden="true">→</span>
              </Link>
              <a href={SHOP_URL} target="_blank" rel="noopener" className="text-[13px] text-ink-primary underline underline-offset-4 hover:opacity-75">
                ショップ（BASE）を見る ↗
              </a>
            </div>
          </div>
        </div>
      </SiteChromeV2>
    </>
  );
}
