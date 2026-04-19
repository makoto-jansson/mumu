# mumu アプリ 実装仕様書（現状版）

> 最終更新: 2026-04-19（セッション2）
> 開発フェーズ: Phase 2〜3 移行期（Focus / Relax 完成、Spark / Reclaim スタブ）

---

## 1. 全体構成

### URL 構造

```
/                  公式HP トップ
/about             ブランドストーリー
/beans             珈琲豆一覧（microCMS）
/journal           読み物一覧（microCMS）
/app               アプリホーム ← 以下はアプリゾーン
/app/focus         Focusモード
/app/relax         Relaxモード
/app/spark         Sparkモード（スタブ）
/app/reclaim       Reclaimモード（スタブ）
/app/dashboard     My cup（ダッシュボード）
/app/routine       ルーティン設定
```

### 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16（App Router, webpack） |
| スタイリング | Tailwind CSS |
| アニメーション | Framer Motion |
| 状態管理 | Zustand（persist ミドルウェアで localStorage 永続化） |
| 音声 | HTMLAudioElement + Web Audio API（GainNode） |
| PWA | Serwist（next-pwa後継） |
| CMS | microCMS（珈琲豆・記事） |
| ホスティング | Vercel（GitHub 連携で自動デプロイ） |

---

## 2. アプリレイアウト（/app 以下共通）

`src/app/app/layout.tsx` が /app 以下全ページに適用される。

- **BottomNav**: ホーム / My cup / ルーティン の3タブ（固定フッター）
- **NowPlayingBar**: セッション中に再生中BGMを表示するミニプレイヤー
- **SoundPreloader**: 効果音を起動時にプリロード（表示なし）
- HP のヘッダー/フッターは非表示

---

## 3. アプリホーム（/app）

4つのモードカードを縦並びで表示。現状すべて `available: true`（Spark/Reclaimもリンク有効）。

- 上部: 今日のルーティン（`TodayRoutine`）
- 中央: 灯台アニメーション + キャッチコピー + 波アニメーション
- 下部: モードカード一覧、mumuショップへのリンク、HPへ戻るリンク

**モードカードの音アイコン**: Focus・Relax カードの右端に音アイコンを表示（BGMが鳴ることを示す）。Spark・Reclaimは非表示。

**サウンド**: ホーム画面では効果音を一切鳴らさない。

---

## 4. Focus モード（/app/focus）

### 画面フロー

```
FocusSetup → CoffeeTime（任意） → FocusSession → FocusBreak → SessionSummary
```

ページ内でステップ管理（`useState<"setup" | "coffee" | "session" | "break" | "done">`）。`AnimatePresence mode="wait"` でステップ間をフェード遷移。

### FocusSetup（準備画面）

`src/components/focus/FocusSetup.tsx`

- **時間選択**: ロールピッカー（`RollerPicker`）で 5〜60分の任意の分数（5・10・15・…・60分の刻み）
- **タスクメモ**: 任意のテキスト入力
- **BGM選択**: 波 / 焚き火 / カフェ / 音楽 の4択（アイコン付きボタン）
- **zyunnbi**: マウント時に準備音楽（zyunnbi.m4a）を再生
  - ただし BGM が既に再生中（セッションから戻った場合）はスキップ
  - `cancelZyunnbiRef` で画面遷移ボタン・戻るリンク押下時に即停止
- **ボタン**:
  - 「準備できました」→ CoffeeTime へ（zyunnbi停止 → clicksound）
  - 「珈琲なしで始める」→ FocusSession へ直接（CoffeeTimeをスキップ）
  - 「← 戻る」（Link /app）→ zyunnbi停止 → ホームへ

### CoffeeTime（珈琲ページ）

`src/components/focus/CoffeeTime.tsx`

- ドリップアニメーション
- 「ありがとう。行こう →」でセッション開始
- `subtitle` props の型は `React.ReactNode`（JSX で改行を含めることが可能）
- Relax モードのデフォルト subtitle: 「コーヒーの香り成分には、脳のα波（リラックス時に出る脳波）を<br/>増加させる効果があるという研究があります。」（2行）

