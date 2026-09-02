import type { LocalizedText } from "@/features/theory/i18n/types";

export interface HomeModuleCopy {
  href: string;
  eyebrow: LocalizedText;
  title: LocalizedText;
  subtitle?: LocalizedText;
  description: LocalizedText;
  cta: LocalizedText;
  className: string;
  eyebrowClassName: string;
  ctaClassName: string;
}

export interface HomeSectionCopy {
  eyebrow: LocalizedText;
  title: LocalizedText;
  modules: readonly HomeModuleCopy[];
}

export interface NavLinkCopy {
  href: string;
  label: LocalizedText;
}

export interface ValuePropositionCopy {
  id: "learn" | "experiment" | "visualize";
  title: LocalizedText;
  description: LocalizedText;
}

export interface MethodStepCopy {
  id: "understand" | "experiment" | "observe" | "connect";
  index: string;
  title: LocalizedText;
  description: LocalizedText;
}

export interface LearningPathNodeCopy {
  id:
    | "superposition"
    | "entanglement"
    | "grover"
    | "teleportation"
    | "builder"
    | "theory";
  href: string;
  title: LocalizedText;
  description: LocalizedText;
}

export type LearningPathEdge = readonly [
  "superposition" | "entanglement",
  "entanglement" | "grover" | "teleportation",
];

export const GLOBAL_NAV_COPY = {
  brand: {
    en: "Quantum Learning",
    es: "Quantum Learning",
  },
  mobileMenu: {
    en: "Open navigation menu",
    es: "Abrir menú de navegación",
  },
  skipToContent: {
    en: "Skip to content",
    es: "Saltar al contenido",
  },
  closeMobileMenu: {
    en: "Close navigation menu",
    es: "Cerrar menú de navegación",
  },
  links: [
    { href: "/#learning-modules", label: { en: "Learn", es: "Aprender" } },
    { href: "/theory", label: { en: "Theory", es: "Theory Lab" } },
    { href: "/builder", label: { en: "Builder", es: "Builder" } },
    { href: "/#about", label: { en: "About", es: "Sobre la plataforma" } },
  ],
} as const;

export const HOME_HERO = {
  eyebrow: {
    en: "Quantum Learning",
    es: "Quantum Learning",
  },
  titleLineOne: {
    en: "Quantum computing,",
    es: "Computación cuántica,",
  },
  titleAccent: {
    en: "visualized.",
    es: "visualizada.",
  },
  description: {
    en: "Learn the foundations of quantum computing through interactive simulations, circuits and educational laboratories.",
    es: "Aprende los fundamentos de la computación cuántica mediante simulaciones, circuitos y laboratorios interactivos.",
  },
  primaryCta: {
    en: "Start learning",
    es: "Empezar a aprender",
  },
  secondaryCta: {
    en: "Discover the platform",
    es: "Descubrir la plataforma",
  },
  primaryCtaHref: "#learning-modules",
  secondaryCtaHref: "#how-it-works",
} as const;

export const HOME_VALUE_COPY = {
  eyebrow: {
    en: "A platform for learning by doing",
    es: "Una plataforma para aprender haciendo",
  },
} as const satisfies Record<string, LocalizedText>;

export const HOME_VALUE_PROPOSITIONS = [
  {
    id: "learn",
    title: { en: "Learn", es: "Aprende" },
    description: {
      en: "Explore quantum concepts and their mathematical foundations.",
      es: "Explora conceptos cuánticos y sus fundamentos matemáticos.",
    },
  },
  {
    id: "experiment",
    title: { en: "Experiment", es: "Experimenta" },
    description: {
      en: "Build circuits and run interactive simulations and protocols.",
      es: "Construye circuitos y ejecuta simulaciones y protocolos interactivos.",
    },
  },
  {
    id: "visualize",
    title: { en: "Visualize", es: "Visualiza" },
    description: {
      en: "Observe states, amplitudes, probabilities and measurement outcomes.",
      es: "Observa estados, amplitudes, probabilidades y resultados de medición.",
    },
  },
] as const satisfies readonly ValuePropositionCopy[];

export const HOME_METHOD_COPY = {
  eyebrow: {
    en: "How it works",
    es: "¿Cómo funciona?",
  },
} as const satisfies Record<string, LocalizedText>;

