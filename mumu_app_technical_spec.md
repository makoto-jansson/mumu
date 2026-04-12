# mumu — 技術仕様書

## Claude Code 実装ガイド

**バージョン**: v2.2  
**更新日**: 2026年4月12日  
**対象**: 灯台の珈琲焙煎所mumu Webアプリ (`/app/*`)

---

## 1. プロジェクト構成

### 1.1 技術スタック

```
フレームワーク: Next.js 16.2.2 (App Router, Turbopack)
言語: TypeScript
スタイリング: Tailwind CSS
アニメーション: Framer Motion
音声: Howler.js（アンビエント音再生）
状態管理: Zustand (persist middleware → localStorage)
データ永続化: localStorage（現行）
PWA: @serwist/next（開発環境では無効: disable: process.env.NODE_ENV === "development"）
ホスティング: Vercel
```

### 1.2 ディレクトリ構造（現行）

```
mumu/
├── public/
│   ├── sounds/                # アンビエント音ファイル（.wav）
│   │   └── pour.wav           # Relax BGM
│   ├── icons/                 # PWAアイコン
│   ├── manifest.webmanifest
│   └── sw.js                  # Serwist生成（本番のみ）
├── src/
│   ├── app/
│   │   ├── layout.tsx               # ルートレイアウト（SEO meta）
│   │   ├── page.tsx                 # ブランドサイトホーム（/）
│   │   ├── about/page.tsx
│   │   ├── beans/page.tsx
│   │   ├── journal/page.tsx
│   │   └── app/                     # ← Webアプリはここ
│   │       ├── layout.tsx           # アプリレイアウト（BottomNav含む）
│   │       ├── page.tsx             # アプリホーム（/app）
│   │       ├── focus/page.tsx       # Focusモード
│   │       ├── relax/page.tsx       # Relaxモード
│   │       ├── spark/page.tsx       # Sparkモード
│   │       ├── dashboard/page.tsx   # My cup ダッシュボード
│   │       ├── routine/page.tsx     # ルーティン設定
│   │       └── reclaim/page.tsx     # Reclaimモード
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ConditionalLayout.tsx    # ブランドサイト用レイアウト切替
│   │   │   └── InstallBanner.tsx        # PWAインストールバナー
│   │   ├── app/layout/
│   │   │   └── BottomNav.tsx            # アプリ専用BottomNav（ホーム/My cup/ルーティン）
│   │   ├── animations/
│   │   │   ├── Lighthouse.tsx           # 灯台SVGアニメーション
│   │   │   ├── Waves.tsx                # 波アニメーション
│   │   │   ├── Drip.tsx                 # ドリップアニメーション（CoffeeTime用）
│   │   │   ├── FocusScene.tsx           # 集中セッション用背景アニメ
│   │   │   ├── AmbientOrbs.tsx          # 環境オーブアニメーション
│   │   │   └── ButtonOrb.tsx            # ボタン内グロー演出
│   │   ├── focus/
│   │   │   ├── StepBar.tsx              # 進捗バー（Focus/Relax/Spark共用）
│   │   │   ├── RollerPicker.tsx         # スクロール式数値ピッカー
│   │   │   ├── FocusSetup.tsx           # 開始前設定
│   │   │   ├── CoffeeTime.tsx           # 珈琲タイム（3分、Focus/Relax共用）
│   │   │   ├── FocusSession.tsx         # 集中セッション画面
│   │   │   ├── FocusBreak.tsx           # 休憩画面（5分タイマー）
│   │   │   ├── SessionSummary.tsx       # セッション終了サマリー
│   │   │   └── BreathGuide.tsx          # 呼吸ガイドコンポーネント
│   │   ├── relax/
│   │   │   ├── RelaxSetup.tsx           # 気分・時間選択
│   │   │   ├── RelaxSession.tsx         # 呼吸セッション（灯台ビジュアル）
│   │   │   └── RelaxDone.tsx            # 完了画面（日替わりプロンプト＋ペアリング）
│   │   └── spark/
│   │       ├── SparkGuide.tsx           # オズボーン説明＋操作ガイド（2タブ）
│   │       ├── SparkShuffle.tsx         # カードめくり発想画面（FlipCell、スワイプ）
│   │       ├── SparkAmbient.tsx         # アンビエント背景（オーブ＋呼吸グロー）
│   │       ├── SparkMyGrid.tsx          # 自分テーマでオズボーン9マス入力
│   │       └── SparkDone.tsx            # 完了画面（キープ一覧＋珈琲レコメンド）
│   │   ├── reclaim/
│   │   │   ├── ReclaimIntro.tsx         # 導入画面（珈琲あり/なし選択）
│   │   │   ├── ReclaimSense.tsx         # Step 1: 感覚を開く（五感プロンプト）
│   │   │   ├── ReclaimFeel.tsx          # Step 2: 対比カード（スワイプ/タップ）
│   │   │   ├── ReclaimSettle.tsx        # Step 3: 沈殿（34秒、操作なし）
│   │   │   ├── ReclaimDone.tsx          # 完了画面（スナップショット＋ひとこと）
│   │   │   └── ReclaimSnapshot.tsx      # 感性スナップショットオーブ
│   │   └── app/
│   │       └── TodayRoutine.tsx         # 今日のルーティン表示（アプリホーム上部）
│   ├── store/
│   │   ├── historyStore.ts              # セッション履歴（Zustand persist）
│   │   ├── routineStore.ts              # ルーティン設定（Zustand persist）
│   │   └── sessionStore.ts              # 現在セッション状態
│   ├── data/
│   │   ├── sparkCardsV2.json            # Sparkカードデッキ（makingシーン 230テーマ）
│   │   ├── sensoryPrompts.json          # 日替わり感性プロンプト
│   │   ├── pairings.json                # Relax完了ペアリングデータ
│   │   └── coffeeInfo.json              # mumuの豆情報
│   ├── hooks/
│   │   ├── useTimer.ts                  # タイマーロジック（Date.now()差分）
│   │   └── useBreath.ts                 # 呼吸リズム（14秒サイクル）
│   └── lib/
│       ├── emotionDetector.ts           # 感情検出（現在未使用）
│       ├── getDailyPrompt.ts            # 日替わりプロンプト取得
│       ├── getPairing.ts                # mood → ペアリング取得
│       └── storage.ts                   # localStorageラッパー
```

