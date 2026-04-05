"use client";

// /app 以下ではHeader/Footerを非表示にするためのラッパー
// usePathname でURLを見て出し分ける

import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // /app で始まるパスはアプリゾーン → Header/Footer非表示
  const isApp = pathname.startsWith("/app");

  return (
    <>
      {!isApp && <Header />}
      <main>{children}</main>
      {!isApp && <Footer />}
    </>
  );
}
