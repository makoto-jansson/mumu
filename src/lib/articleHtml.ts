// 読みもの記事（microCMS「columns」）の本文HTMLを、表示用に整える関数
//
// ★ 原稿（microCMS / content/）は書き換えない。すべて表示するときに置き換える。
//    meta description・FAQ構造化データは、加工前の本文から作る（toPlain / parseFaq）。
// もとは /column/[id]/page.tsx にあった処理を、v3（青×白）への作り直しに合わせてここへ移した。

import type { BeanView } from "@/lib/beans";

// CSS Modules のクラス名（本文HTMLに埋め込むので、ページ側から受け取る）
export type ArticleClasses = Record<string, string>;

// ---------- 説明文・FAQ（加工前の本文から作る） ----------

// 記事本文から meta description / og:description を作る。
// microCMSに説明文の専用フィールドがないため本文の冒頭を使う。単純に文字数で切ると
// 「〜そして正」のように文の途中で途切れるので句点で切る。また要点を先に置く引用ブロックが
// あればそれを優先するが、ブロック内は「導入1行＋ハイフン箇条書き」の形なので、
// そのまま流すと検索結果に「- 粉12g」のようにハイフンが出てしまう。箇条書きだけを拾って
// 記号を外し、導入の1行（「先に要点を置いておきます」等）は情報量がないので捨てる。
export function toPlain(html: string, len = 120): string {
  const strip = (s: string) =>
    s
      .replace(/<figure[\s\S]*?<\/figure>/gi, "")
      .replace(/<(?:br|hr)\s*\/?>/gi, "\n")
      .replace(/<\/(?:p|li|h[1-6]|div|td|th|tr|blockquote)>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/[ \t　]+/g, " ")
      .replace(/\s*\n\s*/g, "\n")
      .trim();

  const quote = html.match(/<blockquote[\s\S]*?<\/blockquote>/i);
  let source: string;
  if (quote) {
    const lines = strip(quote[0]).split("\n").filter(Boolean);
    const bullets = lines.filter((l) => /^[-・*]\s/.test(l)).map((l) => l.replace(/^[-・*]\s*/, "").trim());
    source = bullets.length ? bullets.join("／") : lines.join(" ");
  } else {
    source = strip(html).replace(/\n/g, " ");
  }

  if (source.length <= len) return source;
  // len を超えない範囲で切る。読点より句点を優先しないと「〜そして、」のように
  // 接続詞で終わってしまう（2026-11-20に coffee-focus-brain で判明）。
  // 箇条書きを繋いだ場合は区切りの「／」がいちばん自然な切れ目になる。
  const head = source.slice(0, len);
  const bullet = source.includes("／");
  const period = head.lastIndexOf("。");
  const slash = head.lastIndexOf("／");
  const comma = head.lastIndexOf("、");
  if (bullet && slash >= len * 0.5) return head.slice(0, slash);
  if (period >= len * 0.5) return head.slice(0, period + 1);
  if (slash >= len * 0.5) return head.slice(0, slash);
  if (comma >= len * 0.5) return head.slice(0, comma + 1);
  return head;
}

// 一覧カード用の短い抜粋（図解SVG等は除く）
export function excerpt(html: string, len = 92): string {
  const text = (html || "")
    .replace(/<figure[\s\S]*?<\/figure>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > len ? text.slice(0, len) + "…" : text;
}

// 本文HTMLの「よくある質問」節から Q&A を抽出（FAQPage構造化データ用）。
// 基礎記事(<strong>Q. …</strong>)・産地記事(<strong>質問？</strong>)の両形式に対応。
export function parseFaq(html: string): { q: string; a: string }[] {
  const h = html.search(/<h2[^>]*>\s*よくある質問/);
  if (h < 0) return [];
  let seg = html.slice(h);
  const after = seg.slice(5).search(/<h2/i);
  if (after > 0) seg = seg.slice(0, after + 5);
  const items: { q: string; a: string }[] = [];
  const re = /<p>\s*<strong>\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(seg))) {
    const q = m[1]
      .replace(/^Q[.．]?\s*/, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim();
    const a = m[2].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
    if (q && a) items.push({ q, a });
  }
  return items;
}

