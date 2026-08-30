import { c } from "@/features/quantum/builder/math/complex";
import type { TwoQubitProbabilities, TwoQubitState } from "@/features/quantum/builder/types";
import type { BellStateName } from "@/features/quantum/types";

export type BellCorrelationClass = "same-bit" | "opposite-bit";

export interface BellStateDefinition {
  id: BellStateName;
  labelExpression: string;
  formulaExpression: string;
  stateVector: TwoQubitState;
  probabilities: Record<"00" | "01" | "10" | "11", number>;
  probabilityTuple: TwoQubitProbabilities;
  highlightedOutcomes: readonly string[];
  correlationClass: BellCorrelationClass;
  preparationOperations: readonly string[];
  phaseDescription: string;
  measurementDescription: string;
}

const INV_SQRT_2 = Math.SQRT1_2;

const diagonalProbabilities = {
  "00": 0.5,
  "01": 0,
  "10": 0,
  "11": 0.5,
} as const;

const antiDiagonalProbabilities = {
  "00": 0,
  "01": 0.5,
  "10": 0.5,
  "11": 0,
} as const;

function toProbabilityTuple(
  probabilities: BellStateDefinition["probabilities"]
): TwoQubitProbabilities {
  return {
    p00: probabilities["00"],
    p01: probabilities["01"],
    p10: probabilities["10"],
    p11: probabilities["11"],
  };
}

export const BELL_STATE_ORDER = [
  "phi_plus",
  "phi_minus",
  "psi_plus",
  "psi_minus",
] as const satisfies readonly BellStateName[];

export const BELL_STATES: Record<BellStateName, BellStateDefinition> = {
  phi_plus: {
    id: "phi_plus",
    labelExpression: "\\Phi^{+}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 11\\rangle\\bigr)",
    stateVector: [c(INV_SQRT_2, 0), c(0, 0), c(0, 0), c(INV_SQRT_2, 0)] as const,
    probabilities: diagonalProbabilities,
    probabilityTuple: toProbabilityTuple(diagonalProbabilities),
    highlightedOutcomes: ["00", "11"],
    correlationClass: "same-bit",
    preparationOperations: ["H(q0)", "CNOT(q0, q1)"],
    phaseDescription:
      "The |00⟩ and |11⟩ branches have the same positive phase.",
    measurementDescription:
      "Computational-basis measurement yields 00 or 11 with equal probability.",
  },
  phi_minus: {
    id: "phi_minus",
    labelExpression: "\\Phi^{-}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle - \\lvert 11\\rangle\\bigr)",
    stateVector: [c(INV_SQRT_2, 0), c(0, 0), c(0, 0), c(-INV_SQRT_2, 0)] as const,
    probabilities: diagonalProbabilities,
    probabilityTuple: toProbabilityTuple(diagonalProbabilities),
    highlightedOutcomes: ["00", "11"],
    correlationClass: "same-bit",
    preparationOperations: ["H(q0)", "CNOT(q0, q1)", "Z(q0)"],
    phaseDescription:
      "The |11⟩ branch carries a negative relative phase compared with |00⟩.",
    measurementDescription:
      "Computational-basis measurement still yields 00 or 11, just like Φ+.",
  },
  psi_plus: {
    id: "psi_plus",
    labelExpression: "\\Psi^{+}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 01\\rangle + \\lvert 10\\rangle\\bigr)",
    stateVector: [c(0, 0), c(INV_SQRT_2, 0), c(INV_SQRT_2, 0), c(0, 0)] as const,
    probabilities: antiDiagonalProbabilities,
    probabilityTuple: toProbabilityTuple(antiDiagonalProbabilities),
    highlightedOutcomes: ["01", "10"],
    correlationClass: "opposite-bit",
    preparationOperations: ["H(q0)", "CNOT(q0, q1)", "X(q1)"],
    phaseDescription:
      "The |01⟩ and |10⟩ branches have the same positive phase.",
    measurementDescription:
      "Computational-basis measurement yields 01 or 10 with equal probability.",
  },
  psi_minus: {
    id: "psi_minus",
    labelExpression: "\\Psi^{-}",
    formulaExpression:
      "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 01\\rangle - \\lvert 10\\rangle\\bigr)",
    stateVector: [c(0, 0), c(INV_SQRT_2, 0), c(-INV_SQRT_2, 0), c(0, 0)] as const,
    probabilities: antiDiagonalProbabilities,
    probabilityTuple: toProbabilityTuple(antiDiagonalProbabilities),
    highlightedOutcomes: ["01", "10"],
    correlationClass: "opposite-bit",
    preparationOperations: ["H(q0)", "CNOT(q0, q1)", "X(q1)", "Z(q0)"],
    phaseDescription:
      "The |10⟩ branch carries a negative relative phase compared with |01⟩.",
    measurementDescription:
      "Computational-basis measurement still yields 01 or 10, just like Ψ+.",
  },
} as const;

export const SEPARABLE_COMPARISON_STATE = {
  labelExpression: "\\lvert ++\\rangle",
  formulaExpression:
    "\\tfrac{1}{2}\\bigl(\\lvert 00\\rangle + \\lvert 01\\rangle + \\lvert 10\\rangle + \\lvert 11\\rangle\\bigr)",
  stateVector: [
    c(0.5, 0),
    c(0.5, 0),
    c(0.5, 0),
    c(0.5, 0),
  ] as const satisfies TwoQubitState,
  probabilities: {
    "00": 0.25,
    "01": 0.25,
    "10": 0.25,
    "11": 0.25,
  },
} as const;

export function getBellStateDefinition(
  bellState: BellStateName | string | undefined
): BellStateDefinition {
  if (
    bellState === "phi_minus" ||
    bellState === "psi_plus" ||
    bellState === "psi_minus"
  ) {
    return BELL_STATES[bellState];
  }
  return BELL_STATES.phi_plus;
}

export function bellStateProbabilities(
  bellState: BellStateName
): BellStateDefinition["probabilities"] {
  return BELL_STATES[bellState].probabilities;
}
