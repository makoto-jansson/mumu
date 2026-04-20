# mumu ブランドサイト TOPページ デザイン刷新指示書

**バージョン**: v3.0（デザイン刷新版）
**作成日**: 2026年4月20日
**対象**: Claude Code
**優先度**: 最優先（この指示書に従ってTOPページを再実装）

---

## 0. この指示書の位置づけ

既存の `mumu_brand_site_spec.md`（v2.0）が定めた**サイト構成・コンポーネント名・テキスト文言・SVGイラスト**はすべて維持する。
変更するのは**デザイントークン（色・角丸・余白・タイポ）とレイアウト構造**のみ。

### 変更しないもの（既存を維持）

- ページ構成：`/`（TOP）/ `/about` / `/beans` / `/journal` / `/app`
- コンポーネント名：`HeroSection`, `ToolsSection`, `BeansSection`, `JournalSection`, `AboutSection`, `Footer`
- 各セクションの**文言・コピー・本文**（既存実装の通り）
- 各セクションの**SVGイラスト**（夜明け、珈琲豆、本と月、灯台）
- 豆カードの**横スクロール仕様**（microCMS連携、w-48 × aspect-[2/3]、BASE直リンク）
- 技術スタック（Next.js / Tailwind / Framer Motion / microCMS）
- SEO / OGP設定

### 変更するもの（この指示書で定義）

- カラーパレット（黒基調→生成り白基調、新しい5色体系へ）
- タイポグラフィ（セリフ体イタリックの英文を装飾として追加）
- レイアウト（フルスクリーンhero→「額縁構造」のブロック並列へ）
- 余白・角丸・ブロックの最大幅
- ヒーローに**写真スライダー**を新設
- 各セクションに**通し番号（01〜04）と英文副題**を追加

---

## 1. デザイン方針の転換

### 旧：夜の海 × 灯台の光（黒基調）

- 背景：`#0a0a0a`（黒）
- アクセント：`#EF9F27`（琥珀）、`#1D9E75`（ティール）
- ヒーロー：フルスクリーン100vhで灯台アニメーション

### 新：フィルム写真 × 北欧エディトリアル（生成り白基調）

- 背景：`#fdf8ef`（生成り白）
- 複数のティール〜ネイビー系グラデーションを「フィルム写真の陰影」として重ねる
- フィルムグレイン（`feTurbulence`）で粒子感
- ヒーローは100vhではなく、中央配置の**角丸ブロック**（フィルム写真一枚のよう）
- 各セクションも同じ角丸ブロック形式に統一 → **Kinfolk誌のページをめくる感覚**

### インスピレーション

- アキ・カウリスマキ『枯れ葉』の色味
- Kinfolk誌のエディトリアル構成
- minä perhonenの静けさと余白
- 映画『ルイス・オルテガの永遠に僕のもの』の色使い（メインの白地 × 青系の複雑なグラデーション × 差し色のライム）

---

## 2. カラーパレット（完全に差し替え）

### ベース

```css
--color-bg-base: #fdf8ef;      /* 生成り白（ページ全体・ブロック背景のベース） */
--color-ink-primary: #123656;  /* ネイビー（本文・見出し・主要テキスト） */
--color-ink-secondary: #2c6671;/* 深いティール（サブテキスト・ラベル） */
```

### グラデーション構成色（ブロック背景）

```css
--color-grad-teal: #60ae9d;    /* 緑青（明るいティール・朝の光） */
--color-grad-navy: #123656;    /* 深いネイビー（深み・夜） */
--color-grad-deep-teal: #2c6671; /* 深い青緑（中間色・陰影） */
```

### 差し色（極小面積のみで使用）

```css
--color-accent-lime: #cfd57e;  /* ライム（左下ドット、アクセント光） */
```

### 旧カラーの扱い

旧 `#EF9F27`（琥珀）、旧 `#1D9E75`（ティール）、旧 `#0a0a0a`（黒背景）は**全面的に廃止**。
Tailwind設定やグローバルCSSから旧カラー変数は削除すること。

