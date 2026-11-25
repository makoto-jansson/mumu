// 珈琲豆の表示用データ（microCMS beans ＋ 補足データ ＋ BASEでの販売状況）
// /beans・/beans/[slug]・記事末尾の豆ブロックが共通で使う。サーバー専用。

import { getBeans, type Bean } from "@/lib/microcms";
import { BEAN_DETAILS, type BeanDetail } from "@/data/beanDetails";

export type BeanView = Bean & {
  slug: string;
  detail?: BeanDetail;
  roastShort: string; // 「浅煎り / light roast」→「浅煎り」
  roastKind: "light" | "dark" | "other";
  onSale: boolean; // BASEの商品ページが存在するか
};

// BASE の商品ページが存在するかを確認する。
// microCMS に登録済みでも、BASE 側で非公開・削除にすると商品ページは 404 になる
// （2026-11-25 に「マンデリン トバコ」で実際に発生し、記事の豆ブロックが404へリンクしていた）。
// 404 のときだけ「販売していない」と判断し、429（レート制限）や通信失敗は販売中とみなす
// （一時的なエラーで売り物を隠してしまう方が損が大きいため）。
// HEAD は BASE に 429 で弾かれるので GET を使い、1時間キャッシュする。
async function isOnBase(shopUrl: string): Promise<boolean> {
  try {
    const res = await fetch(shopUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; mumucoffee-feel site check)" },
      next: { revalidate: 3600 },
    });
    return res.status !== 404;
  } catch {
    return true;
  }
}

function roastKind(roast: string): BeanView["roastKind"] {
  if (roast.includes("浅")) return "light";
  if (roast.includes("深")) return "dark";
  return "other";
}

// 全豆を表示用に整形して返す。並び順は 浅煎り → 深煎り（味の地図の左から右）
export async function getBeanViews(): Promise<BeanView[]> {
  const beans = await getBeans();
  const views = await Promise.all(
    beans.map(async (b): Promise<BeanView> => {
      const detail = BEAN_DETAILS[b.id];
      return {
        ...b,
        slug: detail?.slug ?? b.id,
        detail,
        roastShort: b.roast.split("/")[0].trim(),
        roastKind: roastKind(b.roast),
        onSale: await isOnBase(b.shopUrl),
      };
    })
  );
  const order = { light: 0, other: 1, dark: 2 };
  return views.sort((a, b) => order[a.roastKind] - order[b.roastKind]);
}

export async function getBeanBySlug(slug: string): Promise<BeanView | null> {
  const views = await getBeanViews();
  return views.find((v) => v.slug === slug) ?? null;
}

// BASE へのリンクに UTM を付ける（GA4のショップ側セッションで流入元を追うため）。
// medium=どのページ種別から / campaign=どのページから / content=どのリンクから
export function shopUrlWithUtm(
  url: string,
  { medium, campaign, content }: { medium: string; campaign: string; content: string }
): string {
  const params = new URLSearchParams({
    utm_source: "mumucoffee-feel",
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: content,
  });
  return `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`;
}
