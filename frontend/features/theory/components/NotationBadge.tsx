"use client";

import { useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryNotation } from "@/features/theory/types";

const NOTATION_STYLES: Record<TheoryNotation, string> = {
  "bra-ket":
    "border-slate-300/70 bg-slate-50 text-slate-700 dark:border-slate-500/40 dark:bg-slate-500/10 dark:text-slate-300",
  matrix:
    "border-amber-300/70 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
  abstract:
    "border-teal-300/70 bg-teal-50 text-teal-700 dark:border-teal-500/40 dark:bg-teal-500/10 dark:text-teal-300",
  mixed:
    "border-purple-300/70 bg-purple-50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-300",
};

const NOTATION_KEY = {
  "bra-ket": "notation_bra_ket",
  matrix: "notation_matrix",
  abstract: "notation_abstract",
  mixed: "notation_mixed",
} as const;

interface NotationBadgeProps {
  notation: TheoryNotation;
  className?: string;
}

export function NotationBadge({ notation, className }: NotationBadgeProps) {
  const t = useT();
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        NOTATION_STYLES[notation],
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {t(NOTATION_KEY[notation])}
    </span>
  );
}
