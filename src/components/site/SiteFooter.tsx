// フッター（青） — 大きな「mumu」、メニュー、SNS（アイコン＋名前）、コピーライト

import Link from "next/link";
import SnsLinks from "./SnsLinks";
import { NAV_ITEMS } from "./nav";
import s from "./site.module.css";

export default function SiteFooter({ ctaSpace = false }: { ctaSpace?: boolean }) {
  return (
    <footer className={`${s.footer} ${s.onBlue} ${ctaSpace ? s.footerCtaSpace : ""}`}>
      <div className={s.wrap}>
        <div className={s.footerTop}>
          <p className={s.footerMark} aria-hidden="true">
            mumu
          </p>
          <nav className={s.footerNav} aria-label="フッターメニュー">
            <ul>
              {NAV_ITEMS.map((it) => (
                <li key={it.href}>
                  <Link href={it.href}>{it.ja}</Link>
                </li>
              ))}
              <li>
                <Link href="/app">アプリ</Link>
              </li>
            </ul>
          </nav>
        </div>
        <SnsLinks className={s.footerSnsSp} />
        <div className={s.footerBottom}>
          <p className={s.copy}>© 灯台の珈琲焙煎所 mumu</p>
          <SnsLinks className={s.footerSnsPc} />
        </div>
      </div>
    </footer>
  );
}
