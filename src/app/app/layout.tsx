// アプリゾーン専用レイアウト
// - HPのHeader/Footerは表示しない（ルートlayout.tsxのmainタグを上書き）
// - 代わりにBottomNavを表示
// - 背景: ダークグレー（#0e0e0e）
// - 検索エンジンにはインデックスさせない（ツールページのため）

import type { Metadata } from "next";
import BottomNav from "@/components/app/layout/BottomNav";
import NowPlayingBar from "@/components/app/layout/NowPlayingBar";
import SoundPreloader from "@/components/app/layout/SoundPreloader";

// アプリページは検索エンジンにインデックスさせない
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[#0e0e0e]">
      {/* /app配下の間だけ html/body の背景も黒に揃える
         （iOSのバウンススクロールやステータスバー領域で body の生成り白が見えないように）
         ※ GrainOverlayのグレイン（白ノイズ opacity 0.025）が乗った後の実効色に合わせて
         コンテンツ側の #0e0e0e + グレイン ≒ #111 となるため、こちらは #111 で揃える。 */}
      <style>{`html, body { background-color: #111111 !important; }`}</style>
      {/* 効果音のプリロード（キャッシュ用、表示なし） */}
      <SoundPreloader />
      {/* ページコンテンツ（BottomNavの高さ分だけ下にpaddingを確保） */}
      <div className="pb-16">{children}</div>
      {/* 再生中ミニプレイヤー（セッションページ以外で表示） */}
      <NowPlayingBar />
      {/* アプリ専用BottomNav */}
      <BottomNav />
    </div>
  );
}
