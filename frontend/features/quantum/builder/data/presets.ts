/**
 * Predefined circuits offered as quick-start examples in the GatePalette.
 *
 * Each preset is a list of metadata-aware gate specs applied left-to-right.
 * The Builder converts them into ``GateInstance[]`` with fresh ids when the
 * user clicks a preset.
 *
 * Order convention: the array reads left-to-right exactly as the circuit
 * timeline. ``["H", "S", "H"]`` therefore applies H first, then S, then H.
 */

import type {
  GateId,
  GateParams,
  QubitCount,
  QubitIndex,
} from "@/features/quantum/builder/types";

export interface BuilderPresetGate {
  gateId: GateId;
  targetQubit?: QubitIndex;
  controlQubit?: QubitIndex;
  targetQubits?: readonly [0, 1];
  params?: GateParams;
}

export interface BuilderPreset {
  id: string;
  label: string;
  description: string;
  qubitCount: QubitCount;
  gates: readonly BuilderPresetGate[];
}

export const BUILDER_PRESETS: readonly BuilderPreset[] = [
  {
    id: "h0",
    label: "H · |0⟩",
    description: "Hadamard creates an equal superposition.",
    qubitCount: 1,
    gates: [{ gateId: "H", targetQubit: 0 }],
  },
  {
    id: "x0",
    label: "X · |0⟩",
    description: "Pauli-X flips |0⟩ into |1⟩.",
    qubitCount: 1,
    gates: [{ gateId: "X", targetQubit: 0 }],
  },
  {
    id: "hsh0",
    label: "H · S · H · |0⟩",
    description: "Equivalent to a -π/2 rotation around X; ends on |-i⟩.",
    qubitCount: 1,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "S", targetQubit: 0 },
      { gateId: "H", targetQubit: 0 },
    ],
  },
  {
    id: "zh0",
    label: "Z · H · |0⟩",
    description: "Superposition with a phase flip on |1⟩; lands on |−⟩.",
    qubitCount: 1,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "Z", targetQubit: 0 },
    ],
  },
  {
    id: "bell-phi-plus",
    label: "Bell state |Φ+⟩",
    description: "H on q0 followed by CNOT(q0 → q1) prepares (|00⟩ + |11⟩)/√2.",
    qubitCount: 2,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "CNOT", controlQubit: 0, targetQubit: 1 },
    ],
  },
  {
    id: "bell-phi-minus",
    label: "Bell state |Φ−⟩",
    description:
      "Add a Z phase after Φ+ to prepare (|00⟩ − |11⟩)/√2.",
    qubitCount: 2,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "CNOT", controlQubit: 0, targetQubit: 1 },
      { gateId: "Z", targetQubit: 0 },
    ],
  },
  {
    id: "bell-psi-plus",
    label: "Bell state |Ψ+⟩",
    description:
      "Flip q1 after Φ+ to prepare (|01⟩ + |10⟩)/√2.",
    qubitCount: 2,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "CNOT", controlQubit: 0, targetQubit: 1 },
      { gateId: "X", targetQubit: 1 },
    ],
  },
  {
    id: "bell-psi-minus",
    label: "Bell state |Ψ−⟩",
    description:
      "Flip q1 and add a phase to prepare (|01⟩ − |10⟩)/√2.",
    qubitCount: 2,
    gates: [
      { gateId: "H", targetQubit: 0 },
      { gateId: "CNOT", controlQubit: 0, targetQubit: 1 },
      { gateId: "X", targetQubit: 1 },
      { gateId: "Z", targetQubit: 0 },
    ],
  },
] as const;
