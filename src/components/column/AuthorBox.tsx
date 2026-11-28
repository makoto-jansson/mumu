// 書いた人 — 記事の下に置く短いプロフィール（E-E-A-T）。Figma「PC｜読みもの記事」の「書いた人」
// 文は珈琲の話だけに絞る（2026-11-28 ユーザー判断：音楽制作・アプリの話は記事の下では出さない）。
// 中身はサイトにある事実だけで組んでいる（Aillioで少しずつ焙煎＝プロフィール、小さな焙煎機＝トップの「mumuについて」）。
// 勝手に書き足さないこと。
// 左の絵は灯台の丸窓（線画の色は変えない）。

import Link from "next/link";
import LighthouseWindow from "@/components/site/LighthouseWindow";
import site from "@/components/site/site.module.css";
import a from "./article.module.css";

export default function AuthorBox() {
  return (
    <section className={a.author} aria-labelledby="author-title">
      <div className={`${site.wrap} ${a.authorInner}`}>
        <LighthouseWindow size={200} className={a.authorWindow} />
        <div className={a.authorText}>
          <p className={`${site.label} ${a.authorLabel}`} aria-hidden="true">
            Written by
          </p>
          <h2 id="author-title" className={a.authorName}>
            <span className={site.srOnly}>この記事を書いた人　</span>
            マコ
            <span className={a.authorRole}>灯台の珈琲焙煎所 mumu 焙煎者</span>
          </h2>
          <p className={a.authorBio}>
            自家焙煎珈琲豆のオンラインショップを運営しています。Aillioという小さな焙煎機で、少しずつ豆を焙煎しています。
          </p>
          <Link href="/about" className={site.textLink}>
            焙煎所と焙煎者のこと <span className={site.arrow} aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
