import assert from "node:assert/strict";
import test from "node:test";

import { formatDiracStateLatex } from "@/features/quantum/builder/format/formatDiracState";
import { TELEPORTATION_INPUT_STATES } from "@/features/quantum/teleportation/data/inputStates";
import {
  TELEPORTATION_PROTOCOL_PHASES,
  getPhaseNavigationState,
  getTeleportationPhaseView,
} from "@/features/quantum/teleportation/data/protocolPhases";
import {
  ALICE_MEASUREMENT_OUTCOMES,
  evaluateTeleportationBranch,
} from "@/features/quantum/teleportation/math/teleportation-protocol";

const EPS = 1e-6;
const ZERO_STATE_LATEX = formatDiracStateLatex([
  { re: 1, im: 0 },
  { re: 0, im: 0 },
]);

const EXPECTED_PHASE_ORDER = [
  "initial",
  "bell-superposition",
  "bell-pair",
  "alice-coupling",
  "measurement-basis",
  "measurement",
  "classical-communication",
  "bob-correction",
  "recovered",
] as const;

test("guided protocol phases keep the approved order", () => {
  assert.deepEqual(
    TELEPORTATION_PROTOCOL_PHASES.map((phase) => phase.id),
    EXPECTED_PHASE_ORDER
  );
});

test("guided protocol phases include complete EN/ES educational content", () => {
  for (const phase of TELEPORTATION_PROTOCOL_PHASES) {
    assert.ok(phase.label.en, `${phase.id} missing EN label`);
    assert.ok(phase.label.es, `${phase.id} missing ES label`);
    assert.ok(phase.title.en, `${phase.id} missing EN title`);
    assert.ok(phase.title.es, `${phase.id} missing ES title`);
    assert.ok(phase.description.en, `${phase.id} missing EN description`);
    assert.ok(phase.description.es, `${phase.id} missing ES description`);
  }
});

test("phase-to-circuit-column mapping preserves sequential highlights", () => {
  const bellSuperposition = TELEPORTATION_PROTOCOL_PHASES.find(
    (phase) => phase.id === "bell-superposition"
  );
  const bellPair = TELEPORTATION_PROTOCOL_PHASES.find(
    (phase) => phase.id === "bell-pair"
  );
  const recovered = TELEPORTATION_PROTOCOL_PHASES.find(
    (phase) => phase.id === "recovered"
  );

  assert.ok(bellSuperposition);
  assert.ok(bellPair);
  assert.ok(recovered);
  assert.deepEqual(bellSuperposition.activeColumnIds, ["h-q1"]);
  assert.deepEqual(bellSuperposition.completedColumnIds, ["prepare"]);
  assert.deepEqual(bellPair.completedColumnIds, ["prepare", "h-q1"]);
  assert.deepEqual(bellPair.activeColumnIds, ["cnot-q1-q2"]);
  assert.deepEqual(recovered.activeColumnIds, ["recovered"]);
});

test("phase navigation disables previous on first phase and next on last phase", () => {
  const first = getPhaseNavigationState("initial");
  const last = getPhaseNavigationState("recovered");

  assert.equal(first.isFirst, true);
  assert.equal(first.previousPhaseId, null);
  assert.equal(first.nextPhaseId, "bell-superposition");
  assert.equal(last.isLast, true);
  assert.equal(last.previousPhaseId, "bob-correction");
  assert.equal(last.nextPhaseId, null);
});

test("measurement phase exposes the four equally likely branches", () => {
  const input = TELEPORTATION_INPUT_STATES[0];
  const branch = evaluateTeleportationBranch(input, "00");
  const view = getTeleportationPhaseView({
    phaseId: "measurement",
    input,
    branch,
    locale: "en",
  });

  assert.deepEqual(
    view.branchOptions?.map((option) => option.outcome),
    ALICE_MEASUREMENT_OUTCOMES
  );
  assert.ok(view.branchOptions?.every((option) => option.probability === 0.25));
});

