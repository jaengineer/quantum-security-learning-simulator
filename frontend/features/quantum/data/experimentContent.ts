/**
 * Didactic content shown in the experiment briefing (left column of the
 * workspace). All LaTeX is stored here as raw strings so the UI components
 * stay free of math literals.
 */

import type { ExperimentType } from "@/features/quantum/types";

export interface ExperimentGateContent {
  name: string;
  matrix: string;
  physicalEffect: string;
  example: { input: string; output: string };
}

export interface ExperimentContent {
  concept: {
    title: string;
    description: string;
    takeaway?: string;
    formula?: { expression: string; displayMode?: "inline" | "block" };
  };
  gates: ReadonlyArray<ExperimentGateContent>;
  physicalInterpretation: {
    title: string;
    description: string;
    keyFormula?: { expression: string; displayMode?: "inline" | "block" };
  };
}

const HADAMARD_GATE: ExperimentGateContent = {
  name: "Hadamard (H)",
  matrix:
    "H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}",
  physicalEffect:
    "Rotates a computational-basis state into an equal superposition. It is self-inverse: applying H twice returns the original state.",
  example: {
    input: "H\\lvert 0\\rangle",
    output: "\\frac{1}{\\sqrt{2}}\\bigl(\\lvert 0\\rangle + \\lvert 1\\rangle\\bigr)",
  },
};

const CNOT_GATE: ExperimentGateContent = {
  name: "Controlled-NOT (CNOT)",
  matrix:
    "\\mathrm{CNOT} = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}",
  physicalEffect:
    "Flips the target qubit if and only if the control qubit is |1\u27E9. Combined with Hadamard, it is the canonical way to entangle two qubits.",
  example: {
    input: "\\mathrm{CNOT}\\,\\tfrac{1}{\\sqrt{2}}(\\lvert 00\\rangle + \\lvert 10\\rangle)",
    output: "\\tfrac{1}{\\sqrt{2}}(\\lvert 00\\rangle + \\lvert 11\\rangle)",
  },
};

const EMPTY_CONTENT: ExperimentContent = {
  concept: {
    title: "Coming soon",
    description:
      "This experiment is part of the MVP roadmap and will be enabled in an upcoming iteration.",
  },
  gates: [],
  physicalInterpretation: {
    title: "Why it matters",
    description:
      "The platform is designed to grow modularly: new experiments plug into the same architecture without disrupting the current functionality.",
  },
};

export const EXPERIMENT_CONTENT: Record<ExperimentType, ExperimentContent> = {
  superposition: {
    concept: {
      title: "Concept",
      description:
        "A qubit can exist in a linear combination (superposition) of the computational-basis states |0\u27E9 and |1\u27E9. The Hadamard gate is the canonical primitive that maps a definite basis state into an equal superposition.",
      takeaway:
        "Before measurement the qubit is in a superposition; the act of measurement collapses it into one of the two basis states.",
      formula: {
        expression:
          "\\lvert \\psi\\rangle = \\alpha\\lvert 0\\rangle + \\beta\\lvert 1\\rangle, \\quad |\\alpha|^{2} + |\\beta|^{2} = 1",
        displayMode: "block",
      },
    },
    gates: [HADAMARD_GATE],
    physicalInterpretation: {
      title: "Physical interpretation",
      description:
        "After applying H, measuring in the computational basis yields |0\u27E9 or |1\u27E9 each with probability 1/2. The empirical ratio counts/shots approaches this 50/50 distribution as the number of shots grows.",
      keyFormula: {
        expression:
          "P(\\lvert 0\\rangle) = P(\\lvert 1\\rangle) = \\tfrac{1}{2}",
        displayMode: "block",
      },
    },
  },
  entanglement: {
    concept: {
      title: "Concept",
      description:
        "Two qubits are entangled when their joint state cannot be written as the product of two single-qubit states. The Bell state \u03A6\u207A is the simplest example and is produced with one Hadamard plus one CNOT.",
      takeaway:
        "Entanglement makes the measurement outcomes of the two qubits perfectly correlated, regardless of the distance between them.",
      formula: {
        expression:
          "\\lvert \\Phi^{+}\\rangle = \\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 11\\rangle\\bigr)",
        displayMode: "block",
      },
    },
    gates: [HADAMARD_GATE, CNOT_GATE],
    physicalInterpretation: {
      title: "Physical interpretation",
      description:
        "Measuring \u03A6\u207A in the computational basis only ever yields |00\u27E9 or |11\u27E9, each with probability 1/2. The outcomes |01\u27E9 and |10\u27E9 have zero probability in an ideal simulator; observing them would signal noise or decoherence.",
      keyFormula: {
        expression:
          "P(\\lvert 00\\rangle) = P(\\lvert 11\\rangle) = \\tfrac{1}{2}, \\quad P(\\lvert 01\\rangle) = P(\\lvert 10\\rangle) = 0",
        displayMode: "block",
      },
    },
  },
  "ideal-vs-noise": EMPTY_CONTENT,
  "security-case": EMPTY_CONTENT,
};
