"use client";

// 珈琲豆ラインナップのタブ絞り込み（すべて / 浅煎り / 深煎り）
// データ取得はサーバー側（beans/page.tsx）で行い、ここでは表示の絞り込みだけを担当する

import { useState } from "react";
import { motion } from "framer-motion";
import type { Bean } from "@/lib/microcms";
import BeanCard from "@/components/beans/BeanCard";

// タブの種類
type TabKey = "all" | "light" | "dark";

const TABS: { key: TabKey; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "light", label: "浅煎り" },
  { key: "dark", label: "深煎り" },
];

// roast文字列（例: "浅煎り / light roast"）から焙煎度カテゴリを判定
function roastCategory(roast: string): "light" | "dark" | "other" {
  if (roast.includes("浅")) return "light";
  if (roast.includes("深")) return "dark";
  return "other";
}

export default function BeansFilter({ beans }: { beans: Bean[] }) {
  const [active, setActive] = useState<TabKey>("all");

  // 選択中のタブで絞り込み（すべて は全件）
  const filtered =
    active === "all"
      ? beans
      : beans.filter((bean) => roastCategory(bean.roast) === active);

  return (
    <div className="mb-20">
      {/* タブ */}
      <div className="flex items-center gap-8 mb-12 border-b border-ink-primary/15">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={`relative pb-3 text-sm font-light tracking-wider transition-colors duration-300 ${
              active === tab.key
                ? "text-ink-primary"
                : "text-ink-secondary/60 hover:text-ink-primary"
            }`}
            aria-pressed={active === tab.key}
          >
            {tab.label}
            {/* 選択中タブの下線（タブ間をなめらかに移動） */}
            {active === tab.key && (
              <motion.span
                layoutId="beans-tab-underline"
                className="absolute -bottom-px left-0 w-full h-px bg-accent-lime"
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* 絞り込み結果のカード一覧 */}
      {filtered.length > 0 ? (
        <div className="flex flex-col gap-6">
          {filtered.map((bean, index) => (
            <BeanCard key={bean.id} bean={bean} index={index} />
          ))}
        </div>
      ) : (
        // 該当する焙煎度の豆がない場合
        <p className="text-ink-secondary text-sm font-light">
          この焙煎度の豆は現在準備中です。
        </p>
      )}
    </div>
  );
}
