import prompts from "@/data/sensoryPrompts.json";

/**
 * 日付（年・月・日）をシードにして、その日固定のプロンプトを返す。
 * 日付が変わると自動的に次のプロンプトへ進む。
 */
export function getDailyPrompt(): string {
  const now = new Date();
  const seed =
    now.getFullYear() * 10000 +
    (now.getMonth() + 1) * 100 +
    now.getDate();
  const index = seed % prompts.length;
  return prompts[index];
}
