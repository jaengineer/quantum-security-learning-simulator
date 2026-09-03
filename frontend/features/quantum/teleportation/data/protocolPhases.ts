import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import type { LocalizedText, Locale } from "@/features/theory/i18n/types";
import type { TeleportationInputState } from "@/features/quantum/teleportation/data/inputStates";
import {
  ALICE_MEASUREMENT_OUTCOMES,
  evaluateTeleportationBranch,
  type AliceMeasurementOutcome,
  type CorrectionLabel,
  type TeleportationBranch,
} from "@/features/quantum/teleportation/math/teleportation-protocol";

export type TeleportationCircuitColumnId =
  | "prepare"
  | "h-q1"
  | "cnot-q1-q2"
  | "cnot-q0-q1"
  | "h-q0"
  | "measure"
  | "bits"
  | "correct"
  | "recovered";

export type TeleportationProtocolPhaseId =
  | "initial"
  | "bell-superposition"
  | "bell-pair"
  | "alice-coupling"
  | "measurement-basis"
  | "measurement"
  | "classical-communication"
  | "bob-correction"
  | "recovered";

export interface TeleportationProtocolPhase {
  id: TeleportationProtocolPhaseId;
  label: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  activeColumnIds: readonly TeleportationCircuitColumnId[];
  completedColumnIds: readonly TeleportationCircuitColumnId[];
  formulaLatex?: string;
}

export interface BranchOptionView {
  outcome: AliceMeasurementOutcome;
  probability: number;
  correctionLabel: CorrectionLabel;
}

export interface TeleportationPhaseView {
  id: TeleportationProtocolPhaseId;
  label: string;
  title: string;
  description: string;
  formulaLatex?: string;
  initialQubitStates?: { q0: string; q1: string; q2: string };
  inputStateLatex?: string;
  bobUncorrectedStateLatex?: string;
  bobCorrectedStateLatex?: string;
  selectedOutcome?: AliceMeasurementOutcome;
  messageBits?: { m0: string; m1: string; message: AliceMeasurementOutcome };
  correctionLabel?: CorrectionLabel;
  fidelity?: number;
  branchOptions?: BranchOptionView[];
}

