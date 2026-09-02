"use client";

import {
  HOME_ABOUT,
  HOME_FOOTER,
  HOME_HERO,
  HOME_LEARNING_PATH,
  HOME_METHOD_COPY,
  HOME_METHOD_STEPS,
  HOME_VALUE_COPY,
  HOME_VALUE_PROPOSITIONS,
} from "@/features/quantum/experiments/i18n/strings";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import type { Locale } from "@/features/theory/i18n/types";

import { HomeQuantumVisual } from "./HomeQuantumVisual";

interface HomeSectionProps {
  locale: Locale;
}

const learningPathNodes = Object.fromEntries(
  HOME_LEARNING_PATH.nodes.map((node) => [node.id, node])
);

export function HomeHero({ locale }: HomeSectionProps) {
  return (
    <section className="grid items-center gap-10 rounded-[2rem] border border-slate-200 bg-gradient-to-br from-white via-violet-50/50 to-cyan-50/60 p-6 shadow-xl shadow-slate-200/50 dark:border-slate-800 dark:from-slate-950 dark:via-violet-950/20 dark:to-slate-900 dark:shadow-black/30 lg:grid-cols-[1.05fr_0.95fr] lg:p-10">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-600 dark:text-violet-300">
            {getLocalizedText(HOME_HERO.eyebrow, locale)}
          </p>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-6xl">
            {getLocalizedText(HOME_HERO.titleLineOne, locale)}{" "}
            <span className="text-violet-600 dark:text-violet-300">
              {getLocalizedText(HOME_HERO.titleAccent, locale)}
            </span>
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg">
            {getLocalizedText(HOME_HERO.description, locale)}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href={HOME_HERO.primaryCtaHref}
            className="inline-flex items-center justify-center rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
          >
            {getLocalizedText(HOME_HERO.primaryCta, locale)}
          </a>
          <a
            href={HOME_HERO.secondaryCtaHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            {getLocalizedText(HOME_HERO.secondaryCta, locale)}
          </a>
        </div>
      </div>

      <HomeQuantumVisual />
    </section>
  );
}

export function HomeValuePropositions({ locale }: HomeSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
        {getLocalizedText(HOME_VALUE_COPY.eyebrow, locale)}
      </p>
      <div className="grid gap-4 md:grid-cols-3">
        {HOME_VALUE_PROPOSITIONS.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950"
          >
            <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
              {getLocalizedText(item.title, locale)}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {getLocalizedText(item.description, locale)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function HomeMethodology({ locale }: HomeSectionProps) {
  return (
    <section id="how-it-works" className="scroll-mt-24 flex flex-col gap-6">
      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          {getLocalizedText(HOME_METHOD_COPY.eyebrow, locale)}
        </p>
      </header>
      <div className="grid gap-4 md:grid-cols-4">
        {HOME_METHOD_STEPS.map((step) => (
          <article
            key={step.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"
          >
            <p className="text-xs font-semibold text-violet-500">
              {step.index}
            </p>
            <h2 className="mt-3 text-base font-semibold text-slate-900 dark:text-slate-100">
              {getLocalizedText(step.title, locale)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {getLocalizedText(step.description, locale)}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PathCard({
  id,
  locale,
}: {
  id: keyof typeof learningPathNodes;
  locale: Locale;
}) {
  const node = learningPathNodes[id];

  return (
    <a
      href={node.href}
      className="block w-full rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-violet-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-violet-600"
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        {getLocalizedText(node.title, locale)}
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        {getLocalizedText(node.description, locale)}
      </p>
    </a>
  );
}

export function HomeLearningPath({ locale }: HomeSectionProps) {
  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/40">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          {getLocalizedText(HOME_LEARNING_PATH.copy.eyebrow, locale)}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          {getLocalizedText(HOME_LEARNING_PATH.copy.description, locale)}
        </p>
      </header>

      <div className="mx-auto hidden w-full max-w-4xl flex-col gap-3 md:flex">
        <div className="mx-auto w-full max-w-xs">
          <PathCard id="superposition" locale={locale} />
        </div>
        <div className="grid grid-cols-2 gap-5 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <p>
            ↙︎{" "}
            {getLocalizedText(
              HOME_LEARNING_PATH.copy.superpositionToEntanglement,
              locale
            )}
          </p>
          <p>
            {getLocalizedText(
              HOME_LEARNING_PATH.copy.superpositionToGrover,
              locale
            )}{" "}
            ↘︎
          </p>
        </div>
        <div className="grid grid-cols-2 gap-5">
          <PathCard id="entanglement" locale={locale} />
          <PathCard id="grover" locale={locale} />
        </div>
        <div className="grid grid-cols-2 gap-5 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          <p>
            ↓{" "}
            {getLocalizedText(
              HOME_LEARNING_PATH.copy.entanglementToTeleportation,
              locale
            )}
          </p>
          <span aria-hidden="true" />
        </div>
        <div className="grid grid-cols-2 gap-5">
          <PathCard id="teleportation" locale={locale} />
          <span aria-hidden="true" />
        </div>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-col gap-3 md:hidden">
        <PathCard id="superposition" locale={locale} />
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          ↓{" "}
          {getLocalizedText(
            HOME_LEARNING_PATH.copy.superpositionToEntanglement,
            locale
          )}
        </p>
        <PathCard id="entanglement" locale={locale} />
        <p className="text-center text-xs font-medium text-slate-500 dark:text-slate-400">
          ↓{" "}
          {getLocalizedText(
            HOME_LEARNING_PATH.copy.entanglementToTeleportation,
            locale
          )}
        </p>
        <PathCard id="teleportation" locale={locale} />
        <p className="border-t border-slate-200 pt-3 text-center text-xs font-medium text-slate-500 dark:border-slate-800 dark:text-slate-400">
          {getLocalizedText(HOME_LEARNING_PATH.copy.groverBranch, locale)} ·{" "}
          {getLocalizedText(
            HOME_LEARNING_PATH.copy.superpositionToGrover,
            locale
          )}
        </p>
        <PathCard id="grover" locale={locale} />
      </div>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-4 dark:border-slate-700 dark:bg-slate-950/70 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          {getLocalizedText(HOME_LEARNING_PATH.copy.toolsLabel, locale)}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <PathCard id="builder" locale={locale} />
          <PathCard id="theory" locale={locale} />
        </div>
      </div>
    </section>
  );
}

export function HomeAbout({ locale }: HomeSectionProps) {
  return (
    <section
      id="about"
      className="scroll-mt-24 rounded-3xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-950 sm:p-8"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600 dark:text-violet-300">
        {getLocalizedText(HOME_ABOUT.eyebrow, locale)}
      </p>
      <h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-3xl">
        {getLocalizedText(HOME_ABOUT.title, locale)}
      </h2>
      <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-600 dark:text-slate-300">
        {getLocalizedText(HOME_ABOUT.description, locale)}
      </p>
      <p className="mt-4 text-sm font-medium text-slate-500 dark:text-slate-400">
        {getLocalizedText(HOME_ABOUT.thesis, locale)}
      </p>
    </section>
  );
}

export function HomeFooter({ locale }: HomeSectionProps) {
  return (
    <footer className="border-t border-slate-200 py-8 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-700 dark:text-slate-200">
            {getLocalizedText(HOME_FOOTER.product, locale)}
          </p>
          <p>{getLocalizedText(HOME_FOOTER.tagline, locale)}</p>
        </div>
        <div className="text-left sm:text-right">
          <p>{getLocalizedText(HOME_FOOTER.builtWith, locale)}</p>
          <p>{getLocalizedText(HOME_FOOTER.thesis, locale)}</p>
        </div>
      </div>
    </footer>
  );
}
