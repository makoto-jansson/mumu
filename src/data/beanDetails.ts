// 珈琲豆の補足データ（microCMS「beans」に無い項目をここで持つ）
//
// microCMS の beans には名前・焙煎度・価格・味の言葉しか無く、豆の詳細ページ（/beans/[slug]）に
// 必要な「URL用のslug」「産地情報」「おすすめの飲み方」「関連する読みもの」が足りない。
// 豆は3種と少ないので、スキーマを増やさずコード側で補う。キーは microCMS のコンテンツID。
//
// ★ 産地情報・飲み方は BASE の商品ページの記載（2026-11-25時点）を転記したもの。
//    推測で埋めないこと。記載が無い項目は書かない（ページ側で行ごと非表示になる）。

export type BeanDetail = {
  slug: string; // /beans/[slug] のURL
  origin: {
    country?: string; // 生産国
    region?: string; // 生産地
    farm?: string; // 農園・ウォッシングステーション
    variety?: string; // 品種
    process?: string; // 精製
  };
  howToEnjoy?: string; // おすすめの飲み方（BASE/microCMSに記載がある場合のみ）
  relatedColumns: string[]; // この豆に合う読みもの（/column/[id] のid）
};

export const BEAN_DETAILS: Record<string, BeanDetail> = {
  // エチオピア シダモ（浅煎り）
  f67_byqzi2l: {
    slug: "ethiopia-sidamo",
    origin: {
      country: "エチオピア",
      region: "シダモ県ベンサ（ボナズリア、セダカ）",
      farm: "ボナズリア・ウォッシングステーション",
      variety: "原生品種（Heirloom）",
      process: "ウォッシュド",
    },
    relatedColumns: ["ethiopia-coffee", "coffee-region-flavor-map", "roast-levels", "hand-drip-basics"],
  },
  // インドネシア マンデリン（BASEでの商品名は「マンデリン ポルン」・深煎り）
  "n_-lpl1l3-1w": {
    slug: "mandheling-polung",
    origin: {
      country: "インドネシア",
      region: "スマトラ ポルン地区",
      farm: "250 Smallholders",
      variety: "アテン、ティムティム",
      process: "スマトラ式",
    },
    howToEnjoy: "ミルクをいれて飲むのもおすすめです。",
    relatedColumns: ["mandheling-coffee", "coffee-milk-drinks", "coffee-bitterness-beans", "roast-levels"],
  },
  // インドネシア マンデリン トバコ（深煎り）
  // ★ BASEの商品ページ（items/147942086）が2026-11-25時点で404のため、産地の詳細は未転記
  "mandheling-tobako": {
    slug: "mandheling-tobako",
    origin: { country: "インドネシア" },
    howToEnjoy: "ミルクをいれて飲むのもおすすめです。",
    relatedColumns: ["mandheling-coffee", "coffee-milk-drinks", "coffee-bitterness-beans", "roast-levels"],
  },
};