export const HOME_METHOD_STEPS = [
  {
    id: "understand",
    index: "01",
    title: { en: "Understand", es: "Comprende" },
    description: {
      en: "Learn the concept and its mathematical foundation.",
      es: "Aprende el concepto y su fundamento matemático.",
    },
  },
  {
    id: "experiment",
    index: "02",
    title: { en: "Experiment", es: "Experimenta" },
    description: {
      en: "Run simulations, manipulate circuits and explore protocols.",
      es: "Ejecuta simulaciones, modifica circuitos y explora protocolos.",
    },
  },
  {
    id: "observe",
    index: "03",
    title: { en: "Observe", es: "Observa" },
    description: {
      en: "Analyze states, amplitudes, probabilities and measurements.",
      es: "Analiza estados, amplitudes, probabilidades y mediciones.",
    },
  },
  {
    id: "connect",
    index: "04",
    title: { en: "Connect", es: "Conecta" },
    description: {
      en: "Relate each lab to other concepts and continue learning.",
      es: "Relaciona cada laboratorio con otros conceptos y sigue aprendiendo.",
    },
  },
] as const satisfies readonly MethodStepCopy[];

export const HOME_LEARNING_PATH = {
  copy: {
    eyebrow: {
      en: "Recommended learning path",
      es: "Ruta de aprendizaje recomendada",
    },
    description: {
      en: "Follow a conceptual path without locked modules. Builder and Theory Lab support the whole learning process.",
      es: "Sigue un recorrido conceptual sin módulos bloqueados. Builder y Theory Lab acompañan todo el aprendizaje.",
    },
    toolsLabel: {
      en: "Transversal tools",
      es: "Herramientas transversales",
    },
    superpositionToEntanglement: {
      en: "correlated quantum states",
      es: "estados cuánticos correlacionados",
    },
    superpositionToGrover: {
      en: "amplitude manipulation",
      es: "manipulación de amplitudes",
    },
    groverBranch: {
      en: "Also from Superposition",
      es: "También desde Superposición",
    },
    entanglementToTeleportation: {
      en: "protocol resource",
      es: "recurso del protocolo",
    },
  },
  nodes: [
    {
      id: "superposition",
      href: "/superposition",
      title: { en: "Superposition", es: "Superposición" },
      description: { en: "1 qubit", es: "1 qubit" },
    },
    {
      id: "entanglement",
      href: "/entanglement",
      title: { en: "Entanglement", es: "Entrelazamiento" },
      description: { en: "2 qubits", es: "2 qubits" },
    },
    {
      id: "grover",
      href: "/grover",
      title: { en: "Grover Algorithm", es: "Algoritmo de Grover" },
      description: { en: "2 qubits", es: "2 qubits" },
    },
    {
      id: "teleportation",
      href: "/teleportation",
      title: {
        en: "Quantum Teleportation",
        es: "Teleportación cuántica",
      },
      description: { en: "3 qubits", es: "3 qubits" },
    },
    {
      id: "builder",
      href: "/builder",
      title: { en: "Quantum Circuit Builder", es: "Quantum Circuit Builder" },
      description: {
        en: "Circuit practice",
        es: "Práctica con circuitos",
      },
    },
    {
      id: "theory",
      href: "/theory",
      title: { en: "Theory Lab", es: "Theory Lab" },
      description: {
        en: "Conceptual reference",
        es: "Referencia conceptual",
      },
    },
  ],
  edges: [
    ["superposition", "entanglement"],
    ["superposition", "grover"],
    ["entanglement", "teleportation"],
  ],
  transversalTools: ["builder", "theory"],
} as const;

export const HOME_ABOUT = {
  eyebrow: {
    en: "About the platform",
    es: "Sobre la plataforma",
  },
  title: {
    en: "Theory, simulation and visualization in one learning space.",
    es: "Teoría, simulación y visualización en un único espacio de aprendizaje.",
  },
  description: {
    en: "Quantum Learning combines conceptual explanations, interactive visualization and quantum simulation to make fundamental quantum computing ideas easier to explore and understand.",
    es: "Quantum Learning combina explicaciones conceptuales, visualización interactiva y simulación cuántica para facilitar la exploración y comprensión de los conceptos fundamentales de la computación cuántica.",
  },
  thesis: {
    en: "Developed as part of a Master's Thesis in Quantum Computing.",
    es: "Desarrollado como parte de un Trabajo Fin de Máster en Computación Cuántica.",
  },
} as const satisfies Record<string, LocalizedText>;

