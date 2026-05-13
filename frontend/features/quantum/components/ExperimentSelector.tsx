"use client";

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
    </section>
  );
}
