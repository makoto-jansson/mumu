// 読みもののカード — 上が半円のアーチ画像、カテゴリ（欧文）、題名
// 記事にアイキャッチが無いときは、朝・夕・夜の灯台の絵を順番に使う。

import Link from "next/link";
import Image from "next/image";
import s from "./site.module.css";

export const FALLBACK = ["/v2/yuu-e.jpg", "/v2/asa-e.jpg", "/v2/yoru-e.jpg"];

export type ReadingItem = {
  id: string;
  title: string;
  category: string; // 欧文ラベル（Origin / Basics）
  image?: string;
};

export default function ReadingCard({
  item,
  index,
  sizes,
  className = "",
  tall = false,
  headingLevel = 3,
}: {
  item: ReadingItem;
  index: number;
  sizes: string;
  className?: string;
  tall?: boolean; // PCで縦長の窓にする（豆の詳細の4枚並び）
  headingLevel?: 2 | 3;
}) {
  const H = `h${headingLevel}` as const;
  return (
    <Link href={`/column/${item.id}`} className={`${s.readingCard} ${tall ? s.readingTall : ""} ${className}`}>
      <span className={s.readingImg}>
        <Image src={item.image ?? FALLBACK[index % FALLBACK.length]} alt="" fill sizes={sizes} />
      </span>
      <span className={`${s.label} ${s.readingCat}`}>{item.category}</span>
      <H className={s.readingTitle}>{item.title}</H>
    </Link>
  );
}