---

## 2. データ型定義

### 2.1 Focusモード

```typescript
// FocusSetup.tsx
export type FocusConfig = {
  duration: number;                         // 5〜60（RollerPickerで任意設定）
  task: string;                             // やること（任意）
  ambient: "波" | "焚き火" | "カフェ" | "音楽";
};
```

### 2.2 Relaxモード

```typescript
// RelaxSetup.tsx
export type RelaxConfig = {
  mood: "疲れた" | "もやもや" | "ぼんやりしたい";
  duration: number;  // 3,5,10,15,...60（RollerPickerで選択）
};
```

### 2.3 Sparkモード

```typescript
// SparkShuffle.tsx
export type OsborneCategory =
  | "adapt" | "apply" | "modify" | "magnify" | "minify"
  | "substitute" | "rearrange" | "reverse" | "combine";

// スワイプでキープしたテーマ（テーマ単位）
export type KeptTheme = {
  themeId: string;
  themeLabel: string;
  keywords: Record<OsborneCategory, string>;  // 各マスのキーワード（フリップ済み）
};

// SparkMyGrid.tsx
export type MyGridResult = {
  theme: string;                             // ユーザーが入力したテーマ
  cells: Partial<Record<OsborneCategory, string>>;  // 入力済みマスのみ
};
```

### 2.4 履歴ストア（historyStore.ts）

```typescript
export type SessionEntry = {
  id: string;
  type: "focus" | "relax" | "walk" | "spark" | "reclaim";
  date: string;      // ISO 8601
  duration: number;  // 分
  task?: string;     // Focus のみ
  mood?: string;     // Relax のみ
  sets?: number;     // Focus のみ
};
```

### 2.5 ルーティンストア（routineStore.ts）

```typescript
export type TimeSlot = "朝" | "昼" | "夜";
export type ModeType = "focus" | "relax" | "spark" | "reclaim";

export type RoutineEntry = {
  id: string;      // nanoid
  day: number;     // 0=月 〜 6=日
  slot: TimeSlot;
  mode: ModeType;
};

// Zustand persist: name="mumu-routine"
// actions:
//   addEntry(day, slot, mode): void   → nanoid でID生成して追加
//   removeEntry(id): void
```

---

## 3. 画面仕様

### 3.1 アプリホーム（`/app`）

**実装ファイル**: `src/app/app/page.tsx`

```
┌─────────────────────────────┐
│                             │
│    [灯台SVGアニメーション]    │
│    光が回転 / 波が揺れる      │
│                             │
│  感性を、取り戻す。          │
│  つくる人の、集中とひらめき   │
│                             │
│  [今日のルーティン]          │  ← TodayRoutine（登録があれば表示）
│  朝 → Focus / 夜 → Reclaim  │
│                             │
│  すべてのモード              │
│  ┌──────────────────────┐   │
│  │ Focus  深く集中する → │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ Relax  呼吸を整え...  │   │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ Spark  思考をかき混ぜ →│  │
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │ Reclaim 感性のメンテ  │   │
│  │              ナンスを →│  │
│  └──────────────────────┘   │
│                             │
│  mumuの珈琲豆はこちら →      │  ← BASEへ外部リンク
│  ← HPに戻る                 │  ← ブランドサイト（/）へ
│                             │
├─────────────────────────────┤
│  🏠 ホーム  📊 My cup  🗓    │  ← BottomNav
└─────────────────────────────┘
```

