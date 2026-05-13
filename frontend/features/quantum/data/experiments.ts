/**
 * Static catalog of quantum experiments offered by the MVP.
 *
 * Keeping this data here (instead of inline in JSX) lets us:
 *  - render the same list from the landing and any future menu / sitemap,
 *  - reuse the entries when rendering breadcrumbs inside a workspace,
 *  - keep the future ("coming soon") experiments visible as a roadmap.
 */

import type { QuantumExperiment } from "@/features/quantum/types";

export const QUANTUM_EXPERIMENTS: readonly QuantumExperiment[] = [
  {
    id: "superposition",
    title: "Superposition",
    subtitle: "1 qubit \u2014 Hadamard gate",
    qubits: 1,
    status: "available",
    description:
      "Create a superposition state from |0\u27E9 or |1\u27E9 and observe probabilistic measurement results.",
    learningGoal:
      "Understand how a Hadamard gate produces an equal superposition and how measurement collapses it.",
  },
  {
    id: "entanglement",
    title: "Entanglement",
    subtitle: "2 qubits \u2014 Bell state",
    qubits: 2,
    status: "available",
    description:
      "Generate a Bell state and observe correlated measurement outcomes between two qubits.",
    learningGoal:
      "See how H + CNOT entangles two qubits so that measuring one fully determines the other.",
  },
  {
    id: "ideal-vs-noise",
    title: "Ideal vs Noisy Simulation",
    subtitle: "1\u20132 qubits \u2014 noise comparison",
    qubits: "1-2",
    status: "coming-soon",
    description:
      "Compare ideal quantum simulation with a simplified noisy execution.",
    learningGoal:
      "Appreciate how noise distorts the expected distribution of measurement outcomes.",
  },
  {
    id: "security-case",
    title: "Quantum Security Case",
    subtitle: "1\u20132 qubits \u2014 didactic scenario",
    qubits: "1-2",
    status: "coming-soon",
    description:
      "Explore simplified security scenarios affected by quantum computation.",
    learningGoal:
      "Build the intuition that links quantum primitives to real-world cryptographic concerns.",
  },
] as const;

export function getExperimentById(
  id: string
): QuantumExperiment | undefined {
  return QUANTUM_EXPERIMENTS.find((experiment) => experiment.id === id);
}
