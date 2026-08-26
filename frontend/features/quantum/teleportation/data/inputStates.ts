import { c } from "@/features/quantum/builder/math/complex";
import type {
  BlochVector,
  SingleQubitState,
} from "@/features/quantum/builder/types";
import type { LocalizedText } from "@/features/theory/i18n/types";

export interface TeleportationInputState {
  id: "zero" | "one" | "plus" | "minus" | "plus-i" | "minus-i";
  label: string;
  description: LocalizedText;
  state: SingleQubitState;
  bloch: BlochVector;
}

const INV_SQRT2 = Math.SQRT1_2;

export const TELEPORTATION_INPUT_STATES: readonly TeleportationInputState[] = [
  {
    id: "zero",
    label: "|0⟩",
    description: {
      en: "North pole basis state.",
      es: "Estado base del polo norte.",
    },
    state: [c(1), c(0)] as const,
    bloch: { x: 0, y: 0, z: 1 },
  },
  {
    id: "one",
    label: "|1⟩",
    description: {
      en: "South pole basis state.",
      es: "Estado base del polo sur.",
    },
    state: [c(0), c(1)] as const,
    bloch: { x: 0, y: 0, z: -1 },
  },
  {
    id: "plus",
    label: "|+⟩",
    description: {
      en: "Equal superposition on the +X axis.",
      es: "Superposición equilibrada en el eje +X.",
    },
    state: [c(INV_SQRT2), c(INV_SQRT2)] as const,
    bloch: { x: 1, y: 0, z: 0 },
  },
  {
    id: "minus",
    label: "|−⟩",
    description: {
      en: "Equal superposition on the -X axis.",
      es: "Superposición equilibrada en el eje -X.",
    },
    state: [c(INV_SQRT2), c(-INV_SQRT2)] as const,
    bloch: { x: -1, y: 0, z: 0 },
  },
  {
    id: "plus-i",
    label: "|+i⟩",
    description: {
      en: "Equal superposition on the +Y axis.",
      es: "Superposición equilibrada en el eje +Y.",
    },
    state: [c(INV_SQRT2), c(0, INV_SQRT2)] as const,
    bloch: { x: 0, y: 1, z: 0 },
  },
  {
    id: "minus-i",
    label: "|−i⟩",
    description: {
      en: "Equal superposition on the -Y axis.",
      es: "Superposición equilibrada en el eje -Y.",
    },
    state: [c(INV_SQRT2), c(0, -INV_SQRT2)] as const,
    bloch: { x: 0, y: -1, z: 0 },
  },
] as const;
