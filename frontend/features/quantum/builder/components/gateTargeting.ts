import { getGate } from "@/features/quantum/builder/math/quantum-gates";
import type {
  BuilderGateInstance,
  BuilderQubitCount,
  BuilderQubitIndex,
  GateId,
} from "@/features/quantum/builder/types";
import { isBuilderQubitIndex } from "@/features/quantum/builder/types";

interface GateInstanceOptions {
  id?: string;
  theta?: number;
  targetQubit?: BuilderQubitIndex;
  controlQubit?: BuilderQubitIndex;
  targetQubits?: readonly [0, 1];
}

interface PaletteDropGateOptions {
  gateId: GateId;
  qubitCount: BuilderQubitCount;
  targetQubit: unknown;
  theta?: number;
  id?: string;
}

function newUid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `gate-${Math.random().toString(36).slice(2)}-${Date.now()}`;
}

export function resolveDropTargetQubit(
  rawTargetQubit: unknown,
  overId?: unknown
): BuilderQubitIndex | undefined {
  if (isBuilderQubitIndex(rawTargetQubit)) return rawTargetQubit;
  if (overId === "builder-canvas-q0") return 0;
  if (overId === "builder-canvas-q1") return 1;
  return undefined;
}

export function makeBuilderGateInstance(
  id: GateId,
  options: GateInstanceOptions = {}
): BuilderGateInstance {
  const def = getGate(id);
  const base = {
    id: options.id ?? newUid(),
    gateId: id,
    arity: def.arity,
    params: def.parametric ? { theta: options.theta ?? Math.PI / 2 } : undefined,
  } satisfies BuilderGateInstance;

  if (def.arity === 2 && id === "SWAP") {
    return { ...base, targetQubits: [0, 1] };
  }

  if (def.arity === 2) {
    return {
      ...base,
      controlQubit: options.controlQubit ?? 0,
      targetQubit: options.targetQubit ?? 1,
    };
  }

  return { ...base, targetQubit: options.targetQubit ?? 0 };
}

export function createPaletteDropGate({
  gateId,
  qubitCount,
  targetQubit,
  theta,
  id,
}: PaletteDropGateOptions): BuilderGateInstance | null {
  const def = getGate(gateId);

  if (def.arity === 2 && qubitCount !== 2) return null;

  if (def.arity === 1) {
    if (qubitCount === 1) {
      return makeBuilderGateInstance(gateId, { id, theta, targetQubit: 0 });
    }
    if (!isBuilderQubitIndex(targetQubit)) return null;
    return makeBuilderGateInstance(gateId, { id, theta, targetQubit });
  }

  if (gateId === "SWAP") {
    return makeBuilderGateInstance(gateId, { id });
  }

  const controlledTarget = isBuilderQubitIndex(targetQubit) ? targetQubit : 1;
  const controlQubit = controlledTarget === 0 ? 1 : 0;
  return makeBuilderGateInstance(gateId, {
    id,
    controlQubit,
    targetQubit: controlledTarget,
  });
}

export function retargetSingleQubitGate(
  gate: BuilderGateInstance,
  qubitCount: BuilderQubitCount,
  targetQubit: unknown
): BuilderGateInstance | null {
  if (qubitCount !== 2) return null;
  if (gate.arity !== 1) return null;
  if (!isBuilderQubitIndex(targetQubit)) return null;
  return { ...gate, targetQubit };
}
