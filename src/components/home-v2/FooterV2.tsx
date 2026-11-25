// v2デザインのフッター — TOP・下層ページで共有
// 帯の幅ぶん左マージンを取り、深緑背景。

import Link from "next/link";
import SnsLinks from "./SnsLinks";
import { PODCAST_URL } from "./links";
import styles from "./homeV2.module.css";

export default function FooterV2() {
  return (
    <footer className={styles.footer}>
      <nav aria-label="フッターメニュー">
        <Link href="/beans">珈琲豆</Link>
        <Link href="/guide">はじめての方へ</Link>
        <Link href="/column">読みもの</Link>
        <Link href="/about">mumuについて</Link>
        {/* 段階C（2026-11-25）で帯ナビから移したもの */}
        <a href={PODCAST_URL} target="_blank" rel="noopener">Podcast</a>
        <Link href="/app">アプリ</Link>
      </nav>
      {/* SNS: SPでは帯のアイコンが隠れるため、全デバイス共通でフッターにも設置 */}
      <div className={styles.footSns}>
        <SnsLinks />
      </div>
      © 灯台の珈琲焙煎所 mumu
    </footer>
  );
}
