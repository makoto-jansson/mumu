"use client";

// 効果音再生ユーティリティ
//
// ⚠️ iOS Safari では AudioContext.statechange イベントが発火しないことがある（WebKit既知の問題）
//    そのため statechange は一切使わず、ポーリングで ctx.state を監視する方針とする。

let _ctx: AudioContext | null = null;

// デコード済みバッファキャッシュ
const _buffers: Map<string, AudioBuffer>     = new Map();
// ロード中Promise（重複fetch防止）
const _loading:  Map<string, Promise<void>>  = new Map();
// fetch済みArrayBufferキャッシュ（decodeAudioData失敗時の再デコードで再fetchしなくて済むよう）
const _rawBufs:  Map<string, ArrayBuffer>    = new Map();

// ─── AudioContext 初期化 & unlock ────────────────────────────────────────────

if (typeof window !== "undefined") {
  // どんなタッチ/クリックでも AudioContext を unlock する
  const _unlock = () => {
    if (_ctx && _ctx.state === "suspended") {
      _ctx.resume().catch(() => {});
    }
  };
  // capture フェーズで登録（React のイベントより前に実行される）
  window.addEventListener("touchstart", _unlock, { capture: true, passive: true });
  window.addEventListener("mousedown",  _unlock, { capture: true });

  // AudioContext を早期作成しておく
  // → アプリ起動後の最初のタッチで即 unlock 可能になる
  // （useEffect 内で作ると、遷移タップが unlock に使えない）
  const AC = window.AudioContext
    ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (AC) {
    try { _ctx = new AC(); } catch { /* ignore */ }
  }
}

// ─── 内部ユーティリティ ───────────────────────────────────────────────────────

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  // closed 状態（ページ非表示→復帰等）は再生成
  if (_ctx && _ctx.state === "closed") {
    _ctx = null;
    _buffers.clear();
    _loading.clear();
    // rawBufs は残す（再デコードに使えるため）
  }
  if (!_ctx) {
    const AC = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _ctx = new AC();
  }
  return _ctx;
}

// 指定パスの音声を fetch → decodeAudioData → _buffers に保持
// iOS suspended context での decode 失敗に備え：
//   - _rawBufs に ArrayBuffer をキャッシュ（再 fetch 不要）
//   - decode 失敗時は _loading を削除して次回呼び出しで再試行可能にする
function preloadBuffer(path: string): void {
  if (typeof window === "undefined") return;
  if (_buffers.has(path) || _loading.has(path)) return;

  const ctx = getCtx();
  if (!ctx) return;

  // ArrayBuffer は fetch が完了していればキャッシュから使う
  const raw = _rawBufs.get(path);
  const fetchP: Promise<ArrayBuffer> = raw
    ? Promise.resolve(raw)
    : fetch(path)
        .then(r => r.arrayBuffer())
        .then(buf => { _rawBufs.set(path, buf); return buf; });

  const p = fetchP
    .then(arrayBuf => ctx.decodeAudioData(arrayBuf.slice(0)))
    // slice(0) = コピーを渡す（decodeAudioData はバッファを detach するため）
    .then(decoded => { _buffers.set(path, decoded); })
    .catch(() => {
      // decode 失敗（suspended context でのデコード失敗等）→ リセットして再試行可能に
      _loading.delete(path);
    });
  _loading.set(path, p);
}

// AudioBuffer を即時再生
function fireBuffer(ctx: AudioContext, buf: AudioBuffer, volume: number): void {
  const src  = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.value = volume;
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(0);
}

// AudioContext が running になるまでポーリングで待機する
// statechange の代替（iOS Safari では statechange が発火しないことがあるため）
function waitUntilRunning(
  ctx: AudioContext,
  maxMs: number,
  intervalMs: number,
  onRunning: () => void,
): () => void {
  const start = Date.now();
  const id = setInterval(() => {
    if (ctx.state === "running") {
      clearInterval(id);
      onRunning();
    } else if (Date.now() - start > maxMs) {
      clearInterval(id);
    }
  }, intervalMs);
  return () => clearInterval(id);
}

// ─── ジェスチャーハンドラ専用（ボタン・タップ等）────────────────────────────
// ジェスチャー内なので resume() は iOS でも許可される
// Promise チェーン + ポーリングで確実に再生（statechange は使わない）

function playBufferGesture(path: string, volume = 1.0): void {
  const ctx = getCtx();
  if (!ctx) return;

  // resume を呼ぶ（ジェスチャー内なので iOS でも成功するはず）
  const resumeP = ctx.resume().catch(() => {});

  const fire = () => {
    const buf = _buffers.get(path);
    if (!buf) return;
    if (ctx.state === "running") {
      fireBuffer(ctx, buf, volume);
    } else {
      // resume().then() が呼ばれたがまだ running でない場合はポーリングで待つ
      waitUntilRunning(ctx, 1000, 50, () => {
        const b = _buffers.get(path);
        if (b) fireBuffer(ctx, b, volume);
      });
    }
  };

  const buf = _buffers.get(path);
  if (buf) {
    // バッファ準備済み → resume 完了後に即再生
    resumeP.then(fire);
    return;
  }

  // バッファ未ロード: preload を開始して resume と両方の完了を待つ
  preloadBuffer(path);
  const loadingP = _loading.get(path);
  if (!loadingP) return;

  Promise.all([resumeP, loadingP]).then(() => fire());
}

