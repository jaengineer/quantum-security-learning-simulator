/**
 * Mapping layer ``GateId -> glossaryEntryId``.
 *
 * This deliberately introduces one extra hop instead of mapping ``GateId``
 * straight to ``theoryConceptId`` so:
 *   - the UI stays decoupled from Theory Lab routes;
 *   - the glossary can be enriched with extra terms that have no theory
 *     counterpart yet without changing the gate descriptors.
 */

import type { GateId } from "@/features/quantum/builder/types";

import {
  getGlossaryEntry,
  getTheoryRouteForEntry,
  type GlossaryEntry,
} from "@/features/overlays/glossary/entries";

const GATE_TO_GLOSSARY: Record<GateId, string> = {
  I: "gate-identity",
  X: "gate-pauli-x",
  Y: "gate-pauli-y",
  Z: "gate-pauli-z",
  H: "gate-hadamard",
  S: "gate-phase-s",
  Sdg: "gate-phase-sdg",
  T: "gate-phase-t",
  Tdg: "gate-phase-tdg",
  Rx: "gate-rx",
  Ry: "gate-ry",
  Rz: "gate-rz",
};

export function getGlossaryEntryForGate(gateId: GateId): GlossaryEntry | undefined {
  return getGlossaryEntry(GATE_TO_GLOSSARY[gateId]);
}

export function getTheoryRouteForGate(gateId: GateId): string | null {
  const entry = getGlossaryEntryForGate(gateId);
  return entry ? getTheoryRouteForEntry(entry) : null;
}
