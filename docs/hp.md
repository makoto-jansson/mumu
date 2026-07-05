# mumu 公式サイト（HP）仕様書 — v2 帯レイアウト

> **最終更新**: 2026-07-05
> **対象URL**: `/`, `/about`, `/beans`, `/journal`, `/journal/[id]`, `/column`, `/column/[id]`
> **デザイン正**: `mumu-site-v2/index.html`（発注者すり合わせ済みのリファレンス実装）＋ `mumu-指示書 .md`

2026-07-05 に、旧デザイン（ネイビー×SectionBlock版）から **v2「帯（obi）レイアウト」** へ全面刷新した。TOPは `mumu-site-v2/index.html` を Next.js へ忠実移植し、下層ページも同じ帯・背景テクスチャ・回る豆・深緑フッターで統一している。

---

## 1. デザイントークン

生成りの紙 × 深緑インク。手書き画像の見出しが主役。

| トークン | 値 | 用途 |
|---|---|---|
| `--ink` | `#004648` | ブランドの深緑（帯・見出し・ボタン枠・SNS） |
| `--paper` | `#f7f9f7` | 背景の生成り |
| `--text` | `#2b2b28` | 本文 |
| `--text-sub` | `#5a5f5c` | 補足テキスト |
| `--sidebar-w` | `232px`（SPは0） | 左の帯の幅 |

Tailwindの semantic トークン（`globals.css` の `@theme`）も v2 値に統一済み（下層ページの Tailwind クラスがそのまま v2 色になる）:
`--color-ink-primary:#004648` / `--color-ink-secondary:#2b2b28` / `--color-base:#f7f9f7` / `--color-grad-teal:#5a5f5c` / `--color-accent-lime:#004648`（ライムは廃止）。

### フォント（`layout.tsx` の next/font、**preload:false**）
| CSS変数 | フォント | 用途 |
|---|---|---|
| `--font-gothic` | Zen Kaku Gothic New | メニュー・本文 |
| `--font-mincho` | Shippori Mincho | CTAリンク・ボタン・見出し |
| `--font-hand` | Klee One | 手書き調の補助テキスト |

見出し・キャッチは**フォントではなく手書き画像**（`public/v2/*.png`）。英文イタリック装飾用に Cormorant Garamond（ローカル）も残置。

---

## 2. 共通レイアウト（chrome）

`src/components/home-v2/` に集約。TOP・下層で共有する。

| ファイル | 役割 |
|---|---|
| `HomeV2.tsx` | TOPページ本体（client）。Hero演出・パララックス・スクロールスパイ・ゆる吸着・reveal を実装 |
| `SiteChromeV2.tsx` | 下層ページ用ラッパ。背景＋帯＋豆＋フッターで children を囲む |
| `Obi.tsx` | 左の帯（グローバルナビ）。`hrefPrefix` で TOP=`#about` / 下層=`/#about` を切替 |
| `PaperBackdrop.tsx` | 紙テクスチャ＋左右の手書き縦線（`position:fixed` の固定レイヤー） |
| `FloatingBean.tsx` | 右上の珈琲豆（スクロールで自転・reduce-motionで無効・クリックでSHOP） |
| `FooterV2.tsx` | 深緑フッター（読みもの→/column、コピーライト） |
| `links.ts` | ブランドリンク集約（SHOP/Instagram/YouTube/Podcast） |
| `homeV2.module.css` | 上記すべてのスタイル（`mumu-site-v2/index.html` の `<style>` を CSS Modules 化） |

