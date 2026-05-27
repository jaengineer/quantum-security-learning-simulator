import type { TheoryConcept } from "@/features/theory/types";

export const HERMITIAN_MATRICES: TheoryConcept = {
  id: "hermitian-matrices",
  level: "intermediate",
  category: "quantum-mechanics",
  notation: "matrix",
  tags: ["hermitian", "self-adjoint", "observables", "real-eigenvalues"],
  relatedConceptIds: ["inner-product", "unitary-matrices", "spectral-theorem", "density-matrix"],

  title: {
    en: "Hermitian (self-adjoint) matrices",
    es: "Matrices hermitianas (autoadjuntas)",
  },
  summary: {
    en: "Square complex matrices equal to their own conjugate transpose. They have real eigenvalues and orthogonal eigenvectors, which is why they model quantum observables.",
    es: "Matrices complejas cuadradas iguales a su propia conjugada traspuesta. Tienen autovalores reales y autovectores ortogonales, por lo que modelan los observables cuánticos.",
  },
  learningObjectives: {
    en: [
      "Check whether a matrix satisfies A = A†.",
      "Argue that all eigenvalues of A are real.",
      "Relate hermitian operators to physical observables and the Born rule.",
    ],
    es: [
      "Comprobar si una matriz cumple A = A†.",
      "Argumentar que todos los autovalores de A son reales.",
      "Relacionar los operadores hermitianos con los observables físicos y la regla de Born.",
    ],
  },
  formalDefinition: {
    en: "A square matrix A ∈ ℂⁿˣⁿ is hermitian (or self-adjoint) if A = A†, i.e. Aᵢⱼ = conj(Aⱼᵢ) for all i, j.",
    es: "Una matriz cuadrada A ∈ ℂⁿˣⁿ es hermitiana (o autoadjunta) si A = A†, es decir Aᵢⱼ = conj(Aⱼᵢ) para todo i, j.",
  },
  intuitiveExplanation: {
    en: "Hermitian matrices are the complex analogue of symmetric real matrices. The conjugate transpose is the right notion of 'transpose' over ℂ because it interacts properly with the inner product. The reward is that hermitian matrices behave like ordinary numbers: they have a diagonal form over an orthonormal basis with real entries on the diagonal.",
    es: "Las matrices hermitianas son el análogo complejo de las simétricas reales. La conjugada traspuesta es la noción correcta de «traspuesta» sobre ℂ porque interactúa bien con el producto interno. La recompensa es que las hermitianas se comportan como números: admiten una forma diagonal en una base ortonormal con entradas reales en la diagonal.",
  },
  geometricOrPhysicalInterpretation: {
    en: "In quantum mechanics every observable (position, momentum, spin, energy …) is encoded as a hermitian operator. Its eigenvalues are the possible measurement outcomes and its eigenvectors are the corresponding eigenstates.",
    es: "En mecánica cuántica todo observable (posición, momento, espín, energía…) se codifica como un operador hermitiano. Sus autovalores son los posibles resultados de medida y sus autovectores los estados propios correspondientes.",
  },
  examRelevance: {
    en: "Exam tasks usually ask you to verify a given operator is hermitian, to compute its eigenvalues/eigenvectors, or to compute the expectation value ⟨ψ|A|ψ⟩ in a given state.",
    es: "Las tareas de examen suelen pedir verificar que un operador es hermitiano, calcular sus autovalores/autovectores o calcular el valor esperado ⟨ψ|A|ψ⟩ en un estado dado.",
  },

  formulas: [
    {
      label: {
        en: "Hermiticity",
        es: "Hermiticidad",
      },
      latex: "A = A^{\\dagger} \\iff A_{ij} = \\overline{A_{ji}}",
      explanation: {
        en: "Diagonal entries must be real; off-diagonal entries are complex conjugates of each other across the diagonal.",
        es: "Las entradas diagonales deben ser reales; las no diagonales son conjugadas complejas a través de la diagonal.",
      },
    },
    {
      label: {
        en: "Real eigenvalues",
        es: "Autovalores reales",
      },
      latex: "A |\\psi\\rangle = \\lambda |\\psi\\rangle \\Rightarrow \\lambda \\in \\mathbb{R}",
      explanation: {
        en: "Take ⟨ψ|·|ψ⟩ of A|ψ⟩ = λ|ψ⟩ and use ⟨ψ|A|ψ⟩ = conj(⟨ψ|A|ψ⟩).",
        es: "Toma ⟨ψ|·|ψ⟩ en A|ψ⟩ = λ|ψ⟩ y usa ⟨ψ|A|ψ⟩ = conj(⟨ψ|A|ψ⟩).",
      },
    },
    {
      label: {
        en: "Expectation value",
        es: "Valor esperado",
      },
      latex: "\\langle A \\rangle_{\\psi} = \\langle \\psi | A | \\psi \\rangle \\in \\mathbb{R}",
      explanation: {
        en: "Because A is hermitian, ⟨A⟩_ψ is always real for normalised |ψ⟩.",
        es: "Como A es hermitiana, ⟨A⟩_ψ es siempre real para |ψ⟩ normalizado.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Eigenvalues of Pauli X",
        es: "Autovalores de Pauli X",
      },
      statement: {
        en: "Compute the eigenvalues and eigenvectors of X = [[0, 1], [1, 0]].",
        es: "Calcula los autovalores y autovectores de X = [[0, 1], [1, 0]].",
      },
      steps: [
        {
          title: {
            en: "Check hermiticity",
            es: "Verifica la hermiticidad",
          },
          latex: "X^{\\dagger} = \\begin{bmatrix} 0 & 1 \\\\ 1 & 0 \\end{bmatrix} = X",
          explanation: {
            en: "X is real and symmetric, so it is hermitian.",
            es: "X es real y simétrica, luego es hermitiana.",
          },
        },
        {
          title: {
            en: "Characteristic polynomial",
            es: "Polinomio característico",
          },
          latex: "\\det(X - \\lambda \\mathbb{1}) = \\lambda^{2} - 1 = 0",
          explanation: {
            en: "Set det = 0 and solve.",
            es: "Impón det = 0 y resuelve.",
          },
        },
        {
          title: {
            en: "Eigenvalues and eigenvectors",
            es: "Autovalores y autovectores",
          },
          latex: "\\lambda_{\\pm} = \\pm 1, \\quad |+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle), \\; |-\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)",
          explanation: {
            en: "The two eigenstates are orthonormal, as expected for a hermitian operator.",
            es: "Los dos autoestados son ortonormales, como cabe esperar de un operador hermitiano.",
          },
        },
      ],
      finalAnswer: {
        en: "X has eigenvalues ±1 with eigenstates |±⟩ = (|0⟩ ± |1⟩)/√2.",
        es: "X tiene autovalores ±1 con autoestados |±⟩ = (|0⟩ ± |1⟩)/√2.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Confusing hermitian with symmetric: A = Aᵀ over ℂ does not imply hermiticity.",
      "Concluding eigenvalues are non-negative; they are real but can be negative (e.g. Pauli Z has eigenvalues ±1).",
      "Forgetting that eigenvectors of distinct eigenvalues are orthogonal — useful in shortcuts.",
    ],
    es: [
      "Confundir hermitiana con simétrica: A = Aᵀ sobre ℂ no implica hermiticidad.",
      "Concluir que los autovalores son no negativos; son reales pero pueden ser negativos (p. ej. Pauli Z tiene autovalores ±1).",
      "Olvidar que autovectores de autovalores distintos son ortogonales — útil como atajo.",
    ],
  },

  examQuestions: [
    {
      id: "hermitian-q1",
      difficulty: "medium",
      statement: {
        en: "Let A = [[2, 1+i], [1−i, 3]]. Show that A is hermitian and compute ⟨A⟩_ψ for |ψ⟩ = (|0⟩ + i|1⟩)/√2.",
        es: "Sea A = [[2, 1+i], [1−i, 3]]. Demuestra que A es hermitiana y calcula ⟨A⟩_ψ para |ψ⟩ = (|0⟩ + i|1⟩)/√2.",
      },
      expectedAnswer: {
        en: "A is hermitian because A₁₂ = 1+i = conj(A₂₁). The vector |ψ⟩ has coordinates (1, i)ᵀ/√2. Then A|ψ⟩ = ((2 + i(1+i)), ((1−i) + 3i))ᵀ/√2 = ((1 + i), (1 + 2i))ᵀ/√2. ⟨ψ|A|ψ⟩ = (1/2)[(1)(1+i) + (−i)(1+2i)] = (1/2)[(1+i) + (−i + 2)] = (1/2)(3) = 3/2.",
        es: "A es hermitiana porque A₁₂ = 1+i = conj(A₂₁). El vector |ψ⟩ tiene coordenadas (1, i)ᵀ/√2. Entonces A|ψ⟩ = ((2 + i(1+i)), ((1−i) + 3i))ᵀ/√2 = ((1 + i), (1 + 2i))ᵀ/√2. ⟨ψ|A|ψ⟩ = (1/2)[(1)(1+i) + (−i)(1+2i)] = (1/2)[(1+i) + (−i + 2)] = (1/2)(3) = 3/2.",
      },
      hints: {
        en: [
          "Hermiticity needs A₁₂ = conj(A₂₁).",
          "Conjugate-transpose |ψ⟩ before pairing it with A|ψ⟩.",
        ],
        es: [
          "La hermiticidad requiere A₁₂ = conj(A₂₁).",
          "Conjuga y traspone |ψ⟩ antes de emparejarlo con A|ψ⟩.",
        ],
      },
    },
  ],
};
