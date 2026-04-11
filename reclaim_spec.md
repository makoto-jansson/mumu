# Reclaim モード — 仕様書

**バージョン**: v2.0  
**更新日**: 2026年4月11日  
**対象**: 灯台の珈琲焙煎所mumu Webアプリ (`/app/reclaim`)  
**状態**: 実装完了

---

## 1. コンセプト

### 1.1 Reclaimとは

mumuの4番目のモード。「感性を取り戻す」ための装置。

既存3モードが感性の「運用」を担うのに対し、Reclaimは感性の「メンテナンス・復旧」を担う。デスクワーク漬けで鈍った感覚を、もう一度起動し直すためのモード。

### 1.2 感性が鈍るメカニズム（設計の出発点）

| 層 | 原因 | 状態 | 対応ステップ |
|----|------|------|------------|
| ① 身体感覚の閉塞 | デスクワーク漬けで五感の入力が減少 | 目と指先しか使っていない | Step 1: Sense |
| ② 感情の抑圧・均質化 | 効率重視で好き嫌いの判断を後回しに | 何に心が動くか分からない | Step 2: Feel |
| ③ 時間感覚の圧縮 | 常にタスクに追われ余白がない | 感性が発火する隙間がない | Step 3: Settle |

### 1.3 設計原則

- **珈琲補充提案（BASEリンク）は絶対に入れない** — 感性回帰の場に商業要素NG
- **タイマーなし** — ユーザーのペースで進む。「急がなくていい」を構造で伝える
- **BGMなし** — 外界の音を聴くこと自体がReclaimの一部
- **すべての記述は任意** — 書かなくても進める。「正解がない」を構造で伝える
- **診断しない** — 「あなたは○○タイプ」ではなく「今日の感性の形」を映す鏡
- **言語化を強制しない** — Settle（Step 3）は操作なし。感じたことを沈殿させる受動的な時間

### 1.4 mumuモード間の循環

```
Reclaim（感性を取り戻す）
    ↓ doneResponseで書いた言葉が（任意）
Spark（アイデアを爆発させる）← SparkMyGridのテーマ候補として再利用
    ↓ アイデアが生まれたら…
Focus（集中して形にする）
    ↓ 疲れたら…
Relax（リラックスする）
    ↓ 感性が鈍ったら…
Reclaim（感性を取り戻す）← ループ完成
```

※ Spark接続は書いた場合のみ。書くかどうかはユーザー次第。接続は弱いが、それでいい。

---

## 2. フロー概要

**フロー**: `intro → (coffee) → sense → feel → settle → done`

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  intro   │ →  │  sense   │ →  │   feel   │ →  │  settle  │ →  │   done   │
│  導入    │    │  感覚    │    │   対比    │    │   沈殿    │    │   完了   │
│          │    │          │    │          │    │          │    │          │
│ 珈琲あり→│    │ 五感問い  │    │ 対比カード│    │ 操作なし  │    │ snapshot │
│ CoffeeTime    │ 1問      │    │ 10枚     │    │ 34秒     │    │ + ひとこと│
│ 珈琲なし→│    │          │    │ スワイプ  │    │ 粒子落下  │    │          │
│ 直接sense│    │          │    │          │    │          │    │          │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

**StepBar定義**:
```typescript
export const RECLAIM_STEPS: StepDef[] = [
  { key: "intro",  label: "導入" },
  { key: "sense",  label: "感覚" },
  { key: "feel",   label: "対比" },
  { key: "settle", label: "沈殿" },
  { key: "done",   label: "完了" },
];
```

---

## 3. データ型定義

### 3.1 セッション全体

```typescript
type Phase = "intro" | "coffee" | "sense" | "feel" | "settle" | "done";

// page.tsx で管理するセッションデータ
// senseResponse: Step 1の入力（任意）
// feelResults:   Step 2の対比カード結果
```

### 3.2 対比カード

```typescript
type FeelResult = {
  cardId: string;
  layer: string;  // "sensory" | "scene" | "tempo" | "relation" | "abstract" | "values"
  axis: string;
  choice: "a" | "b";
};

type ReclaimCard = {
  id: string;     // "rc_001"
  layer: string;
  a: string;      // 選択肢A
  b: string;      // 選択肢B
  axis: string;   // "温度" "距離" "速度" 等
};
```

### 3.3 永続化データ

```typescript
// historyStore 経由
// addSession({ type: "reclaim", duration: 0 }) — 完了時に記録

// localStorage には現状 doneResponse は未永続化
// （将来: Spark接続のためのテーマ候補として保存する余地あり）
```

---

## 4. 画面仕様

### 4.1 導入画面（ReclaimIntro）

```
┌─────────────────────────────┐
│  ▶導入── 感覚 ── 対比 ──沈殿│  ← StepBar（current="intro"）
│                             │
│  🌊 Reclaim                 │  ← アイコン + テキスト
│                             │
│  感性を、取り戻す時間。       │
│  正解はありません。            │
│  感じたことを、               │
│  そのまま受け取ってください。  │
│                             │
│  ┌──────────────────────┐   │
│  │    珈琲を淹れて始める    │   │  ← → CoffeeTime → sense
│  └──────────────────────┘   │
│  そのまま始める →             │  ← → 直接 sense
└─────────────────────────────┘
```

