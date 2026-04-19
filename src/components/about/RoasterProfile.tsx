"use client";

// 焙煎者プロフィール — Aboutページ下部に表示するE-E-A-T強化セクション

import Image from "next/image";
import { motion } from "framer-motion";

export default function RoasterProfile() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="border border-white/10 rounded-sm p-8 md:p-12 my-16 md:my-24"
      aria-labelledby="roaster-profile-heading"
    >
      {/* セクションラベル */}
      <p className="text-xs text-white/50 tracking-widest uppercase mb-8">
        ── 焙煎しているひと ──
      </p>

      <div className="flex flex-col md:flex-row md:items-start md:gap-12">
        {/* 顔写真 */}
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-white/20">
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
            className="text-2xl md:text-3xl font-medium mb-2 text-[#e8e6e1]"
          >
            マコ
          </h2>
          <p className="text-sm text-white/60 mb-8">
            灯台の珈琲焙煎所mumu
          </p>

          <div className="space-y-6 text-[#e8e6e1]/90 leading-loose text-[15px]">
            <p>
              自家焙煎珈琲豆のオンラインショップを運営しています。
            </p>

            <p>
              「感性が、ふと、戻ってくる」をコンセプトに
              珈琲豆の焙煎や、瞑想アプリの開発を行っています。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-white/20" aria-hidden="true" />
            </div>

            <p>
              焙煎は、
              <a
                href="https://aillio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >
                Aillio
              </a>
              という焙煎機で少量ずつ焙煎しています。
              取り扱っているのは、いまは
              <a
                href="/beans"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >
                エチオピア（浅煎り）とインドネシア（深煎り）
              </a>
              の2種類。
              初めての方にも気軽に試していただけるように「まず100gから」お届けしています。
            </p>

            <p>
              <a
                href="/app"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >
                アプリ
              </a>
              のほうは、Focus（集中）・Relax（リラックス）・Spark（発想）・Reclaim（振り返り）の
              4モード構成で、すべて無料・インストール不要で使えるようにしています。
            </p>

            <p className="text-white/75">
              最近、ドーパミン中毒だなあ...という方はぜひ使ってみてください。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-white/20" aria-hidden="true" />
            </div>

            <p>
              読んでくださって、ありがとうございます。
              豆のこと、アプリのこと、mumuのことについて、
              Instagram や note でも少しずつ綴っています。
              お気軽に覗いてみてください。
            </p>

            <p className="text-white/70 pt-2">
              — マコ
            </p>
          </div>

          {/* SNSリンク */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex gap-6 text-sm">
              <a
                href="https://www.instagram.com/mumu_coffee_roaster/"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-[#e8e6e1]/80 hover:text-[#EF9F27] transition"
              >
                Instagram →
              </a>
              <a
                href="https://note.com/mumu_coffee"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-[#e8e6e1]/80 hover:text-[#EF9F27] transition"
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
