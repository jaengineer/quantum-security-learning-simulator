"""Quantum simulator selection.

We prefer ``qiskit-aer``'s :class:`AerSimulator` because it is the de facto
high-performance reference simulator for the Qiskit ecosystem. If Aer is not
installed (e.g. on platforms where the binary wheel is unavailable), we fall
back to Qiskit's built-in :class:`BasicSimulator`. Both expose the same
``run(...)`` interface used by :mod:`app.quantum.hadamard`.

This indirection keeps the simulation logic backend-agnostic and makes the MVP
runnable even in constrained environments.
"""

from __future__ import annotations

from typing import Any


def get_simulator() -> Any:
    """Return a usable Qiskit simulator instance.

    Tries :class:`qiskit_aer.AerSimulator` first; on ``ImportError`` falls back
    to :class:`qiskit.providers.basic_provider.BasicSimulator`.
    """
    try:
        from qiskit_aer import AerSimulator

        return AerSimulator()
    except ImportError:
        from qiskit.providers.basic_provider import BasicSimulator

        return BasicSimulator()


def get_simulator_name() -> str:
    """Return a human-readable identifier of the active simulator backend."""
    simulator = get_simulator()
    name = getattr(simulator, "name", None)
    if callable(name):
        try:
            return str(name())
        except TypeError:
            return str(name)
    return str(name) if name is not None else simulator.__class__.__name__
