"use client";

import type { EntanglementInfo } from "@/features/quantum/builder/types";

interface EntanglementPanelProps {
  entanglement: EntanglementInfo;
}

function labelFor(classification: EntanglementInfo["classification"]): string {
  switch (classification) {
    case "separable":
      return "Separable state";
    case "maximally-entangled":
      return "Maximally entangled";
    case "entangled":
      return "Entangled state";
  }
}

function explanationFor(
  classification: EntanglementInfo["classification"]
): string {
  switch (classification) {
    case "separable":
      return "The state can be represented as two independent single-qubit states.";
    case "maximally-entangled":
      return "Measuring one qubit determines the correlated outcome of the other, even though each individual measurement is probabilistic.";
    case "entangled":
      return "The two-qubit state cannot be written as a tensor product of two independent qubit states.";
  }
}

export function EntanglementPanel({ entanglement }: EntanglementPanelProps) {
  const percent = Math.round(entanglement.concurrence * 100);
  const isSeparable = entanglement.classification === "separable";

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-fuchsia-300 bg-fuchsia-500/10 p-4 text-sm text-slate-600 dark:border-fuchsia-500/40 dark:bg-fuchsia-500/10 dark:text-slate-300">
      <div className="flex flex-col gap-1">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-200">
          Entanglement
        </p>
        <p className="font-mono text-2xl font-semibold tracking-[0.18em] text-slate-800 dark:text-slate-100">
          {isSeparable ? "○        ○" : "●────────●"}
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between text-xs">
          <span className="font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Concurrence
          </span>
          <span className="font-mono tabular-nums text-slate-700 dark:text-slate-200">
            {entanglement.concurrence.toFixed(2)}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-fuchsia-500 transition-[width] duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <p className="font-semibold text-slate-800 dark:text-slate-100">
          {labelFor(entanglement.classification)}
        </p>
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          {explanationFor(entanglement.classification)}
        </p>
      </div>
    </div>
  );
}
