/**
 * Symbolic LaTeX renderer for one-, two- or three-qubit pure states.
 *
 * Produces canonical forms such as:
 *
 *   - ``H|0⟩``        -> ``\tfrac{1}{\sqrt{2}} |0⟩ + \tfrac{1}{\sqrt{2}} |1⟩``
 *   - ``S|+⟩``        -> ``\tfrac{1}{\sqrt{2}} |0⟩ + \tfrac{i}{\sqrt{2}} |1⟩``
 *   - ``HSH|0⟩``      -> ``\left(\tfrac{1+i}{2}\right) |0⟩ + \left(\tfrac{1-i}{2}\right) |1⟩``
 *   - ``T|1⟩``        -> ``e^{i\pi/4} |1⟩``
 *
 * Rules:
 *   - Drop zero-amplitude terms entirely.
 *   - Replace ``1·|x⟩`` by ``|x⟩`` and ``-1·|x⟩`` by ``-|x⟩``.
 *   - Show single-symbol amplitudes (``i``, ``-i``, ``\tfrac{1}{\sqrt{2}}``)
 *     without enclosing parentheses; wrap compound amplitudes in
 *     ``\left( ... \right)``.
 */

import { formatComplexLatex } from "@/features/quantum/builder/format/formatComplexLatex";
import { clean } from "@/features/quantum/builder/math/complex";
import type { Complex, QuantumState } from "@/features/quantum/builder/types";

const EPS = 1e-9;
const SINGLE_QUBIT_KETS = ["\\lvert 0\\rangle", "\\lvert 1\\rangle"] as const;
const TWO_QUBIT_KETS = [
  "\\lvert 00\\rangle",
  "\\lvert 01\\rangle",
  "\\lvert 10\\rangle",
  "\\lvert 11\\rangle",
] as const;
const THREE_QUBIT_KETS = [
  "\\lvert 000\\rangle",
  "\\lvert 001\\rangle",
  "\\lvert 010\\rangle",
  "\\lvert 011\\rangle",
  "\\lvert 100\\rangle",
  "\\lvert 101\\rangle",
  "\\lvert 110\\rangle",
  "\\lvert 111\\rangle",
] as const;

function isZero(z: Complex): boolean {
  return Math.abs(z.re) < EPS && Math.abs(z.im) < EPS;
}

function isOne(z: Complex): boolean {
  return Math.abs(z.re - 1) < EPS && Math.abs(z.im) < EPS;
}

function isMinusOne(z: Complex): boolean {
  return Math.abs(z.re + 1) < EPS && Math.abs(z.im) < EPS;
}

/**
 * Decide whether an amplitude renders as a single visual atom and therefore
 * does not need enclosing parentheses next to a ket. Atomic amplitudes:
 *
 *   - ``i``, ``-i``
 *   - any ``\tfrac{...}{...}`` produced by ``formatComplexLatex`` (single
 *     fraction with no top-level ``+``/``-``)
 *   - any ``e^{...}`` pure-phase rendering
 *   - any plain integer / decimal literal
 *
 * Heuristic: if the LaTeX has no top-level ``+`` or ``-`` (ignoring a
 * leading sign), it can stand on its own.
 */
function isAtomic(latex: string): boolean {
  if (!latex) return true;
  // Skip a single leading minus sign.
  const body = latex.startsWith("-") ? latex.slice(1) : latex;
  // Top-level ``+`` or `` - `` (with surrounding spaces, since
  // ``formatComplexLatex`` emits ``a + b\,i`` and ``a - b\,i``).
  return !/\s[+\-]\s/.test(body);
}

function termFor(amp: Complex, ket: string): string | null {
  const z = clean(amp);
  if (isZero(z)) return null;
  if (isOne(z)) return ket;
  if (isMinusOne(z)) return `-${ket}`;

  const latex = formatComplexLatex(z);
  if (isAtomic(latex)) return `${latex}\\, ${ket}`;
  return `\\left(${latex}\\right) ${ket}`;
}

function joinTerms(terms: string[]): string {
  if (terms.length === 0) return "0";
  return terms.reduce((acc, term) => {
    if (!acc) return term;
    if (term.startsWith("-")) return `${acc} - ${term.slice(1)}`;
    return `${acc} + ${term}`;
  }, "");
}

/**
 * Render ``|ψ⟩`` as canonical LaTeX. The output never contains numeric noise:
 * amplitudes are cleaned through ``formatComplexLatex`` and zero terms are
 * dropped.
 */
export function formatDiracStateLatex(state: QuantumState): string {
  const kets =
    state.length === 2
      ? SINGLE_QUBIT_KETS
      : state.length === 4
        ? TWO_QUBIT_KETS
        : THREE_QUBIT_KETS;
  const terms = state
    .map((amp, index) => termFor(amp, kets[index]))
    .filter((term): term is string => term !== null);

  return joinTerms(terms);
}
