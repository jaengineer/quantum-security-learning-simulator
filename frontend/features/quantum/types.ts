/**
 * Shared types for the quantum simulation feature.
 *
 * `QuantumSimulationResult` mirrors the backend Pydantic model and stays
 * intentionally generic. Its `counts` and `probabilities` use
 * `Record<string, number>` so the same shape supports 1-qubit experiments
 * (keys "0"/"1") and 2-qubit experiments (keys "00"/"01"/"10"/"11"), and any
 * future N-qubit experiment.
 */

export type InitialState = "0" | "1";

export interface HadamardRequest {
  initial_state: InitialState;
  shots: number;
}

export type BellStateName = "phi_plus";

export interface BellStateRequest {
  bell_state: BellStateName;
  shots: number;
}

export interface QuantumSimulationResult {
  circuit: string;
  initial_state?: string;
  shots: number;
  counts: Record<string, number>;
  probabilities: Record<string, number>;
  qubits?: number;
  bell_state?: BellStateName | string;
  simulator?: string;
  execution_time_ms?: number;
}

export interface QuantumApiError {
  detail: string;
  type?: string;
}

/* ------------------------------------------------------------------ */
/* Experiment catalog                                                  */
/* ------------------------------------------------------------------ */

export type ExperimentType =
  | "superposition"
  | "entanglement"
  | "ideal-vs-noise"
  | "security-case";

export type QubitCount = 1 | 2;

export type ExperimentStatus = "available" | "coming-soon";

export interface QuantumExperiment {
  id: ExperimentType;
  title: string;
  subtitle: string;
  qubits: QubitCount | "1-2";
  status: ExperimentStatus;
  description: string;
  learningGoal: string;
}