// 本文に豆カードがあるか（ない記事だけ末尾に豆ブロックを出し、二重に売り込まない）
export const hasBeanCard = (html: string) =>
  /<a\b[^>]*href="https:\/\/mumucoffee\.theshop\.jp[^"]*"[^>]*\bstyle="|<a\b[^>]*\bstyle="[^"]*"[^>]*href="https:\/\/mumucoffee\.theshop\.jp/i.test(
    html
  );

// ---------- 表示用の加工 ----------

// 冒頭の要点ブロック（「先に要点を置いておきます。」＋ハイフン箇条書き）を、本物の箇条書きにする。
// 原稿は引用ブロック内に導入1行と「- 」の行を続けて書く形で、markdown変換では全体が1つの<p>になる。
// そのままだと改行が詰められ「… - 粉12g… - 粉24g…」と1段落につながって表示される（2026-11-25に20記事で判明）。
// 「導入の行 → 箇条書きの行」の順に並んでいるブロックだけを対象にし、それ以外の形は触らない。
// v3 では青い「Point」の箱にするため、クラスを付ける。
function formatSummaryLists(html: string, a: ArticleClasses): string {
  return html.replace(/<blockquote>\s*<p>([\s\S]*?)<\/p>\s*<\/blockquote>/gi, (all, inner: string) => {
    const lines = inner
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const isItem = (l: string) => /^[-・*]\s+/.test(l);
    const first = lines.findIndex(isItem);
    if (first < 0 || !lines.slice(first).every(isItem)) return all;
    const intro = lines.slice(0, first);
    const items = lines.slice(first).map((l) => l.replace(/^[-・*]\s+/, ""));
    return (
      `<blockquote class="${a.point}">` +
      `<p class="${a.pointLabel}" aria-hidden="true">Point</p>` +
      (intro.length ? `<p>${intro.join("<br>")}</p>` : "") +
      `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>` +
      "</blockquote>"
    );
  });
}

// 「よくある質問」の節を、1問ずつの箱（Q と A の印つき）に組み直す。
// 原稿は「<h2>よくある質問</h2>」の下に「<p><strong>質問</strong>答え</p>」が並ぶ形（2026-11-28 時点で47本中44本）。
// この形に当てはまる段落だけを置き換え、ほかの書き方の段落はそのまま残す。
// FAQ構造化データ（parseFaq）は加工前の本文から作るので、ここでの変換は影響しない。
function formatFaq(html: string, a: ArticleClasses): string {
  const start = html.search(/<h2[^>]*>\s*よくある質問\s*<\/h2>/);
  if (start < 0) return html;
  const headEnd = html.indexOf("</h2>", start) + 5;
  const next = html.slice(headEnd).search(/<h2\b/i);
  const end = next < 0 ? html.length : headEnd + next;
  const section = html.slice(headEnd, end);

  let count = 0;
  const items = section.replace(
    /<p>\s*<strong>\s*([\s\S]*?)<\/strong>\s*([\s\S]*?)<\/p>/g,
    (_all, q: string, ans: string) => {
      const question = q.replace(/^Q[.．]?\s*/, "").trim();
      if (!question || !ans.trim()) return _all;
      count++;
      return (
        `<div class="${a.faqItem}">` +
        `<p class="${a.faqQ}"><span class="${a.faqMark}" aria-hidden="true">Q</span><span>${question}</span></p>` +
        `<div class="${a.faqA}"><span class="${a.faqMark}" aria-hidden="true">A</span><p>${ans.trim()}</p></div>` +
        `</div>`
      );
    }
  );
  if (count === 0) return html;
  return html.slice(0, headEnd) + `<div class="${a.faq}">${items}</div>` + html.slice(end);
}

// 銘柄名の比較用（半角・全角スペースの揺れを吸収）
const normName = (s: string) => s.replace(/[\s　]/g, "");

