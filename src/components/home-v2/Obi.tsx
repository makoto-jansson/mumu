"use client";

// 左カラム（本の帯 / obi）— TOP・下層ページで共有するグローバルナビ
//
// リニューアル段階C（2026-11-25）で「TOP内のセクションへのアンカー」から
// 「買うために必要なページへのリンク」に組み替えた。現在地は URL で判定して灯す
// （以前の TOP 内スクロールスパイは廃止）。Podcast・アプリはフッターへ移した。

import Link from "next/link";
import { usePathname } from "next/navigation";
import SnsLinks from "./SnsLinks";
import { SHOP_URL } from "./links";
import styles from "./homeV2.module.css";

// sp: SP（横並び）時に指定位置で2行に折り返すための分割。PCでは brSp を display:none で1行のまま。
type NavItem = { href: string; label: string; sp?: [string, string]; external?: boolean };
const NAV_ITEMS: NavItem[] = [
  { href: "/beans", label: "珈琲をえらぶ", sp: ["珈琲を", "えらぶ"] },
  { href: "/guide", label: "はじめての方へ", sp: ["はじめて", "の方へ"] },
  { href: "/column", label: "読みもの", sp: ["読み", "もの"] },
  { href: "/about", label: "mumuについて", sp: ["mumu", "について"] },
  { href: SHOP_URL, label: "SHOP", external: true },
];

export default function Obi() {
  const pathname = usePathname();
  // /beans/ethiopia-sidamo のような下層でも親メニューを灯す
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <aside className={styles.obi}>
      <Link className={styles.obiLogo} href="/" aria-label="トップへ戻る">
        <img src="/v2/logo.png" alt="灯台の珈琲焙煎所 mumu" width={600} height={600} />
      </Link>
      <nav className={styles.obiNav} aria-label="サイト内メニュー">
        <ul>
          {NAV_ITEMS.map((item) => {
            const label = item.sp ? (
              <>
                {item.sp[0]}
                <br className={styles.brSp} />
                {item.sp[1]}
              </>
            ) : (
              item.label
            );
            return (
              <li key={item.href}>
                {item.external ? (
                  <a href={item.href} target="_blank" rel="noopener">
                    {label}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    className={isActive(item.href) ? styles.active : undefined}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.obiSns}>
        <SnsLinks />
      </div>
      <p className={styles.obiFoot}>mumu roastery</p>
    </aside>
  );
}
