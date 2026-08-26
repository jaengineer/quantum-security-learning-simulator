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
  MeasurementProbabilities,
  Probabilities,
  QubitCount,
  SimulationResult,
  SimulationStep,
  TwoQubitProbabilities,
} from "@/features/quantum/builder/types";

interface StepByStepExplanationProps {
  result: SimulationResult;
}

function isSingleQubitProbabilities(
  probabilities: MeasurementProbabilities
): probabilities is Probabilities {
  return "p0" in probabilities;
}

function isTwoQubitProbabilities(
  probabilities: MeasurementProbabilities
): probabilities is TwoQubitProbabilities {
  return "p00" in probabilities;
}

function probabilitySummary(probabilities: MeasurementProbabilities): string {
  if (isSingleQubitProbabilities(probabilities)) {
    return `P(|0⟩)=${(probabilities.p0 * 100).toFixed(1)}% · P(|1⟩)=${(
      probabilities.p1 * 100
    ).toFixed(1)}%`;
  }

  if (isTwoQubitProbabilities(probabilities)) {
    return `P(|00⟩)=${(probabilities.p00 * 100).toFixed(1)}% · P(|01⟩)=${(
      probabilities.p01 * 100
    ).toFixed(1)}% · P(|10⟩)=${(probabilities.p10 * 100).toFixed(1)}% · P(|11⟩)=${(
      probabilities.p11 * 100
    ).toFixed(1)}%`;
  }

  return "";
}

function InitialStep({
  initial,
  qubitCount,
}: {
  initial: string;
  qubitCount: QubitCount;
}) {
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
        {qubitCount === 1
          ? "The qubit starts in the computational basis state."
          : "The two-qubit register starts in |00⟩."}
      </p>
    </article>
  );
}

function StepCard({
  step,
  qubitCount,
  isBellPreset,
}: {
  step: SimulationStep;
  qubitCount: QubitCount;
  isBellPreset: boolean;
}) {
  const gateDef = getGate(step.gate.gateId);
  const stateLatex = `\\lvert\\psi_${step.index + 1}\\rangle = ${formatDiracStateLatex(step.stateAfter)}`;
  const matrixLatex = step.matrix && step.matrix.length === 4
    ? `${gateDef.label} = ${formatGateMatrixLatex(step.matrix)}`
    : gateDef.latex;
  const narrative =
    qubitCount === 2 && step.gate.gateId === "H"
      ? "H applies to q0, mixing the q0=0 and q0=1 amplitudes while q1 follows along."
      : qubitCount === 2 && step.gate.gateId === "CNOT"
        ? isBellPreset
          ? "CNOT uses q0 as control and flips q1 on the |10⟩ branch, entangling the two qubits."
          : "CNOT uses q0 as control and flips q1 whenever the q0 bit is 1."
        : step.narrative;
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
          {probabilitySummary(step.probAfter)}
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
        {narrative}
      </p>
    </article>
  );
}

function isBellPhiPlus(result: SimulationResult): boolean {
  return (
    result.qubitCount === 2 &&
    result.steps.length === 2 &&
    result.steps[0]?.gate.gateId === "H" &&
    result.steps[1]?.gate.gateId === "CNOT"
  );
}

function BellStateCallout() {
  return (
    <>
      <VerticalConnector />
      <article className="flex w-full flex-col gap-2 rounded-xl border border-fuchsia-200 bg-fuchsia-500/10 px-4 py-3 shadow-sm dark:border-fuchsia-500/40 dark:bg-fuchsia-500/10">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-200">
          Final Bell state
        </p>
        <QuantumFormula
          expression="\\lvert\\Phi^+\\rangle = \\tfrac{\\lvert 00\\rangle + \\lvert 11\\rangle}{\\sqrt{2}}"
          displayMode="block"
          size="md"
          compact
        />
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The H gate creates two branches, and CNOT correlates q1 with q0. The
          final state is entangled: measurement returns |00⟩ or |11⟩ with equal
          probability.
        </p>
      </article>
    </>
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
  const isBellPreset = isBellPhiPlus(result);

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
      <InitialStep initial={initialLatex} qubitCount={result.qubitCount} />
      {steps.map((step) => (
        <Fragment key={step.gate.id}>
          <VerticalConnector />
          <StepCard
            step={step}
            qubitCount={result.qubitCount}
            isBellPreset={isBellPreset}
          />
        </Fragment>
      ))}
      {isBellPreset ? <BellStateCallout /> : null}
    </div>
  );
}
