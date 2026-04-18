"use client";

// ロールスクロール式の時間ピッカー（5分〜60分、5分刻み）
// ドラムロール風にスクロールして選択する

import { useRef, useEffect, useCallback } from "react";
import { playClick, preloadClick } from "@/lib/playSound";

const DEFAULT_OPTIONS = Array.from({ length: 12 }, (_, i) => (i + 1) * 5); // 5,10,...,60
const ITEM_HEIGHT = 44;
const VISIBLE = 5; // 表示する個数（中央が選択値）

type Props = {
  value: number;
  onChange: (val: number) => void;
  options?: number[];
  label?: string;
};

export default function RollerPicker({ value, onChange, options = DEFAULT_OPTIONS, label = "何分集中する？" }: Props) {
  const OPTIONS = options;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPlayedIndex = useRef(-1); // クリック音の二重防止用

  // 選択値→スクロール位置
  const valueToScroll = (v: number) => {
    const index = OPTIONS.indexOf(v);
    return index * ITEM_HEIGHT;
  };

  // スクロール位置→選択値（一番近いオプション）
  const scrollToValue = useCallback((scrollTop: number) => {
    const index = Math.round(scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(OPTIONS.length - 1, index));
    return OPTIONS[clamped];
  }, []);

  // 初期位置を設定 + クリック音をプリロード
  useEffect(() => {
    preloadClick();
    const el = containerRef.current;
    if (!el) return;
    el.scrollTop = valueToScroll(value);
    lastPlayedIndex.current = OPTIONS.indexOf(value);
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // スクロール中にアイテムが変わった瞬間に音を鳴らす（ジェスチャー直結）
  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    // アイテム境界を超えた瞬間に音を鳴らす
    const currentIndex = Math.round(el.scrollTop / ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(OPTIONS.length - 1, currentIndex));
    if (clamped !== lastPlayedIndex.current) {
      lastPlayedIndex.current = clamped;
      playClick();
    }

    // スクロール停止後にスナップ＆onChange
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      const newVal = scrollToValue(el.scrollTop);
      el.scrollTo({ top: valueToScroll(newVal), behavior: "smooth" });
      onChange(newVal);
    }, 80);
  }, [onChange, scrollToValue]);

  useEffect(() => {
    return () => {
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, []);

  // パディング（上下にVISIBLE/2個分の空白を入れて中央選択を実現）
  const pad = Math.floor(VISIBLE / 2);

  return (
    <div className="relative flex flex-col items-center w-[60%] mx-auto">
      <p className="text-[#e8e6e1]/50 text-xs font-light tracking-[0.3em] mb-3">
        {label}
      </p>

      {/* ローラー本体 */}
      <div className="relative bg-[#0a0a0a]/80 backdrop-blur-sm w-full" style={{ height: ITEM_HEIGHT * VISIBLE }}>
        {/* 選択中アイテムのハイライト */}
        <div
          className="absolute left-0 right-0 border-t border-b border-[#EF9F27]/30 bg-[#EF9F27]/5 pointer-events-none z-10"
          style={{
            top: pad * ITEM_HEIGHT,
            height: ITEM_HEIGHT,
          }}
        />

        {/* 上下のフェード */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none z-20" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none z-20" />

        {/* スクロールコンテナ */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll scrollbar-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {/* 上パディング */}
          {Array.from({ length: pad }).map((_, i) => (
            <div key={`top-${i}`} style={{ height: ITEM_HEIGHT }} />
          ))}

          {OPTIONS.map((opt) => (
            <div
              key={opt}
              style={{ height: ITEM_HEIGHT }}
              className="flex items-center justify-center cursor-pointer"
              onClick={() => {
                const el = containerRef.current;
                if (!el) return;
                el.scrollTo({ top: valueToScroll(opt), behavior: "smooth" });
                if (opt !== value) {
                  playClick();
                }
                onChange(opt);
              }}
            >
              <span className={`text-sm font-light tabular-nums tracking-wider transition-all duration-200 ${
                opt === value ? "text-[#EF9F27] text-base" : "text-[#e8e6e1]/30"
              }`}>
                {opt}<span className="text-xs ml-0.5">分</span>
              </span>
            </div>
          ))}

          {/* 下パディング */}
          {Array.from({ length: pad }).map((_, i) => (
            <div key={`bot-${i}`} style={{ height: ITEM_HEIGHT }} />
          ))}
        </div>
      </div>
    </div>
  );
}
