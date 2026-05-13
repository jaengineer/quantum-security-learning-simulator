"""Single-qubit Hadamard simulation engine.

Didactic intent
---------------
This module implements the canonical first example of any quantum computing
course: take a qubit in a computational-basis state, apply a Hadamard gate to
create an equal superposition, then measure. The measurement collapses the
qubit to ``|0>`` or ``|1>`` with approximately 50% probability each.

The function below is intentionally short and linear so it can be reproduced
step-by-step in the Master's Thesis report.
"""

from __future__ import annotations

import time
from typing import Any

from qiskit import QuantumCircuit, transpile

from app.quantum.backend import get_simulator, get_simulator_name

VALID_INITIAL_STATES = frozenset({"0", "1"})


def _build_hadamard_circuit(initial_state: str) -> QuantumCircuit:
    """Build the 1-qubit / 1-clbit circuit used by the MVP.

    Steps:
        1. Allocate a 1-qubit, 1-classical-bit circuit (default state ``|0>``).
        2. If the user requested ``|1>``, apply an ``X`` (NOT) gate first.
        3. Apply Hadamard ``H`` to create the superposition.
        4. Measure the qubit into the classical bit.
    """
    circuit = QuantumCircuit(1, 1)

    if initial_state == "1":
        circuit.x(0)

    circuit.h(0)
    circuit.measure(0, 0)
    return circuit


def _normalise_counts(raw_counts: dict[str, int], shots: int) -> dict[str, int]:
    """Ensure both basis-state keys are present and counts sum to ``shots``.

    Qiskit may omit keys whose count is zero. We pad them with ``0`` so the
    frontend can always render both bars consistently.
    """
    counts: dict[str, int] = {"0": 0, "1": 0}
    for raw_key, value in raw_counts.items():
        key = raw_key.strip()
        if key not in counts:
            raise ValueError(
                f"Unexpected measurement outcome '{raw_key}' for 1-qubit circuit."
            )
        counts[key] = int(value)

    total = counts["0"] + counts["1"]
    if total != shots:
        raise ValueError(
            f"Counts sum ({total}) does not match shots ({shots}); "
            "the simulator returned an inconsistent result."
        )
    return counts


def simulate_hadamard(initial_state: str, shots: int) -> dict[str, Any]:
    """Run the Hadamard experiment and return its measurement statistics.

    Parameters
    ----------
    initial_state:
        Either ``"0"`` or ``"1"``. Selects the input basis state of the qubit.
    shots:
        Number of independent measurements to perform.

    Returns
    -------
    dict
        Dictionary matching :class:`app.schemas.simulation.QuantumSimulationResult`:
        ``circuit``, ``initial_state``, ``shots``, ``counts``, ``probabilities``.
    """
    if initial_state not in VALID_INITIAL_STATES:
        raise ValueError(
            f"initial_state must be '0' or '1', got: {initial_state!r}"
        )
    if not isinstance(shots, int) or shots <= 0:
        raise ValueError(f"shots must be a positive integer, got: {shots!r}")

    circuit = _build_hadamard_circuit(initial_state)

    simulator = get_simulator()
    compiled = transpile(circuit, simulator)

    start = time.perf_counter()
    job = simulator.run(compiled, shots=shots)
    raw_counts = job.result().get_counts(compiled)
    elapsed_ms = (time.perf_counter() - start) * 1000.0

    counts = _normalise_counts(raw_counts, shots)
    probabilities = {key: value / shots for key, value in counts.items()}

    return {
        "circuit": "hadamard",
        "initial_state": initial_state,
        "qubits": 1,
        "shots": shots,
        "counts": counts,
        "probabilities": probabilities,
        "simulator": get_simulator_name(),
        "execution_time_ms": round(elapsed_ms, 3),
    }