### Tailwind設定例（`tailwind.config.ts`）

```ts
theme: {
  extend: {
    colors: {
      base: '#fdf8ef',
      ink: {
        primary: '#123656',
        secondary: '#2c6671',
      },
      grad: {
        teal: '#60ae9d',
        navy: '#123656',
        deepTeal: '#2c6671',
      },
      accent: {
        lime: '#cfd57e',
      },
    },
  },
}
```

---

## 3. タイポグラフィ

### 和文

- 基本：既存の日本語フォント設定を維持（明朝系があればそれを優先、なければゴシック）
- `font-weight: 300`（ライト）を標準に。**重い太字は避ける**。
- 見出しの letter-spacing：`0.01em`（詰めすぎず、広げすぎず）

### 英文（新規で装飾的に追加）

- **セリフ体イタリック**を多用（`font-style: italic`）
- 用途：
  - ブランド名「mumu」
  - 各セクションの英文副題「— integrate」「— coffee」「— read」
  - 豆の英語名「Ethiopia Sidamo」
  - キャプション「— vol. 01, spring —」
  - 写真のキャプション「lighthouse, dawn · 2025」
- フォント指定：`font-family: 'Cormorant Garamond', 'Noto Serif JP', serif;` など（適宜選定。Google Fontsで揃えると良い）

### サイズ（PC版基準）

| 用途 | サイズ | weight | 備考 |
|---|---|---|---|
| ヒーロー・キャッチコピー | 34px | 300 | line-height: 1.4 |
| セクション見出し（和文） | 26px | 300 | |
| セクションのサブコピー | 20px | 300 | |
| 本文 | 13px | 300 | line-height: 2 |
| CTA | 11px | normal | letter-spacing: 0.25em |
| 通し番号・ラベル | 10px | normal | letter-spacing: 0.3em |

### サイズ（SP版）

すべて2〜4pxずつ縮める：
- ヒーロー・キャッチ：34→26px
- 見出し：26→22px
- サブコピー：20→17px
- 本文：13→12px

---

## 4. レイアウト構造（全面刷新）

### 4.1 ページ全体の骨格

```
<body style="background: #fdf8ef">
  <main style="max-width: 1080px; margin: 0 auto; padding: 2.5rem 2rem;">
    <!-- ブロック群が縦に並ぶ -->
  </main>
</body>
```

- ページ全体の**最大幅 1080px**で中央寄せ
- 画面端まで広げない（生成り白の余白を左右に確保）

### 4.2 各ブロックの最大幅

**重要**：ヒーローを含む各セクションブロックは、**`max-width: 820px`**で中央寄せ。

理由：
- ページ全体は1080pxだが、個別のコンテンツブロックは820pxに絞ることで、**PCでも雑誌の見開き1ページのような引き締まった印象**になる
- 1080pxのまま使うと情報が横に間延びし、フィルム写真的なトーンが崩れる

```tsx
<div className="max-w-[820px] mx-auto mb-6 md:mb-10">
  <div className="relative rounded-[18px] overflow-hidden px-10 py-9 min-h-[460px]">
    {/* グラデーション背景 + コンテンツ */}
  </div>
</div>
```

### 4.3 角丸

- PC版：`border-radius: 18px`
- SP版：`border-radius: 16px`
- 20pxは丸すぎ、12pxは足りない。**18pxが黄金比**

### 4.4 ブロック同士の間隔

- PC版：`margin-bottom: 1.25rem`（20px）
- SP版：`margin-bottom: 1rem`（16px）
- **詰め気味**で連続性を出す。セクション間に大きな空白を入れない

---

## 5. 背景グラデーション（各ブロック共通の作法）

各ブロックの背景は**SVGの重ねがけで作る**。単色やCSS linear-gradientではなく、radialGradientの複数重ね + feTurbulenceのグレインでフィルム質感を再現。

### 5.1 SVG構造（テンプレート）

