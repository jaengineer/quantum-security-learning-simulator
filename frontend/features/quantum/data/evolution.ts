/**
 * Step-by-step descriptors of the quantum state evolution for each available
 * experiment, expressed as KaTeX expressions plus didactic metadata.
 *
 * The same data drives the legacy plain-list ``QuantumStateEvolution`` and
 * the new ``VerticalQuantumEvolutionTimeline`` introduced in the second
 * iteration of Phase 3.
 *
 * Shape rationale:
 *   - ``id`` is a stable React key.
 *   - ``label`` is the short title shown next to the badge.
 *   - ``expression`` is the KaTeX source for the formula.
 *   - ``description`` is the optional one-/two-sentence didactic note shown
 *     under the formula. Always plain text (no markup); use Unicode for
 *     simple kets like |0⟩.
 *   - ``operationFromPrevious`` is the operation that produced this step
 *     from the previous one (e.g. ``"Apply H on q0"``). It is rendered as
 *     the connector text *above* the step, never on the first step.
 *   - ``kind`` drives semantic styling: the badge colour, the spine accent
 *     and (in the future) overlay copy. ``"operation"`` is reserved for a
 *     potential future use case where an operation gets its own card; the
 *     current experiments never use it.
 */

import type { ExperimentType, InitialState } from "@/features/quantum/types";

export type EvolutionStepKind =
  | "initial"
  | "operation"
  | "state"
  | "measurement";

export interface EvolutionStep {
  id: string;
  label: string;
  expression: string;
  description?: string;
  operationFromPrevious?: string;
  kind: EvolutionStepKind;
}

export function buildSuperpositionSteps(
  initialState: InitialState | string
): EvolutionStep[] {
  const normalized = initialState === "1" ? "1" : "0";
  const sign = normalized === "1" ? "-" : "+";
  return [
    {
      id: "initial",
      label: "Initial state",
      expression: `\\lvert ${normalized}\\rangle`,
      description: `The qubit starts in the basis state |${normalized}\u27E9.`,
      kind: "initial",
    },
    {
      id: "after-h",
      label: "Superposition state",
      expression: `\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 0\\rangle ${sign} \\lvert 1\\rangle\\bigr)`,
      description:
        "Hadamard creates an equal superposition between |0\u27E9 and |1\u27E9.",
      operationFromPrevious: "Apply H",
      kind: "state",
    },
    {
      id: "measurement",
      label: "Measurement outcomes",
      expression: "\\lvert 0\\rangle \\;\\text{or}\\; \\lvert 1\\rangle",
      description:
        "Each outcome is obtained with probability 1/2; the empirical ratio approaches 50/50 as the number of shots grows.",
      operationFromPrevious: "Measurement",
      kind: "measurement",
    },
  ];
}

export function buildEntanglementSteps(): EvolutionStep[] {
  return [
    {
      id: "initial",
      label: "Initial state",
      expression: "\\lvert 00\\rangle",
      description: "Both qubits start in the basis state |0\u27E9.",
      kind: "initial",
    },
    {
      id: "after-h",
      label: "Superposition on q0",
      expression:
        "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 10\\rangle\\bigr)",
      description:
        "Applying Hadamard on q0 creates a superposition between |00\u27E9 and |10\u27E9.",
      operationFromPrevious: "Apply H on q0",
      kind: "state",
    },
    {
      id: "after-cx",
      label: "Entangled state",
      expression:
        "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 11\\rangle\\bigr)",
      description:
        "Applying CX (control: q0, target: q1) entangles the qubits. The system is now in a Bell state.",
      operationFromPrevious: "Apply CX(q0, q1)",
      kind: "state",
    },
    {
      id: "measurement",
      label: "Correlated outcomes",
      expression: "\\lvert 00\\rangle \\;\\text{or}\\; \\lvert 11\\rangle",
      description:
        "Measurement collapses the state to either |00\u27E9 or |11\u27E9. Outcomes are perfectly correlated.",
      operationFromPrevious: "Measurement",
      kind: "measurement",
    },
  ];
}

/**
 * Generic dispatcher: returns the evolution steps for a given experiment, or
 * ``null`` when the experiment does not yet have a documented evolution path.
 */
export function buildEvolutionSteps(
  experimentId: ExperimentType,
  initialState: InitialState | string
): EvolutionStep[] | null {
  if (experimentId === "superposition") {
    return buildSuperpositionSteps(initialState);
  }
  if (experimentId === "entanglement") {
    return buildEntanglementSteps();
  }
  return null;
}
