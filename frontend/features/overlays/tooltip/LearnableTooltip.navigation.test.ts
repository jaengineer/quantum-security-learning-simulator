import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const TOOLTIP_FILE =
  "features/overlays/tooltip/LearnableTooltip.tsx" as const;

test("LearnableTooltip Theory Lab CTA uses a static browser anchor", () => {
  const source = readFileSync(path.join(process.cwd(), TOOLTIP_FILE), "utf8");

  assert.equal(
    source.includes('from "next/link"'),
    false,
    "tooltip CTA should not import next/link in static Firebase hosting"
  );
  assert.equal(
    source.includes("prefetch"),
    false,
    "tooltip CTA should not prefetch route chunks in static Firebase hosting"
  );
  assert.match(source, /<a\s+href=\{`\/theory\/\$\{conceptId\}`\}/);
});
