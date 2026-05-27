import type { TheoryConcept } from "@/features/theory/types";

export const GRAM_SCHMIDT: TheoryConcept = {
  id: "gram-schmidt",
  level: "basic",
  category: "linear-algebra",
  notation: "abstract",
  tags: ["orthogonalisation", "projection", "qr-decomposition", "bases"],
  relatedConceptIds: ["inner-product", "unitary-matrices", "spectral-theorem"],

  title: {
    en: "Gram–Schmidt process",
    es: "Proceso de Gram–Schmidt",
  },
  summary: {
    en: "An algorithm that turns any linearly independent set into an orthonormal basis with the same span by iteratively subtracting projections.",
    es: "Algoritmo que convierte cualquier conjunto linealmente independiente en una base ortonormal con el mismo subespacio generado, restando proyecciones de forma iterativa.",
  },
  learningObjectives: {
    en: [
      "Apply the recursion uₖ = vₖ − Σⱼ ⟨eⱼ, vₖ⟩ eⱼ followed by normalisation.",
      "Prove that the resulting set is orthonormal and spans the same subspace.",
      "Relate Gram–Schmidt to the QR decomposition.",
    ],
    es: [
      "Aplicar la recursión uₖ = vₖ − Σⱼ ⟨eⱼ, vₖ⟩ eⱼ seguida de normalización.",
      "Probar que el conjunto resultante es ortonormal y genera el mismo subespacio.",
      "Relacionar Gram–Schmidt con la descomposición QR.",
    ],
  },
  formalDefinition: {
    en: "Let {v₁, …, vₙ} be linearly independent in an inner-product space. Define u₁ = v₁ and uₖ = vₖ − Σⱼ<k (⟨uⱼ, vₖ⟩ / ⟨uⱼ, uⱼ⟩) uⱼ for k ≥ 2. Then {e₁, …, eₙ} with eₖ = uₖ / ‖uₖ‖ is orthonormal and spans the same subspace.",
    es: "Sea {v₁, …, vₙ} un conjunto linealmente independiente en un espacio con producto interno. Definimos u₁ = v₁ y uₖ = vₖ − Σⱼ<k (⟨uⱼ, vₖ⟩ / ⟨uⱼ, uⱼ⟩) uⱼ para k ≥ 2. Entonces {e₁, …, eₙ} con eₖ = uₖ / ‖uₖ‖ es ortonormal y genera el mismo subespacio.",
  },
  intuitiveExplanation: {
    en: "Take v₂ and remove its 'shadow' along the direction of v₁. The leftover piece is orthogonal to v₁. Repeat for v₃ against the first two, and so on. Each step you only subtract what you already understand, so the residue captures the genuinely new direction.",
    es: "Toma v₂ y retira su «sombra» en la dirección de v₁. Lo que queda es ortogonal a v₁. Repite con v₃ contra los dos primeros, y así sucesivamente. En cada paso sólo restas lo que ya entiendes, así que el residuo captura la dirección genuinamente nueva.",
  },
  geometricOrPhysicalInterpretation: {
    en: "Gram–Schmidt is the constructive proof that every finite-dimensional inner-product space admits an orthonormal basis. Numerically it powers the QR decomposition (every matrix A = QR with Q unitary and R upper-triangular).",
    es: "Gram–Schmidt es la prueba constructiva de que todo espacio con producto interno de dimensión finita admite una base ortonormal. Numéricamente da lugar a la descomposición QR (toda matriz A = QR con Q unitaria y R triangular superior).",
  },
  examRelevance: {
    en: "Classical exam tasks include orthonormalising a small set in ℝ² or ℂ², proving that two vectors are orthogonal after the procedure, and connecting it to least-squares or QR.",
    es: "Las tareas de examen clásicas incluyen ortonormalizar un conjunto pequeño en ℝ² o ℂ², probar que dos vectores quedan ortogonales tras el proceso y relacionarlo con mínimos cuadrados o QR.",
  },

  formulas: [
    {
      label: {
        en: "Projection",
        es: "Proyección",
      },
      latex: "\\mathrm{proj}_{u}(v) = \\frac{\\langle u, v \\rangle}{\\langle u, u \\rangle}\\, u",
      explanation: {
        en: "Component of v along u with respect to the chosen inner product.",
        es: "Componente de v en la dirección de u respecto al producto interno elegido.",
      },
    },
    {
      label: {
        en: "Gram–Schmidt recursion",
        es: "Recursión de Gram–Schmidt",
      },
      latex: "u_k = v_k - \\sum_{j=1}^{k-1} \\frac{\\langle u_j, v_k \\rangle}{\\langle u_j, u_j \\rangle}\\, u_j",
      explanation: {
        en: "Subtract every previous projection. The result is orthogonal to all uⱼ with j < k.",
        es: "Resta todas las proyecciones previas. El resultado es ortogonal a todas las uⱼ con j < k.",
      },
    },
    {
      label: {
        en: "Normalisation",
        es: "Normalización",
      },
      latex: "e_k = \\frac{u_k}{\\|u_k\\|}",
      explanation: {
        en: "Scales each orthogonal vector to length 1.",
        es: "Escala cada vector ortogonal a longitud 1.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Orthonormalise two vectors in ℝ²",
        es: "Ortonormaliza dos vectores en ℝ²",
      },
      statement: {
        en: "Apply Gram–Schmidt to v₁ = (1, 1) and v₂ = (1, 0).",
        es: "Aplica Gram–Schmidt a v₁ = (1, 1) y v₂ = (1, 0).",
      },
      steps: [
        {
          title: {
            en: "Set u₁ = v₁ and normalise",
            es: "Toma u₁ = v₁ y normaliza",
          },
          latex: "e_1 = \\tfrac{1}{\\sqrt{2}}(1, 1)",
          explanation: {
            en: "‖v₁‖ = √2.",
            es: "‖v₁‖ = √2.",
          },
        },
        {
          title: {
            en: "Subtract projection",
            es: "Resta la proyección",
          },
          latex: "u_2 = v_2 - \\langle e_1, v_2 \\rangle e_1 = (1, 0) - \\tfrac{1}{\\sqrt{2}} \\cdot \\tfrac{1}{\\sqrt{2}}(1, 1) = (\\tfrac{1}{2}, -\\tfrac{1}{2})",
          explanation: {
            en: "Compute ⟨e₁, v₂⟩ = 1/√2 then subtract its multiple of e₁.",
            es: "Calcula ⟨e₁, v₂⟩ = 1/√2 y resta el múltiplo correspondiente de e₁.",
          },
        },
        {
          title: {
            en: "Normalise u₂",
            es: "Normaliza u₂",
          },
          latex: "e_2 = \\tfrac{1}{\\sqrt{2}}(1, -1)",
          explanation: {
            en: "‖u₂‖ = 1/√2, dividing yields e₂.",
            es: "‖u₂‖ = 1/√2; al dividir se obtiene e₂.",
          },
        },
      ],
      finalAnswer: {
        en: "{e₁, e₂} = {(1, 1)/√2, (1, −1)/√2} is an orthonormal basis of ℝ² with the same span as {v₁, v₂}.",
        es: "{e₁, e₂} = {(1, 1)/√2, (1, −1)/√2} es base ortonormal de ℝ² con el mismo subespacio generado que {v₁, v₂}.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Forgetting to normalise: you get an orthogonal but not orthonormal set.",
      "Using the original vᵢ instead of the already-orthogonalised uᵢ in later projections.",
      "Not conjugating in the complex case: the projection uses ⟨uⱼ, vₖ⟩, not ⟨vₖ, uⱼ⟩.",
    ],
    es: [
      "Olvidar normalizar: queda un conjunto ortogonal pero no ortonormal.",
      "Usar las vᵢ originales en lugar de las uᵢ ya ortogonalizadas en las proyecciones posteriores.",
      "No conjugar en el caso complejo: la proyección usa ⟨uⱼ, vₖ⟩, no ⟨vₖ, uⱼ⟩.",
    ],
  },

  examQuestions: [
    {
      id: "gram-schmidt-q1",
      difficulty: "easy",
      statement: {
        en: "Orthonormalise v₁ = (1, 0, 1) and v₂ = (1, 1, 0) in ℝ³ with the standard inner product.",
        es: "Ortonormaliza v₁ = (1, 0, 1) y v₂ = (1, 1, 0) en ℝ³ con el producto interno estándar.",
      },
      expectedAnswer: {
        en: "e₁ = (1/√2)(1, 0, 1). ⟨e₁, v₂⟩ = 1/√2, so u₂ = (1, 1, 0) − (1/2)(1, 0, 1) = (1/2, 1, −1/2). ‖u₂‖ = √(1/4 + 1 + 1/4) = √(3/2). Hence e₂ = (1/√6)(1, 2, −1).",
        es: "e₁ = (1/√2)(1, 0, 1). ⟨e₁, v₂⟩ = 1/√2, luego u₂ = (1, 1, 0) − (1/2)(1, 0, 1) = (1/2, 1, −1/2). ‖u₂‖ = √(1/4 + 1 + 1/4) = √(3/2). Por tanto e₂ = (1/√6)(1, 2, −1).",
      },
      hints: {
        en: [
          "Normalise v₁ first, then project v₂ onto e₁.",
          "Check ⟨e₁, e₂⟩ = 0 as a sanity check after normalising u₂.",
        ],
        es: [
          "Normaliza primero v₁ y luego proyecta v₂ sobre e₁.",
          "Comprueba que ⟨e₁, e₂⟩ = 0 como verificación final tras normalizar u₂.",
        ],
      },
    },
  ],
};
