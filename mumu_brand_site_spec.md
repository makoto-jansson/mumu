# mumu ブランドサイト仕様書（公式HP）

> **最終更新**: 2026-04-25
> **対象URL**: `/`, `/about`, `/beans`, `/journal`
> **コンセプト**: 「感性が、ふと、戻ってくる場所」

---

## 1. サイト概要

灯台の珈琲焙煎所mumu（ムーム）の公式サイト。「珈琲屋のホームページ」ではなく **ブランド体験サイト**。同じドメイン上に以下を統合：

- **HP**（`/`, `/about`, `/beans`, `/journal`）— ブランド・コンテンツ
- **アプリ**（`/app/...`）— 別仕様書 [`mumu_app_spec_current.md`](./mumu_app_spec_current.md)

**3つの柱**: 整える / 珈琲 / 読む（+ mumuについて）。Instagram（@mumu_coffee_roaster）流入が中心。

---

## 2. 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.2.2（App Router, **webpack** ビルド） |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS v4（`@theme` ブロック） |
| アニメーション | Framer Motion 12 |
| CMS | microCMS（`/journal`, `/beans` のみ） |
| PWA | @serwist/next 9.5（本番のみ有効） |
| ホスティング | Vercel（GitHub `main` ブランチ自動デプロイ） |
| ドメイン | https://www.mumucoffee-feel.com/ |
| アナリティクス | Google Tag Manager（GTM-5SDPJNKR） |

リポジトリ: `github.com/makoto-jansson/mumu`

---

## 3. デザイン

### 3.1 トーン・参考

- **参考**: Endel（ミニマル・アンビエント）、フィルム写真、紙・布の質感
- **キーワード**: 静か、丁寧、余白、灯台の光
- **NG**: ポップ、情報過多、派手な配色、安っぽいストックフォト

### 3.2 カラーパレット（[globals.css](src/app/globals.css) `@theme`）

```
── ベース（HP共通）──
--color-base:           #fdf8ef   生成り白（ページ全体の背景）
--color-ink-primary:    #123656   ネイビー（本文・見出し）
--color-ink-secondary:  #2c6671   深いティール（サブテキスト）

── グラデ用 ──
--color-grad-teal:      #60ae9d   明るいティール
--color-grad-navy:      #123656   深いネイビー
--color-grad-deep-teal: #2c6671   中間の青緑

── アクセント ──
--color-accent-lime:    #a3a957   差し色ライム（極小面積のみ・落ち着いたオリーブ寄り）
```

`body` には `background-color: #fdf8ef; color: #123656;` を設定。

### 3.3 タイポグラフィ

| 用途 | フォント | 補足 |
|------|---------|------|
| 本文（和文） | Noto Sans JP | weight 300-500 / line-height 1.8 |
| 装飾英文 | **Cormorant Garamond**（VariableFont, ローカル） | `--font-serif`、Italic も同梱（[`Cormorant_Garamond/`](Cormorant_Garamond/)） |
| 見出し（和文） | **Shippori Mincho** | `--font-mincho`、weight 400-700 |
| 補助 | Noto Serif JP, Inter | フォールバック |

すべて `next/font/local`（Cormorant）または Google Fonts（その他）で `display: swap`。

### 3.4 SectionBlock + GradientBackground

各セクションは [SectionBlock](src/components/ui/SectionBlock.tsx) でラップ：

- `max-w-820`、`rounded-[18px]`、`min-h-460px`（Hero）
- 内部に [GradientBackground](src/components/ui/GradientBackground.tsx)（SVG `radialGradient` 2-3層 + `feTurbulence` グレイン）

セクション別の色温度：

| Type | 役割 |
|------|------|
| `hero` | 3色フル、世界観の提示 |
| `tools` | 朝の光・起動の印象（teal主体） |
| `beans` | 深み・香り（navy主体） |
| `journal` | 余白・静けさ（薄め） |
| `about` | 瞑想・着地（強め navy） |

### 3.5 グレイン（フィルム質感）

[GrainOverlay](src/components/ui/GrainOverlay.tsx) を**全ページ最前面**（`z-index: 9999`）に配置：

