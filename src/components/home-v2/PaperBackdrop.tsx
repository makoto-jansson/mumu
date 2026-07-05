// v2デザインの背景レイヤー（紙テクスチャ＋左右の手書き縦線）
// position:fixed / z-index:-1 の固定レイヤー方式（iOS非対応の background-attachment:fixed は不使用）
// TOP・下層ページで共有する。

import styles from "./homeV2.module.css";

export default function PaperBackdrop() {
  return (
    <>
      <div className={styles.paperBg} aria-hidden="true" />
      <div className={styles.inkLine} aria-hidden="true" />
      <div
        className={`${styles.inkLine} ${styles.inkLineLeft}`}
        aria-hidden="true"
      />
    </>
  );
}
