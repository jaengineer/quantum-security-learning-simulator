"use client";

/**
 * Single row of the vertical evolution timeline.
 *
 * Visual contract:
 *   - Numbered circular badge on the left (colour-coded by ``kind``).
 *   - Uppercase header in the form ``Step N — Label``.
 *   - KaTeX formula rendered in display/block mode, centered, with internal
 *     ``overflow-x-auto`` so long Dirac expressions never tear the row.
 *   - Optional one-line description in muted text below the formula.
 *
 * The row is a full-width flex column with ``gap-2`` so spacing is consistent
 * regardless of whether ``description`` is provided. Padding is responsive
 * (``px-3 py-3 sm:px-4 sm:py-4``) to keep mobile compact.
 *
 * Animation: a subtle vertical fade-in with per-step stagger. ``index`` is
 * the position in the timeline (0-based). ``useReducedMotion`` short-circuits
 * the animation to a no-op when the user has the OS-level setting enabled.
 */

import { motion, useReducedMotion } from "framer-motion";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import type { EvolutionStepKind } from "@/features/quantum/data/evolution";

interface VerticalTimelineStepProps {
  index: number;
  stepNumber: number;
  label: string;
  expression: string;
  description?: string;
  kind: EvolutionStepKind;
}

const KIND_BADGE: Record<EvolutionStepKind, string> = {
  initial:
    "border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
  state:
    "border-violet-500/70 bg-violet-50 text-violet-700 dark:border-violet-400/70 dark:bg-violet-950/40 dark:text-violet-200",
  operation:
    "border-fuchsia-500/70 bg-fuchsia-50 text-fuchsia-700 dark:border-fuchsia-400/70 dark:bg-fuchsia-950/40 dark:text-fuchsia-200",
  measurement:
    "border-cyan-500/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/70 dark:bg-cyan-950/40 dark:text-cyan-200",
};

const KIND_BORDER: Record<EvolutionStepKind, string> = {
  initial: "border-slate-200 dark:border-slate-800",
  state: "border-slate-200 dark:border-slate-800",
  operation: "border-slate-200 dark:border-slate-800",
  measurement: "border-slate-200 dark:border-slate-800",
};

export function VerticalTimelineStep({
  index,
  stepNumber,
  label,
  expression,
  description,
  kind,
}: VerticalTimelineStepProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      role="listitem"
      initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduceMotion ? 0 : 0.32,
        ease: "easeOut",
        delay: reduceMotion ? 0 : index * 0.08,
      }}
      className={[
        "flex w-full flex-col gap-2",
        "rounded-xl border bg-white/80 px-3 py-3 sm:px-4 sm:py-4",
        "shadow-sm backdrop-blur",
        "dark:bg-slate-900/55",
        KIND_BORDER[kind],
      ].join(" ")}
    >
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className={[
            "inline-flex h-6 w-6 shrink-0 items-center justify-center",
            "rounded-full border text-[11px] font-semibold leading-none",
            KIND_BADGE[kind],
          ].join(" ")}
        >
          {stepNumber}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
          {`Step ${stepNumber} \u2014 ${label}`}
        </span>
      </div>

      <QuantumFormula
        expression={expression}
        displayMode="block"
        size="lg"
        compact
      />

      {description ? (
        <p className="text-center text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {description}
        </p>
      ) : null}
    </motion.div>
  );
}
