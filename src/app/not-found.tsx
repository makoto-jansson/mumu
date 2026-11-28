// ページが見つからないとき（404）— 存在しないURL全体と、notFound() を呼んだページで表示される
// 正本は Figma「PC｜404」72:674 /「スマホ｜404」72:223。
// 検索エンジン向けの noindex は Next.js が自動で付ける（404を返すため）。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChrome from "@/components/site/SiteChrome";
import LighthouseWindow from "@/components/site/LighthouseWindow";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import s from "./not-found.module.css";

// タブの題名（何も指定しないとトップページと同じ題名になる）
export const metadata: Metadata = { title: "ページが見つかりません" };

export default function NotFound() {
  return (
    <SiteChrome>
      <section className={`${site.wrap} ${s.box}`} aria-labelledby="nf-title">
        <LighthouseWindow size={280} className={s.window} />
        <div className={s.text}>
          <p className={s.code} aria-hidden="true">
            <span className={`${site.label} ${s.label}`}>Not found</span>
            <span className={s.big}>404</span>
          </p>
          <h1 id="nf-title" className={s.title}>
            ページが見つかりませんでした。
          </h1>
          <p className={s.lead}>URLが変わったか、ページがなくなった可能性があります。</p>
          <div className={s.btns}>
            <Link href="/" className={buttonClass("primary", "L")}>
              トップへ戻る <span className={site.arrow} aria-hidden="true">→</span>
            </Link>
            <Link href="/beans" className={buttonClass("outline", "L")}>
              珈琲豆を見る <span className={site.arrow} aria-hidden="true">→</span>
            </Link>
            <Link href="/column" className={buttonClass("outline", "L")}>
              読みものを見る <span className={site.arrow} aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
