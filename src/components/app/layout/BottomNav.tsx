"use client";

// アプリ専用BottomNav
// ホーム / My cup / ルーティン の3タブ

import Link from "next/link";
import { usePathname } from "next/navigation";
import { stopZyunnbi } from "@/lib/playSound";

const navItems = [
  {
    href: "/app",
    label: "ホーム",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12L12 4L21 12V20C21 20.5523 20.5523 21 20 21H15V16H9V21H4C3.44772 21 3 20.5523 3 20V12Z"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          strokeLinejoin="round"
          opacity={active ? 1 : 0.4}
        />
      </svg>
    ),
  },
  {
    href: "/app/dashboard",
    label: "My cup",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M18 8H19C20.1046 8 21 8.89543 21 10V12C21 13.1046 20.1046 14 19 14H18"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={active ? 1 : 0.4}
        />
        <rect
          x="3" y="8" width="15" height="13" rx="2"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          opacity={active ? 1 : 0.4}
        />
        <path
          d="M6 2C6 2 6 5 9 5C12 5 12 2 12 2"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={active ? 1 : 0.4}
        />
      </svg>
    ),
  },
  {
    href: "/app/routine",
    label: "ルーティン",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect
          x="3" y="4" width="18" height="18" rx="2"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          opacity={active ? 1 : 0.4}
        />
        <path
          d="M16 2V6M8 2V6M3 10H21"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity={active ? 1 : 0.4}
        />
        <path
          d="M8 14H8.01M12 14H12.01M16 14H16.01M8 18H8.01M12 18H12.01"
          stroke={active ? "#EF9F27" : "#e8e6e1"}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={active ? 1 : 0.4}
        />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-sm border-t border-white/10">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => {
          // /app はトップだけ完全一致、それ以外は前方一致
          const isActive =
            item.href === "/app"
              ? pathname === "/app"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={stopZyunnbi}
              className="flex flex-col items-center gap-1 py-2 px-4"
            >
              {item.icon(isActive)}
              <span
                className={`text-[10px] font-light tracking-wider transition-colors duration-300 ${
                  isActive ? "text-[#EF9F27]" : "text-[#e8e6e1]/40"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
