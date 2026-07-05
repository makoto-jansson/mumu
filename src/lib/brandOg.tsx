// ブランドOGP画像の生成（next/og）。
// 指示書「og:imageはcup.pngベースで1200×630」に対応。
// 文言はすべて手書き画像素材（tagline / mumu-script）を使うためフォント読込は不要。
// ImageMagick等の外部ツールを使わず、Next.jsのImageResponseで生成する。

import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

// public配下の画像をdata URIに変換（ネットワーク非依存で確実に埋め込む）
function dataUri(relPath: string, mime = "image/png"): string {
  const buf = readFileSync(join(process.cwd(), relPath));
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "灯台の珈琲焙煎所 mumu — 感性が、ふと、戻ってくる場所";
export const OG_CONTENT_TYPE = "image/png";

export function createBrandOg(): ImageResponse {
  const cup = dataUri("public/v2/cup.png");
  const tagline = dataUri("public/v2/tagline.png"); // 灯台の珈琲焙煎所（401×47）
  const script = dataUri("public/v2/mumu-script.png"); // mumu 筆記体（611×100）

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f9f7",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cup} width={188} height={188} alt="" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tagline}
          width={300}
          height={35}
          alt=""
          style={{ marginTop: 34 }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={script}
          width={396}
          height={65}
          alt=""
          style={{ marginTop: 16 }}
        />
      </div>
    ),
    { ...OG_SIZE }
  );
}
