import type { TheoryConcept } from "@/features/theory/types";

export const QUANTUM_ENTANGLEMENT: TheoryConcept = {
  id: "quantum-entanglement",
  level: "intermediate",
  category: "quantum-information",
  notation: "bra-ket",
  tags: ["entanglement", "bell-state", "separability", "tensor-product"],
  relatedConceptIds: ["dirac-notation", "density-matrix", "reduced-density-matrix"],

  title: {
    en: "Quantum entanglement",
    es: "Entrelazamiento cuántico",
  },
  summary: {
    en: "A composite state is entangled if it cannot be written as a tensor product of states of its subsystems. Entangled qubits share correlations stronger than any classical resource.",
    es: "Un estado compuesto está entrelazado si no se puede escribir como producto tensorial de estados de sus subsistemas. Los cúbits entrelazados comparten correlaciones más fuertes que cualquier recurso clásico.",
  },
  learningObjectives: {
    en: [
      "Distinguish separable from entangled states on H_A ⊗ H_B.",
      "Recognise the four Bell states and explain why they are maximally entangled.",
      "Use the reduced density matrix purity Tr(ρ_A²) as an entanglement diagnostic.",
    ],
    es: [
      "Distinguir estados separables de estados entrelazados en H_A ⊗ H_B.",
      "Reconocer los cuatro estados de Bell y explicar por qué son máximamente entrelazados.",
      "Usar la pureza Tr(ρ_A²) de la matriz reducida como diagnóstico de entrelazamiento.",
    ],
  },
  formalDefinition: {
    en: "A pure state |ψ⟩ ∈ H_A ⊗ H_B is separable if there exist |a⟩ ∈ H_A and |b⟩ ∈ H_B such that |ψ⟩ = |a⟩ ⊗ |b⟩. Otherwise it is entangled. A mixed state ρ is separable if it can be written as a convex combination of product states; otherwise it is entangled.",
    es: "Un estado puro |ψ⟩ ∈ H_A ⊗ H_B es separable si existen |a⟩ ∈ H_A y |b⟩ ∈ H_B tales que |ψ⟩ = |a⟩ ⊗ |b⟩. En caso contrario está entrelazado. Un estado mezcla ρ es separable si admite una combinación convexa de estados producto; en caso contrario está entrelazado.",
  },
  intuitiveExplanation: {
    en: "An entangled bipartite state is a single quantum object whose parts cannot be described in isolation. Measuring one qubit instantaneously determines the statistics of the other, no matter how far apart they are — yet no usable information travels between them.",
    es: "Un estado bipartito entrelazado es un único objeto cuántico cuyas partes no admiten descripción aislada. Medir un cúbit determina al instante la estadística del otro por lejos que estén — pero sin que viaje información utilizable entre ambos.",
  },
  geometricOrPhysicalInterpretation: {
    en: "The four Bell states form an orthonormal basis of ℂ² ⊗ ℂ² consisting entirely of maximally entangled vectors. They are the resource behind quantum teleportation, superdense coding and entanglement-assisted protocols.",
    es: "Los cuatro estados de Bell forman una base ortonormal de ℂ² ⊗ ℂ² compuesta íntegramente por vectores máximamente entrelazados. Son el recurso detrás de la teleportación cuántica, el superdense coding y los protocolos asistidos por entrelazamiento.",
  },
  examRelevance: {
    en: "Almost every quantum-information exam contains at least one question about Bell states, partial traces or entanglement criteria. Knowing how to write a state as |a⟩ ⊗ |b⟩ — or to prove no such decomposition exists — is a default skill.",
    es: "Casi todo examen de información cuántica contiene al menos una pregunta sobre estados de Bell, trazas parciales o criterios de entrelazamiento. Saber escribir un estado como |a⟩ ⊗ |b⟩ — o probar que tal descomposición no existe — es una habilidad básica.",
  },

  formulas: [
    {
      label: {
        en: "Bell basis",
        es: "Base de Bell",
      },
      latex: "|\\Phi^{\\pm}\\rangle = \\tfrac{1}{\\sqrt{2}}(|00\\rangle \\pm |11\\rangle),\\;\\; |\\Psi^{\\pm}\\rangle = \\tfrac{1}{\\sqrt{2}}(|01\\rangle \\pm |10\\rangle)",
      explanation: {
        en: "Each Bell state is maximally entangled and they are mutually orthogonal.",
        es: "Cada estado de Bell es máximamente entrelazado y son mutuamente ortogonales.",
      },
    },
    {
      label: {
        en: "Separability test (pure states)",
        es: "Test de separabilidad (estados puros)",
      },
      latex: "|\\psi\\rangle = |a\\rangle \\otimes |b\\rangle \\iff \\mathrm{Tr}(\\rho_A^{2}) = 1",
      explanation: {
        en: "A pure bipartite state is separable iff its reduced state on either side is pure.",
        es: "Un estado bipartito puro es separable si y sólo si su estado reducido en cualquiera de los lados es puro.",
      },
    },
    {
      label: {
        en: "Schmidt decomposition",
        es: "Descomposición de Schmidt",
      },
      latex: "|\\psi\\rangle = \\sum_{i} \\sqrt{\\lambda_i}\\, |u_i\\rangle_A \\otimes |v_i\\rangle_B",
      explanation: {
        en: "Number of non-zero λᵢ is the Schmidt rank. Schmidt rank > 1 ⇔ entanglement.",
        es: "El número de λᵢ no nulos es el rango de Schmidt. Rango de Schmidt > 1 ⇔ entrelazamiento.",
      },
    },
  ],

  workedExamples: [
    {
      title: {
        en: "Bell state Φ⁺ is not separable",
        es: "El estado de Bell Φ⁺ no es separable",
      },
      statement: {
        en: "Prove that |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 cannot be written as |a⟩ ⊗ |b⟩.",
        es: "Demuestra que |Φ⁺⟩ = (|00⟩ + |11⟩)/√2 no puede escribirse como |a⟩ ⊗ |b⟩.",
      },
      steps: [
        {
          title: {
            en: "Assume separability",
            es: "Supón separabilidad",
          },
          latex: "|a\\rangle = a_0 |0\\rangle + a_1 |1\\rangle, \\quad |b\\rangle = b_0 |0\\rangle + b_1 |1\\rangle",
          explanation: {
            en: "Generic single-qubit states on each side.",
            es: "Estados genéricos de un cúbit en cada lado.",
          },
        },
        {
          title: {
            en: "Expand the product",
            es: "Expande el producto",
          },
          latex: "|a\\rangle \\otimes |b\\rangle = a_0 b_0 |00\\rangle + a_0 b_1 |01\\rangle + a_1 b_0 |10\\rangle + a_1 b_1 |11\\rangle",
          explanation: {
            en: "Match coefficients with |Φ⁺⟩.",
            es: "Iguala coeficientes con |Φ⁺⟩.",
          },
        },
        {
          title: {
            en: "Hit a contradiction",
            es: "Llega a contradicción",
          },
          latex: "a_0 b_1 = 0, \\;\\; a_1 b_0 = 0, \\;\\; a_0 b_0 = a_1 b_1 = \\tfrac{1}{\\sqrt{2}}",
          explanation: {
            en: "From a₀b₁ = 0 either a₀ = 0 or b₁ = 0; both options force a₀b₀ = 0 or a₁b₁ = 0, contradicting 1/√2.",
            es: "De a₀b₁ = 0 se sigue a₀ = 0 o b₁ = 0; ambas opciones fuerzan a₀b₀ = 0 o a₁b₁ = 0, contradiciendo 1/√2.",
          },
        },
      ],
      finalAnswer: {
        en: "No factorisation exists, so |Φ⁺⟩ is entangled.",
        es: "No existe factorización, luego |Φ⁺⟩ está entrelazado.",
      },
    },
  ],

  commonMistakes: {
    en: [
      "Confusing 'correlated' with 'entangled'. Classical statistical correlation does not imply entanglement.",
      "Concluding entanglement from non-trivial-looking coefficients; algebra is the only safe test.",
      "Trying to factor a bipartite state into local kets without writing the full expansion of the supposed product.",
    ],
    es: [
      "Confundir «correlacionado» con «entrelazado». La correlación estadística clásica no implica entrelazamiento.",
      "Concluir entrelazamiento sólo porque los coeficientes «parezcan» no triviales; el álgebra es la prueba.",
      "Intentar factorizar un estado bipartito en kets locales sin escribir la expansión completa del supuesto producto.",
    ],
  },

  examQuestions: [
    {
      id: "entanglement-q1",
      difficulty: "medium",
      statement: {
        en: "Decide whether |ψ⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 is entangled. Justify by factoring it explicitly if possible.",
        es: "Decide si |ψ⟩ = (|00⟩ + |01⟩ + |10⟩ + |11⟩)/2 está entrelazado. Justifica factorizándolo explícitamente si es posible.",
      },
      expectedAnswer: {
        en: "Factor as (|0⟩ + |1⟩)(|0⟩ + |1⟩)/2 = |+⟩ ⊗ |+⟩. So |ψ⟩ is separable (not entangled).",
        es: "Factoriza como (|0⟩ + |1⟩)(|0⟩ + |1⟩)/2 = |+⟩ ⊗ |+⟩. Por tanto |ψ⟩ es separable (no entrelazado).",
      },
      hints: {
        en: [
          "Look for a common factor (|0⟩ + |1⟩) in both qubits.",
          "Equivalently, compute ρ_A and check whether it is pure.",
        ],
        es: [
          "Busca un factor común (|0⟩ + |1⟩) en ambos cúbits.",
          "Alternativamente, calcula ρ_A y comprueba si es puro.",
        ],
      },
    },
  ],
};
