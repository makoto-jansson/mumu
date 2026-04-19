"use client";

// 効果音再生ユーティリティ
//
// iOS 対応方針:
//   クリック音   → HTMLAudioElement.play() をジェスチャーから直接呼ぶ（最も確実）
//   zyunnbi     → HTMLAudioElement + "unlock" パターン
//                  初回ジェスチャーで play→pause して iOS audio session を有効化
//                  その後は useEffect からでも再生可能になる
//   BGM フェード → Web Audio API GainNode（connectGain）※変更なし

// ─── zyunnbi: HTMLAudioElement + iOS unlock パターン ─────────────────────────
//
// unlock に zyunnbi 本体を使うと一瞬鳴ってしまうため、
// 無音の data URI 音声でセッションを開放し、本体には触れない

// 無音WAV（44100Hz, 1ch, 1サンプル）― iOS audio session unlock 専用
const SILENT_WAV = "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";

let _zyunnbiEl: HTMLAudioElement | null = null;
let _zyunnbiUnlocked = false;
let _cancelZyunnbi: (() => void) | null = null;

if (typeof window !== "undefined") {
  _zyunnbiEl = new Audio("/sounds/zyunnbi.m4a");
  _zyunnbiEl.preload = "auto";
  _zyunnbiEl.volume  = 0.175;

  // 無音WAVで iOS audio session を unlock（zyunnbiが一瞬鳴るのを防ぐ）
  const _silentEl = new Audio(SILENT_WAV);
  const doUnlock = () => {
    if (_zyunnbiUnlocked) return;
    _silentEl.play()
      .then(() => { _zyunnbiUnlocked = true; })
      .catch(() => {
        // 失敗しても次のジェスチャーで再試行される
      });
  };

  window.addEventListener("touchstart", doUnlock, { capture: true, passive: true });
  window.addEventListener("mousedown",  doUnlock, { capture: true });
}

// useEffect から呼ぶ（準備ページ表示時）
// 戻り値: キャンセル関数（必ず useEffect クリーンアップ or 画面遷移ボタンで呼ぶこと）
export function playZyunnbi(): () => void {
  if (!_zyunnbiEl) return () => {};

  // 前の呼び出しをキャンセル（二重起動防止）
  _cancelZyunnbi?.();

  const el = _zyunnbiEl;
  let cancelled = false;
  let pollId: ReturnType<typeof setInterval> | null = null;

  const doPlay = () => {
    if (cancelled) return;
    el.currentTime = 0;
    el.volume = 0.175;
    el.play().catch(() => {});
  };

  const cancel = () => {
    cancelled = true;
    if (pollId) { clearInterval(pollId); pollId = null; }
    try { el.pause(); el.currentTime = 0; } catch { /* ignore */ }
    if (_cancelZyunnbi === cancel) _cancelZyunnbi = null;
  };
  _cancelZyunnbi = cancel;

  if (_zyunnbiUnlocked) {
    // 既に unlock 済みなら即再生
    doPlay();
    return cancel;
  }

  // unlock を最大 5 秒待つ（100ms 間隔）
  // iOS では最初のジェスチャー（ナビゲーションのタップ等）で unlock が完了する
  const startMs = Date.now();
  pollId = setInterval(() => {
    if (cancelled || Date.now() - startMs > 5000) {
      if (pollId) { clearInterval(pollId); pollId = null; }
      return;
    }
    if (_zyunnbiUnlocked) {
      if (pollId) { clearInterval(pollId); pollId = null; }
      doPlay();
    }
  }, 100);

  return cancel;
}

// zyunnbi を外部から即停止する（BottomNav などのナビゲーション時に使用）
export function stopZyunnbi(): void {
  _cancelZyunnbi?.();
}

// ─── クリック音（低遅延 AudioBuffer 方式） ──────────────────────────────────
// AudioBuffer は事前デコード済みのため再生遅延がほぼゼロ
// ジェスチャーから直接 BufferSource.start() するので iOS でも確実に動作する
// AudioContext が未 unlock の場合は HTMLAudioElement にフォールバック

let _clickEl: HTMLAudioElement | null = null;
let _clickBuf: AudioBuffer | null = null;

if (typeof window !== "undefined") {
  // HTMLAudioElement（フォールバック用）
  _clickEl = new Audio("/sounds/clicksound.wav");
  _clickEl.preload = "auto";

  // AudioBuffer を非同期でデコード（以降の再生はゼロ遅延になる）
  fetch("/sounds/clicksound.wav")
    .then((r) => r.arrayBuffer())
    .then((buf) => {
      const ctx = getCtx();
      return ctx ? ctx.decodeAudioData(buf) : Promise.reject();
    })
    .then((decoded) => { _clickBuf = decoded; })
    .catch(() => { /* フォールバックに任せる */ });
}

