// 記事末尾の「mumuの珈琲豆」ブロック
// 本文に豆カードが無い記事だけで表示する（あるかどうかの判定は /column/[id] 側で行う）。
// 見た目は本文内の豆カード（content/ の visual-style.md の型）にそろえ、
// 各カードはBASEのショップトップではなく、その豆の個別商品ページへ直接リンクする。

import Image from "next/image";
import type { Bean } from "@/lib/microcms";

// 「浅煎り / light roast」→「浅煎り」
const roastLabel = (roast: string) => roast.split("/")[0].trim();

// 記事→ショップ遷移をGA4のショップ側セッションで追えるようにUTMを付ける
// （本文リンクの addShopUtm と同じ体系。utm_content で末尾ブロック経由と区別する）
function withUtm(url: string, slug: string): string {
  const params = new URLSearchParams({
    utm_source: "mumucoffee-feel",
    utm_medium: "column",
    utm_campaign: slug,
    utm_content: "end-block",
  });
  return `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
}

export default function ColumnBeans({ beans, slug }: { beans: Bean[]; slug: string }) {
  if (beans.length === 0) return null;

  return (
    <section aria-labelledby="column-beans-heading" className="my-16">
      <h2
        id="column-beans-heading"
        className="font-mincho text-ink-primary text-lg tracking-wide mb-2"
      >
        mumuの珈琲豆
      </h2>
      <p className="text-ink-secondary/70 text-[13px] leading-relaxed mb-6">
        自家焙煎のスペシャルティコーヒーを100gから販売しています。購入はBASEのショップで行えます。
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {beans.map((bean) => (
          <a
            key={bean.id}
            href={withUtm(bean.shopUrl, slug)}
            target="_blank"
            rel="noopener"
            // SPは画像左・文字右の横並び（縦積みだと3枚で画面数枚分になるため）、sm以上は縦カード
            className="group flex sm:block overflow-hidden rounded-xl border border-ink-primary/20 bg-white transition-colors duration-300 hover:border-ink-primary/40"
          >
            {bean.image && (
              <div className="relative w-28 shrink-0 aspect-[5/7] border-r sm:w-auto sm:border-r-0 sm:border-b border-ink-primary/10 bg-white">
                <Image
                  src={bean.image.url}
                  alt={`${bean.name}の珈琲豆`}
                  fill
                  sizes="(max-width: 640px) 100vw, 220px"
                  className="object-contain"
                />
              </div>
            )}
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <strong className="text-ink-primary text-[15px] font-medium">{bean.name}</strong>
                <span className="rounded-full border border-ink-primary/30 px-2 text-[11px] text-ink-primary">
                  {roastLabel(bean.roast)}
                </span>
              </div>
              <p className="text-ink-secondary/80 text-[12.5px] leading-relaxed">{bean.flavor}</p>
              <p className="mt-2 text-ink-secondary/70 text-[12px]">
                {bean.weight} / ¥{bean.price.toLocaleString()}
              </p>
              <span className="mt-3 inline-block text-ink-primary text-[12.5px]">
                BASEで購入する →
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