export const TELEPORTATION_PROTOCOL_PHASES: readonly TeleportationProtocolPhase[] = [
  {
    id: "initial",
    label: { en: "Input", es: "Entrada" },
    title: { en: "Initial state", es: "Estado inicial" },
    description: {
      en: "Alice prepares q0 with the selected input state while q1 and q2 start in |0>.",
      es: "Alice prepara q0 con el estado de entrada seleccionado mientras q1 y q2 empiezan en |0>.",
    },
    activeColumnIds: ["prepare"],
    completedColumnIds: [],
    formulaLatex:
      "\\lvert\\psi\\rangle=\\alpha\\lvert0\\rangle+\\beta\\lvert1\\rangle",
  },
  {
    id: "bell-superposition",
    label: { en: "Superposition", es: "Superposición" },
    title: {
      en: "Prepare Bell superposition",
      es: "Preparar la superposición de Bell",
    },
    description: {
      en: "H(q1) creates the superposition that will become Alice and Bob's shared Bell resource.",
      es: "H(q1) crea la superposición que se convertirá en el recurso de Bell compartido por Alice y Bob.",
    },
    activeColumnIds: ["h-q1"],
    completedColumnIds: ["prepare"],
    formulaLatex:
      "H\\lvert0\\rangle=\\frac{\\lvert0\\rangle+\\lvert1\\rangle}{\\sqrt2}",
  },
  {
    id: "bell-pair",
    label: { en: "Bell pair", es: "Par de Bell" },
    title: { en: "Create Bell pair", es: "Crear el par de Bell" },
    description: {
      en: "Applying CNOT(q1 -> q2) to the prepared superposition on q1 and the |0> state of q2 generates the Bell state |Phi+>, entangling q1 and q2. q1 stays with Alice; q2 belongs to Bob.",
      es: "Al aplicar CNOT(q1 -> q2) sobre la superposición preparada en q1 y el estado |0> de q2, se genera el estado de Bell |Phi+>, entrelazando q1 y q2. q1 permanece con Alice y q2 pertenece a Bob.",
    },
    activeColumnIds: ["cnot-q1-q2"],
    completedColumnIds: ["prepare", "h-q1"],
    formulaLatex:
      "\\lvert\\Phi^+\\rangle_{q1q2}=\\frac{\\lvert00\\rangle+\\lvert11\\rangle}{\\sqrt2}",
  },
  {
    id: "alice-coupling",
    label: { en: "Alice coupling", es: "Acoplamiento de Alice" },
    title: {
      en: "Alice couples the input to her Bell qubit",
      es: "Alice acopla la entrada a su qubit de Bell",
    },
    description: {
      en: "CNOT(q0 -> q1) encodes the input information into correlations across the three-qubit state; Bob has not recovered it yet.",
      es: "CNOT(q0 -> q1) codifica la información de entrada en correlaciones del estado de tres qubits; Bob aún no la ha recuperado.",
    },
    activeColumnIds: ["cnot-q0-q1"],
    completedColumnIds: ["prepare", "h-q1", "cnot-q1-q2"],
  },
  {
    id: "measurement-basis",
    label: { en: "Bell basis", es: "Base de Bell" },
    title: {
      en: "Prepare Alice's measurement basis",
      es: "Preparar la base de medida de Alice",
    },
    description: {
      en: "Together with the previous CNOT, H(q0) turns Alice's two qubits into a computational-basis measurement equivalent to Bell-basis analysis.",
      es: "Junto con la CNOT anterior, H(q0) transforma los dos qubits de Alice en una medida computacional equivalente a un análisis en base de Bell.",
    },
    activeColumnIds: ["h-q0"],
    completedColumnIds: ["prepare", "h-q1", "cnot-q1-q2", "cnot-q0-q1"],
  },
  {
    id: "measurement",
    label: { en: "Measure", es: "Medir" },
    title: { en: "Alice measures", es: "Alice mide" },
    description: {
      en: "Alice measures q0 and q1. The result is random; manual branch selection is an educational exploration tool.",
      es: "Alice mide q0 y q1. El resultado es aleatorio; la selección manual de rama es una herramienta educativa de exploración.",
    },
    activeColumnIds: ["measure"],
    completedColumnIds: [
      "prepare",
      "h-q1",
      "cnot-q1-q2",
      "cnot-q0-q1",
      "h-q0",
    ],
    formulaLatex: "m_0,m_1\\in\\{0,1\\}",
  },
  {
    id: "classical-communication",
    label: { en: "Classical bits", es: "Bits clásicos" },
    title: {
      en: "Classical communication",
      es: "Comunicación clásica",
    },
    description: {
      en: "Alice sends two classical bits to Bob. Entanglement alone does not transmit useful information instantaneously.",
      es: "Alice envía dos bits clásicos a Bob. El entrelazamiento por sí solo no transmite información útil instantáneamente.",
    },
    activeColumnIds: ["bits"],
    completedColumnIds: [
      "prepare",
      "h-q1",
      "cnot-q1-q2",
      "cnot-q0-q1",
      "h-q0",
      "measure",
    ],
  },
  {
    id: "bob-correction",
    label: { en: "Correction", es: "Corrección" },
    title: { en: "Bob correction", es: "Corrección de Bob" },
    description: {
      en: "The selected branch determines Bob's correction on q2. The correction label comes from the protocol math engine.",
      es: "La rama seleccionada determina la corrección de Bob en q2. La etiqueta de corrección proviene del motor matemático del protocolo.",
    },
    activeColumnIds: ["correct"],
    completedColumnIds: [
      "prepare",
      "h-q1",
      "cnot-q1-q2",
      "cnot-q0-q1",
      "h-q0",
      "measure",
      "bits",
    ],
  },
  {
    id: "recovered",
    label: { en: "Recovered", es: "Recuperado" },
    title: { en: "Recovered state", es: "Estado recuperado" },
    description: {
      en: "No matter or physical qubit is transported. What is reconstructed in q2 is the quantum state originally carried by q0. Fidelity near one confirms the recovery; global phase differences are physically equivalent.",
      es: "No se transporta materia ni el qubit físico q0. Lo que se reconstruye en q2 es el estado cuántico que originalmente tenía q0. Una fidelidad cercana a uno confirma la recuperación; las diferencias de fase global son físicamente equivalentes.",
    },
    activeColumnIds: ["recovered"],
    completedColumnIds: [
      "prepare",
      "h-q1",
      "cnot-q1-q2",
      "cnot-q0-q1",
      "h-q0",
      "measure",
      "bits",
      "correct",
    ],
    formulaLatex:
      "F=\\left|\\langle\\psi_{Alice}\\mid\\psi_{Bob}\\rangle\\right|^2\\approx1",
  },
] as const;

