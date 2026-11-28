// v3（青×白）の外枠 — 告知バー・ヘッダー・本文・フッター
// data-site-root: v3.css で html（上下に引っぱった時に覗く部分）を青にする目印

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import { NOTICE } from "./nav";
import s from "./site.module.css";

export default function SiteChrome({
  children,
  ctaSpace = false,
}: {
  children: React.ReactNode;
  ctaSpace?: boolean; // スマホで画面下に固定ボタンを出すページ
}) {
  return (
    <div className={s.root} data-site-root>
      <a href="#main" className={s.skip}>
        本文へ移動
      </a>
      <p className={s.notice}>{NOTICE}</p>
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter ctaSpace={ctaSpace} />
    </div>
  );
}
