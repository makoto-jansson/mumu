# mumu Phase 0 — セットアップ手順書

## 非エンジニア向け・VS Code + Claude Code で開発する手順

**所要時間**: 1〜2時間（初回のみ）
**必要なもの**: パソコン（Mac推奨）、クレジットカード、メールアドレス
**開発環境**: VS Code + Claude Code 拡張機能

---

## 全体の流れ（9ステップ）

```
STEP 1. Claude の有料プランに加入する（5分）
STEP 2. VS Code をインストールする（5分）
STEP 3. Claude Code を VS Code に入れる（5分）
STEP 4. GitHub アカウントを作る（5分）
STEP 5. Vercel アカウントを作る（5分）
STEP 6. microCMS アカウントを作る（10分）
STEP 7. 独自ドメインを取得する（10分）
STEP 8. プロジェクトを作る（Claude Code にお願いする）（15分）
STEP 9. 世の中に公開する（10分）
```

---

## STEP 1. Claude の有料プランに加入する

### なぜ必要か
Claude Code（AIにコードを書いてもらうツール）を使うには、Claudeの有料プランが必要です。

### やること

1. **https://claude.ai にアクセス**
2. まだアカウントがなければ「Sign up」で作成（メールアドレスで登録）
3. ログイン後、画面左下のプラン表示をクリック → 「Upgrade」
4. **「Pro」プラン（月額$20 ≒ 約3,000円）を選ぶ**
   - 最初はこれで十分。物足りなくなったら後からアップグレードできる
5. クレジットカード情報を入力して完了

### 確認ポイント
- ログイン後、プランが「Pro」になっていればOK

---

## STEP 2. VS Code をインストールする

### なぜ必要か
VS Code（Visual Studio Code）は「コードを書くためのメモ帳アプリ」のようなもの。Claude Codeはこの中で動きます。AIが編集しているファイルをリアルタイムで見られるのが大きなメリットです。

### やること

1. **https://code.visualstudio.com/ にアクセス**
2. 「Download」ボタンをクリック（Mac / Windows を自動判定してくれる）
3. ダウンロードしたファイルを開いてインストール
   - Mac: .dmgファイルを開く → Applicationsフォルダにドラッグ
   - Windows: .exeファイルを実行 → 指示に従ってインストール
4. VS Codeを起動してみる

### 日本語化（任意だけどおすすめ）

1. VS Codeを開く
2. 左側の四角いアイコン（拡張機能）をクリック
3. 検索欄に「Japanese」と入力
4. 「Japanese Language Pack for Visual Studio Code」をインストール
5. VS Codeを再起動 → メニューが日本語になる

### 確認ポイント
- VS Codeが起動して、画面が表示されればOK

---

## STEP 3. Claude Code を VS Code に入れる

### なぜ必要か
Claude Code の拡張機能を VS Code に入れると、エディタの中でAIとチャットしながら開発できます。AIが書いたコードがリアルタイムでファイルに反映されるのを横目で見ながら進められます。

### やること

#### 3-A. まずClaude Code本体をインストール

1. **ターミナルを開く**
   - Mac: 「アプリケーション」→「ユーティリティ」→「ターミナル」を起動
   - Windows: 「スタートメニュー」→「PowerShell」を起動
   - または VS Code のメニュー →「ターミナル」→「新しいターミナル」でもOK

2. **以下の1行をコピペしてEnter**（Mac の場合）
```
curl -fsSL https://cli.claude.com/install.sh | sh
```
   - Windows の場合は以下:
```
irm https://cli.claude.com/install.ps1 | iex
```

3. **インストール確認** — 以下を入力してEnter:
```
claude --version
```
   - バージョン番号が表示されればOK

4. **初回ログイン** — 以下を入力してEnter:
```
claude
```
   - 「subscription（月額サブスク）」が含まれている選択肢を選ぶ
   - ブラウザが開くので、STEP 1のClaudeアカウントでログイン
   - 「認証に成功しました」的な画面が出たら完了
   - ターミナルに戻って `/exit` と入力して一旦終了

#### 3-B. VS Code に拡張機能をインストール

