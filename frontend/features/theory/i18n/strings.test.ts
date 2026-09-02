import assert from "node:assert/strict";
import test from "node:test";

import { THEORY_UI_STRINGS } from "@/features/theory/i18n/strings";
import type { Locale, LocalizedText } from "@/features/theory/i18n/types";

const locales: readonly Locale[] = ["en", "es"];

function assertLocalizedText(value: LocalizedText, label: string) {
  for (const locale of locales) {
    assert.ok(value[locale].length > 0, `${label}.${locale} is required`);
  }
}

test("Theory UI strings are localized in English and Spanish", () => {
  Object.entries(THEORY_UI_STRINGS).forEach(([key, value]) => {
    assertLocalizedText(value, key);
  });
});
