"use client";

// セクション 04 「mumuについて」（新デザイン 2026リニューアル）
// 中央寄せ1カラム（他3セクションと違い、max-w-440 の詩的レイアウト）

import { motion } from "framer-motion";
import Link from "next/link";
import SectionBlock from "@/components/ui/SectionBlock";
import GradientBackground from "@/components/ui/GradientBackground";

// 細線イラスト: 灯台（ink-primary線 + 屋根と光はライム差し色）
function IllustAbout({ size = 46 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.35)}
      viewBox="0 0 80 56"
      fill="none"
      aria-hidden="true"
    >
      {/* 灯台の塔 */}
      <path
        d="M36 44 L38 14 L42 14 L44 44 Z"
        stroke="#123656"
        strokeWidth="0.9"
        strokeLinejoin="round"
        opacity="0.65"
      />
      {/* 灯台の灯室 */}
      <rect x="37" y="10" width="6" height="5" rx="0.5" stroke="#a3a957" strokeWidth="0.9" opacity="0.9" fill="#a3a957" fillOpacity="0.35" />
      {/* 灯室の光源 */}
      <circle cx="40" cy="12.5" r="1.3" fill="#a3a957" opacity="0.9" />
      {/* 灯台の基部 */}
      <path d="M32 44 L48 44" stroke="#123656" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      {/* 光線（左） */}
      <path d="M37 12 L8 28" stroke="#a3a957" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
      <path d="M37 12 L12 22" stroke="#a3a957" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
      {/* 光線（右） */}
      <path d="M43 12 L72 28" stroke="#a3a957" strokeWidth="0.6" strokeLinecap="round" opacity="0.45" />
      <path d="M43 12 L68 22" stroke="#a3a957" strokeWidth="0.5" strokeLinecap="round" opacity="0.25" />
      {/* 地平線 */}
      <line x1="0" y1="44" x2="80" y2="44" stroke="#123656" strokeWidth="0.7" opacity="0.45" />
      {/* 海の波 */}
      <path
        d="M0 48 C13 46 27 50 40 48 C53 46 67 50 80 48"
        stroke="#2c6671"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M0 52 C10 50 25 54 45 52 C60 50 70 53 80 52"
        stroke="#2c6671"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.32"
      />
    </svg>
  );
}

export default function AboutSection() {
  return (
    <SectionBlock>
      <GradientBackground type="about" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 max-w-[440px] mx-auto text-center flex flex-col items-center gap-4"
      >
        <p className="text-[10px] text-grad-teal tracking-[0.3em]">04</p>
        <h2
          className="font-mincho text-ink-primary font-medium"
          style={{ fontSize: "clamp(18px, 2.5vw, 19px)", letterSpacing: "0.01em" }}
        >
          mumuについて
        </h2>
        <IllustAbout size={46} />

        {/* 詩的引用 */}
        <p
          className="font-mincho text-ink-primary font-medium leading-relaxed mt-3"
          style={{ fontSize: "clamp(17px, 2.5vw, 20px)" }}
        >
          灯台のように、
          <br />
          静かに光をともすこと。
        </p>

        <p
          className="text-ink-secondary mt-1"
          style={{ fontSize: "12px", lineHeight: "2" }}
        >
          忙しい日々のなかで、ふと自分に戻るための場所でありたくて。
        </p>

        <Link
          href="/about"
          className="group inline-flex items-center gap-2 text-ink-primary text-[11px] tracking-[0.25em] mt-4"
        >
          <span className="relative">
            ストーリーを読む
            <span className="absolute -bottom-1 left-0 w-full h-px bg-ink-primary/40 group-hover:bg-accent-lime transition-colors duration-300" />
          </span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </Link>
      </motion.div>
    </SectionBlock>
  );
}
