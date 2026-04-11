// 「珈琲」セクション — 豆カードをTOPに横並び表示
// Server Component（microCMSからデータ取得）

import Link from "next/link";
import Image from "next/image";
import { client, type Bean } from "@/libs/microcms";


// コンパクトな豆カード（TOP用）
function BeanCardCompact({ bean }: { bean: Bean }) {
  return (
    <a
      href={bean.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col border border-white/10 hover:border-white/25 transition-colors duration-300 w-48 shrink-0"
    >
      {/* 画像 */}
      {bean.image ? (
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <Image
            src={bean.image.url}
            alt={bean.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="192px"
          />
        </div>
      ) : (
        <div className="w-full aspect-square bg-white/4" />
      )}

      {/* テキスト */}
      <div className="p-3 flex flex-col gap-1">
        <p className="text-[#EF9F27]/70 text-[10px] font-light tracking-wide">
          {bean.flavor}
        </p>
        <p className="text-[#e8e6e1]/40 text-[10px] font-light mt-1 group-hover:text-[#e8e6e1]/60 transition-colors duration-200">
          ¥{bean.price.toLocaleString()} →
        </p>
      </div>
    </a>
  );
}

export default async function BeansSection() {
  let beans: Bean[] = [];
  try {
    const data = await client.getList<Bean>({
      endpoint: "beans",
      queries: { limit: 10 },
    });
    beans = data.contents;
  } catch {
    beans = [];
  }

  return (
    <section className="py-20 px-5 bg-[#0c0c0c]">
      <div className="max-w-sm mx-auto md:max-w-2xl">
        <p className="text-[#e8e6e1]/30 text-[10px] font-light tracking-[0.45em] mb-6">
          ── 珈琲 ──
        </p>

        <div className="flex flex-col gap-1.5 mb-6">
          <h2 className="text-[#e8e6e1]/70 text-[10px] font-light tracking-[0.45em]">
            珈琲豆のオンラインショップ
          </h2>
          <p className="text-[#e8e6e1]/35 text-[10px] font-light tracking-[0.2em]">
            浅煎り〜深煎りまで、スペシャルティコーヒーをご用意しています。
          </p>
        </div>

        <div className="border border-white/8 bg-[#0e0e0e]">

          {/* 豆カード横スクロール */}
          {beans.length > 0 && (
            <div className="px-6 pt-5 pb-6 overflow-x-auto">
              <div className="flex gap-3 w-max">
                {beans.map((bean) => (
                  <BeanCardCompact key={bean.id} bean={bean} />
                ))}
              </div>
            </div>
          )}

          <div className="px-6 pb-6 flex items-center justify-between">
            <Link
              href="/beans"
              className="flex items-center gap-1.5 text-[#EF9F27]/60 text-xs font-light tracking-wider hover:text-[#EF9F27] transition-colors duration-300"
            >
              すべて見る
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
