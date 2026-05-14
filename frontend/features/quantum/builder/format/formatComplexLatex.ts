/**
 * Symbolic LaTeX formatter for complex amplitudes.
 *
 * Detection order (most specific first):
 *
 *   1. Near-zero            -> "0"
 *   2. Pure real            -> ``formatRealLatex(re)``
 *   3. Pure imaginary       -> "i", "-i", "i/sqrt 2", "k*i", "-k*i"
 *   4. Pure phase |z|=1     -> ``e^{i pi/4}``, ``e^{-i pi/4}``, etc.
 *   5. Symmetric (a +/- a i) -> ``(1+i)/2``, ``(1-i)/2``, ``(1+i)/(2 sqrt 2)``
 *   6. Generic fallback     -> ``re ± im*i`` rendered through ``formatRealLatex``
 *
 * The output is plain LaTeX without any outer delimiters; the consumer is
 * responsible for wrapping it in parentheses / Dirac kets when needed.
 */

import { formatRealLatex } from "@/features/quantum/builder/format/formatQuantumNumber";
import type { Complex } from "@/features/quantum/builder/types";

export interface FormatComplexOptions {
  precision?: number;
  eps?: number;
}

const SQRT2 = Math.SQRT2;

function approxEq(a: number, b: number, eps: number): boolean {
  return Math.abs(a - b) < eps;
}

interface PhaseEntry {
  /** ``arg(z) / pi`` rounded to a small fraction (e.g. 1/4, -1/2). */
  ratio: number;
  latex: string;
}

const PHASE_ENTRIES: ReadonlyArray<PhaseEntry> = [
  { ratio: 0, latex: "1" },
  { ratio: 1, latex: "-1" },
  { ratio: -1, latex: "-1" },
  { ratio: 0.5, latex: "i" },
  { ratio: -0.5, latex: "-i" },
  { ratio: 0.25, latex: "e^{i\\pi/4}" },
  { ratio: -0.25, latex: "e^{-i\\pi/4}" },
  { ratio: 0.75, latex: "e^{i 3\\pi/4}" },
  { ratio: -0.75, latex: "e^{-i 3\\pi/4}" },
  { ratio: 1 / 3, latex: "e^{i\\pi/3}" },
  { ratio: -1 / 3, latex: "e^{-i\\pi/3}" },
  { ratio: 1 / 6, latex: "e^{i\\pi/6}" },
  { ratio: -1 / 6, latex: "e^{-i\\pi/6}" },
];

function matchPhase(z: Complex, eps: number): string | null {
  const r2 = z.re * z.re + z.im * z.im;
  if (!approxEq(r2, 1, eps * 10)) return null;
  const arg = Math.atan2(z.im, z.re); // (-pi, pi]
  const ratio = arg / Math.PI;
  for (const entry of PHASE_ENTRIES) {
    if (approxEq(ratio, entry.ratio, eps * 100)) {
      return entry.latex;
    }
  }
  return null;
}

interface SymmetricPattern {
  /** Magnitude of both re and im for the pattern to match. */
  unit: number;
  /** LaTeX template; ``{sign}`` -> "+" or "-" for ``re + sign · im · i``. */
  numerator: (signRe: 1 | -1, signIm: 1 | -1) => string;
  /** LaTeX of the denominator. Empty string for "no denominator". */
  denominator: string;
}

/**
 * Patterns where ``|re| = |im| = unit``. Each entry produces the canonical
 * ``(\pm 1 \pm i) / d`` style rendering. Order from most likely to least.
 */
