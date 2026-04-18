"use client";

// 効果音再生ユーティリティ
// クリック音・準備音楽は Web Audio API（AudioBuffer）を使用 → iOS含む全デバイスで低遅延

let _ctx: AudioContext | null = null;

// サウンドバッファキャッシュ
const _buffers: Map<string, AudioBuffer> = new Map();
const _loading:  Map<string, Promise<void>> = new Map();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    // Safari (iOS) は webkitAudioContext
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _ctx = new AC();
  }
  return _ctx;
}

// 指定パスの音声を Web Audio API 用にフェッチ＆デコードして保持
function preloadBuffer(path: string): void {
  if (typeof window === "undefined") return;
  if (_buffers.has(path) || _loading.has(path)) return;

  const ctx = getCtx();
  if (!ctx) return;

  const p = fetch(path)
    .then(r => r.arrayBuffer())
    .then(buf => ctx.decodeAudioData(buf))
    .then(decoded => { _buffers.set(path, decoded); })
    .catch(() => {});
  _loading.set(path, p);
}

// バッファから再生（AudioContext が suspended なら resume してから）
function playBuffer(path: string, volume = 1.0): void {
  const ctx = getCtx();
  if (!ctx) return;

  const fire = () => {
    const buf = _buffers.get(path);
    if (!buf) return;
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
  };

  if (ctx.state === "suspended") {
    ctx.resume().then(fire).catch(console.error);
  } else {
    fire();
  }
}

// ── 公開 API ──────────────────────────────────────────

export const preloadClick   = () => preloadBuffer("/sounds/clicksound.wav");
export const preloadZyunnbi = () => preloadBuffer("/sounds/zyunnbi.m4a");

export const playClick   = () => playBuffer("/sounds/clicksound.wav", 0.2625);
export const playZyunnbi = () => playBuffer("/sounds/zyunnbi.m4a", 0.175);

// BGM・その他効果音（HTMLAudioElement）
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}
