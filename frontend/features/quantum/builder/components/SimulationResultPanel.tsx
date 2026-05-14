"use client";

/**
 * Aggregated numeric results panel: final state, probabilities, circuit
 * unitary and Bloch coordinates. Pure presentation, receives a precomputed
 * ``SimulationResult`` so it can be unit-tested in isolation.
 */

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import { formatGateMatrixLatex } from "@/features/quantum/builder/format/formatGateMatrix";
import type { SimulationResult } from "@/features/quantum/builder/types";

interface SimulationResultPanelProps {
  result: SimulationResult;
}

function PercentBar({
  value,
  label,
  accent,
}: {
  value: number;
  label: string;
  accent: string;
}) {
  const percent = Math.round(value * 1000) / 10;
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
          {label}
        </span>
        <span className="tabular-nums text-slate-600 dark:text-slate-300">
          {percent.toFixed(1)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
        <div
          className={["h-full rounded-full transition-[width] duration-300", accent].join(" ")}
          style={{ width: `${Math.max(2, percent)}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white/80 p-3 dark:border-slate-800 dark:bg-slate-900/45">
      <h3 className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function SimulationResultPanel({ result }: SimulationResultPanelProps) {
  const { finalState, finalProbabilities, finalUnitary, finalBloch } = result;

  const stateLatex = `\\lvert\\psi\\rangle = ${formatDiracStateLatex(finalState)}`;
  const unitaryLatex = `U = ${formatGateMatrixLatex(finalUnitary)}`;

  return (
    <section className="grid gap-3 sm:grid-cols-2">
      <Section title="Final state (Dirac)">
        <QuantumFormula
          expression={stateLatex}
          displayMode="block"
          size="md"
          compact
        />
      </Section>

      <Section title="Measurement probabilities">
        <div className="flex flex-col gap-2">
          <PercentBar
            label="P(|0⟩)"
            value={finalProbabilities.p0}
            accent="bg-cyan-500"
          />
          <PercentBar
            label="P(|1⟩)"
            value={finalProbabilities.p1}
            accent="bg-violet-500"
          />
        </div>
      </Section>

      <Section title="Circuit unitary">
        <QuantumFormula
          expression={unitaryLatex}
          displayMode="block"
          size="md"
          compact
        />
      </Section>

      <Section title="Bloch coordinates">
        <p className="font-mono text-sm tabular-nums text-slate-700 dark:text-slate-200">
          (x, y, z) = ({finalBloch.x.toFixed(3)}, {finalBloch.y.toFixed(3)},{" "}
          {finalBloch.z.toFixed(3)})
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          x = 2 Re(α*β), y = 2 Im(α*β), z = |α|² − |β|²
        </p>
      </Section>
    </section>
  );
}
