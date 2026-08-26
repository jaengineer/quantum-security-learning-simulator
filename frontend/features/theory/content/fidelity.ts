import type { TheoryConcept } from "@/features/theory/types";

export const FIDELITY: TheoryConcept = {
  id: "fidelity",
  level: "intermediate",
  category: "quantum-information",
  notation: "mixed",
  tags: ["teleportation", "measurement", "overlap"],
  relatedConceptIds: ["inner-product", "quantum-teleportation"],
  title: { en: "Fidelity", es: "Fidelidad" },
  summary: {
    en: "A similarity score between quantum states; for pure states it is the squared magnitude of their inner product.",
    es: "Una medida de similitud entre estados cuánticos; para estados puros es el módulo al cuadrado de su producto interno.",
  },
  learningObjectives: {
    en: [
      "Compute pure-state fidelity from an inner product.",
      "Use fidelity to verify a protocol output.",
    ],
    es: [
      "Calcular la fidelidad de estados puros desde un producto interno.",
      "Usar la fidelidad para verificar la salida de un protocolo.",
    ],
  },
  formalDefinition: {
    en: "For pure states |ψ⟩ and |φ⟩, fidelity is F = |⟨ψ|φ⟩|².",
    es: "Para estados puros |ψ⟩ y |φ⟩, la fidelidad es F = |⟨ψ|φ⟩|².",
  },
  intuitiveExplanation: {
    en: "Fidelity is 1 when two pure states describe the same physical state up to global phase, and 0 when they are orthogonal.",
    es: "La fidelidad es 1 cuando dos estados puros describen el mismo estado físico salvo fase global, y 0 cuando son ortogonales.",
  },
  geometricOrPhysicalInterpretation: {
    en: "On the Bloch sphere, high fidelity means the two state vectors point in nearly the same direction.",
    es: "En la esfera de Bloch, alta fidelidad significa que ambos vectores de estado apuntan casi en la misma dirección.",
  },
  examRelevance: {
    en: "Fidelity is a standard way to check whether a state-preparation or communication protocol worked.",
    es: "La fidelidad es una forma estándar de comprobar si una preparación de estado o protocolo de comunicación funcionó.",
  },
  formulas: [
    {
      label: { en: "Pure-state fidelity", es: "Fidelidad de estados puros" },
      latex: "F(\\psi,\\phi)=|\\langle \\psi | \\phi \\rangle|^2",
      explanation: {
        en: "The global phase disappears because the overlap is squared in magnitude.",
        es: "La fase global desaparece porque el solapamiento se eleva en módulo al cuadrado.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "Same state up to phase", es: "Mismo estado salvo fase" },
      statement: {
        en: "Compare |ψ⟩ and -|ψ⟩.",
        es: "Compara |ψ⟩ y -|ψ⟩.",
      },
      steps: [
        {
          title: { en: "Compute overlap", es: "Calcular solapamiento" },
          latex: "\\langle \\psi | (-\\psi) \\rangle = -1",
          explanation: {
            en: "The minus sign is only a global phase.",
            es: "El signo menos es sólo una fase global.",
          },
        },
      ],
      finalAnswer: { en: "F = |-1|² = 1.", es: "F = |-1|² = 1." },
    },
  ],
  commonMistakes: {
    en: ["Treating a global phase as a failed match."],
    es: ["Tratar una fase global como si fuese una coincidencia fallida."],
  },
  examQuestions: [
    {
      id: "fidelity-global-phase",
      difficulty: "easy",
      statement: {
        en: "What is the fidelity between |0⟩ and -|0⟩?",
        es: "¿Cuál es la fidelidad entre |0⟩ y -|0⟩?",
      },
      expectedAnswer: { en: "It is 1.", es: "Es 1." },
      hints: {
        en: ["Compute the overlap and square its magnitude."],
        es: ["Calcula el solapamiento y eleva su módulo al cuadrado."],
      },
    },
  ],
};
