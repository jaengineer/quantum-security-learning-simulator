"use client";

/**
 * HTML overlays positioned at the six cardinal points of the Bloch sphere
 * (computational, Hadamard and circular bases).
 *
 * Using <Html> from drei (instead of three.js text) lets the labels keep
 * their crisp typography and respect the page's dark/light mode automatically.
 *
 * Each label is wrapped in a ``LearnableTooltip`` so hovering / focusing the
 * pole reveals the corresponding bra-ket explanation with a deep link into
 * the Theory Lab. Phase 6 educational overlays and future Theory Lab
 * integrations rely on this component, so it is intentionally kept rich.
 *
 * Provider bridge: ``BlochLabels`` is mounted inside ``@react-three/fiber``'s
 * ``<Canvas>``, which uses its own React reconciler. React Context from the
 * outer DOM tree does NOT propagate across reconciler boundaries, so we
 * **re-mount** ``LearnableTooltipProvider`` inside each ``<Html>`` portal.
 * Each provider is independent (it only configures delay timings), so having
 * one per pole has no side effects.
 */

import { Html } from "@react-three/drei";
import { useMemo } from "react";

import {
  LearnableTooltip,
  LearnableTooltipProvider,
} from "@/features/overlays/tooltip/LearnableTooltip";
import { QUANTUM_COLORS } from "@/styles/quantum-theme";

import { LABEL_OFFSET } from "./bloch3d-math";

/**
 * Color groups follow the spec's basis-by-axis convention:
 *   - Z-axis (computational basis |0\u27e9, |1\u27e9)      -> cyan
 *   - X-axis (Hadamard basis |+\u27e9, |\u2212\u27e9)              -> cyan
 *   - Y-axis (circular basis |i+\u27e9, |i\u2212\u27e9)            -> violet
 *
 * The Z and X bases share the cyan family by design: they sit on the two
 * "real-amplitude" axes of the Bloch ball, while the circular basis on Y
 * (purely imaginary amplitudes) gets the violet family to read as a
 * distinct semantic group.
 */
const POLE_COLOR_COMPUTATIONAL = QUANTUM_COLORS.quantumCyan;
const POLE_COLOR_HADAMARD = QUANTUM_COLORS.quantumCyan;
const POLE_COLOR_CIRCULAR = QUANTUM_COLORS.quantumViolet;

const DOT_RADIUS = 0.045;

/**
 * Radial distance at which the colored basis dots are anchored. Fixed at
 * 1.0 so the dots always sit exactly on the (scaled) sphere surface,
 * regardless of where the text label is placed.
 */
const DOT_OFFSET = 1.0;

/**
 * Pole family. Drives the text color of the ket label (cyan for the Z+X
 * "real" bases, violet for the Y "imaginary" basis). The colored dot uses
 * the same hue family but as a 3D material color.
 */
type PoleFamily = "computational" | "hadamard" | "circular";

interface LabelSpec {
  /** Unit-length direction from the origin toward this pole. */
  direction: readonly [number, number, number];
  /** World position for the colored dot — on the sphere surface. */
  dotPosition: [number, number, number];
  /**
   * World position for the text label. Per-state so the HTML overlay
   * always reads cleanly next to its dot without overlapping the axis
   * line, the equator, or the arrow tip.
   */
  textPosition: [number, number, number];
  text: string;
  title: string;
  description: string;
  latex?: string;
  conceptId: string;
  /** Tint for the small dot rendered at this pole. */
  color: string;
  /** Family used to colorize the ket text via Tailwind classes. */
  family: PoleFamily;
  /**
   * Optional screen-space horizontal nudge (in pixels) applied to the text
   * label. Used to push the Z-axis kets (|0⟩, |1⟩) a few pixels to the right
   * so they never overlap the vertical Z axis line. Screen-space (rather than
   * a 3D offset) keeps the nudge constant regardless of camera rotation.
   */
  screenShiftX?: number;
}

/** Six canonical pole directions on the unit sphere. */
type Direction = readonly [number, number, number];
type Offset = readonly [number, number, number];

interface PoleDescriptor {
  direction: Direction;
  /**
   * Absolute world position (in the unscaled sphere frame) at which the
   * ket text label is rendered. Tuned per-state so each label sits
   * outside the sphere surface, away from its axis line, and well clear
   * of the arrow tip.
   */
  textOffset: Offset;
  text: string;
  title: string;
  description: string;
  latex?: string;
  conceptId: string;
  color: string;
  family: PoleFamily;
  /** Screen-space horizontal nudge (px) for the text label. */
  screenShiftX?: number;
}

