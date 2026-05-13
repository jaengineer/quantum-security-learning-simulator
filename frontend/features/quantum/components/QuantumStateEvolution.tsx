"use client";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import type {
  ExperimentType,
  InitialState,
} from "@/features/quantum/types";

interface QuantumStateEvolutionProps {
  experimentId: ExperimentType;
  initialState?: InitialState | string;
}

interface EvolutionStep {
  label: string;
  expression: string;
}

function buildSuperpositionSteps(initialState: string): EvolutionStep[] {
  const sign = initialState === "1" ? "-" : "+";
  return [
    { label: "Initial", expression: `\\lvert ${initialState}\\rangle` },
    {
      label: "After H",
      expression: `\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 0\\rangle ${sign} \\lvert 1\\rangle\\bigr)`,
    },
    {
      label: "Measurement",
      expression: "\\lvert 0\\rangle \\;\\text{or}\\; \\lvert 1\\rangle",
    },
  ];
}

function buildEntanglementSteps(): EvolutionStep[] {
  return [
    { label: "Initial", expression: "\\lvert 00\\rangle" },
    {
      label: "After H on q0",
      expression:
        "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 10\\rangle\\bigr)",
    },
    {
      label: "After CX(q0, q1)",
      expression:
        "\\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 00\\rangle + \\lvert 11\\rangle\\bigr)",
    },
    {
      label: "Measurement",
      expression:
        "\\lvert 00\\rangle \\;\\text{or}\\; \\lvert 11\\rangle \\;\\text{(correlated)}",
    },
  ];
}

export function QuantumStateEvolution({
  experimentId,
  initialState = "0",
}: QuantumStateEvolutionProps) {
  if (experimentId !== "superposition" && experimentId !== "entanglement") {
    return null;
  }

  const steps =
    experimentId === "superposition"
      ? buildSuperpositionSteps(initialState)
      : buildEntanglementSteps();

  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step) => (
        <li
          key={step.label}
          className="grid grid-cols-[10rem_minmax(0,1fr)] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2 dark:border-slate-800 dark:bg-slate-900/40"
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {step.label}
          </span>
          <span className="text-sm text-slate-800 dark:text-slate-100">
            <QuantumFormula expression={step.expression} />
          </span>
        </li>
      ))}
    </ol>
  );
}
