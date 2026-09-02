"use client";

import { useEffect, type ReactNode } from "react";

import { GlobalHeader } from "@/components/layout/GlobalHeader";
import { GLOBAL_NAV_COPY } from "@/features/quantum/experiments/i18n/strings";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import {
  LocaleProvider,
  useLocale,
} from "@/features/theory/i18n/LocaleContext";

function PlatformChrome({ children }: { children: ReactNode }) {
  const { locale } = useLocale();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white focus:outline-none focus:ring-2 focus:ring-violet-400 dark:focus:bg-slate-100 dark:focus:text-slate-900"
      >
        {getLocalizedText(GLOBAL_NAV_COPY.skipToContent, locale)}
      </a>
      <GlobalHeader />
      {children}
    </>
  );
}

export function PlatformShell({ children }: { children: ReactNode }) {
  return (
    <LocaleProvider>
      <PlatformChrome>{children}</PlatformChrome>
    </LocaleProvider>
  );
}
