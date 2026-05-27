"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { LanguageSwitcher } from "@/features/theory/components/LanguageSwitcher";
import {
  INITIAL_FILTER_STATE,
  TheoryFilters,
  type TheoryFilterState,
} from "@/features/theory/components/TheoryFilters";
import { TheoryConceptList } from "@/features/theory/components/TheoryConceptList";
import {
  THEORY_CONCEPTS_RAW,
  buildSearchHaystack,
  getAllTags,
  projectConcept,
} from "@/features/theory/content";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";

/**
 * Client surface of /theory.
 *
 * Server passes only the page chrome (heading + subtitle). This component
 * derives the locale-projected concept views (cards) and applies filters and
 * search reactively. Because the projection is cheap and the corpus tiny,
 * we recompute on every locale or filter change behind ``useMemo``.
 */
export function TheoryLabClient() {
  const { locale } = useLocale();
  const t = useT();
  const [filters, setFilters] = useState<TheoryFilterState>(INITIAL_FILTER_STATE);

  const allTags = useMemo(() => getAllTags(), []);

  const visibleConcepts = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return THEORY_CONCEPTS_RAW.filter((concept) => {
      if (filters.category !== "all" && concept.category !== filters.category) {
        return false;
      }
      if (filters.level !== "all" && concept.level !== filters.level) return false;
      if (filters.notation !== "all" && concept.notation !== filters.notation) {
        return false;
      }
      if (filters.tags.length > 0) {
        const hasEvery = filters.tags.every((tag) => concept.tags.includes(tag));
        if (!hasEvery) return false;
      }
      if (search.length > 0) {
        const haystack = buildSearchHaystack(concept, locale);
        if (!haystack.includes(search)) return false;
      }
      return true;
    }).map((concept) => projectConcept(concept, locale));
  }, [filters, locale]);

  const countLabel =
    visibleConcepts.length === 1
      ? t("results_count_one")
      : t("results_count_other");

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Theory Lab
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {t("page_title")}
            </h1>
            <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
              {t("page_subtitle")}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LanguageSwitcher />
            <Link
              href="/"
              prefetch
              className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
            >
              ← {locale === "es" ? "Volver al simulador" : "Back to simulator"}
            </Link>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem,1fr]">
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <TheoryFilters
            state={filters}
            onChange={setFilters}
            availableTags={allTags}
          />
        </aside>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {visibleConcepts.length} {countLabel}
          </p>
          <TheoryConceptList concepts={visibleConcepts} />
        </div>
      </div>
    </section>
  );
}
