"""Two-qubit Bell-state simulation engine.

Didactic intent
---------------
This module realises the canonical entanglement experiment of any quantum
computing course:

    |0>_q0 |0>_q1
        --> H on q0   -->  (|00> + |10>) / sqrt(2)
        --> CX(0,1)   -->  (|00> + |11>) / sqrt(2)  =  |Phi+>
        --> measure   -->  correlated outcomes "00" and "11" only.

The other three Bell states (|Phi->, |Psi+>, |Psi->) only differ by a Pauli
gate inserted before the CNOT. They are intentionally not implemented in this
MVP iteration; the API literal stays narrow and the UI shows them as "coming
soon" so the academic narrative is preserved.

Qiskit bit ordering note
------------------------
Qiskit ``get_counts`` returns bitstrings in *classical big-endian* order: the
leftmost character corresponds to the highest-indexed classical bit. With our
mapping ``measure(0, 0)`` and ``measure(1, 1)`` the bitstring ``"b1 b0"``
therefore reads as "c1 c0", i.e. ``q1`` first. The canonical ``|Phi+>`` only
populates ``"00"`` and ``"11"``, which are symmetric and unaffected by the
ordering choice; we document it here for clarity nonetheless.
"""

from __future__ import annotations

import time
from typing import Any

from qiskit import QuantumCircuit, transpile

from app.quantum.backend import get_simulator, get_simulator_name

VALID_BELL_STATES = frozenset({"phi_plus"})
BELL_BASIS_STATES = ("00", "01", "10", "11")


def _build_bell_circuit(bell_state: str) -> QuantumCircuit:
    """Construct the 2-qubit / 2-clbit circuit for the requested Bell state."""
    if bell_state != "phi_plus":
        raise ValueError(
            f"bell_state must be one of {sorted(VALID_BELL_STATES)}, "
            f"got: {bell_state!r}"
        )

    circuit = QuantumCircuit(2, 2)
    circuit.h(0)
    circuit.cx(0, 1)
    circuit.measure(0, 0)
    circuit.measure(1, 1)
    return circuit


def _normalise_counts(raw_counts: dict[str, int], shots: int) -> dict[str, int]:
    """Ensure all four basis-state keys are present and counts sum to ``shots``.

    Qiskit omits keys whose count is zero; we pad them with ``0`` so the
    frontend can always render the four bars consistently.
    """
    counts: dict[str, int] = {key: 0 for key in BELL_BASIS_STATES}
    for raw_key, value in raw_counts.items():
        key = raw_key.replace(" ", "")
        if key not in counts:
            raise ValueError(
                f"Unexpected measurement outcome '{raw_key}' for 2-qubit circuit."
            )
        counts[key] = int(value)

    total = sum(counts.values())
    if total != shots:
        raise ValueError(
            f"Counts sum ({total}) does not match shots ({shots}); "
            "the simulator returned an inconsistent result."
        )
    return counts


def simulate_bell_state(bell_state: str, shots: int) -> dict[str, Any]:
    """Run the Bell-state experiment and return its measurement statistics.

    Parameters
    ----------
    bell_state:
        Identifier of the Bell state to prepare. Only ``"phi_plus"`` is
        implemented in the current MVP iteration.
    shots:
        Number of independent measurements to perform.

    Returns
    -------
    dict
        Dictionary matching :class:`app.schemas.simulation.QuantumSimulationResult`:
        ``circuit``, ``bell_state``, ``qubits``, ``shots``, ``counts``,
        ``probabilities``, ``simulator`` and ``execution_time_ms``.
    """
    if not isinstance(shots, int) or shots <= 0:
        raise ValueError(f"shots must be a positive integer, got: {shots!r}")

    circuit = _build_bell_circuit(bell_state)
    simulator = get_simulator()
    compiled = transpile(circuit, simulator)

    start = time.perf_counter()
    job = simulator.run(compiled, shots=shots)
    raw_counts = job.result().get_counts(compiled)
    elapsed_ms = (time.perf_counter() - start) * 1000.0

    counts = _normalise_counts(raw_counts, shots)
    probabilities = {key: value / shots for key, value in counts.items()}

    return {
        "circuit": "bell-state",
        "bell_state": bell_state,
        "qubits": 2,
        "shots": shots,
        "counts": counts,
        "probabilities": probabilities,
        "simulator": get_simulator_name(),
        "execution_time_ms": round(elapsed_ms, 3),
    }
