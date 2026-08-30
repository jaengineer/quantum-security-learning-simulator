import assert from "node:assert/strict";
import test from "node:test";

import { formatStableInteger } from "@/features/quantum/utils/format";

test("formatStableInteger returns the same thousands separator regardless of runtime locale", () => {
  assert.equal(formatStableInteger(1), "1");
  assert.equal(formatStableInteger(1024), "1,024");
  assert.equal(formatStableInteger(100000), "100,000");
});
