import type { TheoryConcept } from "@/features/theory/types";

export const DENSITY_MATRIX: TheoryConcept = {
  id: "density-matrix",
  level: "intermediate",
  category: "quantum-information",
  notation: "mixed",
  tags: ["density-matrix", "mixed-states", "trace", "positive-semidefinite"],
  relatedConceptIds: ["hermitian-matrices", "reduced-density-matrix", "quantum-entanglement"],

  title: {
    en: "Density matrix",
    es: "Matriz de densidad",
  },
  summary: {
    en: "A hermitian, positive semidefinite, unit-trace operator that describes pure and mixed quantum states uniformly.",
    es: "Operador hermitiano, semidefinido positivo y de traza unidad que describe estados cuánticos puros y mezcla con un único formalismo.",
  },
  learningObjectives: {
    en: [
      "Translate a pure state |ψ⟩ into its density matrix |ψ⟩⟨ψ|.",
      "Recognise a mixed state as a convex combination ρ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|.",
      "Use Tr(ρ A) to compute the expectation value of an observable A.",
      "Test purity through Tr(ρ²) ≤ 1, with equality iff ρ is pure.",
    ],
    es: [
      "Traducir un estado puro |ψ⟩ a su matriz de densidad |ψ⟩⟨ψ|.",
      "Reconocer un estado mezcla como una combinación convexa ρ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|.",
      "Usar Tr(ρ A) para calcular el valor esperado de un observable A.",
      "Detectar pureza mediante Tr(ρ²) ≤ 1, con igualdad si y sólo si ρ es puro.",
    ],
  },
  formalDefinition: {
    en: "A density matrix ρ on a finite Hilbert space is a linear operator satisfying ρ = ρ† (hermitian), ⟨v | ρ | v⟩ ≥ 0 for all |v⟩ (positive semidefinite) and Tr(ρ) = 1.",
    es: "Una matriz de densidad ρ sobre un espacio de Hilbert finito es un operador lineal que cumple ρ = ρ† (hermitiana), ⟨v | ρ | v⟩ ≥ 0 para todo |v⟩ (semidefinida positiva) y Tr(ρ) = 1.",
  },
  intuitiveExplanation: {
    en: "Density matrices let us describe statistical mixtures of quantum states (classical uncertainty) and entanglement with the environment (quantum uncertainty) in the same object. A pure state has all probability on one |ψ⟩; a maximally mixed state has equal probability on every basis vector and equals I/d.",
    es: "Las matrices de densidad permiten describir mezclas estadísticas de estados (incertidumbre clásica) y entrelazamiento con el entorno (incertidumbre cuántica) en un mismo objeto. Un estado puro concentra toda la probabilidad en un |ψ⟩; un estado máximamente mezcla tiene igual probabilidad en cada vector base y vale I/d.",
  },
  geometricOrPhysicalInterpretation: {
    en: "For a single qubit, ρ can be parametrised by the Bloch vector r ∈ ℝ³ with |r| ≤ 1: pure states sit on the surface of the Bloch sphere (|r| = 1) and mixed states inside the ball.",
    es: "Para un cúbit, ρ se puede parametrizar mediante el vector de Bloch r ∈ ℝ³ con |r| ≤ 1: los estados puros están sobre la esfera de Bloch (|r| = 1) y los mezcla en el interior de la bola.",
  },
  examRelevance: {
    en: "Density matrices appear whenever the question involves mixed states, measurement statistics, partial information or decoherence. Exam items typically ask you to identify the kind of state, compute Tr(ρ²) or apply the Born rule for ρ.",
    es: "Las matrices de densidad aparecen siempre que el problema involucra estados mezcla, estadística de medidas, información parcial o decoherencia. Los ejercicios suelen pedir clasificar el estado, calcular Tr(ρ²) o aplicar la regla de Born sobre ρ.",
  },

  formulas: [
    {
      label: {
        en: "Pure-state density matrix",
        es: "Matriz de densidad de un estado puro",
      },
      latex: "\\rho_{\\psi} = |\\psi\\rangle\\langle\\psi|",
      explanation: {
        en: "Always rank one. A pure state has Tr(ρ²) = 1.",
        es: "Siempre tiene rango uno. Un estado puro cumple Tr(ρ²) = 1.",
      },
    },
    {
      label: {
        en: "Mixed-state ensemble",
        es: "Mezcla estadística",
      },
      latex: "\\rho = \\sum_{i} p_i\\, |\\psi_i\\rangle\\langle\\psi_i|, \\quad p_i \\ge 0, \\; \\sum_i p_i = 1",
      explanation: {
        en: "A convex combination of pure states. Many ensembles produce the same ρ.",
        es: "Una combinación convexa de estados puros. Muchos ensambles distintos pueden generar la misma ρ.",
      },
    },
    {
      label: {
        en: "Born rule for ρ",
        es: "Regla de Born para ρ",
      },
      latex: "\\langle A \\rangle_{\\rho} = \\mathrm{Tr}(\\rho A)",
      explanation: {
        en: "Generalises ⟨ψ|A|ψ⟩ to mixed states.",
        es: "Generaliza ⟨ψ|A|ψ⟩ al caso de estados mezcla.",
      },
    },
    {
      label: {
        en: "Purity",
        es: "Pureza",
      },
      latex: "\\mathrm{Tr}(\\rho^{2}) \\le 1",
      explanation: {
        en: "Equality holds iff ρ is pure. Lower values indicate more mixing.",
        es: "La igualdad se cumple si y sólo si ρ es puro. Valores menores indican más mezcla.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Density matrix of a 50/50 |0⟩, |1⟩ mixture",
        es: "Matriz de densidad de una mezcla 50/50 de |0⟩ y |1⟩",
      },
      statement: {
        en: "Compute ρ for the ensemble {(1/2, |0⟩), (1/2, |1⟩)}, then evaluate Tr(ρ²) and ⟨Z⟩.",
        es: "Calcula ρ para el ensamble {(1/2, |0⟩), (1/2, |1⟩)} y evalúa Tr(ρ²) y ⟨Z⟩.",
      },
      steps: [
        {
          title: {
            en: "Form ρ",
            es: "Forma ρ",
          },
          latex: "\\rho = \\tfrac{1}{2} |0\\rangle\\langle 0| + \\tfrac{1}{2} |1\\rangle\\langle 1| = \\tfrac{1}{2} \\mathbb{1}",
          explanation: {
            en: "Maximally mixed single-qubit state.",
            es: "Estado máximamente mezcla de un cúbit.",
          },
        },
        {
          title: {
            en: "Compute Tr(ρ²)",
            es: "Calcula Tr(ρ²)",
          },
          latex: "\\rho^{2} = \\tfrac{1}{4} \\mathbb{1} \\Rightarrow \\mathrm{Tr}(\\rho^{2}) = \\tfrac{1}{4} \\cdot 2 = \\tfrac{1}{2}",
          explanation: {
            en: "Tr(ρ²) = 1/2 < 1 confirms ρ is mixed.",
            es: "Tr(ρ²) = 1/2 < 1 confirma que ρ es mezcla.",
          },
        },
        {
          title: {
            en: "Apply the Born rule",
            es: "Aplica la regla de Born",
          },
          latex: "\\langle Z \\rangle = \\mathrm{Tr}(\\rho Z) = \\tfrac{1}{2}\\,\\mathrm{Tr}(Z) = 0",
          explanation: {
            en: "Z is traceless; the mixture has zero average z-magnetisation.",
            es: "Z tiene traza nula; la mezcla tiene magnetización z media cero.",
          },
        },
      ],
      finalAnswer: {
        en: "ρ = I/2, Tr(ρ²) = 1/2, ⟨Z⟩ = 0. The state is maximally mixed.",
        es: "ρ = I/2, Tr(ρ²) = 1/2, ⟨Z⟩ = 0. El estado es máximamente mezcla.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Treating ρ as a vector instead of an operator; |ψ⟩⟨ψ| is a matrix.",
      "Forgetting Tr(ρ) = 1 when proposing a density matrix.",
      "Confusing 'mixed state' with 'superposition'. Superpositions are pure.",
    ],
    es: [
      "Tratar ρ como vector en lugar de operador; |ψ⟩⟨ψ| es una matriz.",
      "Olvidar Tr(ρ) = 1 al proponer una matriz de densidad.",
      "Confundir «estado mezcla» con «superposición». Las superposiciones son puras.",
    ],
  },

  examQuestions: [
    {
      id: "density-q1",
      difficulty: "medium",
      statement: {
        en: "Given ρ = (1/2)|0⟩⟨0| + (1/2)|+⟩⟨+|, write ρ as a 2×2 matrix and compute Tr(ρ²). Is the state pure?",
        es: "Dada ρ = (1/2)|0⟩⟨0| + (1/2)|+⟩⟨+|, escribe ρ como matriz 2×2 y calcula Tr(ρ²). ¿Es un estado puro?",
      },
      expectedAnswer: {
        en: "|+⟩⟨+| = (1/2)[[1,1],[1,1]]. So ρ = (1/2)[[1,0],[0,0]] + (1/4)[[1,1],[1,1]] = [[3/4, 1/4], [1/4, 1/4]]. Tr(ρ²) = (3/4)² + 2(1/4)² + (1/4)² = 9/16 + 2/16 + 1/16 = 12/16 = 3/4. Since 3/4 < 1, ρ is mixed.",
        es: "|+⟩⟨+| = (1/2)[[1,1],[1,1]]. Entonces ρ = (1/2)[[1,0],[0,0]] + (1/4)[[1,1],[1,1]] = [[3/4, 1/4], [1/4, 1/4]]. Tr(ρ²) = (3/4)² + 2(1/4)² + (1/4)² = 9/16 + 2/16 + 1/16 = 12/16 = 3/4. Como 3/4 < 1, ρ es un estado mezcla.",
      },
      hints: {
        en: [
          "Expand each ket-bra into a 2×2 matrix before adding.",
          "Tr(ρ²) for a 2×2 matrix is a₁₁² + 2|a₁₂|² + a₂₂².",
        ],
        es: [
          "Expande cada ket-bra como matriz 2×2 antes de sumar.",
          "Tr(ρ²) para una matriz 2×2 es a₁₁² + 2|a₁₂|² + a₂₂².",
        ],
      },
    },
  ],
};
