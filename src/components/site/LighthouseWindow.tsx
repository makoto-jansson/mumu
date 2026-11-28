// 灯台の丸窓 — 白い丸に青い枠、中に元の黒い線画
// ★灯台の線画は色を変えない（2026-11-26 ユーザー指示）。マスク塗りにしないこと。

import Image from "next/image";
import s from "./site.module.css";

export default function LighthouseWindow({
  size,
  className = "",
  alt = "",
}: {
  size: number; // 表示の最大幅（px）。画像の解像度選びに使う
  className?: string;
  alt?: string;
}) {
  return (
    <span className={`${s.window} ${className}`}>
      <Image src="/v2/lighthouse.png" alt={alt} width={900} height={1255} sizes={`${Math.ceil(size / 2)}px`} />
    </span>
  );
}
