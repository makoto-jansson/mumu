"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import BeanCard from "@/components/beans/BeanCard";
import beans from "@/data/coffeeInfo.json";

export default function BeansContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <Link
            href="/"
            className="text-[#e8e6e1]/40 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300 inline-flex items-center gap-2"
          >
            <span>←</span> ホームに戻る
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mb-20"
        >
          <p className="text-[#e8e6e1]/40 text-xs font-light tracking-[0.4em] mb-6">
            味わう
          </p>
          <h1 className="text-[#e8e6e1] text-2xl md:text-3xl font-light leading-loose tracking-wide">
            スペシャルティコーヒーを、
            <br />
            ていねいに焙煎しています。
          </h1>
        </motion.div>

        <div className="flex flex-col gap-6 mb-20">
          {beans.map((bean, index) => (
            <BeanCard key={bean.id} bean={bean} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="border-t border-white/10 pt-10"
        >
          <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed tracking-wide">
            1杯あたり約160円。全国送料一律（ゆうパケット）
          </p>
        </motion.div>

      </div>
    </div>
  );
}