const ZERO_QUBIT_STATE_LATEX = formatDiracStateLatex([
  { re: 1, im: 0 },
  { re: 0, im: 0 },
]);

export function getPhaseNavigationState(phaseId: TeleportationProtocolPhaseId) {
  const index = TELEPORTATION_PROTOCOL_PHASES.findIndex(
    (phase) => phase.id === phaseId
  );
  const safeIndex = index >= 0 ? index : 0;

  return {
    index: safeIndex,
    stepNumber: safeIndex + 1,
    totalSteps: TELEPORTATION_PROTOCOL_PHASES.length,
    isFirst: safeIndex === 0,
    isLast: safeIndex === TELEPORTATION_PROTOCOL_PHASES.length - 1,
    previousPhaseId:
      safeIndex > 0 ? TELEPORTATION_PROTOCOL_PHASES[safeIndex - 1].id : null,
    nextPhaseId:
      safeIndex < TELEPORTATION_PROTOCOL_PHASES.length - 1
        ? TELEPORTATION_PROTOCOL_PHASES[safeIndex + 1].id
        : null,
  };
}

function groupedTeleportationFormula(input: TeleportationInputState): string {
  const terms = ALICE_MEASUREMENT_OUTCOMES.map((outcome) => {
    const correction = evaluateTeleportationBranch(input, outcome).correction;
    return `\\lvert${outcome}\\rangle ${correction.label}\\lvert\\psi\\rangle`;
  });
  return `\\frac{1}{2}\\left[${terms.join("+")}\\right]`;
}

function correctionFormula(branch: TeleportationBranch): string {
  const label = branch.correction.label;
  if (label === "I") return "I\\lvert\\psi\\rangle=\\lvert\\psi\\rangle";
  return `${label}\\left(${label}\\lvert\\psi\\rangle\\right)\\sim\\lvert\\psi\\rangle`;
}

export function getTeleportationPhaseView({
  phaseId,
  input,
  branch,
  locale,
}: {
  phaseId: TeleportationProtocolPhaseId;
  input: TeleportationInputState;
  branch: TeleportationBranch;
  locale: Locale;
}): TeleportationPhaseView {
  const phase =
    TELEPORTATION_PROTOCOL_PHASES.find((candidate) => candidate.id === phaseId) ??
    TELEPORTATION_PROTOCOL_PHASES[0];
  const branchOptions = ALICE_MEASUREMENT_OUTCOMES.map((outcome) => {
    const candidate = evaluateTeleportationBranch(input, outcome);
    return {
      outcome,
      probability: candidate.probability,
      correctionLabel: candidate.correction.label,
    };
  });
  const base: TeleportationPhaseView = {
    id: phase.id,
    label: phase.label[locale],
    title: phase.title[locale],
    description: phase.description[locale],
    formulaLatex: phase.formulaLatex,
    inputStateLatex: input.latex,
    selectedOutcome: branch.outcome,
    correctionLabel: branch.correction.label,
    fidelity: branch.fidelity,
  };

  if (phase.id === "measurement-basis") {
    return { ...base, formulaLatex: groupedTeleportationFormula(input) };
  }

  if (phase.id === "initial") {
    return {
      ...base,
      initialQubitStates: {
        q0: input.latex,
        q1: ZERO_QUBIT_STATE_LATEX,
        q2: ZERO_QUBIT_STATE_LATEX,
      },
    };
  }

  if (phase.id === "measurement") {
    return { ...base, branchOptions };
  }

  if (phase.id === "classical-communication") {
    return {
      ...base,
      messageBits: {
        m0: branch.outcome[0],
        m1: branch.outcome[1],
        message: branch.outcome,
      },
    };
  }

  if (phase.id === "bob-correction") {
    return {
      ...base,
      formulaLatex: correctionFormula(branch),
      bobUncorrectedStateLatex: formatDiracStateLatex(branch.bobUncorrectedState),
      bobCorrectedStateLatex: formatDiracStateLatex(branch.bobCorrectedState),
    };
  }

  if (phase.id === "recovered") {
    return {
      ...base,
      bobCorrectedStateLatex: formatDiracStateLatex(branch.bobCorrectedState),
    };
  }

  return base;
}
