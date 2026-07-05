// v2デザインの左カラム（本の帯 / obi）— TOP・下層ページで共有するグローバルナビ
//
// 指示書によりメニューは4項目固定（変更禁止）。リンク先は TOP のセクション。
//  - TOP では hrefPrefix="" → 同ページ内アンカー（#about）＋スクロールスパイ（HomeV2側が制御）
//  - 下層ページでは hrefPrefix="/" → TOP該当セクションへ戻る（/#about）
// nav に data-obi-nav を付与し、HomeV2 のスクロールスパイが該当リンクを走査できるようにする。

import SnsLinks from "./SnsLinks";
import styles from "./homeV2.module.css";

// to が "#xxx" ならTOPセクションへのアンカー（hrefPrefixを前置）、
// "/xxx" なら別ページへの絶対リンク（アプリは /app ページなのでアンカーではない）。
// sp: SP（横並び）時に指定位置で2行に折り返すための分割。PCでは brSp を display:none で1行のまま。
type NavItem = { to: string; label: string; sp?: [string, string] };
const NAV_ITEMS: NavItem[] = [
  { to: "#about", label: "mumuについて", sp: ["mumu", "について"] },
  { to: "#beans", label: "珈琲をえらぶ", sp: ["珈琲を", "えらぶ"] },
  { to: "#journal", label: "灯台守の日誌", sp: ["灯台守の", "日誌"] },
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
                <a href={href}>
                  {item.sp ? (
                    <>
                      {item.sp[0]}
                      <br className={styles.brSp} />
                      {item.sp[1]}
                    </>
                  ) : (
                    item.label
                  )}
                </a>
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
