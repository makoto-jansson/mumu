# mumu — 灯台の珈琲焙煎所 公式サイト＋アプリ

「感性が、ふと、戻ってくる場所」。ブランドサイト（HP）と Web アプリ（/app）を同一の Next.js アプリに統合したプロジェクト。

- **本番**: https://www.mumucoffee-feel.com/
- **仕様・設計思想**: **[docs/](docs/)** を参照（[README](docs/README.md) / [HP仕様](docs/hp.md) / [アプリ仕様](docs/app.md)）

---

## セットアップ

```bash
npm install
npm run dev        # 開発サーバ http://localhost:3000
npm run build      # 本番ビルド（webpack）— push前に必ず通す
npm run lint
```

環境変数は `.env.local`（microCMS）。本番は Vercel の環境変数に同じものを設定する（[docs/README.md](docs/README.md) の「デプロイ・運用」参照）。

---

## どこに何があるか（フォルダ地図）

```
mumu/
├─ docs/                   ← 仕様書（ここが正）。README=ハブ / hp.md / app.md
├─ src/
│  ├─ app/                 ← ルーティング（App Router）。URL＝フォルダ構造
│  │  ├─ page.tsx            /        トップ（HomeV2 を描画）
│  │  ├─ about/  beans/      /about /beans
│  │  ├─ journal/  column/   /journal /column（+ [id] 記事詳細）
│  │  ├─ app/                /app/... Webアプリ（4モード）
│  │  ├─ opengraph-image.tsx / twitter-image.tsx  OG画像（next/og 動的生成）
│  │  ├─ layout.tsx          ルートレイアウト（フォント/メタ/GTM/JSON-LD）
│  │  ├─ globals.css         Tailwind @theme・base・記事prose(.article-body)
│  │  └─ manifest.ts sitemap.ts robots.ts   PWA / SEO
│  ├─ components/
│  │  ├─ home-v2/          ← HPトップ v2 一式（帯/背景/豆/フッター/HomeV2）
│  │  ├─ about/ beans/       下層ページ用
│  │  ├─ layout/             共通（ConditionalLayout / Header / Footer / InstallBanner）
│  │  ├─ ui/                 GrainOverlay 等の共通UI
│  │  ├─ app/                アプリ共通レイアウト（BottomNav / NowPlayingBar 等）
│  │  ├─ focus/ relax/ spark/ reclaim/   アプリ各モード
│  │  └─ animations/         SVGアニメーション（灯台・波・焚き火 等）
│  ├─ lib/                 ← ロジック（microcms.ts / brandOg.tsx / playSound.ts / …）
│  ├─ hooks/                 React フック（useTimer / useBreath）
│  ├─ store/                 Zustand ストア（audio / history / routine）
│  ├─ data/                  静的データ（JSON）
│  ├─ fonts/                 ローカルフォント（Cormorant Garamond）
│  └─ sw.ts                  Service Worker ソース（serwist）
├─ public/                 ← 配信する静的ファイル
│  ├─ v2/                    HP v2 の画像素材（手書き見出し・カップ・豆・紙テクスチャ）
│  ├─ sounds/                アプリ用の音声
│  ├─ icons/                 PWAアイコン
│  └─ profile.jpg  sw.js
├─ reference/              ← 参考資料（デザインの元）。mumu-site-v2/（v2の正）・指示書・CSV
├─ AGENTS.md  CLAUDE.md      AIエージェント向けの作業ルール
└─ 各種設定（next.config.ts / tsconfig.json / eslint.config.mjs / package.json …）
```

### 迷ったときの早見表
| やりたいこと | 場所 |
|---|---|
| ページを追加/編集 | `src/app/<ルート>/page.tsx` |
| HPトップの見た目 | `src/components/home-v2/`（`homeV2.module.css`） |
| 色・フォント・共通スタイル | `src/app/globals.css`、`src/app/layout.tsx` |
| microCMS 取得 | `src/lib/microcms.ts` |
| OG画像 | `src/lib/brandOg.tsx` ＋ `src/app/{opengraph,twitter}-image.tsx` |
| アプリのモード | `src/components/{focus,relax,spark,reclaim}/` |
| 仕様・設計思想 | `docs/` |
| デザインの元資料 | `reference/` |

---

## コンテンツ運用（microCMS）

記事は microCMS に追加すれば **最大60秒で本番に自動反映**（再デプロイ不要）。

| API | 用途 | 表示先 |
|---|---|---|
| `beans` | 珈琲豆（商品） | `/beans` |
| `blogs` | 灯台守の日誌 | `/journal`・TOP |
| `columns` | 読みもの（SEOコラム） | `/column` |

詳細は [docs/README.md](docs/README.md)。

---

## デプロイ

`main` へ push すると **Vercel が自動デプロイ**。push 前に `npm run build` を通すこと。ハマりやすい点は [docs/README.md](docs/README.md) の「実装上の落とし穴」を参照。
