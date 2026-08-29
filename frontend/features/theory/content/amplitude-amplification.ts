import type { TheoryConcept } from "@/features/theory/types";

export const AMPLITUDE_AMPLIFICATION: TheoryConcept = {
  id: "amplitude-amplification",
  level: "advanced",
  category: "quantum-computing",
  notation: "mixed",
  tags: ["amplitude", "probability", "interference", "grover"],
  relatedConceptIds: ["grover-algorithm", "quantum-oracle", "diffusion-operator"],
  title: { en: "Amplitude amplification", es: "Amplificación de amplitud" },
  summary: {
    en: "The mechanism that increases the amplitude, and therefore the measurement probability, of marked states.",
    es: "El mecanismo que aumenta la amplitud, y por tanto la probabilidad de medida, de los estados marcados.",
  },
  learningObjectives: {
    en: [
      "Connect signed amplitudes with measurement probabilities.",
      "Explain why interference can amplify a marked state.",
      "Describe Grover's iteration as repeated amplitude amplification.",
    ],
    es: [
      "Relacionar amplitudes con signo y probabilidades de medida.",
      "Explicar por qué la interferencia puede amplificar un estado marcado.",
      "Describir la iteración de Grover como amplificación de amplitud repetida.",
    ],
  },
  formalDefinition: {
    en: "Amplitude amplification applies two reflections whose product rotates the state vector toward the marked subspace.",
    es: "La amplificación de amplitud aplica dos reflexiones cuyo producto rota el vector de estado hacia el subespacio marcado.",
  },
  intuitiveExplanation: {
    en: "The marked state is first made different by phase. The next reflection makes that difference constructive for the target and destructive for the others.",
    es: "El estado marcado primero se diferencia por fase. La reflexión siguiente hace que esa diferencia sea constructiva para el objetivo y destructiva para los demás.",
  },
  geometricOrPhysicalInterpretation: {
    en: "In Grover's algorithm, amplification is a rotation in the plane defined by the marked state and the uniform unmarked component.",
    es: "En el algoritmo de Grover, la amplificación es una rotación en el plano definido por el estado marcado y la componente uniforme no marcada.",
  },
  examRelevance: {
    en: "Amplitude amplification explains why Grover improves search without directly measuring intermediate answers.",
    es: "La amplificación de amplitud explica por qué Grover mejora la búsqueda sin medir directamente respuestas intermedias.",
  },
  formulas: [
    {
      label: { en: "Probability from amplitude", es: "Probabilidad desde amplitud" },
      latex: "P(x)=|a_x|^2",
      explanation: {
        en: "Changing an amplitude from -0.5 to +1 changes its probability from 25% to 100%.",
        es: "Cambiar una amplitud de -0.5 a +1 cambia su probabilidad de 25% a 100%.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "From phase to probability", es: "De fase a probabilidad" },
      statement: {
        en: "Why does the target probability not increase immediately after the oracle?",
        es: "¿Por qué la probabilidad del objetivo no aumenta inmediatamente después del oráculo?",
      },
      steps: [
        {
          title: { en: "Square the magnitude", es: "Elevar el módulo al cuadrado" },
          latex: "|+0.5|^2=|-0.5|^2=0.25",
          explanation: {
            en: "A sign flip preserves probability but changes interference.",
            es: "Un cambio de signo conserva la probabilidad pero cambia la interferencia.",
          },
        },
      ],
      finalAnswer: {
        en: "The diffusion step is needed to turn the phase difference into higher probability.",
        es: "Hace falta el paso de difusión para convertir la diferencia de fase en mayor probabilidad.",
      },
    },
  ],
  commonMistakes: {
    en: ["Confusing target highlighting with probability amplification."],
    es: ["Confundir el resaltado del objetivo con la amplificación de probabilidad."],
  },
  examQuestions: [
    {
      id: "amplitude-sign-probability",
      difficulty: "easy",
      statement: {
        en: "Do amplitudes +0.5 and -0.5 have different measurement probabilities?",
        es: "¿Tienen las amplitudes +0.5 y -0.5 probabilidades de medida diferentes?",
      },
      expectedAnswer: {
        en: "No. Both have probability 0.25, but their signs affect interference.",
        es: "No. Ambas tienen probabilidad 0.25, pero sus signos afectan a la interferencia.",
      },
      hints: {
        en: ["Use P = |a|²."],
        es: ["Usa P = |a|²."],
      },
    },
  ],
};
