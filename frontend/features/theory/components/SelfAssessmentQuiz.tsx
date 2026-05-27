"use client";

import { useCallback, useState } from "react";

import { ExamQuestionBlock } from "@/features/theory/components/ExamQuestionBlock";
import { useT } from "@/features/theory/i18n/LocaleContext";
import type { ExamQuestion } from "@/features/theory/types";

interface SelfAssessmentQuizProps {
  questions: ExamQuestion[];
}

/**
 * Exam-mode toggle wrapping a list of ``ExamQuestionBlock``s. Tracks how many
 * questions have been reviewed (model answer revealed at least once) and
 * shows a small progress hint in the header.
 */
export function SelfAssessmentQuiz({ questions }: SelfAssessmentQuizProps) {
  const t = useT();
  const [examMode, setExamMode] = useState(true);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const handleReviewed = useCallback((id: string) => {
    setReviewed((previous) => {
      if (previous.has(id)) return previous;
      const next = new Set(previous);
      next.add(id);
      return next;
    });
  }, []);

  const toggleExamMode = () => {
    setExamMode((previous) => !previous);
    if (examMode) {
      setReviewed(new Set(questions.map((question) => question.id)));
    }
  };

  if (questions.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
          {t("section_exam_questions")}
        </h2>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {reviewed.size} / {questions.length} {t("questions_reviewed")}
          </span>
          <button
            type="button"
            onClick={toggleExamMode}
            aria-pressed={examMode}
            className={[
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition",
              examMode
                ? "border-violet-500 bg-violet-500 text-white shadow"
                : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-200",
            ].join(" ")}
            title={t("exam_mode_hint")}
          >
            <span aria-hidden>{examMode ? "●" : "○"}</span>
            <span>
              {t("exam_mode_label")}: {examMode ? t("exam_mode_on") : t("exam_mode_off")}
            </span>
          </button>
        </div>
      </header>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        {t("exam_mode_hint")}
      </p>

      <ul role="list" className="flex flex-col gap-3">
        {questions.map((question, index) => (
          <li key={question.id}>
            <ExamQuestionBlock
              question={question}
              index={index}
              examMode={examMode}
              onReviewed={handleReviewed}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
