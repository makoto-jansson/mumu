"use client";

// 効果音再生ユーティリティ
// クリック音・準備音楽は Web Audio API（AudioBuffer）を使用 → iOS含む全デバイスで低遅延

let _ctx: AudioContext | null = null;

// サウンドバッファキャッシュ
const _buffers: Map<string, AudioBuffer> = new Map();
const _loading:  Map<string, Promise<void>> = new Map();

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // closed 状態（ページ非表示→復帰等）は再生成
  if (_ctx && _ctx.state === "closed") {
    _ctx = null;
    _buffers.clear(); // 旧コンテキストのバッファは使えないため破棄
    _loading.clear();
  }
  if (!_ctx) {
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

// AudioBuffer を即時再生するコア処理
function fireBuffer(ctx: AudioContext, buf: AudioBuffer, volume: number): void {
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(0);
}

// ── ジェスチャーハンドラ専用（ボタン・タップ等）──────────────────────────
// suspended なら resume() を呼んでよい
// バッファ未ロードの場合はロード完了まで待って再生
function playBufferGesture(path: string, volume = 1.0): void {
  const ctx = getCtx();
  if (!ctx) return;

  // ジェスチャー内: suspended なら resume（失敗しても継続）
  if (ctx.state === "suspended") {
    ctx.resume().catch(console.error);
  }

  const play = (buf: AudioBuffer) => {
    if (ctx.state === "running") {
      fireBuffer(ctx, buf, volume);
      return;
    }
    // resume 完了を statechange で待つ（安全のため 1 秒後にリスナー破棄）
    const handler = () => {
      if (ctx.state === "running") {
        ctx.removeEventListener("statechange", handler);
        fireBuffer(ctx, buf, volume);
      }
    };
    const tid = setTimeout(() => ctx.removeEventListener("statechange", handler), 1000);
    ctx.addEventListener("statechange", () => {
      clearTimeout(tid);
      handler();
    });
  };

  const buf = _buffers.get(path);
  if (buf) {
    play(buf);
    return;
  }

  // バッファ未ロード: ロード完了後に再生（ジェスチャー内なので多少遅れても可）
  const loadingP = _loading.get(path);
  if (!loadingP) return;
  loadingP.then(() => {
    const b = _buffers.get(path);
    if (b) play(b);
  }).catch(() => {});
}

// ── 公開 API ──────────────────────────────────────────

export const preloadClick   = () => preloadBuffer("/sounds/clicksound.wav");
export const preloadZyunnbi = () => preloadBuffer("/sounds/zyunnbi.m4a");

// ジェスチャーハンドラから呼ぶ（ボタン・タップ等）
export const playClick = () => playBufferGesture("/sounds/clicksound.wav", 0.2625);

// useEffect から呼ぶ（準備ページ表示時に鳴らす）
// モバイル対応:
//   - AudioContext が suspended の場合は statechange を監視して running になったら再生
//     （ナビゲーションボタンのタップで resume が進行中のはずなので resume() は呼ばない）
//   - バッファがまだロード中の場合もロード完了後に再生を試みる
//   - 600ms 以内に再生できなければキャンセル（遅れすぎた場合に鳴らさない）
export function playZyunnbi(): void {
  const ctx = getCtx();
  if (!ctx) return;

  const TIMEOUT_MS = 600;

  const tryFire = (): boolean => {
    if (ctx.state !== "running") return false;
    const buf = _buffers.get("/sounds/zyunnbi.m4a");
    if (!buf) return false;
    fireBuffer(ctx, buf, 0.175);
    return true;
  };

  // バッファ読み込み済み + running → 即再生
  if (tryFire()) return;

  // suspended か未ロード: 最大 600ms 待機
  let done = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const cleanup = () => {
    if (done) return;
    done = true;
    clearTimeout(timeoutId);
    ctx.removeEventListener("statechange", onStateChange);
  };

  const onStateChange = () => {
    if (done) return;
    if (tryFire()) cleanup();
  };

  ctx.addEventListener("statechange", onStateChange);
  timeoutId = setTimeout(cleanup, TIMEOUT_MS);

  // バッファがまだロード中の場合、ロード完了後も tryFire を試みる
  const loadingP = _loading.get("/sounds/zyunnbi.m4a");
  if (loadingP) {
    loadingP.then(() => {
      if (!done && tryFire()) cleanup();
    }).catch(() => {});
  }
}

// BGM・その他効果音（HTMLAudioElement）
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}
