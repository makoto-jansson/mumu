"use client";

// 珈琲豆カードコンポーネント
// レイアウト: 最上部に商品名（全幅の見出し）→ 下段に 画像(左) + 詳細テキスト(右)
// カード全体がBASEの商品ページへのリンク
// フェードインはCSS（.bean-card-in）で実装＝JS未読込でも確実に表示される

import Image from "next/image";
import type { Bean } from "@/libs/microcms";

export default function BeanCard({ bean, index }: { bean: Bean; index: number }) {
  return (
    <a
      href={bean.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      // CSSアニメーションを段階的に開始（hydration非依存）
      style={{ animationDelay: `${index * 0.08}s` }}
      className="bean-card-in group flex flex-col gap-4 p-4 md:p-5 rounded-2xl border border-ink-primary/12 bg-white/40 hover:border-ink-primary/25 hover:shadow-[0_6px_30px_rgba(18,54,86,0.07)] transition-colors duration-500"
    >
      {/* 商品名（カード最上部・全幅の見出し） */}
      <h2 className="font-mincho text-ink-primary text-base md:text-lg font-medium tracking-wide border-b border-ink-primary/10 pb-3">
        {bean.name}
      </h2>

      {/* 下段: 画像 + 詳細テキスト */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* 左: 商品画像（角丸・余白をもって配置） */}
        {bean.image && (
          <div className="relative w-full aspect-[2/3] md:w-40 md:aspect-[2/3] shrink-0 self-start overflow-hidden rounded-xl">
            <Image
              src={bean.image.url}
              alt={bean.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          </div>
        )}

        {/* 右: 詳細テキスト */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            {/* 焙煎度 / 内容量 / 価格 */}
            <p className="text-ink-secondary/50 text-[11px] font-light tracking-wider mb-3">
              {bean.roast} / {bean.weight} / ¥{bean.price.toLocaleString()}
            </p>

            {/* フレーバー（深緑インクの差し色） */}
            <p className="text-ink-primary/80 text-[11px] font-light tracking-wider mb-2.5">
              {bean.flavor}
            </p>

            {/* 説明文 */}
            <p className="text-ink-secondary/70 text-xs font-light leading-relaxed whitespace-pre-line">
              {bean.description}
            </p>
          </div>

          {/* ショップへのリンク表示 */}
          <p className="mt-5 inline-flex items-center gap-1 text-ink-secondary/40 text-[11px] font-light tracking-wider group-hover:text-ink-primary/80 transition-colors duration-300">
            ショップで見る
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </p>
        </div>
      </div>
    </a>
  );
}
