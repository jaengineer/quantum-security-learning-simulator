"""Smoke tests for the Bell-state simulation engine.

These checks validate the contract and the *correlation property* of the
|Phi+> state. The exact 50/50 split between "00" and "11" is stochastic, so
we only require that:

* the response has the expected shape and metadata,
* counts sum to ``shots``,
* the four basis-state keys are always present,
* the "01" and "10" outcomes appear with empirical probability below a small
  threshold (they are zero in the ideal simulator but we leave a margin so
  the test stays meaningful if a noisy backend is plugged in later).
"""

from __future__ import annotations

import math

import pytest

from app.quantum.bell import simulate_bell_state


def test_simulate_bell_phi_plus_shape() -> None:
    shots = 4096
    result = simulate_bell_state(bell_state="phi_plus", shots=shots)

    assert result["circuit"] == "bell-state"
    assert result["bell_state"] == "phi_plus"
    assert result["qubits"] == 2
    assert result["shots"] == shots

    counts = result["counts"]
    probabilities = result["probabilities"]
    assert set(counts.keys()) == {"00", "01", "10", "11"}
    assert set(probabilities.keys()) == {"00", "01", "10", "11"}
    assert sum(counts.values()) == shots
    assert math.isclose(sum(probabilities.values()), 1.0, abs_tol=1e-9)

    assert isinstance(result["simulator"], str) and result["simulator"]
    assert isinstance(result["execution_time_ms"], float)
    assert result["execution_time_ms"] >= 0.0


def test_simulate_bell_phi_plus_is_correlated() -> None:
    shots = 4096
    result = simulate_bell_state(bell_state="phi_plus", shots=shots)
    probabilities = result["probabilities"]

    # Ideal noiseless simulator should yield exactly 0 for "01" and "10".
    # A small margin is allowed so the assertion stays meaningful if a future
    # noisy backend is swapped in.
    assert probabilities["01"] < 0.02
    assert probabilities["10"] < 0.02
    assert probabilities["00"] + probabilities["11"] > 0.98


def test_simulate_bell_rejects_invalid_state() -> None:
    with pytest.raises(ValueError):
        simulate_bell_state(bell_state="phi_minus", shots=1024)


def test_simulate_bell_rejects_non_positive_shots() -> None:
    with pytest.raises(ValueError):
        simulate_bell_state(bell_state="phi_plus", shots=0)
