"use client";

/**
 * Public, SSR-safe wrapper around the interactive 3D Bloch sphere scene.
 *
 * Visualization-only contract:
 *   - Accepts already-computed Bloch coordinates ``(x, y, z)`` and an
 *     optional ``trajectory`` array. No simulator / math logic lives here
 *     or in any of its children — coordinates always come from the caller.
 *   - Imports the heavy R3F scene through ``next/dynamic({ ssr: false })``
 *     so Next.js never attempts to render three.js on the server.
 *   - Falls back to the existing 2D SVG (``BlochSphereViewer``) in three
 *     situations:
 *       (1) the dynamic chunk is still loading,
 *       (2) WebGL is not available at runtime,
 *       (3) the component is being SSR'd / pre-hydration.
 *
 * Visibility flags (``showLabels``, ``showTrajectory``, ``showControls``)
 * let different consumers pick their own mode: the Builder enables all
 * three, the existing gate-based wrapper only needs labels, etc.
 *
 * Expand mode (``expandable``) opens a Radix Dialog that re-renders the
 * same primitive at viewport scale for a focused study view. Hosts that
 * want to route to a different surface can pass ``onExpand`` to override
 * the built-in dialog.
 */

import * as Dialog from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";

import { BlochSphereViewer } from "@/features/quantum/builder/components/BlochSphereViewer";

import type { TrajectoryPoint } from "./BlochSphere3DTrajectory";
import {
  DEFAULT_BLOCH_VIEW_MODE,
  type BlochSphere3DViewMode,
} from "./viewModes";

export type { TrajectoryPoint } from "./BlochSphere3DTrajectory";
export {
  BLOCH_VIEW_MODE_PRESETS,
  DEFAULT_BLOCH_VIEW_MODE,
  type BlochSphere3DViewMode,
} from "./viewModes";

const BlochSphere3DScene = dynamic(() => import("./BlochSphere3DScene"), {
  ssr: false,
  // The wrapper renders its own fallback overlay underneath, so the dynamic
  // ``loading`` slot does not need to render anything.
  loading: () => null,
});

export interface BlochSphere3DProps {
  /** Bloch X coordinate of the current single-qubit state. */
  x: number;
  /** Bloch Y coordinate of the current single-qubit state. */
  y: number;
  /** Bloch Z coordinate of the current single-qubit state. */
  z: number;
  /** Optional trajectory through Bloch space (e.g. step-by-step path). */
  trajectory?: ReadonlyArray<TrajectoryPoint>;
  /** Whether the state vector animates between successive updates. */
  animate?: boolean;
  /** Show the trajectory overlay. Default: true when ``trajectory`` is non-empty. */
  showTrajectory?: boolean;
  /** Show the six pole labels with educational tooltips. Default: true. */
  showLabels?: boolean;
  /** Show OrbitControls and the Reset view button. Default: true. */
  showControls?: boolean;
  /** Render an "Expand" button that opens a focused modal view. Default: false. */
  expandable?: boolean;
  /**
   * Override for the Expand button click. When provided, the built-in
   * dialog is not used and the host is responsible for the focus UI.
   */
  onExpand?: () => void;
  /**
   * Hover-ready opt-in callback fired with the metadata of the trajectory
   * dot under the pointer (or ``null`` on leave). The primitive never
   * renders a tooltip itself — this hook is meant for Phase 6 overlays.
   */
  onTrajectoryPointHover?: (point: TrajectoryPoint | null) => void;
  /**
   * Camera + framing preset. ``compact`` for narrow containers (Builder
   * side panel), ``hero`` for medium standalone surfaces (default),
   * ``expanded`` for the full-viewport focus mode. See `viewModes.ts`.
   */
  viewMode?: BlochSphere3DViewMode;
  /** Optional caption rendered below the canvas. */
  caption?: string;
  /** Pixel height of the canvas container. Default: 480. */
  height?: number;
  /** Extra classes appended to the canvas container. */
  className?: string;
}