```tsx
<svg
  className="absolute inset-0 w-full h-full z-[1]"
  preserveAspectRatio="none"
  viewBox="0 0 820 460"
>
  <defs>
    <radialGradient id="gX1" cx="20%" cy="30%" r="65%">
      <stop offset="0%" stopColor="#2c6671" stopOpacity="0.42" />
      <stop offset="100%" stopColor="#2c6671" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="gX2" cx="85%" cy="75%" r="55%">
      <stop offset="0%" stopColor="#123656" stopOpacity="0.35" />
      <stop offset="100%" stopColor="#123656" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="gX3" cx="60%" cy="15%" r="40%">
      <stop offset="0%" stopColor="#60ae9d" stopOpacity="0.28" />
      <stop offset="100%" stopColor="#60ae9d" stopOpacity="0" />
    </radialGradient>
    <filter id="gXgr">
      <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" seed="33" />
      <feColorMatrix values="0 0 0 0 0.08  0 0 0 0 0.15  0 0 0 0 0.2  0 0 0 0.12 0" />
      <feComposite in2="SourceGraphic" operator="in" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="#fdf8ef" />
  <rect width="100%" height="100%" fill="url(#gX1)" />
  <rect width="100%" height="100%" fill="url(#gX2)" />
  <rect width="100%" height="100%" fill="url(#gX3)" />
  <rect width="100%" height="100%" filter="url(#gXgr)" />
</svg>
```

**注意**：`id`はセクションごとに一意にすること（例：`hero-grad-1`, `tools-grad-1`, `beans-grad-1` など）。Next.jsのSSR時に複数のSVGが同ページに存在するとIDが衝突する。

### 5.2 セクションごとの色温度（時間の移ろいを演出）

| セクション | 主色 | 副色 | 意図 |
|---|---|---|---|
| Hero | `#2c6671` + `#123656` + `#60ae9d` | 全色を使う | 世界観の提示 |
| 01 整える | `#60ae9d`（75%,40%,r65%） | `#2c6671`（15%,75%,r55%） | 朝の光・起動 |
| 02 珈琲 | `#123656`（20%,30%,r60%） | `#2c6671`（85%,75%,r55%）+ `#60ae9d`（60%,20%,r35%） | 深み・香り |
| 03 読む | `#60ae9d`（50%,50%,r70%、薄め） | `#2c6671`（90%,80%,r40%、薄め） | 余白・静けさ |
| 04 mumuについて | `#123656`（50%,55%,r75%、強め） + `#2c6671` | `#60ae9d`（20%,15%,r35%） | 瞑想・着地 |

各`feTurbulence`の`seed`値はセクションごとに変える（11, 22, 33, 44, 55など）。

---

## 6. ヒーローセクション（全面刷新）

### 6.1 構造（PC版）

```
┌─────────────────── 820px ───────────────────┐
│ mumu              整える 珈琲 読む mumuについて │ ← ナビ
│                                             │
│ 感性が、ふと、                                │ ← キャッチ（左上）
│ 戻ってくる場所。                              │
│                                             │
│         ┌─────────────────┐                │
│         │  写真（16:9, 364px幅） │            │ ← 写真スライダー（中央）
│         └─────────────────┘                │
│         lighthouse, dawn · 2025    ● ○ ○    │
│                                             │
│                                             │
│ ● LIGHTHOUSE COFFEE ROASTERY   [ロゴ]       │ ← ブランド名・ロゴ
│                                 vol.01 spring│
└─────────────────────────────────────────────┘
```

### 6.2 構造（SP版）

```
┌────────────── 375px ──────────────┐
│ mumu                         ≡    │ ← ハンバーガーメニュー
│                                   │
│ 感性が、ふと、                       │ ← キャッチ
│ 戻ってくる場所。                    │
│                                   │
│ ┌──────────────────────────────┐ │
│ │  写真（16:9 画面幅いっぱい）      │ │ ← 写真スライダー（大きく）
│ └──────────────────────────────┘ │
│ lighthouse, dawn · 2025    ● ○ ○ │
│                                   │
│         [ロゴ]                    │ ← 中央配置
│       vol.01 spring               │
│                                   │
│  ● LIGHTHOUSE COFFEE ROASTERY    │ ← 最下部中央
└───────────────────────────────────┘
```