1. **VS Code を開く**
2. **左サイドバーの四角いアイコン（拡張機能）をクリック**
3. **検索欄に「Claude Code」と入力**
4. **「Claude Code」（Anthropic公式）が出てくるので「インストール」をクリック**
   - 必ず発行元が「Anthropic」のものを選ぶ
5. **インストール完了後、VS Codeの左サイドバーにClaude Codeのアイコンが追加される**
6. **アイコンをクリック → チャット画面が開く**
7. **初回はサインインを求められるので、画面の指示に従う**

### 確認ポイント
- VS Code の左サイドバーにClaude Codeのアイコンがあり、チャット画面が開ければOK

---

## STEP 4. GitHub アカウントを作る

### なぜ必要か
GitHub は「コードの保管庫」です。Claude Code が作ったコードをここに保存します。Vercel（サイトを公開するサービス）との連携にも必要です。

### やること

1. **https://github.com にアクセス**
2. 「Sign up」をクリック
3. メールアドレス、パスワード、ユーザー名を入力して登録
   - ユーザー名は何でもOK（例: mumu-coffee）
4. メールに届いた確認リンクをクリックして完了
5. **料金: 無料**（Free プランで十分）

### 確認ポイント
- https://github.com にログインできればOK

---

## STEP 5. Vercel アカウントを作る

### なぜ必要か
Vercel は「Webサイトを世界中に公開するサービス」です。GitHubにコードを保存すると、自動的にWebサイトとして公開してくれます。

### やること

1. **https://vercel.com にアクセス**
2. 「Sign Up」をクリック
3. **「Continue with GitHub」を選ぶ**（STEP 4で作ったGitHubアカウントで連携）
4. GitHubとの連携を許可する画面が出たら「Authorize」をクリック
5. 「Hobby」プランを選択（個人利用。無料）
6. 登録完了

### 確認ポイント
- https://vercel.com のダッシュボードが表示されればOK
- 料金: 無料（Hobbyプラン）

---

## STEP 6. microCMS アカウントを作る

### なぜ必要か
microCMS はブログ記事や珈琲豆の情報を管理するための「管理画面」です。WordPressの管理画面だけを提供してくれるサービスだと思ってください。ここでブログ記事を書いて「公開」ボタンを押すと、サイトに自動反映されます。

### やること

1. **https://microcms.io にアクセス**
2. 「無料ではじめる」をクリック
3. メールアドレスとパスワードで登録
4. サービスを作成:
   - サービス名: 「mumu」
   - サービスID: 「mumu-coffee」（これがURLの一部になる）
5. 最初のAPI（ブログ用）を作成:
   - テンプレートから「ブログ」を選ぶ
   - 自動的にタイトル・本文・カテゴリのフィールドが作られる
6. APIキーを確認:
   - 管理画面の「サービス設定」→「APIキー」に表示される
   - これを後でClaude Codeに渡す（サイトとmicroCMSを接続するための鍵）

### 確認ポイント
- 管理画面が表示されて、「ブログ」APIが作成されていればOK
- 料金: 無料（Hobbyプラン。API数3つ、メンバー3人まで）

---

## STEP 7. 独自ドメインを取得する

### なぜ必要か
「mumu-coffee.com」のような、自分だけのURLを持つためです。これがないと「xxx.vercel.app」という仮のURLになってしまいます。

### やること

1. **どのドメインにするか決める**
   - 候補例:
     - mumu-coffee.com
     - mumucoffee.com
     - mumu.coffee（.coffee ドメインもある）
   - 短くて覚えやすいものがベスト

2. **ドメインを購入する（以下のどれかで）**

   **おすすめ: Vercel Domains（一番簡単）**
   - Vercelのダッシュボード → 「Domains」→ 「Buy」
   - 希望のドメイン名を検索 → 購入（年間$10〜20程度）
   - Vercelで購入するとDNS設定が自動なので一番楽

   **代替: お名前.com や Google Domains**
   - https://www.onamae.com/ 等で購入も可能
   - ただし後でVercelにDNS設定を手動で行う必要がある

