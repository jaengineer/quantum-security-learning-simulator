"use client";

/**
 * HTML overlays positioned at the six cardinal points of the Bloch sphere.
 * Using <Html> from drei (instead of three.js text) lets the labels keep their
 * crisp typography and respect the page's dark/light mode automatically.
 */

import { Html } from "@react-three/drei";

const LABEL_OFFSET = 1.18;

interface LabelSpec {
  position: [number, number, number];
  text: string;
}

const LABELS: ReadonlyArray<LabelSpec> = [
  { position: [0, 0, LABEL_OFFSET], text: "|0⟩" },
  { position: [0, 0, -LABEL_OFFSET], text: "|1⟩" },
  { position: [LABEL_OFFSET, 0, 0], text: "|+⟩" },
  { position: [-LABEL_OFFSET, 0, 0], text: "|−⟩" },
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
          style={{ pointerEvents: "none" }}
        >
          <span
            className={[
              "select-none rounded-md border px-1.5 py-0.5 font-mono text-[11px]",
              "border-slate-200 bg-white/90 text-slate-700 shadow-sm",
              "dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-100",
            ].join(" ")}
          >
            {label.text}
          </span>
        </Html>
      ))}
    </group>
  );
}
