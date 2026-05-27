import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TheoryConceptDetail } from "@/features/theory/components/TheoryConceptDetail";
import {
  THEORY_CONCEPTS_RAW,
  getConceptById,
  getRelatedConcepts,
} from "@/features/theory/content";
import { LocaleProvider } from "@/features/theory/i18n/LocaleContext";

interface TheoryConceptPageProps {
  params: Promise<{ conceptId: string }>;
}

export function generateStaticParams() {
  return THEORY_CONCEPTS_RAW.map((concept) => ({ conceptId: concept.id }));
}

export async function generateMetadata({
  params,
}: TheoryConceptPageProps): Promise<Metadata> {
  const { conceptId } = await params;
  const concept = getConceptById(conceptId);
  if (!concept) {
    return { title: "Theory Lab" };
  }
  return {
    title: `${concept.title.en} · Theory Lab`,
    description: concept.summary.en,
  };
}

export default async function TheoryConceptPage({
  params,
}: TheoryConceptPageProps) {
  const { conceptId } = await params;
  const concept = getConceptById(conceptId);

  if (!concept) {
    notFound();
  }

  const relatedConcepts = getRelatedConcepts(concept);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-6 py-10 sm:py-14">
      <LocaleProvider>
        <TheoryConceptDetail
          concept={concept}
          relatedConcepts={relatedConcepts}
        />
      </LocaleProvider>
    </main>
  );
}
