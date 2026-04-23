"use client";

// セクション 03 「読む」（新デザイン 2026リニューアル）
// 2カラム: 左にアイコン+番号+見出し、右にタイトル+本文+CTA

import { motion } from "framer-motion";
import Link from "next/link";
import SectionBlock from "@/components/ui/SectionBlock";
import GradientBackground from "@/components/ui/GradientBackground";

// 細線イラスト: 開いた本と月（縮小版、ink-primary色）
function IllustJournal({ size = 52 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.7)}
      viewBox="0 0 80 56"
      fill="none"
      aria-hidden="true"
    >
      {/* 月 */}
      <circle cx="68" cy="10" r="5" stroke="#123656" strokeWidth="0.7" opacity="0.5" />
      <circle cx="70" cy="8.5" r="3.8" fill="#fdf8ef" />
      {/* 本の背表紙 */}
      <line
        x1="40"
        y1="20"
        x2="40"
        y2="50"
        stroke="#123656"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* 左ページ */}
      <path
        d="M40 20 C30 22 18 20 12 24 L12 50 C18 46 30 48 40 50 Z"
        stroke="#123656"
        strokeWidth="0.7"
        strokeLinejoin="round"
        opacity="0.4"
      />
      <line x1="18" y1="30" x2="36" y2="29" stroke="#123656" strokeWidth="0.5" strokeLinecap="round" opacity="0.3" />
      <line x1="17" y1="34" x2="35" y2="33" stroke="#123656" strokeWidth="0.5" strokeLinecap="round" opacity="0.22" />
      <line x1="18" y1="38" x2="32" y2="37" stroke="#123656" strokeWidth="0.5" strokeLinecap="round" opacity="0.18" />
      {/* 右ページ */}
      <path
        d="M40 20 C50 22 62 20 68 24 L68 50 C62 46 50 48 40 50 Z"
        stroke="#123656"
        strokeWidth="0.7"
        strokeLinejoin="round"
        opacity="0.35"
      />
      <line x1="44" y1="30" x2="62" y2="29" stroke="#123656" strokeWidth="0.5" strokeLinecap="round" opacity="0.28" />
      <line x1="45" y1="34" x2="63" y2="33" stroke="#123656" strokeWidth="0.5" strokeLinecap="round" opacity="0.2" />
    </svg>
  );
}

export default function JournalSection() {
  return (
    <SectionBlock>
      <GradientBackground type="journal" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-10"
      >
        {/* 左カラム: 番号 + 見出し + イラスト（SPは中央寄せ、md以上は左寄せ） */}
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <p className="text-[10px] text-grad-teal tracking-[0.3em]">03</p>
          <h2
            className="font-mincho text-ink-primary font-medium"
            style={{ fontSize: "clamp(22px, 3vw, 26px)", letterSpacing: "0.01em" }}
          >
            読む
          </h2>
          <p className="font-serif italic text-[11px] text-ink-secondary tracking-[0.2em]">
            — read
          </p>
          <div className="mt-4 md:-ml-2">
            <IllustJournal size={52} />
          </div>
        </div>

        {/* 右カラム: タイトル + 本文 + CTA（SPは中央寄せ、md以上は左寄せ） */}
        <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <h3
            className="font-mincho text-ink-primary font-medium leading-relaxed"
            style={{ fontSize: "clamp(17px, 2.5vw, 20px)" }}
          >
            ちいさな読み物。
          </h3>
          <p
            className="text-ink-secondary"
            style={{ fontSize: "13px", lineHeight: "2" }}
          >
            珈琲の記録。
          </p>
          <Link
            href="/journal"
            className="group inline-flex items-center gap-2 text-ink-primary text-[11px] tracking-[0.25em] w-fit mt-2"
          >
            <span className="relative">
              読み物を見る
              <span className="absolute -bottom-1 left-0 w-full h-px bg-ink-primary/40 group-hover:bg-accent-lime transition-colors duration-300" />
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </motion.div>
    </SectionBlock>
  );
}
