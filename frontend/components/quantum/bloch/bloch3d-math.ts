/**
 * Pure, dependency-free math helpers for the 3D Bloch sphere primitive.
 *
 * Keeping these here (separate from any three.js / R3F imports) lets the
 * helpers be unit-tested in isolation and reused from non-rendering contexts.
 *
 * Coordinate convention (right-handed, Z up):
 *
 *   |0⟩  -> ( 0,  0,  1)
 *   |1⟩  -> ( 0,  0, -1)
 *   |+⟩  -> ( 1,  0,  0)
 *   |−⟩  -> (-1,  0,  0)
 *   |i+⟩ -> ( 0,  1,  0)
 *   |i−⟩ -> ( 0, -1,  0)
 */

export interface BlochVector3 {
  x: number;
  y: number;
  z: number;
}

export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function easeInOutCubic(t: number): number {
  if (t < 0.5) return 4 * t * t * t;
  const f = -2 * t + 2;
  return 1 - (f * f * f) / 2;
}

export function lerpVector(
  a: BlochVector3,
  b: BlochVector3,
  t: number
): BlochVector3 {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

/**
 * Squared distance between two Bloch vectors. Used to detect "no movement"
 * cases cheaply (no Math.sqrt) so we can skip starting an animation when the
 * target has not changed.
 */
export function distanceSquared(a: BlochVector3, b: BlochVector3): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const dz = a.z - b.z;
  return dx * dx + dy * dy + dz * dz;
}

/**
 * Label positions just outside the unit sphere so they never z-fight the
 * sphere surface. Kept tight (≈1.06) so the labels read as annotations
 * hugging the sphere rather than competing with it for visual weight. The
 * six poles cover the computational, Hadamard and circular bases.
 */
export const LABEL_OFFSET = 1.06;

export interface PoleSpec {
  ket: string;
  /** Plain-text identifier for the pole, useful for keys / a11y. */
  id: "0" | "1" | "+" | "-" | "+i" | "-i";
  position: readonly [number, number, number];
}

export const POLE_SPECS: readonly PoleSpec[] = [
  { ket: "|0⟩", id: "0", position: [0, 0, LABEL_OFFSET] },
  { ket: "|1⟩", id: "1", position: [0, 0, -LABEL_OFFSET] },
  { ket: "|+⟩", id: "+", position: [LABEL_OFFSET, 0, 0] },
  { ket: "|−⟩", id: "-", position: [-LABEL_OFFSET, 0, 0] },
  { ket: "|i+⟩", id: "+i", position: [0, LABEL_OFFSET, 0] },
  { ket: "|i−⟩", id: "-i", position: [0, -LABEL_OFFSET, 0] },
];

/**
 * Parametric unit circle on one of the three principal planes. Used to draw
 * the equator (XY) and the two meridians (XZ, YZ) of the Bloch sphere.
 */
export function buildCirclePoints(
  plane: "xy" | "xz" | "yz",
  segments = 64
): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i <= segments; i += 1) {
    const theta = (i / segments) * Math.PI * 2;
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    if (plane === "xy") points.push([c, s, 0]);
    else if (plane === "xz") points.push([c, 0, s]);
    else points.push([0, c, s]);
  }
  return points;
}
