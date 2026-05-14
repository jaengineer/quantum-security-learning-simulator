/**
 * Catalog of single-qubit quantum gates exposed by the Builder.
 *
 * Each entry pairs a static descriptor (label, KaTeX expression, didactic
 * narrative, palette color) with a ``matrix(params?)`` factory that returns
 * the concrete 2x2 unitary. Parametric gates (Rx/Ry/Rz) require a ``theta``
 * value; non-parametric gates ignore their argument.
 *
 * Matrices follow the canonical conventions used throughout the literature:
 *
 *   I    = [[1, 0], [0, 1]]
 *   X    = [[0, 1], [1, 0]]
 *   Y    = [[0, -i], [i, 0]]
 *   Z    = [[1, 0], [0, -1]]
 *   H    = (1/√2) * [[1, 1], [1, -1]]
 *   S    = diag(1, i)
 *   Sdg  = diag(1, -i)
 *   T    = diag(1, e^{iπ/4})
 *   Tdg  = diag(1, e^{-iπ/4})
 *   Rx(θ) = [[cos(θ/2), -i sin(θ/2)], [-i sin(θ/2), cos(θ/2)]]
 *   Ry(θ) = [[cos(θ/2), -sin(θ/2)], [sin(θ/2), cos(θ/2)]]
 *   Rz(θ) = [[e^{-iθ/2}, 0], [0, e^{iθ/2}]]
 */

import { c, expI, I, ONE, ZERO } from "@/features/quantum/builder/math/complex";
import type {
  GateId,
  GateParams,
  Mat2,
  QuantumGate,
} from "@/features/quantum/builder/types";

function requireTheta(params: GateParams | undefined, id: GateId): number {
  if (!params) {
    throw new Error(
      `Gate ${id} is parametric and requires a 'theta' value (received undefined)`
    );
  }
  return params.theta;
}

const SQRT1_2 = Math.SQRT1_2;

