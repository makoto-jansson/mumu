// 豆の一覧の1行 — 左に淡い青のアーチ窓とパッケージ、右に番号・名前・味・値段・2つのボタン（/beans）
// Figma「PC｜豆の一覧」51:295 の豆の行。スマホでは縦に積み、ボタンは横いっぱい。

import Link from "next/link";
import Image from "next/image";
import { shopUrlWithUtm, type BeanView } from "@/lib/beans";
import { buttonClass } from "@/components/site/ui";
import site from "@/components/site/site.module.css";
import { beanName } from "./TasteMap";
import s from "./beanPage.module.css";

export const ROAST_EN: Record<BeanView["roastKind"], string> = { light: "Light", dark: "Dark", other: "Medium" };

export default function BeanRow({ bean, index }: { bean: BeanView; index: number }) {
  const href = `/beans/${bean.slug}`;
  const name = beanName(bean);
  return (
    <article className={s.row}>
      <Link href={href} className={s.rowArch} tabIndex={-1} aria-hidden="true">
        <span className={s.rowArchBox}>
          {bean.image && (
            <span className={s.rowPkg}>
              <Image
                src={bean.image.url}
                alt=""
                fill
                sizes="(min-width: 900px) 200px, 50vw"
                loading={index === 0 ? "eager" : "lazy"}
              />
            </span>
          )}
        </span>
      </Link>
      <div className={s.rowInfo}>
        <span className={`${site.label} ${s.rowLabel}`} aria-hidden="true">
          No. {String(index + 1).padStart(2, "0")} — {ROAST_EN[bean.roastKind]}
        </span>
        <div className={s.rowNameBox}>
          <h2 className={s.rowName}>
            <Link href={href}>{name}</Link>
          </h2>
          {bean.detail?.nameEn && (
            <span className={`${site.label} ${s.rowEn}`} aria-hidden="true">
              {bean.detail.nameEn}
            </span>
          )}
        </div>
        <p className={s.rowFlavor}>{bean.flavor}</p>
        <p className={s.price}>
          <span className={s.priceNum}>¥{bean.price.toLocaleString()}</span>
          <span className={s.priceUnit}>/ {bean.weight}</span>
          {bean.pricePerCup && <span className={s.priceCup}>1杯あたり {bean.pricePerCup}</span>}
        </p>
        <div className={s.rowBtns}>
          {bean.onSale ? (
            <a
              href={shopUrlWithUtm(bean.shopUrl, { medium: "beans", campaign: "index", content: "row" })}
              target="_blank"
              rel="noopener"
              className={buttonClass("primary", "L")}
            >
              BASEで購入する <span className={site.arrow} aria-hidden="true">↗</span>
              <span className={site.srOnly}>（{name}・新しいタブで開きます）</span>
            </a>
          ) : (
            <p className={s.off}>ただいま販売をお休みしています。</p>
          )}
          <Link href={href} className={buttonClass("outline", "L")}>
            <span className={site.srOnly}>{name}を</span>詳しく見る
          </Link>
        </div>
      </div>
    </article>
  );
}
