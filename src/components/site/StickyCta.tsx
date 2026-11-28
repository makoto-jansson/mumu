"use client";

// スマホで、ファーストビューを過ぎたら画面下に「珈琲豆をえらぶ →」を固定で出す（Figma: 下部固定ボタン）
// 見張る要素（watchId）が画面から外れたら出し、戻ったら隠す。PCでは出さない（CSS）。

import { useEffect, useState } from "react";
import { buttonClass } from "./ui";
import s from "./site.module.css";

export default function StickyCta({
  watchId,
  href,
  label,
  external = false,
}: {
  watchId: string;
  href: string;
  label: string;
  external?: boolean; // BASE など外のサイトへ（新しいタブで開き、矢印を ↗ にする）
}) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = document.getElementById(watchId);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(el);
    return () => io.disconnect();
  }, [watchId]);
  return (
    <div className={`${s.sticky} ${show ? s.stickyShow : ""}`} aria-hidden={!show}>
      <a
        href={href}
        className={buttonClass("primary", "L", s.stickyBtn)}
        tabIndex={show ? 0 : -1}
        {...(external ? { target: "_blank", rel: "noopener" } : {})}
      >
        {label} <span className={s.arrow} aria-hidden="true">{external ? "↗" : "→"}</span>
        {external && <span className={s.srOnly}>（新しいタブで開きます）</span>}
      </a>
    </div>
  );
}
