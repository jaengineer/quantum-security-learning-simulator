"use client";

import Link from "next/link";

import { CategoryBadge } from "@/features/theory/components/CategoryBadge";
import { LevelBadge } from "@/features/theory/components/LevelBadge";
import { NotationBadge } from "@/features/theory/components/NotationBadge";
import { useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryConceptView } from "@/features/theory/types";

interface TheoryConceptCardProps {
  concept: TheoryConceptView;
}

export function TheoryConceptCard({ concept }: TheoryConceptCardProps) {
  const t = useT();
  return (
    <Link
      href={`/theory/${concept.id}`}
      prefetch
      className="group flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-700/60 dark:bg-slate-900/40 dark:hover:border-violet-400"
    >
      <header className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={concept.category} />
          <LevelBadge level={concept.level} />
          <NotationBadge notation={concept.notation} />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-slate-900 transition group-hover:text-violet-700 dark:text-slate-100 dark:group-hover:text-violet-300">
          {concept.title}
        </h3>
      </header>

      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {concept.summary}
      </p>

      {concept.tags.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {concept.tags.slice(0, 5).map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-300"
            >
              #{tag}
            </li>
          ))}
        </ul>
      ) : null}

      <span className="inline-flex items-center gap-1 self-end text-xs font-semibold text-violet-600 transition group-hover:gap-2 dark:text-violet-300">
        {t("open_concept")}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