### FocusSession（集中中）

`src/components/focus/FocusSession.tsx`

- フルスクリーン固定（BottomNav を z-index でカバー）
- 残り時間を大きく表示
- BGMに応じてシーンアニメーションを切り替え:
  - 波/カフェ/音楽 → `FocusScene`（灯台）
  - 焚き火 → `CampfireScene`
  - カフェ → `CafeScene`
- **一時停止・終了ボタン**: 画面タップでナビ表示切り替え
- **BGM再生**:
  - ランダムトラック選択（各カテゴリのファイルプールから）
  - 2要素ギャップレスループ（`timeupdate` でスタンバイを起動）
  - `connectGain()` で GainNode 経由のフェードイン/アウト（iOS 対応）
  - フェードイン時間: 波4秒 / 焚き火3秒 / カフェ・音楽1秒
  - タイマー完了: 1.2秒でフェードアウト → endsound → FocusBreak
  - 手動終了: 即停止 → endsound → FocusBreak
- **タイマー**: `useTimer` フック（Date.now()差分方式、バックグラウンド対応）
- **タイマー復元**: `/app` などへ一時離脱後に戻ってきた場合、`timerSnap` から残り時間を復元
- **セッション状態**: `audioStore` でオーディオ要素とメタデータをグローバル管理

### FocusBreak（休憩画面）

`src/components/focus/FocusBreak.tsx`

- 日替わり感性プロンプト（`getDailyPrompt`）
- 5分休憩タイマー
- 「もう1セット → セッションへ」「今日はここまで → サマリーへ」

### SessionSummary（終了画面）

`src/components/focus/SessionSummary.tsx`

- セット数・合計時間・やったこと を表示
- ふりかえりメモ（任意テキスト）
- **珈琲豆レコメンド**: 前回表示から7日以上経過時のみ表示
  - `useState` イニシャライザで初期値を固定（再レンダリングで消えないように）
- 「← ホームに戻る」リンク

---

## 5. Relax モード（/app/relax）

### 画面フロー

```
RelaxSetup → CoffeeTime（任意）→ RelaxSession → RelaxDone
```

### RelaxSetup（準備画面）

`src/components/relax/RelaxSetup.tsx`

- **気分選択**: 疲れた / もやもや / ぼんやりしたい の3択
- **時間選択**: ロールピッカーで 3・5・10・15・…・60分
- zyunnbi・cancelZyunnbiRef の動作は FocusSetup と同様

### RelaxSession（呼吸セッション）

`src/components/relax/RelaxSession.tsx`

- 呼吸サークル（吸う4秒・止める4秒・吐く6秒 = 14秒1サイクル）
- BGM: お湯を注ぐ音（`zyunnbi.m4a` を転用、またはドリップ音）
- BGM フェードは `connectGain()` で GainNode 制御

### RelaxDone（完了画面）

`src/components/relax/RelaxDone.tsx`

- 日替わり一言（`getDailyPrompt`）
- ペアリング提案: 音楽（Spotifyリンク）+ お菓子（`getPairing(mood)`）
- **珈琲豆レコメンド**: SessionSummary と同様のロジック
- 「← ホームに戻る」リンク

---

## 6. Spark・Reclaim モード

現在はスタブ（ページファイルのみ存在）。実装予定。

---

## 7. 音声システム

`src/lib/playSound.ts` に集約。

### 7.1 zyunnbi（準備音楽）

| 項目 | 内容 |
|------|------|
| ファイル | `/sounds/zyunnbi.m4a` |
| 方式 | `HTMLAudioElement` + iOS unlock パターン |
| iOS unlock | 無音 WAV（data URI）で初回ジェスチャー時に iOS audio session を開放 |
| 再生 | `playZyunnbi()` → unlock 済みなら即再生、未なら最大5秒ポーリング |
| 停止 | 戻り値のキャンセル関数を呼ぶ（`cancelZyunnbiRef.current?.()`） |
| 音量 | 0.175 |

