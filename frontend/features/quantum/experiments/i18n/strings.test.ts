import assert from "node:assert/strict";
import test from "node:test";

import {
  GLOBAL_NAV_COPY,
  HOME_ABOUT,
  HOME_COPY,
  HOME_FOOTER,
  HOME_HERO,
  HOME_LEARNING_PATH,
  HOME_METHOD_STEPS,
  HOME_SECTIONS,
  HOME_VALUE_PROPOSITIONS,
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
  assertLocalizedText(GLOBAL_NAV_COPY.brand, "GLOBAL_NAV_COPY.brand");
  assertLocalizedText(
    GLOBAL_NAV_COPY.mobileMenu,
    "GLOBAL_NAV_COPY.mobileMenu"
  );
  assertLocalizedText(
    GLOBAL_NAV_COPY.skipToContent,
    "GLOBAL_NAV_COPY.skipToContent"
  );
  assertLocalizedText(
    GLOBAL_NAV_COPY.closeMobileMenu,
    "GLOBAL_NAV_COPY.closeMobileMenu"
  );
  GLOBAL_NAV_COPY.links.forEach((link, index) => {
    assertLocalizedText(link.label, `GLOBAL_NAV_COPY.links.${index}.label`);
  });
  Object.entries(HOME_HERO).forEach(([key, value]) => {
    if (typeof value === "object" && "en" in value && "es" in value) {
      assertLocalizedText(value, `HOME_HERO.${key}`);
    }
  });
  HOME_VALUE_PROPOSITIONS.forEach((item, index) => {
    assertLocalizedText(item.title, `HOME_VALUE_PROPOSITIONS.${index}.title`);
    assertLocalizedText(
      item.description,
      `HOME_VALUE_PROPOSITIONS.${index}.description`
    );
  });
  HOME_METHOD_STEPS.forEach((item, index) => {
    assertLocalizedText(item.title, `HOME_METHOD_STEPS.${index}.title`);
    assertLocalizedText(
      item.description,
      `HOME_METHOD_STEPS.${index}.description`
    );
  });
  Object.entries(HOME_LEARNING_PATH.copy).forEach(([key, value]) => {
    assertLocalizedText(value, `HOME_LEARNING_PATH.copy.${key}`);
  });
  HOME_LEARNING_PATH.nodes.forEach((node, index) => {
    assertLocalizedText(node.title, `HOME_LEARNING_PATH.nodes.${index}.title`);
    assertLocalizedText(
      node.description,
      `HOME_LEARNING_PATH.nodes.${index}.description`
    );
  });
  Object.entries(HOME_ABOUT).forEach(([key, value]) => {
    assertLocalizedText(value, `HOME_ABOUT.${key}`);
  });
  Object.entries(HOME_FOOTER).forEach(([key, value]) => {
    assertLocalizedText(value, `HOME_FOOTER.${key}`);
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

test("global navigation stays simple and points to static destinations", () => {
  assert.deepEqual(
    GLOBAL_NAV_COPY.links.map((link) => link.href),
    ["/#learning-modules", "/theory", "/builder", "/#about"]
  );
  assert.ok(GLOBAL_NAV_COPY.links.length <= 4);
});

test("Hero CTAs point to in-page static anchors", () => {
  assert.equal(HOME_HERO.primaryCtaHref, "#learning-modules");
  assert.equal(HOME_HERO.secondaryCtaHref, "#how-it-works");
});

test("Home learning path preserves the approved conceptual relationships", () => {
  assert.deepEqual(HOME_LEARNING_PATH.edges, [
    ["superposition", "entanglement"],
    ["superposition", "grover"],
    ["entanglement", "teleportation"],
  ]);
  assert.deepEqual(HOME_LEARNING_PATH.transversalTools, ["builder", "theory"]);
  assert.equal(
    HOME_LEARNING_PATH.copy.superpositionToEntanglement.en,
    "correlated quantum states"
  );
  assert.equal(
    HOME_LEARNING_PATH.copy.entanglementToTeleportation.es,
    "recurso del protocolo"
  );
});

test("Home value propositions describe platform capabilities, not methodology steps", () => {
  assert.deepEqual(
    HOME_VALUE_PROPOSITIONS.map((item) => item.id),
    ["learn", "experiment", "visualize"]
  );
  assert.equal(HOME_VALUE_PROPOSITIONS[0].title.en, "Learn");
  assert.equal(HOME_VALUE_PROPOSITIONS[0].title.es, "Aprende");
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
