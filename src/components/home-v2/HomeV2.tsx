"use client";

// mumu 公式サイト TOP（v2）
// mumu-site-v2/index.html を Next.js クライアントコンポーネントへ忠実移植したもの。
// 演出（Heroロードシーケンス / 手書きワイプ / 豆の自転 / パララックス /
// スクロールスパイ / ゆる吸着 / スクロール出現）はリファレンスの <script> を再現。
// デザイン・余白・イージング数値は変更禁止（指示書「禁止事項」）。

import { useEffect, useRef } from "react";
import PaperBackdrop from "./PaperBackdrop";
import Obi from "./Obi";
import FloatingBean from "./FloatingBean";
import FooterV2 from "./FooterV2";
import { SHOP_URL, PODCAST_URL } from "./links";
import styles from "./homeV2.module.css";

// 日誌エントリ（表示用の整形済みデータ。CMS取得・整形は page.tsx 側で行う）
export type JournalItem = { id: string; date: string; title: string };

export default function HomeV2({
  journalPosts = [],
}: {
  journalPosts?: JournalItem[];
}) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // 豆の自転 + 手書き要素のパララックス（文字が紙の上に浮く奥行き）
    const pxEls = Array.prototype.slice.call(
      root.querySelectorAll<HTMLElement>("[data-depth]")
    ) as HTMLElement[];
    let bases: number[] = [];

    function measure() {
      bases = pxEls.map((el) => {
        el.style.transform = "none";
        const r = el.getBoundingClientRect();
        return r.top + window.scrollY + r.height / 2;
      });
      applyFx();
    }
    function applyFx() {
      const mid = window.scrollY + window.innerHeight / 2;
      // 豆の自転は FloatingBean が自前で行う（ここでは手書き要素のパララックスのみ）
      pxEls.forEach((el, i) => {
        const d =
          (bases[i] - mid) * parseFloat(el.getAttribute("data-depth") || "0");
        el.style.transform = "translate3d(0," + d.toFixed(1) + "px,0)";
      });
    }

    // スクロールスパイ：現在地のメニューに灯りをともす
    // 帯(obi)は共通コンポーネント化したため data-obi-nav 経由でリンクを走査する
    const navEl = root.querySelector<HTMLElement>("[data-obi-nav]");
    const navLinks = navEl
      ? (Array.prototype.slice.call(
          navEl.querySelectorAll<HTMLAnchorElement>("a")
        ) as HTMLAnchorElement[])
      : [];
    const spyIds = ["about", "beans", "journal", "podcast"];
    const spySecs = spyIds.map((id) => document.getElementById(id));
    // メニューにアプリ(/app・ハッシュ無し)等が混在しても正しく点灯するよう、
    // 順番(index)ではなくリンク先のセクションid一致で active を判定する。
    function spy() {
      const pos = window.scrollY + window.innerHeight * 0.4;
      let activeId: string | null = null;
      spySecs.forEach((s) => {
        if (s && s.offsetTop <= pos) activeId = s.id;
      });
      navLinks.forEach((a) => {
        const m = (a.getAttribute("href") || "").match(/#([^#]+)$/);
        const id = m ? m[1] : null;
        a.classList.toggle(styles.active, !!id && id === activeId);
      });
    }

    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (!reduceMotion) applyFx();
        spy();
        ticking = false;
      });
    }
    function onResize() {
      if (!reduceMotion) measure();
      spy();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    if (!reduceMotion) measure();
    spy();

    // ゆる吸着：スクロールが落ち着いたら、近くのセクション頭へぬるっと寄る
    const heroEl = root.querySelector<HTMLElement>("[data-hero]");
    const snapTargets = [heroEl].concat(spySecs);
    let snapTimer: ReturnType<typeof setTimeout> | null = null;
    let snapAnim: number | null = null;
    function cancelSnap() {
      if (snapAnim) {
        cancelAnimationFrame(snapAnim);
        snapAnim = null;
      }
    }
    const cancelEvents: Array<keyof WindowEventMap> = [
      "wheel",
      "touchstart",
      "keydown",
    ];
    function onCancel() {
      cancelSnap();
      if (snapTimer) clearTimeout(snapTimer);
    }
    cancelEvents.forEach((ev) =>
      window.addEventListener(ev, onCancel, { passive: true })
    );
    function onSnapScroll() {
      if (snapAnim) return; // 吸着アニメ中の自発スクロールは無視
      if (snapTimer) clearTimeout(snapTimer);
      snapTimer = setTimeout(trySnap, 180);
    }
    window.addEventListener("scroll", onSnapScroll, { passive: true });
    function trySnap() {
      if (reduceMotion) return;
      const y = window.scrollY;
      const offset = window.innerWidth <= 900 ? 64 : 0;
      let best: number | null = null;
      let bestDist = Infinity;
      snapTargets.forEach((s) => {
        if (!s) return;
        const t = s.offsetTop - offset;
        const d = Math.abs(t - y);
        if (d < bestDist) {
          bestDist = d;
          best = t;
        }
      });
      if (best === null || bestDist < 2 || bestDist > 150) return; // 近いときだけ効く
      animateScroll(best, 700);
    }
    function animateScroll(to: number, dur: number) {
      const from = window.scrollY;
      const start = performance.now();
      function step(now: number) {
        const t = Math.min(1, (now - start) / dur);
        const e = 1 - Math.pow(1 - t, 3); // easeOutCubic：最後がぬるっと減速
        window.scrollTo({ top: from + (to - from) * e, behavior: "instant" });
        snapAnim = t < 1 ? requestAnimationFrame(step) : null;
      }
      snapAnim = requestAnimationFrame(step);
    }

    // スクロール出現：.reveal はフェード、.write は手書きワイプ
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.on);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    root
      .querySelectorAll<HTMLElement>(
        "[data-reveal], [data-write]:not([data-write='auto'])"
      )
      .forEach((el) => io.observe(el));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onSnapScroll);
      cancelEvents.forEach((ev) => window.removeEventListener(ev, onCancel));
      cancelSnap();
      if (snapTimer) clearTimeout(snapTimer);
      io.disconnect();
    };
  }, []);

  return (
    // data-home-root: globals.css の body:has() で紙色背景を適用するための目印
    <div ref={rootRef} className={styles.root} data-home-root>
      <PaperBackdrop />

      {/* 左カラム（本の帯）— 共通コンポーネント。TOPは同ページ内アンカー（hrefPrefix=""） */}
      <Obi hrefPrefix="" />

      {/* 右上の豆（自転）— 共通部品 */}
      <FloatingBean />

      <main id="top" className={styles.main}>
        {/* ---------- Hero ---------- */}
        <section className={styles.hero} data-hero>
          <img
            className={styles.heroCup}
            src="/v2/cup.png"
            alt="一杯の珈琲"
            width={440}
            height={440}
          />
          <img
            className={`${styles.heroTagline} ${styles.write} ${styles.writeAuto}`}
            data-depth="0.04"
            data-write="auto"
            style={{ animationDelay: "1.2s" }}
            src="/v2/tagline.png"
            alt="灯台の珈琲焙煎所"
            width={401}
            height={47}
          />
          <h1>
            <img
              className={`${styles.heroLogo} ${styles.write} ${styles.writeAuto}`}
              data-depth="0.06"
              data-write="auto"
              style={{ animationDelay: "2.2s", animationDuration: "1.7s" }}
              alt="灯台の珈琲焙煎所 mumu"
              src="/v2/mumu-script.png"
              width={611}
              height={100}
            />
          </h1>
          <p className={styles.heroScrollhint}>scroll</p>
        </section>

        <img
          className={`${styles.divider} ${styles.write}`}
          data-depth="0.03"
          data-write=""
          src="/v2/line.png"
          alt=""
          aria-hidden="true"
          width={1400}
          height={209}
          loading="lazy"
        />

        {/* ---------- mumuについて ---------- */}
        <section className={`${styles.section} ${styles.about}`} id="about">
          <div className={styles.sectionHead}>
            <h2>
              <img
                className={`${styles.sectionHand} ${styles.write}`}
                data-depth="0.07"
                data-write=""
                style={{ width: "min(189px,36vw)" }}
                src="/v2/h-about.png"
                alt="mumuについて"
                width={1400}
                height={200}
                loading="lazy"
              />
            </h2>
          </div>
          <img
            className={styles.aboutLighthouse}
            data-reveal
            src="/v2/lighthouse.png"
            alt="灯台と焙煎小屋のイラスト"
            width={900}
            height={1255}
            loading="lazy"
          />
          <img
            className={`${styles.aboutCatch} ${styles.write}`}
            data-depth="0.06"
            data-write=""
            src="/v2/kansei.png"
            alt="感性が、ふと戻ってくるような一杯を"
            width={1400}
            height={168}
            loading="lazy"
          />
          <p className={styles.aboutLead} data-reveal>
            情報にさらされ続ける毎日のなかで、
            <br />
            眠ってしまった感性に、もういちど灯りをともす。
            <br />
            mumuは、そのための小さな焙煎所です。
          </p>
          <div data-reveal>
            {/* ★下層ページ /about 制作済み → リンク */}
            <a className={styles.btn} href="/about">
              詳しくみる<span className={styles.arrow}>→</span>
            </a>
          </div>
        </section>

        <img
          className={`${styles.divider} ${styles.write}`}
          data-depth="0.03"
          data-write=""
          src="/v2/line.png"
          alt=""
          aria-hidden="true"
          width={1400}
          height={209}
          loading="lazy"
        />

        {/* ---------- 珈琲をえらぶ ---------- */}
        <section className={styles.section} id="beans">
          <div className={styles.sectionHead}>
            <h2>
              <img
                className={`${styles.sectionHand} ${styles.write}`}
                data-depth="0.07"
                data-write=""
                style={{ width: "min(186px,35vw)" }}
                src="/v2/h-beans.png"
                alt="珈琲をえらぶ"
                width={1400}
                height={288}
                loading="lazy"
              />
            </h2>
          </div>
          <div className={styles.beans}>
            <article className={styles.beanItem}>
              <div className={styles.beanItemVisual} data-reveal>
                <img
                  className={styles.beanItemImg}
                  src="/v2/asa-e.jpg"
                  alt="朝の丘に立つ灯台のイラスト"
                  width={1600}
                  height={1600}
                  loading="lazy"
                />
              </div>
              <div className={styles.beanItemBody}>
                <h3>
                  <img
                    className={`${styles.beanItemCaption} ${styles.write}`}
                    data-depth="0.05"
                    data-write=""
                    src="/v2/cap-asa.png"
                    alt="朝の空気を閉じ込めた珈琲豆"
                    width={1400}
                    height={186}
                    loading="lazy"
                  />
                </h3>
                <p className={styles.beanItemNote} data-reveal>
                  浅煎り／柑橘のような明るい酸
                  <br />
                  一日のはじまりに、澄んだ一杯を。
                </p>
                <a
                  className={styles.btn}
                  data-reveal
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener"
                >
                  SHOP<span className={styles.arrow}>→</span>
                </a>
              </div>
            </article>

            <article className={`${styles.beanItem} ${styles.beanItemRev}`}>
              <div className={styles.beanItemVisual} data-reveal>
                <img
                  className={styles.beanItemImg}
                  src="/v2/yuu-e.jpg"
                  alt="夕暮れの岬に立つ灯台のイラスト"
                  width={1600}
                  height={1600}
                  loading="lazy"
                />
              </div>
              <div className={styles.beanItemBody}>
                <h3>
                  <img
                    className={`${styles.beanItemCaption} ${styles.write}`}
                    data-depth="0.05"
                    data-write=""
                    src="/v2/cap-yuu.png"
                    alt="夕暮れの空気を閉じ込めた珈琲豆"
                    width={1400}
                    height={179}
                    loading="lazy"
                  />
                </h3>
                <p className={styles.beanItemNote} data-reveal>
                  中煎り／やわらかな甘みとコク
                  <br />
                  一日の輪郭が、ほどけていく時間に。
                </p>
                <a
                  className={styles.btn}
                  data-reveal
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener"
                >
                  SHOP<span className={styles.arrow}>→</span>
                </a>
              </div>
            </article>

            <article className={styles.beanItem}>
              <div className={styles.beanItemVisual} data-reveal>
                <img
                  className={styles.beanItemImg}
                  src="/v2/yoru-e.jpg"
                  alt="夜の海と月明かりのイラスト"
                  width={1600}
                  height={1600}
                  loading="lazy"
                />
              </div>
              <div className={styles.beanItemBody}>
                <h3>
                  <img
                    className={`${styles.beanItemCaption} ${styles.write}`}
                    data-depth="0.05"
                    data-write=""
                    src="/v2/cap-yoru.png"
                    alt="夜の空気を閉じ込めた珈琲豆"
                    width={1400}
                    height={186}
                    loading="lazy"
                  />
                </h3>
                <p className={styles.beanItemNote} data-reveal>
                  深煎り／静かなビターと余韻
                  <br />
                  灯りを落としたあとの、ひとりの時間に。
                </p>
                <a
                  className={styles.btn}
                  data-reveal
                  href={SHOP_URL}
                  target="_blank"
                  rel="noopener"
                >
                  SHOP<span className={styles.arrow}>→</span>
                </a>
              </div>
            </article>
          </div>
        </section>

        <img
          className={`${styles.divider} ${styles.write}`}
          data-depth="0.03"
          data-write=""
          src="/v2/line.png"
          alt=""
          aria-hidden="true"
          width={1400}
          height={209}
          loading="lazy"
        />

        {/* ---------- 灯台守の日誌 ---------- */}
        <section className={styles.section} id="journal">
          <div className={styles.sectionHead}>
            <h2>
              <img
                className={`${styles.sectionHand} ${styles.write}`}
                data-depth="0.07"
                data-write=""
                style={{ width: "min(191px,36vw)" }}
                src="/v2/h-journal.png"
                alt="灯台守の日誌"
                width={1400}
                height={272}
                loading="lazy"
              />
            </h2>
          </div>
          {/* microCMS(blogs)の最新記事。0件時はnote案内へフォールバック */}
          {journalPosts.length > 0 ? (
            <div className={styles.journal} data-reveal>
              {journalPosts.map((post) => (
                <a
                  key={post.id}
                  className={styles.journalEntry}
                  href={`/journal/${post.id}`}
                >
                  <p className={styles.journalDate}>{post.date}</p>
                  <p className={styles.journalTitle}>{post.title}</p>
                </a>
              ))}
            </div>
          ) : (
            <p className={styles.podcastSub} data-reveal style={{ textAlign: "center" }}>
              ただいま準備中です。noteでも綴っています。
            </p>
          )}
          <div className={styles.journalMoreWrap} data-reveal>
            <a className={styles.btn} href="/journal">
              日誌をよむ<span className={styles.arrow}>→</span>
            </a>
          </div>
        </section>

        <img
          className={`${styles.divider} ${styles.write}`}
          data-depth="0.03"
          data-write=""
          src="/v2/line.png"
          alt=""
          aria-hidden="true"
          width={1400}
          height={209}
          loading="lazy"
        />

        {/* ---------- Podcast ---------- */}
        <section className={`${styles.section} ${styles.podcast}`} id="podcast">
          <div className={styles.sectionHead}>
            <h2>
              <img
                className={`${styles.sectionHand} ${styles.write}`}
                data-depth="0.07"
                data-write=""
                style={{ width: "min(101px,19vw)" }}
                src="/v2/h-podcast.png"
                alt="Podcast"
                width={1008}
                height={234}
                loading="lazy"
              />
            </h2>
          </div>
          <p className={styles.podcastCopy} data-reveal>
            灯台のふもとで、お話するみたいに
          </p>
          <p className={styles.podcastSub} data-reveal>
            ながら聴きにどうぞ。
          </p>
          <div data-reveal>
            <a
              className={styles.btn}
              href={PODCAST_URL}
              target="_blank"
              rel="noopener"
            >
              聴いてみる<span className={styles.arrow}>→</span>
            </a>
          </div>
        </section>
      </main>

      <FooterV2 />
    </div>
  );
}
