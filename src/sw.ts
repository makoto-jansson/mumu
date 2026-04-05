import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkFirst, StaleWhileRevalidate } from "serwist";

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
      handler: new CacheFirst({ cacheName: "images-fonts" }),
    },
    {
      matcher: ({ request }) => request.destination === "audio",
      handler: new CacheFirst({ cacheName: "audio" }),
    },
  ],
});

serwist.addEventListeners();
