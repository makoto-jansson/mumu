import pairings from "@/data/pairings.json";
import type { RelaxConfig } from "@/components/relax/RelaxSetup";

// ─── 型 ───────────────────────────────────────────
export type TimeOfDay = "morning" | "afternoon" | "evening";

export type Pairing = {
  music: { title: string; artist: string; spotifyUrl: string };
  snack: string;
};

// 気分を JSON キーにマッピング
const MOOD_KEY: Record<RelaxConfig["mood"], keyof typeof pairings> = {
  "疲れた":       "tired",
  "もやもや":     "foggy",
  "ぼんやりしたい": "dreamy",
};

// ─── 時間帯判定（時 0〜23）─────────────────────────
// morning:   5〜11
// afternoon: 12〜17
// evening:   18〜4（翌朝含む）
export function getTimeOfDay(now = new Date()): TimeOfDay {
  const h = now.getHours();
  if (h >= 5  && h <= 11) return "morning";
  if (h >= 12 && h <= 17) return "afternoon";
  return "evening";
}

// ─── ペアリング取得（気分×時間帯のプールからランダム選択）────
export function getPairing(
  mood: RelaxConfig["mood"],
  time?: TimeOfDay,
): Pairing {
  const t = time ?? getTimeOfDay();
  const pool = (pairings[MOOD_KEY[mood]] as Record<string, Pairing[]>)[t];
  return pool[Math.floor(Math.random() * pool.length)];
}
