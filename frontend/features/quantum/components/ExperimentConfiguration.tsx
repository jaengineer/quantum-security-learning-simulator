"use client";

import { Card } from "@/components/ui/Card";
import { BellSimulationForm } from "@/features/quantum/components/BellSimulationForm";
import { QubitModeSelector } from "@/features/quantum/components/QubitModeSelector";
import { SimulationForm } from "@/features/quantum/components/SimulationForm";
import type {
  BellStateName,
  QuantumExperiment,
  QuantumSimulationResult,
  QubitCount,
} from "@/features/quantum/types";

interface ExperimentConfigurationProps {
  experiment: QuantumExperiment;
  qubitCount: QubitCount;
  onQubitCountChange: (value: QubitCount) => void;
  onResult: (result: QuantumSimulationResult) => void;
  onError: (message: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
  isLoading: boolean;
  bellState?: BellStateName;
  onBellStateChange?: (bellState: BellStateName) => void;
}

export function ExperimentConfiguration({
  experiment,
  qubitCount,
  onQubitCountChange,
  onResult,
  onError,
  onLoadingChange,
  isLoading,
  bellState = "phi_plus",
  onBellStateChange,
}: ExperimentConfigurationProps) {
  return (
    <Card
      title="Configuration"
      description={`Set the parameters for the ${experiment.title} experiment.`}
    >
      <div className="flex flex-col gap-5">
        <QubitModeSelector
          experiment={experiment}
          value={qubitCount}
          onChange={onQubitCountChange}
        />

        {experiment.id === "superposition" ? (
          <SimulationForm
            onResult={onResult}
            onError={onError}
            onLoadingChange={onLoadingChange}
            isLoading={isLoading}
          />
        ) : null}

        {experiment.id === "entanglement" ? (
          <BellSimulationForm
            onResult={onResult}
            onError={onError}
            onLoadingChange={onLoadingChange}
            isLoading={isLoading}
            bellState={bellState}
            onBellStateChange={onBellStateChange ?? (() => undefined)}
          />
        ) : null}
      </div>
    </Card>
  );
}
