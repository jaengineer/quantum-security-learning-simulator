/**
 * Minimal textual circuit diagram.
 *
 * The objective is didactic clarity, not visual fidelity. A proper circuit
 * drawer (e.g. Qiskit's PNG export or react-quantum-circuit) belongs to a
 * later iteration.
 */

import type { ReactNode } from "react";

import { QuantumFormula } from "@/components/quantum/QuantumFormula";
import type { InitialState } from "@/features/quantum/types";

type Variant = "hadamard" | "bell";

interface CircuitDiagramProps {
  variant: Variant;
  initialState?: InitialState | string;
}

function StepBox({ children }: { children: ReactNode }) {
  return (
    <span
      className={[
        "inline-flex min-w-[2.5rem] items-center justify-center rounded-md border px-3 py-1.5 text-sm",
        "border-slate-300 bg-white text-slate-800",
        "dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function Arrow() {
  return (
    <span aria-hidden className="text-slate-400 dark:text-slate-500">
      {"\u2192"}
    </span>
  );
}

function WireLabel({ children }: { children: ReactNode }) {
  return (
    <span className="w-10 shrink-0 font-mono text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
      {children}
    </span>
  );
}

function Ket({ value }: { value: string }) {
  return <QuantumFormula expression={`\\lvert ${value}\\rangle`} />;
}

function HadamardWire({ initialState }: { initialState: string }) {
  const initialBox = <Ket value={initialState} />;
  const steps: ReadonlyArray<ReactNode> =
    initialState === "1"
      ? [initialBox, "X", "H", "Measurement"]
      : [initialBox, "H", "Measurement"];

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      {steps.map((label, index) => (
        <span key={index} className="flex items-center gap-2">
          <StepBox>{label}</StepBox>
          {index < steps.length - 1 ? <Arrow /> : null}
        </span>
      ))}
    </div>
  );
}

function BellWires() {
  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <WireLabel>q0</WireLabel>
        <StepBox>
          <Ket value="0" />
        </StepBox>
        <Arrow />
        <StepBox>H</StepBox>
        <Arrow />
        <StepBox>{"\u2022 (control)"}</StepBox>
        <Arrow />
        <StepBox>Measurement</StepBox>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <WireLabel>q1</WireLabel>
        <StepBox>
          <Ket value="0" />
        </StepBox>
        <Arrow />
        <StepBox>⊕ (target)</StepBox>
        <Arrow />
        <StepBox>Measurement</StepBox>
      </div>
      <p className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        H on q0 then CX(q0, q1) prepares the Bell state{" "}
        <QuantumFormula expression="\lvert \Phi^{+}\rangle = \tfrac{1}{\sqrt{2}}\bigl(\lvert 00\rangle + \lvert 11\rangle\bigr)" />
        .
      </p>
    </div>
  );
}

export function CircuitDiagram({
  variant,
  initialState = "0",
}: CircuitDiagramProps) {
  if (variant === "bell") {
    return <BellWires />;
  }
  return <HadamardWire initialState={initialState} />;
}
