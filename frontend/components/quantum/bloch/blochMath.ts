/**
 * Pure helpers that translate computational-basis kets and single-qubit gates
 * into Bloch-sphere coordinates. Kept dependency-free so the math is easy to
 * inspect and unit-test independently from the R3F scene.
 *
 * Coordinate convention (right-handed, Z up):
 *
 *   |0>  -> ( 0,  0,  1)
 *   |1>  -> ( 0,  0, -1)
 *   |+>  -> ( 1,  0,  0)   (H |0>)
 *   |->  -> (-1,  0,  0)   (H |1>)
 *   |+i> -> ( 0,  1,  0)
 *   |-i> -> ( 0, -1,  0)
 */

export type SupportedKet = "0" | "1" | "+" | "-";
export type SingleQubitGate = "H" | "X";

export interface BlochVector {
  x: number;
  y: number;
  z: number;
}

const KET_VECTORS: Record<SupportedKet, BlochVector> = {
  "0": { x: 0, y: 0, z: 1 },
  "1": { x: 0, y: 0, z: -1 },
  "+": { x: 1, y: 0, z: 0 },
  "-": { x: -1, y: 0, z: 0 },
};

export function ketToVector(ket: SupportedKet): BlochVector {
  return { ...KET_VECTORS[ket] };
}

/**
 * Apply a sequence of single-qubit gates to a starting ket and return the
 * resulting Bloch coordinates. Only the gates relevant to the MVP are
 * supported: ``H`` (Hadamard) and ``X`` (Pauli-X).
 */
export function applyGates(
  initial: SupportedKet,
  gates: ReadonlyArray<SingleQubitGate>
): BlochVector {
  let ket: SupportedKet = initial;
  for (const gate of gates) {
    ket = applyGateToKet(ket, gate);
  }
  return ketToVector(ket);
}

function applyGateToKet(ket: SupportedKet, gate: SingleQubitGate): SupportedKet {
  if (gate === "X") {
    switch (ket) {
      case "0":
        return "1";
      case "1":
        return "0";
      case "+":
        return "+";
      case "-":
        return "-";
      default:
        return ket;
    }
  }

  switch (ket) {
    case "0":
      return "+";
    case "1":
      return "-";
    case "+":
      return "0";
    case "-":
      return "1";
    default:
      return ket;
  }
}

export function lerpVector(
  a: BlochVector,
  b: BlochVector,
  t: number
): BlochVector {
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: a.z + (b.z - a.z) * t,
  };
}

export function clamp01(value: number): number {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}
