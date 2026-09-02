"use client";

import { motion } from "framer-motion";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { ExperimentSelector } from "@/features/quantum/components/ExperimentSelector";
import {
  HomeAbout,
  HomeFooter,
  HomeHero,
  HomeLearningPath,
  HomeMethodology,
  HomeValuePropositions,
} from "@/features/quantum/components/home/HomeLandingSections";
import { useLocale } from "@/features/theory/i18n/LocaleContext";

export default function HomePage() {
  const { locale } = useLocale();
  const showBackendEndpoint = process.env.NODE_ENV === "development";

  return (
    <LearnableTooltipProvider>
      <main
        id="main-content"
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-8 sm:py-10"
      >
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-8"
        >
          <HomeHero locale={locale} />
          <HomeValuePropositions locale={locale} />
          <ExperimentSelector locale={locale} />
          <HomeMethodology locale={locale} />
          <HomeLearningPath locale={locale} />
          <HomeAbout locale={locale} />
        </motion.div>

        {showBackendEndpoint ? (
          <footer className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400">
            Backend endpoint:{" "}
            <code>{process.env.NEXT_PUBLIC_QUANTUM_API_URL ?? "(not set)"}</code>
          </footer>
        ) : null}
        <HomeFooter locale={locale} />
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
