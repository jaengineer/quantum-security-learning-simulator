"""Pure quantum simulation engine.

Modules in this package must not import FastAPI or Pydantic. They expose plain
Python functions that the service layer orchestrates. This isolation makes the
engine independently testable and easier to explain in the TFM report.
"""
