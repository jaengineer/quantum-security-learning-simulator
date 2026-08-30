"use client";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { SimulationWorkspace } from "@/features/quantum/components/SimulationWorkspace";
import { getExperimentById } from "@/features/quantum/data/experiments";

const experiment = getExperimentById("superposition");

export default function SuperpositionPage() {
  if (!experiment) return null;

  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14">
        <SimulationWorkspace experiment={experiment} backHref="/" />
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
