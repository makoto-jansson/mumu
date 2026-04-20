# mumu Aboutページ — 焙煎者プロフィール実装ガイド

**バージョン**: v1.1（文面確定版）  
**作成日**: 2026年4月19日  
**実装優先度**: 高（SEO・E-E-A-T強化のため）

---

## 0. このドキュメントは何か

既存の `/about` ページに、焙煎者プロフィールセクションを追加するための実装ドキュメント。
Claude Code で実装する際の指示書として使える形式にしている。

### 実装する内容

1. **焙煎者プロフィールセクション**（HTML/JSX部分）
2. **Person構造化データ**(JSON-LD)
3. **既存Organization構造化データとの連携**（founderリンク）

### 配置場所

既存の `/about` ページの「mumuのストーリー」本文の後、フッターの前。

---

## 1. プロフィール文面（確定版）

```markdown
## 焙煎しているひと

マコ / 灯台の珈琲焙煎所mumu

自家焙煎珈琲豆のオンラインショップを運営しています。
「感性が、ふと、戻ってくる」をコンセプトに珈琲豆の焙煎や、瞑想アプリの開発を行っています。

---

焙煎は、Aillioという焙煎機で少量ずつ焙煎しています。
取り扱っているのは、いまはエチオピア（浅煎り）とインドネシア（深煎り）の2種類。
初めての方にも気軽に試していただけるように「まず100gから」お届けしています。

アプリのほうは、Focus（集中）・Relax（リラックス）・Spark（発想）・Reclaim（振り返り）の
4モード構成で、すべて無料・インストール不要で使えるようにしています。

最近、ドーパミン中毒だなあ...という方はぜひ使ってみてください。

---

読んでくださって、ありがとうございます。
豆のこと、アプリのこと、mumuのことについて、
Instagram や note でも少しずつ綴っています。
お気軽に覗いてみてください。

— マコ
```

---

## 2. React/JSX 実装サンプル

既存の `/about/AboutContent.tsx`（Client Component）に追加する想定。

### 2.1 コンポーネント構造

```tsx
// src/components/about/RoasterProfile.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export function RoasterProfile() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="border border-white/10 rounded-sm p-8 md:p-12 my-16 md:my-24"
      aria-labelledby="roaster-profile-heading"
    >
      {/* セクションラベル */}
      <p className="text-xs text-white/50 tracking-widest uppercase mb-8">
        ── 焙煎しているひと ──
      </p>

      <div className="flex flex-col md:flex-row md:items-start md:gap-12">
        {/* 顔写真 */}
        <div className="flex-shrink-0 mb-8 md:mb-0">
          <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border border-white/20">
            <Image
              src="/roaster/mako.jpg"
              alt="灯台の珈琲焙煎所mumu 焙煎者 マコ"
              fill
              sizes="(max-width: 768px) 160px, 192px"
              className="object-cover"
              priority={false}
            />
          </div>
        </div>

        {/* テキスト */}
        <div className="flex-1">
          <h2
            id="roaster-profile-heading"
            className="text-2xl md:text-3xl font-medium mb-2 text-[#e8e6e1]"
          >
            マコ
          </h2>
          <p className="text-sm text-white/60 mb-8">
            灯台の珈琲焙煎所mumu
          </p>

          <div className="space-y-6 text-[#e8e6e1]/90 leading-loose text-[15px]">
            <p>
              自家焙煎珈琲豆のオンラインショップを運営しています。
            </p>

            <p>
              「感性が、ふと、戻ってくる」をコンセプトに
              珈琲豆の焙煎や、瞑想アプリの開発を行っています。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-white/20" aria-hidden="true" />
            </div>

            <p>
              焙煎は、<a
                href="https://aillio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >Aillio</a>という焙煎機で少量ずつ焙煎しています。
              取り扱っているのは、いまは<a
                href="/beans"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >エチオピア（浅煎り）とインドネシア（深煎り）</a>の2種類。
              初めての方にも気軽に試していただけるように「まず100gから」お届けしています。
            </p>

            <p>
              <a
                href="/app"
                className="underline decoration-[#EF9F27]/40 underline-offset-4 hover:decoration-[#EF9F27] transition"
              >アプリ</a>のほうは、Focus（集中）・Relax（リラックス）・Spark（発想）・Reclaim（振り返り）の
              4モード構成で、すべて無料・インストール不要で使えるようにしています。
            </p>

            <p className="text-white/75">
              最近、ドーパミン中毒だなあ...という方はぜひ使ってみてください。
            </p>

            {/* 区切り */}
            <div className="py-2">
              <span className="block h-px w-12 bg-white/20" aria-hidden="true" />
            </div>

            <p>
              読んでくださって、ありがとうございます。
              豆のこと、アプリのこと、mumuのことについて、
              Instagram や note でも少しずつ綴っています。
              お気軽に覗いてみてください。
            </p>

            <p className="text-white/70 pt-2">
              — マコ
            </p>
          </div>

          {/* SNSリンク */}
          <div className="mt-10 pt-8 border-t border-white/10">
            <div className="flex gap-6 text-sm">
              <a
                href="https://www.instagram.com/mumu_coffee_roaster/"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-[#e8e6e1]/80 hover:text-[#EF9F27] transition"
              >
                Instagram →
              </a>
              <a
                href="https://note.com/mumu_coffee"
                target="_blank"
                rel="noopener noreferrer me"
                className="text-[#e8e6e1]/80 hover:text-[#EF9F27] transition"
              >
                note →
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
```