// 本文の豆カード（style付き<a>）は原稿上どれもショップのトップを指している（2026-11-24時点で
// 45記事・77枚）。トップに飛ばすと読者が豆を探し直すことになるので、カード内の銘柄名
// （<strong>）を microCMS beans の name と照合し、その豆の個別商品ページへ差し替える。
// 照合できないカードはトップのまま残す。
function linkBeanCards(html: string, beans: BeanView[]): string {
  const byName = new Map(beans.map((b) => [normName(b.name), b.shopUrl]));
  return html.replace(/(<a\b[^>]*\bstyle="[^"]*"[^>]*>)([\s\S]*?<\/a>)/gi, (whole, open: string, rest: string) => {
    if (!/href="https:\/\/mumucoffee\.theshop\.jp\/?"/i.test(open)) return whole;
    const name = rest.match(/<strong\b[^>]*>([^<]+)<\/strong>/i)?.[1];
    const url = name ? byName.get(normName(name)) : undefined;
    if (!url) return whole;
    return open.replace(/href="[^"]*"/i, `href="${url}"`) + rest;
  });
}

// 本文の豆カードを、v3 の形（淡い青の箱・白いアーチ窓・値段・「BASEで購入する ↗」）に組み直す。
// 原稿のカードは旧デザインの色（深緑）を style 属性で直接持っているので、CSSでは塗り替えられない。
// 写真・銘柄名・焙煎度・記事ごとの紹介文は原稿のものを使い、値段は microCMS beans から足す。
function rebuildBeanCards(html: string, beans: BeanView[], a: ArticleClasses): string {
  const byName = new Map(beans.map((b) => [normName(b.name), b]));
  return html.replace(/<a\b([^>]*)\bstyle="[^"]*"([^>]*)>([\s\S]*?)<\/a>/gi, (whole, pre: string, post: string, inner: string) => {
    const attrs = pre + post;
    const href = attrs.match(/href="([^"]*)"/i)?.[1];
    if (!href || !/mumucoffee\.theshop\.jp/i.test(href)) return whole;
    const name = inner.match(/<strong\b[^>]*>([^<]+)<\/strong>/i)?.[1]?.trim();
    if (!name) return whole;
    const img = inner.match(/<img\b[^>]*>/i)?.[0] ?? "";
    const src = img.match(/src="([^"]*)"/i)?.[1];
    const alt = img.match(/alt="([^"]*)"/i)?.[1] ?? "";
    const roast = inner.match(/<\/strong>\s*<span\b[^>]*>([^<]+)<\/span>/i)?.[1]?.trim() ?? "";
    const desc = inner.match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1]?.trim() ?? "";
    const bean = byName.get(normName(name));
    const en = roast.includes("浅") ? "Light" : roast.includes("深") ? "Dark" : roast.includes("中") ? "Medium" : "";
    return (
      `<a href="${href}" target="_blank" rel="noopener" data-bean-card class="${a.bc}">` +
      (src ? `<span class="${a.bcPkg}"><img src="${src}" alt="${alt}" loading="lazy"></span>` : "") +
      `<span class="${a.bcHead}">` +
      `<span class="${a.bcLabel}" aria-hidden="true">mumu&#39;s Beans${en ? ` — ${en}` : ""}</span>` +
      `<strong class="${a.bcName}">${name}</strong>` +
      (roast ? `<span class="${a.srOnly}">（${roast}）</span>` : "") +
      `</span>` +
      (desc ? `<span class="${a.bcDesc}">${desc}</span>` : "") +
      `<span class="${a.bcFoot}">` +
      (bean ? `<span class="${a.bcPrice}">¥${bean.price.toLocaleString()}</span>` : "") +
      `<span class="${a.bcBtn}">${bean ? "BASEで購入する" : "ショップを見る"} <span aria-hidden="true">↗</span></span>` +
      `<span class="${a.srOnly}">（新しいタブで開きます）</span>` +
      `</span></a>`
    );
  });
}

