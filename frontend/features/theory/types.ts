/**
 * Domain types for the Theory Lab.
 *
 * Every human-readable field is stored as ``LocalizedText`` (or
 * ``LocalizedStringArray``) so a single content tree can drive every
 * supported locale. Identifiers, slugs, LaTeX sources, categories, levels,
 * notations and tags stay locale-agnostic.
 *
 * Extending the model:
 *   - To add a new locale, edit ``Locale`` in ``i18n/types`` and add the new
 *     key to every ``LocalizedText`` entry. No component needs to change.
 *   - To add a new category / level / notation, extend the union here and
 *     add the matching badge entry to the UI dictionary.
 */

import type {
  LocalizedStringArray,
  LocalizedText,
} from "@/features/theory/i18n/types";

export type TheoryLevel = "basic" | "intermediate" | "advanced";

export type TheoryCategory =
  | "linear-algebra"
  | "quantum-mechanics"
  | "quantum-computing"
  | "quantum-information";

/**
 * Which kind of notation the concept primarily uses. Useful as a filter when
 * the student wants to focus on, say, bra-ket mechanics versus pure matrix
 * algebra.
 */
export type TheoryNotation = "bra-ket" | "matrix" | "abstract" | "mixed";

export interface TheoryFormula {
  /** Short caption shown above the formula. */
  label: LocalizedText;
  /** KaTeX source (locale-agnostic). */
  latex: string;
  /** One- or two-sentence didactic note shown under the formula. */
  explanation: LocalizedText;
}

export interface WorkedExampleStep {
  title: LocalizedText;
  /** Optional LaTeX line that supports the step. */
  latex?: string;
  explanation: LocalizedText;
}

export interface WorkedExample {
  title: LocalizedText;
  statement: LocalizedText;
  steps: WorkedExampleStep[];
  finalAnswer: LocalizedText;
}

export interface ExamQuestion {
  /** Stable identifier inside the concept, used for React keys. */
  id: string;
  difficulty: "easy" | "medium" | "hard";
  statement: LocalizedText;
  expectedAnswer: LocalizedText;
  /** Ordered hints that gradually unlock the solution. */
  hints: LocalizedStringArray;
}

export interface TheoryConcept {
  /** Stable slug used as URL segment. Locale-agnostic. */
  id: string;
  level: TheoryLevel;
  category: TheoryCategory;
  notation: TheoryNotation;
  /** Locale-agnostic slug tags. The UI displays them verbatim. */
  tags: string[];
  /** Slugs of related concepts. The UI resolves and renders them as chips. */
  relatedConceptIds: string[];

  title: LocalizedText;
  summary: LocalizedText;
  learningObjectives: LocalizedStringArray;
  formalDefinition: LocalizedText;
  intuitiveExplanation: LocalizedText;
  geometricOrPhysicalInterpretation?: LocalizedText;
  examRelevance: LocalizedText;

  formulas: TheoryFormula[];
  workedExamples: WorkedExample[];
  commonMistakes: LocalizedStringArray;
  examQuestions: ExamQuestion[];
}

/**
 * Flat view of a concept used by the catalog (cards, search, filters). Built
 * by ``getTheoryConcepts(locale)``.
 */
export interface TheoryConceptView {
  id: string;
  title: string;
  summary: string;
  level: TheoryLevel;
  category: TheoryCategory;
  notation: TheoryNotation;
  tags: string[];
}
