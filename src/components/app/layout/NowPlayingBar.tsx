"use client";

// 再生中ミニプレイヤーバー
// - 音楽が再生中かつセッションページ以外にいるとき、BottomNavの上に表示
// - タップするとセッションページに戻る
// - ×ボタンで再生停止

import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAudioStore } from "@/store/audioStore";

export default function NowPlayingBar() {
  const pathname    = usePathname();
  const router      = useRouter();
  const { audio, meta, stopAndClear } = useAudioStore();

  // 再生中でなければ表示しない
  if (!audio || !meta) return null;

  // セッションページ自身にいるときは表示しない
  const onSessionPage = pathname === meta.route;
  if (onSessionPage) return null;

  const handleTap = () => {
    router.push(meta.route);
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stopAndClear();
  };

  return (
    <AnimatePresence>
      <motion.div
        key="now-playing"
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 8, opacity: 0 }}
        transition={{ duration: 0.25 }}
        // BottomNav(h-16)の真上に配置
        className="fixed bottom-16 left-0 right-0 z-[55] px-4 pb-2"
      >
        <div
          onClick={handleTap}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && handleTap()}
          className="w-full flex items-center gap-3 px-4 py-3 bg-[#1a1a1c]/95 backdrop-blur-sm border border-white/10 rounded-xl cursor-pointer"
        >
          {/* 再生中インジケーター（3本のアニメーションバー） */}
          <div className="flex items-end gap-[3px] h-4 shrink-0">
            {[0, 0.2, 0.1].map((delay, i) => (
              <motion.span
                key={i}
                className="w-[3px] bg-[#a3a957]/80 rounded-full"
                animate={{ height: ["6px", "14px", "6px"] }}
                transition={{ duration: 0.8, repeat: Infinity, delay, ease: "easeInOut" }}
              />
            ))}
          </div>

          {/* ラベル */}
          <span className="flex-1 text-left text-[#e8e6e1]/70 text-xs font-light tracking-wider truncate">
            {meta.label}
          </span>

          {/* 戻るテキスト */}
          <span className="text-[#e8e6e1]/30 text-[10px] font-light tracking-wider shrink-0">
            戻る
          </span>

          {/* 停止ボタン */}
          <button
            onClick={handleStop}
            className="shrink-0 w-6 h-6 flex items-center justify-center text-[#e8e6e1]/30 hover:text-[#e8e6e1]/60 transition-colors"
            aria-label="停止"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <rect x="1" y="1" width="8" height="8" rx="1" fill="currentColor" />
            </svg>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
