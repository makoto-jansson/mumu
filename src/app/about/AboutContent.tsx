"use client";

// Aboutページのコンテンツ（クライアントコンポーネント）
// Framer Motion を使うため "use client" が必要

import { motion } from "framer-motion";
import Link from "next/link";

function FadeBlock({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* ホームに戻るリンク */}
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

        {/* キャッチコピー */}
        <FadeBlock delay={0.1}>
          <h1 className="text-[#e8e6e1] text-3xl md:text-4xl font-light leading-loose tracking-wide mb-24">
            感性が、ふと、
            <br />
            戻ってくるような珈琲を
            <br />
            届けたい。
          </h1>
        </FadeBlock>

        {/* ストーリー本文 */}
        <div className="flex flex-col gap-10 text-[#e8e6e1]/70 text-base font-light leading-[2] mb-24">
          <FadeBlock>
            <p>
              目まぐるしく変化の激しい世の中で、私たちは、気付けば目の前のことに流され、振り回されてばかりです。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              仕事、人間関係、情報の波。やるべきことは山積みで、感じたいことを感じる暇もない。そんな日々の中で、ふと「あれ、最近何も感じていないな」と気づく瞬間があります。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              mumuは、そんな現代の"鈍くなっていく感性"に抗うために生まれました。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              珈琲を淹れる、その一滴一滴の時間。豆を挽く音、湯気の香り、カップを包む温もり。それはほんの数分間のことかもしれないけれど、その小さなひとときが、少しだけ自分に戻るきっかけになる。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              私たちが目指しているのは、「世界一おいしい珈琲」ではありません。あなたの感性が、ふと戻ってくるような、そんな一杯です。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              灯台は、暗い海の中で方向を示す存在です。mumuの珈琲が、忙しい日常の中で感性を取り戻すための、小さな灯台になれたら幸いです。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p className="text-[#e8e6e1]/40 text-sm tracking-wider">
              灯台の珈琲焙煎所 mumu
            </p>
          </FadeBlock>
        </div>

        {/* 下部リンク */}
        <FadeBlock>
          <div className="flex flex-col gap-6 pt-10 border-t border-white/10">
            <Link
              href="/beans"
              className="inline-flex items-center gap-2 text-[#e8e6e1]/60 text-sm font-light tracking-wider group hover:text-[#e8e6e1] transition-colors duration-300 relative w-fit"
            >
              珈琲豆を見る
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              href="/journal"
              className="inline-flex items-center gap-2 text-[#e8e6e1]/60 text-sm font-light tracking-wider group hover:text-[#e8e6e1] transition-colors duration-300 relative w-fit"
            >
              読み物を見る
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#EF9F27] group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </FadeBlock>

      </div>
    </div>
  );
}
