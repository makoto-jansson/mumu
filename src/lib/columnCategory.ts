// 読みもの（コラム）のカテゴリ判定 — microCMS にカテゴリ項目が無いため、slug からサイト側で分類する。
// 未知の slug は「基礎」に入れて必ず表示されるようにする。

export type ColumnCategory = "basics" | "origins" | "reading";

const ORIGINS = new Set([
  "ethiopia-coffee", "mandheling-coffee", "brazil-coffee", "colombia-coffee",
  "guatemala-coffee", "kenya-coffee", "geisha-coffee", "tanzania-coffee",
  "blue-mountain-coffee", "coffee-belt", "coffee-region-flavor-map", "coffee-varieties",
  "costa-rica-coffee", "panama-coffee",
]);

export function categoryOf(id: string): ColumnCategory {
  if (ORIGINS.has(id)) return "origins";
  return "basics";
}

// カードに出す欧文ラベル（Figma: Origin / Basics）
export const CATEGORY_LABEL: Record<ColumnCategory, string> = {
  basics: "Basics",
  origins: "Origin",
  reading: "Reading",
};
