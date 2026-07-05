// v2デザインのフッター — TOP・下層ページで共有
// 帯の幅ぶん左マージンを取り、深緑背景。読みものリンクは ★ /column/ 制作後に差し替え。

import styles from "./homeV2.module.css";

export default function FooterV2() {
  return (
    <footer className={styles.footer}>
      <nav aria-label="フッターメニュー">
        {/* 読みもの＝SEOコラム /column（指示書により日誌 /journal とは別コンテンツ） */}
        <a href="/column">読みもの</a>
      </nav>
      © 灯台の珈琲焙煎所 mumu
    </footer>
  );
}
