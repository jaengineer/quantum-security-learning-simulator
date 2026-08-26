import assert from "node:assert/strict";
import test from "node:test";

import { simulate } from "@/features/quantum/builder/math/quantum-simulator";
import type {
  GateId,
  GateInstance,
  MeasurementProbabilities,
  QubitIndex,
  TwoQubitState,
} from "@/features/quantum/builder/types";

const EPS = 1e-6;

function gate(
  gateId: GateId,
  options: Partial<GateInstance> = {}
): GateInstance {
  return {
    id: `${gateId}-${Math.random()}`,
    gateId,
    arity: gateId === "CNOT" || gateId === "CZ" || gateId === "SWAP" ? 2 : 1,
    ...options,
  };
}

function single(gateId: GateId, targetQubit: QubitIndex): GateInstance {
  return gate(gateId, { targetQubit });
}

function controlled(
  gateId: "CNOT" | "CZ",
  controlQubit: QubitIndex,
  targetQubit: QubitIndex
): GateInstance {
  return gate(gateId, { controlQubit, targetQubit });
}

function swap(): GateInstance {
  return gate("SWAP", { targetQubits: [0, 1] });
}

function assertClose(actual: number, expected: number, label: string) {
  assert.ok(
    Math.abs(actual - expected) <= EPS,
    `${label}: expected ${expected}, received ${actual}`
  );
}

function assertComplexClose(
  actual: { re: number; im: number },
  expected: { re: number; im: number },
  label: string
) {
  assertClose(actual.re, expected.re, `${label}.re`);
  assertClose(actual.im, expected.im, `${label}.im`);
}

function assertTwoQubitState(
  actual: TwoQubitState,
  expected: TwoQubitState
) {
  actual.forEach((amp, index) => {
    assertComplexClose(amp, expected[index], `amplitude[${index}]`);
  });
}

function assertTwoQubitProbabilities(
  probabilities: MeasurementProbabilities,
  expected: readonly [number, number, number, number]
) {
  assert.ok("p00" in probabilities, "expected two-qubit probabilities");
  assertClose(probabilities.p00, expected[0], "p00");
  assertClose(probabilities.p01, expected[1], "p01");
  assertClose(probabilities.p10, expected[2], "p10");
  assertClose(probabilities.p11, expected[3], "p11");
}

test("single-qubit H(q0)|0> keeps existing 50/50 Bloch behavior", () => {
  const result = simulate(1, [single("H", 0)]);

  assert.ok("p0" in result.finalProbabilities);
  assertClose(result.finalProbabilities.p0, 0.5, "p0");
  assertClose(result.finalProbabilities.p1, 0.5, "p1");
  assert.ok(result.finalBloch, "single-qubit mode should still expose Bloch coordinates");
  assertClose(result.finalBloch.x, 1, "bloch.x");
  assertClose(result.finalBloch.y, 0, "bloch.y");
  assertClose(result.finalBloch.z, 0, "bloch.z");
});

test("X(q1)|00> produces |01> and remains separable", () => {
  const result = simulate(2, [single("X", 1)]);

  assertTwoQubitState(result.finalState as TwoQubitState, [
    { re: 0, im: 0 },
    { re: 1, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
  ]);
  assert.equal(result.entanglement?.classification, "separable");
  assertClose(result.entanglement?.concurrence ?? NaN, 0, "concurrence");
});

test("independent H(q0), H(q1) superpositions are not entangled", () => {
  const result = simulate(2, [single("H", 0), single("H", 1)]);

  assertTwoQubitState(result.finalState as TwoQubitState, [
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 },
    { re: 0.5, im: 0 },
  ]);
  assert.equal(result.entanglement?.classification, "separable");
  assertClose(result.entanglement?.concurrence ?? NaN, 0, "concurrence");
});

test("Bell Phi+ has 50/0/0/50 probabilities and maximal concurrence", () => {
  const result = simulate(2, [single("H", 0), controlled("CNOT", 0, 1)]);
  const invSqrt2 = Math.SQRT1_2;

  assertTwoQubitState(result.finalState as TwoQubitState, [
    { re: invSqrt2, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
    { re: invSqrt2, im: 0 },
  ]);
  assertTwoQubitProbabilities(result.finalProbabilities, [0.5, 0, 0, 0.5]);
  assert.equal(result.entanglement?.classification, "maximally-entangled");
  assertClose(result.entanglement?.concurrence ?? NaN, 1, "concurrence");
});

test("reverse CNOT q1 -> q0 entangles the reversed control path", () => {
  const result = simulate(2, [single("H", 1), controlled("CNOT", 1, 0)]);
  const invSqrt2 = Math.SQRT1_2;

  assertTwoQubitState(result.finalState as TwoQubitState, [
    { re: invSqrt2, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
    { re: invSqrt2, im: 0 },
  ]);
  assert.equal(result.entanglement?.classification, "maximally-entangled");
});

test("SWAP exchanges |01> and |10>", () => {
  const swap01 = simulate(2, [single("X", 1), swap()]);
  assertTwoQubitState(swap01.finalState as TwoQubitState, [
    { re: 0, im: 0 },
    { re: 0, im: 0 },
    { re: 1, im: 0 },
    { re: 0, im: 0 },
  ]);

  const swap10 = simulate(2, [single("X", 0), swap()]);
  assertTwoQubitState(swap10.finalState as TwoQubitState, [
    { re: 0, im: 0 },
    { re: 1, im: 0 },
    { re: 0, im: 0 },
    { re: 0, im: 0 },
  ]);
});
