/**
 * Pure-function simulator for a sequence of one- or two-qubit gates.
 *
 * Convention on order: the ``gates`` array is consumed left-to-right, exactly
 * as the user reads the circuit. So ``gates = [H, S, H]`` applied to ``|0⟩``
 * produces ``H · S · H · |0⟩`` in matrix notation (right-to-left), i.e. the
 * *last* element in the array sits leftmost in the formula. The simulator
 * encapsulates this so the UI just needs to push gates in visual order.
 *
 * Output shape
 * ------------
 *   - ``steps``: one ``SimulationStep`` per applied gate, with state before
 *     and after, the concrete matrix, probabilities and Bloch coordinates.
 *     The narrative is a copy of the gate's static ``description`` and is
 *     reused by the step-by-step UI.
 *   - ``finalUnitary``: product of every applied matrix. Equal to the
 *     identity when ``gates`` is empty.
 *
 * Two-qubit MVP convention
 * ------------------------
 * State vectors are ordered as ``|00⟩, |01⟩, |10⟩, |11⟩``. Single-qubit gates
 * target q0 only. Two-qubit gates use the fixed q0 -> q1 orientation.
 */

import { ONE, ZERO, add, c, mul } from "@/features/quantum/builder/math/complex";
import {
  cleanBloch,
  stateToBloch,
} from "@/features/quantum/builder/math/bloch-coordinates";
import {
  getGate,
  matrixOf,
} from "@/features/quantum/builder/math/quantum-gates";
import {
  KET_00,
  KET_0,
  applyMatrix,
  probabilities,
  twoQubitProbabilities,
} from "@/features/quantum/builder/math/quantum-state";
import type {
  GateInstance,
  Mat2,
  Mat4,
  QubitCount,
  SingleQubitGateId,
  SingleQubitState,
  SimulationResult,
  SimulationStep,
  TwoQubitState,
} from "@/features/quantum/builder/types";

const IDENTITY: Mat2 = [ONE, ZERO, ZERO, ONE] as const;

/** Matrix product ``A · B`` of two 2x2 complex matrices. */
function matMul(a: Mat2, b: Mat2): Mat2 {
  const [a00, a01, a10, a11] = a;
  const [b00, b01, b10, b11] = b;
  return [
    add(mul(a00, b00), mul(a01, b10)),
    add(mul(a00, b01), mul(a01, b11)),
    add(mul(a10, b00), mul(a11, b10)),
    add(mul(a10, b01), mul(a11, b11)),
  ] as const;
}

function narrativeFor(gate: GateInstance): string {
  const def = getGate(gate.gateId);
  if (gate.params && def.parametric) {
    const deg = ((gate.params.theta * 180) / Math.PI).toFixed(1);
    return `${def.description} (θ = ${deg}°)`;
  }
  return def.description;
}

function assertSingleQubitGate(gate: GateInstance): SingleQubitGateId {
  if (gate.arity !== 1) {
    throw new Error(`Gate ${gate.gateId} cannot be applied as a single-qubit gate`);
  }
  return gate.gateId as SingleQubitGateId;
}

function applySingleQubitGateToQ0(
  state: TwoQubitState,
  matrix: Mat2
): TwoQubitState {
  const [m00, m01, m10, m11] = matrix;
  const [s00, s01, s10, s11] = state;
  return [
    add(mul(m00, s00), mul(m01, s10)),
    add(mul(m00, s01), mul(m01, s11)),
    add(mul(m10, s00), mul(m11, s10)),
    add(mul(m10, s01), mul(m11, s11)),
  ] as const;
}

function applyTwoQubitGate(state: TwoQubitState, gate: GateInstance): TwoQubitState {
  const [s00, s01, s10, s11] = state;
  switch (gate.gateId) {
    case "CNOT":
      return [s00, s01, s11, s10] as const;
    case "CZ":
      return [s00, s01, s10, c(-s11.re, -s11.im)] as const;
    case "SWAP":
      return [s00, s10, s01, s11] as const;
    default:
      throw new Error(`Unsupported two-qubit gate: ${gate.gateId}`);
  }
}

const CNOT_MATRIX: Mat4 = [
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ONE,
  ZERO,
] as const;

const CZ_MATRIX: Mat4 = [
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  c(-1, 0),
] as const;

const SWAP_MATRIX: Mat4 = [
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ONE,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ZERO,
  ONE,
] as const;

function matrixForTwoQubitGate(gate: GateInstance): Mat4 | undefined {
  switch (gate.gateId) {
    case "CNOT":
      return CNOT_MATRIX;
    case "CZ":
      return CZ_MATRIX;
    case "SWAP":
      return SWAP_MATRIX;
    default:
      return undefined;
  }
}

function simulateSingleQubit(gates: readonly GateInstance[]): SimulationResult {
  let state: SingleQubitState = KET_0;
  let unitary: Mat2 = IDENTITY;
  const steps: SimulationStep[] = [];

  gates.forEach((gate, index) => {
    const gateId = assertSingleQubitGate(gate);
    const m = matrixOf(gateId, gate.params);
    const stateBefore = state;
    const stateAfter = applyMatrix(stateBefore, m);
    unitary = matMul(m, unitary);
    steps.push({
      index,
      gate,
      matrix: m,
      stateBefore,
      stateAfter,
      probAfter: probabilities(stateAfter),
      blochAfter: cleanBloch(stateToBloch(stateAfter)),
      narrative: narrativeFor(gate),
    });
    state = stateAfter;
  });

  return {
    qubitCount: 1,
    initialState: KET_0,
    finalState: state,
    finalUnitary: unitary,
    steps,
    finalProbabilities: probabilities(state),
    finalBloch: cleanBloch(stateToBloch(state)),
  };
}

function simulateTwoQubits(gates: readonly GateInstance[]): SimulationResult {
  let state: TwoQubitState = KET_00;
  const steps: SimulationStep[] = [];

  gates.forEach((gate, index) => {
    const stateBefore = state;
    let stateAfter: TwoQubitState;
    let matrix: Mat2 | Mat4 | undefined;

    if (gate.arity === 1) {
      const gateId = assertSingleQubitGate(gate);
      matrix = matrixOf(gateId, gate.params);
      stateAfter = applySingleQubitGateToQ0(stateBefore, matrix);
    } else {
      matrix = matrixForTwoQubitGate(gate);
      stateAfter = applyTwoQubitGate(stateBefore, gate);
    }

    steps.push({
      index,
      gate,
      matrix,
      stateBefore,
      stateAfter,
      probAfter: twoQubitProbabilities(stateAfter),
      narrative: narrativeFor(gate),
    });
    state = stateAfter;
  });

  return {
    qubitCount: 2,
    initialState: KET_00,
    finalState: state,
    steps,
    finalProbabilities: twoQubitProbabilities(state),
  };
}

/**
 * Run a circuit on an initial state and return both the final state and the
 * per-step trace. The trace is what powers the step-by-step explanation.
 */
export function simulate(
  qubitCount: QubitCount = 1,
  gates: readonly GateInstance[] = []
): SimulationResult {
  return qubitCount === 1 ? simulateSingleQubit(gates) : simulateTwoQubits(gates);
}
