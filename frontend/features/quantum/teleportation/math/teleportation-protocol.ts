import {
  abs2,
  add,
  c,
  conj,
  mul,
  scale,
} from "@/features/quantum/builder/math/complex";
import type {
  Complex,
  SingleQubitState,
  ThreeQubitState,
} from "@/features/quantum/builder/types";
import type { TeleportationInputState } from "@/features/quantum/teleportation/data/inputStates";

export type AliceMeasurementOutcome = "00" | "01" | "10" | "11";
export type CorrectionLabel = "I" | "X" | "Z" | "XZ";
export type CorrectionDescriptionKey =
  | "correction_description_00"
  | "correction_description_01"
  | "correction_description_10"
  | "correction_description_11";

export interface TeleportationCorrection {
  label: CorrectionLabel;
  gates: readonly ("X" | "Z")[];
  descriptionKey: CorrectionDescriptionKey;
}

export interface TeleportationBranch {
  outcome: AliceMeasurementOutcome;
  correction: TeleportationCorrection;
  probability: number;
  bobUncorrectedState: SingleQubitState;
  bobCorrectedState: SingleQubitState;
  fidelity: number;
}

export interface TeleportationProtocolResult {
  inputState: SingleQubitState;
  preMeasurementState: ThreeQubitState;
  branches: readonly TeleportationBranch[];
}

export const ALICE_MEASUREMENT_OUTCOMES = [
  "00",
  "01",
  "10",
  "11",
] as const satisfies readonly AliceMeasurementOutcome[];

const CORRECTIONS: Record<AliceMeasurementOutcome, TeleportationCorrection> = {
  "00": {
    label: "I",
    gates: [],
    descriptionKey: "correction_description_00",
  },
  "01": {
    label: "X",
    gates: ["X"],
    descriptionKey: "correction_description_01",
  },
  "10": {
    label: "Z",
    gates: ["Z"],
    descriptionKey: "correction_description_10",
  },
  "11": {
    label: "XZ",
    gates: ["X", "Z"],
    descriptionKey: "correction_description_11",
  },
};

function stateFromInput(
  input: TeleportationInputState | SingleQubitState
): SingleQubitState {
  return "state" in input ? input.state : input;
}

function branchBobState(
  input: SingleQubitState,
  outcome: AliceMeasurementOutcome
): SingleQubitState {
  const [alpha, beta] = input;
  switch (outcome) {
    case "00":
      return [alpha, beta] as const;
    case "01":
      return [beta, alpha] as const;
    case "10":
      return [alpha, scale(beta, -1)] as const;
    case "11":
      return [scale(beta, -1), alpha] as const;
  }
}

function applyCorrection(
  state: SingleQubitState,
  correction: CorrectionLabel
): SingleQubitState {
  const [a, b] = state;
  switch (correction) {
    case "I":
      return [a, b] as const;
    case "X":
      return [b, a] as const;
    case "Z":
      return [a, scale(b, -1)] as const;
    case "XZ": {
      const afterZ = [a, scale(b, -1)] as const;
      return [afterZ[1], afterZ[0]] as const;
    }
  }
}

function innerProduct(a: SingleQubitState, b: SingleQubitState): Complex {
  return add(mul(conj(a[0]), b[0]), mul(conj(a[1]), b[1]));
}

export function fidelity(
  expected: SingleQubitState,
  actual: SingleQubitState
): number {
  return abs2(innerProduct(expected, actual));
}

export function buildPreMeasurementState(
  input: TeleportationInputState | SingleQubitState
): ThreeQubitState {
  const state = stateFromInput(input);
  const amplitudes = Array.from({ length: 8 }, () => c(0));

  ALICE_MEASUREMENT_OUTCOMES.forEach((outcome) => {
    const [bob0, bob1] = branchBobState(state, outcome);
    const baseIndex = Number.parseInt(outcome, 2) * 2;
    amplitudes[baseIndex] = scale(bob0, 0.5);
    amplitudes[baseIndex + 1] = scale(bob1, 0.5);
  });

  return amplitudes as unknown as ThreeQubitState;
}

export function evaluateTeleportationBranch(
  input: TeleportationInputState | SingleQubitState,
  outcome: AliceMeasurementOutcome
): TeleportationBranch {
  const inputState = stateFromInput(input);
  const uncorrected = branchBobState(inputState, outcome);
  const probability = uncorrected.reduce((sum, amp) => sum + abs2(scale(amp, 0.5)), 0);
  const corrected = applyCorrection(uncorrected, CORRECTIONS[outcome].label);

  return {
    outcome,
    correction: CORRECTIONS[outcome],
    probability,
    bobUncorrectedState: uncorrected,
    bobCorrectedState: corrected,
    fidelity: fidelity(inputState, corrected),
  };
}

export function runTeleportationProtocol(
  input: TeleportationInputState | SingleQubitState
): TeleportationProtocolResult {
  const inputState = stateFromInput(input);
  return {
    inputState,
    preMeasurementState: buildPreMeasurementState(inputState),
    branches: ALICE_MEASUREMENT_OUTCOMES.map((outcome) =>
      evaluateTeleportationBranch(inputState, outcome)
    ),
  };
}

export function sampleAliceOutcome(
  input: TeleportationInputState | SingleQubitState,
  random = Math.random
): TeleportationBranch {
  const branches = runTeleportationProtocol(input).branches;
  const threshold = random();
  let cumulative = 0;

  for (const branch of branches) {
    cumulative += branch.probability;
    if (threshold < cumulative) return branch;
  }

  return branches[branches.length - 1];
}
