// 豆のカード — 白いアーチ窓にパッケージ写真、右に番号・名前・味・値段・購入ボタン
// Figma 部品「Bean card」。スマホでは下のボタンを出さず、名前から詳細ページへ進む。
// action: "buy"＝BASEで購入する（トップ）／"view"＝この豆を見る（豆の詳細の「ほかの豆」）

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { shopUrlWithUtm, type BeanView } from "@/lib/beans";
import { buttonClass } from "./ui";
import s from "./site.module.css";

const ROAST_EN: Record<BeanView["roastKind"], string> = { light: "Light", dark: "Dark", other: "Medium" };

export default function BeanCard({
  bean,
  index,
  medium,
  campaign,
  headingLevel = 3,
  action = "buy",
}: {
  bean: BeanView;
  index: number; // 0始まり。「No. 01」の番号になる
  medium: string; // UTM: どのページ種別から
  campaign: string; // UTM: どのページから
  headingLevel?: 2 | 3;
  action?: "buy" | "view";
}) {
  const H = `h${headingLevel}` as const;
  // 「インドネシア　マンデリン」→ 語ごとに分け、PCでは語ごとに改行する
  const words = bean.name.split(/[\s　]+/).filter(Boolean);
  const href = `/beans/${bean.slug}`;
  return (
    <article className={s.beanCard}>
      <Link href={href} className={s.beanArch} tabIndex={-1} aria-hidden="true">
        {bean.image && (
          <span className={s.beanPkg}>
            <Image src={bean.image.url} alt="" fill sizes="(min-width: 900px) 156px, 108px" />
          </span>
        )}
      </Link>
      <div className={s.beanInfo}>
        <span className={`${s.label} ${s.beanLabel}`} aria-hidden="true">
          No. {String(index + 1).padStart(2, "0")} — {ROAST_EN[bean.roastKind]}
        </span>
        <H className={s.beanName}>
          <Link href={href}>
            {/* 語の間の空白は span の外に置く（inline-block の中の末尾の空白は消えるため） */}
            {words.map((w, i) => (
              <Fragment key={i}>
                {i > 0 && " "}
                <span className={s.beanWord}>{w}</span>
              </Fragment>
            ))}
          </Link>
        </H>
        <p className={s.beanFlavor}>{bean.flavor}</p>
        <p className={s.beanPrice}>
          <span className={s.beanPriceNum}>¥{bean.price.toLocaleString()}</span>
          <span className={s.beanUnit}>
            / {bean.weight}・{bean.roastShort}
          </span>
        </p>
        {action === "view" ? (
          <Link href={href} className={buttonClass("outline", "S", s.beanBuy)}>
            この豆を見る
          </Link>
        ) : bean.onSale ? (
          <a
            href={shopUrlWithUtm(bean.shopUrl, { medium, campaign, content: "card" })}
            target="_blank"
            rel="noopener"
            className={buttonClass("primary", "S", s.beanBuy)}
          >
            購入する<span className={s.srOnly}>（BASEのオンラインショップ・新しいタブで開きます）</span>
          </a>
        ) : (
          <p className={s.beanOff}>ただいま販売をお休みしています。</p>
        )}
      </div>
    </article>
  );
}
