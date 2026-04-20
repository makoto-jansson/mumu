"use client";

// 焙煎者プロフィール — Aboutページ下部に表示するE-E-A-T強化セクション
// 2026リニューアル: ライトテーマに対応

import Image from "next/image";
import { motion } from "framer-motion";

export default function RoasterProfile() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="border border-ink-primary/15 rounded-[16px] p-8 md:p-12 my-16 md:my-24"
      aria-labelledby="roaster-profile-heading"
    >
      {/* セクションラベル */}
      <p className="font-serif italic text-xs text-ink-secondary tracking-widest mb-8">
        ── 焙煎しているひと ──
      </p>

      <div className="flex flex-col md:flex-row md:items-start md:gap-12">
        {/* 顔写真 */}
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-ink-primary/20">
            <Image
              src="/profile.jpg"
              alt="灯台の珈琲焙煎所mumu 焙煎者 マコ"
              fill
              sizes="(max-width: 768px) 160px, 192px"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>

        {/* テキスト */}
        <div className="flex-1">
          <h2
            id="roaster-profile-heading"
            className="text-2xl md:text-3xl font-light mb-2 text-ink-primary"
          >
            マコ
          </h2>
          <p className="text-sm text-ink-secondary mb-8">
            灯台の珈琲焙煎所mumu
          </p>

          <div className="space-y-6 text-ink-secondary leading-loose text-[15px]">
            <p>
              自家焙煎珈琲豆のオンラインショップを運営しています。
            </p>

            <p>
              「感性が、ふと、戻ってくる」をコンセプトに
              珈琲豆の焙煎や、瞑想アプリの開発を行っています。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-ink-primary/20" aria-hidden="true" />
            </div>

            <p>
              焙煎は、Aillioという焙煎機で少量ずつ焙煎しています。
              取り扱っているのは、いまは
              <a
                href="https://mumucoffee.theshop.jp/items/127027333"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline decoration-accent-lime/60 underline-offset-4 hover:decoration-accent-lime transition"
              >
                エチオピア（浅煎り）
              </a>
              と
              <a
                href="https://mumucoffee.theshop.jp/items/127225149"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-primary underline decoration-accent-lime/60 underline-offset-4 hover:decoration-accent-lime transition"
              >
                インドネシア（深煎り）
              </a>
              の2種類。
              初めての方にも気軽に試していただけるように「まず100gから」お届けしています。
            </p>

            <p>
              <a
                href="/app"
                className="text-ink-primary underline decoration-accent-lime/60 underline-offset-4 hover:decoration-accent-lime transition"
              >
                アプリ
              </a>
              のほうは、Focus（集中）・Relax（リラックス）・Spark（発想）・Reclaim（振り返り）の
              4モード構成で、すべて無料・インストール不要で使えるようにしています。
            </p>

            <p className="text-ink-secondary/85">
              最近、ドーパミン中毒だなあ...という方はぜひ使ってみてください。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-ink-primary/20" aria-hidden="true" />
            </div>

            <p>
              読んでくださって、ありがとうございます。
              豆のこと、アプリのこと、mumuのことについて、
              Instagram や note でも少しずつ綴っています。
              お気軽に覗いてみてください。
            </p>

            <p className="font-serif italic text-ink-secondary pt-2">
              — マコ
            </p>
          </div>

          {/* SNSリンク */}
          <div className="mt-10 pt-8 border-t border-ink-primary/15">
            <div className="flex gap-6 text-sm">
              <a
                href="https://www.instagram.com/mumu_coffee_roaster/"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-ink-primary hover:text-grad-teal transition"
              >
                Instagram →
              </a>
              <a
                href="https://note.com/mumu_coffee"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-ink-primary hover:text-grad-teal transition"
              >
                note →
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
