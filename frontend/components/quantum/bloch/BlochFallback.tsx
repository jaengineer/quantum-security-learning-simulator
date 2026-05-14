"use client";

/**
 * Static 2D fallback shown when WebGL is unavailable or while the R3F bundle
 * is loading. Renders a simple SVG of a Bloch sphere cross-section with the
 * |0>, |1>, |+>, |-> labels in place, so the educational intent of the panel
 * is preserved even without 3D rendering.
 */

interface BlochFallbackProps {
  message?: string;
}

export function BlochFallback({ message }: BlochFallbackProps) {
  return (
    <div
      role="img"
      aria-label="Bloch sphere (static fallback)"
      className={[
        "flex h-[260px] w-full flex-col items-center justify-center gap-2 rounded-xl border",
        "border-slate-200 bg-slate-50/60 p-4",
        "dark:border-slate-800 dark:bg-slate-900/40",
      ].join(" ")}
    >
      <svg viewBox="0 0 220 220" className="h-44 w-44" aria-hidden>
        <defs>
          <radialGradient id="bloch-sphere-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.18)" />
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </radialGradient>
        </defs>
        <circle
          cx="110"
          cy="110"
          r="88"
          fill="url(#bloch-sphere-grad)"
          stroke="currentColor"
          strokeOpacity="0.5"
          strokeWidth="1"
          className="text-slate-400 dark:text-slate-500"
        />
        <ellipse
          cx="110"
          cy="110"
          rx="88"
          ry="22"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.35"
          strokeWidth="1"
          className="text-slate-400 dark:text-slate-500"
        />
        <line
          x1="110"
          y1="14"
          x2="110"
          y2="206"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          className="text-slate-500 dark:text-slate-400"
        />
        <line
          x1="14"
          y1="110"
          x2="206"
          y2="110"
          stroke="currentColor"
          strokeOpacity="0.55"
          strokeWidth="1.2"
          className="text-slate-500 dark:text-slate-400"
        />
        <text
          x="110"
          y="10"
          fontSize="10"
          textAnchor="middle"
          className="fill-slate-700 dark:fill-slate-200"
        >
          |0&#10217;
        </text>
        <text
          x="110"
          y="216"
          fontSize="10"
          textAnchor="middle"
          className="fill-slate-700 dark:fill-slate-200"
        >
          |1&#10217;
        </text>
        <text
          x="210"
          y="113"
          fontSize="10"
          textAnchor="start"
          className="fill-slate-700 dark:fill-slate-200"
        >
          |+&#10217;
        </text>
        <text
          x="10"
          y="113"
          fontSize="10"
          textAnchor="end"
          className="fill-slate-700 dark:fill-slate-200"
        >
          |&#8722;&#10217;
        </text>
      </svg>
      <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
        {message ?? "3D view not available in this environment."}
      </p>
    </div>
  );
}