**実装詳細**:
- アニメーション: `<Lighthouse />` + `<Waves />`（SVG + Framer Motion）
- 全4モード有効（`available: true`）。Reclaimも通常リンクとして表示
- モード説明文:
  - Focus: 「深く集中する時間をつくる」
  - Relax: 「呼吸を整え、脳のゴミを排出する時間」
  - Spark: 「思考をかき混ぜてクリエイティブを生む」
  - Reclaim: 「感性のメンテナンスをする」
- BASEリンク: `https://mumucoffee.theshop.jp/`
- HPに戻るリンク: `/`（`← HP に戻る`）
- TodayRoutine: `routineStore` から今日の曜日に登録されたエントリを表示。なければ非表示
- BottomNav: ホーム(`/app`) / My cup(`/app/dashboard`) / ルーティン(`/app/routine`)

---

### 3.2 Focusモード（`/app/focus`）

**フロー**: `setup → coffee → session → break → session... → summary`

**実装ファイル**: `src/app/app/focus/page.tsx`（オーケストレーター）

#### 3.2.1 開始前画面（FocusSetup）

```
┌─────────────────────────────┐
│  準備 ──── 珈琲 ── 集中 ──  │  ← StepBar
│                             │
│  ☀ Focus                    │
│  珈琲を淹れてから             │
│  始めましょう。               │
│  カフェインが集中力の立ち上が │
│  りを助けてくれます。         │
│                             │
│  [スクロール式時間ピッカー]   │  ← RollerPicker（5〜60分）
│         25分                │
│                             │
│  やること（任意）             │
│  ┌──────────────────────┐   │
│  │ 企画書の下書き...       │   │
│  └──────────────────────┘   │
│                             │
│  BGM                        │
│  [波] [焚き火] [カフェ] [音楽]│  ← 4択ボタン（ButtonOrb演出）
│                             │
│  ┌──────────────────────┐   │
│  │    準備できました       │   │  ← → CoffeeTime へ
│  └──────────────────────┘   │
│  珈琲なしで始める →           │  ← → 直接 FocusSession へ
└─────────────────────────────┘
```

**実装詳細**:
- `RollerPicker`: ドラム式スクロールで分数選択（デフォルト25分）
- BGMは `FocusConfig.ambient` に保持。実際の音声ファイルは `public/sounds/`
- 「準備できました」→ `onStart(config)` → coffee phase
- 「珈琲なしで始める」→ `onSkip(config)` → 直接 session phase

#### 3.2.2 珈琲タイム（CoffeeTime）

**Focus/Relax共用コンポーネント**。`StepBar` の `steps` prop で切替。

```
┌─────────────────────────────┐
│  準備 ── ▶珈琲── 集中 ──    │  ← StepBar（珈琲アクティブ）
│                             │
│  [ドリップアニメーション]    │  ← <Drip /> SVG
│  お湯がゆっくり落ちる        │
│                             │
│  3:00 → 0:00 カウントダウン  │
│                             │
│  スキップ →                  │
└─────────────────────────────┘
```

**実装詳細**:
- 3分（180秒）固定。`useTimer` hook
- タイマー完了 → 自動で `onComplete()`
- スキップボタンでも `onComplete()`（同じコールバック）

#### 3.2.3 集中セッション画面（FocusSession）

```
┌─────────────────────────────┐
│                             │
│        23:45                │  ← 残り時間（大きく: clamp(3rem, 15vw, 5rem)）
│                             │
│  [FocusScene アニメーション] │  ← 灯台＋霧の海
│                             │
│  企画書の下書き               │  ← task（opacity 0.4）
│                             │
│  ━━━━━━━━━━━━━━━          │  ← 進捗バー（1-progress）
│                             │
│      ⏸          ■          │  ← 一時停止 / 終了（丸ボタン）
│   一時停止      終了          │
└─────────────────────────────┘
```

**実装詳細**:
- `fixed inset-0 z-[100]`（BottomNav非表示）
- `useTimer`: `requestAnimationFrame` + `Date.now()`差分でバックグラウンド動作
- Howler.js でBGMループ再生（音量 ambient に応じて設定）
- タイマー完了: `navigator.vibrate([200, 100, 200])` + `onBreak(actualMinutes)`
- 終了ボタン: 経過時間を計算して `onBreak(elapsedMin)` を呼ぶ

#### 3.2.4 休憩画面（FocusBreak）

```
┌─────────────────────────────┐
│                             │
│  お疲れさまでした。           │
│                             │
│  [日替わり感性プロンプト]    │  ← getDailyPrompt()
│  窓の外で一番遠くにあるもの   │
│  を10秒見つめてみてください。 │
│                             │
│  [5分カウントダウン表示]     │
│                             │
│  ┌──────────────────────┐   │
│  │   もう1セット集中する   │   │  ← onNextSet()
│  └──────────────────────┘   │
│  ┌──────────────────────┐   │
│  │   今日はここまで       │   │  ← onFinish()
│  └──────────────────────┘   │
└─────────────────────────────┘
```

