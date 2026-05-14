"use client";

/**
 * Collapsible legend that maps every symbol in the visual circuit diagram to
 * its textbook meaning. Rendered under the canvas so the user can decode the
 * diagram without leaving the workspace.
 */

import type { ReactNode } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";

interface LegendItem {
  symbol: ReactNode;
  name: string;
  description: string;
}

function HSymbol() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-violet-500/70 bg-violet-50 font-mono text-xs font-semibold text-violet-700 dark:border-violet-400/70 dark:bg-violet-950/40 dark:text-violet-200">
      H
    </span>
  );
}

function XSymbol() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-cyan-500/70 bg-cyan-50 font-mono text-xs font-semibold text-cyan-800 dark:border-cyan-400/70 dark:bg-cyan-950/40 dark:text-cyan-200">
      X
    </span>
  );
}

function ControlSymbol() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center">
      <span className="block h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-slate-100" />
    </span>
  );
}

function TargetSymbol() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-slate-900 dark:text-slate-100"
      aria-hidden
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
    </svg>
  );
}

function MeasurementSymbol() {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-slate-400 bg-white dark:border-slate-500 dark:bg-slate-900">
      <svg
        viewBox="0 0 24 24"
        className="h-3.5 w-3.5 text-slate-700 dark:text-slate-100"
        aria-hidden
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M4 18 A 8 8 0 0 1 20 18" />
        <line x1="12" y1="18" x2="17" y2="9" />
      </svg>
    </span>
  );
}

const LEGEND: ReadonlyArray<LegendItem> = [
  {
    symbol: <HSymbol />,
    name: "Hadamard gate",
    description: "Creates an equal superposition from a basis state.",
  },
  {
    symbol: <XSymbol />,
    name: "Pauli-X gate",
    description: "Bit-flip: maps |0⟩ to |1⟩ and vice versa.",
  },
  {
    symbol: <ControlSymbol />,
    name: "Control qubit",
    description: "Triggers the conditional gate on the connected target wire.",
  },
  {
    symbol: <TargetSymbol />,
    name: "CNOT target (⊕)",
    description: "Receives an X flip when the control qubit is |1⟩.",
  },
  {
    symbol: <MeasurementSymbol />,
    name: "Measurement",
    description: "Collapses the qubit into a classical bit (basis-state outcome).",
  },
];

export function QuantumCircuitLegend() {
  return (
    <details className="group">
      <summary
        className={[
          "inline-flex cursor-pointer select-none items-center gap-1.5 text-xs font-medium",
          "text-slate-600 transition-colors hover:text-slate-900",
          "dark:text-slate-300 dark:hover:text-slate-100",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="transition-transform duration-200 group-open:rotate-90"
        >
          {"\u25B8"}
        </span>
        Legend
      </summary>
      <dl className="mt-3 grid gap-2 sm:grid-cols-2">
        {LEGEND.map((item) => (
          <div
            key={item.name}
            className="flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50/60 px-2.5 py-2 text-xs dark:border-slate-800 dark:bg-slate-900/40"
          >
            <dt className="mt-0.5 shrink-0">{item.symbol}</dt>
            <dd className="flex flex-col gap-0.5">
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {item.name}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {item.description}
              </span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-[11px] text-slate-500 dark:text-slate-400">
        Bell state{" "}
        <QuantumFormula expression="\lvert \Phi^{+}\rangle = \tfrac{1}{\sqrt{2}}\bigl(\lvert 00\rangle + \lvert 11\rangle\bigr)" />{" "}
        is prepared by H on q0 followed by CNOT(q0, q1).
      </p>
    </details>
  );
}
