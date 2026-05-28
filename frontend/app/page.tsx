"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { ExperimentSelector } from "@/features/quantum/components/ExperimentSelector";
import { SimulationWorkspace } from "@/features/quantum/components/SimulationWorkspace";
import type { QuantumExperiment } from "@/features/quantum/types";

export default function HomePage() {
  const [activeExperiment, setActiveExperiment] =
    useState<QuantumExperiment | null>(null);

  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14">
        <AnimatePresence mode="wait" initial={false}>
          {activeExperiment ? (
            <motion.div
              key={`workspace-${activeExperiment.id}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <SimulationWorkspace
                experiment={activeExperiment}
                onBack={() => setActiveExperiment(null)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <ExperimentSelector onSelect={setActiveExperiment} />
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400">
          Backend endpoint:{" "}
          <code>{process.env.NEXT_PUBLIC_QUANTUM_API_URL ?? "(not set)"}</code>
        </footer>
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
