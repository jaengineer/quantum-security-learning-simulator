"use client";

import Link from "next/link";

import { GlossaryFab } from "@/features/overlays/glossary/GlossaryFab";
import { LearnableTooltipProvider } from "@/features/overlays/tooltip/LearnableTooltip";
import { TeleportationLab } from "@/features/quantum/teleportation/components/TeleportationLab";
import { TELEPORTATION_UI_STRINGS } from "@/features/quantum/teleportation/i18n/strings";
import { useLocale } from "@/features/theory/i18n/LocaleContext";
import type { Locale } from "@/features/theory/i18n/types";

function t(locale: Locale, key: keyof typeof TELEPORTATION_UI_STRINGS): string {
  return TELEPORTATION_UI_STRINGS[key][locale];
}

export default function TeleportationPage() {
  const { locale, setLocale } = useLocale();

  return (
    <LearnableTooltipProvider>
      <main
        id="main-content"
        className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:py-14"
      >
        <header className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-600 dark:text-fuchsia-300">
            {t(locale, "eyebrow")}
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                {t(locale, "title")}
              </h1>
              <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
                {t(locale, "route_subtitle")}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-fuchsia-400/60 hover:text-fuchsia-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-fuchsia-400/50 dark:hover:text-fuchsia-300"
            >
              <span aria-hidden>{"\u2190"}</span>
              {t(locale, "back")}
            </Link>
          </div>
        </header>

        <TeleportationLab locale={locale} onLocaleChange={setLocale} />
      </main>

      <GlossaryFab />
    </LearnableTooltipProvider>
  );
}
