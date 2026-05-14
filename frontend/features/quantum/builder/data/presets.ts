/**
 * Predefined circuits offered as quick-start examples in the GatePalette.
 *
 * Each preset is just a list of gate ids applied to ``|0⟩``. The Builder
 * converts them into ``GateInstance[]`` with fresh uids when the user clicks
 * a preset.
 *
 * Order convention: the array reads left-to-right exactly as the circuit
 * timeline. ``["H", "S", "H"]`` therefore applies H first, then S, then H.
 */

import type { GateId } from "@/features/quantum/builder/types";

export interface BuilderPreset {
  id: string;
  label: string;
  description: string;
  gates: readonly GateId[];
}

export const BUILDER_PRESETS: readonly BuilderPreset[] = [
  {
    id: "h0",
    label: "H · |0⟩",
    description: "Hadamard creates an equal superposition.",
    gates: ["H"],
  },
  {
    id: "x0",
    label: "X · |0⟩",
    description: "Pauli-X flips |0⟩ into |1⟩.",
    gates: ["X"],
  },
  {
    id: "hsh0",
    label: "H · S · H · |0⟩",
    description: "Equivalent to a -π/2 rotation around X; ends on |-i⟩.",
    gates: ["H", "S", "H"],
  },
  {
    id: "zh0",
    label: "Z · H · |0⟩",
    description: "Superposition with a phase flip on |1⟩; lands on |−⟩.",
    gates: ["H", "Z"],
  },
] as const;