### 帯（obi）メニュー
`mumuについて`(#about) / `珈琲をえらぶ`(#beans) / `灯台守の日誌`(#journal) / `Podcast`(#podcast) / **`アプリ`(/app)**。
- TOPでは同ページ内アンカー＋**スクロールスパイ**（現在地の項目に下線＋点が灯る）
- 下層では `/#about` 等で TOP該当セクションへ戻る
- スパイは順番ではなく**リンク先のセクションid一致**で判定（アプリ等が混在しても正しく点灯）

### ConditionalLayout
`src/components/layout/ConditionalLayout.tsx` の `isV2`（`/`,`/about`,`/beans`,`/journal`,`/column` とその配下）で、旧 Header/Footer/GrainOverlay を非表示にし、外側 `<main>` も出さない（v2ページは自前で `<main id="top">` を持つため二重回避）。`/app` 配下も別扱いで非表示。

---

## 3. TOPページ `/`（HomeV2）

`page.tsx`（server）が最新3件の日誌を取得して `HomeV2` に渡す。セクション順:

**Hero → mumuについて(#about) → 珈琲をえらぶ(#beans) → 灯台守の日誌(#journal) → Podcast(#podcast) → フッター**。セクション間に手書きの区切り線（`line.png`）。

### 演出（`mumu-site-v2/index.html` の挙動を忠実再現。数値は変更禁止）
1. **Heroロードシーケンス**: カップ→タグライン→mumuロゴ(手書きワイプ)→scrollヒント、を時間差で表示
2. **手書きワイプ**（`.write`）: CSSマスクで「左からペンで書かれる」出現。IntersectionObserverで発火
3. **豆の自転**: `rotate(scrollY * 0.25deg)`（FloatingBean）
4. **パララックス**: `data-depth` を持つ手書き要素だけがスクロールより速く動く
5. **スクロールスパイ**: 帯メニューに現在地の下線＋点
6. **紙テクスチャ＋縦線**: `position:fixed` 固定レイヤー（`background-attachment:fixed` は禁止）
7. **スクロール出現**（`.reveal`）＋ **ゆる吸着**（スクロール停止時に近いセクション頭へぬるっと寄る）
8. **reduced-motion**: 全演出を無効化（スクロールスパイは機能なので継続）

### SEO構造（変更禁止）
見出しは手書き画像だが、h1/h2/h3 + alt でテキストとして伝わる構造。
- h1: 灯台の珈琲焙煎所 mumu（Heroロゴ）
- h2: mumuについて/珈琲をえらぶ/灯台守の日誌/Podcast
- h3: 朝・夕暮れ・夜の各珈琲豆キャプション

### CTA
各セクションの CTA（詳しくみる/日誌をよむ/聴いてみる）は珈琲の SHOP と同じ**枠線ボタン**（`.btn`）に統一。

---

## 4. 下層ページ

すべて `SiteChromeV2` で囲み、帯・紙テクスチャ・回る豆・フッターを共通化。本文は Tailwind（v2トークンで深緑×紙トーン）。

| ページ | 内容 |
|---|---|
| `/about` | ブランドストーリー＋焙煎者プロフィール（`RoasterProfile.tsx`、Person JSON-LD）。区切りは手書き罫線 `line.png`。▼珈琲(/beans)・▼アプリ(/app) の見出しリンク |
| `/beans` | microCMS `beans` から商品一覧（`BeansFilter` タブ＋`BeanCard`）。`getBeans()`・`revalidate=0`。カードからSTORESショップへ |
| `/journal` | microCMS `blogs` の記事一覧（`JournalContent`）。0件時は note 案内にフォールバック |
| `/journal/[id]` | 日誌記事詳細。本文HTMLを `.article-body`（globals.css）で prose 整形・アイキャッチ対応・存在しないidは404 |
| `/column` | microCMS `columns` の読みもの一覧（server）。SEOコラム。未整備時は「準備中」 |
| `/column/[id]` | 読みもの記事詳細（journal/[id]と同構造） |

---

## 5. microCMS 連携（`src/libs/microcms.ts`）

- **client は null 許容**（env未設定でもビルドが落ちない）。各取得関数は失敗/未設定時に空・null へフォールバック
- `getBeans()` / `getRecentPosts(n)` / `getAllPosts()` / `getPost(id)` / `getAllColumns()` / `getColumn(id)` / `formatPostDate(iso)`
- 型: `Bean`（name/roast/weight/price/flavor/description/image/shopUrl）、`BlogPost`（title/content/publishedAt/eyecatch/category）
- ページ側 fetch → client(HomeV2/JournalContent)へは**整形済みデータを渡す**（microcms.ts を client に import しない：モジュール読込副作用のため）
- `sitemap.ts` は固定ページ＋ `blogs`/`columns` の記事URLを動的に含める

---

## 6. OGP / SEO

- **OG画像は `next/og` で動的生成**（`app/opengraph-image.tsx`, `twitter-image.tsx`, ロジックは `src/lib/brandOg.tsx`）
  - cup.png ベース・**1200×630**。文言は手書き画像素材（tagline/mumu-script）で構成しフォント不要
  - `export const runtime = "nodejs"`、`node:fs/promises` で public 画像を base64 data URI 化して埋め込み
  - サイト全体の og:image / twitter:image を一本化。記事詳細はアイキャッチがあれば `generateMetadata` で上書き
- メタは `layout.tsx`（既定）＋各 `page.tsx`（個別）。JSON-LD は Organization（layout）＋ Person（/about）
- 本番 body 背景（オーバースクロール対策）: `body:has([data-home-root])` を紙 `#f7f9f7`、`html:has([data-home-root])` を緑 `#004648`

---

## 7. アセット（`public/v2/`）

手書き見出し（h-about/h-beans/h-journal/h-podcast）、Heroの cup / tagline / mumu-script、豆イラスト（asa-e/yuu-e/yoru-e）、キャプション（cap-asa/yuu/yoru）、lighthouse・kansei、区切り線 line、紙テクスチャ paper（280px）、縦線 ink-line、帯ロゴ logo、豆 bean。見出し画像の表示幅は個別指定（筆致スケール調整）で変更禁止。

---

## 8. ★ 差し替え・未確定

- **Podcast「聴いてみる」**: `links.ts` の `PODCAST_URL`（現状 Spotify）
- **日誌/読みもの**: microCMS に記事を追加すれば自動表示（`blogs`=日誌、`columns`=読みもの）
- **OGP**: 現状ブランド画像で共通。記事個別OGはアイキャッチで自動上書き
