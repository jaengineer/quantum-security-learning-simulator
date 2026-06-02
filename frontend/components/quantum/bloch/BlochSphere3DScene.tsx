"use client";

/**
 * Client-only R3F scene for the 3D Bloch sphere primitive.
 *
 * This module is imported exclusively through ``next/dynamic({ ssr: false })``
 * from ``BlochSphere3D``, so it never executes during server rendering. A
 * defensive WebGL probe runs once at mount; when WebGL is unavailable it
 * notifies the wrapper via ``onWebGlUnavailable`` so the parent can render
 * the existing 2D SVG fallback.
 *
 * Visibility of trajectory / labels / controls is driven by props so the
 * same scene serves the Builder (everything on), the existing gate-based
 * wrapper (labels only) and any future consumer.
 *
 * Performance notes:
 *   - ``dpr={[1, 2]}`` caps pixel ratio on hi-dpi devices.
 *   - ``frameloop`` flips to ``"always"`` only while the state vector is
 *     animating; it returns to ``"demand"`` on settle, so idle CPU stays low
 *     on mobile.
 */

import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Canvas } from "@react-three/fiber";
import { useCallback, useEffect, useRef, useState } from "react";

import { BlochLabels } from "./BlochLabels";
import { BlochSphere3DAxes } from "./BlochSphere3DAxes";
import { BlochSphere3DTrajectory } from "./BlochSphere3DTrajectory";
import type { TrajectoryPoint } from "./BlochSphere3DTrajectory";
import { BlochSphere3DVector } from "./BlochSphere3DVector";
import {
  BLOCH_VIEW_MODE_PRESETS,
  type BlochSphere3DViewMode,
} from "./viewModes";

interface BlochSphere3DSceneProps {
  x: number;
  y: number;
  z: number;
  trajectory?: ReadonlyArray<TrajectoryPoint>;
  animate: boolean;
  showLabels: boolean;
  showTrajectory: boolean;
  showControls: boolean;
  /** Per-context camera/framing preset. See `viewModes.ts`. */
  viewMode: BlochSphere3DViewMode;
  onWebGlUnavailable?: () => void;
  /** Fires once the scene has mounted on the client (post dynamic-import). */
  onMounted?: () => void;
  /** Bubbles pointer-hover metadata from trajectory dots to the host. */
  onTrajectoryPointHover?: (point: TrajectoryPoint | null) => void;
}

function detectWebGl(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export default function BlochSphere3DScene({
  x,
  y,
  z,
  trajectory,
  animate,
  showLabels,
  showTrajectory,
  showControls,
  viewMode,
  onWebGlUnavailable,
  onMounted,
  onTrajectoryPointHover,
}: BlochSphere3DSceneProps) {
  const preset = BLOCH_VIEW_MODE_PRESETS[viewMode];
  // Lazy initial state: this module only runs client-side (loaded via
  // next/dynamic with ssr: false), so the probe is safe at init time.
  const [webglOk] = useState<boolean>(() => detectWebGl());
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const controlsRef = useRef<OrbitControlsImpl | null>(null);

  useEffect(() => {
    if (!webglOk) onWebGlUnavailable?.();
  }, [webglOk, onWebGlUnavailable]);

  useEffect(() => {
    if (webglOk) onMounted?.();
    // We only signal mount once. Even if the parent re-renders with a new
    // callback identity, the dependency array re-runs and re-notifies,
    // which is harmless (parent uses useCallback + idempotent setState).
  }, [webglOk, onMounted]);

  const handleReset = useCallback(() => {
    controlsRef.current?.reset();
  }, []);

  const handleAnimatingChange = useCallback((animating: boolean) => {
    setIsAnimating(animating);
  }, []);

  if (!webglOk) return null;

  const target = { x, y, z };
  const trajectoryToRender =
    showTrajectory && trajectory && trajectory.length > 0 ? trajectory : null;

  return (
    // A few pixels of internal padding ensure the sphere edge never visually
    // touches the rounded container border at very small panel sizes; the
    // ``sphereScale`` knob is the primary safeguard.
    <div className="relative h-full w-full" style={{ padding: 4 }}>
      <Canvas
        camera={{
          position: [
            preset.cameraPosition[0],
            preset.cameraPosition[1],
            preset.cameraPosition[2],
          ],
          fov: preset.fov,
          up: [0, 0, 1],
        }}
        dpr={[1, 2]}
        frameloop={animate && isAnimating ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        aria-label="Interactive 3D Bloch sphere"
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -2, 2]} intensity={0.3} />

        {/*
          A single scale knob shrinks the sphere, axes, labels and vector
          together so the camera framing stays the same across viewports.
          Per-context tuning happens via the ``viewMode`` preset.
        */}
        <group scale={preset.sphereScale}>
          <BlochSphere3DAxes />
          {showLabels ? <BlochLabels labelOffset={preset.labelOffset} /> : null}
          {trajectoryToRender ? (
            <BlochSphere3DTrajectory
              trajectory={trajectoryToRender}
              onHover={onTrajectoryPointHover}
            />
          ) : null}
          <BlochSphere3DVector
            target={target}
            animate={animate}
            onAnimatingChange={handleAnimatingChange}
          />
        </group>

        {showControls ? (
          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            enableZoom
            enableDamping
            minDistance={preset.minDistance}
            maxDistance={preset.maxDistance}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI - 0.2}
            rotateSpeed={0.7}
          />
        ) : null}
      </Canvas>

      {showControls ? (
        <button
          type="button"
          onClick={handleReset}
          className={[
            "absolute right-2 top-2 z-10 rounded-md border px-2 py-1 text-[11px] font-medium",
            "border-slate-200 bg-white/85 text-slate-700 shadow-sm backdrop-blur",
            "transition hover:bg-white hover:text-slate-900",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
            "dark:border-slate-700 dark:bg-slate-900/75 dark:text-slate-100 dark:hover:bg-slate-900",
          ].join(" ")}
          aria-label="Reset camera view"
        >
          Reset view
        </button>
      ) : null}
    </div>
  );
}
