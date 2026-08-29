import { add, c, mul, scale, ZERO } from "@/features/quantum/builder/math/complex";
import { matrixOf } from "@/features/quantum/builder/math/quantum-gates";
import {
  KET_00,
  twoQubitProbabilities,
} from "@/features/quantum/builder/math/quantum-state";
import type {
  Complex,
  Mat2,
  Mat4,
  TwoQubitProbabilities,
  TwoQubitState,
} from "@/features/quantum/builder/types";

export type GroverBasisState = "00" | "01" | "10" | "11";
export type GroverStageId =
  | "initial"
  | "superposition"
  | "oracle"
  | "diffusion"
  | "measurement";

export interface GroverStageResult {
  id: GroverStageId;
  index: number;
  target: GroverBasisState;
  state: TwoQubitState;
  probabilities: TwoQubitProbabilities;
  descriptionKey: GroverStageDescriptionKey;
  operatorLatex?: string;
  oracleMatrix?: Mat4;
  diffusionBefore?: TwoQubitState;
  diffusionMean?: Complex;
}

export type GroverStageDescriptionKey =
  | "stage_initial_description"
  | "stage_superposition_description"
  | "stage_oracle_description"
  | "stage_diffusion_description"
  | "stage_measurement_description";

export const GROVER_TARGETS = ["00", "01", "10", "11"] as const satisfies readonly GroverBasisState[];
export const GROVER_STAGE_IDS = [
  "initial",
  "superposition",
  "oracle",
  "diffusion",
  "measurement",
] as const satisfies readonly GroverStageId[];

const STAGE_DESCRIPTION_KEYS: Record<GroverStageId, GroverStageDescriptionKey> = {
  initial: "stage_initial_description",
  superposition: "stage_superposition_description",
  oracle: "stage_oracle_description",
  diffusion: "stage_diffusion_description",
  measurement: "stage_measurement_description",
};

function stage(
  id: GroverStageId,
  index: number,
  target: GroverBasisState,
  state: TwoQubitState,
  metadata: Omit<
    Partial<GroverStageResult>,
    "descriptionKey" | "id" | "index" | "probabilities" | "state" | "target"
  > = {}
): GroverStageResult {
  return {
    id,
    index,
    target,
    state,
    probabilities: twoQubitProbabilities(state),
    descriptionKey: STAGE_DESCRIPTION_KEYS[id],
    ...metadata,
  };
}

export function targetIndex(target: GroverBasisState): 0 | 1 | 2 | 3 {
  return GROVER_TARGETS.indexOf(target) as 0 | 1 | 2 | 3;
}

function matrixEntry(value: number): Complex {
  return c(value, 0);
}

export function createOracleMatrix(target: GroverBasisState): Mat4 {
  const selectedIndex = targetIndex(target);
  return Array.from({ length: 16 }, (_, index) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    if (row !== col) return ZERO;
    return matrixEntry(row === selectedIndex ? -1 : 1);
  }) as unknown as Mat4;
}

export function applyMat4(state: TwoQubitState, matrix: Mat4): TwoQubitState {
  return [0, 1, 2, 3].map((row) => {
    return [0, 1, 2, 3].reduce(
      (sum, col) => add(sum, mul(matrix[row * 4 + col], state[col])),
      ZERO
    );
  }) as unknown as TwoQubitState;
}

function applySingleQubitGate(
  state: TwoQubitState,
  matrix: Mat2,
  targetQubit: 0 | 1
): TwoQubitState {
  const [a00, a01, a10, a11] = state;
  const [m00, m01, m10, m11] = matrix;

  if (targetQubit === 0) {
    return [
      add(mul(m00, a00), mul(m01, a10)),
      add(mul(m00, a01), mul(m01, a11)),
      add(mul(m10, a00), mul(m11, a10)),
      add(mul(m10, a01), mul(m11, a11)),
    ] as const;
  }

  return [
    add(mul(m00, a00), mul(m01, a01)),
    add(mul(m10, a00), mul(m11, a01)),
    add(mul(m00, a10), mul(m01, a11)),
    add(mul(m10, a10), mul(m11, a11)),
  ] as const;
}

export function applyOracle(
  state: TwoQubitState,
  target: GroverBasisState
): TwoQubitState {
  return applyMat4(state, createOracleMatrix(target));
}

function sumAmplitudes(state: TwoQubitState): Complex {
  return state.reduce((sum, amp) => add(sum, amp), ZERO);
}

export function diffusionMean(state: TwoQubitState): Complex {
  return scale(sumAmplitudes(state), 1 / state.length);
}

export function applyDiffusion(state: TwoQubitState): TwoQubitState {
  const mean = diffusionMean(state);
  return state.map((amp) => add(scale(mean, 2), scale(amp, -1))) as unknown as TwoQubitState;
}

export function runGrover(target: GroverBasisState): readonly GroverStageResult[] {
  const hadamard = matrixOf("H");
  const initial = KET_00;
  const superposition = applySingleQubitGate(
    applySingleQubitGate(initial, hadamard, 0),
    hadamard,
    1
  );
  const oracleMatrix = createOracleMatrix(target);
  const oracle = applyMat4(superposition, oracleMatrix);
  const mean = diffusionMean(oracle);
  const diffusion = applyDiffusion(oracle);

  return [
    stage("initial", 0, target, initial),
    stage("superposition", 1, target, superposition, {
      operatorLatex: "H \\otimes H",
    }),
    stage("oracle", 2, target, oracle, {
      operatorLatex: "O_f\\lvert x\\rangle=(-1)^{f(x)}\\lvert x\\rangle",
      oracleMatrix,
    }),
    stage("diffusion", 3, target, diffusion, {
      diffusionBefore: oracle,
      diffusionMean: mean,
      operatorLatex: "D=2\\lvert s\\rangle\\langle s\\rvert-I",
    }),
    stage("measurement", 4, target, diffusion),
  ];
}
