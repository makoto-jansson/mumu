"use client";

// Aboutページのコンテンツ（クライアントコンポーネント）
// Framer Motion を使うため "use client" が必要

import { motion } from "framer-motion";
import Link from "next/link";
import RoasterProfile from "@/components/about/RoasterProfile";

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
              灯台の珈琲焙煎所mumu（ムーム）は「感性が、ふと、戻ってくるような瞬間を届ける」をコンセプトに珈琲豆を焙煎しています。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              主にスペシャルティコーヒーと呼ばれる、品質にこだわった個性豊かな珈琲豆を取り扱っており、個性のあるフレーバーと優しい甘さのある味づくりを目指しています。
              <br />
              浅煎り〜深煎りまでございます。
            </p>
          </FadeBlock>

          {/* 区切り */}
          <FadeBlock>
            <p className="text-center text-[#e8e6e1]/30 tracking-[0.5em]">・・・・・・</p>
          </FadeBlock>

          <FadeBlock>
            <p>
              目まぐるしく変化の激しい世の中で、私たちは、気付けば目の前のことに流され、振り回されてばかりです。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              いつの間にか、好きだった映画や音楽を楽しむ余裕すらなくなり、好きでもないアプリゲームやショート動画を眺めてしまう...。
              <br />
              私含めそんな人がとても増えているように感じます。
            </p>
          </FadeBlock>

          {/* 区切り */}
          <FadeBlock>
            <p className="text-center text-[#e8e6e1]/30 tracking-[0.5em]">・・・・・・</p>
          </FadeBlock>

          <FadeBlock>
            <p>
              そんな毎日に抗って、自分の「好き」を取り戻そうとしてみても、渦に吸い寄せらせるように、またすぐアプリを開いてしまう...。
              <br />
              そしてこんなハズではなかったのに...。
              <br />
              と少し落ち込む。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              いっそのことスマホを捨てて山奥で暮らそう...なんて考えもよぎりますが、そんな度胸もありません。
              <br />
              忙しない現代を生きていく上で、これはもう仕方のないコトのように感じます。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              でも、こうして葛藤しながら、自分と社会を見つめるコト自体が、現代で自分を取り戻す唯一の方法のような気がしています。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              たまには珈琲でも飲みながらぼーっとしてみてください。
              <br />
              珈琲って、ゆっくり味わうといろんな味がするんだなあ...と、じわじわ感性が戻ってきます。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              そんな風に、疲れて何もできない毎日が続いていたとしても、ムームの珈琲が「感性を取り戻すきっかけ」を作れたらいいなと思っております。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p>
              灯台の珈琲焙煎所mumu（ムーム）は、感性が、ふと、戻ってくる瞬間を、珈琲を中心にお届けいたします。
            </p>
          </FadeBlock>
          <FadeBlock>
            <p className="text-[#e8e6e1]/40 text-sm tracking-wider">
              灯台の珈琲焙煎所 mumu
            </p>
          </FadeBlock>
        </div>

        {/* 焙煎者プロフィール */}
        <RoasterProfile />

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
