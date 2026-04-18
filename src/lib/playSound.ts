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

// バッファから即時再生（ジェスチャー内専用: suspended なら resume してから再生）
function playBufferGesture(path: string, volume = 1.0): void {
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

  // ジェスチャー内なので resume() を呼んでよい
  if (ctx.state === "suspended") {
    ctx.resume().then(fire).catch(console.error);
  } else {
    fire();
  }
}

// バッファから再生（useEffect 内専用: running のときだけ再生、suspended はスキップ）
// suspended 時に resume() を呼ぶと Promise が後で resolve してズレたタイミングで鳴る
function playBufferIfRunning(path: string, volume = 1.0): void {
  const ctx = getCtx();
  if (!ctx || ctx.state !== "running") return;

  const buf = _buffers.get(path);
  if (!buf) return;
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(0);
}

// ── 公開 API ──────────────────────────────────────────

export const preloadClick   = () => preloadBuffer("/sounds/clicksound.wav");
export const preloadZyunnbi = () => preloadBuffer("/sounds/zyunnbi.m4a");

// ジェスチャーハンドラから呼ぶ（ボタン・タップ等）
export const playClick = () => playBufferGesture("/sounds/clicksound.wav", 0.2625);

// useEffect から呼ぶ（直前のジェスチャーで resume が進行中の場合も考慮して少し待つ）
export function playZyunnbi(): void {
  const ctx = getCtx();
  if (!ctx) return;

  let cancelled = false;
  // 200ms 以内に鳴らなければキャンセル（ローラーピッカーズレ防止）
  const cancelTimer = setTimeout(() => { cancelled = true; }, 200);

  const fire = () => {
    if (cancelled) return;
    clearTimeout(cancelTimer);
    const buf = _buffers.get("/sounds/zyunnbi.m4a");
    if (!buf) return;
    const src  = ctx.createBufferSource();
    src.buffer = buf;
    const gain = ctx.createGain();
    gain.gain.value = 0.175;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
  };

  if (ctx.state === "running") {
    fire();
  } else {
    // 直前のボタンタップで resume() が呼ばれていれば 200ms 以内に完了する
    ctx.resume().then(fire).catch(() => { clearTimeout(cancelTimer); });
  }
}

// BGM・その他効果音（HTMLAudioElement）
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}
