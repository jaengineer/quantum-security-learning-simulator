import type { Metadata } from "next";

import { TheoryLabClient } from "@/features/theory/components/TheoryLabClient";
import { LocaleProvider } from "@/features/theory/i18n/LocaleContext";

export const metadata: Metadata = {
  title: "Theory Lab · Quantum Theory Trainer",
  description:
    "Interactive theoretical reference for linear algebra and quantum information. Concepts, formulas, worked examples and exam-style questions, available in English and Spanish.",
};

export default function TheoryPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-6 py-10 sm:py-14">
      <LocaleProvider>
        <TheoryLabClient />
      </LocaleProvider>
    </main>
  );
}