export function BlochSphere3D({
  x,
  y,
  z,
  trajectory,
  animate = true,
  showTrajectory,
  showLabels = true,
  showControls = true,
  expandable = false,
  onExpand,
  onTrajectoryPointHover,
  viewMode = DEFAULT_BLOCH_VIEW_MODE,
  caption,
  height = 480,
  className,
}: BlochSphere3DProps) {
  const [webglFailed, setWebglFailed] = useState<boolean>(false);
  const [sceneMounted, setSceneMounted] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(false);

  const handleWebGlUnavailable = useCallback(() => {
    setWebglFailed(true);
  }, []);
  const handleMounted = useCallback(() => {
    setSceneMounted(true);
  }, []);

  const fallbackBloch = useMemo(() => ({ x, y, z }), [x, y, z]);

  const trajectoryHasData = (trajectory?.length ?? 0) > 0;
  const resolvedShowTrajectory = showTrajectory ?? trajectoryHasData;

  const containerClassName = [
    "relative w-full overflow-hidden rounded-xl border",
    "border-slate-200 bg-slate-50/80",
    "dark:border-slate-800 dark:bg-slate-950/60",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const showFallback = webglFailed || !sceneMounted;

  const handleExpandClick = useCallback(() => {
    if (onExpand) {
      onExpand();
      return;
    }
    setExpanded(true);
  }, [onExpand]);

  return (
    <div className="flex flex-col gap-2">
      <div className={containerClassName} style={{ height }}>
        <BlochSphere3DScene
          x={x}
          y={y}
          z={z}
          trajectory={trajectory}
          animate={animate}
          showLabels={showLabels}
          showTrajectory={resolvedShowTrajectory}
          showControls={showControls}
          viewMode={viewMode}
          onWebGlUnavailable={handleWebGlUnavailable}
          onMounted={handleMounted}
          onTrajectoryPointHover={onTrajectoryPointHover}
        />

        {expandable && !showFallback ? (
          <button
            type="button"
            onClick={handleExpandClick}
            aria-label="Expand Bloch sphere"
            className={[
              "absolute left-2 top-2 z-10 inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium",
              "border-slate-200 bg-white/85 text-slate-700 shadow-sm backdrop-blur",
              "transition hover:bg-white hover:text-slate-900",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
              "dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900",
            ].join(" ")}
          >
            <ExpandIcon className="h-3 w-3" aria-hidden />
            <span className="hidden sm:inline">Expand</span>
          </button>
        ) : null}

        {showFallback ? (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-white dark:bg-slate-950"
            aria-hidden={webglFailed ? undefined : "true"}
          >
            <BlochSphereViewer bloch={fallbackBloch} />
            {!webglFailed ? (
              <span className="sr-only">Loading interactive 3D view…</span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex justify-center">
        <span
          className={[
            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[11px] tabular-nums shadow-sm backdrop-blur",
            "border-slate-200/80 bg-white/70 text-slate-600",
            "dark:border-slate-700/70 dark:bg-slate-900/70 dark:text-slate-300",
          ].join(" ")}
        >
          <span aria-hidden className="text-slate-400 dark:text-slate-500">
            (x, y, z)
          </span>
          <span>
            {x.toFixed(3)}, {y.toFixed(3)}, {z.toFixed(3)}
          </span>
        </span>
      </div>

      {caption ? (
        <p className="text-center text-[11px] italic text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      ) : null}

      {expandable && !onExpand ? (
        <BlochSphereExpandDialog
          open={expanded}
          onOpenChange={setExpanded}
          // Pass-through props so the modal renders the exact same state.
          // ``viewMode`` is force-set to ``"expanded"`` by the dialog itself.
          x={x}
          y={y}
          z={z}
          trajectory={trajectory}
          animate={animate}
          showTrajectory={resolvedShowTrajectory}
          showLabels={showLabels}
          showControls={showControls}
          onTrajectoryPointHover={onTrajectoryPointHover}
          caption={caption}
        />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Focus-mode dialog                                                   */
/* ------------------------------------------------------------------ */

interface BlochSphereExpandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  x: number;
  y: number;
  z: number;
  trajectory?: ReadonlyArray<TrajectoryPoint>;
  animate: boolean;
  showTrajectory: boolean;
  showLabels: boolean;
  showControls: boolean;
  onTrajectoryPointHover?: (point: TrajectoryPoint | null) => void;
  caption?: string;
}

function BlochSphereExpandDialog({
  open,
  onOpenChange,
  x,
  y,
  z,
  trajectory,
  animate,
  showTrajectory,
  showLabels,
  showControls,
  onTrajectoryPointHover,
  caption,
}: BlochSphereExpandDialogProps) {
  // Re-measure the viewport every time the dialog opens so the sphere uses
  // the available height even after a window resize. ``window`` access is
  // guarded for SSR safety.
  const [innerHeight, setInnerHeight] = useState<number>(720);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const update = () =>
      setInnerHeight(Math.max(window.innerHeight, 480));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const focusedHeight = Math.max(
    Math.min(innerHeight - 160, 860),
    420
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={[
            "fixed inset-0 z-40 bg-slate-900/55 backdrop-blur-sm",
            "motion-safe:transition motion-safe:duration-150 motion-safe:ease-out",
            "data-[state=closed]:motion-safe:opacity-0",
            "data-[state=open]:motion-safe:opacity-100",
          ].join(" ")}
        />
        <Dialog.Content
          className={[
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "flex max-h-[92vh] w-[min(96vw,1100px)] flex-col gap-3 rounded-2xl border bg-white p-5 shadow-2xl",
            "border-slate-200 dark:border-slate-700 dark:bg-slate-900",
            "motion-safe:transition motion-safe:duration-150 motion-safe:ease-out",
            "data-[state=closed]:motion-safe:scale-95 data-[state=closed]:motion-safe:opacity-0",
            "data-[state=open]:motion-safe:scale-100 data-[state=open]:motion-safe:opacity-100",
          ].join(" ")}
        >
          <header className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1">
              <Dialog.Title className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Bloch sphere — focus view
              </Dialog.Title>
              <Dialog.Description className="text-xs text-slate-500 dark:text-slate-400">
                Drag to rotate. Press Escape to close.
              </Dialog.Description>
            </div>
            <Dialog.Close
              className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:text-slate-100"
              aria-label="Close focus view"
            >
              Close
            </Dialog.Close>
          </header>

          <div className="min-h-0 flex-1">
            {/*
              Recursive use of the same primitive: ``expandable={false}``
              so the focused view does not nest another Expand button.
              ``viewMode="expanded"`` selects the immersive camera preset
              regardless of the originating consumer's mode.
            */}
            <BlochSphere3D
              x={x}
              y={y}
              z={z}
              trajectory={trajectory}
              animate={animate}
              showTrajectory={showTrajectory}
              showLabels={showLabels}
              showControls={showControls}
              expandable={false}
              onTrajectoryPointHover={onTrajectoryPointHover}
              viewMode="expanded"
              caption={caption}
              height={focusedHeight}
            />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/* ------------------------------------------------------------------ */
/* Icon                                                                */
/* ------------------------------------------------------------------ */

function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 6V3h3M13 6V3h-3M3 10v3h3M13 10v3h-3" />
    </svg>
  );
}
