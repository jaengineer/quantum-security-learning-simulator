import assert from "node:assert/strict";
import test from "node:test";

import {
  FOUNDATION_NEXT_STEPS,
  getFoundationNextStep,
} from "@/features/quantum/data/foundationNextSteps";
import type { ExperimentType } from "@/features/quantum/types";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import type { Locale } from "@/features/theory/i18n/types";

const requiredLocales: readonly Locale[] = ["en", "es"];

function assertLocalizedField(
  field: Record<Locale, string>,
  label: string
) {
  for (const locale of requiredLocales) {
    assert.ok(field[locale].length > 0, `${label}.${locale} is required`);
  }
}

test("foundation next steps define the guided sequence", () => {
  assert.equal(
    getFoundationNextStep("superposition")?.href,
    "/entanglement"
  );
  assert.equal(
    getFoundationNextStep("entanglement")?.href,
    "/teleportation"
  );
});

test("foundation next steps are only defined for completed foundation labs", () => {
  const experimentsWithoutNextStep: readonly ExperimentType[] = [
    "ideal-vs-noise",
    "security-case",
  ];

  for (const experiment of experimentsWithoutNextStep) {
    assert.equal(getFoundationNextStep(experiment), null);
  }
});

test("foundation next steps keep every new copy in EN and ES", () => {
  for (const nextStep of Object.values(FOUNDATION_NEXT_STEPS)) {
    assertLocalizedField(nextStep.eyebrow, `${nextStep.href}.eyebrow`);
    assertLocalizedField(nextStep.title, `${nextStep.href}.title`);
    assertLocalizedField(nextStep.description, `${nextStep.href}.description`);
    assertLocalizedField(nextStep.cta, `${nextStep.href}.cta`);
  }
});

test("foundation next step copy resolves with existing i18n helpers", () => {
  const superpositionNextStep = getFoundationNextStep("superposition");

  assert.ok(superpositionNextStep);
  assert.equal(
    getLocalizedText(superpositionNextStep.cta, "es"),
    "Explorar"
  );
  assert.equal(
    getLocalizedText(superpositionNextStep.cta, "en"),
    "Explore"
  );
});
