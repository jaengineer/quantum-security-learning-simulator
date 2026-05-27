import type { TheoryConcept } from "@/features/theory/types";

export const REDUCED_DENSITY_MATRIX: TheoryConcept = {
  id: "reduced-density-matrix",
  level: "advanced",
  category: "quantum-information",
  notation: "mixed",
  tags: ["partial-trace", "subsystem", "entanglement", "schmidt"],
  relatedConceptIds: ["density-matrix", "quantum-entanglement", "spectral-theorem"],

  title: {
    en: "Reduced density matrix and partial trace",
    es: "Matriz de densidad reducida y traza parcial",
  },
  summary: {
    en: "The state of a subsystem obtained by tracing out the rest. It is the right object whenever you only have access to part of a composite system.",
    es: "El estado de un subsistema obtenido al «trazar fuera» el resto. Es el objeto correcto cuando sólo se tiene acceso a una parte del sistema compuesto.",
  },
  learningObjectives: {
    en: [
      "Define the partial trace Tr_B over a tensor factor.",
      "Compute ρ_A = Tr_B(ρ_{AB}) on small examples.",
      "Diagnose entanglement through the purity of ρ_A.",
    ],
    es: [
      "Definir la traza parcial Tr_B sobre un factor tensorial.",
      "Calcular ρ_A = Tr_B(ρ_{AB}) en ejemplos pequeños.",
      "Diagnosticar entrelazamiento a través de la pureza de ρ_A.",
    ],
  },
  formalDefinition: {
    en: "Let H = H_A ⊗ H_B and let ρ_{AB} be a density matrix on H. The partial trace over B is the unique linear map such that, for separable operators X ⊗ Y, Tr_B(X ⊗ Y) = X · Tr(Y). The reduced density matrix on A is ρ_A = Tr_B(ρ_{AB}).",
    es: "Sea H = H_A ⊗ H_B y sea ρ_{AB} una matriz de densidad en H. La traza parcial sobre B es la única aplicación lineal tal que, en operadores separables X ⊗ Y, Tr_B(X ⊗ Y) = X · Tr(Y). La matriz de densidad reducida en A es ρ_A = Tr_B(ρ_{AB}).",
  },
  intuitiveExplanation: {
    en: "Imagine Alice and Bob share a bipartite state. Alice does not know what Bob will measure; from her side, all the predictions of any local observable on A only depend on ρ_A. Tracing out B literally averages over every basis state of B.",
    es: "Imagina que Alicia y Bob comparten un estado bipartito. Alicia no sabe qué medirá Bob; desde su lado, todas las predicciones de un observable local sobre A sólo dependen de ρ_A. Trazar fuera B promedia, literalmente, sobre cada vector base de B.",
  },
  geometricOrPhysicalInterpretation: {
    en: "When ρ_{AB} is pure but entangled, ρ_A is mixed even though the global state has perfect information. The amount of mixing of ρ_A — measured by entropy or by 1 − Tr(ρ_A²) — quantifies entanglement.",
    es: "Cuando ρ_{AB} es pura pero está entrelazada, ρ_A es mezcla aunque el estado global tenga información perfecta. La cantidad de mezcla de ρ_A — medida por la entropía o por 1 − Tr(ρ_A²) — cuantifica el entrelazamiento.",
  },
  examRelevance: {
    en: "Reduced density matrices show up in any exam item dealing with bipartite systems, entanglement entropy or local measurements. Exam graders look for clean computation of Tr_B and a coherent argument about purity.",
    es: "Las matrices de densidad reducidas aparecen en cualquier ejercicio que trate sistemas bipartitos, entropía de entrelazamiento o medidas locales. Los correctores valoran un cálculo limpio de Tr_B y un argumento coherente sobre la pureza.",
  },

  formulas: [
    {
      label: {
        en: "Partial trace, coordinate form",
        es: "Traza parcial en coordenadas",
      },
      latex: "(\\rho_A)_{ij} = \\sum_{k} (\\rho_{AB})_{ik,\\, jk}",
      explanation: {
        en: "Sum over the B-index k that appears in both rows and columns of ρ_{AB}.",
        es: "Suma sobre el índice de B (k) que aparece tanto en filas como en columnas de ρ_{AB}.",
      },
    },
    {
      label: {
        en: "Operator form",
        es: "Forma operacional",
      },
      latex: "\\rho_A = \\sum_{k} (\\mathbb{1}_A \\otimes \\langle k|_B)\\, \\rho_{AB}\\, (\\mathbb{1}_A \\otimes |k\\rangle_B)",
      explanation: {
        en: "Sandwich ρ_{AB} between an orthonormal B-basis and sum.",
        es: "Encadena ρ_{AB} entre una base ortonormal de B y suma.",
      },
    },
    {
      label: {
        en: "Entanglement entropy",
        es: "Entropía de entrelazamiento",
      },
      latex: "S(\\rho_A) = -\\,\\mathrm{Tr}(\\rho_A \\log_2 \\rho_A)",
      explanation: {
        en: "Vanishes iff |ψ_{AB}⟩ is separable. Maximised by maximally entangled states.",
        es: "Se anula si y sólo si |ψ_{AB}⟩ es separable. Es máxima en estados máximamente entrelazados.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Reduced state of the Bell state Φ⁺",
        es: "Estado reducido del estado de Bell Φ⁺",
      },
      statement: {
        en: "Compute ρ_A for |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.",
        es: "Calcula ρ_A para |Φ⁺⟩ = (|00⟩ + |11⟩)/√2.",
      },
      steps: [
        {
          title: {
            en: "Form the global density matrix",
            es: "Forma la matriz de densidad global",
          },
          latex: "\\rho_{AB} = \\tfrac{1}{2}(|00\\rangle\\langle 00| + |00\\rangle\\langle 11| + |11\\rangle\\langle 00| + |11\\rangle\\langle 11|)",
          explanation: {
            en: "Expand |Φ⁺⟩⟨Φ⁺|.",
            es: "Expande |Φ⁺⟩⟨Φ⁺|.",
          },
        },
        {
          title: {
            en: "Trace out B",
            es: "Traza fuera B",
          },
          latex: "\\rho_A = \\sum_{k \\in \\{0, 1\\}} \\langle k|_B\\, \\rho_{AB}\\, |k\\rangle_B",
          explanation: {
            en: "Apply ⟨k| on the right and |k⟩ on the left of the B factor.",
            es: "Aplica ⟨k| a la derecha y |k⟩ a la izquierda del factor B.",
          },
        },
        {
          title: {
            en: "Cross terms cancel",
            es: "Los términos cruzados se cancelan",
          },
          latex: "\\rho_A = \\tfrac{1}{2}(|0\\rangle\\langle 0| + |1\\rangle\\langle 1|) = \\tfrac{1}{2}\\mathbb{1}",
          explanation: {
            en: "Off-diagonal Bell components give ⟨0|1⟩ = 0 and drop out.",
            es: "Las componentes Bell fuera de la diagonal dan ⟨0|1⟩ = 0 y desaparecen.",
          },
        },
      ],
      finalAnswer: {
        en: "ρ_A = I/2. Alice's marginal is maximally mixed, confirming maximal entanglement.",
        es: "ρ_A = I/2. La marginal de Alicia es máximamente mezcla, lo que confirma entrelazamiento máximo.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Tracing over the wrong factor (writing Tr_A when you wanted Tr_B).",
      "Forgetting that ρ_A is automatically hermitian and Tr(ρ_A) = 1 — a useful sanity check.",
      "Concluding entanglement only from ρ_{AB} being non-diagonal; the correct test is the purity of ρ_A.",
    ],
    es: [
      "Trazar sobre el factor equivocado (escribir Tr_A cuando se quería Tr_B).",
      "Olvidar que ρ_A es automáticamente hermitiana y Tr(ρ_A) = 1 — una buena comprobación rápida.",
      "Concluir entrelazamiento sólo porque ρ_{AB} no sea diagonal; el test correcto es la pureza de ρ_A.",
    ],
  },

  examQuestions: [
    {
      id: "reduced-q1",
      difficulty: "hard",
      statement: {
        en: "Let |ψ⟩ = cos(θ)|00⟩ + sin(θ)|11⟩. Compute ρ_A and use Tr(ρ_A²) to identify the values of θ for which the state is separable.",
        es: "Sea |ψ⟩ = cos(θ)|00⟩ + sin(θ)|11⟩. Calcula ρ_A y usa Tr(ρ_A²) para identificar los valores de θ para los que el estado es separable.",
      },
      expectedAnswer: {
        en: "ρ_A = cos²(θ)|0⟩⟨0| + sin²(θ)|1⟩⟨1|. Then Tr(ρ_A²) = cos⁴(θ) + sin⁴(θ) = 1 − 2 cos²(θ) sin²(θ) = 1 − (1/2) sin²(2θ). Purity equals 1 iff sin(2θ) = 0, i.e. θ ∈ {0, π/2, π, …}, where one of the amplitudes vanishes and |ψ⟩ is separable.",
        es: "ρ_A = cos²(θ)|0⟩⟨0| + sin²(θ)|1⟩⟨1|. Entonces Tr(ρ_A²) = cos⁴(θ) + sin⁴(θ) = 1 − 2 cos²(θ) sin²(θ) = 1 − (1/2) sin²(2θ). La pureza vale 1 si y sólo si sin(2θ) = 0, es decir θ ∈ {0, π/2, π, …}, valores en los que una de las amplitudes se anula y |ψ⟩ es separable.",
      },
      hints: {
        en: [
          "Expand |ψ⟩⟨ψ| explicitly and only then trace out B.",
          "Cross terms |00⟩⟨11| vanish under Tr_B because ⟨1|0⟩_B = 0.",
        ],
        es: [
          "Expande |ψ⟩⟨ψ| explícitamente y sólo entonces traza fuera B.",
          "Los términos cruzados |00⟩⟨11| desaparecen bajo Tr_B porque ⟨1|0⟩_B = 0.",
        ],
      },
    },
  ],
};
