import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

const labSource = () =>
  readFileSync(
    path.join(
      process.cwd(),
      "features/quantum/teleportation/components/TeleportationLab.tsx"
    ),
    "utf8"
  );

const circuitSource = () =>
  readFileSync(
    path.join(
      process.cwd(),
      "features/quantum/teleportation/components/TeleportationCircuit.tsx"
    ),
    "utf8"
  );

test("Teleportation Lab relies on the global locale and exposes no local language selector", () => {
  const source = labSource();

  assert.equal(source.includes("onLocaleChange"), false);
  assert.equal(source.includes("setLocalLocale"), false);
  assert.equal(source.includes('t(locale, "language")'), false);
});

test("guided phase navigation stays in one horizontal scroll sequence and auto-scrolls active phase", () => {
  const source = labSource();

  assert.match(source, /useRef/);
  assert.match(source, /scrollIntoView/);
  assert.match(source, /data-testid="teleportation-phase-nav"/);
  assert.match(source, /flex-nowrap/);
  assert.doesNotMatch(source, /data-testid="teleportation-phase-nav"[\s\S]*flex-wrap/);
});

test("Teleportation circuit gates use opaque masks instead of transparent dimmed containers", () => {
  const source = circuitSource();

  assert.match(source, /CircuitElementMask/);
  assert.match(source, /bg-white dark:bg-slate-950/);
  assert.doesNotMatch(source, /stateClasses\(state\)[\s\S]{0,200}opacity-55/);
  assert.doesNotMatch(source, /muted && state !== "active"\s*\?\s*"opacity-/);
});
