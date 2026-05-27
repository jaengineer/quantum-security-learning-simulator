"use client";

import { TheoryConceptCard } from "@/features/theory/components/TheoryConceptCard";
import { useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryConceptView } from "@/features/theory/types";

interface TheoryConceptListProps {
  concepts: TheoryConceptView[];
}

export function TheoryConceptList({ concepts }: TheoryConceptListProps) {
  const t = useT();

  if (concepts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        {t("results_empty")}
      </p>
    );
  }

  return (
    <ul role="list" className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {concepts.map((concept) => (
        <li key={concept.id} className="h-full">
          <TheoryConceptCard concept={concept} />
        </li>
      ))}
    </ul>
  );
}
