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
 * State vectors are ordered as ``|00⟩, |01⟩, |10⟩, |11⟩`` with q0 as the
 * most-significant bit and q1 as the least-significant bit. Placed gate
 * instances carry explicit target/control metadata; the simulator never
 * infers the target from visual position.
 */

import {
  ONE,
  ZERO,
  add,
  c,
  mul,
} from "@/features/quantum/builder/math/complex";
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
  KET_000,
  KET_0,
  applyMatrix,
  classifyEntanglement,
  concurrence,
  probabilities,
  threeQubitProbabilities,
  twoQubitProbabilities,
} from "@/features/quantum/builder/math/quantum-state";
import type {
  Complex,
  GateInstance,
  Mat2,
  Mat4,
  QubitCount,
  QubitIndex,
  SingleQubitGateId,
  SingleQubitState,
  SimulationResult,
  SimulationStep,
  ThreeQubitState,
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

function targetQubitFor(gate: GateInstance): QubitIndex {
  return gate.targetQubit ?? 0;
}

function controlQubitFor(gate: GateInstance): QubitIndex {
  return gate.controlQubit ?? (targetQubitFor(gate) === 0 ? 1 : 0);
}

function assertDistinctControlTarget(gate: GateInstance): {
  controlQubit: QubitIndex;
  targetQubit: QubitIndex;
} {
  const controlQubit = controlQubitFor(gate);
  const targetQubit = targetQubitFor(gate);
  if (controlQubit === targetQubit) {
    throw new Error(`Gate ${gate.gateId} requires different control and target qubits`);
  }
  return { controlQubit, targetQubit };
}

function bitMaskFor(qubitCount: 2 | 3, qubit: QubitIndex): number {
  if (qubit >= qubitCount) {
    throw new Error(`q${qubit} is not available in a ${qubitCount}-qubit register`);
  }
  return 1 << (qubitCount - 1 - qubit);
}

function zeroRegister(length: number): Complex[] {
  return Array.from({ length }, () => ZERO);
}

function applySingleQubitGate(
  state: TwoQubitState | ThreeQubitState,
  matrix: Mat2,
  targetQubit: QubitIndex,
  qubitCount: 2 | 3
): TwoQubitState | ThreeQubitState {
  const [m00, m01, m10, m11] = matrix;
  const mask = bitMaskFor(qubitCount, targetQubit);
  const next = zeroRegister(state.length);

  for (let base = 0; base < state.length; base += 1) {
    if ((base & mask) !== 0) continue;
    const zeroIndex = base;
    const oneIndex = base | mask;
    const zeroAmp = state[zeroIndex];
    const oneAmp = state[oneIndex];
    next[zeroIndex] = add(mul(m00, zeroAmp), mul(m01, oneAmp));
    next[oneIndex] = add(mul(m10, zeroAmp), mul(m11, oneAmp));
  }

  return next as unknown as TwoQubitState | ThreeQubitState;
}

function applyCnotGate(
  state: TwoQubitState | ThreeQubitState,
  gate: GateInstance,
  qubitCount: 2 | 3
): TwoQubitState | ThreeQubitState {
  const { controlQubit, targetQubit } = assertDistinctControlTarget(gate);
  const controlMask = bitMaskFor(qubitCount, controlQubit);
  const targetMask = bitMaskFor(qubitCount, targetQubit);
  const next = zeroRegister(state.length);

  state.forEach((amp, index) => {
    const destination = (index & controlMask) !== 0 ? index ^ targetMask : index;
    next[destination] = add(next[destination], amp);
  });

  return next as unknown as TwoQubitState | ThreeQubitState;
}

function applyTwoQubitGate(state: TwoQubitState, gate: GateInstance): TwoQubitState {
  const [s00, s01, s10, s11] = state;
  switch (gate.gateId) {
    case "CNOT":
      return applyCnotGate(state, gate, 2) as TwoQubitState;
    case "CZ":
      assertDistinctControlTarget(gate);
      return [s00, s01, s10, c(-s11.re, -s11.im)] as const;
    case "SWAP":
      return [s00, s10, s01, s11] as const;
    default:
      throw new Error(`Unsupported two-qubit gate: ${gate.gateId}`);
  }
}

const CNOT_Q0_TO_Q1_MATRIX: Mat4 = [
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

const CNOT_Q1_TO_Q0_MATRIX: Mat4 = [
  ONE,
  ZERO,
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
  ONE,
  ZERO,
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
    case "CNOT": {
      const { controlQubit, targetQubit } = assertDistinctControlTarget(gate);
      return controlQubit === 0 && targetQubit === 1
        ? CNOT_Q0_TO_Q1_MATRIX
        : CNOT_Q1_TO_Q0_MATRIX;
    }
    case "CZ":
      assertDistinctControlTarget(gate);
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
      stateAfter = applySingleQubitGate(
        stateBefore,
        matrix,
        targetQubitFor(gate),
        2
      ) as TwoQubitState;
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

  const finalConcurrence = concurrence(state);
  return {
    qubitCount: 2,
    initialState: KET_00,
    finalState: state,
    steps,
    finalProbabilities: twoQubitProbabilities(state),
    entanglement: {
      concurrence: finalConcurrence,
      classification: classifyEntanglement(finalConcurrence),
    },
  };
}

function simulateThreeQubits(gates: readonly GateInstance[]): SimulationResult {
  let state: ThreeQubitState = KET_000;
  const steps: SimulationStep[] = [];

  gates.forEach((gate, index) => {
    const stateBefore = state;
    let stateAfter: ThreeQubitState;
    let matrix: Mat2 | Mat4 | undefined;

    if (gate.arity === 1) {
      const gateId = assertSingleQubitGate(gate);
      matrix = matrixOf(gateId, gate.params);
      stateAfter = applySingleQubitGate(
        stateBefore,
        matrix,
        targetQubitFor(gate),
        3
      ) as ThreeQubitState;
    } else if (gate.gateId === "CNOT") {
      stateAfter = applyCnotGate(stateBefore, gate, 3) as ThreeQubitState;
    } else {
      throw new Error(`${gate.gateId} is not supported in 3-qubit mode`);
    }

    steps.push({
      index,
      gate,
      matrix,
      stateBefore,
      stateAfter,
      probAfter: threeQubitProbabilities(stateAfter),
      narrative: narrativeFor(gate),
    });
    state = stateAfter;
  });

  return {
    qubitCount: 3,
    initialState: KET_000,
    finalState: state,
    steps,
    finalProbabilities: threeQubitProbabilities(state),
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
  if (qubitCount === 1) return simulateSingleQubit(gates);
  if (qubitCount === 2) return simulateTwoQubits(gates);
  return simulateThreeQubits(gates);
}
