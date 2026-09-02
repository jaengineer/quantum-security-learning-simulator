"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { LanguageSwitcher } from "@/features/theory/components/LanguageSwitcher";
import { GLOBAL_NAV_COPY } from "@/features/quantum/experiments/i18n/strings";
import { getLocalizedText } from "@/features/theory/i18n/helpers";
import { useLocale } from "@/features/theory/i18n/LocaleContext";

function isCurrentPath(pathname: string, href: string): boolean {
  if (href === "/#learning-modules") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function GlobalHeader() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg font-semibold tracking-tight text-slate-900 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:text-slate-100"
          onClick={() => setMenuOpen(false)}
        >
          <span
            aria-hidden
            className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-violet-300 bg-violet-500/10 text-violet-600 dark:border-violet-500/40 dark:bg-violet-500/15 dark:text-violet-300"
          >
            ⟡
          </span>
          {getLocalizedText(GLOBAL_NAV_COPY.brand, locale)}
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {GLOBAL_NAV_COPY.links.map((link) => {
            const current = isCurrentPath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                  current
                    ? "bg-violet-500/10 text-violet-700 dark:text-violet-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                ].join(" ")}
              >
                {getLocalizedText(link.label, locale)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          aria-label={getLocalizedText(
            menuOpen
              ? GLOBAL_NAV_COPY.closeMobileMenu
              : GLOBAL_NAV_COPY.mobileMenu,
            locale
          )}
          aria-expanded={menuOpen}
          aria-controls="mobile-primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
        >
          <span aria-hidden>{menuOpen ? "×" : "☰"}</span>
        </button>
      </div>

      {menuOpen ? (
        <div
          id="mobile-primary-navigation"
          className="border-t border-slate-200 bg-white px-6 py-4 dark:border-slate-800 dark:bg-slate-950 md:hidden"
        >
          <nav
            aria-label="Mobile primary navigation"
            className="mx-auto flex max-w-7xl flex-col gap-2"
          >
            {GLOBAL_NAV_COPY.links.map((link) => {
              const current = isCurrentPath(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "rounded-lg px-3 py-2 text-sm font-medium transition",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400",
                    current
                      ? "bg-violet-500/10 text-violet-700 dark:text-violet-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-slate-100",
                  ].join(" ")}
                >
                  {getLocalizedText(link.label, locale)}
                </Link>
              );
            })}
            <div className="pt-2">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
