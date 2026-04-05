import pairings from "@/data/pairings.json";
import type { RelaxConfig } from "@/components/relax/RelaxSetup";

// ─── 型 ───────────────────────────────────────────
export type TimeOfDay = "morning" | "afternoon" | "evening";
export type Season    = "spring"  | "summer"    | "autumn" | "winter";

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

// ─── 季節判定（月 1〜12）──────────────────────────
// spring: 3〜5 / summer: 6〜8 / autumn: 9〜11 / winter: 12・1・2
export function getSeason(now = new Date()): Season {
  const m = now.getMonth() + 1; // 1〜12
  if (m >= 3 && m <= 5)  return "spring";
  if (m >= 6 && m <= 8)  return "summer";
  if (m >= 9 && m <= 11) return "autumn";
  return "winter";
}

// ─── ペアリング取得 ────────────────────────────────
export function getPairing(
  mood:    RelaxConfig["mood"],
  time?:   TimeOfDay,
  season?: Season,
): Pairing {
  const t = time   ?? getTimeOfDay();
  const s = season ?? getSeason();
  return (pairings[MOOD_KEY[mood]] as Record<string, Record<string, Pairing>>)[t][s];
}
