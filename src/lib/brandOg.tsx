// ブランドOGP画像の生成（next/og）。
// 指示書「og:imageはcup.pngベースで1200×630」に対応。
// 文言はすべて手書き画像素材（tagline / mumu-script）を使うためフォント読込は不要。
// ローカル画像は公式docs準拠で node:fs/promises により base64 data URI 化して埋め込む
// （呼び出し側ルートで runtime="nodejs" を明示。edgeバンドルでの fs 解決不能を回避）。

import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// public配下の画像をdata URIに変換（プロジェクトルート基準、ネットワーク非依存）
async function dataUri(relPath: string, mime = "image/png"): Promise<string> {
  const base64 = await readFile(join(process.cwd(), relPath), "base64");
  return `data:${mime};base64,${base64}`;
}

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_ALT = "灯台の珈琲焙煎所 mumu — 感性が、ふと、戻ってくる場所";
export const OG_CONTENT_TYPE = "image/png";

export async function createBrandOg(): Promise<ImageResponse> {
  const [cup, tagline, script] = await Promise.all([
    dataUri("public/v2/cup.png"),
    dataUri("public/v2/tagline.png"), // 灯台の珈琲焙煎所（401×47）
    dataUri("public/v2/mumu-script.png"), // mumu 筆記体（611×100）
  ]);

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
