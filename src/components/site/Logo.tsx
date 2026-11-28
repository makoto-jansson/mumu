// 手書きロゴ（「灯台の珈琲焙煎所」＋「mumu」）
// 透過PNGを型（mask）にして文字色で塗る。青地の上では白になる（color を継承）。

import Link from "next/link";
import s from "./site.module.css";

export default function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className={s.logo} aria-label="灯台の珈琲焙煎所 mumu（トップへ）" onClick={onNavigate}>
      <span className={s.logoTagline} aria-hidden="true" />
      <span className={s.logoScript} aria-hidden="true" />
    </Link>
  );
}
