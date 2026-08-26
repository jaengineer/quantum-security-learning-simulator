import assert from "node:assert/strict";
import test from "node:test";

import { c, scale } from "@/features/quantum/builder/math/complex";
import { TELEPORTATION_INPUT_STATES } from "@/features/quantum/teleportation/data/inputStates";
import {
  ALICE_MEASUREMENT_OUTCOMES,
  evaluateTeleportationBranch,
  fidelity,
  sampleAliceOutcome,
} from "@/features/quantum/teleportation/math/teleportation-protocol";

const EPS = 1e-6;

const EXPECTED_CORRECTIONS = {
  "00": "I",
  "01": "X",
  "10": "Z",
  "11": "XZ",
} as const;

const EXPECTED_CORRECTION_DESCRIPTION_KEYS = {
  "00": "correction_description_00",
  "01": "correction_description_01",
  "10": "correction_description_10",
  "11": "correction_description_11",
} as const;

function assertClose(actual: number, expected: number, label: string) {
  assert.ok(
    Math.abs(actual - expected) <= EPS,
    `${label}: expected ${expected}, received ${actual}`
  );
}

test("teleportation has unit fidelity for every preset and Alice branch", () => {
  for (const input of TELEPORTATION_INPUT_STATES) {
    for (const outcome of ALICE_MEASUREMENT_OUTCOMES) {
      const branch = evaluateTeleportationBranch(input, outcome);

      assert.equal(branch.outcome, outcome);
      assert.equal(branch.correction.label, EXPECTED_CORRECTIONS[outcome]);
      assert.equal(
        branch.correction.descriptionKey,
        EXPECTED_CORRECTION_DESCRIPTION_KEYS[outcome]
      );
      assertClose(branch.probability, 0.25, `${input.id}/${outcome} probability`);
      assertClose(branch.fidelity, 1, `${input.id}/${outcome} fidelity`);
    }
  }
});

test("fidelity treats states that differ only by global phase as equal", () => {
  const input = [c(Math.SQRT1_2), c(0, Math.SQRT1_2)] as const;
  const globallyPhased = [
    scale(input[0], -1),
    scale(input[1], -1),
  ] as const;

  assertClose(fidelity(input, globallyPhased), 1, "global-phase fidelity");
});

test("sampling uses branch probabilities without changing branch math", () => {
  const input = TELEPORTATION_INPUT_STATES.find((state) => state.id === "plus");
  assert.ok(input);

  const first = sampleAliceOutcome(input, () => 0);
  const last = sampleAliceOutcome(input, () => 0.999);

  assert.equal(first.outcome, "00");
  assert.equal(last.outcome, "11");
  assertClose(first.fidelity, 1, "first sampled branch fidelity");
  assertClose(last.fidelity, 1, "last sampled branch fidelity");
});
