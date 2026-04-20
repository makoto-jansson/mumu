// セクションブロック — 新デザインの基本骨格
// max-w-820 で中央寄せ、角丸18px、縦マージン詰めで「雑誌の見開き」感を演出

import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** 追加のクラス（外側 wrapper 用） */
  className?: string;
  /** 内側コンテナの追加クラス（padding 上書き等） */
  innerClassName?: string;
  /** 最小高さ（ヒーロー等で指定） */
  minHeight?: string;
};

export default function SectionBlock({
  children,
  className = "",
  innerClassName = "",
  minHeight,
}: Props) {
  return (
    <section className={`max-w-[820px] mx-auto mb-4 md:mb-5 ${className}`}>
      <div
        className={`relative rounded-[16px] md:rounded-[18px] overflow-hidden px-6 py-7 md:px-10 md:py-9 ${innerClassName}`}
        style={minHeight ? { minHeight } : undefined}
      >
        {children}
      </div>
    </section>
  );
}