export const HOME_FOOTER = {
  product: {
    en: "Quantum Learning",
    es: "Quantum Learning",
  },
  tagline: {
    en: "Learn · Experiment · Understand",
    es: "Aprende · Experimenta · Comprende",
  },
  builtWith: {
    en: "Built with Next.js, Qiskit and FastAPI.",
    es: "Construido con Next.js, Qiskit y FastAPI.",
  },
  thesis: {
    en: "Master's Thesis",
    es: "Trabajo Fin de Máster",
  },
} as const satisfies Record<string, LocalizedText>;

export const HOME_COPY = {
  eyebrow: {
    en: "Learning modules",
    es: "Módulos de aprendizaje",
  },
  title: {
    en: "Choose your quantum learning module",
    es: "Elige tu módulo de aprendizaje cuántico",
  },
  description: {
    en: "Follow the foundations first, then explore complete algorithms and protocols. The Builder and Theory Lab remain transversal tools for experimentation and review.",
    es: "Empieza por los fundamentos y después explora algoritmos y protocolos completos. El Builder y Theory Lab siguen siendo herramientas transversales para experimentar y repasar.",
  },
  language: {
    en: "Language",
    es: "Idioma",
  },
} as const satisfies Record<string, LocalizedText>;

const foundationCard =
  "border-violet-300/70 from-violet-500/10 via-white to-cyan-500/10 hover:border-violet-500 dark:border-violet-500/40 dark:from-violet-500/15 dark:via-slate-900/40 dark:to-cyan-500/10";
const entanglementCard =
  "border-fuchsia-300/70 from-fuchsia-500/10 via-white to-violet-500/10 hover:border-fuchsia-500 dark:border-fuchsia-500/40 dark:from-fuchsia-500/15 dark:via-slate-900/40 dark:to-violet-500/10";
const groverCard =
  "border-violet-300/70 from-violet-500/10 via-white to-amber-500/10 hover:border-violet-500 dark:border-violet-500/40 dark:from-violet-500/15 dark:via-slate-900/40 dark:to-amber-500/10";
const theoryCard =
  "border-emerald-300/70 from-emerald-500/10 via-white to-sky-500/10 hover:border-emerald-500 dark:border-emerald-500/40 dark:from-emerald-500/15 dark:via-slate-900/40 dark:to-sky-500/10";