**実装詳細**:
- 休憩タイマー: 5分（300秒）。`useTimer`
- `getDailyPrompt()`: `sensoryPrompts.json` から日付ハッシュで選択
- 5分経過してもボタンタップを待つ（自動遷移なし）

#### 3.2.5 終了サマリー（SessionSummary）

```
┌─────────────────────────────┐
│  ☀ Focus                    │
│  今日の集中                  │
│  [集中時間に応じた一言]       │
│                             │
│  ─────────────────────────  │
│  Xセット / XX分              │
│  やること: [task]            │
│                             │
│  ふりかえり（任意）           │
│  ┌──────────────────────┐   │
│  │                       │   │
│  └──────────────────────┘   │
│                             │
│  [珈琲補充提案（7日に1回）]   │  ← shouldShowCoffeeRecommend()
│  珈琲豆、そろそろ足りてますか？│
│                豆を探す →    │  ← BASEリンク
│                             │
│  ← モード選択に戻る          │  ← /app
└─────────────────────────────┘
```

**珈琲補充提案の表示ロジック**:
- `historyStore.shouldShowCoffeeRecommend()`: 前回表示から7日以上経過していたら `true`
- 表示後 `markCoffeeRecommendShown()` で `lastCoffeeRecommendAt` を更新
- **集中時間に応じた一言**（`getEndMessage`）:
  - ≤15分: 「よく集中できていましたよ。小さな波も、積み重なれば遠くまで届きます。」
  - ≤45分: 「波が穏やかでした。いい航海でしたね。」
  - 45分超: 「長い航海でした。霧が晴れて、遠くまで見渡せます。」

---

### 3.3 Relaxモード（`/app/relax`）

**フロー**: `setup → coffee → session → done`

**実装ファイル**: `src/app/app/relax/page.tsx`

#### 3.3.1 開始前画面（RelaxSetup）

```
┌─────────────────────────────┐
│  準備 ── ▶珈琲── 呼吸 ──完了│  ← StepBar（RELAX_STEPS）
│                             │
│  ☽ Relax                   │
│  珈琲を淹れて、              │
│  ゆっくり始めましょう。       │
│  呼吸に合わせて、静かに整えて │
│  いきます。                  │
│                             │
│  今の気分は？                │
│  [疲れた] [もやもや] [ぼんやり]│  ← 3択ボタン
│                             │
│  [スクロール式時間ピッカー]   │  ← RollerPicker（3,5,10,15,...60分）
│                             │
│  ┌──────────────────────┐   │
│  │    はじめる            │   │  ← → CoffeeTime(RELAX_STEPS) へ
│  └──────────────────────┘   │
│  珈琲なしで始める →           │  ← → 直接 RelaxSession へ
└─────────────────────────────┘
```

**実装詳細**:
- CoffeeTime に `steps={RELAX_STEPS}` を渡してステップバーをRelax用に切替
- `RELAX_OPTIONS = [3, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60]`（分）

#### 3.3.2 呼吸セッション画面（RelaxSession）

```
┌─────────────────────────────┐
│  準備 ── 珈琲 ──▶呼吸── 完了│  ← StepBar
│                             │
│         3:22                │  ← 残り時間（小さく）
│                             │
│         吸う...              │  ← フェーズラベル（吸う/止める/吐く）
│                             │
│  [灯台SVGアニメーション]     │  ← BreathLighthouse（呼吸に連動）
│  ハローが膨らむ/縮む          │
│  波が静かにアニメ             │
│                             │
│  [一時停止] [終了]           │
└─────────────────────────────┘
```

**呼吸リズム（useBreath.ts）**:
```typescript
const BREATH_CYCLE = {
  inhale: 4000,   // 吸う 4秒
  hold:   4000,   // 止める 4秒
  exhale: 6000,   // 吐く 6秒
}
// 合計 14秒で1サイクル
// scale: 1.0（exhale完了）→ 1.75（inhale完了）
// brightness: 0（exhale）→ 1（inhale完了）
```

**実装詳細**:
- `BreathLighthouse`: Framer Motion の `useTransform` でスケール/輝度→ハロー半径/opacity を連動
- BGM: `Howler.js` で `pour.wav` ループ再生（音量0.18）
- タイマー完了 → BGMフェードアウト → `onDone()`

#### 3.3.3 完了画面（RelaxDone）

```
┌─────────────────────────────┐
│  ☽ Relax                   │
│  お疲れさまでした。           │
│  [日替わりプロンプト文]       │  ← getDailyPrompt()
│                             │
│  ─────────────────────────  │
│  ✦ ペアリング                │
│  🎵 [曲名 — アーティスト]    │  ← Spotifyリンク付き
│  🍫 [お菓子提案]             │
│                             │
│  [珈琲補充提案（7日に1回）]   │  ← shouldShowCoffeeRecommend()
│  珈琲豆、そろそろ足りてますか？│
│  mumuの豆を見てみる →        │
│                             │
│  ← モード選択に戻る          │  ← /app
└─────────────────────────────┘
```

