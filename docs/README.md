# mumu 仕様書（統合インデックス）

> **最終更新**: 2026-07-05
> **対象**: 灯台の珈琲焙煎所 mumu 公式サイト（HP）＋ Webアプリ
> **本番**: https://www.mumucoffee-feel.com/ ／ リポジトリ: `github.com/makoto-jansson/mumu`

このディレクトリが仕様書の正です。旧 `mumu_brand_site_spec.md` / `mumu_app_spec_current.md` はここへ統合しました。

- **[hp.md](./hp.md)** — 公式サイト（`/`, `/about`, `/beans`, `/journal`, `/column`）の仕様。**2026-07 に v2 デザイン（帯レイアウト）へ全面刷新**
- **[app.md](./app.md)** — Webアプリ（`/app/...`）の仕様。4モード（Focus/Relax/Spark/Reclaim）

---

## 1. コンセプト・設計思想

**「感性が、ふと、戻ってくる場所」**。「珈琲屋のホームページ」ではなく、同一ドメイン上に **ブランド体験（HP）** と **アプリ** を統合したサイト。

- **キーワード**: 静か・丁寧・余白・灯台の光・手書きの温度
- **参考トーン**: Endel（ミニマル/アンビエント）、フィルム写真、紙・インクの質感
- **NG**: ポップ、情報過多、派手な配色、安っぽいストックフォト
- **導線の中心**: Instagram（@mumu_coffee_roaster）流入

### HP と アプリ の関係
- **HP**（生成りの紙 × 深緑インク、手書き画像の見出し）＝ ブランドの世界観・商品・読み物
- **アプリ**（暗色 `#111` × ライム差し色）＝ 集中/リラックス/発想/振り返りのツール。HPの「アプリ」導線（帯メニュー／about）から入る
- 見た目のトーンは別（HP=紙／アプリ=暗色）だが、**静けさ・余白・手描きの温度**という設計思想は共通

---

## 2. 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Next.js **16.2.2**（App Router、**webpack ビルド** = `next build --webpack`） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4（`@theme`）＋ HPトップは **CSS Modules**（`homeV2.module.css`） |
| アニメーション | Framer Motion 12（下層ページ/アプリ）＋ HPトップは素の CSS/JS |
| CMS | microCMS（`beans` 商品 / `blogs` 日誌 / `columns` 読みもの） |
| OG画像 | `next/og`（`ImageResponse`）で動的生成（[hp.md](./hp.md) 参照） |
| PWA | @serwist/next 9.5（本番のみ有効。`public/sw.js` を自動生成） |
| 状態管理（アプリ） | Zustand v5（`persist` で localStorage） |
| ホスティング | **Vercel**（GitHub `main` push で自動デプロイ） |
| アナリティクス | Google Tag Manager（GTM-5SDPJNKR） |

---

## 3. デプロイ・運用

- **本番反映**: `main` ブランチへ push → Vercel が自動ビルド＆デプロイ
- **ビルド検証**: push 前に必ず `npm run build`（webpack）を通す。ローカルは `npm run dev`
- **本番の必須環境変数（Vercel の Project Settings → Environment Variables）**:
  - `MICROCMS_SERVICE_DOMAIN`
  - `MICROCMS_API_KEY`（読み取り用）
  - ※ `.env.local` は git 管理外。**Vercel 側に設定しないと CMS の内容（豆・記事）が表示されない**（未設定でもビルドは通るよう `microcms.ts` はフォールバック実装）
- **Node.js バージョン**: Vercel の Project Settings で 20.x 以上を維持（古い版は Vercel が順次デプロイ禁止にする）

### コンテンツ運用（microCMS）
| API | 用途 | 表示先 | 反映 |
|---|---|---|---|
| `beans` | 珈琲豆（商品） | `/beans`、TOPの珈琲セクションは静的画像 | 即時（`/beans` は `revalidate=0`） |
| `blogs` | 灯台守の日誌 | TOP日誌・`/journal`・`/journal/[id]` | ISR 60秒 |
| `columns` | 読みもの（SEOコラム） | `/column`・`/column/[id]` | ISR 60秒 |

