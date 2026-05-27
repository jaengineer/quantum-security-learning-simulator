import type { TheoryConcept } from "@/features/theory/types";

export const SPECTRAL_THEOREM: TheoryConcept = {
  id: "spectral-theorem",
  level: "advanced",
  category: "linear-algebra",
  notation: "matrix",
  tags: ["diagonalisation", "spectral", "normal-operators", "projectors"],
  relatedConceptIds: ["hermitian-matrices", "unitary-matrices", "density-matrix"],

  title: {
    en: "Spectral theorem",
    es: "Teorema espectral",
  },
  summary: {
    en: "Every normal operator on a finite-dimensional complex space is unitarily diagonalisable. In particular, hermitian and unitary operators admit a complete orthonormal eigenbasis.",
    es: "Todo operador normal en un espacio complejo de dimensión finita es diagonalizable mediante una unitaria. En particular, los operadores hermitianos y unitarios admiten una base propia ortonormal completa.",
  },
  learningObjectives: {
    en: [
      "Define a normal operator (AA† = A†A) and identify which operators qualify.",
      "Use A = U D U† to compute powers, exponentials and functions of A.",
      "Write A as a sum of orthogonal projectors weighted by its eigenvalues (spectral decomposition).",
    ],
    es: [
      "Definir un operador normal (AA† = A†A) e identificar qué operadores lo son.",
      "Usar A = U D U† para calcular potencias, exponenciales y funciones de A.",
      "Escribir A como suma de proyectores ortogonales ponderados por sus autovalores (descomposición espectral).",
    ],
  },
  formalDefinition: {
    en: "Let A be a linear operator on a finite-dimensional complex inner-product space H. If A is normal (AA† = A†A) there exists a unitary U and a diagonal D such that A = U D U†. Equivalently, H admits an orthonormal basis of eigenvectors of A.",
    es: "Sea A un operador lineal sobre un espacio H complejo de dimensión finita con producto interno. Si A es normal (AA† = A†A) existen una unitaria U y una matriz diagonal D tales que A = U D U†. Equivalentemente, H admite una base ortonormal de autovectores de A.",
  },
  intuitiveExplanation: {
    en: "Normal matrices commute with their adjoint. That commutativity is exactly what is needed for the eigenspaces to be mutually orthogonal. The theorem packages every such matrix into a 'rotation × scaling × rotation⁻¹' factorisation, mirroring real symmetric matrices but with U unitary instead of orthogonal.",
    es: "Las matrices normales conmutan con su adjunta. Esa conmutatividad es exactamente lo que necesita el espectro para que los autoespacios sean mutuamente ortogonales. El teorema empaqueta cada matriz de ese tipo en una factorización «rotación × escalado × rotación⁻¹», análogo al caso simétrico real pero con U unitaria en lugar de ortogonal.",
  },
  geometricOrPhysicalInterpretation: {
    en: "In quantum mechanics every observable and every closed-system evolution is described by a normal operator (hermitian or unitary). The spectral theorem turns every measurement into a sum of projectors and every evolution into a product of phase factors on an eigenbasis.",
    es: "En mecánica cuántica todo observable y toda evolución de sistema cerrado se describen con un operador normal (hermitiano o unitario). El teorema espectral convierte toda medida en una suma de proyectores y toda evolución en un producto de factores de fase sobre una base propia.",
  },
  examRelevance: {
    en: "Spectral decomposition is the standard tool for computing functions of operators (e.g. e^{−iHt}) and for proving identities about hermitian/unitary matrices in exam settings.",
    es: "La descomposición espectral es la herramienta estándar para calcular funciones de operadores (p. ej. e^{−iHt}) y para demostrar identidades sobre matrices hermitianas/unitarias en exámenes.",
  },

  formulas: [
    {
      label: {
        en: "Diagonal form",
        es: "Forma diagonal",
      },
      latex: "A = U D U^{\\dagger}, \\quad D = \\mathrm{diag}(\\lambda_1, \\dots, \\lambda_n)",
      explanation: {
        en: "Columns of U are the orthonormal eigenvectors associated to the diagonal eigenvalues.",
        es: "Las columnas de U son los autovectores ortonormales asociados a los autovalores diagonales.",
      },
    },
    {
      label: {
        en: "Projector sum form",
        es: "Forma como suma de proyectores",
      },
      latex: "A = \\sum_{i} \\lambda_i\\, P_i, \\quad P_i = |e_i\\rangle\\langle e_i|, \\quad \\sum_i P_i = \\mathbb{1}",
      explanation: {
        en: "Useful for computing f(A) = Σ f(λᵢ) Pᵢ for any function f.",
        es: "Útil para calcular f(A) = Σ f(λᵢ) Pᵢ para cualquier función f.",
      },
    },
    {
      label: {
        en: "Function of A",
        es: "Función de A",
      },
      latex: "f(A) = U\\, f(D)\\, U^{\\dagger}",
      explanation: {
        en: "Apply f to each diagonal entry; this is how exponentials of hermitian generators are computed.",
        es: "Aplica f a cada entrada diagonal; así se calculan exponenciales de generadores hermitianos.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Spectral decomposition of Pauli Z",
        es: "Descomposición espectral de Pauli Z",
      },
      statement: {
        en: "Decompose Z = [[1, 0], [0, −1]] in the projector form and compute exp(−iZt/2).",
        es: "Descompón Z = [[1, 0], [0, −1]] en forma de proyectores y calcula exp(−iZt/2).",
      },
      steps: [
        {
          title: {
            en: "Read off the spectrum",
            es: "Lee el espectro",
          },
          latex: "\\lambda_1 = +1\\;\\text{with}\\;|0\\rangle, \\quad \\lambda_2 = -1\\;\\text{with}\\;|1\\rangle",
          explanation: {
            en: "Z is already diagonal; eigenpairs are immediate.",
            es: "Z ya está diagonal; los pares propios son inmediatos.",
          },
        },
        {
          title: {
            en: "Write the projector sum",
            es: "Escribe la suma de proyectores",
          },
          latex: "Z = (+1)\\,|0\\rangle\\langle 0| + (-1)\\,|1\\rangle\\langle 1|",
          explanation: {
            en: "P₀ + P₁ = I, as the spectral theorem promises.",
            es: "P₀ + P₁ = I, como predice el teorema espectral.",
          },
        },
        {
          title: {
            en: "Apply f(λ) = exp(−iλt/2)",
            es: "Aplica f(λ) = exp(−iλt/2)",
          },
          latex: "\\exp(-iZt/2) = e^{-it/2}\\,|0\\rangle\\langle 0| + e^{+it/2}\\,|1\\rangle\\langle 1|",
          explanation: {
            en: "Functions of an operator act on its eigenvalues.",
            es: "Las funciones de un operador actúan sobre sus autovalores.",
          },
        },
      ],
      finalAnswer: {
        en: "exp(−iZt/2) = diag(e^{−it/2}, e^{+it/2}); the spectral decomposition makes this a one-line computation.",
        es: "exp(−iZt/2) = diag(e^{−it/2}, e^{+it/2}); la descomposición espectral lo reduce a un cálculo de una línea.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Trying to apply the theorem to non-normal matrices; they may not be unitarily diagonalisable.",
      "Forgetting orthogonality of distinct-eigenvalue eigenspaces — it is automatic for normal operators and saves time.",
      "Computing f(A) directly via power series when the spectral form is available.",
    ],
    es: [
      "Intentar aplicar el teorema a matrices no normales; pueden no ser diagonalizables mediante unitarias.",
      "Olvidar que los autoespacios de autovalores distintos son ortogonales — es automático para operadores normales y ahorra tiempo.",
      "Calcular f(A) directamente por serie de potencias cuando se dispone de la forma espectral.",
    ],
  },

  examQuestions: [
    {
      id: "spectral-q1",
      difficulty: "hard",
      statement: {
        en: "Let H = a I + b X (a, b ∈ ℝ, X the Pauli-X matrix). Find the spectral decomposition of H and compute exp(−iHt) in closed form.",
        es: "Sea H = a I + b X (a, b ∈ ℝ, X la matriz de Pauli X). Encuentra la descomposición espectral de H y calcula exp(−iHt) en forma cerrada.",
      },
      expectedAnswer: {
        en: "X has eigenvalues ±1 with eigenstates |±⟩ = (|0⟩ ± |1⟩)/√2. Therefore H = (a + b)|+⟩⟨+| + (a − b)|−⟩⟨−|. Hence exp(−iHt) = e^{−i(a+b)t}|+⟩⟨+| + e^{−i(a−b)t}|−⟩⟨−| = e^{−iat}(cos(bt) I − i sin(bt) X).",
        es: "X tiene autovalores ±1 con autoestados |±⟩ = (|0⟩ ± |1⟩)/√2. Entonces H = (a + b)|+⟩⟨+| + (a − b)|−⟩⟨−|. Así exp(−iHt) = e^{−i(a+b)t}|+⟩⟨+| + e^{−i(a−b)t}|−⟩⟨−| = e^{−iat}(cos(bt) I − i sin(bt) X).",
      },
      hints: {
        en: [
          "H is a linear combination of commuting hermitian operators; X already has a simple spectral form.",
          "Use Pᵢ + P_{−} = I and Pᵢ − P_{−} = X to repackage the answer in (I, X) coordinates.",
        ],
        es: [
          "H es una combinación lineal de operadores hermitianos que conmutan; X ya tiene forma espectral sencilla.",
          "Usa P₊ + P₋ = I y P₊ − P₋ = X para reescribir el resultado en coordenadas (I, X).",
        ],
      },
    },
  ],
};