const SYMMETRIC_PATTERNS: ReadonlyArray<SymmetricPattern> = [
  {
    // (1+i)/2, (1-i)/2, (-1+i)/2, (-1-i)/2
    unit: 1 / 2,
    numerator: (sr, si) =>
      `${sr === 1 ? "1" : "-1"}${si === 1 ? "+i" : "-i"}`,
    denominator: "2",
  },
  {
    // (1+i)/(2 sqrt 2), etc.
    unit: 1 / (2 * SQRT2),
    numerator: (sr, si) =>
      `${sr === 1 ? "1" : "-1"}${si === 1 ? "+i" : "-i"}`,
    denominator: "2\\sqrt{2}",
  },
  {
    // (1+i)/sqrt 2 = e^{i pi/4} (handled by phase, but listed for redundancy)
    unit: 1 / SQRT2,
    numerator: (sr, si) =>
      `${sr === 1 ? "1" : "-1"}${si === 1 ? "+i" : "-i"}`,
    denominator: "\\sqrt{2}",
  },
];

function matchSymmetric(z: Complex, eps: number): string | null {
  const absRe = Math.abs(z.re);
  const absIm = Math.abs(z.im);
  if (!approxEq(absRe, absIm, eps)) return null;
  for (const pattern of SYMMETRIC_PATTERNS) {
    if (!approxEq(absRe, pattern.unit, eps)) continue;
    const signRe: 1 | -1 = z.re >= 0 ? 1 : -1;
    const signIm: 1 | -1 = z.im >= 0 ? 1 : -1;
    const num = pattern.numerator(signRe, signIm);
    return `\\tfrac{${num}}{${pattern.denominator}}`;
  }
  return null;
}

/**
 * Render a generic ``a + b i`` form using ``formatRealLatex`` for each part.
 * Omits zero terms and handles signs so the result is well-formed.
 */
function formatGeneric(z: Complex, opts: FormatComplexOptions): string {
  const precision = opts.precision ?? 3;
  const eps = opts.eps ?? 1e-9;
  const reIsZero = approxEq(z.re, 0, eps);
  const imIsZero = approxEq(z.im, 0, eps);
  if (reIsZero && imIsZero) return "0";

  if (imIsZero) return formatRealLatex(z.re, { precision, eps });

  if (reIsZero) {
    if (approxEq(z.im, 1, eps)) return "i";
    if (approxEq(z.im, -1, eps)) return "-i";
    const realLatex = formatRealLatex(z.im, { precision, eps });
    return `${realLatex}\\,i`;
  }

  const realLatex = formatRealLatex(z.re, { precision, eps });
  const absIm = Math.abs(z.im);
  const sign = z.im >= 0 ? "+" : "-";
  let imLatex: string;
  if (approxEq(absIm, 1, eps)) {
    imLatex = "i";
  } else {
    imLatex = `${formatRealLatex(absIm, { precision, eps })}\\,i`;
  }
  return `${realLatex} ${sign} ${imLatex}`;
}

/**
 * Render a complex number as LaTeX. Returns "0" for the additive identity and
 * walks the symbolic-detection cascade described in the module header.
 */
export function formatComplexLatex(
  z: Complex,
  opts?: FormatComplexOptions
): string {
  const eps = opts?.eps ?? 1e-9;
  const reIsZero = approxEq(z.re, 0, eps);
  const imIsZero = approxEq(z.im, 0, eps);

  if (reIsZero && imIsZero) return "0";
  if (imIsZero) {
    return formatRealLatex(z.re, { precision: opts?.precision, eps });
  }
  if (reIsZero) {
    if (approxEq(z.im, 1, eps)) return "i";
    if (approxEq(z.im, -1, eps)) return "-i";
    const absIm = Math.abs(z.im);
    if (approxEq(absIm, 1 / SQRT2, eps)) {
      return z.im > 0 ? "\\tfrac{i}{\\sqrt{2}}" : "-\\tfrac{i}{\\sqrt{2}}";
    }
    if (approxEq(absIm, 1 / 2, eps)) {
      return z.im > 0 ? "\\tfrac{i}{2}" : "-\\tfrac{i}{2}";
    }
    const realLatex = formatRealLatex(z.im, {
      precision: opts?.precision,
      eps,
    });
    return `${realLatex}\\,i`;
  }

  const phase = matchPhase(z, eps);
  if (phase) return phase;

  const symmetric = matchSymmetric(z, eps);
  if (symmetric) return symmetric;

  return formatGeneric(z, { precision: opts?.precision, eps });
}
