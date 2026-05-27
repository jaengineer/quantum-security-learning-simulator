"use client";

import { useCallback, useState } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryFormula } from "@/features/theory/types";

type CopyState = "idle" | "success" | "error";

interface FormulaBlockProps {
  formula: TheoryFormula;
}

/**
 * Renders a single labelled KaTeX formula with a copy-to-clipboard action.
 *
 * The component is locale-aware: the caption and explanation are projected
 * from ``LocalizedText`` via the active locale, while the LaTeX source itself
 * stays language-agnostic.
 */
export function FormulaBlock({ formula }: FormulaBlockProps) {
  const { locale } = useLocale();
  const t = useT();
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      setCopyState("error");
      return;
    }
    try {
      await navigator.clipboard.writeText(formula.latex);
      setCopyState("success");
      window.setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1800);
    }
  }, [formula.latex]);

  const copyLabel =
    copyState === "success"
      ? t("copy_latex_success")
      : copyState === "error"
      ? t("copy_latex_failed")
      : t("copy_latex");

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {getLocalizedText(formula.label, locale)}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className={[
            "inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-medium transition",
            copyState === "success"
              ? "border-emerald-400 bg-emerald-50 text-emerald-700 dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-300"
              : copyState === "error"
              ? "border-rose-400 bg-rose-50 text-rose-700 dark:border-rose-500/50 dark:bg-rose-500/10 dark:text-rose-300"
              : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700/60",
          ].join(" ")}
          aria-label={t("copy_latex")}
        >
          {copyLabel}
        </button>
      </header>
      <QuantumFormula expression={formula.latex} displayMode="block" size="md" />
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {getLocalizedText(formula.explanation, locale)}
      </p>
    </article>
  );
}
