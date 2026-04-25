# mumu アプリ仕様書（/app）

> **最終更新**: 2026-04-25
> **対象URL**: `/app/...`
> **コンセプト**: 「珈琲のある時間をつくるアプリ」— 4つのモードで集中・リラックス・ひらめき・感性回復

HP 側仕様は別ファイル [`mumu_brand_site_spec.md`](./mumu_brand_site_spec.md)。

---

## 1. URL 構造

```
/app                  アプリホーム（モード選択 + 今日のルーティン）
/app/focus            Focus モード（集中）
/app/relax            Relax モード（リラックス）
/app/spark            Spark モード（ひらめき）
/app/reclaim          Reclaim モード（感性回復）
/app/dashboard        My cup（記録）
/app/routine          週間ルーティン設定
```

`/app` 以下は `robots: { index: false, follow: false }`（[layout.tsx](src/app/app/layout.tsx)）。

---

## 2. 技術スタック

HP と同じ。アプリ固有：

| 項目 | 内容 |
|------|------|
| 状態管理 | Zustand v5（`persist` で localStorage 永続化） |
| 音声 | `HTMLAudioElement` + Web Audio API（`GainNode`、ライブラリ不使用） |
| アニメーション | Framer Motion `AnimatePresence mode="wait"` でステップ間遷移 |
| タイマー | `Date.now()` 差分方式の自前 `useTimer` フック（バックグラウンド対応） |

---

## 3. デザイン

### 3.1 カラー

```
背景:           #0e0e0e   /appゾーンのベース（[layout.tsx])
html/body:      #111111   GrainOverlay を載せた後の実効色に合わせて少し明るく揃える
テキスト:       #e8e6e1   生成り白
アクセントライム: #a3a957   差し色（CTA、選択状態、強調）
ボーダー:       white/8 〜 white/25  状況に応じて使い分け
```

`/app` 配下では [layout.tsx](src/app/app/layout.tsx) 内に `<style>` で `html, body { background-color: #111111 !important; }` を仕込む。`/app` から離れると layout がアンマウントされてスタイルも消える。

### 3.2 グレイン

HP と同じ [GrainOverlay](src/components/ui/GrainOverlay.tsx) がルートレイアウトから全ページに適用される。/app でも同様。

### 3.3 タイポグラフィ

`/app` は和文中心。Shippori Mincho（見出し）+ Noto Sans JP（本文）+ Cormorant Garamond（英文ラベル）。

`tracking-[0.2em]` 〜 `tracking-[0.4em]` の文字間で「静かさ」を演出。

---

## 4. 共通レイアウト（[layout.tsx](src/app/app/layout.tsx)）

```
┌─────────────────────┐
│                     │
│      コンテンツ       │  ← 各ページの page.tsx
│                     │
├─────────────────────┤
│   NowPlayingBar     │  ← 再生中のみ表示（セッションページでは非表示）
├─────────────────────┤
│   BottomNav (h-16)  │  ← ホーム / My cup / ルーティン
└─────────────────────┘
```

| コンポーネント | 役割 |
|---|---|
| [BottomNav](src/components/app/layout/BottomNav.tsx) | 3タブ固定フッター。タップ時 `stopZyunnbi()` |
| [NowPlayingBar](src/components/app/layout/NowPlayingBar.tsx) | 再生中BGM + ラベル + 戻る + 停止ボタン。`audioStore` 監視 |
| [SoundPreloader](src/components/app/layout/SoundPreloader.tsx) | 効果音をマウント時にプリロード（表示なし） |

HP の Header / Footer は [ConditionalLayout](src/components/layout/ConditionalLayout.tsx) で非表示化済み。

---

## 5. アプリホーム `/app`（[page.tsx](src/app/app/page.tsx)）

