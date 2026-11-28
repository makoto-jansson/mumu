// 見出し — 大きな欧文＋和文、下に2pxの線。PCでは右端に「すべて見る →」を置く
// （スマホでは見出しの右に置かず、各ページがセクションの最後に置く）

import Link from "next/link";
import s from "./site.module.css";

export default function SectionTitle({
  id,
  en,
  ja,
  link,
  compact = false,
}: {
  id: string;
  en: React.ReactNode;
  ja: string;
  link?: { href: string; label: string };
  compact?: boolean; // スマホで欧文を一回り小さくする（「Other Beans」など長い見出し）
}) {
  return (
    <div className={`${s.sectionTitle} ${compact ? s.titleCompact : ""}`}>
      <h2 id={id}>
        <span className={s.titleEn}>{en}</span>
        <span className={s.titleJa}>{ja}</span>
      </h2>
      {link && (
        <Link href={link.href} className={s.textLink}>
          {link.label} <span className={s.arrow} aria-hidden="true">→</span>
        </Link>
      )}
    </div>
  );
}
