// mumu 公式サイト TOP（v3・リニューアル段階C 2026-11-25）
//
// v2（感性重視・演出中心）から「何の店か伝わって、豆を選んで、買える」TOPへ作り直した。
// 構成は docs/renewal-v3.md §4：
//   ファーストビュー → 珈琲豆（味のものさし＋カード） → 安心材料 → よく読まれている読みもの → mumuについて
// 紙の質感・手書きロゴ・区切り線はブランドの手ざわりとして残し、
// パララックス・ゆる吸着・スクロール出現・スクロールスパイは廃止（JS不要のサーバーコンポーネント化）。
// 帯・背景・豆・フッターは下層ページと同じ SiteChromeV2 を使う。

import Link from "next/link";
import SiteChromeV2 from "./SiteChromeV2";
import BeanTile from "@/components/beans/BeanTile";
import TasteRuler from "@/components/beans/TasteRuler";
import type { BeanView } from "@/lib/beans";
import styles from "./homeV2.module.css";

// 読みもの一覧の1件（表示用の整形済みデータ。CMS取得・整形は page.tsx 側で行う）
export type ColumnItem = { id: string; title: string };

// 手書きの区切り線（装飾。スクロール演出は付けない）
function Divider() {
  return (
    <img
      className={styles.divider}
      src="/v2/line.png"
      alt=""
      aria-hidden="true"
      width={1400}
      height={209}
      loading="lazy"
    />
  );
}

function SectionTitle({ id, children, sub }: { id: string; children: React.ReactNode; sub?: string }) {
  return (
    <div className="text-center mb-10">
      <h2 id={id} className="font-mincho text-ink-primary text-2xl md:text-[28px] tracking-[0.12em] font-medium">
        {children}
      </h2>
      {sub && <p className="mt-3 text-[13px] text-ink-secondary/70">{sub}</p>}
    </div>
  );
}

