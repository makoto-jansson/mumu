// トップページ
// Hero → 整える → 味わう → 読む → mumuについて の順に並べる

import HeroSection from "@/components/home/HeroSection";
import ToolsSection from "@/components/home/ToolsSection";
import BeansSection from "@/components/home/BeansSection";
import JournalSection from "@/components/home/JournalSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <>
      {/* フルスクリーンのヒーロー */}
      <HeroSection />

      {/* 3つの柱 + mumuについてセクション */}
      <ToolsSection />
      <BeansSection />
      <JournalSection />
      <AboutSection />
    </>
  );
}
