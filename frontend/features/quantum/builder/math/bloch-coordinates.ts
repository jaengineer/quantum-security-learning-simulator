/**
 * Map a single-qubit pure state to its Bloch-sphere coordinates.
 *
 * For ``|ψ⟩ = α |0⟩ + β |1⟩`` the Bloch vector is:
 *
 *   x = 2 · Re(α* · β)
 *   y = 2 · Im(α* · β)
 *   z = |α|² − |β|²
 *
 * Conventions (right-handed, Z up):
 *
 *   |0⟩  -> ( 0,  0,  1)
 *   |1⟩  -> ( 0,  0, -1)
 *   |+⟩  -> ( 1,  0,  0)
 *   |-⟩  -> (-1,  0,  0)
 *   |+i⟩ -> ( 0,  1,  0)
 *   |-i⟩ -> ( 0, -1,  0)
 *
 * Multi-qubit note: the Bloch sphere only represents *single-qubit* pure
 * states. For multi-qubit systems the reduced density matrix of one qubit
 * still maps onto a Bloch ball (radius < 1 for mixed states), but composite
 * states require different visualizations entirely.
 */

import { abs2, conj, mul } from "@/features/quantum/builder/math/complex";
import type { BlochVector, QuantumState } from "@/features/quantum/builder/types";

export function stateToBloch(state: QuantumState): BlochVector {
  const [alpha, beta] = state;
  const inner = mul(conj(alpha), beta);
  return {
    x: 2 * inner.re,
    y: 2 * inner.im,
    z: abs2(alpha) - abs2(beta),
  };
}

/** Round near-zero noise on every component to exactly zero. Display helper. */
export function cleanBloch(v: BlochVector, eps = 1e-12): BlochVector {
  return {
    x: Math.abs(v.x) < eps ? 0 : v.x,
    y: Math.abs(v.y) < eps ? 0 : v.y,
    z: Math.abs(v.z) < eps ? 0 : v.z,
  };
}
