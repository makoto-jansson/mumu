// トップページ
// Hero → 整える → 味わう → 読む → mumuについて の順に並べる

import HeroSection from "@/components/home/HeroSection";
import ToolsSection from "@/components/home/ToolsSection";
import BeansSection from "@/components/home/BeansSection";
import JournalSection from "@/components/home/JournalSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <div className="pt-20 pb-10 px-4 md:px-8">
      {/* 新デザイン: 角丸ブロック（SectionBlock）を縦に並べる */}
      <HeroSection />

      {/* 3つの柱 + mumuについてセクション（Phase 3以降で新レイアウトに差し替え予定） */}
      <ToolsSection />
      <BeansSection />
      <JournalSection />
      <AboutSection />
    </div>
  );
}
