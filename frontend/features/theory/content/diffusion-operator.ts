import type { TheoryConcept } from "@/features/theory/types";

export const DIFFUSION_OPERATOR: TheoryConcept = {
  id: "diffusion-operator",
  level: "advanced",
  category: "quantum-computing",
  notation: "mixed",
  tags: ["diffusion", "inversion-about-mean", "grover", "unitary"],
  relatedConceptIds: ["grover-algorithm", "quantum-oracle", "amplitude-amplification", "unitary-matrices"],
  title: { en: "Diffusion operator", es: "Operador de difusión" },
  summary: {
    en: "Grover's reflection about the uniform superposition, often taught as inversion about the mean.",
    es: "La reflexión de Grover respecto a la superposición uniforme, explicada a menudo como inversión respecto a la media.",
  },
  learningObjectives: {
    en: [
      "Compute inversion about the mean for N = 4 amplitudes.",
      "Explain how diffusion amplifies the marked state.",
      "Connect D = 2|s⟩⟨s| - I with the amplitude update rule.",
    ],
    es: [
      "Calcular la inversión respecto a la media para amplitudes con N = 4.",
      "Explicar cómo la difusión amplifica el estado marcado.",
      "Relacionar D = 2|s⟩⟨s| - I con la regla de actualización de amplitudes.",
    ],
  },
  formalDefinition: {
    en: "For the uniform state |s⟩, the diffusion operator is D = 2|s⟩⟨s| - I. In the real-amplitude N = 4 case, it maps each amplitude to aᵢ′ = 2ā - aᵢ.",
    es: "Para el estado uniforme |s⟩, el operador de difusión es D = 2|s⟩⟨s| - I. En el caso N = 4 con amplitudes reales, transforma cada amplitud en aᵢ′ = 2ā - aᵢ.",
  },
  intuitiveExplanation: {
    en: "Imagine a mirror placed at the average amplitude. Values above the mean move below it, and values below the mean move above it by the same distance.",
    es: "Imagina un espejo colocado en la amplitud media. Los valores por encima de la media pasan por debajo, y los que están por debajo pasan por encima a la misma distancia.",
  },
  geometricOrPhysicalInterpretation: {
    en: "Diffusion is a reflection across the uniform superposition direction.",
    es: "La difusión es una reflexión respecto a la dirección de la superposición uniforme.",
  },
  examRelevance: {
    en: "Inversion about the mean is the standard hand-computation step in small Grover examples.",
    es: "La inversión respecto a la media es el paso estándar de cálculo manual en ejemplos pequeños de Grover.",
  },
  formulas: [
    {
      label: { en: "Diffusion", es: "Difusión" },
      latex: "D=2|s\\rangle\\langle s|-I",
      explanation: {
        en: "This reflects the state around the uniform superposition.",
        es: "Esto refleja el estado alrededor de la superposición uniforme.",
      },
    },
    {
      label: { en: "Inversion about the mean", es: "Inversión respecto a la media" },
      latex: "a_i'=2\\bar{a}-a_i",
      explanation: {
        en: "For N = 4, this form makes the amplitude amplification arithmetic visible.",
        es: "Para N = 4, esta forma hace visible la aritmética de la amplificación de amplitud.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "Target |10⟩", es: "Objetivo |10⟩" },
      statement: {
        en: "After the oracle, amplitudes are [+0.5, +0.5, -0.5, +0.5]. What is the mean?",
        es: "Después del oráculo, las amplitudes son [+0.5, +0.5, -0.5, +0.5]. ¿Cuál es la media?",
      },
      steps: [
        {
          title: { en: "Average the amplitudes", es: "Promediar las amplitudes" },
          latex: "\\bar{a}=\\frac{0.5+0.5-0.5+0.5}{4}=0.25",
          explanation: {
            en: "The target lies below the mean because the oracle flipped its sign.",
            es: "El objetivo queda por debajo de la media porque el oráculo invirtió su signo.",
          },
        },
        {
          title: { en: "Reflect the target", es: "Reflejar el objetivo" },
          latex: "2(0.25)-(-0.5)=1.0",
          explanation: {
            en: "The marked amplitude becomes 1.",
            es: "La amplitud marcada pasa a 1.",
          },
        },
      ],
      finalAnswer: {
        en: "The other amplitudes become 0, so the marked state is measured with probability 1.",
        es: "Las demás amplitudes pasan a 0, así que el estado marcado se mide con probabilidad 1.",
      },
    },
  ],
  commonMistakes: {
    en: ["Using probabilities instead of signed amplitudes in the mean."],
    es: ["Usar probabilidades en lugar de amplitudes con signo para calcular la media."],
  },
  examQuestions: [
    {
      id: "diffusion-mean-target",
      difficulty: "medium",
      statement: {
        en: "If the mean is 0.25 and the marked amplitude is -0.5, what is the amplitude after diffusion?",
        es: "Si la media es 0.25 y la amplitud marcada es -0.5, ¿cuál es la amplitud después de la difusión?",
      },
      expectedAnswer: {
        en: "2 × 0.25 - (-0.5) = 1.0.",
        es: "2 × 0.25 - (-0.5) = 1.0.",
      },
      hints: {
        en: ["Apply aᵢ′ = 2ā - aᵢ."],
        es: ["Aplica aᵢ′ = 2ā - aᵢ."],
      },
    },
  ],
};
