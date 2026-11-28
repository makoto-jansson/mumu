"use client";

// ヘッダー（PC：ロゴ＋メニュー＋Shop／スマホ：ロゴ＋Shop＋丸いメニューボタン）
// スマホのメニューは全画面の青。開いている間は後ろのページを動かさず、Esc か×で閉じる。
// 帯は画面の上に付いてくるが、出ているのはスクロール中だけ。止まって HIDE_DELAY たつと上へ引っ込み、
// またスクロールすると出る（2026-11-28 ユーザー指定）。ページの一番上・メニューを開いている間・
// マウスやキーボードの操作先がヘッダーにある間は引っ込めない。

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import SnsLinks from "./SnsLinks";
import { NAV_ITEMS, NOTICE } from "./nav";
import { buttonClass } from "./ui";
import { SHOP_URL } from "@/components/home-v2/links";
import s from "./site.module.css";

const HIDE_DELAY = 1000; // スクロールが止まってから引っ込むまで（ミリ秒）

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const openBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hideTimer = useRef<number | undefined>(undefined);
  const holdRef = useRef(false); // マウスやフォーカスがヘッダーにある間は true
  const openRef = useRef(false);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const close = useCallback(() => {
    setOpen(false);
    // 閉じたら、開いたボタンへ戻す（キーボード操作で迷子にならないように）
    requestAnimationFrame(() => openBtnRef.current?.focus());
  }, []);

  // 止まってしばらくしたら引っ込める。一番上（帯の高さぶん以内）にいる間は出したまま
  const scheduleHide = useCallback(() => {
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      const h = headerRef.current?.offsetHeight ?? 0;
      if (window.scrollY > h && !holdRef.current && !openRef.current) setHidden(true);
    }, HIDE_DELAY);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setHidden(false);
      scheduleHide();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    scheduleHide(); // 途中の位置で開いたページ（戻る・ページ内リンク）も、少しして引っ込む
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(hideTimer.current);
    };
  }, [scheduleHide]);

  // ヘッダーが引っ込んでいるかを html に印として出す（PCの記事の目次が、空いた分だけ上に詰めるため）
  useEffect(() => {
    const root = document.documentElement;
    if (hidden) root.dataset.headerHidden = "";
    else delete root.dataset.headerHidden;
    return () => {
      delete root.dataset.headerHidden;
    };
  }, [hidden]);

  const hold = () => {
    holdRef.current = true;
    window.clearTimeout(hideTimer.current);
    setHidden(false);
  };
  const release = () => {
    holdRef.current = false;
    scheduleHide();
  };

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
    <header
      ref={headerRef}
      className={`${s.header} ${s.onBlue} ${hidden ? s.headerHidden : ""}`}
      onMouseEnter={hold}
      onMouseLeave={release}
      onFocus={hold}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) release();
      }}
    >
      <div className={`${s.wrap} ${s.headerInner}`}>
        <Logo />

        {/* PC のメニュー */}
        <nav className={s.nav} aria-label="サイト内メニュー">
          {NAV_ITEMS.map((it) => (
            <Link key={it.href} href={it.href} aria-current={isActive(it.href) ? "page" : undefined}>
              {it.ja}
            </Link>
          ))}
          <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("white", "S", s.shopBtn)}>
            Shop<span className={s.srOnly}>（BASEのオンラインショップ・新しいタブで開きます）</span>
          </a>
        </nav>

        {/* スマホ */}
        <div className={s.headerActions}>
          <a href={SHOP_URL} target="_blank" rel="noopener" className={buttonClass("white", "S", s.shopBtn)}>
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
