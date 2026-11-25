// BASE の個別商品ページへの購入ボタン（豆の一覧・詳細で共通）
// 外部サイトへ移ることが分かる文言にし、販売していない豆はボタンの代わりに案内を出す。

import { shopUrlWithUtm, type BeanView } from "@/lib/beans";

export default function BuyButton({
  bean,
  medium,
  campaign,
  content,
  size = "md",
}: {
  bean: BeanView;
  medium: string;
  campaign: string;
  content: string;
  size?: "md" | "lg";
}) {
  if (!bean.onSale) {
    return (
      <p className="text-ink-secondary/70 text-[13px]">
        ただいま販売をお休みしています。
      </p>
    );
  }
  const pad = size === "lg" ? "px-7 py-3.5 text-[15px]" : "px-5 py-2.5 text-[13px]";
  return (
    <a
      href={shopUrlWithUtm(bean.shopUrl, { medium, campaign, content })}
      target="_blank"
      rel="noopener"
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-ink-primary text-white tracking-wider transition-opacity duration-300 hover:opacity-85 ${pad}`}
    >
      BASEで購入する
      <span aria-hidden="true">↗</span>
    </a>
  );
}
