"use client";

// 効果音再生ユーティリティ
// クリック音は Web Audio API（AudioBuffer）を使用 → iOS含む全デバイスで低遅延

let _ctx: AudioContext | null = null;
let _clickBuffer: AudioBuffer | null = null;
let _loadPromise: Promise<void> | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!_ctx) {
    // Safari (iOS) は webkitAudioContext
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _ctx = new AC();
  }
  return _ctx;
}

// アプリ起動時にフェッチ＆デコードしてバッファを保持
export function preloadClick(): void {
  if (typeof window === "undefined") return;
  if (_clickBuffer || _loadPromise) return;

  const ctx = getCtx();
  if (!ctx) return;

  _loadPromise = fetch("/sounds/clicksound.wav")
    .then(r => r.arrayBuffer())
    .then(buf => ctx.decodeAudioData(buf))
    .then(decoded => { _clickBuffer = decoded; })
    .catch(() => {});
}

export function playClick(): void {
  const ctx = getCtx();
  if (!ctx) return;

  const fire = () => {
    if (!_clickBuffer) return;
    const src  = ctx.createBufferSource();
    src.buffer = _clickBuffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.2625;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
  };

  // iOS は最初 suspended 状態 → ユーザージェスチャー内で resume してから再生
  if (ctx.state === "suspended") {
    ctx.resume().then(fire).catch(console.error);
  } else {
    fire();
  }
}

// BGM・その他の効果音（HTMLAudioElement）
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}
