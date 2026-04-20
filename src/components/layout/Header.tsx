"use client";

// ヘッダーコンポーネント
// - スクロール前: 非表示（ページ最上部ではヘッダーを隠す）
// - スクロール後: 上からスライドイン + 生成り白背景 + ボーダー
// - モバイル: ハンバーガーメニュー → フルスクリーンドロワー

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Header() {
  // スクロール位置を追跡して背景を切り替える
  const [isScrolled, setIsScrolled] = useState(false);
  // モバイルメニューの開閉状態
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // メニューが開いている時はbodyのスクロールを止める
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/app", label: "整える" },
    { href: "/beans", label: "珈琲" },
    { href: "/journal", label: "読む" },
    { href: "/about", label: "about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out bg-base/95 backdrop-blur-sm border-b border-ink-primary/10 ${
          isScrolled
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ロゴ（セリフイタリックテキスト） */}
          <Link
            href="/"
            className="hover:opacity-75 transition-opacity duration-300"
          >
            <span className="text-ink-primary font-serif italic text-[27px] tracking-[-0.03em]">
              mumu
            </span>
          </Link>

          {/* デスクトップナビ */}
          <nav aria-label="メインナビゲーション" className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-secondary text-sm font-light tracking-wider hover:text-ink-primary transition-colors duration-300 relative group"
              >
                {link.label}
                {/* hover時にアンダーラインがスッと現れる */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-accent-lime group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* モバイル: ハンバーガーボタン */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="メニューを開く"
          >
            <span
              className={`block w-6 h-px bg-ink-primary transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-ink-primary transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-ink-primary transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* モバイル: フルスクリーンドロワー */}
      <div
        className={`fixed inset-0 z-40 bg-base flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-ink-primary text-2xl font-light tracking-[0.2em] hover:text-accent-lime transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
