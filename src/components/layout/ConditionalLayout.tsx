"use client";

// ページの種類で外枠を出し分けるラッパー（usePathname でURLを見る）
//
// 2026-11 の v3（青×白）リニューアルで、サイトのページ（トップ・豆・はじめての方へ・読みもの・
// mumuについて・404）はすべて自前の外枠（components/site/SiteChrome：告知バー・ヘッダー・
// <main>・フッター）を持つようになった。ここでは何も足さない。
// 以前は「v2のページ一覧」に無いURLへ旧 Header/Footer を掛けていたため、
// 一覧に無い 404 で外枠が二重に出ていた。
// /app 以下（アプリ）だけは従来どおり、グレインと <main> を掛ける。

import { usePathname } from "next/navigation";
import GrainOverlay from "@/components/ui/GrainOverlay";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isApp = pathname.startsWith("/app");

  if (!isApp) return <>{children}</>;

  return (
    <>
      <GrainOverlay />
      <main>{children}</main>
    </>
  );
}
