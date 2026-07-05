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
├─ public/                 ← 配信する静的ファイル（URLの「/」に対応）
│  ├─ v2/                    HP v2 の画像素材（手書き見出し・カップ・豆・紙テクスチャ）
│  ├─ images/                写真（profile.jpg = 焙煎者写真 など）
│  ├─ sounds/                アプリ用の音声
│  ├─ icons/                 PWAアイコン
│  └─ sw.js                  Service Worker（serwist が自動生成・public直下固定）
├─ reference/              ← 参考資料（デザインの元）。mumu-site-v2/（v2の正）・指示書・CSV。※ローカルのみ
├─ AGENTS.md  CLAUDE.md      AIエージェント向けの作業ルール
└─ 設定ファイル各種            ↓「ルート直下のファイルは何？」を参照
```

---

## ルート直下のファイルは何？（基本さわらない）

ルートに直接置いてある設定ファイルは、**ツールが「この名前・この場所」を決め打ちで探す**ため動かせません（移動すると壊れる）。何のファイルか分かれば十分です。

| ファイル/フォルダ | 何のためのもの | さわる？ |
|---|---|---|
| `package.json` | 使うライブラリと `npm run` コマンドの一覧（プロジェクトの目次） | ときどき（依存追加・スクリプト） |
| `package-lock.json` | ライブラリの**正確なバージョンを固定**する自動生成ファイル | ✗ 手で触らない（npmが管理） |
| `next.config.ts` | Next.js（フレームワーク）の設定 | まれに |
| `tsconfig.json` | TypeScript（言語）の設定 | まれに |
| `postcss.config.mjs` | CSS（Tailwind）の処理設定 | ほぼ✗ |
| `eslint.config.mjs` | コード規約チェックの設定 | ほぼ✗ |
| `next-env.d.ts` | Next.js が自動生成する型定義 | ✗ 触らない |
| `.gitignore` | git で追跡しないファイルの一覧 | まれに |
| `.env.local` | **秘密の環境変数**（microCMSキー等）。git管理外 | 値を変える時 |
| `node_modules/` | インストールされたライブラリ本体（巨大・自動生成） | ✗（`npm install` で再生成） |
| `.next/` `tsconfig.tsbuildinfo` | ビルドの出力・キャッシュ（自動生成） | ✗ |
| `AGENTS.md` `CLAUDE.md` | AIエージェント向けの作業ルール | 運用で更新 |

**要点**: 中身を編集するのは主に `src/`（コード）・`public/`（画像等）・`docs/`（仕様）・microCMS（記事）。ルートの設定ファイルは「そういう置き場所と決まっているもの」で、基本さわりません。

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
