// フィルムグレイン + ビネットオーバーレイ
// SVG feTurbulence によるアナログ/紙質感をページ全体に付与する
// position: fixed でスクロールに追従せずビューポートに固定
// pointer-events: none で操作を一切ブロックしない

export default function GrainOverlay() {
  return (
    <>
      {/* フィルムグレイン */}
      <svg
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9999,
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
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 9998,
          background:
            "radial-gradient(ellipse 85% 75% at 50% 50%, transparent 40%, rgba(3,1,0,0.28) 100%)",
        }}
      />
    </>
  );
}
