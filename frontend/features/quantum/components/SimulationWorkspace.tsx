"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { Card } from "@/components/ui/Card";
import { ExperimentBriefing } from "@/features/quantum/components/ExperimentBriefing";
import { ExperimentConfiguration } from "@/features/quantum/components/ExperimentConfiguration";
import { SimulationResults } from "@/features/quantum/components/SimulationResults";
import type {
  QuantumExperiment,
  QuantumSimulationResult,
  QubitCount,
} from "@/features/quantum/types";

interface SimulationWorkspaceProps {
  experiment: QuantumExperiment;
  onBack: () => void;
}

function resolveInitialQubits(experiment: QuantumExperiment): QubitCount {
  if (experiment.qubits === "1-2") return 1;
  return experiment.qubits;
}

/**
 * Rendered with `key={experiment.id}` from the parent so React remounts the
 * workspace whenever the active experiment changes. That keeps all internal
 * state local and avoids prop-driven `useEffect` resets.
 */
export function SimulationWorkspace({
  experiment,
  onBack,
}: SimulationWorkspaceProps) {
  const [qubitCount, setQubitCount] = useState<QubitCount>(() =>
    resolveInitialQubits(experiment)
  );
  const [result, setResult] = useState<QuantumSimulationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <section className="flex flex-col gap-6">
      <nav className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
        >
          <span aria-hidden>{"\u2190"}</span>
          Back to experiments
        </button>
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          {experiment.subtitle}
        </span>
      </nav>

      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
          {experiment.title}
        </h1>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {experiment.description}
        </p>
        <p className="max-w-3xl text-sm italic text-slate-500 dark:text-slate-400">
          {experiment.learningGoal}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <aside className="flex flex-col gap-3 lg:sticky lg:top-6 lg:self-start">
          <ExperimentBriefing experiment={experiment} />
        </aside>

        <div className="flex flex-col gap-5">
          <ExperimentConfiguration
            experiment={experiment}
            qubitCount={qubitCount}
            onQubitCountChange={setQubitCount}
            onResult={setResult}
            onError={setErrorMessage}
            onLoadingChange={setIsLoading}
            isLoading={isLoading}
          />

          <AnimatePresence mode="wait" initial={false}>
            {errorMessage ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Card
                  title="Error"
                  description="The simulation could not be executed."
                  className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40"
                >
                  <p className="text-sm text-red-800 dark:text-red-200">
                    {errorMessage}
                  </p>
                </Card>
              </motion.div>
            ) : null}

            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                <Card
                  title="Running simulation"
                  description={
                    "Submitting the circuit to the Qiskit backend\u2026"
                  }
                >
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <span
                      aria-hidden
                      className="inline-block h-3 w-3 animate-pulse rounded-full bg-slate-400 dark:bg-slate-500"
                    />
                    {"Please wait\u2026"}
                  </div>
                </Card>
              </motion.div>
            ) : null}

            {result && !isLoading && !errorMessage ? (
              <motion.div
                key={`result-${result.circuit}-${result.shots}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <Card
                  title="Experimental results"
                  description={`Circuit: ${result.circuit} \u2014 ${result.shots.toLocaleString()} shots${
                    result.simulator
                      ? ` \u2014 simulator: ${result.simulator}`
                      : ""
                  }${
                    typeof result.execution_time_ms === "number"
                      ? ` \u2014 ${result.execution_time_ms.toFixed(2)} ms`
                      : ""
                  }.`}
                >
                  <SimulationResults experiment={experiment} result={result} />
                </Card>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
