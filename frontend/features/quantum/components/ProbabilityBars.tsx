/**
 * Pure presentational component: horizontal probability bars rendered with
 * Tailwind utilities only (no external charting library, by design).
 */

import { QuantumFormula } from "@/components/quantum/QuantumFormula";

interface ProbabilityBarsProps {
  probabilities: Record<string, number>;
  counts: Record<string, number>;
}

export function ProbabilityBars({ probabilities, counts }: ProbabilityBarsProps) {
  const entries = Object.keys(probabilities).sort();

  return (
    <ul className="flex flex-col gap-3">
      {entries.map((key) => {
        const probability = probabilities[key] ?? 0;
        const percent = Math.max(0, Math.min(100, probability * 100));
        const count = counts[key] ?? 0;
        return (
          <li key={key} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-sm">
              <span className="text-slate-700 dark:text-slate-200">
                <QuantumFormula
                  expression={`\\lvert ${key}\\rangle`}
                  ariaLabel={`State ket ${key}`}
                />
              </span>
              <span className="font-mono text-slate-600 dark:text-slate-400">
                {percent.toFixed(2)}%{" "}
                <span className="text-slate-400 dark:text-slate-500">
                  ({count.toLocaleString()} counts)
                </span>
              </span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={Number(percent.toFixed(2))}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Probability of state |${key}>`}
              className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            >
              <div
                className="h-full rounded-full bg-slate-900 transition-[width] duration-500 dark:bg-slate-100"
                style={{ width: `${percent}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
