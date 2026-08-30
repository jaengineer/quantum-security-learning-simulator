import { VerticalQuantumEvolutionTimeline } from "@/components/quantum/animation/VerticalQuantumEvolutionTimeline";
import { QuantumDistributionChart } from "@/components/quantum/charts/QuantumDistributionChart";
import { QuantumCircuitCanvas } from "@/components/quantum/circuit/QuantumCircuitCanvas";
import type { CircuitVisualMode } from "@/components/quantum/circuit/QuantumCircuitCanvas";
import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { EntanglementPanel } from "@/features/quantum/builder/components/EntanglementPanel";
import { classifyEntanglement, concurrence } from "@/features/quantum/builder/math/quantum-state";
import { EntanglementComparisonPanel } from "@/features/quantum/components/EntanglementComparisonPanel";
import { ProbabilityBars } from "@/features/quantum/components/ProbabilityBars";
import { QuantumStateEvolution } from "@/features/quantum/components/QuantumStateEvolution";
import { getBellStateDefinition } from "@/features/quantum/data/bellStates";
import { formatStableInteger } from "@/features/quantum/utils/format";
import type {
  BellStateName,
  ExperimentType,
  QuantumExperiment,
  QuantumSimulationResult,
} from "@/features/quantum/types";

interface SimulationResultsProps {
  experiment: QuantumExperiment;
  result: QuantumSimulationResult;
  isRunning?: boolean;
  visualMode?: CircuitVisualMode;
  bellState?: BellStateName;
}

function resolveVariant(
  experimentId: ExperimentType,
  result: QuantumSimulationResult
): "hadamard" | "bell" {
  if (experimentId === "entanglement") return "bell";
  if (result.circuit === "bell-state") return "bell";
  return "hadamard";
}

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
      {children}
    </h3>
  );
}

function SuperpositionInterpretation({
  initialState,
}: {
  initialState: string;
}) {
  const sign = initialState === "1" ? "-" : "+";
  return (
    <ul className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <li className="flex flex-wrap items-baseline gap-2">
        <span className="font-medium">Action of H:</span>
        <QuantumFormula
          expression={`H\\lvert ${initialState}\\rangle = \\tfrac{1}{\\sqrt{2}}\\bigl(\\lvert 0\\rangle ${sign} \\lvert 1\\rangle\\bigr)`}
        />
      </li>
      <li>
        Measuring in the computational basis yields{" "}
        <QuantumFormula expression="\lvert 0\rangle" /> or{" "}
        <QuantumFormula expression="\lvert 1\rangle" /> with probability{" "}
        <QuantumFormula expression="\tfrac{1}{2}" /> each. The exact 50/50
        ratio emerges only as the number of shots grows.
      </li>
      <li>
        <span className="font-medium">Counts vs probabilities:</span> counts
        are integer occurrences in this run; probabilities are{" "}
        <QuantumFormula expression="\text{counts} / \text{shots}" /> and so
        differ slightly from <QuantumFormula expression="0.5" /> unless the
        run splits exactly evenly.
      </li>
    </ul>
  );
}

function EntanglementInterpretation({
  bellState,
}: {
  bellState: BellStateName;
}) {
  const definition = getBellStateDefinition(bellState);
  const sameProbabilitiesNote =
    bellState === "phi_minus"
      ? "Φ− has the same computational-basis probabilities as Φ+, but the |11⟩ branch has the opposite phase."
      : bellState === "psi_minus"
        ? "Ψ− has the same computational-basis probabilities as Ψ+, but the |10⟩ branch has the opposite phase."
        : "The plus/minus partner can share these measurement probabilities while differing by relative phase.";

  return (
    <ul className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <li className="flex flex-wrap items-baseline gap-2">
        <span className="font-medium">Prepared Bell state:</span>
        <QuantumFormula
          expression={`\\lvert ${definition.labelExpression}\\rangle = ${definition.formulaExpression}`}
        />
      </li>
      <li>
        {definition.measurementDescription}
      </li>
      <li>
        The two qubits are{" "}
        <span className="font-medium">
          {definition.correlationClass === "same-bit"
            ? "perfectly correlated"
            : "perfectly anti-correlated"}
        </span>
        : measuring one fixes the expected value of the other.
      </li>
      <li>
        <span className="font-medium">Relative phase:</span>{" "}
        {definition.phaseDescription} {sameProbabilitiesNote}
      </li>
    </ul>
  );
}

export function SimulationResults({
  experiment,
  result,
  isRunning = false,
  visualMode = "advanced",
  bellState,
}: SimulationResultsProps) {
  const variant = resolveVariant(experiment.id, result);
  const initialState = result.initial_state ?? "0";
  const resolvedBellState = getBellStateDefinition(
    result.bell_state ?? bellState
  ).id;
  const bellDefinition = getBellStateDefinition(resolvedBellState);
  const entanglementValue = concurrence(bellDefinition.stateVector);
  const highlight =
    variant === "bell" ? new Set(bellDefinition.highlightedOutcomes) : undefined;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <SectionTitle>Circuit</SectionTitle>
        <QuantumCircuitCanvas
          variant={variant}
          initialState={initialState}
          bellState={resolvedBellState}
          isRunning={isRunning}
          visualMode={visualMode}
        />
      </section>

      <section className="flex flex-col gap-2">
        <SectionTitle>Quantum state evolution</SectionTitle>
        {visualMode === "simple" ? (
          <QuantumStateEvolution
            experimentId={experiment.id}
            initialState={initialState}
            bellState={resolvedBellState}
          />
        ) : (
          <VerticalQuantumEvolutionTimeline
            experimentId={experiment.id}
            initialState={initialState}
            bellState={resolvedBellState}
          />
        )}
      </section>

      {visualMode === "simple" ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionTitle>
              {`Counts (this run, ${formatStableInteger(result.shots)} shots)`}
            </SectionTitle>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              {Object.keys(result.counts)
                .sort()
                .map((key) => (
                  <div
                    key={key}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <dt className="text-slate-500 dark:text-slate-400">
                      <QuantumFormula expression={`\\lvert ${key}\\rangle`} />
                    </dt>
                    <dd className="font-mono text-base text-slate-900 dark:text-slate-100">
                      {formatStableInteger(result.counts[key] ?? 0)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          <div className="flex flex-col gap-3">
            <SectionTitle>Probabilities (counts / shots)</SectionTitle>
            <ProbabilityBars
              probabilities={result.probabilities}
              counts={result.counts}
            />
          </div>
        </section>
      ) : (
        <section className="flex flex-col gap-3">
          <SectionTitle>
            {`Measurement distribution (${formatStableInteger(
              result.shots
            )} shots)`}
          </SectionTitle>
          <QuantumDistributionChart
            probabilities={result.probabilities}
            counts={result.counts}
            shots={result.shots}
            highlight={highlight}
          />
        </section>
      )}

      <section className="flex flex-col gap-2">
        <SectionTitle>Experimental interpretation</SectionTitle>
        {variant === "bell" ? (
          <EntanglementInterpretation bellState={resolvedBellState} />
        ) : (
          <SuperpositionInterpretation initialState={initialState} />
        )}
      </section>

      {variant === "bell" ? (
        <section className="flex flex-col gap-3">
          <SectionTitle>Entanglement indicator</SectionTitle>
          <EntanglementPanel
            entanglement={{
              concurrence: entanglementValue,
              classification: classifyEntanglement(entanglementValue),
            }}
          />
          <EntanglementComparisonPanel bellState={resolvedBellState} />
        </section>
      ) : null}
    </div>
  );
}
