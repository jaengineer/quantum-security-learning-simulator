"use client";

import { useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryCategory } from "@/features/theory/types";

const CATEGORY_STYLES: Record<TheoryCategory, string> = {
  "linear-algebra":
    "border-indigo-300/70 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/10 dark:text-indigo-300",
  "quantum-mechanics":
    "border-violet-300/70 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-300",
  "quantum-computing":
    "border-cyan-300/70 bg-cyan-50 text-cyan-700 dark:border-cyan-500/40 dark:bg-cyan-500/10 dark:text-cyan-300",
  "quantum-information":
    "border-fuchsia-300/70 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/10 dark:text-fuchsia-300",
};

const CATEGORY_KEY = {
  "linear-algebra": "category_linear_algebra",
  "quantum-mechanics": "category_quantum_mechanics",
  "quantum-computing": "category_quantum_computing",
  "quantum-information": "category_quantum_information",
} as const;

interface CategoryBadgeProps {
  category: TheoryCategory;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const t = useT();
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        CATEGORY_STYLES[category],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {t(CATEGORY_KEY[category])}
    </span>
  );
}