### 6.3 要素詳細

#### ナビゲーション（PC版）
- 左：`<p>mumu</p>`（セリフ体イタリック, 15px, ink-primary）
- 右：日本語4項目を横並び `gap: 1.75rem`
  - 「整える」「珈琲」「読む」「mumuについて」
  - 13px, ink-secondary, letter-spacing 0.15em

#### ナビゲーション（SP版）
- 左：`<p>mumu</p>`（14px）
- 右：**ハンバーガーメニュー（3本線）**
  - 横線3本：`width: 18px; height: 1px; background: #123656`
  - gap 4px
  - タップでドロワー or フルスクリーンメニュー展開（実装は既存のmobile menu componentを流用可）

#### キャッチコピー
- 文言：**「感性が、ふと、／戻ってくる場所。」**（既存の旧ヒーローの文言と同じ）
- セリフ体、PC 34px / SP 26px
- `line-height: 1.4`, `font-weight: 300`
- `<br/>`で改行を明示

#### 写真スライダー（新規追加）
- **PC**：幅 364px、`aspect-ratio: 16/9`、画面中央配置（`margin: 1.75rem auto 0`）
- **SP**：幅 100%、`aspect-ratio: 16/9`
- 写真の表示：`<Image>` or `<img>`、`object-fit: cover`、`border-radius: 3px`
- フレーム・白フチ・影・傾き：**すべて無し**（フレームレス、真っ直ぐ）
- 写真下：
  - 左：キャプション（セリフ体イタリック、10px, secondary, opacity 0.75）
  - 右：縦3点（SPは横3点）インジケーター
    - `width/height: 5px`、`border-radius: 50%`、`background: ink-primary`
    - 現在表示は opacity 1、他は 0.25
- **自動切替**：4〜6秒ごとにフェードで切替（Framer Motion）
- **手動操作**：スワイプ、クリック、左右矢印キー対応

#### 写真データ
当初は3枚程度の静的画像（`/public/hero/photo-01.jpg` 等）で実装開始。
microCMSに `heroPhotos` API を後から追加する想定で、**データ構造を先に定義**：

```ts
type HeroPhoto = {
  id: string;
  image: string;      // 画像URL
  caption: string;    // "lighthouse, dawn · 2025" 等
  altText: string;
};
```

#### ロゴ（右下・絶対位置）
- 既存の `public/mumu_logo.png`（元の黒のまま。色変換しない）を使用
- `<Image src="/mumu_logo.png" width={60} height={78} alt="mumu" />`
- その下に「— vol. 01, spring —」（セリフ体イタリック、9px, secondary, letter-spacing 0.3em）

#### ブランド名バッジ（左下・絶対位置）
- ライムドット（`#cfd57e`）5〜6px
- 「LIGHTHOUSE COFFEE ROASTERY」（10px, ink-primary, letter-spacing 0.25em）

#### SP版の位置調整
- ロゴは写真の下、中央寄せ（`flex flex-col items-center`）
- ブランド名バッジは最下部中央（`absolute bottom-5 left-0 right-0 flex justify-center`）

### 6.4 注意：旧実装の破棄

既存の `<Lighthouse />`, `<Waves />`（Framer Motion SVG）コンポーネントは**ヒーローからは撤去**。
ただし、灯台のSVGイラストは **Section 04 mumuについて**で小さいアイコンとして再利用する可能性があるので、コンポーネントは残しておく（削除しない）。

---

## 7. セクション01「整える」（ToolsSection）

### 7.1 レイアウト（PC版）

```
┌─────────────── 820px ───────────────┐
│ [夜明けSVGアイコン 52px]                │
│ 01                                   │
│ 整える                                │
│ — integrate                         │
│                  │                   │
│ ──180px──        │ ──1fr──            │
│                  │                   │
│                  │ 四つの時間。          │
│                  │ 集中、休息、         │
│                  │ ひらめき、回復。      │
│                  │                   │
│                  │ 一杯の珈琲を淹れ...   │
│                  │                   │
│                  │ アプリをひらく →     │
└──────────────────┴───────────────────┘
```