- 記事を追加/編集 → **最大60秒で本番に自動反映**（再デプロイ不要）
- `blogs` と `columns` は**別コンテンツとして分離**（日誌＝ブランドの一人称／読みもの＝検索流入用。混在させない）
- スキーマ: `title`(テキスト) / `content`(リッチエディタ) / `eyecatch`(画像・任意)

---

## 4. リポジトリ構成（要点）

```
src/
  app/            ルート・各ページ（App Router）
    page.tsx          / … HomeV2 を描画（HPトップ v2）
    about|beans|journal|column/ … 下層ページ（v2帯レイアウトで統一）
    journal/[id]|column/[id]/  … 記事詳細
    opengraph-image.tsx / twitter-image.tsx … OG画像（next/og）
    app/            … Webアプリゾーン（別レイアウト）
    globals.css     … Tailwind @theme・base・記事prose(.article-body)
    layout.tsx      … ルートレイアウト（フォント/GTM/JSON-LD/メタ）
    manifest.ts sitemap.ts robots.ts
  components/
    home-v2/        … HPトップ v2 の一式（下記 hp.md 参照）
    about/ beans/ layout/ ui/  … 下層/共通
    app/ focus/ relax/ spark/ reclaim/ animations/  … アプリ
  lib/ libs/ hooks/ store/ data/  … ロジック・CMS・状態・データ
Cormorant_Garamond/  … ローカルフォント（英文イタリック装飾用・git管理）
public/
  v2/       … HP v2 の画像素材（手書き見出し・カップ・豆・紙テクスチャ等）
  sounds/   … アプリ用の音声（動的参照。HPでは未使用）
  icons/    … PWAアイコン
  profile.jpg, sw.js
docs/       … 本仕様書（README/hp/app）
```

---

## 5. 実装上の落とし穴（重要）

このプロジェクト特有の、踏みやすい罠。

- **`.root` 配下に全称リセットを置かない**: `homeV2.module.css` の `.root *` に `margin/padding:0` を入れると、下層ページ（Tailwind直書き）の `pt-*` 等と同一詳細度で衝突し、余白が消えてレイアウトが崩れる。リセットは `box-sizing` のみ。
- **`microcms.ts` は env 未設定でも throw しない**: client を null 許容にし、各取得関数が空/nullへフォールバック。静的ページ（ISR）がビルド時にCMS参照するため、モジュール読込 throw は本番ビルドを落とす。
- **新規ファイルは必ず git add**: `git add -u` は追跡済みの変更しかステージしない。新規コンポーネントを追加したら明示的に add しないと、Vercel で `Module not found` になる（ローカルは実ファイルがあり気づけない）。
- **OG画像は Node.js ランタイム**: `next/og` でローカル画像を `fs` で読む場合、各ルートに `export const runtime = "nodejs"` を明示（未指定だと edge バンドルで `fs` 解決不能になり得る）。`node:fs/promises` を使用。
- **和文フォントは `preload: false`**: next/font で和文を preload すると全 unicode-range スライス（数百ファイル/数MB）が preload され壊滅的。
- **`background-attachment: fixed` は使わない**（iOS非対応）。紙テクスチャは `position:fixed` の固定レイヤー（PaperBackdrop）で敷く。
- **オーバースクロールのフッター隙間**: 慣性スクロールでフッターが持ち上がると裏の固定紙テクスチャが覗く。フッターに `box-shadow: 0 50vh 0 50vh #004648`（下方向を緑で埋める）＋ `html:has([data-home-root])` を緑 ＋ `overscroll-behavior-y:none` の三重で対処。

---

## 6. 主な変更履歴

| 時期 | 変更 |
|---|---|
| 2026-03〜04 | 初期（ダーク基調→ライト化）、SectionBlock+GradientBackground 版トップ、Cormorant+Shippori、焙煎者プロフィール+JSON-LD |
| 2026-07-04 | トップを船/プレート版プロトタイプから移植（フェーズ1） |
| **2026-07-05** | **HP を v2（帯レイアウト）へ全面刷新**。TOP/about/beans/journal を統一、`/column` 新設、日誌 microCMS 連携、OG を next/og 動的生成、旧デザインのコード/アセットを整理削除 |
