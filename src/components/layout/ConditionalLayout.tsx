"use client";

// /app 以下と新トップページではHeader/Footerを非表示にするためのラッパー
// usePathname でURLを見て出し分ける

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import GrainOverlay from "@/components/ui/GrainOverlay";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /app で始まるパスはアプリゾーン → Header/Footer非表示
  const isApp = pathname.startsWith("/app");
  // v2デザイン（帯レイアウト）を採用するページ群。TOPと下層(about/beans/journal)は
  // 独自の帯(obi)・フッター・背景テクスチャを SiteChromeV2 / HomeV2 が持つため、
  // 旧 Header/Footer/GrainOverlay は掛けない（二重掛け防止）。
  const isV2 =
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/beans" ||
    pathname === "/journal" ||
    pathname === "/column" ||
    pathname.startsWith("/about/") ||
    pathname.startsWith("/beans/") ||
    pathname.startsWith("/journal/") ||
    pathname.startsWith("/column/");

  return (
    <>
      {!isV2 && <GrainOverlay />}
      {!isApp && !isV2 && <Header />}
      {/* v2ページ（TOP/下層）は自前で <main id="top"> を持つため二重にしない */}
      {isV2 ? children : <main>{children}</main>}
      {!isApp && !isV2 && <Footer />}
    </>
  );
}
