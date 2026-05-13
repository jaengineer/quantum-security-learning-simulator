"use client";

import { QuantumExplanationCard } from "@/components/quantum/QuantumExplanationCard";
import { QuantumGateCard } from "@/components/quantum/QuantumGateCard";
import { EXPERIMENT_CONTENT } from "@/features/quantum/data/experimentContent";
import type { QuantumExperiment } from "@/features/quantum/types";

interface ExperimentBriefingProps {
  experiment: QuantumExperiment;
}

function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
      {children}
    </span>
  );
}

export function ExperimentBriefing({ experiment }: ExperimentBriefingProps) {
  const content = EXPERIMENT_CONTENT[experiment.id];
  const hasGates = content.gates.length > 0;
  const isComingSoon = experiment.status === "coming-soon";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <SectionLabel>Concept</SectionLabel>
        <QuantumExplanationCard
          title={content.concept.title}
          description={content.concept.description}
          formula={content.concept.formula}
          interpretation={content.concept.takeaway}
        />
      </div>

      {hasGates ? (
        <div className="flex flex-col gap-2">
          <SectionLabel>Mathematical representation</SectionLabel>
          <div className="flex flex-col gap-3">
            {content.gates.map((gate) => (
              <QuantumGateCard
                key={gate.name}
                name={gate.name}
                matrix={gate.matrix}
                physicalEffect={gate.physicalEffect}
                example={gate.example}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <SectionLabel>Physical interpretation</SectionLabel>
        <QuantumExplanationCard
          title={content.physicalInterpretation.title}
          description={content.physicalInterpretation.description}
          formula={content.physicalInterpretation.keyFormula}
        />
      </div>

      {isComingSoon ? (
        <p className="text-xs italic text-slate-500 dark:text-slate-400">
          This module is part of the MVP roadmap and is shown for reference.
          Running it from the UI will be enabled in an upcoming iteration.
        </p>
      ) : null}
    </div>
  );
}
