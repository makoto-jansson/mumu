// v3 の共通部品で使う小さな道具（ボタンのクラス名など）

import s from "./site.module.css";

export type ButtonStyle = "primary" | "outline" | "white";
export type ButtonSize = "L" | "S";

// Figma の Button（Style × Size）に対応するクラス名を返す
export function buttonClass(style: ButtonStyle = "primary", size: ButtonSize = "L", extra = ""): string {
  return [s.btn, s[style], size === "L" ? s.btnL : s.btnS, extra].filter(Boolean).join(" ");
}

export { s as siteStyles };
