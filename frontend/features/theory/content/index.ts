/**
 * Theory Lab content registry.
 *
 * Each concept is authored as a locale-agnostic record (every textual field is
 * a ``LocalizedText`` / ``LocalizedStringArray``). The helpers below project
 * the raw records onto the active locale for the catalog (cards / search) and
 * keep the full ``TheoryConcept`` available for the detail page so locale
 * switching there is instant.
 */

import {
  getLocalizedArray,
  getLocalizedText,
} from "@/features/theory/i18n/helpers";
import type { Locale } from "@/features/theory/i18n/types";
import type {
  TheoryConcept,
  TheoryConceptView,
} from "@/features/theory/types";

import { DENSITY_MATRIX } from "@/features/theory/content/density-matrix";
import { DIRAC_NOTATION } from "@/features/theory/content/dirac-notation";
import { GRAM_SCHMIDT } from "@/features/theory/content/gram-schmidt";
import { HERMITIAN_MATRICES } from "@/features/theory/content/hermitian-matrices";
import { INNER_PRODUCT } from "@/features/theory/content/inner-product";
import { QUANTUM_ENTANGLEMENT } from "@/features/theory/content/quantum-entanglement";
import { REDUCED_DENSITY_MATRIX } from "@/features/theory/content/reduced-density-matrix";
import { SPECTRAL_THEOREM } from "@/features/theory/content/spectral-theorem";
import { UNITARY_MATRICES } from "@/features/theory/content/unitary-matrices";
import { UNIT_ROOTS } from "@/features/theory/content/unit-roots";

/** Raw, locale-agnostic concepts. Order defines the default catalog order. */
export const THEORY_CONCEPTS_RAW: readonly TheoryConcept[] = [
  INNER_PRODUCT,
  DIRAC_NOTATION,
  UNITARY_MATRICES,
  HERMITIAN_MATRICES,
  DENSITY_MATRIX,
  REDUCED_DENSITY_MATRIX,
  QUANTUM_ENTANGLEMENT,
  GRAM_SCHMIDT,
  SPECTRAL_THEOREM,
  UNIT_ROOTS,
] as const;

const CONCEPT_INDEX = new Map<string, TheoryConcept>(
  THEORY_CONCEPTS_RAW.map((concept) => [concept.id, concept])
);

/** Look up a concept by id without locale projection. */
export function getConceptById(id: string): TheoryConcept | undefined {
  return CONCEPT_INDEX.get(id);
}

/** Resolve the ``relatedConceptIds`` of a concept to actual records. */
export function getRelatedConcepts(concept: TheoryConcept): TheoryConcept[] {
  return concept.relatedConceptIds
    .map((id) => CONCEPT_INDEX.get(id))
    .filter((value): value is TheoryConcept => Boolean(value));
}

/**
 * Convenience projection used by the catalog (cards + filter logic + search).
 * The detail page does not use this — it consumes the raw concept so locale
 * switches are pure client-side renders.
 */
export function projectConcept(
  concept: TheoryConcept,
  locale: Locale
): TheoryConceptView {
  return {
    id: concept.id,
    level: concept.level,
    category: concept.category,
    notation: concept.notation,
    tags: concept.tags,
    title: getLocalizedText(concept.title, locale),
    summary: getLocalizedText(concept.summary, locale),
  };
}

/** Locale-aware catalog view; preserves insertion order. */
export function getTheoryConcepts(locale: Locale): TheoryConceptView[] {
  return THEORY_CONCEPTS_RAW.map((concept) => projectConcept(concept, locale));
}

/** All tags that appear in the corpus, sorted alphabetically. Locale-agnostic. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const concept of THEORY_CONCEPTS_RAW) {
    for (const tag of concept.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

/**
 * Build a haystack string for full-text search on the catalog. Lower-cased.
 * Combines title, summary and tags in the requested locale; locale-agnostic
 * tags are appended verbatim.
 */
export function buildSearchHaystack(
  concept: TheoryConcept,
  locale: Locale
): string {
  return [
    getLocalizedText(concept.title, locale),
    getLocalizedText(concept.summary, locale),
    ...getLocalizedArray(concept.learningObjectives, locale),
    ...concept.tags,
  ]
    .join(" \u2022 ")
    .toLowerCase();
}
