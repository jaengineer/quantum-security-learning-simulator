/**
 * Semantic color mapping for the gate blocks rendered in the palette and the
 * circuit canvas. Each category groups gates with a similar mathematical role
 * so the user gets an at-a-glance taxonomy.
 *
 * The palette must be readable on light and dark themes, hence the explicit
 * dark variants.
 */

import type { GatePalette } from "@/features/quantum/builder/types";

export interface GatePaletteStyle {
  /** Solid background + border for the block. */
  block: string;
  /** Color of the label glyph. */
  label: string;
  /** Optional accent ring used when the block is being dragged. */
  ring: string;
}

export const GATE_PALETTE_STYLES: Record<GatePalette, GatePaletteStyle> = {
  hadamard: {
    block:
      "bg-violet-500/15 border-violet-500/40 dark:bg-violet-500/20 dark:border-violet-400/50",
    label: "text-violet-700 dark:text-violet-200",
    ring: "ring-violet-400/60",
  },
  pauli: {
    block:
      "bg-cyan-500/15 border-cyan-500/40 dark:bg-cyan-500/20 dark:border-cyan-400/50",
    label: "text-cyan-700 dark:text-cyan-200",
    ring: "ring-cyan-400/60",
  },
  phase: {
    block:
      "bg-amber-500/15 border-amber-500/40 dark:bg-amber-500/20 dark:border-amber-400/50",
    label: "text-amber-700 dark:text-amber-200",
    ring: "ring-amber-400/60",
  },
  rotation: {
    block:
      "bg-emerald-500/15 border-emerald-500/40 dark:bg-emerald-500/20 dark:border-emerald-400/50",
    label: "text-emerald-700 dark:text-emerald-200",
    ring: "ring-emerald-400/60",
  },
  identity: {
    block:
      "bg-slate-300/40 border-slate-400/40 dark:bg-slate-600/30 dark:border-slate-500/40",
    label: "text-slate-700 dark:text-slate-200",
    ring: "ring-slate-400/50",
  },
};
