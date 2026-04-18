import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, NetworkFirst, StaleWhileRevalidate } from "serwist";

// This is injected by @serwist/next at build time
declare global {
  interface ServiceWorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request }) => request.destination === "document",
      handler: new NetworkFirst({ cacheName: "documents" }),
    },
    {
      matcher: ({ request }) =>
        ["style", "script", "worker"].includes(request.destination),
      handler: new StaleWhileRevalidate({ cacheName: "static-assets" }),
    },
    {
      matcher: ({ request }) =>
        ["image", "font"].includes(request.destination),
      handler: new NetworkFirst({ cacheName: "images-fonts" }),
    },
    // 音声は SW でインターセプトしない（Range リクエストの互換性のため）
    // precache も除外済み（next.config.ts の exclude: [/\/sounds\//]）
    // → ブラウザが直接ネットワークから取得する
  ],
});

serwist.addEventListeners();
