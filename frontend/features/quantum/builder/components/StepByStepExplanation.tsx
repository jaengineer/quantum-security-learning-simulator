"use client";

/**
 * Vertical timeline that explains the circuit gate by gate.
 *
 * Mirrors the visual language of the existing
 * ``VerticalQuantumEvolutionTimeline`` (numbered badge, gradient spine,
 * KaTeX formulas, didactic description) but builds the steps dynamically
 * from the ``SimulationResult`` produced by the simulator.
 */

import { Fragment } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import { formatGateMatrixLatex } from "@/features/quantum/builder/format/formatGateMatrix";
import { getGate } from "@/features/quantum/builder/math/quantum-gates";
import type {
  SimulationResult,
  SimulationStep,
} from "@/features/quantum/builder/types";

interface StepByStepExplanationProps {
  result: SimulationResult;
}

function InitialStep({ initial }: { initial: string }) {
  return (
    <article className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <header className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-violet-600">
          0
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Initial state
        </p>
      </header>
      <QuantumFormula
        expression={`\\lvert\\psi_0\\rangle = ${initial}`}
        displayMode="block"
        size="md"
        compact
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        The qubit starts in the computational basis state.
      </p>
    </article>
  );
}

function StepCard({ step }: { step: SimulationStep }) {
  const gateDef = getGate(step.gate.id);
  const stateLatex = `\\lvert\\psi_${step.index + 1}\\rangle = ${formatDiracStateLatex(step.stateAfter)}`;
  const matrixLatex = `${gateDef.label} = ${formatGateMatrixLatex(step.matrix)}`;
  return (
    <article className="flex w-full flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm dark:border-slate-800 dark:bg-slate-900/55">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-violet-600">
            {step.index + 1}
          </span>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Apply {gateDef.longName}
          </p>
        </div>
        <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
          {`P(|0⟩)=${(step.probAfter.p0 * 100).toFixed(1)}% · P(|1⟩)=${(step.probAfter.p1 * 100).toFixed(1)}%`}
        </span>
      </header>

      <QuantumFormula
        expression={matrixLatex}
        displayMode="block"
        size="sm"
        compact
      />
      <QuantumFormula
        expression={stateLatex}
        displayMode="block"
        size="md"
        compact
      />
      <p className="text-xs text-slate-500 dark:text-slate-400">
        {step.narrative}
      </p>
    </article>
  );
}

function VerticalConnector() {
  return (
    <div
      aria-hidden
      className="ml-3 h-3 w-0.5 self-start bg-gradient-to-b from-violet-400/70 to-cyan-400/70"
    />
  );
}

export function StepByStepExplanation({ result }: StepByStepExplanationProps) {
  const { steps } = result;
  const initialLatex = formatDiracStateLatex(result.initialState);

  if (steps.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50/40 px-4 py-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-900/30 dark:text-slate-400">
        Add a gate to the circuit to see how the state evolves step by step.
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label="Quantum circuit step-by-step explanation"
      className="flex flex-col gap-1"
    >
      <InitialStep initial={initialLatex} />
      {steps.map((step) => (
        <Fragment key={step.gate.uid}>
          <VerticalConnector />
          <StepCard step={step} />
        </Fragment>
      ))}
    </div>
  );
}
