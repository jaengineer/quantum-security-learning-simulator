import assert from "node:assert/strict";
import test from "node:test";

import {
  HOME_COPY,
  HOME_SECTIONS,
  type HomeModuleCopy,
} from "@/features/quantum/experiments/i18n/strings";
import type { Locale, LocalizedText } from "@/features/theory/i18n/types";

const locales: readonly Locale[] = ["en", "es"];

function assertLocalizedText(value: LocalizedText, label: string) {
  for (const locale of locales) {
    assert.ok(value[locale].length > 0, `${label}.${locale} is required`);
  }
}

test("Home copy keeps every new string in EN and ES", () => {
  Object.entries(HOME_COPY).forEach(([key, value]) => {
    assertLocalizedText(value, `HOME_COPY.${key}`);
  });

  HOME_SECTIONS.forEach((section, sectionIndex) => {
    assertLocalizedText(section.eyebrow, `section.${sectionIndex}.eyebrow`);
    assertLocalizedText(section.title, `section.${sectionIndex}.title`);

    section.modules.forEach((moduleCopy, moduleIndex) => {
      const homeModule: HomeModuleCopy = moduleCopy;
      const label = `section.${sectionIndex}.module.${moduleIndex}`;
      assertLocalizedText(homeModule.eyebrow, `${label}.eyebrow`);
      assertLocalizedText(homeModule.title, `${label}.title`);
      assertLocalizedText(homeModule.description, `${label}.description`);
      assertLocalizedText(homeModule.cta, `${label}.cta`);
      if (homeModule.subtitle) {
        assertLocalizedText(homeModule.subtitle, `${label}.subtitle`);
      }
    });
  });
});

test("Home Spanish CTAs follow the approved semantic convention", () => {
  const [foundations, labs, tools] = HOME_SECTIONS;

  assert.deepEqual(
    foundations.modules.map((module) => module.cta.es),
    ["Explorar", "Explorar"]
  );
  assert.deepEqual(
    labs.modules.map((module) => module.cta.es),
    ["Abrir laboratorio", "Abrir laboratorio"]
  );
  assert.deepEqual(
    tools.modules.map((module) => module.cta.es),
    ["Abrir Builder", "Abrir Theory Lab"]
  );
});
