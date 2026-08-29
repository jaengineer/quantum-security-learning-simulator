import type { TheoryConcept } from "@/features/theory/types";

export const QUANTUM_ORACLE: TheoryConcept = {
  id: "quantum-oracle",
  level: "advanced",
  category: "quantum-computing",
  notation: "mixed",
  tags: ["oracle", "phase-flip", "unitary", "grover"],
  relatedConceptIds: ["grover-algorithm", "amplitude-amplification", "unitary-matrices"],
  title: { en: "Quantum oracle", es: "Oráculo cuántico" },
  summary: {
    en: "A unitary operation that encodes the answer to a computational question, often by marking selected basis states with a phase.",
    es: "Una operación unitaria que codifica la respuesta a una pregunta computacional, a menudo marcando estados base seleccionados con una fase.",
  },
  learningObjectives: {
    en: [
      "Recognize an oracle as a unitary operation.",
      "Explain phase marking in Grover's algorithm.",
      "Distinguish phase changes from probability changes.",
    ],
    es: [
      "Reconocer un oráculo como una operación unitaria.",
      "Explicar el marcado de fase en el algoritmo de Grover.",
      "Distinguir cambios de fase de cambios de probabilidad.",
    ],
  },
  formalDefinition: {
    en: "A phase oracle for a Boolean function f acts as O_f|x⟩ = (-1)^{f(x)}|x⟩. States with f(x)=1 receive a minus sign.",
    es: "Un oráculo de fase para una función booleana f actúa como O_f|x⟩ = (-1)^{f(x)}|x⟩. Los estados con f(x)=1 reciben un signo menos.",
  },
  intuitiveExplanation: {
    en: "The oracle is like a hidden checker. It does not reveal the answer by measurement; it changes the marked state's phase so later interference can expose it.",
    es: "El oráculo es como un verificador oculto. No revela la respuesta mediante una medida; cambia la fase del estado marcado para que la interferencia posterior pueda destacarlo.",
  },
  geometricOrPhysicalInterpretation: {
    en: "A phase oracle reflects the state vector across a hyperplane by changing the sign of marked basis components.",
    es: "Un oráculo de fase refleja el vector de estado respecto a un hiperplano al cambiar el signo de los componentes base marcados.",
  },
  examRelevance: {
    en: "Oracle definitions are common in algorithm questions because they define what information the quantum computer may query.",
    es: "Las definiciones de oráculo son comunes en preguntas de algoritmos porque definen qué información puede consultar el ordenador cuántico.",
  },
  formulas: [
    {
      label: { en: "Phase oracle", es: "Oráculo de fase" },
      latex: "O_f|x\\rangle=(-1)^{f(x)}|x\\rangle",
      explanation: {
        en: "Marked states get a phase of -1; unmarked states stay unchanged.",
        es: "Los estados marcados reciben una fase -1; los no marcados quedan sin cambios.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "Marking |10⟩", es: "Marcar |10⟩" },
      statement: {
        en: "What is the diagonal phase oracle for target |10⟩ in the basis |00⟩, |01⟩, |10⟩, |11⟩?",
        es: "¿Cuál es el oráculo diagonal de fase para el objetivo |10⟩ en la base |00⟩, |01⟩, |10⟩, |11⟩?",
      },
      steps: [
        {
          title: { en: "Locate the target", es: "Localizar el objetivo" },
          explanation: {
            en: "|10⟩ is the third basis vector in q0-as-MSB order.",
            es: "|10⟩ es el tercer vector base en el orden con q0 como bit más significativo.",
          },
        },
      ],
      finalAnswer: {
        en: "The oracle is diag(1, 1, -1, 1).",
        es: "El oráculo es diag(1, 1, -1, 1).",
      },
    },
  ],
  commonMistakes: {
    en: ["Expecting the oracle alone to change measurement probabilities."],
    es: ["Esperar que el oráculo por sí solo cambie las probabilidades de medida."],
  },
  examQuestions: [
    {
      id: "phase-oracle-target",
      difficulty: "medium",
      statement: {
        en: "Which amplitude changes sign when the target is |01⟩?",
        es: "¿Qué amplitud cambia de signo cuando el objetivo es |01⟩?",
      },
      expectedAnswer: {
        en: "Only the amplitude of |01⟩ changes sign.",
        es: "Solo cambia de signo la amplitud de |01⟩.",
      },
      hints: {
        en: ["A phase oracle is diagonal in the computational basis."],
        es: ["Un oráculo de fase es diagonal en la base computacional."],
      },
    },
  ],
};
