"use client";

/**
 * The actual R3F scene. Imported only client-side (via the dynamic wrapper in
 * ``BlochSphere.tsx``) so SSR never touches WebGL. A defensive WebGL probe
 * falls back to the static SVG diagram if the runtime cannot create a 3D
 * context.
 */

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useState } from "react";

import { BlochAxes } from "./BlochAxes";
import { BlochFallback } from "./BlochFallback";
import { BlochLabels } from "./BlochLabels";
import { BlochStateVector } from "./BlochStateVector";
import type { SingleQubitGate, SupportedKet } from "./blochMath";
import { applyGates, ketToVector } from "./blochMath";

export interface BlochSphereCanvasProps {
  initialState: "0" | "1";
  appliedGates?: ReadonlyArray<SingleQubitGate>;
  animate?: boolean;
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

export function BlochSphereCanvas({
  initialState,
  appliedGates = [],
  animate = true,
}: BlochSphereCanvasProps) {
  // Lazy initial state: this component only runs client-side (it is loaded via
  // next/dynamic with ssr: false), so calling detectWebGl during initialisation
  // is safe and avoids the "setState in useEffect" anti-pattern.
  const [webglOk] = useState<boolean>(() => detectWebGl());

  const { source, target } = useMemo(() => {
    const start: SupportedKet = initialState === "1" ? "1" : "0";
    return {
      source: ketToVector(start),
      target: applyGates(start, appliedGates),
    };
  }, [initialState, appliedGates]);

  if (!webglOk) {
    return <BlochFallback />;
  }

  return (
    <div
      className={[
        "h-[260px] w-full overflow-hidden rounded-xl border",
        "border-slate-200 bg-gradient-to-b from-slate-50/60 to-white/40",
        "dark:border-slate-800 dark:from-slate-900/40 dark:to-slate-950/40",
      ].join(" ")}
      style={{ boxShadow: animate ? "var(--glow-quantum-violet)" : undefined }}
    >
      <Canvas
        camera={{ position: [2.4, 1.8, 2.4], fov: 45, up: [0, 0, 1] }}
        dpr={[1, 2]}
        frameloop={animate ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        aria-label="Interactive Bloch sphere"
      >
        <ambientLight intensity={0.65} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, -2, 2]} intensity={0.3} />

        <BlochAxes />
        <BlochLabels />
        <BlochStateVector
          source={source}
          target={target}
          animate={animate}
        />

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI - 0.2}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
