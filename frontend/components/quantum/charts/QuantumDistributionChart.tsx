"use client";

/**
 * Composite chart that switches between the probability and counts views over
 * the same simulation result. The tab control is a plain accessible group of
 * buttons so we do not pull a tab library only for two options.
 */

import { useState } from "react";

import { CountsHistogram } from "./CountsHistogram";
import { ProbabilityHistogram } from "./ProbabilityHistogram";

type ChartView = "probabilities" | "counts";

export interface QuantumDistributionChartProps {
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  shots: number;
  highlight?: ReadonlySet<string>;
  height?: number;
}

interface TabSpec {
  id: ChartView;
  label: string;
}

const TABS: ReadonlyArray<TabSpec> = [
  { id: "probabilities", label: "Probabilities" },
  { id: "counts", label: "Counts" },
];

export function QuantumDistributionChart({
  probabilities,
  counts,
  shots,
  highlight,
  height = 280,
}: QuantumDistributionChartProps) {
  const [view, setView] = useState<ChartView>("probabilities");

  return (
    <div className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label="Distribution view"
        className="inline-flex w-fit items-center gap-1 rounded-lg border border-slate-200 bg-slate-50/60 p-0.5 text-xs dark:border-slate-800 dark:bg-slate-900/40"
      >
        {TABS.map((tab) => {
          const isActive = tab.id === view;
          return (
            <button
              key={tab.id}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setView(tab.id)}
              className={[
                "rounded-md px-3 py-1 font-medium transition-colors",
                isActive
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white/60 p-3 dark:border-slate-800 dark:bg-slate-900/40">
        {view === "probabilities" ? (
          <ProbabilityHistogram
            probabilities={probabilities}
            counts={counts}
            highlight={highlight}
            height={height}
          />
        ) : (
          <CountsHistogram
            counts={counts}
            shots={shots}
            highlight={highlight}
            height={height}
          />
        )}
      </div>
    </div>
  );
}
