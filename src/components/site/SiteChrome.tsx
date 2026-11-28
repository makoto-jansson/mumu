// v3（青×白）の外枠 — ヘッダー（青い帯）・本文・フッター
// 2026-11-28 ユーザー判断で、最上部の告知バー（100gから・送料…）はやめ、ヘッダーそのものを青い帯にした
// data-site-root: v3.css で html（上下に引っぱった時に覗く部分）を青にする目印

import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
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
      <SiteHeader />
      <main id="main">{children}</main>
      <SiteFooter ctaSpace={ctaSpace} />
    </div>
  );
}