### 2.2 既存Aboutページへの組み込み

```tsx
// src/app/about/AboutContent.tsx
import { RoasterProfile } from "@/components/about/RoasterProfile";

export function AboutContent() {
  return (
    <>
      {/* 既存のストーリーコンテンツ */}
      <section>
        {/* mumuのストーリー本文 */}
      </section>

      {/* 新規追加：焙煎者プロフィール */}
      <RoasterProfile />

      {/* 既存のフッターへ続く */}
    </>
  );
}
```

### 2.3 画像ファイルの配置

```
public/
  └── roaster/
      └── mako.jpg   # 推奨サイズ: 480×480px以上（正方形）、50-150KB程度
```

**画像の注意点**:
- 顔がしっかり写っていること（E-E-A-Tの観点）
- 暗めのトーン（mumuの世界観と一致）
- JPEG品質85%程度、WebP変換は Next.js が自動で行う
- `alt` 属性は「灯台の珈琲焙煎所mumu 焙煎者 マコ」固定

---

## 3. Person構造化データ（JSON-LD）

### 3.1 実装場所

`/about` ページの `<head>` に埋め込む。Next.js App Router の場合、
`src/app/about/page.tsx`（Server Component）で `<script>` タグとして出力する。

### 3.2 JSON-LD スニペット

```tsx
// src/app/about/page.tsx
export default function AboutPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://mumu-coffee.com/about#mako",
    "name": "マコ",
    "alternateName": "Mako",
    "url": "https://mumu-coffee.com/about",
    "image": "https://mumu-coffee.com/roaster/mako.jpg",
    "jobTitle": "焙煎者・アプリ開発者",
    "description": "灯台の珈琲焙煎所mumuを運営。「感性が、ふと、戻ってくる」をコンセプトに、自家焙煎珈琲豆のオンラインショップと瞑想アプリの開発を行っています。",
    "worksFor": {
      "@type": "Organization",
      "@id": "https://mumu-coffee.com/#organization",
      "name": "灯台の珈琲焙煎所mumu",
      "url": "https://mumu-coffee.com"
    },
    "knowsAbout": [
      "スペシャルティコーヒー",
      "コーヒー焙煎",
      "Aillio焙煎機",
      "瞑想",
      "ウェルビーイング",
      "集中・リラックス・発想の習慣化",
      "Webアプリケーション開発"
    ],
    "sameAs": [
      "https://www.instagram.com/mumu_coffee_roaster/",
      "https://note.com/mumu_coffee"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <AboutContent />
    </>
  );
}
```

### 3.3 既存Organization構造化データとの統合

既存の Organization 構造化データ（トップページに配置済み）を、
Personと相互リンクする形に更新する。

