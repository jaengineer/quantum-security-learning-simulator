"use client";

/**
 * Legacy, plain-list rendering of the quantum-state evolution. Kept as the
 * ``visualMode="simple"`` fallback for the animated timeline introduced in
 * Phase 3. Both components consume the same step builders from
 * ``@/features/quantum/data/evolution``.
 */

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { buildEvolutionSteps } from "@/features/quantum/data/evolution";
import type {
  ExperimentType,
  InitialState,
} from "@/features/quantum/types";

interface QuantumStateEvolutionProps {
  experimentId: ExperimentType;
  initialState?: InitialState | string;
}

export function QuantumStateEvolution({
  experimentId,
  initialState = "0",
}: QuantumStateEvolutionProps) {
  const steps = buildEvolutionSteps(experimentId, initialState);
  if (!steps) return null;

  return (
    <ol className="flex flex-col gap-2">
      {steps.map((step) => (
        <li
          key={step.id}
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
