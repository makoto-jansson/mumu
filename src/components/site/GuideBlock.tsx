// 「はじめての方へ」の帯 — 送料・発送・豆と粉の3点を、買う前に先に見せる
// トップ（青地）と豆の一覧（淡い青地）で共通。Figma「PC｜トップ」「PC｜豆の一覧」の「はじめての方へ」。
// PC: 左に見出しとボタン、右に3点。スマホ: 見出し → 3点 → ボタン（横いっぱい）。

import Link from "next/link";
import InfoItem from "./InfoItem";
import { buttonClass } from "./ui";
import s from "./site.module.css";

export default function GuideBlock({
  tone,
  button,
}: {
  tone: "blue" | "pale";
  button: { href: string; label: string; arrow?: boolean };
}) {
  const blue = tone === "blue";
  return (
    <section
      className={`${s.guideBand} ${blue ? `${s.guideBlue} ${s.onBlue}` : s.guidePale}`}
      aria-labelledby="guide-title"
    >
      <div className={`${s.wrap} ${s.guideGrid}`}>
        <h2 id="guide-title" className={s.guideTitle}>
          <span className={`${s.label} ${s.vLabel}`} aria-hidden="true">
            Guide
          </span>
          <span className={s.guideHead}>
            <span className={s.guideEn} aria-hidden="true">
              First <br className={s.brPc} />
              time?
            </span>
            <span className={s.guideJa}>はじめての方へ</span>
          </span>
        </h2>
        <dl className={s.infoList}>
          <InfoItem label="Shipping" main="送料 全国一律 ¥350" note="ゆうパケットポストでお届け" />
          <InfoItem label="Delivery" main="7日以内に発送" note="お支払いの確定後" />
          <InfoItem label="Beans / Ground" main="豆のまま／粉" note="粉は備考欄に「粉希望」と記入" />
        </dl>
        <Link href={button.href} className={buttonClass(blue ? "white" : "outline", "L", s.guideBtn)}>
          {button.label}
          {button.arrow && (
            <span className={s.arrow} aria-hidden="true">
              →
            </span>
          )}
        </Link>
      </div>
    </section>
  );
}
