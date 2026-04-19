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

let _zyunnbiEl: HTMLAudioElement | null = null;
let _zyunnbiUnlocked = false;
let _cancelZyunnbi: (() => void) | null = null;

if (typeof window !== "undefined") {
  _zyunnbiEl = new Audio("/sounds/zyunnbi.m4a");
  _zyunnbiEl.preload = "auto";
  _zyunnbiEl.volume  = 0.175;

  // 最初のジェスチャーで iOS audio session を unlock する
  // play() → pause() パターン: 以降は useEffect からでも play() 可能になる
  const doUnlock = () => {
    if (_zyunnbiUnlocked || !_zyunnbiEl) return;
    _zyunnbiEl.play()
      .then(() => {
        _zyunnbiEl!.pause();
        _zyunnbiEl!.currentTime = 0;
        _zyunnbiUnlocked = true;
      })
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

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (_ctx && _ctx.state === "closed") _ctx = null;
  if (!_ctx) {
    const AC = window.AudioContext
      ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    _ctx = new AC();
  }
  return _ctx;
}

// BGM 用 AudioContext unlock（ジェスチャーで resume）
if (typeof window !== "undefined") {
  const _unlockCtx = () => {
    if (_ctx && _ctx.state === "suspended") _ctx.resume().catch(() => {});
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
