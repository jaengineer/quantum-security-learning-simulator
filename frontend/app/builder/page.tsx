"use client";

import dynamic from "next/dynamic";
import Link from "next/link";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";

/**
 * The Quantum Circuit Builder lives behind ``next/dynamic({ ssr: false })``
 * on purpose. ``@dnd-kit/utilities`` (transitive dep of ``@dnd-kit/core``)
 * generates ``DndDescribedBy-N`` accessibility ids from a module-level
 * counter that is not React-id-based. In Next.js dev mode the server-side
 * module persists across HMR reloads and reaches N=14+, while the browser
 * starts from 0 on every full page load, causing a hydration mismatch on
 * every gate button. The Builder is an interactive tool with no SEO value,
 * so skipping SSR is the cleanest fix and also slightly trims the initial
 * HTML payload.
 */
const QuantumCircuitBuilder = dynamic(
  () =>
    import(
      "@/features/quantum/builder/components/QuantumCircuitBuilder"
    ).then((mod) => ({ default: mod.QuantumCircuitBuilder })),
  {
    ssr: false,
    loading: () => <BuilderSkeleton />,
  }
);

/**
 * Layout-preserving placeholder rendered while the Builder bundle is being
 * fetched and hydrated on the client. The grid template mirrors the real
 * Builder (``260px | 1fr | 320px`` on ``lg``) so there is zero layout shift
 * when the actual UI mounts.
 */
function BuilderSkeleton() {
  const tile =
    "h-[440px] rounded-2xl border border-slate-200 bg-slate-100/60 motion-safe:animate-pulse dark:border-slate-800 dark:bg-slate-900/40";
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading circuit builder"
      className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)_320px]"
    >
      <div className={tile} />
      <div className={tile} />
      <div className={tile} />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <LearnableTooltipProvider>
      <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:py-14">
        <header className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Interactive tool
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                Quantum Circuit Builder
              </h1>
              <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
                Design, simulate and visualize single-qubit quantum circuits.
                Drag gates from the palette onto the wire, reorder or remove
                them, and watch the state evolve in real time on the Bloch
                sphere and in the step-by-step panel.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-violet-400/60 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-violet-400/50 dark:hover:text-violet-300"
            >
              <span aria-hidden>{"\u2190"}</span>
              Back to experiments
            </Link>
          </div>
        </header>

        <QuantumCircuitBuilder />

        <footer className="mt-auto pt-6 text-xs text-slate-500 dark:text-slate-400">
          Simulation runs entirely in your browser (pure TypeScript, no
          backend round-trip). Single-qubit only for now &mdash; multi-qubit
          support is on the roadmap.
        </footer>
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
