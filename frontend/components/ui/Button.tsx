import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-900 " +
    "dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus-visible:ring-slate-200",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 " +
    "dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      className={[
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium",
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        VARIANT_CLASSES[variant],
        className ?? "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
