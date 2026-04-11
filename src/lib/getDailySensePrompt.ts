// Sense プロンプト選出ロジック
// 日付ハッシュで五感カテゴリを1つ固定 → カテゴリ内からランダム1問

import senseData from "@/data/reclaimSensePrompts.json";

export type SensePrompt = {
  id: string;
  prompt: string;
  hint: string;
};

export type SenseCategory = {
  id: string;
  label: string;
  icon: string;
  instruction: string;
  selectedPrompt: SensePrompt;
};

export function getDailySensePrompt(hasCoffee: boolean): SenseCategory {
  const senses = senseData.senses;

  // 日付ハッシュで五感カテゴリを決定（毎日異なる感覚チャンネル）
  const today = new Date();
  const dayIndex =
    (today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()) %
    senses.length;
  const category = senses[dayIndex];

  // 珈琲あり/なしで問いプールを切り替え
  const pool = hasCoffee ? category.withCoffee : category.withoutCoffee;
  const prompt = pool[Math.floor(Math.random() * pool.length)] as SensePrompt;

  return {
    id: category.id,
    label: category.label,
    icon: category.icon,
    instruction: category.instruction,
    selectedPrompt: prompt,
  };
}
