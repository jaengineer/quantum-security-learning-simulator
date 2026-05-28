"use client";

/**
 * Composite chart that switches between the probability and counts views over
 * the same simulation result. The tab control is a plain accessible group of
 * buttons so we do not pull a tab library only for two options.
 *
 * Each tab carries a ``LearnableTooltip`` that explains the meaning of the
 * view and deep-links into the Theory Lab. We keep the tooltip on the tab
 * (a stable DOM element we control) instead of trying to anchor it to
 * Plotly's internal x-axis ticks; that gives us the same educational payoff
 * without coupling our UI to Plotly internals.
 */

import { useState } from "react";

import { LearnableTooltip } from "@/features/overlays/tooltip/LearnableTooltip";

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
  tooltipTitle: string;
  tooltipDescription: string;
  conceptId: string;
}

const TABS: ReadonlyArray<TabSpec> = [
  {
    id: "probabilities",
    label: "Probabilities",
    tooltipTitle: "Probability distribution",
    tooltipDescription:
      "Theoretical P(k) = |⟨k|ψ⟩|² for every basis state k. Sums to 1.",
    conceptId: "density-matrix",
  },
  {
    id: "counts",
    label: "Counts",
    tooltipTitle: "Measurement counts",
    tooltipDescription:
      "Empirical occurrences of each basis outcome across the simulation shots.",
    conceptId: "density-matrix",
  },
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
            <LearnableTooltip
              key={tab.id}
              title={tab.tooltipTitle}
              description={tab.tooltipDescription}
              conceptId={tab.conceptId}
              side="bottom"
            >
              <button
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
            </LearnableTooltip>
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
