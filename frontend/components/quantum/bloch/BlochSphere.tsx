"use client";

/**
 * Public, SSR-safe wrapper around the R3F Bloch-sphere scene. The actual
 * Canvas component lives in ``BlochSphereCanvas.tsx`` and is imported via
 * ``next/dynamic`` with ``ssr: false`` so Next.js never tries to render
 * three.js on the server.
 */

import dynamic from "next/dynamic";

import { BlochFallback } from "./BlochFallback";
import type { SingleQubitGate } from "./blochMath";

const BlochSphereCanvas = dynamic(
  () =>
    import("./BlochSphereCanvas").then((module) => ({
      default: module.BlochSphereCanvas,
    })),
  {
    ssr: false,
    loading: () => <BlochFallback message="Loading 3D view\u2026" />,
  }
);

export interface BlochSphereProps {
  initialState: "0" | "1";
  appliedGates?: ReadonlyArray<SingleQubitGate>;
  animate?: boolean;
  caption?: string;
}

export function BlochSphere({
  initialState,
  appliedGates,
  animate = true,
  caption,
}: BlochSphereProps) {
  return (
    <div className="flex flex-col gap-2">
      <BlochSphereCanvas
        initialState={initialState}
        appliedGates={appliedGates}
        animate={animate}
      />
      {caption ? (
        <p className="text-xs italic text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      ) : null}
    </div>
  );
}
