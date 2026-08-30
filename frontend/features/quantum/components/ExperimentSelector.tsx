"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Static exported Firebase Hosting needs full document navigation for these top-level cards. */

import { ExperimentCard } from "@/features/quantum/components/ExperimentCard";
import { QUANTUM_EXPERIMENTS } from "@/features/quantum/data/experiments";
import type { QuantumExperiment } from "@/features/quantum/types";

interface ExperimentSelectorProps {
  onSelect: (experiment: QuantumExperiment) => void;
}

export function ExperimentSelector({ onSelect }: ExperimentSelectorProps) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Master&apos;s Thesis Prototype
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          Choose your quantum experiment
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          Select a quantum phenomenon and configure how it should be simulated.
          The available experiments run live against a Qiskit backend; the
          ones marked as &ldquo;coming soon&rdquo; are part of the MVP roadmap
          and will be enabled in upcoming iterations.
        </p>
      </header>

      <div
        role="list"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:gap-6"
      >
        {QUANTUM_EXPERIMENTS.map((experiment) => (
          <div role="listitem" key={experiment.id} className="h-full">
            <ExperimentCard experiment={experiment} onSelect={onSelect} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
        <a
          href="/builder"
          className="group flex flex-col gap-3 rounded-2xl border border-violet-300/70 bg-gradient-to-br from-violet-500/10 via-white to-cyan-500/10 p-6 shadow-sm transition hover:border-violet-500 hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-violet-500/40 dark:from-violet-500/15 dark:via-slate-900/40 dark:to-cyan-500/10"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-300">
              Interactive tool
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Build your own circuit
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Drag-and-drop one- and two-qubit circuits onto q0/q1 wires,
              simulate instantly and inspect amplitudes, probabilities and
              entanglement.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-violet-600 dark:bg-violet-600 dark:group-hover:bg-violet-500 sm:self-auto">
            Open the Builder
            <span aria-hidden>→</span>
          </span>
        </a>

        <a
          href="/theory"
          className="group flex flex-col gap-3 rounded-2xl border border-emerald-300/70 bg-gradient-to-br from-emerald-500/10 via-white to-sky-500/10 p-6 shadow-sm transition hover:border-emerald-500 hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/40 dark:from-emerald-500/15 dark:via-slate-900/40 dark:to-sky-500/10"
        >
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
              Theory Lab
            </p>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              Study the underlying theory
            </h2>
            <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              A curated reference for quantum information:
              formal definitions, intuitive explanations, worked examples and
              exam-style questions. Available in English and Spanish.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-emerald-600 dark:bg-emerald-600 dark:group-hover:bg-emerald-500 sm:self-auto">
            Open the Theory Lab
            <span aria-hidden>→</span>
          </span>
        </a>
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Dedicated learning labs
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            Step-by-step quantum protocols and algorithms
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
          <a
            href="/teleportation"
            className="group flex flex-col gap-3 rounded-2xl border border-fuchsia-300/70 bg-gradient-to-br from-fuchsia-500/10 via-white to-violet-500/10 p-6 shadow-sm transition hover:border-fuchsia-500 hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-fuchsia-500/40 dark:from-fuchsia-500/15 dark:via-slate-900/40 dark:to-violet-500/10"
          >
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-300">
                Quantum Teleportation Lab
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Teleport an unknown qubit
              </h2>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Explore the three-qubit protocol step by step, choose Alice&apos;s
                measurement branch and verify Bob&apos;s corrected state with
                fidelity.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-fuchsia-600 dark:bg-fuchsia-600 dark:group-hover:bg-fuchsia-500 sm:self-auto">
              Open the Lab
              <span aria-hidden>→</span>
            </span>
          </a>

          <a
            href="/grover"
            className="group flex flex-col gap-3 rounded-2xl border border-violet-300/70 bg-gradient-to-br from-violet-500/10 via-white to-amber-500/10 p-6 shadow-sm transition hover:border-violet-500 hover:shadow-md sm:flex-row sm:items-center sm:justify-between dark:border-violet-500/40 dark:from-violet-500/15 dark:via-slate-900/40 dark:to-amber-500/10"
          >
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                Quantum Algorithms Lab
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Grover&apos;s Algorithm
              </h2>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
                2 qubits — Quantum search
              </p>
              <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
                Mark a target state and watch amplitude amplification increase
                its probability step by step.
              </p>
            </div>
            <span className="inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-violet-600 dark:bg-violet-600 dark:group-hover:bg-violet-500 sm:self-auto">
              Open the Lab
              <span aria-hidden>→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
