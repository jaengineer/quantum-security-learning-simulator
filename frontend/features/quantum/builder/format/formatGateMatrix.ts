/**
 * Symbolic LaTeX formatter for 2x2 and 4x4 complex matrices.
 *
 * The strategy is two-fold:
 *
 *   1. Try to factor a common scalar (``1``, ``1/sqrt 2``, ``1/2``,
 *      ``1/(2 sqrt 2)``, ``1/sqrt 3``). An entry is "clean" after dividing
 *      by the candidate ``k`` if both its real and imaginary parts are
 *      near-integers (so ``1 + i``, ``2 i``, ``-1`` are all acceptable). The
 *      matrix is then rendered as ``L_k · bmatrix`` with integer/Gaussian
 *      entries, which gives the canonical form for ``H``, ``HSH``, ``X``,
 *      ``Y``, ``Z``, ``S``, ``S†``, etc.
 *   2. If no common scalar matches, render each cell through
 *      ``formatComplexLatex`` so rotations with arbitrary angles still
 *      degrade gracefully to decimals.
 */

import { formatComplexLatex } from "@/features/quantum/builder/format/formatComplexLatex";
import type { Complex, Mat2, Mat4 } from "@/features/quantum/builder/types";

interface ScalarCandidate {
  value: number;
  latex: string;
}

const SQRT2 = Math.SQRT2;
const SQRT3 = Math.sqrt(3);

/**
 * Common prefactors that appear in single-qubit gates. The empty-string
 * ``latex`` for ``1`` means "no prefactor" so the matrix renders without
 * a leading scalar.
 */
const SCALAR_CANDIDATES: ReadonlyArray<ScalarCandidate> = [
  { value: 1 / SQRT2, latex: "\\tfrac{1}{\\sqrt{2}}" },
  { value: 1 / 2, latex: "\\tfrac{1}{2}" },
  { value: 1 / (2 * SQRT2), latex: "\\tfrac{1}{2\\sqrt{2}}" },
  { value: 1 / SQRT3, latex: "\\tfrac{1}{\\sqrt{3}}" },
  { value: 1, latex: "" },
];

const EPS = 1e-9;

function isNearInteger(x: number): boolean {
  return Math.abs(x - Math.round(x)) < EPS;
}

/**
 * Format a complex value whose real and imaginary parts are known to be
 * (near) integers. Returns ``"0"``, ``"1"``, ``"i"``, ``"1+i"``, ``"-2"``,
 * ``"3 i"`` etc., without enclosing parentheses.
 */
function gaussianToLatex(z: Complex): string {
  const re = Math.round(z.re);
  const im = Math.round(z.im);
  if (re === 0 && im === 0) return "0";
  if (im === 0) return `${re}`;
  if (re === 0) {
    if (im === 1) return "i";
    if (im === -1) return "-i";
    return `${im}i`;
  }
  const sign = im >= 0 ? "+" : "-";
  const absIm = Math.abs(im);
  const imPart = absIm === 1 ? "i" : `${absIm}i`;
  return `${re}${sign}${imPart}`;
}

/**
 * Attempt to factor ``m`` as ``k · M'`` with ``M'`` a Gaussian-integer
 * matrix. Returns the rendered LaTeX on success, ``null`` otherwise.
 */
function tryFactor(
  m: readonly Complex[],
  candidate: ScalarCandidate
): string | null {
  if (candidate.value === 0) return null;
  const inv = 1 / candidate.value;
  const scaled = m.map((cell) => ({
    re: cell.re * inv,
    im: cell.im * inv,
  })) as Complex[];
  for (const cell of scaled) {
    if (!isNearInteger(cell.re) || !isNearInteger(cell.im)) {
      return null;
    }
  }
  const dimension = Math.sqrt(scaled.length);
  const rows = Array.from({ length: dimension }, (_, row) =>
    scaled
      .slice(row * dimension, row * dimension + dimension)
      .map(gaussianToLatex)
      .join(" & ")
  ).join(" \\\\ ");
  const body = `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
  return candidate.latex ? `${candidate.latex} ${body}` : body;
}

/**
 * Render a 2x2 complex matrix as KaTeX, preferring a factored
 * ``scalar · integer-matrix`` form when one of the canonical prefactors
 * applies. Falls back to per-cell ``formatComplexLatex`` otherwise.
 */
export function formatGateMatrixLatex(m: Mat2 | Mat4): string {
  for (const candidate of SCALAR_CANDIDATES) {
    const factored = tryFactor(m, candidate);
    if (factored) return factored;
  }
  const dimension = Math.sqrt(m.length);
  const rows = Array.from({ length: dimension }, (_, row) =>
    m
      .slice(row * dimension, row * dimension + dimension)
      .map((cell) => formatComplexLatex(cell))
      .join(" & ")
  ).join(" \\\\ ");
  return `\\begin{bmatrix} ${rows} \\end{bmatrix}`;
}
