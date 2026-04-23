// セクション 02 「珈琲」（新デザイン 2026リニューアル）
// 上段: 2カラムヘッダー（アイコン側 + 文言側）
// 下段: 豆カード横スクロール（microCMS連携維持）

import Link from "next/link";
import Image from "next/image";
import { client, type Bean } from "@/libs/microcms";
import SectionBlock from "@/components/ui/SectionBlock";
import GradientBackground from "@/components/ui/GradientBackground";

// コンパクトな豆カード（TOP用・新デザイン）
function BeanCardCompact({ bean }: { bean: Bean }) {
  return (
    <a
      href={bean.shopUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col w-[190px] shrink-0 bg-base/55 border border-ink-primary/25 rounded-lg overflow-hidden hover:border-ink-primary/45 transition-colors duration-300"
    >
      {/* 画像 */}
      {bean.image ? (
        <div className="relative w-full aspect-[2/3] overflow-hidden">
          <Image
            src={bean.image.url}
            alt={bean.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="190px"
          />
        </div>
      ) : (
        <div className="w-full aspect-[2/3] bg-ink-primary/5" />
      )}

      {/* テキスト */}
      <div className="px-3 py-2.5 flex flex-col gap-0.5">
        <p className="font-serif italic text-xs text-ink-primary leading-tight">
          {bean.name}
        </p>
        <p className="text-[9px] text-ink-secondary tracking-[0.15em] uppercase mt-0.5">
          {bean.roast}
        </p>
        <p className="text-[10px] text-ink-secondary truncate">{bean.flavor}</p>
        <p className="text-[11px] text-ink-primary tabular-nums mt-1">
          ¥{bean.price.toLocaleString()}
        </p>
      </div>
    </a>
  );
}

// 「coming soon」プレースホルダーカード
function ComingSoonCard() {
  return (
    <div
      className="flex flex-col items-center justify-center w-[190px] shrink-0 aspect-[2/3] rounded-lg"
      style={{ border: "0.5px dashed rgba(18, 54, 86, 0.3)" }}
      aria-label="次回入荷予定"
    >
      <p className="font-serif italic text-sm text-ink-secondary/70">
        coming soon
      </p>
      <p className="text-[9px] text-ink-secondary/60 tracking-[0.3em] mt-2">
        NEXT RELEASE
      </p>
    </div>
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
    // エチオピアを先頭に表示（それ以外は取得順を維持）
    beans.sort((a, b) => {
      const aIsEthiopia = a.name.includes("エチオピア") ? -1 : 0;
      const bIsEthiopia = b.name.includes("エチオピア") ? -1 : 0;
      return aIsEthiopia - bIsEthiopia;
    });
  } catch {
    beans = [];
  }

  return (
    <SectionBlock>
      <GradientBackground type="beans" />
      <div className="relative z-10">
        {/* ヘッダー2カラム */}
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-10 mb-8">
          {/* 左カラム: 番号 + 見出し（SPは中央寄せ、md以上は左寄せ） */}
          <div className="flex flex-col gap-3 items-center md:items-start text-center md:text-left">
            <p className="text-[10px] text-grad-teal tracking-[0.3em]">02</p>
            <h2
              className="font-mincho text-ink-primary font-medium"
              style={{ fontSize: "clamp(22px, 3vw, 26px)", letterSpacing: "0.01em" }}
            >
              珈琲
            </h2>
            <p className="font-serif italic text-[11px] text-ink-secondary tracking-[0.2em]">
              — coffee
            </p>
          </div>

          {/* 右カラム: タイトル + 本文（SPは中央寄せ、md以上は左寄せ） */}
          <div className="flex flex-col gap-4 items-center md:items-start text-center md:text-left">
            <h3
              className="font-mincho text-ink-primary font-medium leading-relaxed"
              style={{ fontSize: "clamp(17px, 2.5vw, 20px)" }}
            >
              灯台の珈琲焙煎所mumu
              <br />
              朝、夕、夜をコンセプトにした自家焙煎の珈琲豆ショップ
            </h3>
            <p
              className="text-ink-secondary"
              style={{ fontSize: "13px", lineHeight: "2" }}
            >
              浅煎りから深煎りまで、そのときどきの一杯を。
            </p>
          </div>
        </div>

        {/* 豆カード横スクロール */}
        <div className="-mx-6 md:-mx-10 px-6 md:px-10 overflow-x-auto scrollbar-none">
          <div className="flex gap-3 w-max pb-1">
            {beans.map((bean) => (
              <BeanCardCompact key={bean.id} bean={bean} />
            ))}
            <ComingSoonCard />
          </div>
        </div>

        {/* すべての豆を見る */}
        <div className="flex justify-end mt-5">
          <Link
            href="/beans"
            className="group inline-flex items-center gap-2 text-ink-primary text-[11px] tracking-[0.25em]"
          >
            <span className="relative">
              すべての豆を見る
              <span className="absolute -bottom-1 left-0 w-full h-px bg-ink-primary/40 group-hover:bg-accent-lime transition-colors duration-300" />
            </span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </SectionBlock>
  );
}