const POLE_DESCRIPTORS: ReadonlyArray<PoleDescriptor> = [
  {
    direction: [0, 0, 1],
    textOffset: [0.0, 0.0, 1.18],
    text: "|0⟩",
    title: "|0⟩ (computational basis)",
    description: "North pole of the Bloch sphere — the ground basis state.",
    conceptId: "dirac-notation",
    color: POLE_COLOR_COMPUTATIONAL,
    family: "computational",
    screenShiftX: 22,
  },
  {
    direction: [0, 0, -1],
    textOffset: [0.10, 0.0, -0.84],
    text: "|1⟩",
    title: "|1⟩ (computational basis)",
    description: "South pole of the Bloch sphere — the excited basis state.",
    conceptId: "dirac-notation",
    color: POLE_COLOR_COMPUTATIONAL,
    family: "computational",
    screenShiftX: 22,
  },
  {
    direction: [1, 0, 0],
    textOffset: [1.08, -0.04, 0.16],
    text: "|+⟩",
    title: "|+⟩ (Hadamard basis)",
    description: "Eigenstate of X with eigenvalue +1: (|0⟩ + |1⟩)/√2.",
    latex: "|+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + |1\\rangle)",
    conceptId: "hermitian-matrices",
    color: POLE_COLOR_HADAMARD,
    family: "hadamard",
  },
  {
    direction: [-1, 0, 0],
    textOffset: [-1.08, -0.04, 0.16],
    text: "|−⟩",
    title: "|−⟩ (Hadamard basis)",
    description: "Eigenstate of X with eigenvalue −1: (|0⟩ − |1⟩)/√2.",
    latex: "|-\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle - |1\\rangle)",
    conceptId: "hermitian-matrices",
    color: POLE_COLOR_HADAMARD,
    family: "hadamard",
  },
  {
    direction: [0, 1, 0],
    textOffset: [0.08, 1.08, 0.26],
    text: "|i+⟩",
    title: "|i+⟩ (circular basis)",
    description:
      "Eigenstate of Y with eigenvalue +1: (|0⟩ + i|1⟩)/√2.",
    latex: "|i+\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle + i|1\\rangle)",
    conceptId: "hermitian-matrices",
    color: POLE_COLOR_CIRCULAR,
    family: "circular",
  },
  {
    direction: [0, -1, 0],
    textOffset: [-0.08, -1.08, 0.18],
    text: "|i−⟩",
    title: "|i−⟩ (circular basis)",
    description:
      "Eigenstate of Y with eigenvalue −1: (|0⟩ − i|1⟩)/√2.",
    latex: "|i-\\rangle = \\tfrac{1}{\\sqrt{2}}(|0\\rangle - i|1\\rangle)",
    conceptId: "hermitian-matrices",
    color: POLE_COLOR_CIRCULAR,
    family: "circular",
  },
];

function scaleDirection(
  direction: Direction,
  scalar: number
): [number, number, number] {
  return [direction[0] * scalar, direction[1] * scalar, direction[2] * scalar];
}

function scaleOffset(offset: Offset, scalar: number): [number, number, number] {
  return [offset[0] * scalar, offset[1] * scalar, offset[2] * scalar];
}

/**
 * Build the six pole-label specs. Dots are always anchored on the sphere
 * surface (``DOT_OFFSET = 1.0``). Each text label uses its own per-state
 * ``textOffset`` so kets never overlap axis lines or arrow tips; the
 * ``scale`` argument is a uniform multiplier applied to those offsets so
 * external consumers can still nudge them inward/outward if needed.
 */
function buildLabels(scale: number): ReadonlyArray<LabelSpec> {
  return POLE_DESCRIPTORS.map((pole) => ({
    direction: pole.direction,
    dotPosition: scaleDirection(pole.direction, DOT_OFFSET),
    textPosition: scaleOffset(pole.textOffset, scale),
    text: pole.text,
    title: pole.title,
    description: pole.description,
    latex: pole.latex,
    conceptId: pole.conceptId,
    color: pole.color,
    family: pole.family,
    screenShiftX: pole.screenShiftX,
  }));
}

const KET_TEXT_BASE_CLASSNAME =
  "pointer-events-none select-none whitespace-nowrap bg-transparent p-0 font-mono text-xl font-medium leading-none tracking-tight drop-shadow-sm";

function ketTextClassName(family: PoleFamily): string {
  return family === "circular"
    ? `${KET_TEXT_BASE_CLASSNAME} text-violet-600 dark:text-violet-300`
    : `${KET_TEXT_BASE_CLASSNAME} text-cyan-700 dark:text-cyan-300`;
}

export interface BlochLabelsProps {
  /**
   * Uniform multiplier applied to each pole's per-state ``textOffset``.
   * 1.0 (the default) keeps the layout tuned for the reference image;
   * external consumers can shrink/grow it if their framing requires.
   *
   * The legacy "radial distance" semantics are preserved as a no-op
   * default of ``LABEL_OFFSET`` so callers that still pass the old prop
   * keep working — values close to 1.0 result in nearly identical
   * positions.
   */
  labelOffset?: number;
}

export function BlochLabels({
  labelOffset = LABEL_OFFSET,
}: BlochLabelsProps = {}) {
  const labels = useMemo(() => buildLabels(labelOffset), [labelOffset]);
  return (
    <group>
      {labels.map((label) => (
        <group key={label.text}>
          {/*
            Small colored sphere anchored ON the sphere surface (DOT_OFFSET).
            Cyan for the Z/X "real" bases, violet for the Y "imaginary"
            basis. Radius (0.045) stays well below the hero state-vector
            tip so the basis dots never compete with the current-state
            marker.
          */}
          <mesh position={label.dotPosition}>
            <sphereGeometry args={[DOT_RADIUS, 14, 14]} />
            <meshStandardMaterial
              color={label.color}
              emissive={label.color}
              emissiveIntensity={0.45}
              roughness={0.5}
              metalness={0.05}
            />
          </mesh>

          {/* Text label sits at the per-state offset, far enough from
              the axis line that it never collides with the arrow tip. */}
          <Html position={label.textPosition} center distanceFactor={6}>
            <LearnableTooltipProvider>
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
                  className={ketTextClassName(label.family)}
                  style={
                    label.screenShiftX
                      ? { transform: `translateX(${label.screenShiftX}px)` }
                      : undefined
                  }
                >
                  {label.text}
                </button>
              </LearnableTooltip>
            </LearnableTooltipProvider>
          </Html>
        </group>
      ))}
    </group>
  );
}
