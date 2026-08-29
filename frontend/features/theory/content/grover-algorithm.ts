import type { TheoryConcept } from "@/features/theory/types";

export const GROVER_ALGORITHM: TheoryConcept = {
  id: "grover-algorithm",
  level: "advanced",
  category: "quantum-computing",
  notation: "mixed",
  tags: ["grover", "quantum-search", "amplitude-amplification", "oracle"],
  relatedConceptIds: [
    "quantum-oracle",
    "amplitude-amplification",
    "diffusion-operator",
    "unitary-matrices",
  ],
  title: { en: "Grover's algorithm", es: "Algoritmo de Grover" },
  summary: {
    en: "A quantum search algorithm that amplifies the probability of a marked state in an unstructured search space.",
    es: "Un algoritmo de búsqueda cuántica que amplifica la probabilidad de un estado marcado en un espacio de búsqueda no estructurado.",
  },
  learningObjectives: {
    en: [
      "Describe the sequence superposition, oracle, diffusion and measurement.",
      "Explain why the oracle changes phase before probability changes.",
      "Identify the marked state after amplitude amplification.",
    ],
    es: [
      "Describir la secuencia superposición, oráculo, difusión y medida.",
      "Explicar por qué el oráculo cambia la fase antes de que cambie la probabilidad.",
      "Identificar el estado marcado después de la amplificación de amplitud.",
    ],
  },
  formalDefinition: {
    en: "For one marked item in a search space of size N, Grover's algorithm alternates a phase oracle with diffusion so the marked state's amplitude grows. The ideal query complexity scales as O(√N).",
    es: "Para un elemento marcado en un espacio de búsqueda de tamaño N, el algoritmo de Grover alterna un oráculo de fase con difusión para aumentar la amplitud del estado marcado. La complejidad ideal en consultas escala como O(√N).",
  },
  intuitiveExplanation: {
    en: "The oracle first creates a sign difference. Diffusion then reflects all amplitudes about their mean, turning that sign difference into a much larger marked amplitude.",
    es: "El oráculo primero crea una diferencia de signo. La difusión refleja después todas las amplitudes respecto a su media y convierte esa diferencia de signo en una amplitud marcada mucho mayor.",
  },
  geometricOrPhysicalInterpretation: {
    en: "The state vector rotates toward the marked basis state in a two-dimensional subspace spanned by the target and the uniform superposition of non-target states.",
    es: "El vector de estado rota hacia el estado base marcado en un subespacio bidimensional generado por el objetivo y la superposición uniforme de los estados no objetivo.",
  },
  examRelevance: {
    en: "Grover is a canonical example because it combines superposition, oracle phase kickback, interference and measurement probabilities.",
    es: "Grover es un ejemplo canónico porque combina superposición, marcado de fase por oráculo, interferencia y probabilidades de medida.",
  },
  formulas: [
    {
      label: { en: "Grover iteration", es: "Iteración de Grover" },
      latex: "G = D O_f",
      explanation: {
        en: "One iteration applies the oracle first and the diffusion operator second.",
        es: "Una iteración aplica primero el oráculo y después el operador de difusión.",
      },
    },
    {
      label: { en: "Query scaling", es: "Escalado de consultas" },
      latex: "O(\\sqrt{N})",
      explanation: {
        en: "For large N, Grover needs quadratically fewer oracle queries than classical unstructured search.",
        es: "Para N grande, Grover necesita cuadráticamente menos consultas al oráculo que una búsqueda clásica no estructurada.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "N = 4 with one target", es: "N = 4 con un objetivo" },
      statement: {
        en: "If |10⟩ is marked, what happens after one ideal Grover iteration?",
        es: "Si |10⟩ está marcado, ¿qué ocurre después de una iteración ideal de Grover?",
      },
      steps: [
        {
          title: { en: "Create equal amplitudes", es: "Crear amplitudes iguales" },
          latex: "\\frac{1}{2}(|00\\rangle+|01\\rangle+|10\\rangle+|11\\rangle)",
          explanation: {
            en: "Hadamards on q0 and q1 give each basis state amplitude +0.5.",
            es: "Hadamards en q0 y q1 dan amplitud +0.5 a cada estado base.",
          },
        },
        {
          title: { en: "Mark the target phase", es: "Marcar la fase del objetivo" },
          latex: "|10\\rangle: +0.5 \\mapsto -0.5",
          explanation: {
            en: "The oracle changes the sign but leaves probabilities at 25%.",
            es: "El oráculo cambia el signo pero mantiene las probabilidades en 25%.",
          },
        },
        {
          title: { en: "Diffuse", es: "Difundir" },
          latex: "a_i' = 2\\bar{a}-a_i",
          explanation: {
            en: "The marked amplitude becomes 1 and the others become 0.",
            es: "La amplitud marcada pasa a 1 y las demás pasan a 0.",
          },
        },
      ],
      finalAnswer: {
        en: "Measuring returns |10⟩ with probability 1 in the ideal N = 4 case.",
        es: "La medida devuelve |10⟩ con probabilidad 1 en el caso ideal N = 4.",
      },
    },
  ],
  commonMistakes: {
    en: [
      "Thinking the oracle directly increases the target probability.",
      "Dropping the negative sign of the marked amplitude.",
      "Claiming the N = 4 demo proves practical speedup.",
    ],
    es: [
      "Pensar que el oráculo aumenta directamente la probabilidad del objetivo.",
      "Eliminar el signo negativo de la amplitud marcada.",
      "Afirmar que la demo N = 4 demuestra aceleración práctica.",
    ],
  },
  examQuestions: [
    {
      id: "grover-oracle-probability",
      difficulty: "easy",
      statement: {
        en: "After the oracle marks |10⟩ in the N = 4 example, what is P(|10⟩)?",
        es: "Después de que el oráculo marque |10⟩ en el ejemplo N = 4, ¿cuánto vale P(|10⟩)?",
      },
      expectedAnswer: {
        en: "It is still 25%; only the amplitude sign changed.",
        es: "Sigue siendo 25%; solo ha cambiado el signo de la amplitud.",
      },
      hints: {
        en: ["Probability is the squared magnitude of amplitude."],
        es: ["La probabilidad es el módulo al cuadrado de la amplitud."],
      },
    },
  ],
};
