"""Utilitários de configuração (.env) para scripts ONR."""

from __future__ import annotations

import os
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def strip_quotes(value: str) -> str:
    value = value.strip()
    if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
        return value[1:-1]
    return value


def env_str(key: str, default: str | None = None) -> str | None:
    raw = os.getenv(key, default)
    if raw is None:
        return None
    return strip_quotes(raw)


def env_int(key: str, default: int | None = None) -> int | None:
    raw = os.getenv(key)
    if raw is None or raw.strip() == "":
        return default
    text = strip_quotes(raw).strip()
    if not text.lstrip("-").isdigit():
        raise SystemExit(
            f"{key} deve ser um número inteiro (valor atual: {text!r}). "
            "Remova placeholders de exemplo do .env."
        )
    return int(text)


def require_env_int(key: str) -> int:
    """Lê variável obrigatória como int; falha com mensagem clara se ausente ou inválida."""
    value = env_int(key)
    if value is None:
        raise SystemExit(f"Defina {key} no .env (número inteiro).")
    return value


def resolve_path(relative_or_absolute: str) -> Path:
    path = Path(relative_or_absolute)
    if path.is_file():
        return path
    return ROOT / relative_or_absolute
