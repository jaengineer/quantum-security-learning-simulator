import type { LocalizedText } from "@/features/theory/i18n/types";
import type { ExperimentType } from "@/features/quantum/types";

type FoundationNextStepExperiment = Extract<
  ExperimentType,
  "superposition" | "entanglement"
>;

export interface FoundationNextStep {
  href: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
}

export const FOUNDATION_NEXT_STEPS = {
  superposition: {
    href: "/entanglement",
    eyebrow: {
      en: "Recommended next concept",
      es: "Siguiente concepto recomendado",
    },
    title: {
      en: "From one qubit to shared two-qubit states",
      es: "De un qubit a estados compartidos de dos qubits",
    },
    description: {
      en: "You have seen how a qubit can exist in superposition. Now discover how two qubits can form a state that cannot be described independently.",
      es: "Ya has visto cómo un qubit puede existir en superposición. Descubre ahora cómo dos qubits pueden formar un estado que no puede describirse de manera independiente.",
    },
    cta: {
      en: "Explore",
      es: "Explorar",
    },
  },
  entanglement: {
    href: "/teleportation",
    eyebrow: {
      en: "Continue learning",
      es: "Continúa aprendiendo",
    },
    title: {
      en: "Use entanglement inside a complete protocol",
      es: "Usa el entrelazamiento dentro de un protocolo completo",
    },
    description: {
      en: "Entanglement is one of the fundamental resources behind quantum teleportation.",
      es: "El entrelazamiento es uno de los recursos fundamentales del protocolo de teleportación cuántica.",
    },
    cta: {
      en: "Open the Lab",
      es: "Abrir laboratorio",
    },
  },
} as const satisfies Record<FoundationNextStepExperiment, FoundationNextStep>;

export function getFoundationNextStep(
  experimentId: ExperimentType
): FoundationNextStep | null {
  if (experimentId !== "superposition" && experimentId !== "entanglement") {
    return null;
  }
  return FOUNDATION_NEXT_STEPS[experimentId] ?? null;
}