- 左カラム 180px 固定、右カラム `1fr`
- `display: grid; grid-template-columns: 180px 1fr; gap: 2.5rem`

### 7.2 要素

- **既存の夜明けSVGイラスト**を左カラム上部に配置（**アイコンサイズに縮小**、52px）
  - 既存の `<Dawn />` などのコンポーネントがあれば、サイズprop（`size={52}`）で縮小指定
  - 色は `stroke: #123656` に変更
- 通し番号「**01**」：10px, `#60ae9d`, letter-spacing 0.3em
- 和文見出し「**整える**」：26px, 300, ink-primary
- 英文副題「**— integrate**」：11px, secondary, italic, letter-spacing 0.2em

### 7.3 文言（既存維持）

右カラム：
- **タイトル**（20px, serif, 300）：「集中。リラックス。クリエイティブ。／感性が回復する、アプリ。」
- **説明**（13px, secondary, line-height: 2）：「自分らしさを取り戻す、4つのモード。」
- **CTA**：「アプリを使ってみる →」 → `/app`

※既存の文言をそのまま使用。装飾だけ新デザインに合わせる。

### 7.4 SP版

1カラム縦積み：
- アイコン（44px）
- 01
- 整える
- — integrate
- 空白 1rem
- タイトル（17px）
- 本文（12px）
- CTA

---

## 8. セクション02「珈琲」（BeansSection）

### 8.1 レイアウト（PC版）

上段：2カラムヘッダー（Section 01と同じ構造）
- 左カラム：珈琲豆アイコン / 02 / 珈琲 / — coffee
- 右カラム：タイトル + 説明文

下段：**豆カード横スクロール**（既存仕様維持）
- カード幅：170px、aspect-ratio: 2/3
- 2枚の豆カード + 「coming soon」カード
- 「すべての豆を見る」リンクを右寄せで配置

### 8.2 要素

#### 豆アイコン（左カラム）
- **既存のBeansSectionのSVGイラスト**を縮小して使用（52px）
- 色は `stroke: #123656`

#### 見出しエリア（右カラム）
- タイトル（20px, serif, 300）：「スペシャルティの豆を、ていねいに焙煎して。」
- 説明（13px, secondary）：「浅煎りから深煎りまで、そのときどきの一杯を。」

※上記は**新規の装飾コピー**。既存コピーがあればそれを優先。

#### 豆カード（既存のmicroCMS連携維持）

```tsx
<a href={bean.baseUrl} className="flex-none w-[170px]">
  <div className="aspect-[2/3] bg-base/55 border border-ink-primary/25 rounded-lg overflow-hidden flex flex-col">
    {/* 画像エリア（2/3） */}
    <div className="flex-1 relative">
      <Image src={bean.image} alt={bean.name} fill className="object-cover" />
    </div>
    {/* テキストエリア */}
    <div className="px-3 py-2.5">
      <p className="font-serif italic text-xs text-ink-primary">{bean.name}</p>
      <p className="text-[9px] text-ink-secondary tracking-widest">
        {bean.roast === 'light' ? 'LIGHT · 浅煎り' : 'DARK · 深煎り'}
      </p>
      <p className="text-[10px] text-ink-secondary">{bean.flavor}</p>
      <p className="text-[11px] text-ink-primary font-medium tabular-nums">¥{bean.price}</p>
    </div>
  </div>
</a>
```

- **重要**：カード内の画像は`aspect-[2/3]`の上部 flex-1 に配置 → テキストは下に自動配置
- 既存のmicroCMS連携ロジック（取得・表示）は維持

#### coming soonカード
- microCMSの豆データが2件しかない場合、3枚目として表示
- `border: 0.5px dashed rgba(18, 54, 86, 0.3)`
- 中央に「coming soon」（セリフ体イタリック）と「NEXT RELEASE」

#### 「すべての豆を見る」
- カードの下、`text-align: right`
- 11px, ink-primary, `border-bottom: 0.5px solid`

### 8.3 SP版

