// 下層ページの頭 — 小さな欧文ラベル＋大きな欧文（飾り）、和文の見出し（h1）、説明文
// Figma「PC｜豆の一覧」51:295 の「ページの頭」。はじめての方へ・読みもの一覧・mumuについても同じ形。

import s from "./site.module.css";

export default function PageHead({
  label,
  en,
  title,
  children,
  after,
  size = "l",
}: {
  label: string; // 小さな欧文イタリック（Beans）
  en: string; // 大きな欧文（The Beans）。読み上げでは飛ばす
  title: string; // h1（mumuの珈琲豆）
  children?: React.ReactNode; // 説明文
  after?: React.ReactNode; // 説明文の下に置くもの（目次など）
  size?: "l" | "xl"; // xl＝読みもの一覧の特大の欧文（PC 168px）
}) {
  return (
    <header className={`${s.wrap} ${s.pageHead}`}>
      <p className={s.pageHeadEn} aria-hidden="true">
        <span className={`${s.label} ${s.pageHeadLabel}`}>{label}</span>
        <span className={`${s.pageHeadBig} ${size === "xl" ? s.pageHeadXl : ""}`}>{en}</span>
      </p>
      <h1 className={s.pageHeadTitle}>{title}</h1>
      {children && <p className={s.pageHeadLead}>{children}</p>}
      {after}
    </header>
  );
}