**停止タイミング（重要）**:
- FocusSetup/RelaxSetup の「準備できました」「珈琲なしで始める」「← 戻る」ボタン押下時
- BottomNav の全タブ押下時（`stopZyunnbi()`）
- useEffect クリーンアップ時

### 7.2 クリック音

| 項目 | 内容 |
|------|------|
| ファイル | `/sounds/clicksound.wav` |
| 方式 | `AudioBuffer`（事前デコード）→ `BufferSource.start()` で低遅延再生 |
| フォールバック | AudioBuffer 未ロード時は HTMLAudioElement |
| 音量 | 0.2625 |
| 用途 | ボタン・選択肢のタップ時、ジェスチャーハンドラから直接呼ぶ |

### 7.3 BGM フェード（GainNode）

| 項目 | 内容 |
|------|------|
| 関数 | `connectGain(audio, initialVolume): FadeHandle \| null` |
| 方式 | Web Audio API `MediaElementSource` → `GainNode` → `destination` |
| iOS 対応 | `HTMLAudioElement.volume` は iOS で無視されるため GainNode で音量制御 |
| PC 対応 | `_isIOS()` が false の場合は `null` を返す → 呼び出し側が `fadeVolume()`（audio.volume直接操作）にフォールバック |
| AudioContext | モジュールロード時に即生成（suspended 状態）。ナビゲーションの touchstart で `resume()` |
| fadeTo() | `ctx.state === "running"` になるまで最大 500ms ポーリングしてからフェード開始 |
| 制約 | 同一の `HTMLAudioElement` に `createMediaElementSource` は1回のみ呼べる |

### 7.4 MediaSession（バックグラウンド再生）

FocusSession・RelaxSession で `navigator.mediaSession` を設定。

```typescript
navigator.mediaSession.metadata = new MediaMetadata({ title: "mumu", artist: "Focus" });
navigator.mediaSession.setActionHandler("play",  () => { audioElRef.current?.play().catch(() => {}); });
navigator.mediaSession.setActionHandler("pause", () => { /* 空ハンドラ: バックグラウンド継続 */ });
navigator.mediaSession.setActionHandler("stop",  () => { /* 空ハンドラ */ });
```

**重要**: `setActionHandler` を登録しないと iOS・Android がスクリーンロック時に pause アクションを送り、BGM が止まる。`pause`・`stop` を空ハンドラで登録することでバックグラウンド継続再生を実現する。

**FadeHandle の API**:
```typescript
handle.setVolume(v: number)              // 即時音量変更
handle.fadeTo(target, durationMs, onDone?) // なめらかにフェード
handle.disconnect()                       // GainNode を切断
```

### 7.5 その他効果音

| ファイル | 用途 | 方式 |
|---------|------|------|
| `/sounds/endsound.m4a` | セッション完了音 | `new Audio()` 都度生成 |

### 7.6 BGM ファイル構成

```
public/sounds/
  zyunnbi.m4a
  clicksound.wav
  endsound.m4a
  ocean_sound/          ← Focusモード「波」
    *.m4a, *.mp3 (3トラック)
  campfire crackling_sound/  ← Focusモード「焚き火」
    *.m4a, *.mp3 (3トラック)
  cafe_sound/           ← Focusモード「カフェ」
    *.m4a (3トラック)
  Focus_music/          ← Focusモード「音楽」
    *.m4a (10トラック)
```

---

## 8. 状態管理（Zustand）

### audioStore（`src/store/audioStore.ts`）

セッション中の BGM を全ページで共有するためのグローバルストア。

```typescript
{
  audio: HTMLAudioElement | null   // 現在再生中の音声要素
  meta: {
    label: string       // 表示用ラベル（例: "Focus · 波"）
    route: string       // "/app/focus" | "/app/relax"
    mode: "focus" | "relax"
    config: FocusConfig | RelaxConfig
  } | null
  timerSnap: TimerSnap | null      // 離脱時のタイマー状態
}
```

**TimerSnap**: `{ remainingSeconds, savedAt, isPaused, route }` — 画面離脱時に保存し復帰時に復元。

