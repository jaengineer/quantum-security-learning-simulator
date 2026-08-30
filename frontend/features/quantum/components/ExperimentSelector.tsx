"use client";

import { HOME_COPY, HOME_SECTIONS, type HomeModuleCopy } from "@/features/quantum/experiments/i18n/strings";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import type { Locale } from "@/features/theory/i18n/types";

const baseCardClasses =
  "group flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-6 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center sm:justify-between";

interface ExperimentSelectorProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

function ModuleCard({
  module,
  locale,
}: {
  module: HomeModuleCopy;
  locale: Locale;
}) {
  return (
    <a
      href={module.href}
      className={[baseCardClasses, module.className].join(" ")}
    >
      <div className="flex flex-col gap-2">
        <p
          className={[
            "text-xs font-semibold uppercase tracking-widest",
            module.eyebrowClassName,
          ].join(" ")}
        >
          {getLocalizedText(module.eyebrow, locale)}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {getLocalizedText(module.title, locale)}
        </h2>
        {module.subtitle ? (
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {getLocalizedText(module.subtitle, locale)}
          </p>
        ) : null}
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          {getLocalizedText(module.description, locale)}
        </p>
      </div>
      <span
        className={[
          "inline-flex items-center gap-2 self-start whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition sm:self-auto",
          module.ctaClassName,
        ].join(" ")}
      >
        {getLocalizedText(module.cta, locale)}
        <span aria-hidden>→</span>
      </span>
    </a>
  );
}

export function ExperimentSelector({
  locale,
  onLocaleChange,
}: ExperimentSelectorProps) {
  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {getLocalizedText(HOME_COPY.eyebrow, locale)}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {getLocalizedText(HOME_COPY.title, locale)}
            </h1>
          </div>
          <label className="flex min-w-36 flex-col gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            {getLocalizedText(HOME_COPY.language, locale)}
            <select
              value={locale}
              onChange={(event) => onLocaleChange(event.target.value as Locale)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </label>
        </div>
        <p className="max-w-3xl text-base text-slate-600 dark:text-slate-300">
          {getLocalizedText(HOME_COPY.description, locale)}
        </p>
      </header>

      {HOME_SECTIONS.map((section) => (
        <div
          key={getLocalizedText(section.eyebrow, "en")}
          className="flex flex-col gap-4"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              {getLocalizedText(section.eyebrow, locale)}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
              {getLocalizedText(section.title, locale)}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2 xl:gap-6">
            {section.modules.map((module) => (
              <ModuleCard key={module.href} module={module} locale={locale} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
