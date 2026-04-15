// アプリゾーン専用レイアウト
// - HPのHeader/Footerは表示しない（ルートlayout.tsxのmainタグを上書き）
// - 代わりにBottomNavを表示
// - 背景は暗色（#0a0a0a）で統一

import BottomNav from "@/components/app/layout/BottomNav";
import NowPlayingBar from "@/components/app/layout/NowPlayingBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ページコンテンツ（BottomNavの高さ分だけ下にpaddingを確保） */}
      <div className="pb-16">{children}</div>
      {/* 再生中ミニプレイヤー（セッションページ以外で表示） */}
      <NowPlayingBar />
      {/* アプリ専用BottomNav */}
      <BottomNav />
    </div>
  );
}
