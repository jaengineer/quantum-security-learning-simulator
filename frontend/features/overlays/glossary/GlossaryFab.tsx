"use client";

/**
 * Floating action button that opens the ``GlossaryDrawer``.
 *
 * Placement notes:
 *   - Fixed to the bottom-right corner so it stays out of the way while the
 *     user works on the Builder / Simulator.
 *   - Uses ``env(safe-area-inset-bottom)`` so it never collides with the iOS
 *     home indicator or any browser bottom chrome on mobile.
 *   - On viewports < ``sm`` it shrinks to an icon-only circle to avoid
 *     covering important mobile controls; on ``sm+`` it shows the "Glossary"
 *     label too.
 */

import { useState } from "react";

import { GlossaryDrawer } from "@/features/overlays/glossary/GlossaryDrawer";

export function GlossaryFab() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Open quantum glossary"
        title="Open quantum glossary"
        className={[
          "fixed right-4 z-40 inline-flex items-center gap-2 rounded-full border border-slate-900 bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-lg",
          "bottom-[calc(1.5rem+env(safe-area-inset-bottom))] right-[calc(1rem+env(safe-area-inset-right))]",
          "transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
          "dark:border-slate-100 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
        ].join(" ")}
      >
        <span
          aria-hidden
          className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-current font-bold"
        >
          ?
        </span>
        <span className="hidden sm:inline">Glossary</span>
      </button>

      <GlossaryDrawer open={open} onOpenChange={setOpen} />
    </>
  );
}
