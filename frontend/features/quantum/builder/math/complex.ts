/**
 * Minimal complex-number primitives used by the Quantum Circuit Builder.
 *
 * Kept dependency-free so the math is trivially unit-testable and easy to
 * audit in the TFM dissertation. Functions are pure: they never mutate their
 * arguments. Every helper returns a brand-new ``Complex`` object.
 */

import type { Complex } from "@/features/quantum/builder/types";

export function c(re: number, im = 0): Complex {
  return { re, im };
}

export const ZERO: Complex = c(0, 0);
export const ONE: Complex = c(1, 0);
export const I: Complex = c(0, 1);

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function sub(a: Complex, b: Complex): Complex {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function mul(a: Complex, b: Complex): Complex {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function scale(a: Complex, k: number): Complex {
  return { re: a.re * k, im: a.im * k };
}

export function conj(a: Complex): Complex {
  return { re: a.re, im: -a.im };
}

/** Squared modulus ``|a|^2 = a.re^2 + a.im^2``. */
export function abs2(a: Complex): number {
  return a.re * a.re + a.im * a.im;
}

/** Modulus ``|a|``. */
export function abs(a: Complex): number {
  return Math.sqrt(abs2(a));
}

/** Build ``e^{i theta}`` from Euler's formula. */
export function expI(theta: number): Complex {
  return { re: Math.cos(theta), im: Math.sin(theta) };
}

/** Round near-zero noise (≤ 1e-12) to exactly zero. Display-only helper. */
export function clean(a: Complex, eps = 1e-12): Complex {
  return {
    re: Math.abs(a.re) < eps ? 0 : a.re,
    im: Math.abs(a.im) < eps ? 0 : a.im,
  };
}

/** Approximate equality (used in tests / dev). */
export function approxEq(a: Complex, b: Complex, eps = 1e-9): boolean {
  return Math.abs(a.re - b.re) < eps && Math.abs(a.im - b.im) < eps;
}
