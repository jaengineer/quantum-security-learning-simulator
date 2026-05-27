"use client";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import type { WorkedExample } from "@/features/theory/types";

interface WorkedExampleBlockProps {
  example: WorkedExample;
  index: number;
}

/**
 * Renders a worked example as a vertical sequence of titled steps. Each step
 * may carry an inline LaTeX line. The block uses an ordered list (``<ol>``)
 * to preserve the logical order and assist screen readers.
 */
export function WorkedExampleBlock({ example, index }: WorkedExampleBlockProps) {
  const { locale } = useLocale();
  const t = useT();

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
      <header className="flex flex-col gap-1">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t("section_worked_examples")} · #{index + 1}
        </p>
        <h3 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {getLocalizedText(example.title, locale)}
        </h3>
      </header>

      <section className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/40 dark:text-slate-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t("worked_example_statement")}
        </p>
        <p>{getLocalizedText(example.statement, locale)}</p>
      </section>

      <ol className="flex flex-col gap-3">
        {example.steps.map((step, stepIndex) => (
          <li
            key={`${example.title.en}-step-${stepIndex}`}
            className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50/60 p-4 dark:border-slate-700/60 dark:bg-slate-800/30"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {t("worked_example_step")} {stepIndex + 1} · {getLocalizedText(step.title, locale)}
            </p>
            {step.latex ? (
              <QuantumFormula
                expression={step.latex}
                displayMode="block"
                size="sm"
                compact
              />
            ) : null}
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {getLocalizedText(step.explanation, locale)}
            </p>
          </li>
        ))}
      </ol>

      <section className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-relaxed text-emerald-900 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          {t("worked_example_final_answer")}
        </p>
        <p>{getLocalizedText(example.finalAnswer, locale)}</p>
      </section>
    </article>
  );
}
