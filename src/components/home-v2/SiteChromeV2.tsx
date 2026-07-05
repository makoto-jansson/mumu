// 下層ページ用の v2 共通レイアウト（帯レイアウトを全ページで統一）
// TOP と同じ 背景テクスチャ＋左の帯(obi)＋深緑フッター で囲み、
// children を帯の右のメインエリアに配置する。
//
// data-home-root: globals.css の body:has() で紙色下地を適用するための目印（TOPと共通）。

import PaperBackdrop from "./PaperBackdrop";
import Obi from "./Obi";
import FloatingBean from "./FloatingBean";
import FooterV2 from "./FooterV2";
import styles from "./homeV2.module.css";

export default function SiteChromeV2({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.root} data-home-root>
      <PaperBackdrop />
      {/* 下層ページなので帯リンクは TOP のセクションへ戻る（/#about 等） */}
      <Obi hrefPrefix="/" />
      {/* 右上の豆（自転）— TOPと共通 */}
      <FloatingBean />
      <main id="top" className={styles.main}>
        {children}
      </main>
      <FooterV2 />
    </div>
  );
}
