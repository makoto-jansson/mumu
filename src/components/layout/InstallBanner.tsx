"use client";

// ホーム画面追加バナー
// - iOS: Safari の「共有 → ホーム画面に追加」を案内
// - Android/Chrome: beforeinstallprompt イベントをキャッチしてネイティブプロンプト表示
// - 一度閉じたら localStorage に記録して二度と出さない

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isInStandaloneMode() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

const DISMISSED_KEY = "mumu-install-dismissed";

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      // iOSは自動でプロンプトが出ないので案内バナーを表示
      setVisible(true);
      return;
    }

    // Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
    }
    dismiss();
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-6 left-0 right-0 z-[200] px-4"
        >
          <div className="max-w-sm mx-auto bg-[#111] border border-white/10 px-5 py-4 flex items-start gap-4">
            {/* 灯台アイコン */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 22 22"
              fill="none"
              stroke="#a3a957"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 mt-0.5 opacity-70"
            >
              <polygon points="9.5,11 9,19 13,19 12.5,11" />
              <rect x="9.5" y="9" width="3" height="2.5" />
              <polygon points="9,9 11,6.5 13,9" />
              <rect x="8.5" y="11" width="5" height="1" />
              <ellipse cx="11" cy="20" rx="4" ry="1.2" />
            </svg>

            <div className="flex-1 min-w-0">
              <p className="text-[#e8e6e1]/80 text-sm font-light leading-relaxed">
                ホーム画面に追加すると<br />いつでもすぐに開けます
              </p>
              {isIOSDevice && (
                <p className="text-[#e8e6e1]/40 text-xs font-light mt-1">
                  Safari の <span className="text-[#e8e6e1]/60">共有</span> → <span className="text-[#e8e6e1]/60">ホーム画面に追加</span>
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2 shrink-0">
              {!isIOSDevice && (
                <button
                  onClick={handleInstall}
                  className="text-[#a3a957]/80 text-xs font-light tracking-wider border border-[#a3a957]/30 px-3 py-1.5 hover:bg-[#a3a957]/10 transition-colors duration-200"
                >
                  追加する
                </button>
              )}
              <button
                onClick={dismiss}
                className="text-[#e8e6e1]/25 text-xs font-light tracking-wider hover:text-[#e8e6e1]/50 transition-colors duration-200"
              >
                閉じる
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
