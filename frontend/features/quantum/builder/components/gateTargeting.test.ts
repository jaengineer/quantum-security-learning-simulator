import assert from "node:assert/strict";
import test from "node:test";

import {
  createPaletteDropGate,
  resolveDropTargetQubit,
  retargetSingleQubitGate,
} from "@/features/quantum/builder/components/gateTargeting";
import { SINGLE_QUBIT_GATE_ORDER } from "@/features/quantum/builder/math/quantum-gates";
import type {
  BuilderGateInstance,
  BuilderQubitIndex,
  GateId,
} from "@/features/quantum/builder/types";

const FIXED_ID = "gate-under-test";
const THETA = Math.PI / 3;

function existingSingle(
  gateId: GateId,
  targetQubit: BuilderQubitIndex
): BuilderGateInstance {
  return {
    id: FIXED_ID,
    gateId,
    arity: 1,
    targetQubit,
    params:
      gateId === "Rx" || gateId === "Ry" || gateId === "Rz"
        ? { theta: THETA }
        : undefined,
  };
}

test("resolveDropTargetQubit accepts only q0/q1 or known wire drop ids", () => {
  assert.equal(resolveDropTargetQubit(0, "anything"), 0);
  assert.equal(resolveDropTargetQubit(1, "anything"), 1);
  assert.equal(resolveDropTargetQubit(undefined, "builder-canvas-q0"), 0);
  assert.equal(resolveDropTargetQubit(null, "builder-canvas-q1"), 1);
  assert.equal(resolveDropTargetQubit(undefined, "unknown"), undefined);
  assert.equal(resolveDropTargetQubit(null, "unknown"), undefined);
  assert.equal(resolveDropTargetQubit(2, "unknown"), undefined);
});

test("palette drops create every single-qubit gate on q0 and q1 in two-qubit mode", () => {
  for (const gateId of SINGLE_QUBIT_GATE_ORDER) {
    for (const targetQubit of [0, 1] as const) {
      const gate = createPaletteDropGate({
        gateId,
        qubitCount: 2,
        targetQubit,
        theta: THETA,
        id: `${gateId}-q${targetQubit}`,
      });

      assert.ok(gate, `${gateId}(q${targetQubit}) should be created`);
      assert.equal(gate.gateId, gateId);
      assert.equal(gate.arity, 1);
      assert.equal(gate.targetQubit, targetQubit);
      if (gateId === "Rx" || gateId === "Ry" || gateId === "Rz") {
        assert.equal(gate.params?.theta, THETA);
      }
    }
  }
});

test("palette drops with missing or invalid two-qubit targets are safe no-ops", () => {
  for (const targetQubit of [undefined, null, 2] as const) {
    assert.equal(
      createPaletteDropGate({
        gateId: "S",
        qubitCount: 2,
        targetQubit,
        id: FIXED_ID,
      }),
      null
    );
  }
});

test("single-qubit gate retargeting is generic and preserves gate params", () => {
  for (const gateId of SINGLE_QUBIT_GATE_ORDER) {
    const original = existingSingle(gateId, 0);
    const retargeted = retargetSingleQubitGate(original, 2, 1);

    assert.ok(retargeted, `${gateId} should retarget to q1`);
    assert.equal(retargeted.id, original.id);
    assert.equal(retargeted.gateId, gateId);
    assert.equal(retargeted.targetQubit, 1);
    assert.deepEqual(retargeted.params, original.params);
  }
});

test("single-qubit retargeting with invalid targets is a safe no-op", () => {
  const original = existingSingle("S", 0);

  assert.equal(retargetSingleQubitGate(original, 2, undefined), null);
  assert.equal(retargetSingleQubitGate(original, 2, null), null);
  assert.equal(retargetSingleQubitGate(original, 2, 2), null);
});

test("two-qubit gates keep their dedicated placement semantics", () => {
  const cnotQ1 = createPaletteDropGate({
    gateId: "CNOT",
    qubitCount: 2,
    targetQubit: 1,
    id: FIXED_ID,
  });
  const czQ0 = createPaletteDropGate({
    gateId: "CZ",
    qubitCount: 2,
    targetQubit: 0,
    id: FIXED_ID,
  });
  const swapGate = createPaletteDropGate({
    gateId: "SWAP",
    qubitCount: 2,
    targetQubit: undefined,
    id: FIXED_ID,
  });

  assert.deepEqual(cnotQ1, {
    id: FIXED_ID,
    gateId: "CNOT",
    arity: 2,
    params: undefined,
    controlQubit: 0,
    targetQubit: 1,
  });
  assert.deepEqual(czQ0, {
    id: FIXED_ID,
    gateId: "CZ",
    arity: 2,
    params: undefined,
    controlQubit: 1,
    targetQubit: 0,
  });
  assert.deepEqual(swapGate, {
    id: FIXED_ID,
    gateId: "SWAP",
    arity: 2,
    params: undefined,
    targetQubits: [0, 1],
  });
});
