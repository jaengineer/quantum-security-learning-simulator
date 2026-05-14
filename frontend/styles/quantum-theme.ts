/**
 * Quantum visual design system (TypeScript token mirror).
 *
 * This module is the single TS-side source of truth for colors, motion and
 * spacing constants used by JavaScript consumers (Framer Motion variants,
 * Plotly layouts, three.js materials). The CSS variables in
 * ``app/globals.css`` mirror these values so Tailwind utilities can use them
 * directly via ``var(--color-quantum-*)``. Whenever you tweak a value here,
 * mirror it in ``globals.css`` (and vice-versa) to keep them in sync.
 */

/* ------------------------------------------------------------------ */
/* Core palette                                                        */
/* ------------------------------------------------------------------ */

export const QUANTUM_COLORS = {
  deepQuantumBlue: "#0b1e3f",
  darkNavy: "#020617",
  quantumCyan: "#22d3ee",
  quantumCyanDim: "#67e8f9",
  quantumViolet: "#7c3aed",
  quantumVioletDim: "#a78bfa",
  scientificGraySoft: "#94a3b8",
  scientificGrayDeep: "#1e293b",
} as const;

/* ------------------------------------------------------------------ */
/* Semantic states                                                     */
/* ------------------------------------------------------------------ */

export const QUANTUM_STATE_COLORS = {
  active: {
    base: QUANTUM_COLORS.quantumCyan,
    dim: QUANTUM_COLORS.quantumCyanDim,
  },
  superposition: {
    base: QUANTUM_COLORS.quantumViolet,
    dim: QUANTUM_COLORS.quantumVioletDim,
  },
  entangled: {
    base: "#c026d3",
    dim: "#e879f9",
  },
  impossible: {
    base: "rgba(148, 163, 184, 0.45)",
    dim: "rgba(100, 116, 139, 0.55)",
  },
  measured: {
    base: "#0f172a",
    dim: "#e2e8f0",
  },
} as const;

export type QuantumSemanticState = keyof typeof QUANTUM_STATE_COLORS;

/* ------------------------------------------------------------------ */
/* Shadows + glow                                                      */
/* ------------------------------------------------------------------ */

export const QUANTUM_SHADOWS = {
  soft: "0 1px 2px 0 rgba(15, 23, 42, 0.06), 0 1px 4px -1px rgba(15, 23, 42, 0.06)",
  card: "0 10px 30px -20px rgba(15, 23, 42, 0.35)",
} as const;

export const QUANTUM_GLOW = {
  cyan: "0 0 28px -8px rgba(34, 211, 238, 0.55)",
  violet: "0 0 28px -8px rgba(124, 58, 237, 0.55)",
  entangled: "0 0 24px -6px rgba(192, 38, 211, 0.55)",
} as const;

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

export const QUANTUM_MOTION = {
  duration: {
    instant: 0.12,
    fast: 0.22,
    standard: 0.32,
    slow: 0.6,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1] as const,
    decel: [0, 0, 0.2, 1] as const,
    accel: [0.4, 0, 1, 1] as const,
  },
  stagger: 0.12,
} as const;

/* ------------------------------------------------------------------ */
/* Spacing                                                             */
/* ------------------------------------------------------------------ */

export const QUANTUM_SPACING = {
  cardPadding: "1.5rem",
  sectionGap: "1.5rem",
  innerGap: "0.75rem",
} as const;
