// SNS（Instagram・YouTube・Podcast）へのリンク — アイコン＋名前
// Figma の部品「Icon / Instagram・YouTube・Podcast」（24px・線2px）と同じ形。色は文字色を継承する。

import { INSTAGRAM_URL, YOUTUBE_URL, PODCAST_URL } from "@/components/home-v2/links";
import s from "./site.module.css";

const ITEMS = [
  {
    label: "Instagram",
    href: INSTAGRAM_URL,
    icon: (
      <>
        <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="12" r="4.3" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="17.4" cy="6.6" r="1.3" fill="currentColor" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: YOUTUBE_URL,
    icon: (
      <>
        <rect x="1.5" y="4.5" width="21" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M10 8.8 L15.6 12 L10 15.2 Z" fill="currentColor" />
      </>
    ),
  },
  {
    label: "Podcast",
    href: PODCAST_URL,
    icon: (
      <>
        <circle cx="12" cy="10" r="2.4" fill="currentColor" />
        <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M8.46 13.54 A5 5 0 1 1 15.54 13.54" />
          <path d="M5.64 16.36 A9 9 0 1 1 18.36 16.36" />
          <path d="M12 14.5 L12 21.5" />
        </g>
      </>
    ),
  },
];

export default function SnsLinks({ className = "", children }: { className?: string; children?: React.ReactNode }) {
  return (
    <ul className={`${s.sns} ${className}`}>
      {ITEMS.map((it) => (
        <li key={it.label}>
          <a href={it.href} target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              {it.icon}
            </svg>
            <span>{it.label}</span>
          </a>
        </li>
      ))}
      {/* メニューでは「アプリ」を同じ行に並べる */}
      {children}
    </ul>
  );
}