export const HOME_SECTIONS = [
  {
    eyebrow: { en: "Foundations", es: "Fundamentos" },
    title: {
      en: "Start with the core quantum building blocks",
      es: "Empieza por los bloques básicos de la computación cuántica",
    },
    modules: [
      {
        href: "/superposition",
        eyebrow: { en: "Superposition", es: "Superposición" },
        title: {
          en: "Create a quantum superposition",
          es: "Crea una superposición cuántica",
        },
        subtitle: { en: "1 qubit — Hadamard gate", es: "1 qubit — puerta Hadamard" },
        description: {
          en: "Apply H to |0⟩ or |1⟩, inspect the Bloch Sphere and compare backend measurement counts with the expected 50/50 probabilities.",
          es: "Aplica H a |0⟩ o |1⟩, inspecciona la esfera de Bloch y compara los conteos del backend con las probabilidades 50/50 esperadas.",
        },
        cta: { en: "Explore", es: "Explorar" },
        className: foundationCard,
        eyebrowClassName: "text-violet-600 dark:text-violet-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-violet-600 dark:bg-violet-600 dark:group-hover:bg-violet-500",
      },
      {
        href: "/entanglement",
        eyebrow: { en: "Entanglement", es: "Entrelazamiento" },
        title: { en: "Explore Bell states", es: "Explora estados de Bell" },
        subtitle: { en: "2 qubits — Bell states", es: "2 qubits — estados de Bell" },
        description: {
          en: "Prepare the four canonical Bell states, compare their correlations and see how relative phase changes the quantum state.",
          es: "Prepara los cuatro estados de Bell canónicos, compara sus correlaciones y observa cómo la fase relativa cambia el estado cuántico.",
        },
        cta: { en: "Explore", es: "Explorar" },
        className: entanglementCard,
        eyebrowClassName: "text-fuchsia-700 dark:text-fuchsia-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-fuchsia-600 dark:bg-fuchsia-600 dark:group-hover:bg-fuchsia-500",
      },
    ],
  },
  {
    eyebrow: { en: "Algorithms & Protocols", es: "Algoritmos y protocolos" },
    title: {
      en: "Follow complete multi-step quantum procedures",
      es: "Sigue procedimientos cuánticos completos paso a paso",
    },
    modules: [
      {
        href: "/teleportation",
        eyebrow: { en: "Quantum Teleportation Lab", es: "Laboratorio de teleportación cuántica" },
        title: { en: "Teleport an unknown qubit", es: "Teleporta un qubit desconocido" },
        subtitle: { en: "3 qubits — Quantum protocol", es: "3 qubits — protocolo cuántico" },
        description: {
          en: "Explore the three-qubit protocol step by step, choose Alice's measurement branch and verify Bob's corrected state with fidelity.",
          es: "Explora el protocolo de tres qubits paso a paso, elige la rama de medición de Alice y verifica con fidelidad el estado corregido de Bob.",
        },
        cta: { en: "Open the Lab", es: "Abrir laboratorio" },
        className: entanglementCard,
        eyebrowClassName: "text-fuchsia-700 dark:text-fuchsia-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-fuchsia-600 dark:bg-fuchsia-600 dark:group-hover:bg-fuchsia-500",
      },
      {
        href: "/grover",
        eyebrow: { en: "Quantum Algorithms Lab", es: "Laboratorio de algoritmos cuánticos" },
        title: { en: "Grover's Algorithm", es: "Algoritmo de Grover" },
        subtitle: { en: "2 qubits — Quantum search", es: "2 qubits — búsqueda cuántica" },
        description: {
          en: "Mark a target state and watch amplitude amplification increase its probability step by step.",
          es: "Marca un estado objetivo y observa cómo la amplificación de amplitud aumenta su probabilidad paso a paso.",
        },
        cta: { en: "Open the Lab", es: "Abrir laboratorio" },
        className: groverCard,
        eyebrowClassName: "text-violet-700 dark:text-violet-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-violet-600 dark:bg-violet-600 dark:group-hover:bg-violet-500",
      },
    ],
  },
  {
    eyebrow: { en: "Learning Tools", es: "Herramientas de aprendizaje" },
    title: {
      en: "Use transversal tools to build and review concepts",
      es: "Usa herramientas transversales para construir y repasar conceptos",
    },
    modules: [
      {
        href: "/builder",
        eyebrow: { en: "Interactive tool", es: "Herramienta interactiva" },
        title: { en: "Build your own circuit", es: "Construye tu propio circuito" },
        description: {
          en: "Drag-and-drop one- and two-qubit circuits onto q0/q1 wires, simulate instantly and inspect amplitudes, probabilities and entanglement.",
          es: "Arrastra circuitos de uno y dos qubits sobre los cables q0/q1, simula al instante e inspecciona amplitudes, probabilidades y entrelazamiento.",
        },
        cta: { en: "Open the Builder", es: "Abrir Builder" },
        className: foundationCard,
        eyebrowClassName: "text-violet-600 dark:text-violet-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-violet-600 dark:bg-violet-600 dark:group-hover:bg-violet-500",
      },
      {
        href: "/theory",
        eyebrow: { en: "Theory Lab", es: "Laboratorio de teoría" },
        title: { en: "Study the underlying theory", es: "Estudia la teoría subyacente" },
        description: {
          en: "A curated reference for quantum information: formal definitions, intuitive explanations, worked examples and exam-style questions. Available in English and Spanish.",
          es: "Una referencia curada de información cuántica: definiciones formales, explicaciones intuitivas, ejemplos resueltos y preguntas tipo examen. Disponible en inglés y español.",
        },
        cta: { en: "Open the Theory Lab", es: "Abrir Theory Lab" },
        className: theoryCard,
        eyebrowClassName: "text-emerald-700 dark:text-emerald-300",
        ctaClassName:
          "bg-slate-900 text-white group-hover:bg-emerald-600 dark:bg-emerald-600 dark:group-hover:bg-emerald-500",
      },
    ],
  },
] as const satisfies readonly HomeSectionCopy[];
