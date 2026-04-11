// 珈琲豆ページ
// microCMSからデータを取得してBeanCardで表示する（Server Component）

import type { Metadata } from "next";
import Link from "next/link";
import { client, type Bean } from "@/libs/microcms";
import BeanCard from "@/components/beans/BeanCard";

export const metadata: Metadata = {
  title: "珈琲豆",
  description:
    "スペシャルティコーヒーをていねいに焙煎。エチオピア シダモ（浅煎り）、インドネシア マンデリン（深煎り）をお届けします。",
  openGraph: {
    title: "珈琲豆 | 灯台の珈琲焙煎所mumu",
    description: "スペシャルティコーヒーをていねいに焙煎しています。",
    url: "https://mumucoffee-feel.com/beans",
  },
};

// microCMSのデータは更新したら即反映させたいので revalidate = 0（キャッシュしない）
export const revalidate = 0;

export default async function BeansPage() {
  // microCMSの「beans」エンドポイントから全商品を取得
  const data = await client.getList<Bean>({
    endpoint: "beans",
    queries: { limit: 100 },
  });

  const beans = data.contents;

  return (
    <div className="min-h-screen bg-[#0a0a0a] pt-32 pb-24 px-6">
      <div className="max-w-2xl mx-auto">

        {/* ホームに戻るリンク */}
        <div className="mb-16">
          <Link
            href="/"
            className="text-[#e8e6e1]/40 text-sm font-light tracking-wider hover:text-[#e8e6e1] transition-colors duration-300 inline-flex items-center gap-2"
          >
            <span>←</span> ホームに戻る
          </Link>
        </div>

        {/* ページタイトル */}
        <div className="mb-20">
          <p className="text-[#e8e6e1]/40 text-xs font-light tracking-[0.4em] mb-6">
            珈琲
          </p>
          <h1 className="text-[#e8e6e1] text-2xl md:text-3xl font-light leading-loose tracking-wide">
            スペシャルティコーヒーを、
            <br />
            ていねいに焙煎しています。
          </h1>
        </div>

        {/* 豆のカード一覧（microCMSのデータから自動生成） */}
        {beans.length > 0 ? (
          <div className="flex flex-col gap-6 mb-20">
            {beans.map((bean, index) => (
              <BeanCard key={bean.id} bean={bean} index={index} />
            ))}
          </div>
        ) : (
          // データがない場合のフォールバック
          <div className="border-t border-white/10 pt-16 mb-20">
            <p className="text-[#e8e6e1]/40 text-sm font-light">
              現在準備中です。しばらくお待ちください。
            </p>
          </div>
        )}

        {/* 補足情報 */}
        <div className="border-t border-white/10 pt-10">
          <p className="text-[#e8e6e1]/40 text-sm font-light leading-relaxed tracking-wide">
            1杯あたり約160円。全国送料一律（ゆうパケット）
          </p>
        </div>

      </div>
    </div>
  );
}
