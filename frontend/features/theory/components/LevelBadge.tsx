"use client";

import { useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryLevel } from "@/features/theory/types";

const LEVEL_STYLES: Record<TheoryLevel, string> = {
  basic:
    "border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
  intermediate:
    "border-sky-300/70 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300",
  advanced:
    "border-rose-300/70 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
};

const LEVEL_KEY = {
  basic: "level_basic",
  intermediate: "level_intermediate",
  advanced: "level_advanced",
} as const;

interface LevelBadgeProps {
  level: TheoryLevel;
  className?: string;
}

export function LevelBadge({ level, className }: LevelBadgeProps) {
  const t = useT();
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        LEVEL_STYLES[level],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {t(LEVEL_KEY[level])}
    </span>
  );
}
