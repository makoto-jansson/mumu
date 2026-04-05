// localStorage ラッパー
// - SSR セーフ（typeof window チェック）
// - JSON シリアライズ / デシリアライズ
// - タイムスタンプ付きエンベロープで 90 日自動削除に対応

const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;

type Envelope<T> = { value: T; savedAt: number };

export function storageGet<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as Envelope<T>;
    // 90 日超過は自動削除
    if (Date.now() - envelope.savedAt > NINETY_DAYS_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return envelope.value;
  } catch {
    return null;
  }
}

export function storageSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    const envelope: Envelope<T> = { value, savedAt: Date.now() };
    localStorage.setItem(key, JSON.stringify(envelope));
  } catch {
    // QuotaExceededError 等は無視
  }
}

export function storageRemove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}
