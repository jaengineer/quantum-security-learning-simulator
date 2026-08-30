import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { classifyEntanglement, concurrence } from "@/features/quantum/builder/math/quantum-state";
import {
  SEPARABLE_COMPARISON_STATE,
  getBellStateDefinition,
} from "@/features/quantum/data/bellStates";
import type { BellStateName } from "@/features/quantum/types";

interface EntanglementComparisonPanelProps {
  bellState: BellStateName;
}

function ProbabilitySummary({
  probabilities,
}: {
  probabilities: Record<string, number>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-2 text-xs">
      {Object.entries(probabilities).map(([basis, probability]) => (
        <div
          key={basis}
          className="rounded-lg bg-white/70 px-2 py-1 dark:bg-slate-950/40"
        >
          <dt className="text-slate-500 dark:text-slate-400">
            <QuantumFormula expression={`P(\\lvert ${basis}\\rangle)`} />
          </dt>
          <dd className="font-mono text-slate-800 dark:text-slate-100">
            {probability.toFixed(2)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EntanglementComparisonPanel({
  bellState,
}: EntanglementComparisonPanelProps) {
  const bellDefinition = getBellStateDefinition(bellState);
  const bellConcurrence = concurrence(bellDefinition.stateVector);
  const separableConcurrence = concurrence(SEPARABLE_COMPARISON_STATE.stateVector);

  return (
    <div className="grid gap-3 text-sm md:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
          Separable reference
        </p>
        <QuantumFormula expression={SEPARABLE_COMPARISON_STATE.formulaExpression} />
        <ProbabilitySummary probabilities={SEPARABLE_COMPARISON_STATE.probabilities} />
        <p className="font-mono text-sm text-slate-700 dark:text-slate-200">
          C = {separableConcurrence.toFixed(3)} ·{" "}
          {classifyEntanglement(separableConcurrence)}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-fuchsia-200 bg-fuchsia-50/70 p-4 dark:border-fuchsia-500/30 dark:bg-fuchsia-950/20">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-fuchsia-700 dark:text-fuchsia-200">
          Bell state
        </p>
        <QuantumFormula expression={bellDefinition.formulaExpression} />
        <ProbabilitySummary probabilities={bellDefinition.probabilities} />
        <p className="font-mono text-sm text-slate-700 dark:text-slate-200">
          C = {bellConcurrence.toFixed(3)} ·{" "}
          {classifyEntanglement(bellConcurrence)}
        </p>
      </div>

      <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 md:col-span-2">
        Concurrence is used here for pure two-qubit states. Computational-basis
        probabilities help reveal correlation patterns, but they do not by
        themselves prove or distinguish every form of entanglement.
      </p>
    </div>
  );
}