### historyStore（`src/store/historyStore.ts`）

セッション履歴と珈琲レコメンド表示制御。localStorage 永続化。

```typescript
{
  sessions: Session[]           // 過去セッションの記録
  lastCoffeeRecommendAt: number // 最後に珈琲レコメンドを表示したタイムスタンプ
}
```

- `addSession(session)`: セッション完了時に呼ぶ
- `shouldShowCoffeeRecommend()`: 前回表示から7日以上経過で true
- `markCoffeeRecommendShown()`: 表示後に呼んでタイムスタンプ更新

**珈琲レコメンドの実装注意**: `shouldShowCoffeeRecommend()` の結果は `useState(() => ...)` イニシャライザで初期値として固定すること。`markCoffeeRecommendShown()` が呼ばれて store が更新されると再レンダリングが走るため、セレクタで直接参照するとレコメンドが即消える。

---

## 9. データファイル

| ファイル | 内容 |
|---------|------|
| `src/lib/getDailyPrompt.ts` | 日付ベースの日替わり感性プロンプト |
| `src/lib/getPairing.ts` | 気分×時間帯×季節のペアリングマトリクス |
| `src/data/pairings.json` | ペアリングデータ（Spotifyリンク + お菓子） |

---

## 10. ルーティン・ダッシュボード

| ページ | 概要 |
|--------|------|
| `/app/routine` | 週間ルーティン設定（曜日×時間帯でモードを設定） |
| `/app/dashboard` | My cup：過去セッションのカレンダー・ストリーク表示 |

---

## 11. PWA（Progressive Web App）

- **Service Worker**: Serwist（next-pwa後継）で静的アセット・音声ファイルをキャッシュ
- **manifest**: `start_url: /app`、テーマカラー `#0a0a0a`
- **sw.js**: ビルド時に自動生成（`public/sw.js`）

---

## 12. HP（公式サイト）

`/` 以下はブランドサイト。アプリとは別のレイアウト（Header/Footer あり）。

| ページ | 内容 |
|--------|------|
| `/` | トップ（灯台・波・モード紹介） |
| `/about` | ブランドストーリー |
| `/beans` | 珈琲豆一覧（microCMS API） |
| `/journal` | 読み物一覧（microCMS API） |

### HP ヒーローセクション

- 背景色: `#0d0a08`（純黒 `#0a0a0a` から暖色寄りの黒に変更）

---

## 13. デザイン — グレイン + ビネット

全ページ（HP・app含む）に `GrainOverlay`（`src/components/ui/GrainOverlay.tsx`）を適用。ルートレイアウト（`layout.tsx`）に配置。

| 項目 | 値 |
|------|----|
| グレイン | SVG feTurbulence / fractalNoise / baseFrequency 1.2 / 4オクターブ / opacity 0.025 |
| ビネット | radial-gradient 周辺 rgba(3,1,0,0.28) |
| z-index | grain: 9999 / vignette: 9998（固定） |
| pointer-events | none（クリック・タッチを一切ブロックしない） |

**Android 実装上の注意**:  
SVG + `position:fixed` + CSS filter（feTurbulence）の組み合わせで、Android Chrome は `pointer-events:none` を無視するバグがある。外側を `<div>` でラップして `position:fixed` / `pointer-events:none` を div に持たせ、SVG は内側で `position:absolute` にすることで回避。

---

## 14. iOS・Android 対応まとめ

### iOS

| 問題 | 対策 |
|------|------|
| `HTMLAudioElement.volume` が無視される | Web Audio API GainNode で音量制御（`connectGain`、iOS専用） |
| `AudioContext` がジェスチャーなしでは起動できない | モジュールロード時に生成（suspended）→ 初回タップで `resume()` |
| `AudioContext.statechange` イベントが発火しない | `setInterval` でポーリング（statechange 非依存） |
| useEffect からの `audio.play()` が失敗する | HTMLAudioElement unlock パターン（無音WAVで初回ジェスチャー時にセッション解放） |
| zyunnbi の play→pause が一瞬聴こえる | unlock 専用の無音 WAV（data URI）を使用し、zyunnbi 本体には触れない |
| スクリーンロック時に BGM が止まる | MediaSession `setActionHandler("pause", () => {})` で iOS からの停止命令を無効化 |