export function playClick(): void {
  const ctx = getCtx();
  if (ctx && _clickBuf) {
    // ジェスチャーから直接呼ばれるので resume → 即再生（低遅延）
    ctx.resume().catch(() => {});
    const src  = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer       = _clickBuf;
    gain.gain.value  = 0.2625;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    return;
  }
  // AudioBuffer 未ロード時のフォールバック
  if (!_clickEl) return;
  _clickEl.currentTime = 0;
  _clickEl.volume = 0.2625;
  _clickEl.play().catch(() => {});
}

// 後方互換（呼ばれても何もしない）
export const preloadClick   = () => {};
export const preloadZyunnbi = () => {};

// ─── BGM・その他効果音（HTMLAudioElement） ───────────────────────────────────
export function playSound(path: string, volume = 1.0) {
  if (typeof window === "undefined") return;
  const audio = new Audio(path);
  audio.volume = volume;
  audio.play().catch(console.error);
}

// ─── BGM フェード用 GainNode ヘルパー ────────────────────────────────────────
// iOS は HTMLAudioElement.volume を無視するため
// Web Audio API の MediaElementSource + GainNode 経由で音量を制御する
//
// iOS unlock 方針:
//   AudioContext をモジュールロード時に即生成（suspended 状態）しておく。
//   ナビゲーションのタップ（touchstart）で resume() → useEffect で connectGain()
//   を呼ぶ頃には running 状態になっているため、フェードが正確に適用される。
//   遅延生成（getCtx の if(!_ctx) 分岐）では touchstart 時点で _ctx が null のため
//   unlock が機能しない。

let _ctx: AudioContext | null = null;

// モジュールロード時に AudioContext を生成（iOS unlock のため早期に用意する）
if (typeof window !== "undefined") {
  try {
    const AC = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AC) _ctx = new AC(); // iOS では suspended で生成される
  } catch { /* 非対応環境は null のまま */ }
}

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (_ctx && _ctx.state === "closed") {
    // closed になった場合のみ再生成
    try {
      const AC = window.AudioContext
        ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      _ctx = new AC();
    } catch { _ctx = null; }
  }
  return _ctx;
}

// BGM 用 AudioContext unlock（ジェスチャーで resume）
// _ctx がモジュールロード時から存在するため、最初のタップで確実に動作する
if (typeof window !== "undefined") {
  const _unlockCtx = () => {
    if (_ctx?.state === "suspended") _ctx.resume().catch(() => {});
  };
  window.addEventListener("touchstart", _unlockCtx, { capture: true, passive: true });
  window.addEventListener("mousedown",  _unlockCtx, { capture: true });
}

type FadeHandle = {
  setVolume:  (v: number) => void;
  fadeTo:     (target: number, durationMs: number, onDone?: () => void) => void;
  disconnect: () => void;
};

export function connectGain(audio: HTMLAudioElement, initialVolume: number): FadeHandle | null {
  const ctx = getCtx();
  if (!ctx) return null;

  // iOS: AudioContext が suspended の場合は resume() してから続行
  ctx.resume().catch(() => {});

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

  // AudioContext が running になるまで最大 500ms ポーリングしてからフェードを開始
  // iOS では resume() が非同期なため、suspended のままフェードを始めると無音になる
  function startFade(target: number, durationMs: number, onDone?: () => void) {
    if (fadeId) clearInterval(fadeId);
    const startMs = Date.now();
    const pollId = setInterval(() => {
      if (ctx!.state === "running" || Date.now() - startMs > 500) {
        clearInterval(pollId);
        if (fadeId) clearInterval(fadeId);
        const steps  = 30;
        const stepMs = durationMs / steps;
        const from   = gain.gain.value;
        const delta  = (target - from) / steps;
        let   count  = 0;
        fadeId = setInterval(() => {
          count++;
          gain.gain.value = Math.max(0, Math.min(1, from + delta * count));
          if (count >= steps) {
            if (fadeId) clearInterval(fadeId);
            gain.gain.value = target;
            onDone?.();
          }
        }, stepMs);
      }
    }, 30);
  }

  return {
    setVolume(v: number) {
      gain.gain.value = Math.max(0, Math.min(1, v));
    },
    fadeTo(target: number, durationMs: number, onDone?: () => void) {
      startFade(target, durationMs, onDone);
    },
    disconnect() {
      if (fadeId) clearInterval(fadeId);
      try { gain.disconnect(); source.disconnect(); } catch { /* ignore */ }
    },
  };
}
