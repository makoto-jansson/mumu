"use client";

// セクション 01 「整える」（新デザイン 2026リニューアル）
// 2カラム: 左にアイコン+番号+見出し、右にタイトル+本文+CTA

import { motion } from "framer-motion";
import Link from "next/link";
import SectionBlock from "@/components/ui/SectionBlock";
import GradientBackground from "@/components/ui/GradientBackground";

// 細線イラスト: 夜明けの風景（縮小版、ink-primary 色に変更）
function IllustTools({ size = 52 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 0.7)}
      viewBox="0 0 80 56"
      fill="none"
      aria-hidden="true"
    >
      {/* 月 */}
      <circle cx="62" cy="11" r="5.5" stroke="#123656" strokeWidth="0.8" opacity="0.55" />
      <circle cx="64.5" cy="9.5" r="4.2" fill="#fdf8ef" />
      {/* 遠くの山のシルエット */}
      <path
        d="M0 36 L10 22 L18 30 L28 14 L38 26 L50 16 L62 28 L72 18 L80 24 L80 36 Z"
        stroke="#123656"
        strokeWidth="0.7"
        strokeLinejoin="round"
        opacity="0.3"
      />
      {/* 地平線 */}
      <line x1="0" y1="36" x2="80" y2="36" stroke="#123656" strokeWidth="0.6" opacity="0.45" />
      {/* 海の波 */}
      <path
        d="M0 40 C13 38 27 42 40 40 C53 38 67 42 80 40"
        stroke="#123656"
        strokeWidth="0.7"
        strokeLinecap="round"
        opacity="0.28"
      />
      <path
        d="M0 44 C10 42 22 46 38 44 C54 42 66 46 80 44"
        stroke="#123656"
        strokeWidth="0.6"
        strokeLinecap="round"
        opacity="0.18"
      />
    </svg>
  );
}

export default function ToolsSection() {
  return (
    <SectionBlock>
      <GradientBackground type="tools" />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative z-10 grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-10"
      >
        {/* 左カラム: 番号 + 見出し + イラスト（SPは中央寄せ、md以上は左寄せ） */}
        <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
          <p className="text-[10px] text-grad-teal tracking-[0.3em]">01</p>
          <h2
            className="font-mincho text-ink-primary font-medium"
            style={{ fontSize: "clamp(22px, 3vw, 26px)", letterSpacing: "0.01em" }}
          >
            整える
          </h2>
          <p className="font-serif italic text-[11px] text-ink-secondary tracking-[0.2em]">
            — integrate
          </p>
          <div className="mt-4">
            <IllustTools size={52} />
          </div>
        </div>

        {/* 右カラム: タイトル + 本文 + CTA（SPは中央寄せ、md以上は左寄せ） */}
        <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
          <h3
            className="font-mincho text-ink-primary font-medium leading-relaxed"
            style={{ fontSize: "clamp(17px, 2.5vw, 20px)" }}
          >
            集中。リラックス。クリエイティブ。
            <br />
            感性が回復する、アプリ。
          </h3>
          <p
            className="text-ink-secondary"
            style={{ fontSize: "13px", lineHeight: "2" }}
          >
            自分らしさを取り戻す、4つのモード。
          </p>
          <Link
            href="/app"
            className="group inline-flex items-center gap-2 text-ink-primary text-[11px] tracking-[0.25em] w-fit mt-2"
          >
            <span className="relative">
              アプリを使ってみる
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
