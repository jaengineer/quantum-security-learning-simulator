import assert from "node:assert/strict";
import test from "node:test";

import { LOCALE_STORAGE_KEY } from "@/features/theory/i18n/LocaleContext";
import { resolvePreferredLocale } from "@/features/theory/i18n/helpers";

test("app-wide locale persistence uses the Quantum Learning storage key", () => {
  assert.equal(LOCALE_STORAGE_KEY, "quantum-learning-locale");
});

test("server-side preferred locale resolution falls back to English", () => {
  assert.equal(resolvePreferredLocale(), "en");
});
