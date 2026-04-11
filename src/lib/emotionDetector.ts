// 感情判定：キーワードマッチングで泡の色を決める

export type Emotion = "warm" | "melancholy" | "fear" | "anger" | "calm" | "neutral";

export type EmotionResult = {
  emotion: Emotion;
  intensity: number; // 0–1
  secondary?: Emotion; // 矛盾キーワード（暖×寒）があるとき
};

const KEYWORD_MAP: Record<Exclude<Emotion, "neutral">, string[]> = {
  warm: [
    "温かい", "懐かし", "嬉し", "楽し", "好き", "愛", "幸せ", "笑",
    "喜", "ありがとう", "素敵", "可愛", "うれし", "たのし", "あたたか",
    "光", "明るい", "輝", "照", "ぽかぽか", "ほっこり", "甘い",
  ],
  melancholy: [
    "寂し", "切ない", "悲し", "泣", "涙", "恋し", "孤独", "会いたい",
    "かなし", "さびし", "別れ", "消え", "遠く", "もう", "また",
    "名残", "忘れ", "なつかし",
  ],
  fear: [
    "怖い", "不安", "心配", "恐", "怯え", "暗い", "怖", "こわ",
    "震え", "おそろし", "迷子", "逃げ", "失う", "壊れ", "怯",
  ],
  anger: [
    "怒り", "腹立", "むかつ", "イライラ", "嫌い", "憎", "衝動",
    "爆発", "いらいら", "怒", "腹", "くだらな", "許せな",
  ],
  calm: [
    "静か", "穏やか", "落ち着", "ゆっくり", "平和", "安らか",
    "のんびり", "おだやか", "安心", "休", "ゆったり", "深呼吸",
    "静寂", "凪", "澄",
  ],
};

// 色定義
export const EMOTION_COLORS: Record<Emotion, { bg: string; border: string; glow: string; label: string }> = {
  warm:       { bg: "rgba(239,159,39,",  border: "rgba(239,159,39,",  glow: "rgba(239,159,39,",  label: "琥珀" },
  melancholy: { bg: "rgba(83,74,183,",   border: "rgba(83,74,183,",   glow: "rgba(83,74,183,",   label: "藍" },
  fear:       { bg: "rgba(38,33,92,",    border: "rgba(38,33,92,",    glow: "rgba(100,90,180,",  label: "深紫" },
  anger:      { bg: "rgba(216,90,48,",   border: "rgba(216,90,48,",   glow: "rgba(216,90,48,",   label: "珊瑚" },
  calm:       { bg: "rgba(29,158,117,",  border: "rgba(29,158,117,",  glow: "rgba(29,158,117,",  label: "水色" },
  neutral:    { bg: "rgba(241,239,232,", border: "rgba(200,195,185,", glow: "rgba(200,195,185,", label: "乳白" },
};

export function detectEmotion(text: string): EmotionResult {
  if (!text.trim()) return { emotion: "neutral", intensity: 0 };

  const counts: Record<string, number> = {};
  for (const [emotion, keywords] of Object.entries(KEYWORD_MAP)) {
    counts[emotion] = keywords.filter((kw) => text.includes(kw)).length;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (total === 0) return { emotion: "neutral", intensity: 0.3 };

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const [topEmotion, topCount] = sorted[0];
  const [secondEmotion, secondCount] = sorted[1];

  const intensity = Math.min(topCount / 3, 1);

  // 矛盾判定（暖色+寒色が同数）
  const warmGroup = ["warm", "anger"];
  const coolGroup = ["melancholy", "fear", "calm"];
  const topIsWarm = warmGroup.includes(topEmotion);
  const secondIsWarm = warmGroup.includes(secondEmotion);
  if (
    secondCount > 0 &&
    topCount === secondCount &&
    topIsWarm !== secondIsWarm
  ) {
    return {
      emotion: topEmotion as Emotion,
      intensity: 0.7,
      secondary: secondEmotion as Emotion,
    };
  }

  return { emotion: topEmotion as Emotion, intensity };
}

// 融合タイプの判定
export type FusionType = "conflict" | "deepen" | "transform";

export function getFusionType(emotionA: Emotion, emotionB: Emotion): FusionType {
  if (emotionA === "neutral" || emotionB === "neutral") return "transform";
  const warmGroup = ["warm", "anger"];
  const aIsWarm = warmGroup.includes(emotionA);
  const bIsWarm = warmGroup.includes(emotionB);
  if (aIsWarm !== bIsWarm) return "conflict";
  if (emotionA === emotionB) return "deepen";
  return "deepen";
}
