"use client";

/**
 * Vertical timeline of the quantum-state evolution.
 *
 * Replaces the previous horizontal scrollable timeline. The vertical layout
 * always uses the full panel width and never introduces horizontal scroll on
 * the container; only individual formulas scroll horizontally if they are
 * wider than the available content area.
 *
 * Visual anatomy:
 *   1. Outer card with a subtle gradient background and a 3px gradient spine
 *      pinned to the left edge (cyan → violet → fuchsia). The spine acts as
 *      a discreet visual rail tying the numbered badges together.
 *   2. Vertical list. Each entry is a ``VerticalTimelineStep``; consecutive
 *      steps are separated by a ``VerticalTimelineConnector`` showing the
 *      operation that produces the next state.
 *
 * The component is thin on purpose: data shaping lives in
 * ``buildEvolutionSteps`` and per-row presentation lives in the dedicated
 * sub-components, so this file only handles the orchestration.
 */

import { Fragment } from "react";

import { buildEvolutionSteps } from "@/features/quantum/data/evolution";
import type {
  ExperimentType,
  InitialState,
} from "@/features/quantum/types";

import { VerticalTimelineConnector } from "./VerticalTimelineConnector";
import { VerticalTimelineStep } from "./VerticalTimelineStep";

interface VerticalQuantumEvolutionTimelineProps {
  experimentId: ExperimentType;
  initialState?: InitialState | string;
}

export function VerticalQuantumEvolutionTimeline({
  experimentId,
  initialState = "0",
}: VerticalQuantumEvolutionTimelineProps) {
  const steps = buildEvolutionSteps(experimentId, initialState);
  if (!steps) return null;

  return (
    <div
      className={[
        "relative w-full overflow-hidden rounded-2xl border",
        "border-slate-200 bg-slate-50/50",
        "dark:border-slate-800 dark:bg-slate-900/30",
      ].join(" ")}
    >
      <span
        aria-hidden
        className={[
          "pointer-events-none absolute inset-y-4 left-0 w-[3px]",
          "rounded-r-full",
          "bg-gradient-to-b from-cyan-400/80 via-violet-400/80 to-fuchsia-400/80",
          "dark:from-cyan-500/70 dark:via-violet-500/70 dark:to-fuchsia-500/70",
        ].join(" ")}
      />

      <div
        role="list"
        aria-label="Quantum state evolution timeline"
        className="flex flex-col gap-1 p-3 pl-4 sm:p-4 sm:pl-5"
      >
        {steps.map((step, index) => (
          <Fragment key={step.id}>
            {step.operationFromPrevious ? (
              <VerticalTimelineConnector
                operationLabel={step.operationFromPrevious}
              />
            ) : null}
            <VerticalTimelineStep
              index={index}
              stepNumber={index + 1}
              label={step.label}
              expression={step.expression}
              description={step.description}
              kind={step.kind}
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
