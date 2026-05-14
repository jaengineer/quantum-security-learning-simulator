"use client";

/**
 * Lightweight 2D Bloch-sphere viewer.
 *
 * Renders the unit sphere as an SVG ellipse (frontal orthographic projection
 * with X horizontal, Z vertical) plus an equator line that hints at the Y
 * axis going into the page. The current state is drawn as a vector from the
 * origin to ``(x, -z)`` (SVG y axis points down so we negate Z). The Y
 * component drives a subtle depth cue: the tip dot grows / shrinks and its
 * opacity changes depending on whether the state is in front of or behind
 * the page plane.
 *
 * The component receives a single ``bloch`` prop. ``framer-motion`` animates
 * the line and dot between successive vectors, so the user sees the state
 * "moving" smoothly when the circuit changes.
 *
 * This MVP intentionally avoids R3F; the API (``{ bloch }``) is identical to
 * what a future 3D version would consume, so swapping the implementation is
 * a drop-in change.
 */

import { motion, useReducedMotion } from "framer-motion";

import type { BlochVector } from "@/features/quantum/builder/types";

interface BlochSphereViewerProps {
  bloch: BlochVector;
  caption?: string;
}

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = SIZE * 0.4;

interface AxisLabel {
  ket: string;
  cx: number;
  cy: number;
  hint: string;
}

const AXIS_LABELS: ReadonlyArray<AxisLabel> = [
  { ket: "|0⟩", cx: CENTER, cy: CENTER - RADIUS - 14, hint: "+Z" },
  { ket: "|1⟩", cx: CENTER, cy: CENTER + RADIUS + 18, hint: "-Z" },
  { ket: "|+⟩", cx: CENTER + RADIUS + 18, cy: CENTER + 4, hint: "+X" },
  { ket: "|−⟩", cx: CENTER - RADIUS - 18, cy: CENTER + 4, hint: "-X" },
];

function project(b: BlochVector): { tipX: number; tipY: number; depth: number } {
  return {
    tipX: CENTER + b.x * RADIUS,
    tipY: CENTER - b.z * RADIUS,
    depth: b.y,
  };
}

export function BlochSphereViewer({ bloch, caption }: BlochSphereViewerProps) {
  const reduceMotion = useReducedMotion();
  const { tipX, tipY, depth } = project(bloch);
  const dotR = 6 + depth * 1.5;
  const opacity = 0.55 + 0.45 * ((depth + 1) / 2);
  const transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.45, ease: [0.4, 0, 0.2, 1] as const };

  return (
    <figure className="flex w-full flex-col items-center gap-3">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label={`Bloch sphere at (${bloch.x.toFixed(2)}, ${bloch.y.toFixed(2)}, ${bloch.z.toFixed(2)})`}
        className="max-w-full"
      >
        <defs>
          <radialGradient id="bloch-fill" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.18)" />
            <stop offset="60%" stopColor="rgba(34, 211, 238, 0.10)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.04)" />
          </radialGradient>
        </defs>

        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="url(#bloch-fill)"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.4}
        />

        <ellipse
          cx={CENTER}
          cy={CENTER}
          rx={RADIUS}
          ry={RADIUS * 0.28}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.2}
          strokeDasharray="3 3"
          strokeWidth={1}
        />

        <line
          x1={CENTER - RADIUS - 6}
          y1={CENTER}
          x2={CENTER + RADIUS + 6}
          y2={CENTER}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
        />
        <line
          x1={CENTER}
          y1={CENTER - RADIUS - 6}
          x2={CENTER}
          y2={CENTER + RADIUS + 6}
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1}
        />

        {AXIS_LABELS.map((label) => (
          <text
            key={label.ket}
            x={label.cx}
            y={label.cy}
            textAnchor="middle"
            className="fill-slate-700 text-[11px] font-medium dark:fill-slate-300"
          >
            {label.ket}
          </text>
        ))}

        <text
          x={CENTER + RADIUS * 0.78}
          y={CENTER + RADIUS * 0.34}
          textAnchor="middle"
          className="fill-slate-400 text-[10px] italic dark:fill-slate-500"
        >
          +Y (into page)
        </text>

        <motion.line
          x1={CENTER}
          y1={CENTER}
          animate={{ x2: tipX, y2: tipY }}
          initial={false}
          transition={transition}
          stroke="var(--color-quantum-violet, #7c3aed)"
          strokeWidth={2.4}
          strokeLinecap="round"
        />

        <motion.circle
          animate={{ cx: tipX, cy: tipY, r: dotR, opacity }}
          initial={false}
          transition={transition}
          fill="var(--color-quantum-cyan, #22d3ee)"
          stroke="var(--color-quantum-violet, #7c3aed)"
          strokeWidth={1.6}
        />

        <circle
          cx={CENTER}
          cy={CENTER}
          r={2.5}
          fill="currentColor"
          fillOpacity={0.55}
        />
      </svg>

      <figcaption className="flex flex-col items-center gap-1 text-center text-xs text-slate-600 dark:text-slate-400">
        <span className="font-mono tabular-nums">
          (x, y, z) = ({bloch.x.toFixed(3)}, {bloch.y.toFixed(3)},{" "}
          {bloch.z.toFixed(3)})
        </span>
        {caption ? <span className="max-w-[18rem]">{caption}</span> : null}
      </figcaption>
    </figure>
  );
}