```
┌─────────────────────────────┐
│   今日のルーティン             │ ← TodayRoutine（routineStore参照）
│   (Lighthouse animation)    │ ← 灯台SVGアニメーション
│                             │
│   感性を、取り戻す。           │
│   つくる人の、集中とひらめきのアプリ │
│                             │
│   (Waves animation)         │ ← 波SVGアニメーション
│                             │
│   すべてのモード               │
│   ┌─ Focus  集中する ──────┐ │ ← 4つのモードカード
│   ├─ Relax  リラックス ────┤ │   全て available: true
│   ├─ Spark  ひらめき ──────┤ │   音アイコンは Focus / Relax のみ
│   └─ Reclaim 感性回復 ─────┘ │
│                             │
│   mumuの珈琲豆はこちら →      │ → BASE
│   ← HPに戻る                  │ → /
└─────────────────────────────┘
```

このページでは効果音もBGMも一切鳴らさない。

---

## 6. Focus モード `/app/focus`

```
FocusSetup → CoffeeTime（任意） → FocusSession → FocusBreak → SessionSummary
```

ステップ管理は [page.tsx](src/app/app/focus/page.tsx) 内の `useState<"setup" | "coffee" | "session" | "break" | "done">`。`AnimatePresence mode="wait"` で遷移。

### 6.1 [FocusSetup](src/components/focus/FocusSetup.tsx)

- 時間選択：[RollerPicker](src/components/focus/RollerPicker.tsx) で 5〜60分（5分刻み）
- タスクメモ（任意）
- BGM 4択：波 / 焚き火 / カフェ / 音楽
- マウント時に `zyunnbi.m4a` を 0.175 で再生（既に他で再生中ならスキップ）
- ボタン：
  - 「準備できました」→ CoffeeTime
  - 「珈琲なしで始める」→ FocusSession 直行
  - 「← 戻る」→ ホーム
- いずれも `cancelZyunnbiRef.current?.()` で zyunnbi を即停止 → `playClickSound()` → 遷移

### 6.2 [CoffeeTime](src/components/focus/CoffeeTime.tsx)

- ドリップアニメーション
- subtitle は `React.ReactNode` 型（JSX 改行可能）
- 「ありがとう。行こう →」で次へ

### 6.3 [FocusSession](src/components/focus/FocusSession.tsx)

`fixed inset-0 z-[40] bg-[#0e0e0e]` でフルスクリーン（BottomNav を覆う）。

| 項目 | 内容 |
|------|------|
| BGM | カテゴリ別ファイルプールからランダム選択、2要素ギャップレスループ |
| フェード | `connectGain()` で GainNode 経由（iOS は HTMLAudioElement.volume が無視されるため） |
| フェード時間 | 波 4s / 焚き火 3s / カフェ・音楽 1s |
| 終了 | タイマー完了で 1.2s フェードアウト → `endsound.m4a` → FocusBreak |
| 手動終了 | 即停止 → `endsound.m4a` → FocusBreak |
| シーン | 波/カフェ/音楽 → [FocusScene](src/components/animations/FocusScene.tsx)（灯台）、焚き火 → [CampfireScene](src/components/animations/CampfireScene.tsx)、カフェ → [CafeScene](src/components/animations/CafeScene.tsx) |
| 一時停止 | 画面タップでナビ表示切替 |
| タイマー | `useTimer`（Date.now差分）+ `audioStore.timerSnap` で離脱→復帰時の残り時間復元 |

### 6.4 [FocusBreak](src/components/focus/FocusBreak.tsx)

- 日替わり感性プロンプト（`getDailyPrompt`）
- 5分休憩タイマー
- 「もう1セット」/「今日はここまで」

### 6.5 [SessionSummary](src/components/focus/SessionSummary.tsx)

- セット数 / 合計時間 / やったこと
- ふりかえりメモ（任意）
- **珈琲豆レコメンド**: `historyStore.shouldShowCoffeeRecommend()` が true（前回表示から7日以上経過）のときのみ表示
  - **重要**: `useState(() => ...)` イニシャライザで初期値を固定。`markCoffeeRecommendShown()` 後の再レンダリングで消えないように
- 「← ホームに戻る」

---

## 7. Relax モード `/app/relax`

