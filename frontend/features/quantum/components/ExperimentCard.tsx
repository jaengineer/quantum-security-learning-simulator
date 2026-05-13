"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/Button";
import type { QuantumExperiment } from "@/features/quantum/types";

interface ExperimentCardProps {
  experiment: QuantumExperiment;
  onSelect: (experiment: QuantumExperiment) => void;
}

function StatusBadge({ status }: { status: QuantumExperiment["status"] }) {
  const isAvailable = status === "available";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        isAvailable
          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
          : "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200",
      ].join(" ")}
    >
      {isAvailable ? "Available" : "Coming soon"}
    </span>
  );
}

function QubitsBadge({ qubits }: { qubits: QuantumExperiment["qubits"] }) {
  const label = typeof qubits === "number" ? `${qubits} qubit${qubits > 1 ? "s" : ""}` : `${qubits} qubits`;
  return (
    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-200">
      {label}
    </span>
  );
}

export function ExperimentCard({ experiment, onSelect }: ExperimentCardProps) {
  const isAvailable = experiment.status === "available";

  return (
    <motion.article
      data-disabled={!isAvailable ? "true" : undefined}
      whileHover={isAvailable ? { y: -2 } : undefined}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={[
        "group relative flex h-full flex-col gap-4 rounded-2xl border p-6 shadow-sm",
        isAvailable
          ? "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900/70 dark:hover:border-slate-700"
          : "border-dashed border-slate-300 bg-slate-50/60 opacity-90 dark:border-slate-700 dark:bg-slate-900/30",
      ].join(" ")}
    >
      <header className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {experiment.title}
          </h3>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {experiment.subtitle}
          </p>
        </div>
        <StatusBadge status={experiment.status} />
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <QubitsBadge qubits={experiment.qubits} />
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300">
        {experiment.description}
      </p>

      <p className="text-xs italic text-slate-500 dark:text-slate-400">
        Learning goal: {experiment.learningGoal}
      </p>

      <div className="mt-auto pt-2">
        <Button
          type="button"
          onClick={() => isAvailable && onSelect(experiment)}
          disabled={!isAvailable}
          aria-disabled={!isAvailable}
          className="w-full"
        >
          {isAvailable ? "Start experiment" : "Available in a future iteration"}
        </Button>
      </div>
    </motion.article>
  );
}