### Android

| 問題 | 対策 |
|------|------|
| SVG overlay がタッチを吸収する | GrainOverlay を `<div>` でラップ（SVG は内側 absolute） |
| `scrollbar-none` クラスが Chrome で効かない | `globals.css` に `.scrollbar-none::-webkit-scrollbar { display: none }` を追加 |
| BGM がバックグラウンドで止まる | MediaSession `setActionHandler` 登録（iOS と共通の対策） |

---

## 15. 主要コンポーネント一覧

```
src/
  app/
    app/
      page.tsx              アプリホーム
      layout.tsx            アプリレイアウト
      focus/page.tsx        Focusモード（ステップ管理）
      relax/page.tsx        Relaxモード（ステップ管理）
      dashboard/page.tsx    My cup
      routine/page.tsx      ルーティン設定
      spark/page.tsx        Spark（スタブ）
      reclaim/page.tsx      Reclaim（スタブ）
  components/
    focus/
      FocusSetup.tsx
      CoffeeTime.tsx
      FocusSession.tsx
      FocusBreak.tsx
      SessionSummary.tsx
      RollerPicker.tsx      時間選択ロールピッカー
      StepBar.tsx           ステップ進捗バー
    relax/
      RelaxSetup.tsx
      RelaxSession.tsx
      RelaxDone.tsx
    animations/
      LighthouseThin.tsx    灯台アニメーション（アプリ用細線版）
      WavesThin.tsx         波アニメーション
      FocusScene.tsx        Focus集中中シーン
      CampfireScene.tsx     焚き火シーン
      CafeScene.tsx         カフェシーン
      ButtonOrb.tsx         ボタン背景オーブエフェクト
    ui/
      GrainOverlay.tsx      フィルムグレイン+ビネット（全ページ適用）
    app/layout/
      BottomNav.tsx         アプリBottomNav（stopZyunnbi呼び出し）
      NowPlayingBar.tsx     再生中ミニプレイヤー
      SoundPreloader.tsx    効果音プリロード
    app/
      TodayRoutine.tsx      今日のルーティン表示
  lib/
    playSound.ts            音声ユーティリティ（全音声の一元管理）
    getDailyPrompt.ts
    getPairing.ts
    microcms.ts             microCMS API クライアント
  store/
    audioStore.ts
    historyStore.ts
    routineStore.ts
  hooks/
    useTimer.ts             Date.now()差分方式タイマー
```

---

## 16. 元仕様書からの主な変更点

| 項目 | 元の仕様 | 現在の実装 |
|------|---------|-----------|
| BGM 種別（Focus） | 雨・焚き火・カフェ・静寂 | **波・焚き火・カフェ・音楽** |
| Focus 時間選択 | 固定25/45/60分 | **ロールピッカーで5〜60分の任意値** |
| Relax 時間選択 | 固定3/5/10分 | **ロールピッカーで3〜60分の任意値** |
| 音声ライブラリ | Howler.js | **ライブラリなし（HTMLAudioElement + Web Audio API直接実装）** |
| BGM 音量フェード | Howler.js の fade | **Web Audio API GainNode（iOS対応）** |
| Spark・Reclaim | 実装済み | **スタブ（未実装）** |
| コーヒー補充提案 | 「2セット以上の場合のみ」 | **「前回表示から7日以上経過時のみ」** |
| 全ページデザイン | フラットな純黒 | **フィルムグレイン + ビネット（GrainOverlay）** |
| バックグラウンド再生 | metadata のみ設定 | **MediaSession setActionHandler で pause/stop を無効化** |
| Android タッチ | 未考慮 | **GrainOverlay を div ラップ、scrollbar-none webkit 対応** |
| CoffeeTime subtitle | `string` 型 | **`React.ReactNode` 型（JSX改行対応）** |