**ペアリング取得ロジック（getPairing.ts）**:
- `pairings.json` から mood をキーに音楽・お菓子ペアリングを取得
- 季節・時間帯による分岐あり

---

### 3.4 Sparkモード（`/app/spark`）

**フロー**: `guide → shuffle → mygrid → done`

**実装ファイル**: `src/app/app/spark/page.tsx`（オーケストレーター）

```typescript
// phase遷移と状態管理
type Phase = "guide" | "shuffle" | "mygrid" | "done";
// guide完了 → SparkShuffle(sceneId="making") → SparkMyGrid → SparkDone
```

#### 3.4.1 説明画面（SparkGuide）

```
┌─────────────────────────────┐
│  準備 ── 発想 ── 展開 ── 完了│  ← StepBar（SPARK_STEPS、current="setup"）
│                             │
│  ⚡ Spark                   │
│                             │
│  [オズボーンとは] [操作ガイド]│  ← 2タブ切り替え
│  ─────────────────────────  │
│                             │
│  ＜オズボーンとはタブ＞       │
│  9つの視点で強制発想          │
│                             │
│  [3×3グリッドプレビュー]      │
│  転用/応用/変更               │
│  拡大/縮小/代用               │
│  再配置/逆転/結合             │
│                             │
│  ＜操作ガイドタブ＞           │
│  □ マスをタップ — 裏返す      │
│  → 右スワイプ — テーマをキープ │
│  ← 左スワイプ — パス          │
│                             │
│  [カードをはじめる →]         │
└─────────────────────────────┘
```

**実装詳細**:
- `page` state: `"concept" | "howto"` でタブ切り替え（AnimatePresence）
- グリッドプレビューはカテゴリ名+問い文のみ（静的表示）
- 「カードをはじめる」→ `onStart()` → shuffle phase へ

#### 3.4.2 カード発想画面（SparkShuffle）

```
┌─────────────────────────────┐
│  準備 ──▶発想── 展開 ── 完了 │  ← StepBar（current="shuffle"）
│                             │
│  [SparkAmbient 背景]        │  ← オーブ＋呼吸グロー
│                             │
│  X / 230                    │  ← 進捗カウンター
│  ものをつくりたい            │  ← シーンラベル
│                             │
│         テーマ               │
│    [テーマ名（大きく）]       │
│                             │
│  ┌─────────────────────┐    │
│  │  転用  │ 応用  │ 変更│    │  ← 3×3 FlipCell グリッド
│  ├────────┼───────┼────┤    │
│  │  拡大  │ 縮小  │ 代用│    │    表面: カテゴリ名 + "tap"
│  ├────────┼───────┼────┤    │    裏面: カテゴリ名 + キーワード
│  │ 再配置 │ 逆転  │ 結合│    │    タップでrotateY(180°)フリップ
│  └─────────────────────┘    │
│                             │
│  ← pass      keep →         │  ← スワイプ方向ヒント
└─────────────────────────────┘
```

**FlipCell（3Dフリップ）**:
```typescript
// perspective: 600 のコンテナ内で rotateY アニメーション
// 表面: backfaceVisibility="hidden"、カテゴリラベル + "tap" ヒント
// 裏面: backfaceVisibility="hidden"、transform="rotateY(180deg)"、キーワード表示
// flipped: Set<OsborneCategory> で各マスの開閉状態管理（カード遷移時にリセット）
```

**スワイプ・キープ**:
- `useMotionValue(x)` + `useTransform` でドラッグ → カード傾き
- 右スワイプ（threshold: +80px release）→ テーマ全体を `KeptTheme` としてキープ
- 左スワイプ（threshold: -80px release）→ パス（スキップ）
- 全230テーマ消化後 or ユーザーが「完了」→ `onDone(keptThemes)` → mygrid phase

**カテゴリカラー（CATEGORY_COLOR）**:
```
adapt: amber-400, apply: teal-300, modify: sky-400
magnify: orange-300, minify: violet-400, substitute: pink-400
rearrange: lime-400, reverse: rose-400, combine: cyan-400
```

#### 3.4.3 自分の9マス（SparkMyGrid）

```
┌─────────────────────────────┐
│  準備 ── 発想 ──▶展開── 完了 │  ← StepBar（current="mygrid"）
│                             │
│  [SparkAmbient 背景（半輝度）]│
│                             │
│  あなたのテーマで考えよう     │
│                             │
│  [キープしたテーマチップ一覧] │  ← 参照用（非表示ボタンあり）
│                             │
│  テーマ                     │
│  [テキスト入力]              │
│                             │
│  [3×3 グリッド]              │  ← テーマ未入力時 opacity-40
│  各マス: タップ→input表示    │
│  入力済み: 琥珀色ボーダー     │
│                             │
│  [完了 →]                   │
│  スキップ →                  │
└─────────────────────────────┘
```

