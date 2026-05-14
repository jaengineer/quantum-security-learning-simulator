import { VerticalQuantumEvolutionTimeline } from "@/components/quantum/animation/VerticalQuantumEvolutionTimeline";
import { QuantumDistributionChart } from "@/components/quantum/charts/QuantumDistributionChart";
import { QuantumCircuitCanvas } from "@/components/quantum/circuit/QuantumCircuitCanvas";
import type { CircuitVisualMode } from "@/components/quantum/circuit/QuantumCircuitCanvas";
import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import { ProbabilityBars } from "@/features/quantum/components/ProbabilityBars";
import { QuantumStateEvolution } from "@/features/quantum/components/QuantumStateEvolution";
import type {
  ExperimentType,
  QuantumExperiment,
  QuantumSimulationResult,
} from "@/features/quantum/types";

interface SimulationResultsProps {
  experiment: QuantumExperiment;
  result: QuantumSimulationResult;
  isRunning?: boolean;
  visualMode?: CircuitVisualMode;
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

function EntanglementInterpretation() {
  return (
    <ul className="flex flex-col gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      <li className="flex flex-wrap items-baseline gap-2">
        <span className="font-medium">Prepared Bell state:</span>
        <QuantumFormula expression="\lvert \Phi^{+}\rangle = \tfrac{1}{\sqrt{2}}\bigl(\lvert 00\rangle + \lvert 11\rangle\bigr)" />
      </li>
      <li>
        Measurement only ever yields{" "}
        <QuantumFormula expression="\lvert 00\rangle" /> or{" "}
        <QuantumFormula expression="\lvert 11\rangle" />; in an ideal
        simulator the outcomes <QuantumFormula expression="\lvert 01\rangle" />{" "}
        and <QuantumFormula expression="\lvert 10\rangle" /> have zero
        probability.
      </li>
      <li>
        The two qubits are <span className="font-medium">perfectly correlated</span>
        : measuring one immediately fixes the value of the other.
      </li>
    </ul>
  );
}

const BELL_HIGHLIGHT: ReadonlySet<string> = new Set(["00", "11"]);

export function SimulationResults({
  experiment,
  result,
  isRunning = false,
  visualMode = "advanced",
}: SimulationResultsProps) {
  const variant = resolveVariant(experiment.id, result);
  const initialState = result.initial_state ?? "0";
  const highlight = variant === "bell" ? BELL_HIGHLIGHT : undefined;

  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <SectionTitle>Circuit</SectionTitle>
        <QuantumCircuitCanvas
          variant={variant}
          initialState={initialState}
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
          />
        ) : (
          <VerticalQuantumEvolutionTimeline
            experimentId={experiment.id}
            initialState={initialState}
          />
        )}
      </section>

      {visualMode === "simple" ? (
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-3">
            <SectionTitle>
              {`Counts (this run, ${result.shots.toLocaleString()} shots)`}
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
                      {(result.counts[key] ?? 0).toLocaleString()}
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
            {`Measurement distribution (${result.shots.toLocaleString()} shots)`}
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
          <EntanglementInterpretation />
        ) : (
          <SuperpositionInterpretation initialState={initialState} />
        )}
      </section>
    </div>
  );
}
