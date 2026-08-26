import type { LocalizedText } from "@/features/theory/i18n/types";

export const TELEPORTATION_UI_STRINGS = {
  eyebrow: {
    en: "Quantum Teleportation Lab",
    es: "Laboratorio de teleportación cuántica",
  },
  title: {
    en: "Teleport a single-qubit state",
    es: "Teletransporta un estado de un qubit",
  },
  subtitle: {
    en: "Prepare Alice's input qubit, share a Bell pair, inspect Alice's measurement branch and verify that Bob recovers the original state.",
    es: "Prepara el qubit de entrada de Alice, comparte un par de Bell, inspecciona la rama de medida de Alice y verifica que Bob recupera el estado original.",
  },
  route_subtitle: {
    en: "Follow the three-qubit protocol without exposing 3-qubit editing in the generic Builder: q0 carries Alice's input, q1 is Alice's Bell qubit and q2 is Bob's recovered state.",
    es: "Sigue el protocolo de tres qubits sin exponer edición de tres qubits en el Builder genérico: q0 contiene la entrada de Alice, q1 es el qubit de Bell de Alice y q2 es el estado recuperado de Bob.",
  },
  language: { en: "Language", es: "Idioma" },
  input_state: { en: "Input state", es: "Estado de entrada" },
  protocol: { en: "Protocol", es: "Protocolo" },
  protocol_hint: {
    en: "Read the circuit from left to right: Alice entangles her input with the shared Bell pair, measures q0/q1, then sends two classical bits to Bob for the q2 correction.",
    es: "Lee el circuito de izquierda a derecha: Alice entrelaza su entrada con el par de Bell compartido, mide q0/q1 y envía dos bits clásicos a Bob para corregir q2.",
  },
  circuit_prepare: { en: "Prepare |ψ⟩", es: "Preparar |ψ⟩" },
  circuit_h_q1: { en: "H(q1)", es: "H(q1)" },
  circuit_cnot_q1_q2: { en: "CNOT(q1 → q2)", es: "CNOT(q1 → q2)" },
  circuit_cnot_q0_q1: { en: "CNOT(q0 → q1)", es: "CNOT(q0 → q1)" },
  circuit_h_q0: { en: "H(q0)", es: "H(q0)" },
  circuit_measure: { en: "M(q0), M(q1)", es: "M(q0), M(q1)" },
  circuit_bits: { en: "Classical bits", es: "Bits clásicos" },
  circuit_correct: { en: "Correction on q2", es: "Corrección en q2" },
  wire_q0: { en: "q0 Alice — input |ψ⟩", es: "q0 Alice — entrada |ψ⟩" },
  wire_q1: { en: "q1 Alice — Bell qubit", es: "q1 Alice — qubit de Bell" },
  wire_q2: { en: "q2 Bob — recovered qubit", es: "q2 Bob — qubit recuperado" },
  gate_prepare: { en: "|ψ⟩", es: "|ψ⟩" },
  gate_measure: { en: "M", es: "M" },
  classical_bits: { en: "bits", es: "bits" },
  alice_measurement: { en: "Alice measurement", es: "Medida de Alice" },
  alice_measurement_hint: {
    en: "Each branch is equally likely. Pick a branch manually or sample one to see which correction Bob applies.",
    es: "Cada rama tiene la misma probabilidad. Elige una rama manualmente o muestrea una para ver qué corrección aplica Bob.",
  },
  sample_branch: { en: "Sample branch", es: "Muestrear rama" },
  selected_branch: { en: "Selected branch", es: "Rama seleccionada" },
  measurement_result: { en: "Alice measures", es: "Alice mide" },
  bob_applies: { en: "Bob applies", es: "Bob aplica" },
  bob_before: { en: "Bob before correction", es: "Bob antes de corregir" },
  bob_after: { en: "Bob after correction", es: "Bob después de corregir" },
  alice_input_comparison: {
    en: "Alice — Input state |ψ⟩",
    es: "Alice — Estado de entrada |ψ⟩",
  },
  bob_recovered_comparison: {
    en: "Bob — Recovered state |ψ⟩",
    es: "Bob — Estado recuperado |ψ⟩",
  },
  correction: { en: "Classical correction", es: "Corrección clásica" },
  correction_description_00: {
    en: "Outcome 00 already leaves Bob's qubit as |ψ⟩, so no gate is needed.",
    es: "El resultado 00 ya deja el qubit de Bob como |ψ⟩, así que no hace falta ninguna puerta.",
  },
  correction_description_01: {
    en: "Outcome 01 swaps Bob's amplitudes, so Bob applies X to recover |ψ⟩.",
    es: "El resultado 01 intercambia las amplitudes de Bob, así que Bob aplica X para recuperar |ψ⟩.",
  },
  correction_description_10: {
    en: "Outcome 10 adds a relative phase, so Bob applies Z to recover |ψ⟩.",
    es: "El resultado 10 añade una fase relativa, así que Bob aplica Z para recuperar |ψ⟩.",
  },
  correction_description_11: {
    en: "Outcome 11 needs both the bit flip and phase flip corrections, so Bob applies XZ.",
    es: "El resultado 11 necesita la corrección de bit y de fase, así que Bob aplica XZ.",
  },
  fidelity: { en: "Fidelity", es: "Fidelidad" },
  fidelity_hint: {
    en: "F = |⟨ψinput|ψBob⟩|². A value of 1 means Bob's corrected qubit matches Alice's input up to global phase.",
    es: "F = |⟨ψentrada|ψBob⟩|². Un valor de 1 significa que el qubit corregido de Bob coincide con la entrada de Alice salvo fase global.",
  },
  roles: {
    en: "q0 is Alice's input, q1 is Alice's half of the Bell pair, and q2 is Bob's qubit.",
    es: "q0 es la entrada de Alice, q1 es la mitad de Alice del par de Bell y q2 es el qubit de Bob.",
  },
  back: { en: "Back to experiments", es: "Volver a experimentos" },
} as const satisfies Record<string, LocalizedText>;

export type TeleportationUiStringKey = keyof typeof TELEPORTATION_UI_STRINGS;
