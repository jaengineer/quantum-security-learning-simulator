import assert from "node:assert/strict";
import test from "node:test";

import type { Complex, TwoQubitState } from "@/features/quantum/builder/types";
import {
  GROVER_STAGE_IDS,
  GROVER_TARGETS,
  createOracleMatrix,
  runGrover,
  targetIndex,
} from "@/features/quantum/grover/math/grover";

const EPS = 1e-6;
const BASIS_STATES = ["00", "01", "10", "11"] as const;

function assertClose(actual: number, expected: number, label: string) {
  assert.ok(
    Math.abs(actual - expected) <= EPS,
    `${label}: expected ${expected}, received ${actual}`
  );
}

function assertComplexClose(actual: Complex, expected: Complex, label: string) {
  assertClose(actual.re, expected.re, `${label}.re`);
  assertClose(actual.im, expected.im, `${label}.im`);
}

function assertState(
  actual: TwoQubitState,
  expected: readonly [number, number, number, number],
  label: string
) {
  actual.forEach((amp, index) => {
    assertComplexClose(amp, { re: expected[index], im: 0 }, `${label}[${index}]`);
  });
}

function probabilitySum(state: TwoQubitState): number {
  return state.reduce((sum, amp) => sum + amp.re * amp.re + amp.im * amp.im, 0);
}

test("Grover targets map to the q0-MSB basis order", () => {
  assert.deepEqual(GROVER_TARGETS, BASIS_STATES);
  assert.equal(targetIndex("00"), 0);
  assert.equal(targetIndex("01"), 1);
  assert.equal(targetIndex("10"), 2);
  assert.equal(targetIndex("11"), 3);
});

test("oracle matrix flips only the selected target phase", () => {
  const oracle = createOracleMatrix("10");
  const diagonal = [oracle[0], oracle[5], oracle[10], oracle[15]];

  assertState(diagonal as unknown as TwoQubitState, [1, 1, -1, 1], "oracle diagonal");
});

test("Grover emits the canonical five-stage history for each target", () => {
  for (const target of GROVER_TARGETS) {
    const stages = runGrover(target);

    assert.deepEqual(
      stages.map((stage) => stage.id),
      GROVER_STAGE_IDS
    );
    assert.ok(
      stages.every((stage) => stage.target === target),
      `all stages should keep target ${target}`
    );
  }
});

test("superposition stage has equal positive amplitudes", () => {
  for (const target of GROVER_TARGETS) {
    const stages = runGrover(target);
    const superposition = stages.find((stage) => stage.id === "superposition");

    assert.ok(superposition);
    assertState(superposition.state, [0.5, 0.5, 0.5, 0.5], `${target} superposition`);
  }
});

test("oracle stage preserves target as a visible negative real amplitude", () => {
  for (const target of GROVER_TARGETS) {
    const stages = runGrover(target);
    const oracle = stages.find((stage) => stage.id === "oracle");
    const selectedIndex = targetIndex(target);

    assert.ok(oracle);
    oracle.state.forEach((amp, index) => {
      const expected = index === selectedIndex ? -0.5 : 0.5;
      assertComplexClose(amp, { re: expected, im: 0 }, `${target} oracle[${index}]`);
    });
  }
});

test("diffusion amplifies the selected target after inversion about the mean", () => {
  for (const target of GROVER_TARGETS) {
    const stages = runGrover(target);
    const diffusion = stages.find((stage) => stage.id === "diffusion");
    const selectedIndex = targetIndex(target);

    assert.ok(diffusion);
    assert.ok(diffusion.diffusionMean, "diffusion stage should expose the mean");
    assertComplexClose(diffusion.diffusionMean, { re: 0.25, im: 0 }, `${target} mean`);

    diffusion.state.forEach((amp, index) => {
      const expected = index === selectedIndex ? 1 : 0;
      assertComplexClose(amp, { re: expected, im: 0 }, `${target} diffusion[${index}]`);
    });
  }
});

test("measurement stage has unit probability on the marked state", () => {
  for (const target of GROVER_TARGETS) {
    const stages = runGrover(target);
    const measurement = stages.find((stage) => stage.id === "measurement");
    const selectedIndex = targetIndex(target);

    assert.ok(measurement);
    BASIS_STATES.forEach((basis, index) => {
      const expected = index === selectedIndex ? 1 : 0;
      assertClose(
        measurement.probabilities[`p${basis}`],
        expected,
        `${target} probability ${basis}`
      );
    });
  }
});

test("every Grover stage remains normalized", () => {
  for (const target of GROVER_TARGETS) {
    for (const stage of runGrover(target)) {
      assertClose(probabilitySum(stage.state), 1, `${target}/${stage.id} normalization`);
    }
  }
});
