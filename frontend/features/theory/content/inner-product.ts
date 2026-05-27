import type { TheoryConcept } from "@/features/theory/types";

export const INNER_PRODUCT: TheoryConcept = {
  id: "inner-product",
  level: "basic",
  category: "linear-algebra",
  notation: "matrix",
  tags: ["inner-product", "complex-vector-space", "norm", "orthogonality"],
  relatedConceptIds: ["dirac-notation", "gram-schmidt", "unitary-matrices"],

  title: {
    en: "Inner product on complex vector spaces",
    es: "Producto interno en espacios vectoriales complejos",
  },
  summary: {
    en: "A sesquilinear map that pairs two complex vectors into a scalar, encoding length and angle.",
    es: "Una aplicación sesquilineal que empareja dos vectores complejos en un escalar y codifica longitud y ángulo.",
  },
  learningObjectives: {
    en: [
      "Identify the three defining properties of a complex inner product.",
      "Compute the inner product of two column vectors using the conjugate transpose.",
      "Derive the induced norm and the Cauchy–Schwarz inequality.",
    ],
    es: [
      "Identificar las tres propiedades que definen un producto interno complejo.",
      "Calcular el producto interno de dos vectores columna usando la conjugada traspuesta.",
      "Deducir la norma inducida y la desigualdad de Cauchy–Schwarz.",
    ],
  },
  formalDefinition: {
    en: "An inner product on a complex vector space V is a map ⟨·,·⟩ : V × V → ℂ that is conjugate-linear in the first argument, linear in the second, conjugate-symmetric (⟨u, v⟩ = conj(⟨v, u⟩)) and positive definite (⟨v, v⟩ ≥ 0, with equality iff v = 0).",
    es: "Un producto interno en un espacio vectorial complejo V es una aplicación ⟨·,·⟩ : V × V → ℂ conjugado-lineal en el primer argumento, lineal en el segundo, conjugado-simétrica (⟨u, v⟩ = conj(⟨v, u⟩)) y definida positiva (⟨v, v⟩ ≥ 0, con igualdad si y sólo si v = 0).",
  },
  intuitiveExplanation: {
    en: "The inner product generalises the dot product to the complex setting. The conjugate on the first slot is what keeps ⟨v, v⟩ real and non-negative, so we can still recover a notion of length √⟨v, v⟩ and a notion of orthogonality (⟨u, v⟩ = 0). Without the conjugate the norm would not be positive definite over ℂ.",
    es: "El producto interno generaliza el producto escalar al caso complejo. La conjugación en la primera entrada es lo que mantiene ⟨v, v⟩ real y no negativo, de modo que seguimos teniendo longitud √⟨v, v⟩ y ortogonalidad (⟨u, v⟩ = 0). Sin la conjugación, la norma no sería definida positiva sobre ℂ.",
  },
  geometricOrPhysicalInterpretation: {
    en: "In quantum mechanics ⟨ψ | φ⟩ is the probability amplitude of finding the state |φ⟩ when the system is prepared in |ψ⟩. The squared modulus |⟨ψ | φ⟩|² gives the actual transition probability and lives in [0, 1] thanks to Cauchy–Schwarz.",
    es: "En mecánica cuántica ⟨ψ | φ⟩ es la amplitud de probabilidad de encontrar el estado |φ⟩ cuando el sistema está preparado en |ψ⟩. El módulo al cuadrado |⟨ψ | φ⟩|² da la probabilidad de transición real, y vive en [0, 1] gracias a Cauchy–Schwarz.",
  },
  examRelevance: {
    en: "The inner product underpins every later notion in this catalog: orthonormal bases, Gram–Schmidt, unitary maps, hermitian operators and density matrices. Almost every exam has at least one item asking you to compute or to manipulate ⟨u, v⟩ symbolically.",
    es: "El producto interno sustenta casi todo lo demás en este catálogo: bases ortonormales, Gram–Schmidt, aplicaciones unitarias, operadores hermitianos y matrices de densidad. Prácticamente todo examen tiene al menos un ejercicio que pide calcular o manipular ⟨u, v⟩ simbólicamente.",
  },

  formulas: [
    {
      label: {
        en: "Inner product on ℂⁿ",
        es: "Producto interno en ℂⁿ",
      },
      latex: "\\langle u, v \\rangle = \\sum_{i=1}^{n} \\overline{u_i}\\, v_i = u^{*} v",
      explanation: {
        en: "Conjugate the entries of the first vector, then take the ordinary dot product. The result is a complex scalar.",
        es: "Conjuga las entradas del primer vector y calcula el producto escalar habitual. El resultado es un escalar complejo.",
      },
    },
    {
      label: {
        en: "Induced norm",
        es: "Norma inducida",
      },
      latex: "\\|v\\| = \\sqrt{\\langle v, v \\rangle}",
      explanation: {
        en: "The norm is always real and non-negative because ⟨v, v⟩ is real and non-negative.",
        es: "La norma siempre es real y no negativa porque ⟨v, v⟩ lo es.",
      },
    },
    {
      label: {
        en: "Cauchy–Schwarz inequality",
        es: "Desigualdad de Cauchy–Schwarz",
      },
      latex: "|\\langle u, v \\rangle| \\le \\|u\\| \\cdot \\|v\\|",
      explanation: {
        en: "Equality holds iff u and v are linearly dependent.",
        es: "La igualdad se cumple si y sólo si u y v son linealmente dependientes.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Inner product of two ℂ² vectors",
        es: "Producto interno de dos vectores en ℂ²",
      },
      statement: {
        en: "Compute ⟨u, v⟩ for u = (1 + i, 2)ᵀ and v = (3, i)ᵀ.",
        es: "Calcula ⟨u, v⟩ para u = (1 + i, 2)ᵀ y v = (3, i)ᵀ.",
      },
      steps: [
        {
          title: {
            en: "Conjugate the first vector",
            es: "Conjuga el primer vector",
          },
          latex: "\\overline{u} = (1 - i,\\; 2)",
          explanation: {
            en: "Take the complex conjugate of every entry of u.",
            es: "Toma la conjugada compleja de cada entrada de u.",
          },
        },
        {
          title: {
            en: "Pair entry by entry",
            es: "Empareja entrada a entrada",
          },
          latex: "\\langle u, v \\rangle = (1 - i)\\cdot 3 + 2 \\cdot i",
          explanation: {
            en: "Multiply the conjugated u against v component-wise and sum.",
            es: "Multiplica la u conjugada por v componente a componente y suma.",
          },
        },
        {
          title: {
            en: "Simplify",
            es: "Simplifica",
          },
          latex: "= 3 - 3i + 2i = 3 - i",
          explanation: {
            en: "Combine real and imaginary parts.",
            es: "Combina partes real e imaginaria.",
          },
        },
      ],
      finalAnswer: {
        en: "⟨u, v⟩ = 3 − i.",
        es: "⟨u, v⟩ = 3 − i.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Forgetting to conjugate the first vector — this breaks conjugate symmetry and the norm stops being real.",
      "Treating ⟨u, v⟩ as commutative; it is conjugate-symmetric, not symmetric.",
      "Computing ⟨v, v⟩ as a complex number with non-zero imaginary part (it is always real).",
    ],
    es: [
      "Olvidar conjugar el primer vector — rompe la simetría conjugada y la norma deja de ser real.",
      "Tratar ⟨u, v⟩ como conmutativo; es conjugado-simétrico, no simétrico.",
      "Calcular ⟨v, v⟩ como un número complejo con parte imaginaria no nula (siempre es real).",
    ],
  },

  examQuestions: [
    {
      id: "inner-product-q1",
      difficulty: "easy",
      statement: {
        en: "Let u = (i, 1)ᵀ and v = (1, −i)ᵀ in ℂ². Compute ⟨u, v⟩ and ‖u‖.",
        es: "Sean u = (i, 1)ᵀ y v = (1, −i)ᵀ en ℂ². Calcula ⟨u, v⟩ y ‖u‖.",
      },
      expectedAnswer: {
        en: "Conjugate u: ū = (−i, 1). Then ⟨u, v⟩ = (−i)(1) + (1)(−i) = −2i. The norm is ‖u‖² = ⟨u, u⟩ = |i|² + |1|² = 2, so ‖u‖ = √2.",
        es: "Conjugamos u: ū = (−i, 1). Entonces ⟨u, v⟩ = (−i)(1) + (1)(−i) = −2i. La norma es ‖u‖² = ⟨u, u⟩ = |i|² + |1|² = 2, luego ‖u‖ = √2.",
      },
      hints: {
        en: [
          "Take the conjugate of every entry of u before pairing it with v.",
          "Recall that the norm uses ⟨v, v⟩, which is the sum of |·|² over the entries.",
        ],
        es: [
          "Conjuga cada entrada de u antes de emparejarla con v.",
          "Recuerda que la norma usa ⟨v, v⟩, que es la suma de |·|² sobre las entradas.",
        ],
      },
    },
  ],
};
