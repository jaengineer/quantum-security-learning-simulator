import type { TheoryConcept } from "@/features/theory/types";

export const UNIT_ROOTS: TheoryConcept = {
  id: "unit-roots",
  level: "intermediate",
  category: "linear-algebra",
  notation: "abstract",
  tags: ["roots-of-unity", "fourier", "qft", "group"],
  relatedConceptIds: ["unitary-matrices", "spectral-theorem"],

  title: {
    en: "Roots of unity",
    es: "Raíces de la unidad",
  },
  summary: {
    en: "The n complex solutions of zⁿ = 1. They form a cyclic group on the unit circle and underpin the Discrete Fourier Transform used in the QFT.",
    es: "Las n soluciones complejas de zⁿ = 1. Forman un grupo cíclico en la circunferencia unidad y son la base de la transformada de Fourier discreta empleada en la QFT.",
  },
  learningObjectives: {
    en: [
      "List all n-th roots of unity using ω = e^{2πi/n}.",
      "Sum them to show that Σₖ ωᵏ = 0 for 1 ≤ k ≤ n−1.",
      "Recognise the columns of the DFT matrix as evaluations on roots of unity.",
    ],
    es: [
      "Enumerar todas las raíces n-ésimas de la unidad usando ω = e^{2πi/n}.",
      "Sumar la progresión geométrica para mostrar que Σₖ ωᵏ = 0 con 1 ≤ k ≤ n−1.",
      "Reconocer las columnas de la matriz DFT como evaluaciones en raíces de la unidad.",
    ],
  },
  formalDefinition: {
    en: "An n-th root of unity is a complex number z ∈ ℂ such that zⁿ = 1. The set of all such z is {ω^k : k = 0, 1, …, n − 1} where ω = e^{2πi/n} is a primitive n-th root.",
    es: "Una raíz n-ésima de la unidad es un número complejo z ∈ ℂ tal que zⁿ = 1. El conjunto de todas las z es {ω^k : k = 0, 1, …, n − 1}, donde ω = e^{2πi/n} es una raíz n-ésima primitiva.",
  },
  intuitiveExplanation: {
    en: "Plot the unit circle and divide it into n equal arcs. The endpoints of those arcs are the n-th roots of unity. Multiplication by ω rotates the circle by 2π/n radians, which is why the roots form a cyclic group of order n.",
    es: "Dibuja la circunferencia unidad y divídela en n arcos iguales. Los extremos de esos arcos son las raíces n-ésimas de la unidad. Multiplicar por ω rota la circunferencia 2π/n radianes, por lo que las raíces forman un grupo cíclico de orden n.",
  },
  geometricOrPhysicalInterpretation: {
    en: "The DFT matrix F_n has entries (F_n)_{jk} = ω^{jk} / √n. Unitarity of F_n is a direct consequence of the orthogonality of roots of unity: Σⱼ ω^{jk} ω^{-jl} = n · δ_{kl}.",
    es: "La matriz DFT F_n tiene entradas (F_n)_{jk} = ω^{jk} / √n. La unitariedad de F_n es consecuencia directa de la ortogonalidad de las raíces de la unidad: Σⱼ ω^{jk} ω^{-jl} = n · δ_{kl}.",
  },
  examRelevance: {
    en: "Whenever the syllabus covers the Quantum Fourier Transform, Shor's algorithm or characters of cyclic groups, you will need to manipulate sums and products of roots of unity.",
    es: "Cuando el temario cubre la transformada cuántica de Fourier, el algoritmo de Shor o caracteres de grupos cíclicos, hay que manipular sumas y productos de raíces de la unidad.",
  },

  formulas: [
    {
      label: {
        en: "Primitive root",
        es: "Raíz primitiva",
      },
      latex: "\\omega = e^{2\\pi i / n}",
      explanation: {
        en: "All n-th roots are powers of ω.",
        es: "Todas las raíces n-ésimas son potencias de ω.",
      },
    },
    {
      label: {
        en: "Geometric-sum identity",
        es: "Identidad de suma geométrica",
      },
      latex: "\\sum_{k=0}^{n-1} \\omega^{k} = 0 \\;\\; (n \\ge 2)",
      explanation: {
        en: "Sums of all n-th roots of unity vanish, which is the orthogonality used in the DFT.",
        es: "La suma de todas las raíces n-ésimas se anula, lo que da la ortogonalidad usada en la DFT.",
      },
    },
    {
      label: {
        en: "Orthogonality",
        es: "Ortogonalidad",
      },
      latex: "\\sum_{j=0}^{n-1} \\omega^{j(k - \\ell)} = n\\, \\delta_{k\\ell}",
      explanation: {
        en: "Rows/columns of the DFT matrix are pairwise orthogonal.",
        es: "Filas y columnas de la matriz DFT son ortogonales por pares.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Cube roots of unity",
        es: "Raíces cúbicas de la unidad",
      },
      statement: {
        en: "List all cube roots of unity and verify their sum is zero.",
        es: "Enumera las tres raíces cúbicas de la unidad y verifica que su suma es cero.",
      },
      steps: [
        {
          title: {
            en: "Primitive root",
            es: "Raíz primitiva",
          },
          latex: "\\omega = e^{2\\pi i/3} = -\\tfrac{1}{2} + i\\tfrac{\\sqrt{3}}{2}",
          explanation: {
            en: "The first non-trivial cube root.",
            es: "La primera raíz cúbica no trivial.",
          },
        },
        {
          title: {
            en: "List the three roots",
            es: "Enumera las tres raíces",
          },
          latex: "1,\\quad \\omega = -\\tfrac{1}{2} + i\\tfrac{\\sqrt{3}}{2},\\quad \\omega^{2} = -\\tfrac{1}{2} - i\\tfrac{\\sqrt{3}}{2}",
          explanation: {
            en: "ω³ = 1 cycles back.",
            es: "ω³ = 1 cierra el ciclo.",
          },
        },
        {
          title: {
            en: "Add them",
            es: "Súmalas",
          },
          latex: "1 + \\omega + \\omega^{2} = 1 + (-\\tfrac{1}{2} + i\\tfrac{\\sqrt{3}}{2}) + (-\\tfrac{1}{2} - i\\tfrac{\\sqrt{3}}{2}) = 0",
          explanation: {
            en: "Real parts add to 0; imaginary parts cancel.",
            es: "Las partes reales suman 0; las imaginarias se cancelan.",
          },
        },
      ],
      finalAnswer: {
        en: "{1, ω, ω²} with ω = e^{2πi/3}; their sum is 0.",
        es: "{1, ω, ω²} con ω = e^{2πi/3}; su suma es 0.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Confusing 'primitive' n-th roots with 'all' n-th roots; only generators of the cyclic group are primitive.",
      "Forgetting the conjugate ω̄ = ω^{n−1}; many proofs need this identity.",
      "Treating the DFT matrix as F_n F_n^T = I; it is F_n F_n† = I (the conjugate matters).",
    ],
    es: [
      "Confundir raíces n-ésimas «primitivas» con «todas» las n-ésimas; sólo los generadores del grupo cíclico son primitivos.",
      "Olvidar la conjugada ω̄ = ω^{n−1}; muchas demostraciones la necesitan.",
      "Tratar la matriz DFT como F_n F_n^T = I; es F_n F_n† = I (la conjugación importa).",
    ],
  },

  examQuestions: [
    {
      id: "unit-roots-q1",
      difficulty: "medium",
      statement: {
        en: "Show that the n-th roots of unity are exactly the eigenvalues of the cyclic shift matrix S (with Sᵢⱼ = δ_{i+1,j} mod n).",
        es: "Demuestra que las raíces n-ésimas de la unidad son exactamente los autovalores de la matriz de desplazamiento cíclico S (con Sᵢⱼ = δ_{i+1,j} mod n).",
      },
      expectedAnswer: {
        en: "S is the regular representation of the cyclic group ℤ_n: Sⁿ = I, hence its eigenvalues satisfy λⁿ = 1. The eigenvectors are vₖ = (1, ω^k, ω^{2k}, …, ω^{(n−1)k})ᵀ with eigenvalue ω^k = e^{2πik/n}. As k runs over 0, …, n−1 we hit each n-th root of unity exactly once.",
        es: "S es la representación regular del grupo cíclico ℤ_n: Sⁿ = I, así que sus autovalores cumplen λⁿ = 1. Los autovectores son vₖ = (1, ω^k, ω^{2k}, …, ω^{(n−1)k})ᵀ con autovalor ω^k = e^{2πik/n}. Recorriendo k = 0, …, n−1 obtenemos cada raíz n-ésima de la unidad exactamente una vez.",
      },
      hints: {
        en: [
          "Show Sⁿ = I and conclude λⁿ = 1.",
          "Try the ansatz vₖ_j = ω^{jk} and check S vₖ = ω^k vₖ.",
        ],
        es: [
          "Demuestra que Sⁿ = I y concluye que λⁿ = 1.",
          "Prueba el ansatz vₖ_j = ω^{jk} y verifica S vₖ = ω^k vₖ.",
        ],
      },
    },
  ],
};
