// 記事末尾の関連記事レコメンド（カード型）
// columns は category を持たないため、現在の記事を除いた最新の他記事を最大3件表示する。
// サーバーコンポーネント（microCMSから一覧を取得）。

import Link from "next/link";
import Image from "next/image";
import { getAllColumns, formatPostDate } from "@/lib/microcms";

export default async function RelatedColumns({
  currentId,
}: {
  currentId: string;
}) {
  const all = await getAllColumns();
  const related = all.filter((p) => p.id !== currentId).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section aria-labelledby="related-columns-heading" className="my-16 md:my-24">
      <p className="font-serif italic text-xs text-ink-secondary tracking-widest mb-8">
        ── こちらもどうぞ ──
      </p>
      <h2 id="related-columns-heading" className="sr-only">
        関連する読みもの
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {related.map((p) => (
          <Link
            key={p.id}
            href={`/column/${p.id}`}
            className="group block overflow-hidden rounded-[14px] border border-ink-primary/15 transition-colors duration-300 hover:border-ink-primary/30 hover:bg-ink-primary/[0.02]"
          >
            {/* サムネイル（eyecatch があれば画像、無ければブランドの淡いプレースホルダ） */}
            {p.eyecatch ? (
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={p.eyecatch.url}
                  alt={p.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 336px"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center bg-ink-primary/[0.04]">
                <span className="font-serif italic text-sm text-ink-secondary/45">
                  mumu
                </span>
              </div>
            )}

            <div className="p-5">
              <p className="text-[11px] tracking-[0.2em] text-ink-secondary/60">
                {formatPostDate(p.publishedAt)}
              </p>
              <p className="mt-2 line-clamp-2 font-mincho text-[15px] leading-relaxed text-ink-primary">
                {p.title}
              </p>
              <span className="mt-4 inline-block text-xs tracking-wider text-ink-primary">
                読む →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