test("initial phase exposes q0/q1/q2 through existing Dirac state rendering", () => {
  const input = TELEPORTATION_INPUT_STATES[0];
  const branch = evaluateTeleportationBranch(input, "00");
  const view = getTeleportationPhaseView({
    phaseId: "initial",
    input,
    branch,
    locale: "es",
  });

  assert.deepEqual(view.initialQubitStates, {
    q0: input.latex,
    q1: ZERO_STATE_LATEX,
    q2: ZERO_STATE_LATEX,
  });
});

test("Bell-pair explanation is precise about CNOT acting on the prepared superposition", () => {
  const phase = TELEPORTATION_PROTOCOL_PHASES.find(
    (candidate) => candidate.id === "bell-pair"
  );

  assert.ok(phase);
  assert.match(phase.description.en, /prepared superposition/i);
  assert.match(phase.description.es, /superposición preparada/i);
  assert.equal(
    phase.formulaLatex,
    "\\lvert\\Phi^+\\rangle_{q1q2}=\\frac{\\lvert00\\rangle+\\lvert11\\rangle}{\\sqrt2}"
  );
});

test("recovered-state phase explains that the state, not matter, is teleported", () => {
  const phase = TELEPORTATION_PROTOCOL_PHASES.find(
    (candidate) => candidate.id === "recovered"
  );

  assert.ok(phase);
  assert.match(phase.description.en, /No matter or physical qubit is transported/);
  assert.match(phase.description.es, /No se transporta materia ni el qubit físico/);
});

test("guided correction views preserve branch mapping from the math engine", () => {
  const input = TELEPORTATION_INPUT_STATES[2];
  const expectedCorrectionByOutcome = {
    "00": "I",
    "01": "X",
    "10": "Z",
    "11": "XZ",
  } as const;

  for (const outcome of ALICE_MEASUREMENT_OUTCOMES) {
    const branch = evaluateTeleportationBranch(input, outcome);
    const correction = getTeleportationPhaseView({
      phaseId: "bob-correction",
      input,
      branch,
      locale: "en",
    });
    const recovered = getTeleportationPhaseView({
      phaseId: "recovered",
      input,
      branch,
      locale: "en",
    });

    assert.equal(correction.correctionLabel, expectedCorrectionByOutcome[outcome]);
    assert.equal(correction.correctionLabel, branch.correction.label);
    assert.equal(correction.bobUncorrectedStateLatex, formatDiracStateLatex(branch.bobUncorrectedState));
    assert.equal(recovered.bobCorrectedStateLatex, formatDiracStateLatex(branch.bobCorrectedState));
    assert.equal(recovered.fidelity, branch.fidelity);
  }
});

test("phase views adapt to every input state and selected branch", () => {
  for (const input of TELEPORTATION_INPUT_STATES) {
    for (const outcome of ALICE_MEASUREMENT_OUTCOMES) {
      const branch = evaluateTeleportationBranch(input, outcome);
      const initial = getTeleportationPhaseView({
        phaseId: "initial",
        input,
        branch,
        locale: "en",
      });
      const correction = getTeleportationPhaseView({
        phaseId: "bob-correction",
        input,
        branch,
        locale: "en",
      });
      const recovered = getTeleportationPhaseView({
        phaseId: "recovered",
        input,
        branch,
        locale: "en",
      });

      assert.equal(initial.inputStateLatex, input.latex);
      assert.equal(correction.selectedOutcome, outcome);
      assert.equal(correction.correctionLabel, branch.correction.label);
      assert.match(correction.formulaLatex ?? "", new RegExp(branch.correction.label));
      assert.equal(recovered.fidelity, branch.fidelity);
      assert.equal(recovered.inputStateLatex, input.latex);
      assert.ok(recovered.bobCorrectedStateLatex);
      assert.ok(Math.abs((recovered.fidelity ?? 0) - 1) <= EPS);
    }
  }
});