export default function HomeV2({
  beans = [],
  columnPosts = [],
}: {
  beans?: BeanView[];
  columnPosts?: ColumnItem[]; // よく読まれている読みもの
}) {
  return (
    <SiteChromeV2>
      {/* ---------- ファーストビュー：何の店か → 豆をえらぶ ---------- */}
      <section className={styles.hero} aria-labelledby="hero-title">
        <img className={styles.heroCup} src="/v2/cup.png" alt="" aria-hidden="true" width={440} height={440} />
        <img
          className={`${styles.heroTagline} ${styles.write} ${styles.writeAuto}`}
          style={{ animationDelay: "0.2s", animationDuration: "0.9s" }}
          src="/v2/tagline.png"
          alt=""
          aria-hidden="true"
          width={401}
          height={47}
        />
        <h1 id="hero-title">
          <img
            className={`${styles.heroLogo} ${styles.write} ${styles.writeAuto}`}
            style={{ animationDelay: "0.45s", animationDuration: "0.9s" }}
            alt="灯台の珈琲焙煎所 mumu"
            src="/v2/mumu-script.png"
            width={611}
            height={100}
          />
        </h1>
        <p className="mt-8 font-mincho text-ink-primary text-lg md:text-xl tracking-[0.08em] leading-relaxed">
          自家焙煎の<br className="md:hidden" />スペシャルティコーヒー豆を、100gから。
        </p>
        <p className="mt-3 text-[13px] md:text-[14px] text-ink-secondary/80 leading-relaxed">
          華やかな浅煎りと、ほろ苦い深煎り。送料は全国一律¥350。
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Link
            href="#beans"
            className="inline-flex items-center gap-2 rounded-full bg-ink-primary text-white px-7 py-3.5 text-[15px] tracking-wider hover:opacity-85 transition-opacity"
          >
            豆をえらぶ <span aria-hidden="true">↓</span>
          </Link>
          <Link href="/guide" className="text-[14px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            はじめての方へ
          </Link>
        </div>
      </section>

      <Divider />

      {/* ---------- 珈琲豆 ---------- */}
      <section id="beans" className="max-w-3xl mx-auto px-6 py-20 md:py-24 scroll-mt-20" aria-labelledby="beans-title">
        <SectionTitle id="beans-title" sub="購入はBASE（オンラインショップ）で行えます。">
          mumuの珈琲豆
        </SectionTitle>
        {beans.length > 0 ? (
          <>
            <div className="mb-8">
              <TasteRuler beans={beans} />
            </div>
            <ul className="space-y-5">
              {beans.map((b) => (
                <BeanTile key={b.slug} bean={b} medium="top" campaign="home" />
              ))}
            </ul>
          </>
        ) : (
          <p className="text-center text-ink-secondary text-sm">ただいま準備中です。</p>
        )}
        <p className="mt-8 text-center">
          <Link href="/beans" className="text-[14px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            豆の一覧と選び方を見る →
          </Link>
        </p>
      </section>

      {/* ---------- 安心材料：買う前の不安を先に消す ---------- */}
      <section className="max-w-3xl mx-auto px-6 pb-20 md:pb-24" aria-labelledby="assure-title">
        <h2 id="assure-title" className="sr-only">ご注文について</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            ["送料", "全国一律 ¥350", "ゆうパケットポストでポストにお届け"],
            ["お届け", "7日以内に発送", "お支払いの確定後に発送します"],
            ["豆のまま／粉", "どちらも選べます", "粉は備考欄に「粉希望」と記入"],
          ].map(([k, v, note]) => (
            <div key={k} className="rounded-xl border border-ink-primary/15 bg-white/60 p-4 text-center">
              <dt className="text-[12px] text-ink-secondary/70 mb-1">{k}</dt>
              <dd>
                <span className="block text-ink-primary text-[16px]">{v}</span>
                <span className="block mt-1 text-[11.5px] text-ink-secondary/70 leading-relaxed">{note}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-center">
          <Link href="/guide" className="text-[14px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            はじめての方へ（送料・お支払い・よくある質問）→
          </Link>
        </p>
      </section>

      <Divider />

      {/* ---------- よく読まれている読みもの ---------- */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-24" aria-labelledby="column-title">
        <SectionTitle id="column-title" sub="淹れ方や産地のことを、焙煎所の目線でまとめています。">
          よく読まれている読みもの
        </SectionTitle>
        {columnPosts.length > 0 && (
          <ul className="divide-y divide-ink-primary/15 border-y border-ink-primary/15">
            {columnPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/column/${post.id}`}
                  className="flex items-center justify-between gap-4 py-4 text-[14px] md:text-[15px] text-ink-secondary hover:text-ink-primary transition-colors"
                >
                  <span>{post.title}</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-8 text-center">
          <Link href="/column" className="text-[14px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            読みものをすべて見る →
          </Link>
        </p>
      </section>

      <Divider />

      {/* ---------- mumuについて（物語は短く、詳しくは /about へ） ---------- */}
      <section className="max-w-3xl mx-auto px-6 py-20 md:py-24 text-center" aria-labelledby="about-title">
        <SectionTitle id="about-title">mumuについて</SectionTitle>
        <img
          className="mx-auto"
          style={{ width: "min(200px, 48vw)" }}
          src="/v2/lighthouse.png"
          alt="灯台と焙煎小屋のイラスト"
          width={900}
          height={1255}
          loading="lazy"
        />
        <img
          className="mx-auto mt-8 mix-blend-multiply"
          style={{ width: "min(420px, 80vw)" }}
          src="/v2/kansei.png"
          alt="感性が、ふと戻ってくるような一杯を"
          width={1400}
          height={168}
          loading="lazy"
        />
        <p className="mt-8 text-[14px] md:text-[15px] text-ink-secondary leading-loose">
          情報にさらされ続ける毎日のなかで、眠ってしまった感性に、もういちど灯りをともす。
          <br className="hidden md:block" />
          mumu（ムーム）は、そのための小さな焙煎所です。
        </p>
        <p className="mt-6">
          <Link href="/about" className="text-[14px] text-ink-primary underline underline-offset-4 hover:opacity-75">
            焙煎所と焙煎者のこと →
          </Link>
        </p>
      </section>
    </SiteChromeV2>
  );
}
