import assert from "node:assert/strict";
import test from "node:test";

import {
  BELL_STATES,
  BELL_STATE_ORDER,
  SEPARABLE_COMPARISON_STATE,
  bellStateProbabilities,
  getBellStateDefinition,
} from "@/features/quantum/data/bellStates";
import { concurrence } from "@/features/quantum/builder/math/quantum-state";
import type { BellStateName } from "@/features/quantum/types";

const EPS = 1e-6;

function assertClose(actual: number, expected: number, label: string) {
  assert.ok(
    Math.abs(actual - expected) <= EPS,
    `${label}: expected ${expected}, received ${actual}`
  );
}

function assertStateVectorSign(
  actual: readonly { re: number; im: number }[],
  expected: readonly [number, number, number, number],
  label: string
) {
  assert.equal(actual.length, expected.length, `${label}: state length`);
  actual.forEach((amp, index) => {
    assertClose(amp.re, expected[index], `${label}[${index}].re`);
    assertClose(amp.im, 0, `${label}[${index}].im`);
  });
}

test("Bell state metadata covers all four canonical states in display order", () => {
  assert.deepEqual(BELL_STATE_ORDER, [
    "phi_plus",
    "phi_minus",
    "psi_plus",
    "psi_minus",
  ] satisfies BellStateName[]);

  for (const state of BELL_STATE_ORDER) {
    assert.equal(BELL_STATES[state].id, state);
    assert.ok(BELL_STATES[state].formulaExpression.length > 0);
    assert.ok(BELL_STATES[state].preparationOperations.length > 0);
  }
});

test("Bell state vectors preserve relative phase signs", () => {
  const invSqrt2 = Math.SQRT1_2;

  assertStateVectorSign(
    getBellStateDefinition("phi_plus").stateVector,
    [invSqrt2, 0, 0, invSqrt2],
    "phi_plus"
  );
  assertStateVectorSign(
    getBellStateDefinition("phi_minus").stateVector,
    [invSqrt2, 0, 0, -invSqrt2],
    "phi_minus"
  );
  assertStateVectorSign(
    getBellStateDefinition("psi_plus").stateVector,
    [0, invSqrt2, invSqrt2, 0],
    "psi_plus"
  );
  assertStateVectorSign(
    getBellStateDefinition("psi_minus").stateVector,
    [0, invSqrt2, -invSqrt2, 0],
    "psi_minus"
  );
});

test("plus and minus Bell pairs share probabilities but differ by phase", () => {
  assert.deepEqual(
    bellStateProbabilities("phi_plus"),
    bellStateProbabilities("phi_minus")
  );
  assert.notDeepEqual(
    getBellStateDefinition("phi_plus").stateVector,
    getBellStateDefinition("phi_minus").stateVector
  );

  assert.deepEqual(
    bellStateProbabilities("psi_plus"),
    bellStateProbabilities("psi_minus")
  );
  assert.notDeepEqual(
    getBellStateDefinition("psi_plus").stateVector,
    getBellStateDefinition("psi_minus").stateVector
  );
});

test("all ideal Bell states are maximally entangled", () => {
  for (const state of BELL_STATE_ORDER) {
    assertClose(concurrence(BELL_STATES[state].stateVector), 1, state);
  }
});

test("separable comparison state has uniform probabilities and zero concurrence", () => {
  assert.deepEqual(SEPARABLE_COMPARISON_STATE.probabilities, {
    "00": 0.25,
    "01": 0.25,
    "10": 0.25,
    "11": 0.25,
  });
  assertClose(concurrence(SEPARABLE_COMPARISON_STATE.stateVector), 0, "C(|++>)");
});