```tsx
// src/app/layout.tsx または src/app/page.tsx
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://mumu-coffee.com/#organization",  // ← @id を追加
  "name": "灯台の珈琲焙煎所mumu",
  "alternateName": "mumu",
  "url": "https://mumu-coffee.com",
  "logo": "https://mumu-coffee.com/logo.png",
  "description": "感性が、ふと、戻ってくる場所。スペシャルティコーヒーの焙煎と、珈琲のある時間をつくるツールをお届けします。",
  "founder": {                                     // ← founder を追加
    "@type": "Person",
    "@id": "https://mumu-coffee.com/about#mako",
    "name": "マコ"
  },
  "sameAs": [
    "https://www.instagram.com/mumu_coffee_roaster/",
    "https://note.com/mumu_coffee",
    "https://mumucoffee.theshop.jp/"
  ]
};
```

### 3.4 スキーマの意味解説

| プロパティ | 役割 | SEO効果 |
|-----------|------|---------|
| `@id` | このPersonの一意なURI | Organizationと相互リンクできる |
| `name` | 表示名（マコ） | 指名検索時の同一人物認識 |
| `image` | 顔写真のURL | 知識パネル等に表示される可能性 |
| `jobTitle` | 役割 | 専門性の明示 |
| `worksFor` | 所属組織 | 組織との関係を機械可読化 |
| `knowsAbout` | 専門領域 | 記事のトピックとの関連強化 |
| `sameAs` | 同一人物の他プラットフォーム | エンティティ認識の強化 |

---

## 4. 記事への著者情報連携（将来的な拡張）

Phase 2 以降、`/journal/[slug]` 個別記事ページで `Article` スキーマを実装する際、
`author` フィールドに Person の `@id` を参照させることで、著者性を全記事に展開できる。

```tsx
// src/app/journal/[slug]/page.tsx（将来実装）
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "image": article.eyecatch.url,
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt,
  "author": {
    "@type": "Person",
    "@id": "https://mumu-coffee.com/about#mako",  // Aboutページと同じ @id を参照
    "name": "マコ"
  },
  "publisher": {
    "@type": "Organization",
    "@id": "https://mumu-coffee.com/#organization"
  }
};
```

これにより、**全記事が「マコさんが書いた」という情報と紐づく**。
E-E-A-TのExperience評価が記事単位で積み上がる設計になる。

---

## 5. 実装チェックリスト

Claude Code での実装時に確認すべき項目。

- [ ] `public/roaster/mako.jpg` に顔写真を配置（480×480px以上、正方形、暗めトーン）
- [ ] `src/components/about/RoasterProfile.tsx` を新規作成
- [ ] `src/app/about/AboutContent.tsx` に `<RoasterProfile />` を組み込み
- [ ] `src/app/about/page.tsx` に Person JSON-LD を埋め込み
- [ ] 既存の Organization JSON-LD に `@id` と `founder` を追加
- [ ] Instagram・noteリンクに `rel="me"` 属性を追加（同一人物マークアップの補強）
- [ ] モバイル表示で写真とテキストの縦積みが美しいか確認
- [ ] Google Rich Results Test で Person スキーマの検証（https://search.google.com/test/rich-results）
- [ ] Lighthouse で Accessibility スコア 95+ を維持
- [ ] 文面の最終確認（マコさん本人の承認）

---

## 6. 検証方法

### Rich Results Test

実装後、以下のURLで Person スキーマが正しく認識されているか確認：

```
https://search.google.com/test/rich-results?url=https://mumu-coffee.com/about
```

### ブラウザのdevtoolsで確認

```bash
# ページのHTMLから JSON-LD を抽出して整形
curl -s https://mumu-coffee.com/about | grep -A 100 'application/ld+json' | head -50
```

---

## 7. 運用メモ

- プロフィール写真は年1回程度更新を推奨（古い印象を避ける）
- 文面は半年〜1年単位で見直す（活動内容の変化を反映）
- Instagramのハンドルが変わった場合、JSON-LDの `sameAs` も忘れず更新
- 豆の取扱銘柄が増えた場合、プロフィール本文の該当箇所を更新

---

*このドキュメントは `mumu_brand_site_spec.md` v2.0 の補足資料として運用する。*