const GATE_DEFS: Record<GateId, QuantumGate> = {
  I: {
    id: "I",
    label: "I",
    longName: "Identity",
    latex: "I = \\begin{bmatrix}1 & 0 \\\\ 0 & 1\\end{bmatrix}",
    palette: "identity",
    parametric: false,
    description: "The identity leaves the state unchanged.",
    matrix: () => [ONE, ZERO, ZERO, ONE] as const,
  },
  X: {
    id: "X",
    label: "X",
    longName: "Pauli-X (NOT)",
    latex: "X = \\begin{bmatrix}0 & 1 \\\\ 1 & 0\\end{bmatrix}",
    palette: "pauli",
    parametric: false,
    description:
      "Pauli-X is the quantum NOT: it swaps the amplitudes of |0⟩ and |1⟩.",
    matrix: () => [ZERO, ONE, ONE, ZERO] as const,
  },
  Y: {
    id: "Y",
    label: "Y",
    longName: "Pauli-Y",
    latex: "Y = \\begin{bmatrix}0 & -i \\\\ i & 0\\end{bmatrix}",
    palette: "pauli",
    parametric: false,
    description:
      "Pauli-Y combines a bit flip with a phase flip; rotates by π around the Y axis on the Bloch sphere.",
    matrix: () => [ZERO, c(0, -1), I, ZERO] as const,
  },
  Z: {
    id: "Z",
    label: "Z",
    longName: "Pauli-Z",
    latex: "Z = \\begin{bmatrix}1 & 0 \\\\ 0 & -1\\end{bmatrix}",
    palette: "pauli",
    parametric: false,
    description:
      "Pauli-Z flips the phase of |1⟩ while leaving |0⟩ untouched.",
    matrix: () => [ONE, ZERO, ZERO, c(-1, 0)] as const,
  },
  H: {
    id: "H",
    label: "H",
    longName: "Hadamard",
    latex:
      "H = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1 & 1 \\\\ 1 & -1\\end{bmatrix}",
    palette: "hadamard",
    parametric: false,
    description:
      "The Hadamard gate creates an equal superposition between |0⟩ and |1⟩.",
    matrix: () =>
      [
        c(SQRT1_2, 0),
        c(SQRT1_2, 0),
        c(SQRT1_2, 0),
        c(-SQRT1_2, 0),
      ] as const,
  },
  S: {
    id: "S",
    label: "S",
    longName: "Phase (¼-turn)",
    latex: "S = \\begin{bmatrix}1 & 0 \\\\ 0 & i\\end{bmatrix}",
    palette: "phase",
    parametric: false,
    description:
      "S applies a quarter-turn phase (π/2) to the |1⟩ component.",
    matrix: () => [ONE, ZERO, ZERO, I] as const,
  },
  Sdg: {
    id: "Sdg",
    label: "S†",
    longName: "S-dagger",
    latex: "S^{\\dagger} = \\begin{bmatrix}1 & 0 \\\\ 0 & -i\\end{bmatrix}",
    palette: "phase",
    parametric: false,
    description:
      "S† is the inverse of S; it applies a -π/2 phase to the |1⟩ component.",
    matrix: () => [ONE, ZERO, ZERO, c(0, -1)] as const,
  },
  T: {
    id: "T",
    label: "T",
    longName: "T (⅛-turn)",
    latex:
      "T = \\begin{bmatrix}1 & 0 \\\\ 0 & e^{i\\pi/4}\\end{bmatrix}",
    palette: "phase",
    parametric: false,
    description:
      "T applies an eighth-turn phase (π/4) to the |1⟩ component.",
    matrix: () => [ONE, ZERO, ZERO, expI(Math.PI / 4)] as const,
  },
  Tdg: {
    id: "Tdg",
    label: "T†",
    longName: "T-dagger",
    latex:
      "T^{\\dagger} = \\begin{bmatrix}1 & 0 \\\\ 0 & e^{-i\\pi/4}\\end{bmatrix}",
    palette: "phase",
    parametric: false,
    description:
      "T† is the inverse of T; it applies a -π/4 phase to the |1⟩ component.",
    matrix: () => [ONE, ZERO, ZERO, expI(-Math.PI / 4)] as const,
  },
  Rx: {
    id: "Rx",
    label: "Rx",
    longName: "Rotation around X",
    latex:
      "R_x(\\theta) = \\begin{bmatrix}\\cos\\tfrac{\\theta}{2} & -i\\sin\\tfrac{\\theta}{2} \\\\ -i\\sin\\tfrac{\\theta}{2} & \\cos\\tfrac{\\theta}{2}\\end{bmatrix}",
    palette: "rotation",
    parametric: true,
    description:
      "Rotates the state vector by θ around the X axis of the Bloch sphere.",
    matrix: (params) => {
      const theta = requireTheta(params, "Rx");
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [c(cos, 0), c(0, -sin), c(0, -sin), c(cos, 0)] as const;
    },
  },
  Ry: {
    id: "Ry",
    label: "Ry",
    longName: "Rotation around Y",
    latex:
      "R_y(\\theta) = \\begin{bmatrix}\\cos\\tfrac{\\theta}{2} & -\\sin\\tfrac{\\theta}{2} \\\\ \\sin\\tfrac{\\theta}{2} & \\cos\\tfrac{\\theta}{2}\\end{bmatrix}",
    palette: "rotation",
    parametric: true,
    description:
      "Rotates the state vector by θ around the Y axis of the Bloch sphere.",
    matrix: (params) => {
      const theta = requireTheta(params, "Ry");
      const cos = Math.cos(theta / 2);
      const sin = Math.sin(theta / 2);
      return [c(cos, 0), c(-sin, 0), c(sin, 0), c(cos, 0)] as const;
    },
  },
  Rz: {
    id: "Rz",
    label: "Rz",
    longName: "Rotation around Z",
    latex:
      "R_z(\\theta) = \\begin{bmatrix}e^{-i\\theta/2} & 0 \\\\ 0 & e^{i\\theta/2}\\end{bmatrix}",
    palette: "rotation",
    parametric: true,
    description:
      "Rotates the state vector by θ around the Z axis of the Bloch sphere.",
    matrix: (params) => {
      const theta = requireTheta(params, "Rz");
      return [expI(-theta / 2), ZERO, ZERO, expI(theta / 2)] as const;
    },
  },
};

/** Ordered list of every gate id offered by the palette. */
export const GATE_ORDER: readonly GateId[] = [
  "I",
  "X",
  "Y",
  "Z",
  "H",
  "S",
  "Sdg",
  "T",
  "Tdg",
  "Rx",
  "Ry",
  "Rz",
] as const;

/** Lookup the static catalog entry for a gate id. */
export function getGate(id: GateId): QuantumGate {
  const gate = GATE_DEFS[id];
  if (!gate) throw new Error(`Unknown gate id: ${id as string}`);
  return gate;
}

/** Resolve the concrete 2x2 unitary for a gate id and its parameters. */
export function matrixOf(id: GateId, params?: GateParams): Mat2 {
  return getGate(id).matrix(params);
}

/** All gates in the order they should appear in the palette. */
export const ALL_GATES: readonly QuantumGate[] = GATE_ORDER.map(getGate);