```
RelaxSetup → CoffeeTime（任意） → RelaxSession → RelaxDone
```

### 7.1 [RelaxSetup](src/components/relax/RelaxSetup.tsx)

- 気分：疲れた / もやもや / ぼんやりしたい
- 時間：3・5・10・15・…・60分

### 7.2 [RelaxSession](src/components/relax/RelaxSession.tsx)

- 呼吸サークル（吸う4s / 止める4s / 吐く6s = 14s 1サイクル）
- BGM: zyunnbi 系（お湯を注ぐ音）
- GainNode 経由のフェード制御

### 7.3 [RelaxDone](src/components/relax/RelaxDone.tsx)

- 日替わり一言
- ペアリング提案（音楽 Spotifyリンク + お菓子）— `getPairing(mood)` から取得
- 珈琲豆レコメンド（同上ロジック）

---

## 8. Spark モード `/app/spark`

ひらめき・アイデア発想モード。**実装済み**：

| ステップ | コンポーネント | 役割 |
|---|---|---|
| Guide | [SparkGuide](src/components/spark/SparkGuide.tsx) | 導入・使い方説明 |
| Shuffle | [SparkShuffle](src/components/spark/SparkShuffle.tsx) | カードをシャッフル / スワイプで採用・却下 |
| Ambient | [SparkAmbient](src/components/spark/SparkAmbient.tsx) | アンビエント環境（思考のための余白） |
| MyGrid | [SparkMyGrid](src/components/spark/SparkMyGrid.tsx) | 採用したカードのグリッド表示 |
| Done | [SparkDone](src/components/spark/SparkDone.tsx) | 終了画面 |

カード選定ロジックは [`selectSessionCards.ts`](src/lib/selectSessionCards.ts)。

---

## 9. Reclaim モード `/app/reclaim`

感性回復モード。**実装済み**：

| ステップ | コンポーネント |
|---|---|
| Intro | [ReclaimIntro](src/components/reclaim/ReclaimIntro.tsx) |
| Sense | [ReclaimSense](src/components/reclaim/ReclaimSense.tsx) — 感覚を確認 |
| Feel | [ReclaimFeel](src/components/reclaim/ReclaimFeel.tsx) — 感情を観察 |
| Settle | [ReclaimSettle](src/components/reclaim/ReclaimSettle.tsx) — 落ち着きへ |
| Snapshot | [ReclaimSnapshot](src/components/reclaim/ReclaimSnapshot.tsx) — その日の自分を写し取る |
| Done | [ReclaimDone](src/components/reclaim/ReclaimDone.tsx) |

日替わり感覚プロンプトは [`getDailySensePrompt.ts`](src/lib/getDailySensePrompt.ts)。

---

## 10. ダッシュボード `/app/dashboard`

「My cup」。`historyStore.sessions` をもとに過去セッションを可視化。週間カレンダー / ストリーク等を表示。見出し：「今週の記録」。

## 11. ルーティン `/app/routine`

7曜日 × 朝/昼/夜の枠でモードを設定。曜日ヘッダーをタップでモーダル → 時間帯 + モード選択。エントリ長押しで削除。`routineStore` に永続化。今日の曜日はライム（`#a3a957`）でハイライト。

ホーム画面の [TodayRoutine](src/components/app/TodayRoutine.tsx) はここのデータを参照して「今日のルーティン」を表示。

---

## 12. 状態管理（Zustand）

### 12.1 [audioStore](src/store/audioStore.ts)

```ts
{
  audio: HTMLAudioElement | null
  meta: {
    label: string                  // 例: "Focus · 波"
    route: string                  // "/app/focus" | "/app/relax"
    mode: "focus" | "relax"
    config: FocusConfig | RelaxConfig
  } | null
  timerSnap: { remainingSeconds, savedAt, isPaused, route } | null
}
```

セッション中の BGM をグローバル管理。`NowPlayingBar` と `audioStore` をつなぐ。離脱→復帰時のタイマー復元にも使う。

