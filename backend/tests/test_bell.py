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

from qiskit.quantum_info import Statevector

from app.quantum.bell import _build_bell_preparation_circuit, simulate_bell_state


BELL_STATES = ("phi_plus", "phi_minus", "psi_plus", "psi_minus")
DIAGONAL_STATES = ("phi_plus", "phi_minus")
ANTI_DIAGONAL_STATES = ("psi_plus", "psi_minus")


def _statevector_for(bell_state: str) -> list[complex]:
    circuit = _build_bell_preparation_circuit(bell_state)
    return list(Statevector.from_instruction(circuit).data)


def _assert_complex_close(
    actual: complex,
    expected: complex,
    *,
    label: str,
    abs_tol: float = 1e-9,
) -> None:
    assert math.isclose(actual.real, expected.real, abs_tol=abs_tol), label
    assert math.isclose(actual.imag, expected.imag, abs_tol=abs_tol), label


def _assert_statevector_close_up_to_global_phase(
    actual: list[complex],
    expected: list[complex],
    *,
    label: str,
    abs_tol: float = 1e-9,
) -> None:
    phase: complex | None = None
    for actual_amplitude, expected_amplitude in zip(actual, expected):
        if abs(expected_amplitude) > abs_tol:
            phase = actual_amplitude / expected_amplitude
            break

    assert phase is not None, f"{label}: expected state cannot be all zero"
    for index, expected_amplitude in enumerate(expected):
        _assert_complex_close(
            actual[index],
            phase * expected_amplitude,
            label=f"{label}[{index}]",
            abs_tol=abs_tol,
        )


@pytest.mark.parametrize("bell_state", BELL_STATES)
def test_simulate_bell_state_shape(bell_state: str) -> None:
    shots = 4096
    result = simulate_bell_state(bell_state=bell_state, shots=shots)

    assert result["circuit"] == "bell-state"
    assert result["bell_state"] == bell_state
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


@pytest.mark.parametrize("bell_state", DIAGONAL_STATES)
def test_simulate_bell_diagonal_states_are_correlated(bell_state: str) -> None:
    shots = 4096
    result = simulate_bell_state(bell_state=bell_state, shots=shots)
    probabilities = result["probabilities"]

    # Ideal noiseless simulator should yield exactly 0 for "01" and "10".
    # A small margin is allowed so the assertion stays meaningful if a future
    # noisy backend is swapped in.
    assert probabilities["01"] < 0.02
    assert probabilities["10"] < 0.02
    assert probabilities["00"] + probabilities["11"] > 0.98


@pytest.mark.parametrize("bell_state", ANTI_DIAGONAL_STATES)
def test_simulate_bell_anti_diagonal_states_are_anti_correlated(
    bell_state: str,
) -> None:
    shots = 4096
    result = simulate_bell_state(bell_state=bell_state, shots=shots)
    probabilities = result["probabilities"]

    assert probabilities["00"] < 0.02
    assert probabilities["11"] < 0.02
    assert probabilities["01"] + probabilities["10"] > 0.98


@pytest.mark.parametrize(
    ("bell_state", "expected"),
    [
        (
            "phi_plus",
            [math.sqrt(0.5), 0, 0, math.sqrt(0.5)],
        ),
        (
            "phi_minus",
            [math.sqrt(0.5), 0, 0, -math.sqrt(0.5)],
        ),
        (
            "psi_plus",
            [0, math.sqrt(0.5), math.sqrt(0.5), 0],
        ),
        (
            "psi_minus",
            [0, math.sqrt(0.5), -math.sqrt(0.5), 0],
        ),
    ],
)
def test_bell_preparation_preserves_phase_sensitive_statevector(
    bell_state: str,
    expected: list[complex],
) -> None:
    actual = _statevector_for(bell_state)

    assert len(actual) == len(expected)
    _assert_statevector_close_up_to_global_phase(
        actual,
        expected,
        label=bell_state,
    )


def test_simulate_bell_rejects_invalid_state() -> None:
    with pytest.raises(ValueError):
        simulate_bell_state(bell_state="invalid", shots=1024)


def test_simulate_bell_rejects_non_positive_shots() -> None:
    with pytest.raises(ValueError):
        simulate_bell_state(bell_state="phi_plus", shots=0)
