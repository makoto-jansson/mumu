// ロゴ — カラーの灯台の絵＋手書きの文字ロゴ（「灯台の珈琲焙煎所」＋「mumu」）
// 灯台の絵は、前のサイトのロゴ（深緑の地の正方形）から地を抜いて絵だけを切り出したもの（public/v2/lighthouse-color.png）。
// 色は変えない（生成りの塗り＋黒い線のまま）。ヘッダーとスマホのメニューはどちらも青地なので、そのまま載る。
// 文字ロゴは透過PNGを型（mask）にして文字色で塗る（青地の上では白）。線の太さとかすれをそろえた版を使う。

import Link from "next/link";
import Image from "next/image";
import s from "./site.module.css";

export default function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className={s.logo} aria-label="灯台の珈琲焙煎所 mumu（トップへ）" onClick={onNavigate}>
      <span className={s.logoMark}>
        <Image src="/v2/lighthouse-color.png" alt="" fill sizes="40px" loading="eager" />
      </span>
      <span className={s.logoText}>
        <span className={s.logoTagline} aria-hidden="true" />
        <span className={s.logoScript} aria-hidden="true" />
      </span>
    </Link>
  );
}
