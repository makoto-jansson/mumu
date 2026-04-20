"use client";

// トップページ ヒーローセクション（新デザイン 2026リニューアル）
// - SectionBlock（max-w-820 + rounded-18）+ GradientBackground で枠組み
// - 写真スライダー: 複数枚をフェード切替（自動進行 6秒間隔、ドットで手動切替可能）
// - Cormorant Garamond（セリフ体イタリック）でブランド名を装飾

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import SectionBlock from "@/components/ui/SectionBlock";
import GradientBackground from "@/components/ui/GradientBackground";

// スライダーの写真定義（Phase 3 で差し替え想定の仮写真）
const PHOTOS = [
  { src: "/artur-aldyrkhanov-iiEYa6q4huE-unsplash.jpg", caption: "harbor, quiet · 2025" },
  { src: "/tanya-barrow-570mLbTb3AI-unsplash.jpg", caption: "lighthouse, dawn · 2025" },
  { src: "/1213x809x2.jpg", caption: "coastline, morning · 2025" },
  { src: "/krisjanis-kazaks-p7Z4JrsXu0s-unsplash.jpg", caption: "hills, dusk · 2025" },
  { src: "/tanya-prodaan-WtX3dF8xL3s-unsplash.jpg", caption: "window, light · 2025" },
  { src: "/caleb-toranzo-24eTb4WhyiI-unsplash.jpg", caption: "roastery, steam · 2025" },
] as const;

export default function HeroSection() {
  const [index, setIndex] = useState(0);

  // 自動進行（6秒間隔）: index を依存にして毎切替ごとにタイマーを貼り直し
  // （HMR で古いクロージャが残って 1枚目⇔2枚目だけループする問題を回避）
  useEffect(() => {
    const id = setTimeout(() => {
      setIndex((index + 1) % PHOTOS.length);
    }, 6000);
    return () => clearTimeout(id);
  }, [index]);

  const current = PHOTOS[index];
  return (
    <SectionBlock minHeight="460px">
      {/* 背景グラデーション + フィルムグレイン */}
      <GradientBackground type="hero" />

      {/* コンテンツ（z-10 で前面） */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="relative z-10"
      >
        {/* 上部: mumu ロゴ + ナビ */}
        <div className="flex items-center justify-between mb-10 md:mb-16">
          <p
            className="font-serif italic text-ink-primary"
            style={{ fontSize: "22.5px", letterSpacing: "-0.03em" }}
          >
            mumu
          </p>
          <nav className="hidden md:flex items-center gap-7 text-[13px] text-ink-secondary tracking-[0.15em]">
            <a href="/app">整える</a>
            <a href="/beans">珈琲</a>
            <a href="/journal">読む</a>
            <a href="/about">mumuについて</a>
          </nav>
        </div>

        {/* キャッチコピー */}
        <h1
          className="font-mincho text-ink-primary font-medium leading-[1.4] mb-8 md:mb-10"
          style={{ fontSize: "clamp(26px, 4vw, 34px)", letterSpacing: "0.01em" }}
        >
          感性が、ふと、
          <br />
          戻ってくる場所。
        </h1>

        {/* 写真スライダー */}
        <div className="mx-auto max-w-[364px] mb-3">
          <div
            className="relative aspect-[3/2] rounded-[3px] overflow-hidden bg-ink-primary/10"
            aria-label="写真スライダー"
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={current.src}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={current.caption}
                  fill
                  sizes="(max-width: 768px) 100vw, 364px"
                  className="object-cover"
                  priority={index === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
          {/* キャプション + インジケーター */}
          <div className="flex items-center justify-between mt-2">
            <p className="font-serif italic text-[10px] text-ink-secondary/75">
              {current.caption}
            </p>
            <div className="flex items-center gap-1.5">
              {PHOTOS.map((photo, i) => (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`写真 ${i + 1} を表示`}
                  className={`w-[5px] h-[5px] rounded-full transition-colors duration-300 ${
                    i === index ? "bg-ink-primary" : "bg-ink-primary/25 hover:bg-ink-primary/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 下部: 左=ブランドバッジ / 右=ロゴ＋vol.01 縦積み */}
        <div className="flex items-end justify-between mt-10 md:mt-14">
          <div className="flex items-center gap-2">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-lime" />
            <p className="text-[10px] text-ink-primary tracking-[0.25em]">
              LIGHTHOUSE COFFEE ROASTERY
            </p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Image
              src="/rogomain.png"
              alt="灯台の珈琲焙煎所 mumu"
              width={90}
              height={90}
              priority
              className="w-[90px] h-[90px] object-contain"
            />
            <p className="font-serif italic text-[9px] text-ink-secondary tracking-[0.3em]">
              — vol. 01, spring —
            </p>
          </div>
        </div>
      </motion.div>
    </SectionBlock>
  );
}