### 確認ポイント
- 購入したドメインが管理画面に表示されていればOK
- 料金: 年間1,500〜3,000円程度

---

## STEP 8. プロジェクトを作る（VS Code + Claude Code で）

### なぜ必要か
ここからが本番。VS Code の中で Claude Code に「mumuのWebサイトを作って」とお願いします。

### やること

1. **作業フォルダを作る**
   - Macの場合: Finderを開く → 「書類」フォルダに「mumu」という新しいフォルダを作る
   - この中にサイトの全ファイルが入ることになる

2. **VS Code でフォルダを開く**
   - VS Code を起動
   - メニュー →「ファイル」→「フォルダーを開く」
   - さっき作った「mumu」フォルダを選ぶ
   - VS Code の左側にフォルダの中身が表示される（最初は空）

3. **Claude Code のチャットを開く**
   - VS Code の左サイドバーにある Claude Code のアイコンをクリック
   - チャットパネルが開く

4. **Claude Code に以下のメッセージを送る**（コピペでOK）

```
以下の要件でNext.jsプロジェクトをセットアップしてください。

■ プロジェクト名: mumu
■ 技術スタック:
- Next.js 14+（App Router）
- TypeScript
- Tailwind CSS
- Framer Motion
- microcms-js-sdk（microCMS連携用）

■ やってほしいこと:
1. Next.jsプロジェクトを新規作成
2. Tailwind CSS をセットアップ
3. Framer Motion をインストール
4. microcms-js-sdk をインストール
5. 以下のディレクトリ構造を作成:
   - src/app/ （ページ）
   - src/components/ （コンポーネント）
   - src/libs/ （microCMS接続設定）
   - public/ （画像や音声）
6. .env.local ファイルに以下の環境変数を設定:
   MICROCMS_SERVICE_DOMAIN=mumu-coffee
   MICROCMS_API_KEY=（後で設定するのでダミー値を入れておいて）
7. トップページ（src/app/page.tsx）に仮のテキスト「灯台の珈琲焙煎所 mumu」を表示
8. 開発サーバーを起動して確認

■ 注意:
- 日本語のコメントをコードに入れてください
- 何をしているか説明しながら進めてください
```

5. **Claude Code が自動でファイルを作り始める**
   - VS Code の左側（ファイルエクスプローラー）にファイルがどんどん追加されていくのが見える
   - 「許可しますか？」と聞かれたら「Yes」を選ぶ
   - 数分でプロジェクトの雛形が完成する

6. **動作確認**
   - Claude Code が「開発サーバーを起動しました」と言ったら
   - ブラウザで http://localhost:3000 にアクセス
   - 「灯台の珈琲焙煎所 mumu」と表示されていれば成功！
   - VS Code の画面と見比べながら、どのファイルが何を表示しているか確認できる

### VS Code の画面の見方

- **左側（エクスプローラー）**: ファイル一覧。Claude Code が追加・変更したファイルが即座に反映される
- **中央（エディタ）**: ファイルの中身（コード）。Claude Code の変更がリアルタイムでハイライト表示される
- **左サイドバーのClaude Codeアイコン**: チャットパネル。ここに指示を書く
- **下部（ターミナル）**: コマンドの実行結果（メニュー →「ターミナル」→「新しいターミナル」で開く）

### 確認ポイント
- ブラウザで http://localhost:3000 を開いて、何か表示されればOK

---

## STEP 9. 世の中に公開する

### なぜ必要か
STEP 8で作ったサイトは、まだ自分のパソコンの中だけにあります。これを世界中から見えるようにします。

### やること

1. **GitHubにコードを保存する**
   - VS Code のClaude Codeチャットに以下のメッセージを送る（コピペでOK）:

```
このプロジェクトをGitHubにpushしてください。
リポジトリ名は「mumu」でお願いします。
手順を説明しながら進めてください。
```

   - Claude Code が GitHub への保存を進めてくれる
   - 初回は GitHub の認証が求められるので、画面の指示に従う

