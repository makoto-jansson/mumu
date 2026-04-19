"use client";

// 珈琲豆カードコンポーネント
// レイアウト: 左=画像、右=テキスト（横並び）
// カード全体がBASEの商品ページへのリンク

import { motion } from "framer-motion";
import Image from "next/image";
import type { Bean } from "@/libs/microcms";

export default function BeanCard({ bean, index }: { bean: Bean; index: number }) {
  return (
    <motion.a
      href={bean.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="group flex flex-col md:flex-row border border-black/10 hover:border-black/25 transition-colors duration-300 cursor-pointer"
    >
      {/* 左: 商品画像 */}
      {bean.image && (
        <div className="relative w-full aspect-[2/3] md:w-64 md:aspect-[2/3] shrink-0 overflow-hidden">
          <Image
            src={bean.image.url}
            alt={bean.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 208px, 288px"
          />
        </div>
      )}

      {/* 右: テキスト情報 */}
      <div className="flex flex-col justify-between p-6 md:p-8 flex-1 min-w-0">
        <div>
          {/* 豆の名前・焙煎度・価格 */}
          <h2 className="text-[#1a1a1a] text-lg md:text-xl font-light tracking-wide mb-1">
            {bean.name}
          </h2>
          <p className="text-[#1a1a1a]/50 text-xs font-light tracking-wider mb-4">
            {bean.roast} / {bean.weight} / ¥{bean.price.toLocaleString()}
          </p>

          {/* フレーバー */}
          <p className="text-[#EF9F27] text-xs font-light tracking-wider mb-3">
            {bean.flavor}
          </p>

          {/* 説明文 */}
          <p className="text-[#1a1a1a]/60 text-sm font-light leading-relaxed">
            {bean.description}
          </p>
        </div>

        {/* ショップへのリンク表示 */}
        <p className="mt-6 inline-flex items-center gap-1 text-[#1a1a1a]/40 text-xs font-light tracking-wider group-hover:text-[#1a1a1a]/70 transition-colors duration-300">
          ショップで見る
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </p>
      </div>
    </motion.a>
  );
}
