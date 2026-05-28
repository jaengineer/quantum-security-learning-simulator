/**
 * Canonical glossary registry consumed by the overlay tooltips and the
 * GlossaryDrawer. Entries are intentionally short (one short paragraph at
 * most) — the long-form treatment of every concept lives in the Theory Lab.
 *
 * Mapping layers:
 *   - ``id``: stable, locale-agnostic identifier (used as React key + lookup).
 *   - ``term``: short human-readable title rendered in the UI.
 *   - ``summary``: 1-line definition shown inside tooltips and glossary cards.
 *   - ``latex``: optional KaTeX preview; only set when it adds context.
 *   - ``theoryConceptId``: optional pointer into ``features/theory/content``
 *     so consumers can build a deep link without hardcoding a route.
 *
 * UI components NEVER hardcode the ``/theory/<id>`` path; they always read it
 * from ``theoryConceptId`` and let the tooltip / drawer build the URL.
 */

export interface GlossaryEntry {
  id: string;
  term: string;
  summary: string;
  latex?: string;
  theoryConceptId?: string;
}

export const GLOSSARY_ENTRIES: readonly GlossaryEntry[] = [
  // --- Single-qubit gates -------------------------------------------------
  {
    id: "gate-identity",
    term: "Identity (I)",
    summary: "The identity gate leaves the qubit state unchanged.",
    latex: "I = \\begin{bmatrix}1 & 0 \\\\ 0 & 1\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-pauli-x",
    term: "Pauli-X (NOT)",
    summary: "Quantum NOT: swaps the amplitudes of |0⟩ and |1⟩.",
    latex: "X = \\begin{bmatrix}0 & 1 \\\\ 1 & 0\\end{bmatrix}",
    theoryConceptId: "hermitian-matrices",
  },
  {
    id: "gate-pauli-y",
    term: "Pauli-Y",
    summary: "Combines a bit flip with a phase flip; π rotation around the Y axis.",
    latex: "Y = \\begin{bmatrix}0 & -i \\\\ i & 0\\end{bmatrix}",
    theoryConceptId: "hermitian-matrices",
  },
  {
    id: "gate-pauli-z",
    term: "Pauli-Z",
    summary: "Phase flip: maps |1⟩ to −|1⟩ and leaves |0⟩ untouched.",
    latex: "Z = \\begin{bmatrix}1 & 0 \\\\ 0 & -1\\end{bmatrix}",
    theoryConceptId: "hermitian-matrices",
  },
  {
    id: "gate-hadamard",
    term: "Hadamard (H)",
    summary: "Creates an equal superposition between |0⟩ and |1⟩.",
    latex:
      "H = \\tfrac{1}{\\sqrt{2}}\\begin{bmatrix}1 & 1 \\\\ 1 & -1\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-phase-s",
    term: "Phase S (¼-turn)",
    summary: "Applies a π/2 phase to the |1⟩ component.",
    latex: "S = \\begin{bmatrix}1 & 0 \\\\ 0 & i\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-phase-sdg",
    term: "S-dagger (S†)",
    summary: "Inverse of S: applies a −π/2 phase to the |1⟩ component.",
    latex: "S^{\\dagger} = \\begin{bmatrix}1 & 0 \\\\ 0 & -i\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-phase-t",
    term: "T (⅛-turn)",
    summary: "Applies a π/4 phase to the |1⟩ component.",
    latex: "T = \\begin{bmatrix}1 & 0 \\\\ 0 & e^{i\\pi/4}\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-phase-tdg",
    term: "T-dagger (T†)",
    summary: "Inverse of T: applies a −π/4 phase to the |1⟩ component.",
    latex:
      "T^{\\dagger} = \\begin{bmatrix}1 & 0 \\\\ 0 & e^{-i\\pi/4}\\end{bmatrix}",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "gate-rx",
    term: "Rx(θ)",
    summary: "Rotates the state vector by θ around the X axis of the Bloch sphere.",
    latex:
      "R_x(\\theta) = e^{-i\\theta X / 2}",
    theoryConceptId: "spectral-theorem",
  },
  {
    id: "gate-ry",
    term: "Ry(θ)",
    summary: "Rotates the state vector by θ around the Y axis of the Bloch sphere.",
    latex: "R_y(\\theta) = e^{-i\\theta Y / 2}",
    theoryConceptId: "spectral-theorem",
  },
  {
    id: "gate-rz",
    term: "Rz(θ)",
    summary: "Rotates the state vector by θ around the Z axis of the Bloch sphere.",
    latex: "R_z(\\theta) = e^{-i\\theta Z / 2}",
    theoryConceptId: "spectral-theorem",
  },

  // --- Notation, states, operators ----------------------------------------
  {
    id: "ket",
    term: "Ket |ψ⟩",
    summary: "Column vector representing a quantum state in Dirac notation.",
    theoryConceptId: "dirac-notation",
  },
  {
    id: "bra",
    term: "Bra ⟨ψ|",
    summary: "Conjugate-transposed dual of a ket; pairs with a ket to form a scalar.",
    theoryConceptId: "dirac-notation",
  },
  {
    id: "inner-product",
    term: "Inner product ⟨φ|ψ⟩",
    summary: "Complex scalar that encodes overlap and probability amplitude between two states.",
    theoryConceptId: "inner-product",
  },
  {
    id: "unitary",
    term: "Unitary operator",
    summary: "Operator U with U†U = I; preserves inner products. Every quantum gate is unitary.",
    theoryConceptId: "unitary-matrices",
  },
  {
    id: "hermitian",
    term: "Hermitian operator",
    summary: "Self-adjoint operator (A = A†) with real eigenvalues; models physical observables.",
    theoryConceptId: "hermitian-matrices",
  },
  {
    id: "density-matrix",
    term: "Density matrix ρ",
    summary: "Positive, unit-trace operator describing pure and mixed quantum states.",
    theoryConceptId: "density-matrix",
  },
  {
    id: "entanglement",
    term: "Entanglement",
    summary: "Non-separable bipartite state whose subsystems cannot be described independently.",
    theoryConceptId: "quantum-entanglement",
  },
  {
    id: "bell-state",
    term: "Bell state |Φ⁺⟩",
    summary:
      "Maximally entangled two-qubit state (|00⟩ + |11⟩)/√2, prepared by H followed by CNOT.",
    latex: "|\\Phi^{+}\\rangle = \\tfrac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)",
    theoryConceptId: "quantum-entanglement",
  },
  {
    id: "superposition",
    term: "Superposition",
    summary: "Linear combination of basis states with complex amplitudes.",
    theoryConceptId: "dirac-notation",
  },
  {
    id: "measurement",
    term: "Measurement",
    summary: "Projects the quantum state onto a basis vector and yields a classical outcome.",
    theoryConceptId: "density-matrix",
  },

  // --- Visualisation primitives ------------------------------------------
  {
    id: "bloch-sphere",
    term: "Bloch sphere",
    summary:
      "Geometric representation of a single qubit: pure states sit on the surface, mixed states inside.",
    theoryConceptId: "density-matrix",
  },
  {
    id: "probability-distribution",
    term: "Probability distribution",
    summary:
      "Theoretical |⟨k|ψ⟩|² for every basis state k; sums to 1 over the computational basis.",
    theoryConceptId: "density-matrix",
  },
  {
    id: "counts",
    term: "Measurement counts",
    summary:
      "Empirical occurrences of each basis outcome over a fixed number of shots.",
    theoryConceptId: "density-matrix",
  },
] as const;

const ENTRY_INDEX = new Map<string, GlossaryEntry>(
  GLOSSARY_ENTRIES.map((entry) => [entry.id, entry])
);

export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return ENTRY_INDEX.get(id);
}

/**
 * Build the Theory Lab route for a glossary entry without hardcoding the
 * route in component code. Returns ``null`` when the entry has no linked
 * concept (so callers can skip the CTA).
 */
export function getTheoryRouteForEntry(entry: GlossaryEntry): string | null {
  return entry.theoryConceptId ? `/theory/${entry.theoryConceptId}` : null;
}
