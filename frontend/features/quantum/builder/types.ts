/**
 * Shared TypeScript types for the Quantum Circuit Builder.
 *
 * The Builder is a fully client-side, single-qubit tool. Everything here is
 * intentionally narrow to a 2-dimensional Hilbert space so the implementation
 * stays auditable. The math is kept in pure modules under ``./math`` and never
 * imports React; the UI consumes these types through props.
 *
 * Extending to multi-qubit (future work)
 * --------------------------------------
 *   - ``QuantumState`` would become ``Complex[]`` of length ``2^n``.
 *   - ``Mat2`` would become ``Complex[][]`` (or a flat ``Complex[]`` of length
 *     ``2^n * 2^n``) and gates would carry ``targets: number[]`` plus an
 *     ``applyGate`` helper that tensor-products identity on non-target wires.
 *   - Controlled gates (CNOT, CZ, SWAP) would enter as a discriminated
 *     ``kind: "controlled"`` variant of ``QuantumGate``.
 *   - ``BlochVector`` only makes sense for a single qubit; multi-qubit
 *     visualizations would switch to probability heatmaps or density
 *     matrices.
 */

export interface Complex {
  re: number;
  im: number;
}

/**
 * 2x2 complex matrix, row-major: ``[m00, m01, m10, m11]``.
 *
 * Stored as a flat tuple instead of nested arrays to avoid intermediate
 * allocations during simulation and to keep the type ergonomically tuple-like.
 */
export type Mat2 = readonly [Complex, Complex, Complex, Complex];

/**
 * Single-qubit pure state ``|ψ⟩ = α |0⟩ + β |1⟩`` stored as ``[α, β]``.
 *
 * The simulator does not enforce normalization at the type level; instead it
 * is preserved by construction (only unitary operations are applied). A
 * ``probabilities()`` helper is provided for inspection.
 */
export type QuantumState = readonly [Complex, Complex];

/**
 * Identifiers for every single-qubit gate the Builder exposes in its palette.
 *
 *   - ``Sdg`` / ``Tdg`` are the adjoints of ``S`` / ``T`` (often written as
 *     ``S†`` / ``T†``).
 *   - ``Rx`` / ``Ry`` / ``Rz`` are parametric rotations; their matrix depends
 *     on the angle ``theta`` carried by the gate instance.
 */
export type GateId =
  | "I"
  | "X"
  | "Y"
  | "Z"
  | "H"
  | "S"
  | "Sdg"
  | "T"
  | "Tdg"
  | "Rx"
  | "Ry"
  | "Rz";

export interface GateParams {
  /** Rotation angle in radians, only meaningful for ``Rx``/``Ry``/``Rz``. */
  theta: number;
}

/**
 * Static metadata for a gate (catalog entry). Independent of any concrete
 * instance placed on the circuit; pure data + a matrix factory.
 */
export interface QuantumGate {
  id: GateId;
  /** Short label shown on the block, e.g. ``"H"``, ``"S†"``, ``"Rx"``. */
  label: string;
  /** Longer human-readable name, e.g. ``"Hadamard"``, ``"S-dagger"``. */
  longName: string;
  /** KaTeX expression for the matrix (used in the step-by-step). */
  latex: string;
  /** Semantic color category used to tint the block. */
  palette: GatePalette;
  /** Whether the gate has a runtime parameter (theta). */
  parametric: boolean;
  /** Build the 2x2 matrix; ``params`` is required when ``parametric`` is true. */
  matrix: (params?: GateParams) => Mat2;
  /** Short didactic sentence reused as ``narrative`` in each simulation step. */
  description: string;
}

export type GatePalette =
  | "hadamard"
  | "pauli"
  | "phase"
  | "rotation"
  | "identity";

/**
 * A concrete gate placed on the circuit. ``uid`` is stable across renders so
 * dnd-kit can identify the item across reorders.
 */
export interface GateInstance {
  uid: string;
  id: GateId;
  params?: GateParams;
}

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface Probabilities {
  p0: number;
  p1: number;
}

export interface SimulationStep {
  /** Zero-based step index (matches array position). */
  index: number;
  gate: GateInstance;
  /** Matrix that was applied at this step (with concrete ``theta`` baked in). */
  matrix: Mat2;
  stateBefore: QuantumState;
  stateAfter: QuantumState;
  probAfter: Probabilities;
  blochAfter: BlochVector;
  narrative: string;
}

export interface SimulationResult {
  initialState: QuantumState;
  finalState: QuantumState;
  /** Product of every applied matrix, equivalent to the overall circuit unitary. */
  finalUnitary: Mat2;
  steps: SimulationStep[];
  finalProbabilities: Probabilities;
  finalBloch: BlochVector;
}
