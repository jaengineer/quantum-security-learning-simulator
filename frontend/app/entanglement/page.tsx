"use client";

import { useState } from "react";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { SimulationWorkspace } from "@/features/quantum/components/SimulationWorkspace";
import { getExperimentById } from "@/features/quantum/data/experiments";
import type { Locale } from "@/features/theory/i18n/types";

const experiment = getExperimentById("entanglement");

export default function EntanglementPage() {
  const [locale, setLocale] = useState<Locale>("en");

  if (!experiment) return null;

  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14">
        <SimulationWorkspace
          experiment={experiment}
          backHref="/"
          locale={locale}
          onLocaleChange={setLocale}
        />
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
