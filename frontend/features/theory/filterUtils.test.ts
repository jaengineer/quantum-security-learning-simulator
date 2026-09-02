import assert from "node:assert/strict";
import test from "node:test";

import {
  INITIAL_FILTER_STATE,
  VISIBLE_TAG_LIMIT,
  clearAdvancedFilters,
  getAdvancedFilterCount,
  getVisibleTagOptions,
  hasAnyFilter,
} from "@/features/theory/filterUtils";

test("advanced filter count excludes search and counts selected tags individually", () => {
  const count = getAdvancedFilterCount({
    ...INITIAL_FILTER_STATE,
    search: "oracle",
    category: "quantum-computing",
    level: "advanced",
    tags: ["grover", "oracle"],
  });

  assert.equal(count, 4);
});

test("clearAdvancedFilters preserves search and resets only advanced filters", () => {
  const cleared = clearAdvancedFilters({
    ...INITIAL_FILTER_STATE,
    search: "teleportation",
    category: "quantum-information",
    level: "advanced",
    notation: "mixed",
    tags: ["fidelity"],
  });

  assert.deepEqual(cleared, {
    ...INITIAL_FILTER_STATE,
    search: "teleportation",
  });
});

test("compact visible tags include selected tags outside the initial subset", () => {
  const availableTags = Array.from({ length: 12 }, (_, index) => `tag-${index}`);
  const visibleTags = getVisibleTagOptions({
    availableTags,
    selectedTags: ["tag-11"],
    showAllTags: false,
  });

  assert.equal(VISIBLE_TAG_LIMIT, 8);
  assert.ok(visibleTags.includes("tag-0"));
  assert.ok(visibleTags.includes("tag-7"));
  assert.ok(visibleTags.includes("tag-11"));
  assert.equal(new Set(visibleTags).size, visibleTags.length);
});

test("hasAnyFilter includes search and advanced filters for result count wording", () => {
  assert.equal(hasAnyFilter(INITIAL_FILTER_STATE), false);
  assert.equal(
    hasAnyFilter({
      ...INITIAL_FILTER_STATE,
      search: "matrix",
    }),
    true
  );
  assert.equal(
    hasAnyFilter({
      ...INITIAL_FILTER_STATE,
      notation: "bra-ket",
    }),
    true
  );
});
