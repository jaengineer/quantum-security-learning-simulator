"""Runtime configuration for the Quantum Simulator API.

Settings can be overridden via environment variables or a local ``.env`` file.
This indirection keeps the FastAPI app free of hard-coded values and makes the
service portable between local development and future deployment targets.
"""

from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    service_name: str = Field(
        default="quantum-simulator-api",
        description="Logical service identifier returned by /health.",
    )

    cors_origins: str = Field(
        default="http://localhost:3000",
        description="Comma-separated list of allowed CORS origins.",
    )

    @property
    def cors_origin_list(self) -> list[str]:
        """Return the configured CORS origins as a clean list of strings."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return a cached :class:`Settings` instance.

    The cache ensures we parse the environment only once per process.
    """
    return Settings()
