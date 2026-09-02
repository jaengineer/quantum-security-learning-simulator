"use client";

export function HomeQuantumVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-3xl border border-violet-300/40 bg-slate-950/90 p-6 shadow-2xl shadow-violet-950/20 dark:border-violet-500/30"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_35%,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_35%_65%,rgba(34,211,238,0.18),transparent_38%)]" />
      <svg
        viewBox="0 0 320 320"
        className="relative z-10 h-full w-full text-slate-200"
      >
        <defs>
          <radialGradient id="home-bloch-glow" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="rgba(167,139,250,0.38)" />
            <stop offset="65%" stopColor="rgba(34,211,238,0.12)" />
            <stop offset="100%" stopColor="rgba(15,23,42,0)" />
          </radialGradient>
          <linearGradient id="home-vector" x1="0" x2="1" y1="1" y2="0">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        <circle
          cx="160"
          cy="160"
          r="112"
          fill="url(#home-bloch-glow)"
          stroke="currentColor"
          strokeOpacity="0.38"
          strokeWidth="1.4"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="112"
          ry="32"
          fill="none"
          stroke="currentColor"
          strokeDasharray="5 6"
          strokeOpacity="0.35"
        />
        <ellipse
          cx="160"
          cy="160"
          rx="38"
          ry="112"
          fill="none"
          stroke="currentColor"
          strokeDasharray="4 7"
          strokeOpacity="0.22"
        />
        <line
          x1="160"
          x2="160"
          y1="35"
          y2="285"
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <line
          x1="35"
          x2="285"
          y1="160"
          y2="160"
          stroke="currentColor"
          strokeOpacity="0.45"
        />
        <line
          x1="160"
          x2="230"
          y1="160"
          y2="92"
          stroke="url(#home-vector)"
          strokeLinecap="round"
          strokeWidth="4"
          className="motion-safe:animate-pulse"
        />
        <circle
          cx="230"
          cy="92"
          r="7"
          fill="#22d3ee"
          stroke="#a78bfa"
          strokeWidth="2"
        />
        <circle cx="160" cy="160" r="4" fill="#e2e8f0" />

        <text x="160" y="24" textAnchor="middle" className="fill-slate-100 text-xs">
          |0⟩
        </text>
        <text x="160" y="306" textAnchor="middle" className="fill-slate-100 text-xs">
          |1⟩
        </text>
        <text x="296" y="164" textAnchor="middle" className="fill-slate-100 text-xs">
          |+⟩
        </text>
        <text x="24" y="164" textAnchor="middle" className="fill-slate-100 text-xs">
          |−⟩
        </text>

        <g opacity="0.55">
          <rect x="246" y="88" width="26" height="26" rx="6" fill="none" stroke="#a78bfa" />
          <text x="259" y="106" textAnchor="middle" className="fill-violet-200 text-xs">
            H
          </text>
          <line x1="272" x2="306" y1="101" y2="101" stroke="#64748b" />
          <rect x="256" y="146" width="26" height="26" rx="6" fill="none" stroke="#22d3ee" />
          <text x="269" y="164" textAnchor="middle" className="fill-cyan-100 text-xs">
            X
          </text>
          <line x1="282" x2="306" y1="159" y2="159" stroke="#64748b" />
        </g>
      </svg>
    </div>
  );
}
