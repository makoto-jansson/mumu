// 読みもの（SEOコラム）一覧 /column
// 指示書:「灯台守の日誌(=/journal, ブランドの一人称の声)」とは別コンテンツ。
// 検索流入用の記事を同一ドメイン配下 /column/ に置く。microCMS「columns」を参照。

import type { Metadata } from "next";
import Link from "next/link";
import SiteChromeV2 from "@/components/home-v2/SiteChromeV2";
import { getAllColumns, formatPostDate } from "@/lib/microcms";

const BASE_URL = "https://mumucoffee-feel.com";

export const metadata: Metadata = {
  title: "読みもの",
  description:
    "珈琲とデジタルウェルビーイングにまつわる読みもの。灯台の珈琲焙煎所mumuのコラム。",
  openGraph: {
    title: "読みもの | 灯台の珈琲焙煎所mumu",
    description: "珈琲とデジタルウェルビーイングにまつわる読みもの。",
    url: `${BASE_URL}/column`,
  },
  alternates: { canonical: `${BASE_URL}/column` },
};

// 記事追加をすぐ反映（60秒ごと再検証）
export const revalidate = 60;

export default async function ColumnPage() {
  const posts = await getAllColumns();

  return (
    <SiteChromeV2>
      <div className="min-h-screen pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          {/* ホームに戻る */}
          <div className="mb-16">
            <Link
              href="/"
              className="text-ink-secondary/70 text-sm font-light tracking-wider hover:text-ink-primary transition-colors duration-300 inline-flex items-center gap-2"
            >
              <span>←</span> ホームに戻る
            </Link>
          </div>

          {/* ページ見出し */}
          <div className="mb-20">
            <p className="font-serif italic text-ink-secondary text-[11px] tracking-[0.2em] mb-6">
              — column
            </p>
            <h1 className="font-mincho text-ink-primary text-2xl md:text-3xl font-medium leading-loose tracking-wide">
              珈琲と、感性をめぐる読みもの。
            </h1>
          </div>

          {/* 記事一覧 or 準備中 */}
          <div className="border-t border-ink-primary/15">
            {posts.length > 0 ? (
              <div className="mb-16">
                {posts.map((p) => (
                  <Link
                    key={p.id}
                    href={`/column/${p.id}`}
                    className="block py-7 border-b border-ink-primary/15 hover:bg-ink-primary/[0.03] transition-colors duration-300"
                  >
                    <p className="text-ink-secondary/60 text-[11px] tracking-[0.2em]">
                      {formatPostDate(p.publishedAt)}
                    </p>
                    <p className="font-mincho text-ink-primary text-lg mt-1.5 leading-relaxed">
                      {p.title}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="pt-16">
                <p className="text-ink-secondary text-sm font-light leading-relaxed mb-2">
                  ただいま準備中です。
                </p>
                <p className="text-ink-secondary/80 text-sm font-light leading-relaxed">
                  珈琲やデジタルウェルビーイングにまつわる読みものを、これから少しずつ綴っていきます。
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </SiteChromeV2>
  );
}
