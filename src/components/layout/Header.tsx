"use client";

// ヘッダーコンポーネント
// - スクロール前: 透明背景（ヒーローの暗い背景に溶け込む）
// - スクロール後: 暗い背景 + ボーダー
// - モバイル: ハンバーガーメニュー → フルスクリーンドロワー

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

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
    { href: "/beans", label: "味わう" },
    { href: "/journal", label: "読む" },
    { href: "/about", label: "about" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* ロゴ */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-75 transition-opacity duration-300"
          >
            <Image
              src="/mumu_logo_white.png"
              alt="灯台の珈琲焙煎所mumu"
              width={0}
              height={0}
              sizes="100vw"
              className="h-8 w-auto object-contain"
            />
            <span className="text-[#e8e6e1] text-lg font-medium tracking-[0.2em]">
              mumu
            </span>
          </Link>

          {/* デスクトップナビ */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[#e8e6e1]/70 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300 relative group"
              >
                {link.label}
                {/* hover時にアンダーラインがスッと現れる */}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
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
              className={`block w-6 h-px bg-[#e8e6e1] transition-all duration-300 ${
                isMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#e8e6e1] transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#e8e6e1] transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </header>

      {/* モバイル: フルスクリーンドロワー */}
      <div
        className={`fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center transition-all duration-500 md:hidden ${
          isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-[#e8e6e1] text-2xl font-light tracking-[0.2em] hover:text-[#EF9F27] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
