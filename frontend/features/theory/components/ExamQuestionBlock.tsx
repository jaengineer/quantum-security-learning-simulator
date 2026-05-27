"use client";

import { useState } from "react";

import { getLocalizedArray, getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import type { ExamQuestion } from "@/features/theory/types";

interface ExamQuestionBlockProps {
  question: ExamQuestion;
  index: number;
  /** When ``examMode`` is true, hints and the model answer start hidden. */
  examMode: boolean;
  /** Callback fired once when the model answer is revealed for the first time. */
  onReviewed?: (questionId: string) => void;
}

const DIFFICULTY_STYLE = {
  easy: "border-emerald-300/70 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-300",
  medium: "border-amber-300/70 bg-amber-50 text-amber-700 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-300",
  hard: "border-rose-300/70 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300",
} as const;

const DIFFICULTY_KEY = {
  easy: "difficulty_easy",
  medium: "difficulty_medium",
  hard: "difficulty_hard",
} as const;

export function ExamQuestionBlock({
  question,
  index,
  examMode,
  onReviewed,
}: ExamQuestionBlockProps) {
  const { locale } = useLocale();
  const t = useT();
  const [revealed, setRevealed] = useState(!examMode);
  const [openHints, setOpenHints] = useState<number[]>([]);
  // Track the previous exam-mode prop to detect parent-driven changes during
  // render. Updating state during render based on a prop transition is the
  // React 19 sanctioned alternative to a setState-in-useEffect synchronisation.
  const [previousExamMode, setPreviousExamMode] = useState(examMode);
  if (previousExamMode !== examMode) {
    setPreviousExamMode(examMode);
    // Exam mode ON  -> hide answers, close hints (fresh attempt).
    // Exam mode OFF -> reveal answers for review.
    setRevealed(!examMode);
    setOpenHints([]);
  }

  const hints = getLocalizedArray(question.hints, locale);

  const handleReveal = () => {
    setRevealed((previous) => {
      const next = !previous;
      if (next && onReviewed) onReviewed(question.id);
      return next;
    });
  };

  const toggleHint = (i: number) => {
    setOpenHints((current) =>
      current.includes(i) ? current.filter((value) => value !== i) : [...current, i]
    );
  };

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {t("section_exam_questions")} · #{index + 1}
        </p>
        <span
          className={[
            "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
            DIFFICULTY_STYLE[question.difficulty],
          ].join(" ")}
        >
          {t(DIFFICULTY_KEY[question.difficulty])}
        </span>
      </header>

      <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
        {getLocalizedText(question.statement, locale)}
      </p>

      {hints.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {hints.map((hint, hintIndex) => {
            const open = openHints.includes(hintIndex);
            return (
              <li key={hintIndex} className="rounded-xl bg-slate-50 p-3 text-sm dark:bg-slate-800/40">
                <button
                  type="button"
                  onClick={() => toggleHint(hintIndex)}
                  className="flex w-full items-center justify-between gap-2 text-left text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300"
                  aria-expanded={open}
                >
                  <span>
                    {t("show_hint")} {hintIndex + 1}
                  </span>
                  <span aria-hidden>{open ? "−" : "+"}</span>
                </button>
                {open ? (
                  <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                    {hint}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}

      <button
        type="button"
        onClick={handleReveal}
        className="self-start rounded-xl border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-700/60"
        aria-expanded={revealed}
      >
        {revealed ? t("hide_answer") : t("reveal_answer")}
      </button>

      {revealed ? (
        <section className="rounded-xl border border-violet-200 bg-violet-50/70 p-4 text-sm leading-relaxed text-violet-900 dark:border-violet-500/40 dark:bg-violet-500/10 dark:text-violet-100">
          {getLocalizedText(question.expectedAnswer, locale)}
        </section>
      ) : null}
    </article>
  );
}