- ヘッダー部：1カラム縦積み（アイコン → 01 → 珈琲 → — coffee → タイトル → 説明）
- 豆カード：幅 140px、`margin: 0 -1.5rem; padding-left/right: 1.5rem`で**画面端まで広げてスクロール**

---

## 9. セクション03「読む」（JournalSection）

### 9.1 レイアウト（PC版）

Section 01と同じ2カラム構造。

### 9.2 要素

- **既存の本と月のSVGイラスト**を縮小（52px）、ネイビー線に
- 通し番号「03」
- 和文見出し「読む」
- 英文副題「— read」

### 9.3 文言（既存維持 or 新規）

右カラム：
- タイトル：「ちいさな読み物。」
- 説明：「淹れる手の記憶、季節の匂い、ふと思い出す風景のこと。」
- CTA：「読み物を見る →」 → `/journal`

※既存の文言を優先。無ければ上記を使用。

---

## 10. セクション04「mumuについて」（AboutSection）

### 10.1 レイアウト（全デバイス共通）

**中央寄せ**。他の3セクションと違い、2カラムではない。

```
┌─────────────── 820px ───────────────┐
│                                     │
│         [灯台SVGアイコン 46×62]       │
│                 04                  │
│            mumuについて              │
│                                     │
│         灯台のように、                 │
│        静かに光をともすこと。           │
│                                     │
│      忙しい日々のなかで、...          │
│                                     │
│         ストーリーを読む →            │
│                                     │
└─────────────────────────────────────┘
```

- 内部コンテンツは `max-width: 440px; margin: 0 auto; text-align: center`

### 10.2 要素

#### 灯台アイコン
- **既存のAboutSectionのSVGイラスト**を縮小（46×62px）
- 屋根と光は `#cfd57e`（ライム、差し色）
- 本体線は `#123656`（ネイビー）
- 水面の波は `#2c6671` opacity 0.5

#### テキスト
- 「04」
- 「mumuについて」（19px）
- **詩的引用**（20px, serif, italic, 300）：「灯台のように、／静かに光をともすこと。」
- 本文（12px, secondary）：「忙しい日々のなかで、ふと自分に戻るための場所でありたくて。」
- CTA：「ストーリーを読む →」 → `/about`

※既存の文言があればそれを優先。

---

## 11. フッター（Footer）

### 11.1 レイアウト（PC版）

```
┌────────────────── 820px ──────────────────┐
│ ● 灯台の珈琲焙煎所 mumu        INSTAGRAM  NOTE  SHOP │
│ ───────────────────────────────────────── │
│ © 2026 LIGHTHOUSE COFFEE ROASTERY mumu  — all rights reserved — │
└───────────────────────────────────────────┘
```

### 11.2 要素

- 左：ライムドット + ブランド名「灯台の珈琲焙煎所 mumu」（12px, serif, italic, ink-primary）
- 右：SNSリンク（INSTAGRAM / NOTE / SHOP）
  - 10px, secondary, letter-spacing 0.2em
  - 既存のInstagram（`https://www.instagram.com/mumu_coffee_roaster/`）を維持
  - SHOPは BASE のストアURLへ
- 区切り線：`border-top: 0.5px solid rgba(44, 102, 113, 0.2)`
- コピーライト行：
  - 左：「© 2026 LIGHTHOUSE COFFEE ROASTERY mumu」（9px, `#60ae9d`, letter-spacing 0.2em）
  - 右：「— all rights reserved —」（9px, serif, italic, `#60ae9d`）

### 11.3 SP版

1カラム縦積み：
- ブランド名（トップ）
- SNSリンク（横並び）
- 区切り線
- 著作権2行（縦積み）

---

## 12. 実装の進め方（推奨順序）

1. **デザイントークンの差し替え**
   - `tailwind.config.ts` にカラーパレットを追加
   - `globals.css` の `body` 背景を `#fdf8ef` に
   - 旧カラー変数を削除

2. **共通コンポーネントの作成**
   - `<GradientBackground>` コンポーネント（sectionType propでグラデ色を切替）
   - `<SectionBlock>` コンポーネント（max-w-820 + rounded-18 + padding）

