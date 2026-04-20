// フッターコンポーネント（新デザイン 2026リニューアル）
// max-w-820、生成り白背景、上段=ブランド名+SNS、下段=コピーライト

import Link from "next/link";

export default function Footer() {
  const externalLinks = [
    {
      href: "https://www.instagram.com/mumu_coffee_roaster/",
      label: "INSTAGRAM",
    },
    {
      href: "https://note.com/mumu_coffee",
      label: "NOTE",
    },
    {
      href: "https://mumucoffee.theshop.jp/",
      label: "SHOP",
    },
  ];

  const internalLinks = [
    { href: "/about", label: "ABOUT" },
    { href: "/beans", label: "BEANS" },
    { href: "/journal", label: "JOURNAL" },
  ];

  return (
    <footer className="bg-base px-4 md:px-8 py-10 md:py-14">
      <div className="max-w-[820px] mx-auto">
        {/* 上段: ブランド名 + リンク群 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4 mb-6 md:mb-8">
          {/* ブランド名 + ライムドット */}
          <Link
            href="/"
            className="group inline-flex items-center gap-2 w-fit"
          >
            <span className="w-[6px] h-[6px] rounded-full bg-accent-lime" />
            <span className="font-serif italic text-ink-primary text-[12px] tracking-wider group-hover:opacity-70 transition-opacity duration-300">
              灯台の珈琲焙煎所 mumu
            </span>
          </Link>

          {/* リンク群: 内部ナビ + 外部SNS */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-ink-secondary text-[10px] tracking-[0.2em] hover:text-ink-primary transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
            {/* 区切り */}
            <span className="w-px h-3 bg-ink-secondary/30" aria-hidden="true" />
            {externalLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-secondary text-[10px] tracking-[0.2em] hover:text-ink-primary transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* 区切り線 */}
        <div
          aria-hidden="true"
          style={{ borderTop: "0.5px solid rgba(44, 102, 113, 0.2)" }}
        />

        {/* 下段: コピーライト + all rights reserved */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4 mt-4 md:mt-5">
          <p className="text-[9px] text-grad-teal tracking-[0.2em]">
            © 2026 LIGHTHOUSE COFFEE ROASTERY mumu
          </p>
          <p className="font-serif italic text-[9px] text-grad-teal">
            — all rights reserved —
          </p>
        </div>
      </div>
    </footer>
  );
}
