"use client";

// グローバル音声管理ストア
// - 画面遷移後も音楽を継続再生するため、コンポーネント外でAudioを保持
// - 新しいセッションが始まったら前の音楽をフェードアウトして切り替え

import { create } from "zustand";
import { isIOS } from "@/lib/playSound";

// 音量を滑らかに変化させてコールバックを呼ぶ
function fadeVolume(
  audio: HTMLAudioElement,
  target: number,
  durationMs: number,
  onDone?: () => void,
): void {
  const steps    = 30;
  const stepMs   = durationMs / steps;
  const startVol = audio.volume;
  const delta    = (target - startVol) / steps;
  let   count    = 0;
  const id = setInterval(() => {
    count++;
    audio.volume = Math.max(0, Math.min(1, startVol + delta * count));
    if (count >= steps) {
      clearInterval(id);
      audio.volume = target;
      onDone?.();
    }
  }, stepMs);
}

type NowPlayingMeta = {
  label:  string;       // 表示用テキスト（例: "Focus · 波"）
  route:  string;       // セッションページのパス（例: "/app/focus"）
  mode:   "focus" | "relax";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: any;          // FocusConfig | RelaxConfig（ページ側でキャスト）
};

type TimerSnap = {
  remainingSeconds: number; // 保存時点の残り秒数
  savedAt: number;          // Date.now() at save（一時停止中は0）
  isPaused: boolean;
  route: string;            // どのセッションのスナップか（"/app/focus" | "/app/relax"）
};

type AudioStore = {
  audio: HTMLAudioElement | null;
  meta:  NowPlayingMeta | null;
  timerSnap: TimerSnap | null;
  // 現セッションを丸ごと停止する処理（focusはギャップレスで2要素+ハンドラを持つため、
  // audio.pause() だけでは止めきれない。各セッションが登録する）
  teardown: (() => void) | null;
  // 新しい音声を登録（既存セッションは teardown で完全停止してから差し替え）
  setAudio: (audio: HTMLAudioElement, meta: NowPlayingMeta, teardown?: () => void) => void;
  // タイマー状態を保存（アンマウント・一時停止時）
  saveTimerSnap: (snap: TimerSnap) => void;
  // 明示的に停止（セッション終了・停止ボタン）
  stopAndClear: () => void;
};

export const useAudioStore = create<AudioStore>((set, get) => ({
  audio: null,
  meta:  null,
  timerSnap: null,
  teardown: null,

  saveTimerSnap: (snap) => set({ timerSnap: snap }),

  setAudio: (audio, meta, teardown) => {
    const prev = get().audio;
    const prevTeardown = get().teardown;
    if (prev && prev !== audio) {
      // 旧セッションを完全停止（2要素・ハンドラ・GainNodeを含めて）。
      // teardown が無い場合のみ従来どおり要素を停止するフォールバック。
      if (isIOS()) {
        // iOS は audio.volume が無視されフェードが効かないため即停止（重なり防止）
        if (prevTeardown) prevTeardown();
        else prev.pause();
      } else {
        // PC は volume が有効なのでクロスフェードしてから完全停止
        fadeVolume(prev, 0, 800, () => {
          if (prevTeardown) prevTeardown();
          else prev.pause();
        });
      }
    }
    set({ audio, meta, teardown: teardown ?? null });
  },

  stopAndClear: () => {
    const { audio, teardown } = get();
    // teardown があれば全要素・ハンドラごと停止（無ければ従来どおり）
    if (teardown) teardown();
    else if (audio) audio.pause();
    set({ audio: null, meta: null, timerSnap: null, teardown: null });
  },
}));
