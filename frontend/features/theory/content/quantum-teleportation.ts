import type { TheoryConcept } from "@/features/theory/types";

export const QUANTUM_TELEPORTATION: TheoryConcept = {
  id: "quantum-teleportation",
  level: "advanced",
  category: "quantum-information",
  notation: "mixed",
  tags: ["entanglement", "measurement", "classical-correction", "fidelity"],
  relatedConceptIds: ["quantum-entanglement", "fidelity", "inner-product"],
  title: { en: "Quantum teleportation", es: "Teleportación cuántica" },
  summary: {
    en: "A protocol that transfers an unknown qubit state to Bob using shared entanglement, Alice's measurement and two classical bits.",
    es: "Un protocolo que transfiere un estado cuántico desconocido a Bob usando entrelazamiento compartido, la medida de Alice y dos bits clásicos.",
  },
  learningObjectives: {
    en: [
      "Identify the roles of q0, q1 and q2 in the teleportation circuit.",
      "Explain why Bob needs a branch-dependent correction.",
      "Verify the recovered state with fidelity.",
    ],
    es: [
      "Identificar los roles de q0, q1 y q2 en el circuito de teleportación.",
      "Explicar por qué Bob necesita una corrección dependiente de la rama.",
      "Verificar el estado recuperado con fidelidad.",
    ],
  },
  formalDefinition: {
    en: "Given |ψ⟩ = α|0⟩ + β|1⟩ and a Bell pair shared by Alice and Bob, Alice's Bell-basis measurement projects Bob into one of four Pauli-related states. Two classical bits tell Bob which correction to apply.",
    es: "Dado |ψ⟩ = α|0⟩ + β|1⟩ y un par de Bell compartido por Alice y Bob, la medida de Alice en la base de Bell proyecta a Bob en uno de cuatro estados relacionados por Pauli. Dos bits clásicos indican a Bob qué corrección aplicar.",
  },
  intuitiveExplanation: {
    en: "The qubit itself is not copied. Entanglement plus Alice's measurement moves the recoverable state information to Bob, while the classical bits select the final Pauli fix.",
    es: "El qubit no se copia. El entrelazamiento y la medida de Alice trasladan a Bob la información recuperable del estado, mientras que los bits clásicos seleccionan la corrección de Pauli final.",
  },
  geometricOrPhysicalInterpretation: {
    en: "After Bob's correction, his Bloch vector matches the original input vector even though Alice's local qubits have been measured.",
    es: "Después de la corrección de Bob, su vector de Bloch coincide con el vector de entrada original aunque los qubits locales de Alice hayan sido medidos.",
  },
  examRelevance: {
    en: "Teleportation is a canonical exam protocol because it combines tensor products, entanglement, measurement and conditional gates.",
    es: "La teleportación es un protocolo clásico de examen porque combina productos tensoriales, entrelazamiento, medida y puertas condicionales.",
  },
  formulas: [
    {
      label: { en: "Branch decomposition", es: "Descomposición por ramas" },
      latex:
        "\\frac{1}{2}(|00\\rangle|\\psi\\rangle+|01\\rangle X|\\psi\\rangle+|10\\rangle Z|\\psi\\rangle+|11\\rangle XZ|\\psi\\rangle)",
      explanation: {
        en: "Alice's two measured bits determine whether Bob applies I, X, Z or XZ.",
        es: "Los dos bits medidos por Alice determinan si Bob aplica I, X, Z o XZ.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "Outcome 01", es: "Resultado 01" },
      statement: {
        en: "Alice measures 01. What does Bob do?",
        es: "Alice mide 01. ¿Qué hace Bob?",
      },
      steps: [
        {
          title: { en: "Read the branch", es: "Leer la rama" },
          latex: "|01\\rangle X|\\psi\\rangle",
          explanation: {
            en: "Bob's qubit is bit-flipped relative to the input.",
            es: "El qubit de Bob está invertido respecto a la entrada.",
          },
        },
      ],
      finalAnswer: {
        en: "Bob applies X and recovers |ψ⟩.",
        es: "Bob aplica X y recupera |ψ⟩.",
      },
    },
  ],
  commonMistakes: {
    en: [
      "Thinking teleportation sends information faster than light.",
      "Forgetting that Alice's two classical bits are required.",
    ],
    es: [
      "Pensar que la teleportación envía información más rápido que la luz.",
      "Olvidar que los dos bits clásicos de Alice son necesarios.",
    ],
  },
  examQuestions: [
    {
      id: "teleportation-correction-10",
      difficulty: "medium",
      statement: {
        en: "If Alice measures 10, which correction restores Bob's qubit?",
        es: "Si Alice mide 10, ¿qué corrección restaura el qubit de Bob?",
      },
      expectedAnswer: { en: "Apply Z.", es: "Aplicar Z." },
      hints: {
        en: ["Use the branch table I, X, Z, XZ for 00, 01, 10, 11."],
        es: ["Usa la tabla de ramas I, X, Z, XZ para 00, 01, 10, 11."],
      },
    },
  ],
};
