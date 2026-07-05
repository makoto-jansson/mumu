// SNSリンク（Instagram / YouTube）— 帯(obi)とフッターで共有し、アイコンを一元管理する。
// ラッパーの見た目（色・余白）は呼び出し側が className で付ける。

import { INSTAGRAM_URL, YOUTUBE_URL } from "./links";

export default function SnsLinks() {
  return (
    <>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener" aria-label="Instagram">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.7" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a href={YOUTUBE_URL} target="_blank" rel="noopener" aria-label="YouTube">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
          <path d="M10.2 9.3v5.4l4.8-2.7z" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </>
  );
}
