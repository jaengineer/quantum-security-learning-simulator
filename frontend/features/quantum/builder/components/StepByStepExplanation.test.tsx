import assert from "node:assert/strict";
import test from "node:test";

import { renderToStaticMarkup } from "react-dom/server";

import { StepByStepExplanation } from "@/features/quantum/builder/components/StepByStepExplanation";
import { simulate } from "@/features/quantum/builder/math/quantum-simulator";
import type { GateInstance } from "@/features/quantum/builder/types";

function single(gateId: "X" | "S", targetQubit: 0 | 1): GateInstance {
  return {
    id: `${gateId}-q${targetQubit}`,
    gateId,
    arity: 1,
    targetQubit,
  };
}

test("step-by-step labels preserve q1 for X(q1) followed by S(q1)", () => {
  const result = simulate(2, [single("X", 1), single("S", 1)]);
  const html = renderToStaticMarkup(<StepByStepExplanation result={result} />);

  assert.match(html, /Apply X\(q1\)/);
  assert.match(html, /Apply S\(q1\)/);
});
