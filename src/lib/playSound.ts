"use client";

// 効果音再生ユーティリティ
// クリック音・準備音楽は Web Audio API（AudioBuffer）を使用 → iOS含む全デバイスで低遅延

let _ctx: AudioContext | null = null;

// サウンドバッファキャッシュ
const _buffers: Map<string, AudioBuffer> = new Map();
const _loading:  Map<string, Promise<void>> = new Map();

// モバイルでどんなタッチ操作でも AudioContext を unlock する
// BottomNav など playClick() を呼ばないナビゲーションでも確実に解放できる
if (typeof window !== "undefined") {
  const _unlock = () => {
    if (_ctx && _ctx.state === "suspended") {
      _ctx.resume().catch(() => {});
    }
  };
  // capture フェーズで登録（React のイベントより前に実行される）
  window.addEventListener("touchstart", _unlock, { capture: true, passive: true });
  window.addEventListener("mousedown",  _unlock, { capture: true });
}

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
// モバイル（iOS含む）対応:
//   - ctx.resume() を試みる
//   - statechange で running を検知して再生
//   - バッファ読み込み済みなら最大 800ms、未ロードなら最大 4000ms 待機
//     （iOS / 低速回線で 216KB の m4a デコードに時間がかかるため）
export function playZyunnbi(): void {
  const ctx = getCtx();
  if (!ctx) return;

  ctx.resume().catch(() => {}); // 可能なら resume（ジェスチャー直後なら iOS でも成功）

  const tryFire = (): boolean => {
    if (ctx.state !== "running") return false;
    const buf = _buffers.get("/sounds/zyunnbi.m4a");
    if (!buf) return false;
    fireBuffer(ctx, buf, 0.175);
    return true;
  };

  // 即再生できる場合
  if (tryFire()) return;

  // バッファロード済みなら 800ms、未ロードなら 4000ms（ネットワーク取得＋デコード待ち）
  const bufReady   = _buffers.has("/sounds/zyunnbi.m4a");
  const timeoutMs  = bufReady ? 800 : 4000;

  let done = false;
  let timeoutId: ReturnType<typeof setTimeout>;

  const finish = () => {
    if (done) return;
    done = true;
    clearTimeout(timeoutId);
    ctx.removeEventListener("statechange", onStateChange);
  };

  const onStateChange = () => {
    if (done) return;
    if (tryFire()) finish();
  };

  ctx.addEventListener("statechange", onStateChange);
  timeoutId = setTimeout(finish, timeoutMs);

  // バッファがまだロード中の場合、ロード完了後も tryFire を試みる
  const loadingP = _loading.get("/sounds/zyunnbi.m4a");
  if (loadingP) {
    loadingP.then(() => {
      if (!done && tryFire()) finish();
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

// ── BGM フェード用 GainNode ヘルパー ─────────────────────────────────────
// iOS は HTMLAudioElement.volume を無視するため、
// Web Audio API の MediaElementSource + GainNode 経由で音量を制御する。
// 戻り値: cleanup 関数（アンマウント時に呼ぶ）

type FadeHandle = {
  setVolume: (v: number) => void;
  fadeTo:    (target: number, durationMs: number, onDone?: () => void) => void;
  disconnect: () => void;
};

export function connectGain(audio: HTMLAudioElement, initialVolume: number): FadeHandle | null {
  const ctx = getCtx();
  if (!ctx) return null;

  // iOSなどでAudioContextがsuspendedの場合にresumeを試みる
  // ジェスチャー直後ならiOSでも成功する場合がある
  ctx.resume().catch(() => {});

  // createMediaElementSource は同一要素に対して1回しか呼べないためキャッシュ
  let source: MediaElementAudioSourceNode;
  try {
    source = ctx.createMediaElementSource(audio);
  } catch {
    // 既に接続済みの場合など（無視して null を返す）
    return null;
  }

  const gain = ctx.createGain();
  gain.gain.value = initialVolume;
  source.connect(gain);
  gain.connect(ctx.destination);

  let fadeId: ReturnType<typeof setInterval> | null = null;

  return {
    setVolume(v: number) {
      gain.gain.value = Math.max(0, Math.min(1, v));
    },
    fadeTo(target: number, durationMs: number, onDone?: () => void) {
      if (fadeId) clearInterval(fadeId);
      const steps   = 30;
      const stepMs  = durationMs / steps;
      const start   = gain.gain.value;
      const delta   = (target - start) / steps;
      let   count   = 0;
      fadeId = setInterval(() => {
        count++;
        gain.gain.value = Math.max(0, Math.min(1, start + delta * count));
        if (count >= steps) {
          if (fadeId) clearInterval(fadeId);
          gain.gain.value = target;
          onDone?.();
        }
      }, stepMs);
    },
    disconnect() {
      if (fadeId) clearInterval(fadeId);
      try { gain.disconnect(); source.disconnect(); } catch { /* ignore */ }
    },
  };
}
