"use client";

import Link from "next/link";

import { CategoryBadge } from "@/features/theory/components/CategoryBadge";
import { LevelBadge } from "@/features/theory/components/LevelBadge";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryConcept } from "@/features/theory/types";

interface RelatedConceptsProps {
  concepts: TheoryConcept[];
}

export function RelatedConcepts({ concepts }: RelatedConceptsProps) {
  const { locale } = useLocale();
  const t = useT();

  if (concepts.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {t("section_related_concepts")}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {concepts.map((concept) => (
          <li key={concept.id}>
            <Link
              href={`/theory/${concept.id}`}
              prefetch
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-violet-400 hover:text-violet-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-violet-400 dark:hover:text-violet-300"
            >
              <CategoryBadge category={concept.category} />
              <LevelBadge level={concept.level} />
              <span>{getLocalizedText(concept.title, locale)}</span>
              <span aria-hidden>→</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