**実装詳細**:
- `focusedCell: OsborneCategory | null` でフォーカスマス管理
- テーマが空の場合はグリッドタップ不可（disabled）
- 「完了」→ `onDone({ theme, cells })` / 「スキップ」→ `onDone({ theme: "", cells: {} })`

#### 3.4.4 完了画面（SparkDone）

```
┌─────────────────────────────┐
│                             │
│  ⚡ Spark                   │
│  お疲れさまでした。           │
│  アイデアは寝かせると育ちます  │
│                             │
│  ─────────────────────────  │
│  キープしたテーマ             │
│  ┌──────────────────────┐   │
│  │ ☆ テーマ名            │   │  ← ☆/★でスター切り替え
│  │ [kw1] [kw2] [kw3]...  │   │  ← キーワードチップ（最大5個）
│  └──────────────────────┘   │
│                             │
│  あなたの9マス               │
│  テーマ: [入力テーマ]         │
│  転用 | [入力内容]           │
│  ...                        │
│                             │
│  ふりかえり（任意）           │
│  [textarea]                 │
│                             │
│  [もう一度 Spark]            │  ← guide phase に戻る
│                             │
│  ─────────────────────────  │
│  アイデアを出したあとは、      │
│  少し頭を休めましょう。        │
│  [mumuの珈琲豆を見る →]      │  ← BASEリンク（常時表示）
│                             │
│  ← ホームに戻る              │  ← /app
└─────────────────────────────┘
```

**実装詳細**:
- 珈琲レコメンドは**常時表示**（7日ゲートなし）
- キープなし・MyGridなしの場合は「今回はキープなし」メッセージ
- `historyStore.addSession({ type: "focus", duration: 0, task: "Spark: ものをつくりたい" })` で記録

---

### 3.5 Reclaimモード（`/app/reclaim`）

**フロー**: `intro → sense → feel → settle → done`

**実装ファイル**: `src/app/app/reclaim/page.tsx`（オーケストレーター）

#### 3.5.1 導入画面（ReclaimIntro）

珈琲あり/なしを選択して開始。

```
┌─────────────────────────────┐
│  ✦ Reclaim                  │
│  感性のメンテナンスをする      │
│                             │
│  [珈琲を用意する]            │
│  [珈琲なしで始める]          │
└─────────────────────────────┘
```

#### 3.5.2 感覚を開く（ReclaimSense）

五感プロンプトを順番に表示。

```
┌─────────────────────────────┐
│  感覚を開く                  │
│                             │
│  [五感プロンプト（日替わり）]  │
│  「いま目に入るもので、       │
│   一番古そうなものは？」      │
│                             │
│  [次へ →]                   │
└─────────────────────────────┘
```

**実装詳細**:
- `sensoryPrompts.json` から日付ハッシュで選択
- 複数プロンプトを順番に表示（1〜3問）

#### 3.5.3 対比カード（ReclaimFeel）

対照的なキーワードペアを提示してスワイプ/タップで感情を記録。

```
┌─────────────────────────────┐
│  いまの自分は？              │
│                             │
│    静か ←→ 賑やか           │
│    重い ←→ 軽い             │
│                             │
│  [← 静か]  [賑やか →]       │
└─────────────────────────────┘
```

**実装詳細**:
- カードをスワイプ or ボタンタップで二択を選択
- 選択内容を `answers` として蓄積
- カード位置: `pt-20`（上部余白あり）

#### 3.5.4 沈殿（ReclaimSettle）

34秒間のアニメーション（操作なし）。答えが「沈殿」するビジュアル。

```
┌─────────────────────────────┐
│  沈殿中...                   │
│                             │
│  [海底シーンSVGアニメーション] │
│  ・海面→海底に沈むオーブ      │
│  ・海藻が揺れる               │
│  ・岩場が広がる               │
│                             │
│  [カウントダウンバー]         │
│  スキップ →                  │  ← 常時表示
└─────────────────────────────┘
```

**SVGの定数値**:
```
FLOOR_Y = 520  // 海底ライン（視覚的基準）
SETTLE_Y = 535 // オーブが落ち着くY座標
seafloor line: y = 542

左側壁:   M 0 200 L 15 215 L 16 278 L 44 328 L 36 374 L 34 415 L 62 462 L 50 505 L 0 542
右側壁:   M 360 200 L 345 215 L 344 278 L 316 328 L 324 374 L 326 415 L 298 462 L 310 505 L 360 542
左岩場:   M 0 542 L 28 524 L 48 534 L 70 519 L 96 532 L 118 542
右岩場:   M 242 542 L 268 527 L 292 537 L 318 522 L 344 533 L 360 542
中央岩場: M 148 542 L 166 531 L 182 537 L 200 528 L 218 542
砂層:     y = 553, 566, 580
SeaWeed:  baseY = 542（4本配置）
```