- 灯台アニメーションなし（v1から削除）
- フェードイン: 0.8s

---

### 4.2 珈琲タイム（CoffeeTime ※共用コンポーネント）

珈琲ありルート選択時のみ経由。Focus/Relax共用の `<CoffeeTime>` をそのまま使用。

- 3分固定カウントダウン
- `steps={RECLAIM_STEPS}` `stepKey="sense"` で呼び出し
- スキップ可

---

### 4.3 感覚を開く（ReclaimSense）

**Step 1: Sense** — 身体感覚のチャンネルを再接続する。

```
┌─────────────────────────────┐
│  導入 ──▶感覚── 対比 ──沈殿 │  ← StepBar（current="sense"）
│                             │
│  [LANDSCAPE_ICON SVG]       │  ← 細線スタイルの風景イラスト
│                             │
│  👁  視覚                   │  ← 五感アイコン + ラベル（日替わり）
│                             │
│  目を使って、今ここにある     │  ← instruction
│  ものを観てみてください。     │
│                             │
│  ─────────────────────────  │
│                             │
│  カップの中の液面を…         │  ← prompt（日付ハッシュ + ランダム）
│                             │
│  ┌──────────────────────┐   │
│  │                        │   │  ← input[type="text"]（1行、任意）
│  └──────────────────────┘   │
│  丸い、揺れている…           │  ← hint（placeholder）
│                             │
│  ┌──────────────────────┐   │
│  │        感じました        │   │  ← → feel phase
│  └──────────────────────┘   │
│  書かずに進む →               │
└─────────────────────────────┘
```

**プロンプト選出**: `getDailySensePrompt(hasCoffee)` — 日付ハッシュで五感カテゴリを選出 → カテゴリ内からランダム1問  
**入力**: 任意。書かずに進める。  
**LANDSCAPE_ICON**: 薄い `#e8e6e1` 細線、塗りなし、山 + 地平線 + 波3本 + 月 + 星のシルエット

---

### 4.4 対比カード（ReclaimFeel）

**Step 2: Feel** — 抑圧された好き嫌いを再発見する。

```
┌─────────────────────────────┐
│  導入 ── 感覚 ──▶対比──沈殿 │  ← StepBar（current="feel"）
│                             │
│  [AmbientOrbs 背景]         │
│                             │
│  1 / 10                     │  ← 進捗（枚数はselectSessionCardsで決定）
│  感覚    （layerラベル）      │
│                             │
│  どちらが今の気分？           │  ← ガイド文
│                             │
│  ┌──────────┐ ┌──────────┐  │
│  │    A     │ │    B     │  │  ← 左右分割カード
│  │          │ │          │  │
│  │ 静かな   │ │ にぎやか  │  │  ← card.a / card.b
│  │          │ │          │  │
│  │ ← こちら │ │ こちら → │  │
│  └──────────┘ └──────────┘  │
│                             │
│  左右にスワイプでも選べます    │  ← 初回のみ表示
└─────────────────────────────┘
```

