// フッターコンポーネント
// ロゴ + SNSリンク（Instagram / note / ショップ）+ コピーライト

import Link from "next/link";

export default function Footer() {
  const externalLinks = [
    {
      href: "https://www.instagram.com/mumu_coffee_roaster/",
      label: "Instagram",
    },
    {
      href: "https://note.com/mumu_coffee",
      label: "note",
    },
    {
      href: "https://mumucoffee.theshop.jp/",
      label: "ショップ",
    },
  ];

  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 py-16 px-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-8 text-center">
        {/* ロゴ */}
        <Link
          href="/"
          className="text-[#e8e6e1] text-base font-light tracking-[0.3em] hover:text-[#EF9F27] transition-colors duration-300"
        >
          灯台の珈琲焙煎所 mumu
        </Link>

        {/* サイト内リンク（SEO・クローラビリティ向上） */}
        <nav aria-label="フッターナビゲーション" className="flex items-center gap-8">
          {[
            { href: "/about", label: "about" },
            { href: "/beans", label: "珈琲豆" },
            { href: "/journal", label: "読み物" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#e8e6e1]/50 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 外部リンク */}
        <nav aria-label="外部リンク" className="flex items-center gap-8">
          {externalLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#e8e6e1]/50 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* コピーライト */}
        <p className="text-[#e8e6e1]/30 text-xs font-light tracking-wider">
          © 2026 灯台の珈琲焙煎所mumu
        </p>
      </div>
    </footer>
  );
}