### 12.2 [historyStore](src/store/historyStore.ts)

```ts
{
  sessions: Session[]
  lastCoffeeRecommendAt: number
}
```

`addSession()` / `shouldShowCoffeeRecommend()` / `markCoffeeRecommendShown()`。

### 12.3 [routineStore](src/store/routineStore.ts)

週間ルーティン設定（曜日 × 時間帯 × モード）。

---

## 13. 音声システム（[playSound.ts](src/lib/playSound.ts) に集約）

### 13.1 zyunnbi（準備音楽）

| 項目 | 内容 |
|---|---|
| ファイル | `/sounds/zyunnbi.m4a` |
| 方式 | `HTMLAudioElement` + iOS unlock パターン（無音 WAV data URI） |
| 音量 | 0.175 |
| 停止 | キャンセル関数（`cancelZyunnbiRef.current?.()`）or `stopZyunnbi()` |

**停止タイミング（重要）**:
- Focus/Relax Setup の各ボタン押下時
- BottomNav の全タブ押下時
- useEffect クリーンアップ時

### 13.2 クリック音

| 項目 | 内容 |
|---|---|
| ファイル | `/sounds/clicksound.wav` |
| 方式 | `AudioBuffer` 事前デコード → `BufferSource.start()` で低遅延 |
| 音量 | 0.2625 |
| 用途 | ボタン・選択肢タップ時、ジェスチャーハンドラから直接呼ぶ |

### 13.3 BGM フェード（GainNode）

```ts
const handle = connectGain(audio, initialVolume); // FadeHandle | null
handle?.fadeTo(target, durationMs, onDone?);
handle?.setVolume(v);
handle?.disconnect();
```

- iOS のみ GainNode 経由（PCは null を返す → 呼び出し側が `audio.volume` 直接操作にフォールバック）
- AudioContext はモジュールロード時に suspended で生成、初回タップで `resume()`
- `ctx.state === "running"` を最大 500ms ポーリングしてからフェード開始
- 制約：同一 `HTMLAudioElement` に `createMediaElementSource` は1回のみ

### 13.4 MediaSession（バックグラウンド再生）

```ts
navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Focus" });
navigator.mediaSession.setActionHandler("play",  () => audioElRef.current?.play().catch(() => {}));
navigator.mediaSession.setActionHandler("pause", () => {}); // 空ハンドラで停止命令を無効化
navigator.mediaSession.setActionHandler("stop",  () => {}); // 同上
```

`pause` / `stop` を空で登録しないと、iOS / Android がスクリーンロック時に止めてしまう。

### 13.5 BGM ファイル構成

```
public/sounds/
  zyunnbi.m4a             準備音楽
  clicksound.wav          クリック効果音
  endsound.m4a            セッション完了音
  ocean_sound/            Focus「波」
  campfire crackling_sound/  Focus「焚き火」
  cafe_sound/             Focus「カフェ」
  Focus_music/            Focus「音楽」（10トラック）
```

---

## 14. データユーティリティ

| ファイル | 内容 |
|---|---|
| [`getDailyPrompt.ts`](src/lib/getDailyPrompt.ts) | 日付ベースの日替わり感性プロンプト（FocusBreak、RelaxDoneで使用） |
| [`getDailySensePrompt.ts`](src/lib/getDailySensePrompt.ts) | Reclaim モード用の日替わり感覚プロンプト |
| [`getPairing.ts`](src/lib/getPairing.ts) | 気分 × 時間帯 × 季節のペアリング選定 |
| [`selectSessionCards.ts`](src/lib/selectSessionCards.ts) | Spark モードのカード選定 |

---

## 15. iOS / Android 対応

### iOS

