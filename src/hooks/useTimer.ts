// タイマーフック
// requestAnimationFrame + Date.now() でバックグラウンドでも精度を保つ

import { useState, useEffect, useRef, useCallback } from "react";

// 完了時通知音（Web Audio API でベル風トーンを生成）
function playCompletionSound() {
  try {
    const ctx = new AudioContext();
    const notes = [523.25, 659.25, 783.99]; // C5 E5 G5
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freq;
      const t = ctx.currentTime + i * 0.22;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
      osc.start(t);
      osc.stop(t + 0.8);
    });
  } catch {
    // AudioContext 非対応環境は無視
  }
}

export function useTimer(durationSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const remainingRef = useRef(durationSeconds);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    if (startTimeRef.current === null) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newTimeLeft = Math.max(0, remainingRef.current - elapsed);
    setTimeLeft(newTimeLeft);
    if (newTimeLeft > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setIsRunning(false);
      playCompletionSound();
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate([400, 100, 400]);
      }
    }
  }, []);

  const start = useCallback(() => {
    remainingRef.current = durationSeconds;
    startTimeRef.current = Date.now();
    setTimeLeft(durationSeconds);
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [durationSeconds, tick]);

  const pause = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    // 残り時間を保存してから停止
    remainingRef.current = timeLeft;
    startTimeRef.current = null;
    setIsRunning(false);
  }, [timeLeft]);

  const resume = useCallback(() => {
    startTimeRef.current = Date.now();
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const reset = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    remainingRef.current = durationSeconds;
    startTimeRef.current = null;
    setTimeLeft(durationSeconds);
    setIsRunning(false);
  }, [durationSeconds]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // MM:SS 形式のフォーマット
  const formatted = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(Math.floor(timeLeft % 60)).padStart(2, "0")}`;
  const isFinished = timeLeft === 0 && !isRunning;

  return { timeLeft, isRunning, isFinished, formatted, start, pause, resume, reset };
}
