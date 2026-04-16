// タイマーフック
// requestAnimationFrame + Date.now() でバックグラウンドでも精度を保つ

import { useState, useEffect, useRef, useCallback } from "react";


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

  // 残り時間を指定して途中から再開（画面復帰時などに使用）
  const startFromRemaining = useCallback((remaining: number) => {
    remainingRef.current = remaining;
    startTimeRef.current = Date.now();
    setTimeLeft(remaining);
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  // 残り時間を指定して一時停止状態で初期化（一時停止中に離脱した場合）
  const initPaused = useCallback((remaining: number) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    remainingRef.current = remaining;
    startTimeRef.current = null;
    setTimeLeft(remaining);
    setIsRunning(false);
  }, []);

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

  return { timeLeft, isRunning, isFinished, formatted, start, startFromRemaining, initPaused, pause, resume, reset };
}
