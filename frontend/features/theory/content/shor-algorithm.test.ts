import assert from "node:assert/strict";
import test from "node:test";

import {
  THEORY_CONCEPTS_RAW,
  buildSearchHaystack,
  getAllTags,
  getConceptById,
} from "@/features/theory/content";
import type { Locale, LocalizedText } from "@/features/theory/i18n/types";

const locales: readonly Locale[] = ["en", "es"];

function assertLocalizedText(value: LocalizedText, label: string) {
  for (const locale of locales) {
    assert.ok(value[locale].trim().length > 0, `${label}.${locale} is required`);
  }
}

test("Shor concept is registered with expected metadata", () => {
  const concept = getConceptById("shor-algorithm");

  assert.ok(concept, "shor-algorithm concept should exist");
  assert.equal(concept.category, "quantum-computing");
  assert.equal(concept.level, "advanced");
  assert.equal(concept.notation, "mixed");
  assert.equal(concept.title.en, "Shor's Algorithm and Quantum Cryptography");
  assert.equal(concept.title.es, "Algoritmo de Shor y criptografía cuántica");
});

test("Shor concept provides complete bilingual educational content", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  assertLocalizedText(concept.title, "title");
  assertLocalizedText(concept.summary, "summary");
  assertLocalizedText(concept.formalDefinition, "formalDefinition");
  assertLocalizedText(concept.intuitiveExplanation, "intuitiveExplanation");
  assertLocalizedText(concept.examRelevance, "examRelevance");
  assert.ok(concept.learningObjectives.en.length >= 7);
  assert.equal(concept.learningObjectives.en.length, concept.learningObjectives.es.length);
  assert.ok(concept.commonMistakes.en.length >= 4);
  assert.equal(concept.commonMistakes.en.length, concept.commonMistakes.es.length);
});

test("Shor concept includes required formulas, example and self-assessment", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  assert.ok(concept.formulas.some((formula) => formula.latex.includes("a^r")));
  assert.ok(concept.formulas.some((formula) => formula.latex.includes("QFT")));
  assert.ok(concept.workedExamples.some((example) => example.title.en.includes("N = 15")));
  assert.ok(concept.examQuestions.length >= 6);
});

test("Shor concept uses rich math blocks for formal prose equations", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  const formulaNodes = concept.formalDefinitionBlocks
    ?.flatMap((block) => block.segments)
    .filter((segment) => segment.kind === "formula");

  assert.ok(formulaNodes);
  assert.ok(formulaNodes.some((segment) => segment.latex === "N=pq"));
  assert.ok(
    formulaNodes.some((segment) =>
      segment.latex.includes("\\gcd\\left(a^{r/2}-1,N\\right)")
    )
  );
});

test("Shor visible prose avoids raw caret math that should be rendered", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  const prose = [
    concept.formalDefinition.en,
    concept.formalDefinition.es,
    concept.intuitiveExplanation.en,
    concept.intuitiveExplanation.es,
    concept.geometricOrPhysicalInterpretation?.en ?? "",
    concept.geometricOrPhysicalInterpretation?.es ?? "",
    ...(concept.extendedSections ?? []).flatMap((section) => [
      section.content.en,
      section.content.es,
    ]),
    ...concept.workedExamples.flatMap((example) => [
      example.statement.en,
      example.statement.es,
      example.finalAnswer.en,
      example.finalAnswer.es,
    ]),
  ].join(" ");

  for (const rawFragment of ["a^r", "a^(r/2)", "f(x)=a^x mod N", "gcd(a,N)"]) {
    assert.equal(
      prose.includes(rawFragment),
      false,
      `raw math fragment remained in prose: ${rawFragment}`
    );
  }
});

test("Shor concept tags and related concept ids integrate with the catalog", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  for (const tag of ["shor", "factorization", "period-finding", "qft", "cryptography", "rsa"]) {
    assert.ok(concept.tags.includes(tag), `missing tag ${tag}`);
    assert.ok(getAllTags().includes(tag), `catalog missing tag ${tag}`);
  }

  for (const relatedId of concept.relatedConceptIds) {
    assert.ok(getConceptById(relatedId), `missing related concept ${relatedId}`);
  }
});

test("Shor concept is searchable by security and period-finding terms", () => {
  const concept = getConceptById("shor-algorithm");
  assert.ok(concept);

  for (const locale of locales) {
    const haystack = buildSearchHaystack(concept, locale);
    for (const term of ["shor", "factor", "period", "rsa", "cryptography"]) {
      assert.ok(haystack.includes(term), `${locale} haystack missing ${term}`);
    }
  }
});

test("Theory concept ids remain unique after adding Shor", () => {
  const ids = THEORY_CONCEPTS_RAW.map((concept) => concept.id);
  assert.equal(new Set(ids).size, ids.length);
});