2. **Vercelに接続する**
   - https://vercel.com にログイン
   - 「Add New Project」をクリック
   - 「Import Git Repository」で、さっき作った「mumu」リポジトリを選ぶ
   - **環境変数を設定する**（重要！）:
     - 「Environment Variables」のセクションで以下を追加:
     - Key: `MICROCMS_SERVICE_DOMAIN` / Value: `mumu-coffee`
     - Key: `MICROCMS_API_KEY` / Value:（STEP 6で確認したAPIキー）
   - 「Deploy」をクリック
   - 2〜3分でデプロイが完了

3. **独自ドメインを設定する**
   - Vercel のプロジェクト画面 → 「Settings」→ 「Domains」
   - STEP 7で購入したドメインを入力 → 「Add」
   - Vercelで購入したドメインなら自動で設定完了
   - 他のサービスで購入した場合は DNS 設定の手順が表示されるので従う

4. **確認**
   - ブラウザで自分のドメイン（例: https://mumu-coffee.com）にアクセス
   - 「灯台の珈琲焙煎所 mumu」と表示されていれば成功！

### 確認ポイント
- 自分のドメインでサイトが見えればOK！
- スマホからもアクセスしてみる

---

## Phase 0 完了！

ここまでで以下が手に入ります:

- ✅ VS Code + Claude Code の開発環境
- ✅ 独自ドメイン（mumu-coffee.com 等）
- ✅ microCMS の管理画面（ブログ記事をWordPressのように更新できる）
- ✅ Next.js プロジェクトが Vercel で公開されている
- ✅ GitHub にコードが保存されている
- ✅ 今後 Claude Code でコードを変更 → GitHub に push → 自動でサイトに反映される仕組み

---

## 次にやること（Phase 1: 公式HP）

Phase 0 が完了したら、VS Code の Claude Code チャットに仕様書の内容を渡します:

1. **mumu_brand_site_spec.md をmumuフォルダにコピー**
   - ダウンロードした仕様書ファイルを、mumuフォルダの中に入れる

2. **Claude Code に指示を送る**:
```
このプロジェクトのルートにある mumu_brand_site_spec.md を読んで、
Phase 1のタスクリストに従ってトップページから作ってください。
```

Claude Code が仕様書を読んで、トップページのデザインとコードを作ってくれます。
ファイルが追加・変更される様子をVS Codeの画面でリアルタイムに確認できます。

---

## 日常の開発フロー（Phase 1以降）

Phase 0が終わった後の毎日の作業はこうなります:

```
1. VS Code を開く
2. mumuフォルダを開く
3. Claude Code チャットを開く
4. やりたいことを日本語で書く
   例:「Aboutページを作って」「灯台のアニメーションを追加して」
5. Claude Code がコードを書いてくれる（VS Code上でリアルタイムに見える）
6. ブラウザで http://localhost:3000 を見て確認
7. OKなら Claude Code に「GitHubにpushして」と言う
8. Vercelが自動デプロイ → 本番サイトに反映
```

ブログ記事の更新はVS Codeを使わず、microCMSの管理画面（ブラウザ）だけで完結します。

---

## 困った時は

- **Claude Code が何か聞いてきたら**: よくわからなくても「Yes」で大丈夫（危険な操作の前には確認がある）
- **エラーが出たら**: エラーメッセージをそのまま Claude Code に貼り付けて「これはどういうエラー？直して」と聞く
- **わからないことがあったら**: Claude Code に日本語で「〇〇がわからない」と聞けば教えてくれる
- **ファイルがどこにあるかわからない**: VS Code の左側のファイルエクスプローラーを見る。Claude Codeに「〇〇のファイルはどこ？」と聞いてもOK
- **開発サーバーが止まった**: VS Code の下部ターミナルで `npm run dev` と入力してEnter

---

## 費用まとめ

| 項目 | 費用 | 頻度 |
|-----|------|------|
| Claude Pro プラン | 約3,000円 | 月額 |
| VS Code | 無料 | — |
| GitHub | 無料 | — |
| Vercel（Hobbyプラン） | 無料 | — |
| microCMS（Hobbyプラン） | 無料 | — |
| 独自ドメイン | 約1,500〜3,000円 | 年額 |
| **合計** | **約3,000円/月 + ドメイン年額** | |
