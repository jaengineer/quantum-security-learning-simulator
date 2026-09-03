import type { TheoryConcept } from "@/features/theory/types";

export const SHOR_ALGORITHM: TheoryConcept = {
  id: "shor-algorithm",
  level: "advanced",
  category: "quantum-computing",
  notation: "mixed",
  tags: [
    "shor",
    "factorization",
    "period-finding",
    "qft",
    "quantum-fourier-transform",
    "cryptography",
    "rsa",
    "public-key-cryptography",
    "modular-arithmetic",
    "phase-estimation",
  ],
  relatedConceptIds: [
    "grover-algorithm",
    "quantum-oracle",
    "unit-roots",
    "unitary-matrices",
    "amplitude-amplification",
  ],
  title: {
    en: "Shor's Algorithm and Quantum Cryptography",
    es: "Algoritmo de Shor y criptografía cuántica",
  },
  summary: {
    en: "A quantum algorithm that reduces integer factorization and discrete logarithms to efficient quantum period finding, with major implications for public-key cryptography.",
    es: "Un algoritmo cuántico que reduce la factorización de enteros y los logaritmos discretos a búsqueda cuántica eficiente de períodos, con implicaciones importantes para la criptografía de clave pública.",
  },
  learningObjectives: {
    en: [
      "Understand which computational problem Shor's algorithm addresses.",
      "Explain why factorization can be transformed into period finding.",
      "Identify the roles of superposition, modular exponentiation and the Quantum Fourier Transform.",
      "Understand how quantum measurement provides information about the period.",
      "Relate the recovered period to non-trivial factors of N.",
      "Explain the implications of Shor's algorithm for public-key cryptography.",
      "Distinguish the theoretical algorithmic result from the practical limits of large-scale quantum hardware.",
    ],
    es: [
      "Comprender qué problema computacional resuelve el algoritmo de Shor.",
      "Entender por qué la factorización puede transformarse en un problema de búsqueda de período.",
      "Identificar el papel de la superposición, la exponenciación modular y la Transformada Cuántica de Fourier.",
      "Comprender cómo se obtiene información sobre el período a partir de una medición cuántica.",
      "Relacionar el período encontrado con los factores de un número N.",
      "Comprender las implicaciones de Shor para la criptografía de clave pública.",
      "Diferenciar entre la importancia teórica del algoritmo y las limitaciones prácticas de ejecutarlo a gran escala en hardware cuántico real.",
    ],
  },
  formalDefinition: {
    en: "Given a composite integer, Shor's algorithm reduces factorization to period finding for a modular function. The quantum stage estimates the period, and classical number-theoretic post-processing extracts candidate factors when the parity and congruence conditions succeed.",
    es: "Dado un entero compuesto, el algoritmo de Shor reduce la factorización a búsqueda de período para una función modular. La etapa cuántica estima el período, y el posprocesamiento clásico de teoría de números extrae factores candidatos cuando se cumplen las condiciones de paridad y congruencia.",
  },
  formalDefinitionBlocks: [
    {
      segments: [
        {
          kind: "text",
          text: {
            en: "Given a composite integer N, the goal is to find non-trivial factors p and q such that",
            es: "Dado un entero compuesto N, buscamos factores no triviales p y q tales que",
          },
        },
        { kind: "formula", latex: "N=pq", displayMode: "block" },
      ],
    },
    {
      segments: [
        {
          kind: "text",
          text: {
            en: "Choose an integer a satisfying",
            es: "Se elige un entero a que satisfaga",
          },
        },
        {
          kind: "formula",
          latex: "1<a<N,\\quad \\gcd(a,N)=1",
          displayMode: "block",
        },
      ],
    },
    {
      segments: [
        {
          kind: "text",
          text: {
            en: "Then define the periodic modular function",
            es: "Después se define la función modular periódica",
          },
        },
        {
          kind: "formula",
          latex: "f(x)=a^x \\bmod N",
          displayMode: "block",
        },
      ],
    },
    {
      segments: [
        {
          kind: "text",
          text: {
            en: "The quantum period-finding step estimates a period r such that",
            es: "La etapa cuántica de búsqueda de período estima un período r tal que",
          },
        },
        {
          kind: "formula",
          latex: "a^r \\equiv 1 \\pmod N",
          displayMode: "block",
        },
      ],
    },
    {
      segments: [
        {
          kind: "text",
          text: {
            en: "If r is even and the half-period value is not the exceptional congruence, then candidate factors are obtained from",
            es: "Si r es par y el valor de medio período no cae en la congruencia excepcional, los factores candidatos se obtienen con",
          },
        },
        {
          kind: "formula",
          latex: "a^{r/2}\\not\\equiv -1 \\pmod N",
          displayMode: "block",
        },
        {
          kind: "formula",
          latex: "\\gcd\\left(a^{r/2}-1,N\\right)",
          displayMode: "block",
        },
        {
          kind: "formula",
          latex: "\\gcd\\left(a^{r/2}+1,N\\right)",
          displayMode: "block",
        },
      ],
    },
  ],
  intuitiveExplanation: {
    en: "Shor does not try every possible factor at once. It converts factorization into the problem of finding the period of a modular function. The quantum computer creates a superposition of exponents, computes modular exponentiation coherently, and uses Fourier structure to make information about that period observable. Classical continued-fraction and gcd post-processing then turns the estimated period into candidate factors.",
    es: "Shor no prueba todos los factores posibles a la vez. Convierte la factorización en el problema de encontrar el período de una función modular. El ordenador cuántico crea una superposición de exponentes, calcula la exponenciación modular de forma coherente y utiliza estructura de Fourier para hacer observable información sobre ese período. Después, el posprocesamiento clásico con fracciones continuas y gcd transforma el período estimado en factores candidatos.",
  },
  geometricOrPhysicalInterpretation: {
    en: "At a high level, the first register represents many exponents coherently. Modular exponentiation writes periodic modular values into a second register. The inverse QFT on the exponent register concentrates amplitude around frequencies related to the period, so measurement can reveal a rational approximation from which r may be recovered.",
    es: "A alto nivel, el primer registro representa coherentemente muchos exponentes. La exponenciación modular escribe valores modulares periódicos en un segundo registro. La QFT inversa sobre el registro de exponentes concentra amplitud alrededor de frecuencias relacionadas con el período, de modo que la medida puede revelar una aproximación racional desde la que recuperar r.",
  },
  examRelevance: {
    en: "Shor is a central exam and security topic because it combines number theory, reversible modular computation, period finding, QFT intuition, measurement and classical post-processing. It also explains why quantum computing changes the threat model for RSA, Diffie-Hellman and elliptic-curve cryptography.",
    es: "Shor es un tema central de examen y seguridad porque combina teoría de números, cómputo modular reversible, búsqueda de períodos, intuición de la QFT, medición y posprocesamiento clásico. También explica por qué la computación cuántica cambia el modelo de amenaza para RSA, Diffie-Hellman y la criptografía de curva elíptica.",
  },
  extendedSections: [
    {
      title: {
        en: "Period-finding workflow",
        es: "Flujo de búsqueda de período",
      },
      content: {
        en: "The workflow combines quantum period estimation with classical number-theoretic post-processing.",
        es: "El flujo combina estimación cuántica del período con posprocesamiento clásico de teoría de números.",
      },
      blocks: [
        {
          segments: [
            {
              kind: "text",
              text: {
                en: "Classical factorization → choose coprime",
                es: "Factorización clásica → elegir",
              },
            },
            { kind: "formula", latex: "a" },
            {
              kind: "text",
              text: {
                en: "→ define",
                es: "coprimo → definir",
              },
            },
            { kind: "formula", latex: "f(x)=a^x\\bmod N" },
          ],
        },
        {
          segments: [
            {
              kind: "text",
              text: {
                en: "Superposition → modular exponentiation",
                es: "Superposición → exponenciación modular",
              },
            },
            {
              kind: "formula",
              latex: "|x\\rangle|1\\rangle\\mapsto|x\\rangle|a^x\\bmod N\\rangle",
              displayMode: "block",
            },
          ],
        },
        {
          segments: [
            {
              kind: "text",
              text: {
                en: "QFT / phase information → measurement → continued fractions → candidate period",
                es: "QFT / información de fase → medición → fracciones continuas → período candidato",
              },
            },
            { kind: "formula", latex: "r" },
          ],
        },
        {
          segments: [
            {
              kind: "text",
              text: {
                en: "Classical gcd post-processing → non-trivial factors",
                es: "Posprocesamiento clásico con gcd → factores no triviales",
              },
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Impact on information security",
        es: "Impacto sobre la seguridad de la información",
      },
      content: {
        en: "Shor efficiently addresses integer factorization and discrete logarithms. RSA depends on the practical hardness of factoring large integers. Diffie-Hellman depends on discrete logarithms, and elliptic-curve cryptography depends on elliptic-curve discrete logarithms. Shor therefore has direct implications for many public-key systems. It does not mean that all encryption is broken: symmetric cryptography and hash functions are affected differently, with Grover's algorithm providing a separate quadratic-search implication for brute-force margins.",
        es: "Shor aborda eficientemente la factorización de enteros y los logaritmos discretos. RSA depende de la dificultad práctica de factorizar enteros grandes. Diffie-Hellman depende de logaritmos discretos, y la criptografía de curva elíptica depende de logaritmos discretos en curvas elípticas. Por ello, Shor tiene implicaciones directas para muchos sistemas de clave pública. Esto no significa que toda la criptografía esté rota: la criptografía simétrica y las funciones hash se ven afectadas de forma diferente, y Grover introduce una implicación separada de búsqueda cuadrática sobre los márgenes de fuerza bruta.",
      },
    },
    {
      title: { en: "Shor vs Grover", es: "Shor frente a Grover" },
      content: {
        en: "Shor targets structured number-theoretic problems such as factorization and discrete logarithms. Its core mechanism is quantum period finding with QFT or phase-estimation intuition plus classical gcd post-processing, which strongly affects RSA, Diffie-Hellman and ECC. Grover targets unstructured search and provides a quadratic query speedup through amplitude amplification, which mainly reduces brute-force security margins for symmetric-key search. The algorithms have different problems, mechanisms and cryptographic consequences.",
        es: "Shor aborda problemas estructurados de teoría de números como la factorización y los logaritmos discretos. Su mecanismo central es la búsqueda cuántica de períodos con intuición de QFT o estimación de fase, más posprocesamiento clásico con gcd, lo que afecta fuertemente a RSA, Diffie-Hellman y ECC. Grover aborda búsqueda no estructurada y proporciona una mejora cuadrática en consultas mediante amplificación de amplitud, lo que reduce principalmente los márgenes de seguridad frente a fuerza bruta en criptografía simétrica. Los dos algoritmos tienen problemas, mecanismos y consecuencias criptográficas diferentes.",
      },
    },
    {
      title: {
        en: "Practical limitations",
        es: "Limitaciones prácticas",
      },
      content: {
        en: "The algorithmic result is not the same as current hardware capability. Factoring small integers such as 15 is an educational demonstration of the mathematical structure, not evidence of practical RSA breaking. Cryptographically relevant instances require many logical qubits, deep circuits, error correction and fault-tolerant quantum computation. Physical-to-logical qubit overhead is a major practical barrier, so this concept should not be read as a forecast for when existing RSA deployments will be broken.",
        es: "El resultado algorítmico no equivale a la capacidad del hardware actual. Factorizar enteros pequeños como 15 es una demostración educativa de la estructura matemática, no una prueba de ruptura práctica de RSA. Las instancias criptográficamente relevantes requieren muchos qubits lógicos, circuitos profundos, corrección de errores y computación cuántica tolerante a fallos. La sobrecarga de qubits físicos a lógicos es una barrera práctica importante, por lo que este concepto no debe interpretarse como una predicción sobre cuándo se romperán despliegues reales de RSA.",
      },
    },
    {
      title: {
        en: "Post-Quantum Cryptography",
        es: "Criptografía poscuántica",
      },
      content: {
        en: "Shor motivates migration toward Post-Quantum Cryptography (PQC): cryptographic algorithms designed to resist known quantum attacks. PQC is not a single algorithm and is not explained completely here; the key point is that Shor changes the long-term risk profile of public-key cryptography and motivates replacing vulnerable assumptions before large fault-tolerant quantum computers exist.",
        es: "Shor motiva la migración hacia la criptografía poscuántica o Post-Quantum Cryptography (PQC): algoritmos criptográficos diseñados para resistir ataques cuánticos conocidos. PQC no es un único algoritmo y no se desarrolla completamente aquí; la idea clave es que Shor cambia el perfil de riesgo a largo plazo de la criptografía de clave pública y motiva sustituir supuestos vulnerables antes de que existan grandes ordenadores cuánticos tolerantes a fallos.",
      },
    },
  ],
  formulas: [
    {
      label: { en: "Factorization target", es: "Objetivo de factorización" },
      latex: "N=pq",
      explanation: {
        en: "The goal is to find non-trivial factors p and q of a composite integer N.",
        es: "El objetivo es encontrar factores no triviales p y q de un entero compuesto N.",
      },
    },
    {
      label: { en: "Periodic modular function", es: "Función modular periódica" },
      latex: "f(x)=a^x \\bmod N,\\quad a^r \\equiv 1 \\pmod N",
      explanation: {
        en: "For a valid coprime a, the function repeats with period r.",
        es: "Para un a válido y coprimo con N, la función se repite con período r.",
      },
    },
    {
      label: { en: "Factor extraction", es: "Extracción de factores" },
      latex:
        "p=\\gcd(a^{r/2}-1,N),\\quad q=\\gcd(a^{r/2}+1,N)",
      explanation: {
        en: "This step works when r is even and the exceptional half-period congruence does not occur; otherwise another a may be needed.",
        es: "Este paso funciona cuando r es par y no aparece la congruencia excepcional de medio período; en caso contrario puede hacer falta elegir otro a.",
      },
    },
    {
      label: { en: "Quantum modular exponentiation", es: "Exponenciación modular cuántica" },
      latex: "|x\\rangle|1\\rangle \\mapsto |x\\rangle|a^x \\bmod N\\rangle",
      explanation: {
        en: "The quantum circuit computes the periodic function coherently over a superposition of exponents.",
        es: "El circuito cuántico calcula la función periódica de forma coherente sobre una superposición de exponentes.",
      },
    },
    {
      label: { en: "Quantum Fourier Transform", es: "Transformada Cuántica de Fourier" },
      latex:
        "\\operatorname{QFT}_N |x\\rangle=\\frac{1}{\\sqrt{N}}\\sum_{k=0}^{N-1}e^{2\\pi i xk/N}|k\\rangle",
      explanation: {
        en: "The QFT exposes periodicity in amplitudes, making frequencies related to the period more likely to be measured.",
        es: "La QFT expone periodicidad en las amplitudes, haciendo más probables las frecuencias relacionadas con el período.",
      },
    },
  ],
  workedExamples: [
    {
      title: { en: "N = 15 and a = 2", es: "N = 15 y a = 2" },
      statement: {
        en: "Use the period of the modular function to recover non-trivial factors of 15. This illustrates the post-processing and periodic structure; it is not the scalable quantum speedup itself.",
        es: "Usa el período de la función modular para recuperar factores no triviales de 15. Esto ilustra el posprocesamiento y la estructura periódica; no es por sí mismo la aceleración cuántica escalable.",
      },
      steps: [
        {
          title: { en: "Choose a valid base", es: "Elegir una base válida" },
          latex: "N=15,\\quad a=2,\\quad \\gcd(2,15)=1",
          explanation: {
            en: "The chosen a is coprime with N, so the modular period is well defined.",
            es: "El valor a elegido es coprimo con N, así que el período modular está bien definido.",
          },
        },
        {
          title: { en: "Observe the period in the small example", es: "Observar el período en el ejemplo pequeño" },
          latex:
            "\\begin{aligned}2^0\\bmod 15&=1\\\\2^1\\bmod 15&=2\\\\2^2\\bmod 15&=4\\\\2^3\\bmod 15&=8\\\\2^4\\bmod 15&=1\\\\r&=4\\end{aligned}",
          explanation: {
            en: "The sequence returns to 1 after four steps, so the period is four.",
            es: "La secuencia vuelve a 1 después de cuatro pasos, por lo que el período es cuatro.",
          },
        },
        {
          title: { en: "Check the extraction condition", es: "Comprobar la condición de extracción" },
          latex: "r=4\\text{ is even},\\quad 2^{r/2}=2^2=4",
          explanation: {
            en: "Because r is even and 4 is not -1 modulo 15, the gcd step can produce useful factors.",
            es: "Como r es par y 4 no es -1 módulo 15, el paso con gcd puede producir factores útiles.",
          },
        },
        {
          title: { en: "Compute gcd candidates", es: "Calcular candidatos con gcd" },
          latex: "\\gcd(4-1,15)=3,\\quad \\gcd(4+1,15)=5",
          explanation: {
            en: "The classical post-processing recovers the non-trivial factors 3 and 5.",
            es: "El posprocesamiento clásico recupera los factores no triviales 3 y 5.",
          },
        },
        {
          title: { en: "Factor the integer", es: "Factorizar el entero" },
          latex: "15=3\\times5",
          explanation: {
            en: "The non-trivial factors multiply back to the original integer.",
            es: "Los factores no triviales multiplican de nuevo al entero original.",
          },
        },
      ],
      finalAnswer: {
        en: "Therefore the factors are 3 and 5. In a large instance, the quantum period-finding stage estimates r efficiently; the final gcd extraction is classical.",
        es: "Por tanto, los factores son 3 y 5. En una instancia grande, la etapa cuántica de búsqueda de período estima r eficientemente; la extracción final con gcd es clásica.",
      },
    },
  ],
  commonMistakes: {
    en: [
      "Incorrect: Shor tries every possible factor simultaneously. Correct: it uses interference to solve period finding, then classical post-processing yields factors.",
      "Incorrect: the QFT directly returns the factors. Correct: it reveals periodic information; factors are recovered later using number theory.",
      "Incorrect: Shor breaks all cryptography. Correct: its strongest direct implications concern public-key schemes based on factorization and discrete logarithms.",
      "Incorrect: running Shor for 15 demonstrates practical RSA breaking. Correct: small demonstrations are educational examples and do not represent cryptographically relevant resources.",
    ],
    es: [
      "Incorrecto: Shor prueba todos los factores posibles simultáneamente. Correcto: usa interferencia para resolver búsqueda de período, y después el posprocesamiento clásico produce factores.",
      "Incorrecto: la QFT devuelve directamente los factores. Correcto: revela información periódica; los factores se recuperan después usando teoría de números.",
      "Incorrecto: Shor rompe toda la criptografía. Correcto: sus implicaciones directas más fuertes afectan a esquemas de clave pública basados en factorización y logaritmos discretos.",
      "Incorrecto: ejecutar Shor para 15 demuestra ruptura práctica de RSA. Correcto: las demostraciones pequeñas son ejemplos educativos y no representan recursos criptográficamente relevantes.",
    ],
  },
  examQuestions: [
    {
      id: "shor-factorization-period",
      difficulty: "easy",
      statement: {
        en: "What problem is transformed into period finding in Shor's algorithm?",
        es: "¿Qué problema se transforma en búsqueda de período en el algoritmo de Shor?",
      },
      expectedAnswer: {
        en: "Integer factorization is reduced to finding the period of a modular exponential function for a suitable coprime a.",
        es: "La factorización de enteros se reduce a encontrar el período de una función exponencial modular para un a coprimo adecuado.",
      },
      hints: {
        en: ["Look at the periodic modular function defined in the formal section."],
        es: ["Observa la función modular periódica definida en la sección formal."],
      },
    },
    {
      id: "shor-qft-role",
      difficulty: "medium",
      statement: {
        en: "What role does the Quantum Fourier Transform play in Shor's algorithm?",
        es: "¿Qué papel desempeña la Transformada Cuántica de Fourier en el algoritmo de Shor?",
      },
      expectedAnswer: {
        en: "It converts periodic structure in the amplitudes into frequency information related to the period r, which can be sampled by measurement.",
        es: "Convierte la estructura periódica de las amplitudes en información de frecuencia relacionada con el período r, que puede muestrearse mediante la medición.",
      },
      hints: {
        en: ["The QFT is used after coherent modular exponentiation."],
        es: ["La QFT se usa después de la exponenciación modular coherente."],
      },
    },
    {
      id: "shor-even-period",
      difficulty: "medium",
      statement: {
        en: "Why does the classical factor extraction step normally require an even period r?",
        es: "¿Por qué el paso clásico de extracción de factores normalmente requiere un período r par?",
      },
      expectedAnswer: {
        en: "Because the method uses the half-period power to build two gcd candidates.",
        es: "Porque el método usa la potencia de medio período para construir dos candidatos con gcd.",
      },
      hints: {
        en: ["Check the exponent used in the gcd formulas."],
        es: ["Revisa el exponente usado en las fórmulas con gcd."],
      },
    },
    {
      id: "shor-can-fail",
      difficulty: "medium",
      statement: {
        en: "Why can one execution fail to produce useful factors?",
        es: "¿Por qué una ejecución puede no producir factores útiles?",
      },
      expectedAnswer: {
        en: "The chosen a or measured candidate can lead to an odd period, to the exceptional half-period congruence, or to a bad period estimate, so the procedure may need to be repeated.",
        es: "El a elegido o el candidato medido puede llevar a un período impar, a la congruencia excepcional de medio período, o a una estimación incorrecta del período, por lo que el procedimiento puede repetirse.",
      },
      hints: {
        en: ["The gcd formulas require specific conditions."],
        es: ["Las fórmulas con gcd requieren condiciones específicas."],
      },
    },
    {
      id: "shor-public-key-impact",
      difficulty: "hard",
      statement: {
        en: "Which cryptographic systems are directly threatened by Shor's algorithm?",
        es: "¿Qué sistemas criptográficos están directamente amenazados por el algoritmo de Shor?",
      },
      expectedAnswer: {
        en: "RSA is threatened through factorization; Diffie-Hellman and elliptic-curve cryptography are threatened through discrete logarithm variants.",
        es: "RSA se ve amenazado por la factorización; Diffie-Hellman y la criptografía de curva elíptica se ven amenazados por variantes del logaritmo discreto.",
      },
      hints: {
        en: ["Separate factorization from discrete logarithms."],
        es: ["Separa factorización de logaritmos discretos."],
      },
    },
    {
      id: "shor-grover-security",
      difficulty: "hard",
      statement: {
        en: "Why does Shor not imply that AES is broken in the same way as RSA?",
        es: "¿Por qué Shor no implica que AES esté roto del mismo modo que RSA?",
      },
      expectedAnswer: {
        en: "Shor targets factorization and discrete logarithms, which underpin many public-key systems. Symmetric-key brute force is more directly connected to Grover's quadratic speedup, so the security implication is different.",
        es: "Shor aborda factorización y logaritmos discretos, que sustentan muchos sistemas de clave pública. La fuerza bruta contra clave simétrica se relaciona más directamente con la mejora cuadrática de Grover, así que la implicación de seguridad es diferente.",
      },
      hints: {
        en: ["Compare public-key assumptions with unstructured search."],
        es: ["Compara supuestos de clave pública con búsqueda no estructurada."],
      },
    },
  ],
};
