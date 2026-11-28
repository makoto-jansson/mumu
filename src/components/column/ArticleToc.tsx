"use client";

// 記事の目次 — スクロールに合わせて、今読んでいる章に印（左の青い線・PCは淡い青のマーカー）を付ける
// 見出し（h2 id="sec-01" …）は lib/articleHtml の numberHeadings が付ける。
// 画面の上から 30% の線を越えた最後の見出しを「今読んでいる章」とする。最初の見出しより前は印なし。

import { useEffect, useState } from "react";
import site from "@/components/site/site.module.css";
import a from "./article.module.css";

export type TocItem = { id: string; no: string; text: string };

export default function ArticleToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const heads = items
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (heads.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.3;
      let current: string | null = null;
      for (const h of heads) {
        if (h.getBoundingClientRect().top <= line) current = h.id;
        else break;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav className={a.toc} aria-labelledby="toc-title">
      <p id="toc-title" className={`${site.label} ${a.tocTitle}`}>
        Contents<span className={site.srOnly}>（目次）</span>
      </p>
      <ol>
        {items.map((t) => (
          <li key={t.id}>
            <a href={`#${t.id}`} aria-current={active === t.id ? "location" : undefined}>
              <span className={`${site.label} ${a.tocNo}`} aria-hidden="true">
                {t.no}
              </span>
              {/* 外側は並べるための箱、内側は文字そのもの（マーカーを行ごとに引くため inline のまま） */}
              <span>
                <span className={a.tocMark}>{t.text}</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
