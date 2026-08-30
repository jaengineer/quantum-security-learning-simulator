"use client";

import { motion } from "framer-motion";
import { useState } from "react";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { ExperimentSelector } from "@/features/quantum/components/ExperimentSelector";
import type { Locale } from "@/features/theory/i18n/types";

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>("en");
  const showBackendEndpoint = process.env.NODE_ENV === "development";

  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-10 sm:py-14">
        <motion.div
          key="landing"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ExperimentSelector locale={locale} onLocaleChange={setLocale} />
        </motion.div>

        {showBackendEndpoint ? (
          <footer className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400">
            Backend endpoint:{" "}
            <code>{process.env.NEXT_PUBLIC_QUANTUM_API_URL ?? "(not set)"}</code>
          </footer>
        ) : null}
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
