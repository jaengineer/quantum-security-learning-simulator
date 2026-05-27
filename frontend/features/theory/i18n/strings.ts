/**
 * UI string dictionary for the Theory Lab.
 *
 * Every Theory Lab component that renders chrome text reads from here through
 * the ``useT()`` hook. Adding a new locale only requires adding the matching
 * key to each entry; the call sites stay untouched.
 */

import type { LocalizedText } from "@/features/theory/i18n/types";

export const THEORY_UI_STRINGS = {
  // Page chrome
  page_title: { en: "Theory Lab", es: "Laboratorio de teoría" },
  page_subtitle: {
    en: "Linear algebra, Dirac notation and quantum information — with worked examples and exam questions.",
    es: "Álgebra lineal, notación de Dirac e información cuántica — con ejemplos resueltos y preguntas tipo examen.",
  },
  back_to_catalog: { en: "Back to catalog", es: "Volver al catálogo" },

  // Filters
  filters_heading: { en: "Filters", es: "Filtros" },
  filter_category: { en: "Category", es: "Categoría" },
  filter_level: { en: "Level", es: "Nivel" },
  filter_notation: { en: "Notation", es: "Notación" },
  filter_tags: { en: "Tags", es: "Etiquetas" },
  filter_all: { en: "All", es: "Todas" },
  filter_reset: { en: "Reset filters", es: "Limpiar filtros" },
  search_label: { en: "Search", es: "Buscar" },
  search_placeholder: {
    en: "Search by title, summary or tag…",
    es: "Buscar por título, resumen o etiqueta…",
  },
  results_empty: {
    en: "No concepts match the current filters.",
    es: "Ningún concepto coincide con los filtros actuales.",
  },
  results_count_one: { en: "concept", es: "concepto" },
  results_count_other: { en: "concepts", es: "conceptos" },

  // Categories
  category_linear_algebra: { en: "Linear algebra", es: "Álgebra lineal" },
  category_quantum_mechanics: { en: "Quantum mechanics", es: "Mecánica cuántica" },
  category_quantum_computing: { en: "Quantum computing", es: "Computación cuántica" },
  category_quantum_information: {
    en: "Quantum information",
    es: "Información cuántica",
  },

  // Levels
  level_basic: { en: "Basic", es: "Básico" },
  level_intermediate: { en: "Intermediate", es: "Intermedio" },
  level_advanced: { en: "Advanced", es: "Avanzado" },

  // Notations
  notation_bra_ket: { en: "Bra-ket", es: "Bra-ket" },
  notation_matrix: { en: "Matrix", es: "Matricial" },
  notation_abstract: { en: "Abstract", es: "Abstracta" },
  notation_mixed: { en: "Mixed", es: "Mixta" },

  // Difficulty (exam questions)
  difficulty_easy: { en: "Easy", es: "Fácil" },
  difficulty_medium: { en: "Medium", es: "Medio" },
  difficulty_hard: { en: "Hard", es: "Difícil" },

  // Detail sections
  section_summary: { en: "Summary", es: "Resumen" },
  section_learning_objectives: { en: "Learning objectives", es: "Objetivos de aprendizaje" },
  section_formal_definition: { en: "Formal definition", es: "Definición formal" },
  section_intuitive_explanation: { en: "Intuitive explanation", es: "Explicación intuitiva" },
  section_formulas: { en: "Key formulas", es: "Fórmulas clave" },
  section_worked_examples: { en: "Worked examples", es: "Ejemplos resueltos" },
  section_geometric_interpretation: {
    en: "Geometric / physical interpretation",
    es: "Interpretación geométrica o física",
  },
  section_common_mistakes: { en: "Common mistakes", es: "Errores comunes" },
  section_exam_relevance: { en: "Why it shows up in exams", es: "Por qué aparece en los exámenes" },
  section_exam_questions: { en: "Exam-style questions", es: "Preguntas tipo examen" },
  section_related_concepts: { en: "Related concepts", es: "Conceptos relacionados" },

  // FormulaBlock
  copy_latex: { en: "Copy LaTeX", es: "Copiar LaTeX" },
  copy_latex_success: { en: "Copied!", es: "¡Copiado!" },
  copy_latex_failed: { en: "Copy failed", es: "No se pudo copiar" },

  // WorkedExampleBlock
  worked_example_statement: { en: "Statement", es: "Enunciado" },
  worked_example_step: { en: "Step", es: "Paso" },
  worked_example_final_answer: { en: "Final answer", es: "Resultado final" },

  // ExamQuestionBlock / quiz
  exam_mode_label: { en: "Exam mode", es: "Modo examen" },
  exam_mode_on: { en: "On", es: "Activado" },
  exam_mode_off: { en: "Off", es: "Desactivado" },
  exam_mode_hint: {
    en: "Hides hints and model answers until you reveal each one.",
    es: "Oculta pistas y respuestas modelo hasta que reveles cada una.",
  },
  show_hint: { en: "Show hint", es: "Mostrar pista" },
  hide_hint: { en: "Hide hint", es: "Ocultar pista" },
  reveal_answer: { en: "Reveal model answer", es: "Mostrar respuesta modelo" },
  hide_answer: { en: "Hide model answer", es: "Ocultar respuesta modelo" },
  questions_reviewed: { en: "questions reviewed", es: "preguntas revisadas" },

  // Language switcher
  language_label: { en: "Language", es: "Idioma" },
  language_en: { en: "English", es: "Inglés" },
  language_es: { en: "Spanish", es: "Español" },

  // Detail navigation
  open_concept: { en: "Open concept", es: "Abrir concepto" },
} as const satisfies Record<string, LocalizedText>;

export type TheoryUiStringKey = keyof typeof THEORY_UI_STRINGS;
