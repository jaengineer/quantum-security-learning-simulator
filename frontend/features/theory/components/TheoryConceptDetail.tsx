"use client";

import Link from "next/link";

import { CategoryBadge } from "@/features/theory/components/CategoryBadge";
import { FormulaBlock } from "@/features/theory/components/FormulaBlock";
import { LanguageSwitcher } from "@/features/theory/components/LanguageSwitcher";
import { LevelBadge } from "@/features/theory/components/LevelBadge";
import { NotationBadge } from "@/features/theory/components/NotationBadge";
import { RelatedConcepts } from "@/features/theory/components/RelatedConcepts";
import { SelfAssessmentQuiz } from "@/features/theory/components/SelfAssessmentQuiz";
import { WorkedExampleBlock } from "@/features/theory/components/WorkedExampleBlock";
import { getLocalizedArray, getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import type { TheoryConcept } from "@/features/theory/types";

interface TheoryConceptDetailProps {
  concept: TheoryConcept;
  relatedConcepts: TheoryConcept[];
}

export function TheoryConceptDetail({
  concept,
  relatedConcepts,
}: TheoryConceptDetailProps) {
  const { locale } = useLocale();
  const t = useT();

  const learningObjectives = getLocalizedArray(concept.learningObjectives, locale);
  const commonMistakes = getLocalizedArray(concept.commonMistakes, locale);
  const geometric = concept.geometricOrPhysicalInterpretation
    ? getLocalizedText(concept.geometricOrPhysicalInterpretation, locale)
    : null;

  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <Link
            href="/theory"
            prefetch
            className="text-xs font-semibold text-slate-500 underline-offset-2 hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-100"
          >
            ← {t("back_to_catalog")}
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge category={concept.category} />
          <LevelBadge level={concept.level} />
          <NotationBadge notation={concept.notation} />
          {concept.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {getLocalizedText(concept.title, locale)}
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {getLocalizedText(concept.summary, locale)}
        </p>
      </header>

      {learningObjectives.length > 0 ? (
        <Section title={t("section_learning_objectives")}>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {learningObjectives.map((objective, index) => (
              <li key={index}>{objective}</li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={t("section_formal_definition")}>
        <Card>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-100">
            {getLocalizedText(concept.formalDefinition, locale)}
          </p>
        </Card>
      </Section>

      <Section title={t("section_intuitive_explanation")}>
        <Card>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {getLocalizedText(concept.intuitiveExplanation, locale)}
          </p>
        </Card>
      </Section>

      {concept.formulas.length > 0 ? (
        <Section title={t("section_formulas")}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {concept.formulas.map((formula, index) => (
              <FormulaBlock key={`${concept.id}-formula-${index}`} formula={formula} />
            ))}
          </div>
        </Section>
      ) : null}

      {concept.workedExamples.length > 0 ? (
        <Section title={t("section_worked_examples")}>
          <div className="flex flex-col gap-4">
            {concept.workedExamples.map((example, index) => (
              <WorkedExampleBlock
                key={`${concept.id}-example-${index}`}
                example={example}
                index={index}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {geometric ? (
        <Section title={t("section_geometric_interpretation")}>
          <Card>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {geometric}
            </p>
          </Card>
        </Section>
      ) : null}

      {commonMistakes.length > 0 ? (
        <Section title={t("section_common_mistakes")}>
          <Card>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {commonMistakes.map((mistake, index) => (
                <li key={index}>{mistake}</li>
              ))}
            </ul>
          </Card>
        </Section>
      ) : null}

      <Section title={t("section_exam_relevance")}>
        <Card>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
            {getLocalizedText(concept.examRelevance, locale)}
          </p>
        </Card>
      </Section>

      <SelfAssessmentQuiz questions={concept.examQuestions} />

      <RelatedConcepts concepts={relatedConcepts} />
    </article>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700/60 dark:bg-slate-900/40">
      {children}
    </div>
  );
}