// 本文内のショップ（mumucoffee.theshop.jp）へのリンクにUTMを付ける。
// ショップはGA4のクロスドメイン設定で「内部」扱いのため外部クリックが記録されず、
// 参照元もドメイン名までしか残らない。UTMで「どの記事のどのリンクから来たか」を
// ショップ側のセッション参照元として取れるようにする。
// 豆カード（組み直したものは data-bean-card、元の形は style 付き）は card、それ以外は本文中の文字リンク。
function addShopUtm(html: string, slug: string): string {
  return html.replace(/<a\b[^>]*>/gi, (tag) => {
    const m = tag.match(/href="(https:\/\/mumucoffee\.theshop\.jp[^"]*)"/i);
    if (!m || /utm_source=/.test(m[1])) return tag;
    const [base, hash = ""] = m[1].split("#");
    const params = new URLSearchParams({
      utm_source: "mumucoffee-feel",
      utm_medium: "column",
      utm_campaign: slug,
      utm_content: /\s(?:style="|data-bean-card)/i.test(tag) ? "card" : "text",
    });
    const sep = base.includes("?") ? "&" : "?";
    const next = `${base}${sep}${params.toString()}${hash ? `#${hash}` : ""}`;
    return tag.replace(m[0], `href="${next.replace(/&/g, "&amp;")}"`);
  });
}

// 図解（SVG）や紹介文に直接書かれた旧デザインの色を、v3 の青・淡い青に置き換える。
// 置き換えるのはサイトの地の色（深緑・灰色・淡い緑）だけ。焙煎度の茶色や注意の赤など、
// 図の中で意味を持つ色はそのまま残す（2026-11-28 全47記事を調べて決めた）。
const RECOLOR: [RegExp, string][] = [
  [/#004648\b/gi, "#0404fe"], // 深緑（線・文字）
  [/#5a5f5c\b/gi, "#0404fe"], // 灰色（補足の文字）
  [/#f7f9f7\b/gi, "#eef0ff"], // 淡い緑（箱の地）
  [/#eef3f0\b/gi, "#eef0ff"], // 淡い緑（箱の地）
  [/rgba\(0,\s*70,\s*72,/gi, "rgba(4,4,254,"], // 深緑の半透明（罫線）
];
function recolor(html: string): string {
  return RECOLOR.reduce((h, [re, to]) => h.replace(re, to), html);
}

// 見出し（h2）に通し番号とページ内リンク用のidを付け、目次を作る
function numberHeadings(html: string, a: ArticleClasses): { html: string; toc: { id: string; no: string; text: string }[] } {
  const toc: { id: string; no: string; text: string }[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/gi, (_all, inner: string) => {
    const no = String(toc.length + 1).padStart(2, "0");
    const id = `sec-${no}`;
    toc.push({ id, no, text: inner.replace(/<[^>]+>/g, "").trim() });
    return `<h2 id="${id}"><span class="${a.h2No}" aria-hidden="true">${no}</span><span>${inner}</span></h2>`;
  });
  return { html: out, toc };
}

// 表は横にはみ出すことがあるので、横にすべらせる箱に入れる
function wrapTables(html: string, a: ArticleClasses): string {
  return html
    .replace(/<table\b/gi, `<div class="${a.tableWrap}"><table`)
    .replace(/<\/table>/gi, "</table></div>");
}

// 表示用の本文と目次を作る（beans は販売中の豆だけを渡す）
export function renderArticle(
  content: string,
  { slug, beans, classes }: { slug: string; beans: BeanView[]; classes: ArticleClasses }
): { html: string; toc: { id: string; no: string; text: string }[] } {
  let h = formatSummaryLists(content, classes);
  h = formatFaq(h, classes);
  h = linkBeanCards(h, beans);
  h = rebuildBeanCards(h, beans, classes);
  h = addShopUtm(h, slug);
  h = recolor(h);
  h = wrapTables(h, classes);
  return numberHeadings(h, classes);
}
