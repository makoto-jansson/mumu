// v2デザインの左カラム（本の帯 / obi）— TOP・下層ページで共有するグローバルナビ
//
// 指示書によりメニューは4項目固定（変更禁止）。リンク先は TOP のセクション。
//  - TOP では hrefPrefix="" → 同ページ内アンカー（#about）＋スクロールスパイ（HomeV2側が制御）
//  - 下層ページでは hrefPrefix="/" → TOP該当セクションへ戻る（/#about）
// nav に data-obi-nav を付与し、HomeV2 のスクロールスパイが該当リンクを走査できるようにする。

import { INSTAGRAM_URL, YOUTUBE_URL } from "./links";
import styles from "./homeV2.module.css";

// to が "#xxx" ならTOPセクションへのアンカー（hrefPrefixを前置）、
// "/xxx" なら別ページへの絶対リンク（アプリは /app ページなのでアンカーではない）。
const NAV_ITEMS = [
  { to: "#about", label: "mumuについて" },
  { to: "#beans", label: "珈琲をえらぶ" },
  { to: "#journal", label: "灯台守の日誌" },
  { to: "#podcast", label: "Podcast" },
  { to: "/app", label: "アプリ" },
];

export default function Obi({ hrefPrefix = "" }: { hrefPrefix?: string }) {
  return (
    <aside className={styles.obi}>
      <a className={styles.obiLogo} href={`${hrefPrefix}#top`} aria-label="トップへ戻る">
        <img src="/v2/logo.png" alt="灯台の珈琲焙煎所 mu-mu" width={600} height={600} />
      </a>
      <nav className={styles.obiNav} aria-label="サイト内メニュー" data-obi-nav>
        <ul>
          {NAV_ITEMS.map((item) => {
            // アンカー(#)はhrefPrefixを前置、絶対パス(/app)はそのまま
            const href = item.to.startsWith("#")
              ? `${hrefPrefix}${item.to}`
              : item.to;
            return (
              <li key={item.to}>
                <a href={href}>{item.label}</a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.obiSns}>
        <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
          </svg>
        </a>
        <a href={YOUTUBE_URL} target="_blank" rel="noopener" aria-label="YouTube">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
            <path d="M10.2 9.3v5.4l4.8-2.7z" fill="currentColor" stroke="none" />
          </svg>
        </a>
      </div>
      <p className={styles.obiFoot}>mumu roastery</p>
    </aside>
  );
}