| 項目 | 値 |
|------|----|
| ノイズ | `feTurbulence type="fractalNoise" baseFrequency=1.2 numOctaves=4` |
| カラー | `feColorMatrix saturate=0`（無彩色） |
| 不透明度 | `0.025` |
| pointer-events | `none`（外側 `<div>` ラップで Android Chrome バグ回避） |

ビネットは廃止（ライト背景との相性が悪い）。

---

## 4. ページ構成

```
/             トップ（ブランドLP）         ✅
/about        mumu のストーリー + 焙煎者プロフィール ✅
/beans        珈琲豆一覧（microCMS）        ✅（ライトテーマで動的）
/journal      読み物一覧（microCMS）        ✅
/app/...      Web アプリ（別仕様書参照）     ✅
```

`Header` / `Footer` は [ConditionalLayout](src/components/layout/ConditionalLayout.tsx) によって `/app` 以下では非表示。

---

## 5. トップページ `/`

[page.tsx](src/app/page.tsx) は5つのセクションを縦に並べるだけ：

```tsx
<HeroSection />
<ToolsSection />
<BeansSection />
<JournalSection />
<AboutSection />
```

### 5.1 [HeroSection](src/components/home/HeroSection.tsx)

- ロゴ「mumu」（Cormorant Italic, 22.5px）+ PCナビ「整える / 珈琲 / 読む / mumuについて」
- メインコピー：「**感性が、ふと、／戻ってくる場所。**」（Shippori Mincho, clamp 26-34px）
- 写真スライダー（6枚、6秒間隔フェード、ドット手動切替可、キャプション英文 Italic）
- ブランドバッジ：`LIGHTHOUSE COFFEE ROASTERY` + ライム丸（`#a3a957`）
- ロゴ画像 + `— vol. 01, spring —`

### 5.2 [ToolsSection](src/components/home/ToolsSection.tsx)（01 整える）

```
番号 01 / 整える / — tools

感性を、取り戻す。
つくる人の、集中とひらめきのアプリ

自分らしさを取り戻す、4つのモード。
[アプリを使ってみる →]  → /app
```

### 5.3 [BeansSection](src/components/home/BeansSection.tsx)（02 珈琲）

Server Component。microCMS（`endpoint: beans`）から豆を取得 → **エチオピア優先ソート** → 横スクロールで豆カード表示。

```
番号 02 / 珈琲 / — coffee

灯台の珈琲焙煎所mumu
朝、夕、夜をコンセプトにした自家焙煎の珈琲豆オンラインショップ

浅煎りから深煎りまで、そのときどきの一杯を。

[← →  豆カード（width 190px, aspect 2/3）]   coming soon カード末尾
[すべての豆を見る →]  → /beans
```

豆カード: 画像 / 名前（serif italic）/ 焙煎度（uppercase）/ フレーバー / 価格。クリックで BASE 商品ページへ直接遷移。

### 5.4 [JournalSection](src/components/home/JournalSection.tsx)（03 読む）

```
番号 03 / 読む / — journal

ちいさな読み物。
珈琲の記録。

[読み物を見る →]  → /journal
```

### 5.5 [AboutSection](src/components/home/AboutSection.tsx)（04 mumuについて）

```
mumuについて

灯台のように
ただそこで光っている

忙しい日々のなかで、ふと自分に戻るための場所。

[ストーリーを読む →]  → /about
```

---

## 6. `/about`

ブランドストーリーページ。[RoasterProfile](src/components/about/RoasterProfile.tsx) を含む（焙煎者プロフィール、SEO/E-E-A-T 強化用 Person JSON-LD あり）。

本文中の重要な表現：
- 「**アプリは、Focus（集中）・Relax（リラックス）・Spark（発想）・Reclaim（振り返り）の 4モード構成で、すべて無料・インストール不要で使えるようにしています。**」
- 「最近、ドーパミン中毒だなあ...という方はぜひ使ってみてください。」

### JSON-LD（[layout.tsx](src/app/layout.tsx)）

ルートレイアウトに Organization、`/about#mako` に Person を相互リンク。

---

## 7. `/beans`