3. **ヒーローの刷新**
   - `<HeroSection>` を書き直し
   - `<PhotoSlider>` コンポーネント新設（Framer Motionでフェード切替、自動再生、手動操作）
   - 旧 `<Lighthouse />`, `<Waves />` の参照を削除

4. **各セクションの刷新**
   - `<ToolsSection>`, `<BeansSection>`, `<JournalSection>`, `<AboutSection>` を新レイアウトに
   - 文言は既存のまま保持
   - イラストは縮小 + 色変更

5. **フッターの刷新**
   - 新レイアウトに組み替え

6. **レスポンシブ確認**
   - PC（1440px想定）、タブレット（820〜1024px）、SP（375px）で確認
   - max-widthでの切り詰めが正しく効くか

7. **写真データの用意**
   - `/public/hero/` に3枚の仮画像を配置（被写体：灯台の夜明け、珈琲を淹れる手、窓辺の光など）
   - キャプションを含むデータ配列を `lib/hero-photos.ts` などに

---

## 13. 実装上の注意点

### 13.1 SVGのID衝突回避

複数セクションで `<radialGradient>` の ID を使うため、必ずセクションごとに一意なプレフィックスを付ける：
- ヒーロー：`hero-g1`, `hero-g2`, `hero-g3`, `hero-grain`
- 整える：`tools-g1`, `tools-g2`, `tools-grain`
- 珈琲：`beans-g1`, ...
- 読む：`journal-g1`, ...
- mumuについて：`about-g1`, ...

### 13.2 フィルムグレインのパフォーマンス

`feTurbulence` は描画コストが高い。`baseFrequency: 0.75`, `numOctaves: 3` で留める。`numOctaves: 5`以上にしない。

### 13.3 写真の lazy loading

ヒーロー写真スライダーの2枚目以降は `loading="lazy"`。1枚目は `priority`。

### 13.4 アニメーション

Framer Motionで**控えめに**：
- 各セクションブロックのフェードイン（`whileInView` で 0.5s の opacity 0→1）
- 写真スライダーのフェード切替（0.8s）
- 派手なスライドイン・ズーム・回転は使わない（Kinfolk的な静けさを損なう）

### 13.5 旧実装で残すもの / 消すもの

**残す**：
- 各セクションのSVGイラスト（縮小・色変更して再利用）
- microCMS連携ロジック（beans, journal）
- PWA設定
- `/about`, `/beans`, `/journal`, `/app` 等の下層ページ（TOP以外は今回のスコープ外）

**消す**：
- 旧ヒーローのフルスクリーン100vh構造
- 旧カラー変数（#EF9F27, #1D9E75, #0a0a0a など）
- `<Lighthouse />` のヒーロー上での使用（コンポーネント自体は残す）

---

## 14. デザイン参照資料

- ヒーロー・完成形：チャット内のキャンバスで確認済み
- 各セクション：チャット内のキャンバスで確認済み
- カラーパレット：本ドキュメント Section 2
- ロゴ画像：`/mnt/user-data/uploads/名称未設定のテ_サ_イン__27_.png`（元の黒のまま、色変換しない）

---

## 15. 完成の基準

以下が満たされていれば完成とみなす：

- [ ] PC版（1440px想定）で各ブロックが820px幅、左右に生成り白の余白
- [ ] SP版（375px）で各ブロックが画面幅いっぱい、縦1カラム
- [ ] ヒーローに写真スライダー（3枚、4〜6秒自動切替）
- [ ] 各セクションにグラデーション + フィルムグレイン
- [ ] 通し番号（01〜04）と英文副題が各セクションに配置
- [ ] 既存のテキスト・イラスト資産がすべて維持されている
- [ ] CTA、SNSリンク、ページ内ナビが全て機能する
- [ ] PageSpeed Insights スコア：モバイル 80+、デスクトップ 90+
- [ ] Lighthouse Accessibility スコア：90+

---

以上。不明点があれば個別に確認する。
