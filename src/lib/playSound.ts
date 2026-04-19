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

// ─── クリック音（HTMLAudioElement cloneNode 方式） ───────────────────────────
// AudioBuffer（Web Audio API）を使うと fetch の .then() 内で getCtx() が呼ばれ、
// ユーザージェスチャー前に AudioContext が生成されてしまう。
// Chrome はジェスチャーなしに生成された AudioContext を厳しく suspended 扱いし、
// BGM の resume() が 2 分以上効かなくなる問題が生じる。
// cloneNode() は同一リソースをブラウザキャッシュから複製するため
// currentTime=0 リセット方式より低遅延で、AudioContext を一切使わない。

let _clickEl: HTMLAudioElement | null = null;
if (typeof window !== "undefined") {
  _clickEl = new Audio("/sounds/clicksound.wav");
  _clickEl.preload = "auto";
}

export function playClick(): void {
  if (!_clickEl) return;
  // cloneNode でキャッシュから複製 → 即再生（連打でも独立して鳴る）
  const clone = _clickEl.cloneNode() as HTMLAudioElement;
  clone.volume = 0.2625;
  clone.play().catch(() => {});
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
// iOS / PC 両対応の unlock 方針:
//   AudioContext は「モジュールロード時ではなくジェスチャー時に生成 + resume」する。
//   - モジュールロード時に生成すると PC (Chrome) では「ユーザー操作なしに生成済み」
//     とみなされより厳しく suspended → 2分以上 BGM が出ない問題が発生する。
//   - touchstart / mousedown の _unlockCtx で getCtx() を呼んで「生成も一緒に行い」
//     そのまま resume() する。これにより:
//       iOS: ナビゲーションのタップ時点で生成 + resume → useEffect 到達時は running
//       PC : mousedown で生成 + resume → useEffect 到達時は running

let _ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (_ctx && _ctx.state === "closed") _ctx = null;
  if (!_ctx) {
    try {
      const AC = window.AudioContext
        ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AC) _ctx = new AC();
    } catch { /* 非対応環境は null のまま */ }
  }
  return _ctx;
}

// BGM 用 AudioContext unlock（ジェスチャーで生成 + resume）
// getCtx() で存在しなければ生成もするため iOS / PC どちらでも機能する
if (typeof window !== "undefined") {
  const _unlockCtx = () => {
    const ctx = getCtx();
    if (ctx?.state === "suspended") ctx.resume().catch(() => {});
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