microCMS から全豆を取得して一覧表示。ライトテーマ（`#f7f9f7` 系）。各カードから BASE への外部リンク。

## 8. `/journal`

microCMS から記事一覧。各記事は note 等への外部リンク。ライトテーマ。

---

## 9. ヘッダー・フッター

`/` および非 `/app` ページのみ表示：

- [Header](src/components/layout/Header.tsx) — `mumu` ロゴ + ナビ
- [Footer](src/components/layout/Footer.tsx) — ロゴ + Instagram / note / Shop リンク + コピーライト
- [InstallBanner](src/components/layout/InstallBanner.tsx) — PWAインストール促進バナー

---

## 10. SEO / OGP

[layout.tsx](src/app/layout.tsx) の `metadata` で一括設定：

- title template: `%s | 灯台の珈琲焙煎所mumu`
- default title: `灯台の珈琲焙煎所mumu | 感性が、ふと、戻ってくる場所`
- description: スペシャルティコーヒーの焙煎と...
- OGP: `/og-image.jpg`（1200×630、灯台ビジュアル + ロゴ）
- Twitter card: `summary_large_image`
- canonical: `https://mumucoffee-feel.com`
- robots: `index: true, follow: true`（`/app` のみ noindex）

---

## 11. PWA

- [manifest.ts](src/app/manifest.ts): `start_url: /app`、`theme_color: #0a0a0a`、アイコン `/icons/icon-192.png` etc.
- Service Worker: serwist が `public/sw.js` をビルド時に自動生成
- `apple-mobile-web-app-status-bar-style`: `black-translucent`

---

## 12. ファイル構成（HP関連）

```
src/
  app/
    layout.tsx              ルートレイアウト（GTM, JSON-LD, Cormorantフォント）
    page.tsx                / トップページ
    about/page.tsx          /about
    beans/page.tsx          /beans
    journal/page.tsx        /journal
    globals.css             カラーパレット・@theme・base style
    manifest.ts             PWA manifest
    sitemap.ts / robots.ts  SEO
  components/
    home/
      HeroSection.tsx
      ToolsSection.tsx
      BeansSection.tsx      Server Component（microCMS fetch）
      JournalSection.tsx
      AboutSection.tsx
    about/
      RoasterProfile.tsx    焙煎者プロフィール（JSON-LD）
    layout/
      ConditionalLayout.tsx /app以下でHeader/Footer非表示
      Header.tsx
      Footer.tsx
      InstallBanner.tsx
    ui/
      SectionBlock.tsx      角丸ブロック（max-w-820）
      GradientBackground.tsx 5タイプの背景グラデ
      GrainOverlay.tsx      フィルムグレイン（全ページ最前面）
  libs/
    microcms.ts             microCMSクライアント + Bean / Journal型
Cormorant_Garamond/         ローカルフォント（git管理）
public/
  rogomain.png, og-image.jpg, profile.jpg, etc.
  sounds/                   /app専用、HPでは未使用
```

---

## 13. 運用メモ

- **microCMS 更新**: `https://mumu-coffee.microcms.io` にログイン → 公開で自動デプロイ
- **コピー変更**: 各 `Section.tsx` を直接編集 → push で反映
- **テーマ切り替え**: globals.css の `@theme` を編集（HPはライト固定）
- **ビルド検証**: `npm run build`（webpack）。デプロイ前に必ず通すこと

---

## 14. 主な仕様変更の履歴

| 時期 | 変更 |
|------|------|
| 2026-03 初期 | ダーク基調 / アンバー（#EF9F27） |
| 2026-04-08 | グレイン + ビネット導入 |
| 2026-04-12 | beans / journal をライト化 |
| 2026-04-19 | About に焙煎者プロフィール + Person JSON-LD |
| 2026-04-20 | TOP デザイン刷新（SectionBlock + GradientBackground、Cormorant + Shippori） |
| 2026-04-21 | アンバー → ライム化、ビネット廃止 |
| 2026-04-22 | アクセントライムを `#a3a957`（少し暗めのオリーブ寄り）に確定 |
| 2026-04-23 | TOP コピー全面刷新（4セクション）、エチオピア先頭ソート |
