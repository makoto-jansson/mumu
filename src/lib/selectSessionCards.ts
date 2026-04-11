// 対比カード10枚選出ロジック
// 各layerから1枚ずつ（6枚）+ ランダム4枚、sensory→values順に提示

import cardsData from "@/data/reclaimCards.json";

export type ReclaimCard = {
  id: string;
  layer: "sensory" | "scene" | "tempo" | "relation" | "abstract" | "values";
  a: string;
  b: string;
  axis: string;
};

const LAYER_ORDER: Record<string, number> = {
  sensory: 0,
  scene: 1,
  tempo: 2,
  relation: 3,
  abstract: 4,
  values: 5,
};

export function selectSessionCards(): ReclaimCard[] {
  const allCards = cardsData.cards as ReclaimCard[];
  const layers = ["sensory", "scene", "tempo", "relation", "abstract", "values"];
  const selected: ReclaimCard[] = [];

  // 各layerから1枚ずつ = 6枚
  for (const layer of layers) {
    const pool = allCards.filter((c) => c.layer === layer);
    selected.push(pool[Math.floor(Math.random() * pool.length)]);
  }

  // 残り4枚をランダムlayerから追加（重複カードなし）
  const remaining = allCards.filter((c) => !selected.includes(c));
  for (let i = 0; i < 4; i++) {
    const idx = Math.floor(Math.random() * remaining.length);
    selected.push(remaining.splice(idx, 1)[0]);
  }

  // sensory→values 順にソート
  selected.sort((a, b) => LAYER_ORDER[a.layer] - LAYER_ORDER[b.layer]);

  return selected;
}
