"use client";

// 珈琲豆カードコンポーネント
// 豆の情報を受け取り、BASEの商品ページへ誘導するカードを表示する

import { motion } from "framer-motion";

type Bean = {
  id: string;
  name: string;
  roast: string;
  weight: string;
  price: number;
  pricePerCup: string;
  flavor: string;
  description: string;
  shopUrl: string;
};

export default function BeanCard({ bean, index }: { bean: Bean; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
      className="border border-white/10 p-8 md:p-10"
    >
      {/* 豆の名前・焙煎度・重量 */}
      <div className="flex flex-col gap-2 mb-6">
        <h2 className="text-[#e8e6e1] text-xl md:text-2xl font-light tracking-wide">
          {bean.name}
        </h2>
        <p className="text-[#e8e6e1]/50 text-sm font-light tracking-wider">
          {bean.roast} / {bean.weight} / ¥{bean.price.toLocaleString()}
        </p>
      </div>

      {/* フレーバー */}
      <p className="text-[#EF9F27]/80 text-sm font-light tracking-wider mb-4">
        {bean.flavor}
      </p>

      {/* 説明文 */}
      <p className="text-[#e8e6e1]/60 text-sm font-light leading-relaxed mb-8">
        {bean.description}
      </p>

      {/* BASEへのリンク */}
      <a
        href={bean.shopUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-[#e8e6e1]/60 text-sm font-light tracking-wider group hover:text-[#e8e6e1] transition-colors duration-300 relative"
      >
        ショップで見る
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
      </a>
    </motion.div>
  );
}
