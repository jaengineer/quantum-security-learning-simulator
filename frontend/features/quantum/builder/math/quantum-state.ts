/**
 * Single-qubit pure-state utilities for the Quantum Circuit Builder.
 *
 * A state is a length-2 array of complex amplitudes ``[α, β]`` representing
 * ``|ψ⟩ = α |0⟩ + β |1⟩``. The simulator preserves the invariant
 * ``|α|² + |β|² = 1`` by construction (only unitary operations are applied).
 *
 * Extending to multi-qubit (future work)
 * --------------------------------------
 * Replace the fixed length-2 tuple with ``Complex[]`` of length ``2^n`` and
 * extend ``applyMatrix`` to accept a square matrix of matching size. Gate
 * application would then need to know which wire indices the gate targets so
 * the matrix can be tensor-producted with identity on the remaining wires.
 */

import { abs2, c, mul, add } from "@/features/quantum/builder/math/complex";
import type {
  Mat2,
  Probabilities,
  QuantumState,
  SingleQubitState,
  TwoQubitProbabilities,
  TwoQubitState,
} from "@/features/quantum/builder/types";

/** Computational-basis state ``|0⟩ = [1, 0]``. */
export const KET_0: SingleQubitState = [c(1, 0), c(0, 0)] as const;

/** Computational-basis state ``|1⟩ = [0, 1]``. */
export const KET_1: SingleQubitState = [c(0, 0), c(1, 0)] as const;

/** Computational-basis state ``|00⟩ = [1, 0, 0, 0]``. */
export const KET_00: TwoQubitState = [
  c(1, 0),
  c(0, 0),
  c(0, 0),
  c(0, 0),
] as const;

/**
 * Apply a 2x2 unitary to a state vector: ``|ψ'⟩ = M · |ψ⟩``.
 *
 * Both inputs are treated as immutable; the output is a brand-new tuple.
 */
export function applyMatrix(state: SingleQubitState, m: Mat2): SingleQubitState {
  const [a, b] = state;
  const [m00, m01, m10, m11] = m;
  return [add(mul(m00, a), mul(m01, b)), add(mul(m10, a), mul(m11, b))] as const;
}

/** Measurement probabilities in the computational basis. */
export function probabilities(state: SingleQubitState): Probabilities {
  return { p0: abs2(state[0]), p1: abs2(state[1]) };
}

/** Measurement probabilities for basis states |00⟩, |01⟩, |10⟩, |11⟩. */
export function twoQubitProbabilities(
  state: TwoQubitState
): TwoQubitProbabilities {
  return {
    p00: abs2(state[0]),
    p01: abs2(state[1]),
    p10: abs2(state[2]),
    p11: abs2(state[3]),
  };
}

export function isSingleQubitState(
  state: QuantumState
): state is SingleQubitState {
  return state.length === 2;
}

export function isTwoQubitState(state: QuantumState): state is TwoQubitState {
  return state.length === 4;
}