**実装詳細**:
- 34秒固定タイマー（`useTimer`）
- `motion.circle` でオーブが Y=−50 から SETTLE_Y まで落下アニメーション
- Framer Motion `as any` キャストで SVG属性アニメ対応
- スキップボタンは常時表示（バーの下）

#### 3.5.5 完了画面（ReclaimDone）

感性スナップショット表示 + ひとこと入力。

```
┌─────────────────────────────┐
│  ✦ Reclaim                  │
│  お疲れさまでした。           │
│                             │
│  [ReclaimSnapshot オーブ]   │  ← 答えから生成した感性可視化
│                             │
│  今日の感性スナップショット   │
│  静か / 軽い / ...           │  ← 選択した対比キーワード
│                             │
│  ひとこと（任意）             │
│  ┌──────────────────────┐   │
│  │                       │   │
│  └──────────────────────┘   │
│                             │
│  ← ホームに戻る              │  ← /app
└─────────────────────────────┘
```

**実装詳細**:
- `ReclaimSnapshot`: 選択された答えを視覚化するオーブSVGアニメーション
- `historyStore.addSession({ type: "reclaim", duration: ~1分 })` で記録
- 珈琲補充提案は**表示しない**（感性回帰の場に商業要素NG）

---

### 3.6 ルーティン設定（`/app/routine`）

**実装ファイル**: `src/app/app/routine/page.tsx`

```
┌─────────────────────────────┐
│  ルーティン設定              │
│                             │
│  月  火  水  木  金  土  日  │  ← 7列グリッド（今日の曜日をアンバーハイライト）
│  ┌──┐┌──┐┌──┐...           │
│  │朝 ││朝 ││   │             │  ← EntryChip（mode色）
│  │Focus││Relax│             │
│  │昼 ││   ││   │             │
│  │   ││   ││   │             │
│  │夜 ││   ││夜 │             │
│  │   ││   ││Rec│             │
│  └──┘└──┘└──┘...           │
└─────────────────────────────┘
```

**AddModal（曜日タップで表示）**:

```
┌─────────────────────────────┐
│  〇曜日のルーティンを追加    │
│                             │
│  時間帯: [朝] [昼] [夜]     │
│  モード: [Focus][Relax]      │
│          [Spark][Reclaim]    │
│                             │
│  [追加する] [キャンセル]     │
└─────────────────────────────┘
```

**実装詳細**:
- `routineStore.addEntry(day, slot, mode)` で保存
- EntryChipを長押し → `routineStore.removeEntry(id)` で削除
- 今日の曜日: `(new Date().getDay() + 6) % 7`（月=0〜日=6に変換）
- モードカラー:
  - Focus: `amber-400`
  - Relax: `teal-300`
  - Spark: `sky-400`
  - Reclaim: `violet-400`

---

### 3.7 ダッシュボード（`/app/dashboard`）

**実装ファイル**: `src/app/app/dashboard/page.tsx`

```
┌─────────────────────────────┐
│  My cup                     │
│                             │
│  ┌──────┐ ┌──────┐ ┌──────┐│
│  │今日  │ │今週  │ │streak││  ← サマリーカード
│  │1回   │ │5回   │ │3日   ││
│  └──────┘ └──────┘ └──────┘│
│                             │
│  今週のカレンダー            │
│  月  火  水  木  金  土  日  │  ← WeekCalendar（mode色ドット）
│  ●  ●  ●  ─  ─  ─  ─    │
│                             │
│  ルーティン達成状況          │
│  ○ 朝 Focus  ● 夜 Relax    │  ← RoutineStatus（○未実施 ●実施済）
│                             │
│  今週のモード内訳            │
│  ████░░░  Focus   3回       │  ← モード別バーチャート
│  ██░░░░░  Relax   2回       │
│                             │
│  ─────────────────────────  │
│  mumuの珈琲豆を補充する →    │  ← BASEリンク
└─────────────────────────────┘
```

**実装詳細**:
- `historyStore` からデータ取得（今日 / 今週 / 連続日数）
- WeekCalendar: 今週月〜日の7日分。その日のセッションを `type` に応じた色ドットで表示
- RoutineStatus: `routineStore` の今日のエントリをプランとして表示、`historyStore` に該当セッションがあれば達成済みとマーク
- 連続日数(streak): `historyStore` で直近の連続セッション日数を計算
- BASEリンク常時表示

---

## 4. データファイル仕様

### 4.1 sparkCardsV2.json

Sparkカードデッキ。オズボーンのチェックリスト（9視点）×テーマで構成。

```json
{
  "scenes": [
    {
      "id": "making",
      "label": "ものをつくりたい",
      "themes": [
        {
          "id": "theme_001",
          "label": "テーマ名",
          "cards": {
            "adapt":      ["キーワード1", "キーワード2", "キーワード3"],
            "apply":      ["...", "...", "..."],
            "modify":     ["..."],
            "magnify":    ["..."],
            "minify":     ["..."],
            "substitute": ["..."],
            "rearrange":  ["..."],
            "reverse":    ["..."],
            "combine":    ["..."]
          }
        }
      ]
    }
  ],
  "osborne_categories": ["adapt", "apply", "modify", "magnify", "minify", "substitute", "rearrange", "reverse", "combine"]
}
```

