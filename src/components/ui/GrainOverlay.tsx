// フィルムグレイン + ビネットオーバーレイ
// SVG feTurbulence によるアナログ/紙質感をページ全体に付与する
//
// 【Android対応】
//   position:fixed な SVG に CSS filter（feTurbulence）を使うと
//   Android Chrome では GPU コンポジットレイヤーが pointer-events:none を
//   無視するバグが存在する。
//   → 外側を <div> でラップし、fixed + pointer-events:none をdivに持たせることで回避
//   → SVG は内側で position:absolute に変更（見た目・動作は変わらない）

export default function GrainOverlay() {
  return (
    // Android Chrome対応: fixed + pointer-events:none はdivで持つ
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      {/* フィルムグレイン */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <filter id="pageGrain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="1.2"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#pageGrain)" opacity="0.025" />
      </svg>

      {/* ビネット（周辺光量落ち）*/}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(3,1,0,0.28) 100%)",
        }}
      />
    </div>
  );
}
