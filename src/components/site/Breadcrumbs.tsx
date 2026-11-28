// パンくず — 「ホーム / 珈琲豆 / エチオピア シダモ」。最後の項目は今いるページ（リンクにしない）
// 構造化データ（BreadcrumbList）は各ページが自分で出す。

import { Fragment } from "react";
import Link from "next/link";
import s from "./site.module.css";

export type Crumb = { href?: string; label: string };

export default function Breadcrumbs({ items, inline = false }: { items: Crumb[]; inline?: boolean }) {
  // inline: 記事の頭のように、すでに横幅の器の中に置くとき（左右の余白を二重にしない）
  return (
    <nav aria-label="パンくず" className={`${inline ? "" : s.wrap} ${s.crumbs}`}>
      <ol>
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && (
                <li aria-hidden="true" className={s.crumbSep}>
                  /
                </li>
              )}
              <li>
                {it.href && !last ? (
                  <Link href={it.href}>{it.label}</Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{it.label}</span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
