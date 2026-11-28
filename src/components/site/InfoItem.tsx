// 青地の案内 1件（Shipping 送料 全国一律¥350 …） — Figma 部品「Info item（White）」
// 親は <dl>。ラベルは欧文イタリック、内容は和文見出し、補足は本文。

import s from "./site.module.css";

export default function InfoItem({ label, main, note }: { label: string; main: string; note?: string }) {
  return (
    <div className={s.infoItem}>
      <dt className={s.label}>{label}</dt>
      <dd>
        <span className={s.infoMain}>{main}</span>
        {note && <span className={s.infoNote}>{note}</span>}
      </dd>
    </div>
  );
}
