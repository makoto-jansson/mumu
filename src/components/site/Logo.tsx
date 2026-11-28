// サイトのロゴ（ヘッダー・スマホのメニュー）— 白いアーチの窓（トップの絵と同じ形）に灯台の線画、右に手書きの文字ロゴ（白）
// 2026-11-28: 前のサイトのカラーの灯台は「地の色を変えてはいけない」ロゴなので使わず、
// 色を変えていない黒い線画を白い窓（LighthouseWindow）に入れる形にした。同日、窓の形を丸からアーチに。線画の色は変えないこと。

import Link from "next/link";
import LighthouseWindow from "./LighthouseWindow";
import s from "./site.module.css";

export default function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className={s.logo} aria-label="灯台の珈琲焙煎所 mumu（トップへ）" onClick={onNavigate}>
      <LighthouseWindow size={46} className={s.logoMark} />
      <span className={s.logoText}>
        <span className={s.logoTagline} aria-hidden="true" />
        <span className={s.logoScript} aria-hidden="true" />
      </span>
    </Link>
  );
}
