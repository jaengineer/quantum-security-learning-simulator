import assert from "node:assert/strict";
import test from "node:test";

import type { Complex, TwoQubitState } from "@/features/quantum/builder/types";
import {
  GROVER_STAGE_IDS,
  GROVER_TARGETS,
  createOracleMatrix,
  runGrover,
  targetIndex,
  type GroverStageId,
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

function stageFor(target: (typeof GROVER_TARGETS)[number], stageId: GroverStageId) {
  const stage = runGrover(target).find((candidate) => candidate.id === stageId);
  assert.ok(stage, `${target}/${stageId} stage should exist`);
  return stage;
}

function assertProbabilities(
  actual: { p00: number; p01: number; p10: number; p11: number },
  expected: readonly [number, number, number, number],
  label: string
) {
  assertClose(actual.p00, expected[0], `${label}.p00`);
  assertClose(actual.p01, expected[1], `${label}.p01`);
  assertClose(actual.p10, expected[2], `${label}.p10`);
  assertClose(actual.p11, expected[3], `${label}.p11`);
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
    const superposition = stageFor(target, "superposition");

    assertState(superposition.state, [0.5, 0.5, 0.5, 0.5], `${target} superposition`);
    assertProbabilities(
      superposition.probabilities,
      [0.25, 0.25, 0.25, 0.25],
      `${target} superposition probabilities`
    );
  }
});

test("oracle stage preserves target as a visible negative real amplitude", () => {
  for (const target of GROVER_TARGETS) {
    const oracle = stageFor(target, "oracle");
    const selectedIndex = targetIndex(target);

    oracle.state.forEach((amp, index) => {
      const expected = index === selectedIndex ? -0.5 : 0.5;
      assertComplexClose(amp, { re: expected, im: 0 }, `${target} oracle[${index}]`);
    });
    assertProbabilities(
      oracle.probabilities,
      [0.25, 0.25, 0.25, 0.25],
      `${target} oracle probabilities`
    );
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
    const measurement = stageFor(target, "measurement");
    const selectedIndex = targetIndex(target);

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

test("initial stage starts at |00> with all probability concentrated there", () => {
  for (const target of GROVER_TARGETS) {
    const initial = stageFor(target, "initial");

    assertState(initial.state, [1, 0, 0, 0], `${target} initial state`);
    assertProbabilities(initial.probabilities, [1, 0, 0, 0], `${target} initial probabilities`);
  }
});

test("measurement stage is a classical readout of the diffusion state", () => {
  for (const target of GROVER_TARGETS) {
    const diffusion = stageFor(target, "diffusion");
    const measurement = stageFor(target, "measurement");

    assert.deepEqual(measurement.state, diffusion.state);
    assert.equal(measurement.measurementOutcome, target);
    assert.deepEqual(measurement.measurementBits, [target[0], target[1]]);
  }
});

test("every Grover stage remains normalized", () => {
  for (const target of GROVER_TARGETS) {
    for (const stage of runGrover(target)) {
      assertClose(probabilitySum(stage.state), 1, `${target}/${stage.id} normalization`);
    }
  }
});
