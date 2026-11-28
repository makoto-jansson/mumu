"use client";

// ヘッダー（PC：ロゴ＋メニュー＋Shop／スマホ：ロゴ＋Shop＋丸いメニューボタン）
// スマホのメニューは全画面の青。開いている間は後ろのページを動かさず、Esc か×で閉じる。

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import SnsLinks from "./SnsLinks";
import { NAV_ITEMS, NOTICE } from "./nav";
import { buttonClass } from "./ui";
import { SHOP_URL } from "@/components/home-v2/links";
import s from "./site.module.css";

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const close = useCallback(() => {
    setOpen(false);
    // 閉じたら、開いたボタンへ戻す（キーボード操作で迷子にならないように）
    requestAnimationFrame(() => openBtnRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // PC幅に広げたらメニューを閉じる（PCにはメニュー画面が無いため）
    const mq = window.matchMedia("(min-width: 900px)");
    const onMq = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  return (
    <header className={s.header}>
      <div className={`${s.wrap} ${s.headerInner}`}>
        <Logo mark={pathname === "/"} />

        {/* PC のメニュー */}
        <nav className={s.nav} aria-label="サイト内メニュー">
          {NAV_ITEMS.map((it) => (
            <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? "page" : undefined}>
              {it.ja}
            </Link>
          ))}
          <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("primary", "S", s.shopBtn)}>
            Shop<span className={s.srOnly}>（BASEのオンラインショップ・新しいタブで開きます）</span>
          </a>
        </nav>

        {/* スマホ */}
        <div className={s.headerActions}>
          <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("primary", "S", s.shopBtn)}>
            Shop<span className={s.srOnly}>（BASEのオンラインショップ・新しいタブで開きます）</span>
          </a>
          <button
            ref={openBtnRef}
            type="button"
            className={s.menuBtn}
            aria-label="メニューを開く"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div id="site-menu" className={`${s.menu} ${s.onBlue}`} role="dialog" aria-modal="true" aria-label="メニュー">
          <div className={`${s.wrap} ${s.headerInner}`}>
            <Logo onNavigate={() => setOpen(false)} />
            <div className={s.headerActions} style={{ display: "flex" }}>
              <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("white", "S", s.shopBtn)}>
                Shop<span className={s.srOnly}>（BASEのオンラインショップ・新しいタブで開きます）</span>
              </a>
              <button
                ref={closeBtnRef}
                type="button"
                className={`${s.menuBtn} ${s.closeBtn}`}
                aria-label="メニューを閉じる"
                onClick={close}
              >
                <span />
                <span />
              </button>
            </div>
          </div>
          <div className={s.wrap}>
            <nav aria-label="サイト内メニュー（スマホ）">
              <ul className={s.menuList}>
                {NAV_ITEMS.map((it) => (
                  <li key={it.href}>
                    <Link
                      href={it.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(it.href) ? "page" : undefined}
                    >
                      <span>
                        <span className={s.menuEn} aria-hidden="true">
                          {it.en}
                        </span>
                        <span className={s.menuJa}>{it.ja}</span>
                      </span>
                      <span className={`${s.menuArrow} ${s.arrow}`} aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("white", "L", s.menuShop)}>
              ショップ（BASE）で買う <span className={s.arrow} aria-hidden="true">↗</span>
            </a>
            <SnsLinks className={s.menuSns}>
              <li>
                <Link href="/app" onClick={() => setOpen(false)}>
                  <span>アプリ</span>
                </Link>
              </li>
            </SnsLinks>
            <p className={s.menuNotice}>{NOTICE}</p>
          </div>
        </div>
      )}
    </header>
  );
}