**カード選出**: `selectSessionCards()` — 6レイヤーから均等にランダム選出  
**操作**: タップ or 左右スワイプ（SWIPE_THRESHOLD: 80px）  
**色**: A=琥珀(#EF9F27)、B=緑(#1D9E75)  
**枚数**: `selectSessionCards` の返却数（約10枚）  
**完了後**: 全カードが終わると自動的に settle phase へ

---

### 4.5 沈殿（ReclaimSettle）

**Step 3: Settle** — 操作なし。感じたことを沈殿させる受動的な34秒。

**時間構成**:

| 経過時間 | 内容 |
|---------|------|
| 0〜1秒 | 導入テキスト フェードイン |
| 1〜3秒 | 導入テキスト 表示 |
| 3〜4秒 | 導入テキスト フェードアウト |
| 4〜34秒 | 深海アニメーション（粒子落下 + 海底イラスト） |
| 34秒〜 | 画面フェードアウト → done phase へ自動遷移 |

**導入テキスト**:
```
目を閉じてください。

感じたことが、
静かに沈んでいくのを
待ちましょう。
```

**深海アニメーション**:

```
┌─────────────────────────────┐
│  導入 ── 感覚 ── 対比 ──▶沈殿│
│                             │
│  /\           /\            │  ← 左右の岩壁（細線、海底で止まる）
│ /  \         /  \           │
│      \     /               │
│       \   /                │
│      ○                     │  ← 粒子（feelResultsのlayer色）
│          ○   ○             │     ゆっくり一定速度で落下
│    ○                       │
│              ○             │
│                             │
│  /\/\/\   /\/\/\   /\/\    │  ← 海底岩山シルエット（細線）
│ ─────────────────────────  │  ← 海底面ライン
│  〜〜〜〜〜〜〜〜〜〜〜〜   │  ← 砂層3本（薄くなる）
│  🌿    🌿  🌿    🌿        │  ← 海藻（左右に揺れる）
└─────────────────────────────┘
```

**粒子仕様**:
```typescript
type Particle = {
  id: string;
  color: string;    // layer色（feelResultsに基づく）
  r: number;        // 3〜9px
  startX: number;   // 60〜300px（中央帯、壁を避ける）
  driftX: number;   // ±11px（ゆっくりした横漂い）
  delay: number;    // 0〜22秒でばらける
  duration: number; // 16〜24秒かけて落下
};
```

- 粒子は画面上部(-20px)から一定速度（linear）で海底(y=535)まで落下
- 横移動も linear で急な動き変化なし
- feelResults 1枚につき 3〜5 個、最低40個生成

**海底イラスト**（LANDSCAPE_ICONと同スタイル）:
- 岩壁（左右）: 細線 stroke="#e8e6e1" strokeOpacity="0.22"、海底で止まる（交差なし）
- 岩山シルエット（左・右・中央）: 同スタイル
- 海底面ライン: strokeOpacity="0.32"
- 砂層3本: 徐々に薄く（0.15 → 0.08 → 0.05）
- 海藻4本: ゆらゆらアニメーション

**レイヤーカラー**:
```typescript
const LAYER_COLORS = {
  sensory:  "#FBBF24",  // amber
  scene:    "#38BDF8",  // sky
  tempo:    "#34D399",  // emerald
  relation: "#FB7185",  // rose
  abstract: "#A78BFA",  // violet
  values:   "#22D3EE",  // cyan
};
```

**操作**:
- 基本操作なし（BottomNav非表示）
- スキップボタンをカウントダウンバーの下に常時表示（opacity-25）
- カウントダウン + プログレスバーを画面下部に表示（pill型、背景付きで視認性確保）

---

### 4.6 完了画面（ReclaimDone）

```
┌─────────────────────────────┐
│  （上部余白 pt-28）          │
│                             │
│  🌊 Reclaim                 │
│                             │
│  ─────────────────────────  │
│                             │
│  今日のスナップショット       │
│  [ReclaimSnapshot オーブ]    │  ← 6レイヤー × size・opacity
│  タップでlayer名を表示        │
│                             │
│  ─────────────────────────  │
│                             │
│  あなたの言葉                │  ← senseResponseがある場合のみ表示
│  「丸くて、ゆらゆら」         │  ← senseResponseのみ。ラベルなし
│                             │
│  ─────────────────────────  │
│                             │
│  名前をつけたものは、         │  ← close message（12種からランダム）
│  少しだけ自分のものになります。│    reclaimNamePrompts.json の close.messages
│                             │
│  ┌──────────────────────┐   │
│  │                        │   │  ← input[type="text"]（任意）
│  └──────────────────────┘   │
│  今日の感性に、ひとこと        │  ← placeholder
│                             │
│  ┌──────────────────────┐   │
│  │    もう一度 Reclaim     │   │  ← intro phase に戻る
│  └──────────────────────┘   │
│  ← ホームに戻る              │
└─────────────────────────────┘
```

**ReclaimSnapshot**:
- 6レイヤーのオーブが浮遊
- size = 24 + そのレイヤーのカード枚数 × 12
- opacity = 0.4 + 選択の偏り × 0.5（一方に偏るほど鮮明）
- タップでlayer名（日本語）を一瞬表示

---

## 5. ファイル構成

```
src/
├── app/app/reclaim/
│   └── page.tsx              # オーケストレーター（phase管理）
├── components/reclaim/
│   ├── ReclaimIntro.tsx      # 導入画面
│   ├── ReclaimSense.tsx      # Step 1: 感覚を開く
│   ├── ReclaimFeel.tsx       # Step 2: 対比カード
│   ├── ReclaimSettle.tsx     # Step 3: 沈殿（34秒、操作なし）
│   ├── ReclaimDone.tsx       # 完了画面（ひとこと入力付き）
│   └── ReclaimSnapshot.tsx   # 感性スナップショットオーブ
├── data/
│   ├── reclaimCards.json         # 対比カード（100枚）
│   ├── reclaimSensePrompts.json  # Senseプロンプト（5五感 × 複数問）
│   └── reclaimNamePrompts.json   # close.messagesのみ使用（12パターン）
└── lib/
    ├── getDailySensePrompt.ts    # 日付ハッシュでSense問い選出
    └── selectSessionCards.ts     # 対比カード選出（6レイヤー均等）
```

---

## 6. 削除したもの（v1からの変更）

| 削除対象 | 理由 |
|---------|------|
| ReclaimName（reflect + crystallize画面） | 言語化の強制がReclaimの体験を壊すため |
| 灯台アニメーション（ReclaimIntro / Done） | 不要な装飾 |
| reflectResponse / crystallizeResponse | Settle廃止に伴い不要 |
| selectReflectPrompt.ts | Name廃止に伴い不要 |
| reclaimNamePrompts の reflect/crystallize セクション | データは残すがUIで参照しない |

---

## 7. 今後の拡張余地

- `doneResponse` の永続化 → Spark接続（SparkMyGridのテーマ候補）
- 沈殿時間のカスタマイズ（現在34秒固定）
- Snapshotの履歴表示（感性の変化を時系列で見る）
