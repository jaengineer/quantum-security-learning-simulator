"use client";

import { useLocale, useT } from "@/features/theory/i18n/LocaleContext";
import { SUPPORTED_LOCALES, type Locale } from "@/features/theory/i18n/types";

const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  es: "ES",
};

const LOCALE_TITLE_KEY = {
  en: "language_en",
  es: "language_es",
} as const;

interface LanguageSwitcherProps {
  className?: string;
}

/**
 * Segmented EN/ES control bound to the Theory Lab ``LocaleContext``. Updates
 * are persisted in ``localStorage`` by the context, so the selection survives
 * navigation and reloads.
 */
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const t = useT();

  return (
    <div
      role="group"
      aria-label={t("language_label")}
      className={[
        "inline-flex items-center rounded-full border border-slate-300 bg-slate-50/80 p-0.5 text-xs font-medium shadow-sm dark:border-slate-600 dark:bg-slate-800/60",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {SUPPORTED_LOCALES.map((value) => {
        const active = value === locale;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setLocale(value)}
            aria-pressed={active}
            title={t(LOCALE_TITLE_KEY[value])}
            className={[
              "inline-flex min-w-[2.5rem] items-center justify-center rounded-full px-3 py-1 transition",
              active
                ? "bg-slate-900 text-white shadow dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
            ].join(" ")}
          >
            {LOCALE_LABEL[value]}
          </button>
        );
      })}
    </div>
  );
}
