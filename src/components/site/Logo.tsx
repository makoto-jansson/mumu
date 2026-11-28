// 手書きロゴ（「灯台の珈琲焙煎所」＋「mumu」）
// 透過PNGを型（mask）にして文字色で塗る。青地の上では白になる（color を継承）。
// mark: 文字ロゴの左に灯台の線画を並べる。トップページのヘッダーだけで使う
//       （2026-11-28 ユーザー判断：回る印をやめ、灯台のマークはトップのヘッダーへ。丸い枠では囲まない）。
//       線画の色は変えない（元の黒のまま）。

import Link from "next/link";
import Image from "next/image";
import s from "./site.module.css";

export default function Logo({ onNavigate, mark = false }: { onNavigate?: () => void; mark?: boolean }) {
  return (
    <Link
      href="/"
      className={`${s.logo} ${mark ? s.logoWithMark : ""}`}
      aria-label="灯台の珈琲焙煎所 mumu（トップへ）"
      onClick={onNavigate}
    >
      {mark && (
        <span className={s.logoMark}>
          <Image src="/v2/lighthouse.png" alt="" fill sizes="40px" loading="eager" />
        </span>
      )}
      <span className={s.logoText}>
        <span className={s.logoTagline} aria-hidden="true" />
        <span className={s.logoScript} aria-hidden="true" />
      </span>
    </Link>
  );
}
