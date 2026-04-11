// 「珈琲」セクション — 豆カードをTOPに横並び表示
// Server Component（microCMSからデータ取得）

import Link from "next/link";
import Image from "next/image";
import { client, type Bean } from "@/libs/microcms";

// 細線イラスト: カップ + 湯気 + 豆
function IllustBeans() {
  return (
    <svg width="80" height="56" viewBox="0 0 80 56" fill="none">
      <ellipse cx="12" cy="38" rx="5" ry="7" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.35" transform="rotate(-15 12 38)" />
      <path d="M9 33 C12 38 9 43 12 45" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.25" transform="rotate(-15 12 38)" />
      <path d="M28 30 L30 50 L52 50 L54 30 Z" stroke="#e8e6e1" strokeWidth="0.8" strokeLinejoin="round" opacity="0.45" />
      <line x1="27" y1="30" x2="55" y2="30" stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.45" />
      <path d="M54 36 C60 36 62 42 56 44" stroke="#e8e6e1" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
      <path d="M23 52 C26 50 56 50 59 52" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
      <path d="M36 26 C36 22 38 20 37 16" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.3" />
      <path d="M41 24 C41 20 43 18 42 13" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
      <path d="M46 26 C46 22 48 20 47 16" stroke="#e8e6e1" strokeWidth="0.7" strokeLinecap="round" opacity="0.16" />
      <ellipse cx="68" cy="36" rx="5" ry="7" stroke="#e8e6e1" strokeWidth="0.7" opacity="0.3" transform="rotate(20 68 36)" />
      <path d="M65 31 C68 36 65 41 68 43" stroke="#e8e6e1" strokeWidth="0.6" strokeLinecap="round" opacity="0.2" transform="rotate(20 68 36)" />
      <line x1="0" y1="52" x2="80" y2="52" stroke="#e8e6e1" strokeWidth="0.5" opacity="0.1" />
    </svg>
  );
}

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
        <div className="relative w-full aspect-square overflow-hidden">
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
        <p className="text-[#e8e6e1]/80 text-xs font-light tracking-wide leading-snug">
          {bean.name}
        </p>
        <p className="text-[#e8e6e1]/35 text-[10px] font-light">
          {bean.roast}
        </p>
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

        <div className="border border-white/8 bg-[#0e0e0e]">
          <div className="px-6 md:px-12 pt-8 pb-6 flex flex-col md:flex-row md:items-center md:gap-10 gap-5">
            <div className="shrink-0 md:w-28 flex justify-start">
              <IllustBeans />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[#e8e6e1]/85 text-xl font-light leading-relaxed tracking-wide">
                珈琲豆の<br />
                オンラインショップ
              </h2>
              <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed">
                浅煎り〜深煎りまで、<br />スペシャルティコーヒーをご用意しています。
              </p>
            </div>
          </div>

          {/* 豆カード横スクロール */}
          {beans.length > 0 && (
            <div className="px-6 pb-6 overflow-x-auto">
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