// ─── 公開 API ─────────────────────────────────────────────────────────────────

export const preloadClick   = () => preloadBuffer("/sounds/clicksound.wav");
export const preloadZyunnbi = () => preloadBuffer("/sounds/zyunnbi.m4a");

// ジェスチャーハンドラから呼ぶ（ボタン・タップ等）
export const playClick = () => playBufferGesture("/sounds/clicksound.wav", 0.2625);

// モジュールロード時にバッファをプリロード開始
// suspended context でも decodeAudioData は動作する（iOS 15+ で確認済み）
// →失敗した場合も _loading を削除して再試行可能
if (typeof window !== "undefined") {
  preloadBuffer("/sounds/clicksound.wav");
  preloadBuffer("/sounds/zyunnbi.m4a");
}

// useEffect から呼ぶ（準備ページ表示時）
// 戻り値: キャンセル関数（useEffect のクリーンアップで呼ぶこと）
//
// iOS での動作フロー:
//   1. useEffect 内なので ctx.resume() は拒否されることが多い
//   2. ポーリングで ctx.state === "running" を待つ（最大 5 秒 / 100ms 間隔）
//   3. ユーザーが画面をタップ → touchstart → _unlock() → ctx.resume() → running に
//   4. 次の 100ms ポーリングで tryFire() が成功して再生
//
// ⚠️ クリーンアップ必須: コンポーネントがアンマウントされたらキャンセル関数を呼ぶこと。
//    呼ばないと画面遷移後に音が鳴ってしまう。
export function playZyunnbi(): () => void {
  // バッファが未ロードなら開始する（suspended 状態でも fetch は可能）
  preloadBuffer("/sounds/zyunnbi.m4a");

  const ctx = getCtx();
  if (!ctx) return () => {};

  // resume を試みる（ジェスチャー直後ならiOSでも成功する場合がある）
  ctx.resume().catch(() => {});

  let cancelled = false;

  const tryFire = (): boolean => {
    if (cancelled) return true; // キャンセル済みなら無音で終了
    if (ctx.state !== "running") return false;
    const buf = _buffers.get("/sounds/zyunnbi.m4a");
    if (!buf) return false;
    cancelled = true; // 再生したら以降はスキップ
    fireBuffer(ctx, buf, 0.175);
    return true;
  };

  // 即再生できれば即再生
  if (tryFire()) return () => {};

  // resume().then() で再試行（ナビゲーション直後なら成功することがある）
  ctx.resume().then(() => { tryFire(); }).catch(() => {});

  // バッファロード完了時に再試行
  const loadingP = _loading.get("/sounds/zyunnbi.m4a");
  if (loadingP) {
    loadingP.then(() => { tryFire(); }).catch(() => {});
  }

  // ポーリング: statechange の代替（iOS Safari で statechange は信頼できないため）
  // 最大 5 秒 / 100ms 間隔 でチェック
  const stopPoll = waitUntilRunning(ctx, 5000, 100, () => {
    // コンテキストが running になったら再度 preload 試行
    // （suspended 中に decode が失敗していた場合のリカバリ）
    if (!_buffers.has("/sounds/zyunnbi.m4a")) {
      preloadBuffer("/sounds/zyunnbi.m4a");
      setTimeout(() => { tryFire(); }, 300);
    } else {
      tryFire();
    }
  });

  // キャンセル関数: useEffect のクリーンアップで呼ぶこと
  return () => {
    cancelled = true;
    stopPoll();
  };
}

// BGM・その他効果音（HTMLAudioElement）
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}

// ─── BGM フェード用 GainNode ヘルパー ────────────────────────────────────────
// iOS は HTMLAudioElement.volume を無視するため、
// Web Audio API の MediaElementSource + GainNode 経由で音量を制御する。

type FadeHandle = {
  setVolume:  (v: number) => void;
  fadeTo:     (target: number, durationMs: number, onDone?: () => void) => void;
  disconnect: () => void;
};

export function connectGain(audio: HTMLAudioElement, initialVolume: number): FadeHandle | null {
  const ctx = getCtx();
  if (!ctx) return null;

  // resume を試みる（ジェスチャー直後ならiOSでも成功する場合がある）
  ctx.resume().catch(() => {});

  // createMediaElementSource は同一要素に対して1回しか呼べない
  let source: MediaElementAudioSourceNode;
  try {
    source = ctx.createMediaElementSource(audio);
  } catch {
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
      const steps  = 30;
      const stepMs = durationMs / steps;
      const start  = gain.gain.value;
      const delta  = (target - start) / steps;
      let   count  = 0;
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
