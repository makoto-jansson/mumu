// 記事末尾の「mumuの珈琲豆」— 本文に豆カードが無い記事だけで表示する（判定は /column/[id] 側）
// 見た目は本文の豆カード（lib/articleHtml の rebuildBeanCards で組み直したもの）と同じクラスを使う。
// 各カードはBASEのショップトップではなく、その豆の個別商品ページへ直接リンクする。

import { shopUrlWithUtm, type BeanView } from "@/lib/beans";
import a from "./article.module.css";

export default function ArticleBeans({ beans, slug }: { beans: BeanView[]; slug: string }) {
  if (beans.length === 0) return null;
  return (
    <section className={a.endBeans} aria-labelledby="column-beans-title">
      <h2 id="column-beans-title" className={a.endBeansTitle}>
        mumuの珈琲豆
      </h2>
      <p className={a.endBeansLead}>
        自家焙煎のスペシャルティコーヒーを100gから販売しています。購入はBASEのショップで行えます。
      </p>
      <div className={a.endBeansList}>
        {beans.map((b) => {
          const name = b.name.replace(/[\s　]+/g, " ");
          const en = b.roastKind === "light" ? "Light" : b.roastKind === "dark" ? "Dark" : "Medium";
          return (
            <a
              key={b.slug}
              // 記事→ショップ遷移をGA4のショップ側セッションで追えるようにUTMを付ける（end-block）
              href={shopUrlWithUtm(b.shopUrl, { medium: "column", campaign: slug, content: "end-block" })}
              target="_blank"
              rel="noopener"
              className={a.bc}
            >
              {b.image && (
                <span className={a.bcPkg}>
                  {/* 本文のカードと同じ組み方にそろえるため、ここだけ素の img を使う */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`${b.image.url}?w=320&fm=webp`} alt={`${name}の珈琲豆`} loading="lazy" />
                </span>
              )}
              <span className={a.bcHead}>
                <span className={a.bcLabel} aria-hidden="true">
                  mumu&apos;s Beans — {en}
                </span>
                <strong className={a.bcName}>{name}</strong>
                <span className={a.srOnly}>（{b.roastShort}）</span>
              </span>
              <span className={a.bcDesc}>{b.flavor}</span>
              <span className={a.bcFoot}>
                <span className={a.bcPrice}>¥{b.price.toLocaleString()}</span>
                <span className={a.bcBtn}>
                  BASEで購入する <span aria-hidden="true">↗</span>
                </span>
                <span className={a.srOnly}>（新しいタブで開きます）</span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
