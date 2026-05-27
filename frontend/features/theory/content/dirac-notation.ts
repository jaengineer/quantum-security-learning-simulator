import type { TheoryConcept } from "@/features/theory/types";

export const DIRAC_NOTATION: TheoryConcept = {
  id: "dirac-notation",
  level: "basic",
  category: "quantum-mechanics",
  notation: "bra-ket",
  tags: ["dirac", "bra-ket", "operators", "inner-product"],
  relatedConceptIds: ["inner-product", "unitary-matrices", "hermitian-matrices"],

  title: {
    en: "Dirac (bra-ket) notation",
    es: "Notación de Dirac (bra-ket)",
  },
  summary: {
    en: "A compact notation that turns vectors into kets |ψ⟩, dual vectors into bras ⟨ψ|, and operators into outer products |φ⟩⟨ψ|.",
    es: "Una notación compacta que escribe vectores como kets |ψ⟩, sus duales como bras ⟨ψ| y operadores como productos externos |φ⟩⟨ψ|.",
  },
  learningObjectives: {
    en: [
      "Translate column vectors and row vectors into kets and bras.",
      "Identify ⟨ψ|φ⟩ as an inner product (a scalar) and |ψ⟩⟨φ| as an outer product (an operator).",
      "Use linearity ⟨ψ| (α|φ⟩ + β|χ⟩) = α⟨ψ|φ⟩ + β⟨ψ|χ⟩ to manipulate expressions.",
    ],
    es: [
      "Traducir vectores columna y vectores fila a kets y bras.",
      "Identificar ⟨ψ|φ⟩ como producto interno (un escalar) y |ψ⟩⟨φ| como producto externo (un operador).",
      "Usar la linealidad ⟨ψ| (α|φ⟩ + β|χ⟩) = α⟨ψ|φ⟩ + β⟨ψ|χ⟩ para manipular expresiones.",
    ],
  },
  formalDefinition: {
    en: "Given a complex Hilbert space H with inner product ⟨·,·⟩, a ket |ψ⟩ ∈ H is a vector and the bra ⟨ψ| is the linear functional v ↦ ⟨ψ, v⟩ in the dual space H*. Composition ⟨ψ|φ⟩ recovers the inner product; the outer product |φ⟩⟨ψ| acts on a vector |χ⟩ as ⟨ψ|χ⟩ · |φ⟩.",
    es: "Dado un espacio de Hilbert complejo H con producto interno ⟨·,·⟩, un ket |ψ⟩ ∈ H es un vector y el bra ⟨ψ| es el funcional lineal v ↦ ⟨ψ, v⟩ del espacio dual H*. La composición ⟨ψ|φ⟩ recupera el producto interno; el producto externo |φ⟩⟨ψ| actúa sobre |χ⟩ como ⟨ψ|χ⟩ · |φ⟩.",
  },
  intuitiveExplanation: {
    en: "Think of |ψ⟩ as a column vector and ⟨ψ| as its conjugate-transposed row vector. Then ⟨ψ|φ⟩ is a 1×1 matrix (a scalar) and |φ⟩⟨ψ| is an n×n matrix (an operator). The notation makes physics formulas read almost like English: 'apply this bra to that ket'.",
    es: "Piensa en |ψ⟩ como un vector columna y en ⟨ψ| como su conjugada traspuesta (vector fila). Entonces ⟨ψ|φ⟩ es una matriz 1×1 (un escalar) y |φ⟩⟨ψ| es una matriz n×n (un operador). La notación hace que las fórmulas de física se lean casi como en lenguaje natural: «aplicamos este bra a aquel ket».",
  },
  geometricOrPhysicalInterpretation: {
    en: "If {|0⟩, |1⟩} is an orthonormal basis, every state |ψ⟩ = α|0⟩ + β|1⟩ has coordinates α = ⟨0|ψ⟩, β = ⟨1|ψ⟩. The projector onto |0⟩ is |0⟩⟨0|; measuring in the {|0⟩, |1⟩} basis is computing |⟨0|ψ⟩|² and |⟨1|ψ⟩|².",
    es: "Si {|0⟩, |1⟩} es una base ortonormal, todo estado |ψ⟩ = α|0⟩ + β|1⟩ tiene coordenadas α = ⟨0|ψ⟩, β = ⟨1|ψ⟩. El proyector sobre |0⟩ es |0⟩⟨0|; medir en la base {|0⟩, |1⟩} consiste en calcular |⟨0|ψ⟩|² y |⟨1|ψ⟩|².",
  },
  examRelevance: {
    en: "Most algebraic manipulations in quantum mechanics are written in this notation. Exam questions routinely require you to expand ⟨ψ|A|φ⟩, to compute expectation values, or to recognise a sum of projectors as a resolution of the identity.",
    es: "La mayoría de manipulaciones algebraicas en mecánica cuántica se escriben en esta notación. Las preguntas de examen suelen pedir expandir ⟨ψ|A|φ⟩, calcular valores esperados o reconocer una suma de proyectores como una resolución de la identidad.",
  },

  formulas: [
    {
      label: {
        en: "Inner product (bra times ket)",
        es: "Producto interno (bra por ket)",
      },
      latex: "\\langle \\psi | \\phi \\rangle = \\sum_{i} \\overline{\\psi_i}\\, \\phi_i \\in \\mathbb{C}",
      explanation: {
        en: "Always a scalar. Reduces to the column-vector inner product in coordinates.",
        es: "Siempre un escalar. En coordenadas se reduce al producto interno entre vectores columna.",
      },
    },
    {
      label: {
        en: "Outer product (ket times bra)",
        es: "Producto externo (ket por bra)",
      },
      latex: "|\\phi\\rangle \\langle \\psi| \\;: \\; |\\chi\\rangle \\mapsto \\langle \\psi | \\chi \\rangle\\, |\\phi\\rangle",
      explanation: {
        en: "Always an operator. Used to write projectors |ψ⟩⟨ψ| onto a 1-dimensional subspace.",
        es: "Siempre un operador. Se usa para escribir proyectores |ψ⟩⟨ψ| sobre un subespacio unidimensional.",
      },
    },
    {
      label: {
        en: "Resolution of the identity",
        es: "Resolución de la identidad",
      },
      latex: "\\sum_{i} |e_i\\rangle\\langle e_i| = \\mathbb{1}",
      explanation: {
        en: "Holds for any orthonormal basis {|eᵢ⟩}; lets you 'insert the identity' in any expression.",
        es: "Se cumple para cualquier base ortonormal {|eᵢ⟩}; permite «insertar la identidad» en cualquier expresión.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Expand ⟨0| on a superposition",
        es: "Expandir ⟨0| sobre una superposición",
      },
      statement: {
        en: "Given |ψ⟩ = α|0⟩ + β|1⟩ with {|0⟩, |1⟩} orthonormal, compute ⟨0|ψ⟩ and ⟨1|ψ⟩.",
        es: "Dado |ψ⟩ = α|0⟩ + β|1⟩ con {|0⟩, |1⟩} ortonormales, calcula ⟨0|ψ⟩ y ⟨1|ψ⟩.",
      },
      steps: [
        {
          title: {
            en: "Apply linearity",
            es: "Aplica linealidad",
          },
          latex: "\\langle 0 | \\psi \\rangle = \\alpha \\langle 0 | 0 \\rangle + \\beta \\langle 0 | 1 \\rangle",
          explanation: {
            en: "Bra-ket distributes over the sum on the right.",
            es: "El bra distribuye sobre la suma de la derecha.",
          },
        },
        {
          title: {
            en: "Use orthonormality",
            es: "Usa ortonormalidad",
          },
          latex: "\\langle 0 | 0 \\rangle = 1, \\quad \\langle 0 | 1 \\rangle = 0",
          explanation: {
            en: "By definition of the basis.",
            es: "Por definición de la base.",
          },
        },
        {
          title: {
            en: "Read the coefficient",
            es: "Lee el coeficiente",
          },
          latex: "\\langle 0 | \\psi \\rangle = \\alpha, \\quad \\langle 1 | \\psi \\rangle = \\beta",
          explanation: {
            en: "The bras pick out the components in the basis.",
            es: "Los bras extraen las componentes en la base.",
          },
        },
      ],
      finalAnswer: {
        en: "⟨0|ψ⟩ = α and ⟨1|ψ⟩ = β.",
        es: "⟨0|ψ⟩ = α y ⟨1|ψ⟩ = β.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Treating ⟨ψ|φ⟩ as |φ⟩⟨ψ|. The first is a scalar; the second is an operator.",
      "Forgetting the conjugate when going from a ket to its bra in coordinates.",
      "Writing ⟨ψ|A|φ⟩ as ⟨ψ|·A·|φ⟩ and not as a single scalar; it is one scalar.",
    ],
    es: [
      "Confundir ⟨ψ|φ⟩ con |φ⟩⟨ψ|. El primero es un escalar; el segundo es un operador.",
      "Olvidar la conjugación al pasar de un ket a su bra en coordenadas.",
      "Escribir ⟨ψ|A|φ⟩ como ⟨ψ|·A·|φ⟩ y no como un único escalar; es un solo escalar.",
    ],
  },

  examQuestions: [
    {
      id: "dirac-q1",
      difficulty: "easy",
      statement: {
        en: "Show that the operator P = |+⟩⟨+| with |+⟩ = (|0⟩ + |1⟩)/√2 is a projector, i.e. P² = P.",
        es: "Demuestra que el operador P = |+⟩⟨+| con |+⟩ = (|0⟩ + |1⟩)/√2 es un proyector, es decir P² = P.",
      },
      expectedAnswer: {
        en: "Compute P² = |+⟩⟨+|+⟩⟨+|. Since ⟨+|+⟩ = 1 by normalisation, P² = |+⟩ · 1 · ⟨+| = |+⟩⟨+| = P. So P is idempotent and therefore a projector.",
        es: "Calculamos P² = |+⟩⟨+|+⟩⟨+|. Como ⟨+|+⟩ = 1 por normalización, P² = |+⟩ · 1 · ⟨+| = |+⟩⟨+| = P. Luego P es idempotente y por tanto un proyector.",
      },
      hints: {
        en: [
          "Use that ⟨+|+⟩ is a scalar that can be pulled out of the middle.",
          "A projector satisfies P² = P; you only need to verify that identity.",
        ],
        es: [
          "Usa que ⟨+|+⟩ es un escalar que se puede sacar del centro.",
          "Un proyector cumple P² = P; basta con verificar esa identidad.",
        ],
      },
    },
  ],
};
