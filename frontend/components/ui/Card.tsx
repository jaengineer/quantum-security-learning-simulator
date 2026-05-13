import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, description, children, className }: CardProps) {
  return (
    <section
      className={[
        "rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-sm",
        "dark:border-slate-800 dark:bg-slate-900/60",
        className ?? "",
      ].join(" ")}
    >
      {title ? (
        <header className="mb-4">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
