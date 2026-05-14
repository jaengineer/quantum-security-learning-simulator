/**
 * Symbolic LaTeX formatter for real numbers that appear in quantum amplitudes.
 *
 * The Builder's simulator works with raw floating-point ``Complex`` numbers,
 * but the UI should render the well-known constants of quantum mechanics in
 * their exact symbolic form. This module recognises a small table of
 * canonical values (``1/sqrt 2``, ``1/2``, ``sqrt 3 / 2``, small integer
 * multiples thereof) and falls back to a clean decimal representation when
 * no symbolic match is found.
 *
 * All functions are pure ``number -> string`` mappers; they do not touch the
 * numeric pipeline.
 */

export interface FormatRealOptions {
  /** Decimals for the decimal fallback (default 3). */
  precision?: number;
  /** Tolerance used to match against canonical values (default 1e-9). */
  eps?: number;
}

interface SymbolicEntry {
  /** Numeric value of the candidate. */
  value: number;
  /** Positive LaTeX form (the caller prepends a minus when needed). */
  latex: string;
}

const SQRT2 = Math.SQRT2;
const SQRT3 = Math.sqrt(3);

/**
 * Canonical positive constants recognised by the formatter, listed from the
 * most specific to the most general. ``formatRealLatex`` walks this table in
 * order and returns the first match.
 */
const SYMBOLIC_TABLE: ReadonlyArray<SymbolicEntry> = [
  // Quarters and halves of sqrt 2 / 2 (i.e. 1/sqrt 2 family)
  { value: 1 / SQRT2, latex: "\\tfrac{1}{\\sqrt{2}}" },
  { value: 1 / (2 * SQRT2), latex: "\\tfrac{1}{2\\sqrt{2}}" },
  { value: SQRT2, latex: "\\sqrt{2}" },
  { value: SQRT2 / 2, latex: "\\tfrac{1}{\\sqrt{2}}" }, // same number as 1/sqrt 2, kept for clarity
  // sqrt 3 family
  { value: SQRT3 / 2, latex: "\\tfrac{\\sqrt{3}}{2}" },
  { value: 1 / SQRT3, latex: "\\tfrac{1}{\\sqrt{3}}" },
  { value: SQRT3, latex: "\\sqrt{3}" },
  // Simple fractions
  { value: 1 / 2, latex: "\\tfrac{1}{2}" },
  { value: 1 / 3, latex: "\\tfrac{1}{3}" },
  { value: 1 / 4, latex: "\\tfrac{1}{4}" },
  { value: 3 / 4, latex: "\\tfrac{3}{4}" },
];

function approxEq(a: number, b: number, eps: number): boolean {
  return Math.abs(a - b) < eps;
}

function isIntegerNear(x: number, eps: number): boolean {
  return Math.abs(x - Math.round(x)) < eps;
}

function trimZeros(s: string): string {
  if (!s.includes(".")) return s;
  return s.replace(/\.?0+$/, "");
}

/**
 * Find a small integer ``k`` (-9..9, non-zero) such that ``x = k * unit``.
 * Returns the integer when found, ``null`` otherwise.
 */
function smallIntegerMultipleOf(x: number, unit: number, eps: number): number | null {
  if (unit === 0) return null;
  const ratio = x / unit;
  if (!Number.isFinite(ratio)) return null;
  const rounded = Math.round(ratio);
  if (rounded === 0) return null;
  if (Math.abs(rounded) > 9) return null;
  if (!approxEq(ratio, rounded, eps)) return null;
  return rounded;
}

/**
 * Render a real number as LaTeX, preferring exact symbolic forms over
 * decimals. Negative numbers reuse the positive symbolic form and prefix
 * a literal "-" (or "- " when the value would otherwise start with a letter).
 */
export function formatRealLatex(x: number, opts?: FormatRealOptions): string {
  const eps = opts?.eps ?? 1e-9;
  const precision = opts?.precision ?? 3;

  if (approxEq(x, 0, eps)) return "0";

  const sign = x < 0 ? "-" : "";
  const abs = Math.abs(x);

  if (isIntegerNear(abs, eps)) {
    const n = Math.round(abs);
    return `${sign}${n}`;
  }

  // Direct match against the canonical table.
  for (const entry of SYMBOLIC_TABLE) {
    if (approxEq(abs, entry.value, eps)) {
      return `${sign}${entry.latex}`;
    }
  }

  // Small-integer multiples of 1/sqrt 2 (e.g. 2/sqrt 2, 3/sqrt 2).
  const kSqrt2 = smallIntegerMultipleOf(x, 1 / SQRT2, eps);
  if (kSqrt2 !== null && Math.abs(kSqrt2) !== 1) {
    const num = kSqrt2;
    return `\\tfrac{${num}}{\\sqrt{2}}`;
  }

  // Small-integer multiples of 1/2 (odd numerator only; even numerators are
  // integers we already handled above).
  const kHalf = smallIntegerMultipleOf(x, 1 / 2, eps);
  if (kHalf !== null && kHalf % 2 !== 0) {
    return `\\tfrac{${kHalf}}{2}`;
  }

  // Small-integer multiples of sqrt 3 / 2 (e.g. -sqrt 3 / 2 -> -sqrt 3 / 2).
  const kSqrt3Half = smallIntegerMultipleOf(x, SQRT3 / 2, eps);
  if (kSqrt3Half !== null && Math.abs(kSqrt3Half) !== 1) {
    const num =
      kSqrt3Half === 1
        ? "\\sqrt{3}"
        : kSqrt3Half === -1
          ? "-\\sqrt{3}"
          : `${kSqrt3Half}\\sqrt{3}`;
    return `\\tfrac{${num}}{2}`;
  }

  // Decimal fallback.
  return `${sign}${trimZeros(abs.toFixed(precision))}`;
}

export const __internal__ = {
  approxEq,
  isIntegerNear,
  smallIntegerMultipleOf,
};
