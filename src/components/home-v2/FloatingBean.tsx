"use client";

// 右上に固定表示する珈琲豆（スクロール量に応じて自転）。
// TOP・下層ページ共通の chrome 部品。クリックでオンラインショップへ。
// reduced-motion 時は自転を無効化（指示書の演出仕様8）。

import { useEffect, useRef } from "react";
import { SHOP_URL } from "./links";
import styles from "./homeV2.module.css";

export default function FloatingBean() {
  const beanRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const beanImg = beanRef.current;
    if (!beanImg) return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (beanImg) {
          beanImg.style.transform =
            "rotate(" + window.scrollY * 0.25 + "deg)";
        }
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // 初期反映（リロード時に途中スクロール位置でも合わせる）
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={styles.bean}>
      <a
        href={SHOP_URL}
        target="_blank"
        rel="noopener"
        aria-label="オンラインショップを開く"
      >
        <img ref={beanRef} src="/v2/bean.png" alt="" width={400} height={400} />
      </a>
      <span className={styles.beanLabel}>online shop →</span>
    </div>
  );
}