- シーン: `making`（ものをつくりたい）のみ
- テーマ数: 230
- 各テーマ×9カテゴリ × 複数フレーズ。SparkShuffle では各カテゴリからランダム1語を表示

### 4.2 sensoryPrompts.json

`getDailyPrompt()` が日付ハッシュで選択。FocusBreak・RelaxDone で使用。

### 4.4 pairings.json

`getPairing(mood)` で取得。RelaxDone でペアリング表示。mood × 季節・時間帯でマトリクス。

---

## 5. StepBar 仕様

**実装ファイル**: `src/components/focus/StepBar.tsx`

```typescript
export const FOCUS_STEPS: StepDef[] = [
  { key: "setup",   label: "準備" },
  { key: "coffee",  label: "珈琲" },
  { key: "session", label: "集中" },
  { key: "break",   label: "休憩" },
  { key: "summary", label: "完了" },
];

export const RELAX_STEPS: StepDef[] = [
  { key: "setup",   label: "準備" },
  { key: "coffee",  label: "珈琲" },
  { key: "session", label: "呼吸" },
  { key: "done",    label: "完了" },
];

export const SPARK_STEPS: StepDef[] = [
  { key: "setup",   label: "準備" },
  { key: "shuffle", label: "発想" },
  { key: "mygrid",  label: "展開" },
  { key: "done",    label: "完了" },
];
```

- `current` に一致するステップがアクティブ（琥珀色ドット）
- 完了済みステップはチェックマーク付き琥珀色

---

## 6. 共通設計ルール

### 6.1 デザイントークン

```
背景:         #0a0a0a
メインテキスト: #e8e6e1
アクセント:    #EF9F27（琥珀）
緑アクセント:  #1D9E75
```

**透明度のセマンティクス**:
- `/80` — 主要テキスト
- `/50` — 補助テキスト
- `/40` — プレースホルダ・ラベル
- `/25` — ヒント・スモールラベル
- `/15` — 区切り線・非アクティブ境界

### 6.2 フォント

- 全体 `font-light`（fontWeight: 300）
- 見出し: `text-xl` / `text-2xl` + `tracking-wide`
- ラベル: `text-xs` + `tracking-[0.3em〜0.4em]`

### 6.3 アニメーション共通

- ページ遷移: `AnimatePresence mode="wait"` + `opacity: 0→1, duration: 0.5〜0.8s`
- Spring設定（モーダル等）: `stiffness: 360, damping: 30`
- 全画面モード（FocusSession/RelaxSession）: `fixed inset-0 z-[100]`（BottomNav非表示）

### 6.4 珈琲補充提案（BASEリンク）表示ルール

- 表示箇所とルール:
  - SessionSummary（Focus完了）: 7日ゲート（`shouldShowCoffeeRecommend()`）
  - RelaxDone（Relax完了）: 7日ゲート（`shouldShowCoffeeRecommend()`）
  - SparkDone（Spark完了）: **常時表示**（「アイデアを出したあとは休めましょう」の文脈）
- **Reclaimには絶対に入れない**（感性回帰の場に商業要素NG）
- リンク先: `https://mumucoffee.theshop.jp/`

### 6.5 localStorage 永続化

```
キー名                            用途
─────────────────────────────────────────
history-store                    Zustand persist（セッション履歴）
session-store                    Zustand persist（現在セッション）
mumu-routine                     Zustand persist（ルーティン設定）
mumu_spark_base_shown            SparkSave BASEリンク最終表示日時（ms）
```

---

## 7. PWA設定

```typescript
// next.config.ts
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",  // 開発時は無効
});
```

- 開発中に `public/sw.js` が残っていると古いキャッシュエラーが発生する
- 対処: `rm public/sw.js` で削除（開発中は自動生成されない）

---

## 8. 実装状況・今後の予定

| 機能 | 状態 | 備考 |
|------|------|------|
| Focusモード | ✅ 実装済 | |
| Relaxモード | ✅ 実装済 | BGM: pour.wav |
| Sparkモード | ✅ 実装済 | オズボーン9視点 |
| Reclaimモード | ✅ 実装済 | intro→sense→feel→settle→done |
| My cup（ダッシュボード） | ✅ 実装済 | `/app/dashboard` |
| ルーティン設定 | ✅ 実装済 | `/app/routine`、Zustand persist |
| Focus/Relax BGM | △ 一部 | pour.wav のみ。focus BGM未実装 |
| 週次AIレポート | 未着手 | Anthropic API Haiku 4.5 予定 |
| Supabaseデータ永続化 | 未着手 | 現行はlocalStorageのみ |
| プッシュ通知（ルーティン） | 未着手 | Web Push API が必要 |
