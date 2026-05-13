"use client";

import type { QuantumExperiment, QubitCount } from "@/features/quantum/types";

interface QubitModeSelectorProps {
  experiment: QuantumExperiment;
  value: QubitCount;
  onChange: (value: QubitCount) => void;
}

/**
 * Visual indicator (and, where applicable, selector) of the qubit count of
 * the active experiment. For fixed-qubit experiments the control is
 * informational; for the future "1-2" experiments (e.g. Ideal vs Noisy) the
 * user will be able to switch between 1 and 2 qubits.
 */
export function QubitModeSelector({
  experiment,
  value,
  onChange,
}: QubitModeSelectorProps) {
  const isToggleable = experiment.qubits === "1-2";
  const options: QubitCount[] = isToggleable ? [1, 2] : [value];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Qubits
      </span>
      <div className="inline-flex overflow-hidden rounded-lg border border-slate-300 bg-white text-sm dark:border-slate-700 dark:bg-slate-900">
        {options.map((option) => {
          const isSelected = option === value;
          return (
            <button
              key={option}
              type="button"
              onClick={() => isToggleable && onChange(option)}
              disabled={!isToggleable}
              aria-pressed={isSelected}
              className={[
                "px-3 py-1.5 font-mono text-sm transition-colors",
                isSelected
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
                !isToggleable ? "cursor-default opacity-100" : "",
              ].join(" ")}
            >
              {option}
            </button>
          );
        })}
      </div>
      {!isToggleable ? (
        <span className="text-xs text-slate-500 dark:text-slate-400">
          (fixed for this experiment)
        </span>
      ) : null}
    </div>
  );
}
