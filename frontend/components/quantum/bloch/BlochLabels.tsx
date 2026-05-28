"use client";

/**
 * HTML overlays positioned at the six cardinal points of the Bloch sphere.
 * Using <Html> from drei (instead of three.js text) lets the labels keep
 * their crisp typography and respect the page's dark/light mode automatically.
 *
 * Each label is wrapped in a ``LearnableTooltip`` so hovering / focusing the
 * pole reveals the corresponding bra-ket explanation with a deep link into
 * the Theory Lab. The HTML overlay re-enables pointer events on the label
 * itself (the previous ``pointerEvents: "none"`` is dropped); the surrounding
 * ``<Html>`` keeps the regular drei layout.
 */

import { Html } from "@react-three/drei";

import { LearnableTooltip } from "@/features/overlays/tooltip/LearnableTooltip";

const LABEL_OFFSET = 1.18;

interface LabelSpec {
  position: [number, number, number];
  text: string;
  title: string;
  description: string;
  latex?: string;
  conceptId: string;
}

const LABELS: ReadonlyArray<LabelSpec> = [
  {
    position: [0, 0, LABEL_OFFSET],
    text: "|0⟩",
    title: "|0⟩ (computational basis)",
    description: "North pole of the Bloch sphere — the ground basis state.",
    conceptId: "dirac-notation",
  },
  {
    position: [0, 0, -LABEL_OFFSET],
    text: "|1⟩",
    title: "|1⟩ (computational basis)",
    description: "South pole of the Bloch sphere — the excited basis state.",
    conceptId: "dirac-notation",
  },
  {
    position: [LABEL_OFFSET, 0, 0],
    text: "|+⟩",
    title: "|+⟩ (Hadamard basis)",
    description: "Eigenstate of X with eigenvalue +1: (|0⟩ + |1⟩)/√2.",
    latex: "|+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)",
    conceptId: "hermitian-matrices",
  },
  {
    position: [-LABEL_OFFSET, 0, 0],
    text: "|−⟩",
    title: "|−⟩ (Hadamard basis)",
    description: "Eigenstate of X with eigenvalue −1: (|0⟩ − |1⟩)/√2.",
    latex: "|-\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)",
    conceptId: "hermitian-matrices",
  },
];

export function BlochLabels() {
  return (
    <group>
      {LABELS.map((label) => (
        <Html
          key={label.text}
          position={label.position}
          center
          distanceFactor={6}
        >
          <LearnableTooltip
            title={label.title}
            description={label.description}
            latex={label.latex}
            conceptId={label.conceptId}
            side="top"
          >
            <button
              type="button"
              aria-label={`${label.text} — ${label.title}`}
              className={[
                "select-none rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
                "border-slate-200 bg-white/90 text-slate-700 shadow-sm",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                "dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100",
              ].join(" ")}
            >
              {label.text}
            </button>
          </LearnableTooltip>
        </Html>
      ))}
    </group>
  );
}
