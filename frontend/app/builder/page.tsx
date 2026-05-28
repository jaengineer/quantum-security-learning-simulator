"use client";

import Link from "next/link";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { QuantumCircuitBuilder } from "@/features/quantum/builder/components/QuantumCircuitBuilder";

export default function BuilderPage() {
  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:py-14">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Interactive tool
        </p>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Quantum Circuit Builder
            </h1>
            <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
              Design, simulate and visualize single-qubit quantum circuits.
              Drag gates from the palette onto the wire, reorder or remove
              them, and watch the state evolve in real time on the Bloch
              sphere and in the step-by-step panel.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-violet-400/60 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-violet-400/50 dark:hover:text-violet-300"
          >
            <span aria-hidden>{"\u2190"}</span>
            Back to experiments
          </Link>
        </div>
      </header>

      <QuantumCircuitBuilder />

      <footer className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400">
        Simulation runs entirely in your browser (pure TypeScript, no backend
        round-trip). Single-qubit only for now &mdash; multi-qubit support is
        on the roadmap.
      </footer>
    </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
