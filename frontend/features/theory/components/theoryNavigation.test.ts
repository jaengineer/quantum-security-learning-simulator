import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const THEORY_STATIC_NAVIGATION_FILES = [
  "features/theory/components/TheoryConceptCard.tsx",
  "features/theory/components/RelatedConcepts.tsx",
  "features/theory/components/TheoryConceptDetail.tsx",
  "features/theory/components/TheoryLabClient.tsx",
] as const;

test("Theory static navigation uses browser anchors instead of Next prefetch links", () => {
  for (const filePath of THEORY_STATIC_NAVIGATION_FILES) {
    const source = readFileSync(path.join(process.cwd(), filePath), "utf8");

    assert.equal(
      source.includes('from "next/link"'),
      false,
      `${filePath} should not import next/link for static Firebase navigation`
    );
    assert.equal(
      source.includes("prefetch"),
      false,
      `${filePath} should not prefetch route chunks in static Firebase navigation`
    );
  }
});
