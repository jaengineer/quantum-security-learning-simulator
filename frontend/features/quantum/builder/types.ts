/**
 * Shared TypeScript types for the Quantum Circuit Builder.
 *
 * The Builder is a fully client-side teaching tool. The MVP supports exactly
 * one or two qubits. In two-qubit mode, placed gate instances explicitly
 * store their q0/q1 target metadata; the UI never infers targets from visual
 * position after placement. The math is kept in pure modules under
 * ``./math`` and never imports React; the UI consumes these types through
 * props.
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

/** 4x4 complex matrix, row-major, used only for two-qubit MVP steps. */
export type Mat4 = readonly [
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
  Complex,
];

/**
 * Single-qubit pure state ``|ψ⟩ = α |0⟩ + β |1⟩`` stored as ``[α, β]``.
 *
 * The simulator does not enforce normalization at the type level; instead it
 * is preserved by construction (only unitary operations are applied). A
 * ``probabilities()`` helper is provided for inspection.
 */
export type SingleQubitState = readonly [Complex, Complex];
export type TwoQubitState = readonly [Complex, Complex, Complex, Complex];
export type QuantumState = SingleQubitState | TwoQubitState;

export type QubitCount = 1 | 2;
export type QubitIndex = 0 | 1;

export type GateArity = 1 | 2;

/**
 * Identifiers for every single-qubit gate the Builder exposes in its palette.
 *
 *   - ``Sdg`` / ``Tdg`` are the adjoints of ``S`` / ``T`` (often written as
 *     ``S†`` / ``T†``).
 *   - ``Rx`` / ``Ry`` / ``Rz`` are parametric rotations; their matrix depends
 *     on the angle ``theta`` carried by the gate instance.
 */
export type SingleQubitGateId =
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

export type TwoQubitGateId = "CNOT" | "CZ" | "SWAP";

export type GateId = SingleQubitGateId | TwoQubitGateId;

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
  /** Number of wires the gate acts on. */
  arity: GateArity;
  /** Whether the gate has a runtime parameter (theta). */
  parametric: boolean;
  /**
   * Build the 2x2 matrix for single-qubit gates; ``params`` is required when
   * ``parametric`` is true. Two-qubit gates are applied directly by the MVP
   * simulator because their orientation is fixed.
   */
  matrix?: (params?: GateParams) => Mat2;
  /** Short didactic sentence reused as ``narrative`` in each simulation step. */
  description: string;
}

export type GatePalette =
  | "hadamard"
  | "pauli"
  | "phase"
  | "rotation"
  | "identity"
  | "twoQubit";

/**
 * A concrete gate placed on the circuit. ``id`` is stable across renders so
 * dnd-kit can identify the item across reorders.
 */
export interface CircuitGate {
  id: string;
  gateId: GateId;
  arity: GateArity;
  targetQubit?: QubitIndex;
  controlQubit?: QubitIndex;
  targetQubits?: readonly [0, 1];
  params?: GateParams;
}

export type GateInstance = CircuitGate;

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

export interface Probabilities {
  p0: number;
  p1: number;
}

export interface TwoQubitProbabilities {
  p00: number;
  p01: number;
  p10: number;
  p11: number;
}

export type MeasurementProbabilities = Probabilities | TwoQubitProbabilities;

export interface SimulationStep {
  /** Zero-based step index (matches array position). */
  index: number;
  gate: GateInstance;
  /** Matrix that was applied at this step (with concrete ``theta`` baked in). */
  matrix?: Mat2 | Mat4;
  stateBefore: QuantumState;
  stateAfter: QuantumState;
  probAfter: MeasurementProbabilities;
  blochAfter?: BlochVector;
  narrative: string;
}

export type EntanglementClassification =
  | "separable"
  | "entangled"
  | "maximally-entangled";

export interface EntanglementInfo {
  concurrence: number;
  classification: EntanglementClassification;
}

export interface SimulationResult {
  qubitCount: QubitCount;
  initialState: QuantumState;
  finalState: QuantumState;
  /** Product of every applied matrix, equivalent to the overall circuit unitary. */
  finalUnitary?: Mat2;
  steps: SimulationStep[];
  finalProbabilities: MeasurementProbabilities;
  finalBloch?: BlochVector;
  entanglement?: EntanglementInfo;
}
