/**
 * Pure-function simulator for a sequence of single-qubit gates.
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
 * Extending to multi-qubit (future work)
 * --------------------------------------
 * Replace ``QuantumState`` with a flat ``Complex[]`` of size ``2^n`` and
 * ``Mat2`` with ``Complex[]`` of size ``2^n · 2^n``. ``applyMatrix`` would
 * stay the same algorithm but with nested loops. Gates would carry
 * ``targets: number[]`` and a ``buildExpanded(matrix, targets, n)`` helper
 * would tensor-product identity on non-target wires before applying.
 */

import { ONE, ZERO, add, mul } from "@/features/quantum/builder/math/complex";
import {
  cleanBloch,
  stateToBloch,
} from "@/features/quantum/builder/math/bloch-coordinates";
import {
  getGate,
  matrixOf,
} from "@/features/quantum/builder/math/quantum-gates";
import {
  KET_0,
  applyMatrix,
  probabilities,
} from "@/features/quantum/builder/math/quantum-state";
import type {
  GateInstance,
  Mat2,
  QuantumState,
  SimulationResult,
  SimulationStep,
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
  const def = getGate(gate.id);
  if (gate.params && def.parametric) {
    const deg = ((gate.params.theta * 180) / Math.PI).toFixed(1);
    return `${def.description} (θ = ${deg}°)`;
  }
  return def.description;
}

/**
 * Run a circuit on an initial state and return both the final state and the
 * per-step trace. The trace is what powers the step-by-step explanation.
 */
export function simulate(
  initial: QuantumState = KET_0,
  gates: readonly GateInstance[] = []
): SimulationResult {
  let state: QuantumState = initial;
  let unitary: Mat2 = IDENTITY;
  const steps: SimulationStep[] = [];

  gates.forEach((gate, index) => {
    const m = matrixOf(gate.id, gate.params);
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
    initialState: initial,
    finalState: state,
    finalUnitary: unitary,
    steps,
    finalProbabilities: probabilities(state),
    finalBloch: cleanBloch(stateToBloch(state)),
  };
}