| 問題 | 対策 |
|------|------|
| `HTMLAudioElement.volume` が無視される | `connectGain()` で GainNode 経由 |
| `AudioContext` がジェスチャーなしで起動できない | suspended で生成 → 初回タップで `resume()` |
| `statechange` イベントが発火しない | `setInterval` ポーリングで補完 |
| useEffect からの `audio.play()` が失敗 | unlock パターン（無音 WAV data URI） |
| zyunnbi の play→pause 残響 | unlock 専用の無音 WAV を使用、zyunnbi 本体は触れない |
| スクリーンロックでBGMが止まる | `setActionHandler("pause", () => {})` |
| バウンス領域で body 背景が見える | `/app` layout で `html/body { background-color: #111 !important }` |

### Android

| 問題 | 対策 |
|------|------|
| SVG overlay がタッチを吸収 | GrainOverlay を `<div>` でラップ（SVG は内側 absolute） |
| `scrollbar-none` が Chrome で効かない | `globals.css` に `.scrollbar-none::-webkit-scrollbar { display: none }` |
| バックグラウンドでBGMが止まる | iOS と同じ `setActionHandler` 対策 |

---

## 16. PWA

[manifest.ts](src/app/manifest.ts):
- `start_url: /app` （ホームスクリーンから開いたら直接アプリへ）
- `theme_color: #0a0a0a`
- アイコン群（icon-192, icon-512 etc.）

Service Worker（serwist）が `/sounds/` 配下と静的アセットをキャッシュ。

---

## 17. ファイル構成（/app関連）

```
src/
  app/app/
    layout.tsx                   /app共通レイアウト（背景・BottomNav・NowPlayingBar）
    page.tsx                     アプリホーム
    focus/page.tsx               Focusモード（ステップ管理）
    relax/page.tsx               Relaxモード（ステップ管理）
    spark/page.tsx               Sparkモード
    reclaim/page.tsx             Reclaimモード
    dashboard/page.tsx           My cup
    routine/page.tsx             ルーティン設定
  components/
    focus/                       FocusSetup, CoffeeTime, FocusSession,
                                 FocusBreak, SessionSummary, RollerPicker,
                                 StepBar, BreathGuide
    relax/                       RelaxSetup, RelaxSession, RelaxDone
    spark/                       SparkGuide, SparkShuffle, SparkAmbient,
                                 SparkMyGrid, SparkDone
    reclaim/                     ReclaimIntro, ReclaimSense, ReclaimFeel,
                                 ReclaimSettle, ReclaimSnapshot, ReclaimDone
    animations/                  LighthouseThin, WavesThin, FocusScene,
                                 CampfireScene, CafeScene, ButtonOrb, Drip,
                                 Lighthouse
    app/
      TodayRoutine.tsx           ホームの「今日のルーティン」
      layout/
        BottomNav.tsx
        NowPlayingBar.tsx
        SoundPreloader.tsx
  lib/
    playSound.ts                 音声ユーティリティ一式
    getDailyPrompt.ts
    getDailySensePrompt.ts
    getPairing.ts
    selectSessionCards.ts
  store/
    audioStore.ts
    historyStore.ts
    routineStore.ts
  hooks/
    useTimer.ts                  Date.now()差分タイマー（バックグラウンド対応）
public/
  sounds/                        BGM・効果音
```

---

## 18. 主な仕様変更の履歴

| 時期 | 変更 |
|------|------|
| 2026-04 初期 | Focus/Relax 完成、Spark/Reclaim はスタブ |
| 2026-04-15 | Spark/Reclaim を本実装、4モード全 available 化 |
| 2026-04-19 | MediaSession setActionHandler でバックグラウンド再生対応 |
| 2026-04-20 | Android の SVG overlay タッチバグを `<div>` ラップで回避 |
| 2026-04-21 | 一時的にライト化を試みるも、ダーク基調に戻す |
| 2026-04-22 | 背景を段階的に暗く調整（#0a0a0a → #2a2a2a → #1d1d1d → 最終 **#0e0e0e**） |
| 2026-04-22 | アクセントを アンバー → ライム → 最終 **#a3a957**（オリーブ寄り） |
| 2026-04-23 | iOS バウンス領域の白帯対策で html/body を **#111111** に揃える |
| 2026-04-25 | 仕様書を統合・最新化（本ファイル） |
