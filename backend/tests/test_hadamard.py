"""Smoke tests for the Hadamard simulation engine.

These checks validate the *contract*, not the exact stochastic outcome:

* the result has the expected keys,
* counts sum to ``shots``,
* both basis-state keys are present,
* probabilities sum (approximately) to 1.
"""

from __future__ import annotations

import math

import pytest

from app.quantum.hadamard import simulate_hadamard


@pytest.mark.parametrize("initial_state", ["0", "1"])
def test_simulate_hadamard_returns_expected_shape(initial_state: str) -> None:
    shots = 2048
    result = simulate_hadamard(initial_state=initial_state, shots=shots)

    assert result["circuit"] == "hadamard"
    assert result["initial_state"] == initial_state
    assert result["shots"] == shots

    counts = result["counts"]
    assert set(counts.keys()) == {"0", "1"}
    assert counts["0"] + counts["1"] == shots

    probabilities = result["probabilities"]
    assert set(probabilities.keys()) == {"0", "1"}
    assert math.isclose(probabilities["0"] + probabilities["1"], 1.0, abs_tol=1e-9)

    assert result["qubits"] == 1
    assert isinstance(result["simulator"], str) and result["simulator"]
    assert isinstance(result["execution_time_ms"], float)
    assert result["execution_time_ms"] >= 0.0


def test_simulate_hadamard_rejects_invalid_initial_state() -> None:
    with pytest.raises(ValueError):
        simulate_hadamard(initial_state="2", shots=1024)


def test_simulate_hadamard_rejects_non_positive_shots() -> None:
    with pytest.raises(ValueError):
        simulate_hadamard(initial_state="0", shots=0)
