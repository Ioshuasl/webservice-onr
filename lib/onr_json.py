"""Utilitários para serialização JSON (respostas zeep)."""

from __future__ import annotations

from decimal import Decimal


def to_json_safe(value):
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, dict):
        return {k: to_json_safe(v) for k, v in value.items()}
    if isinstance(value, list):
        return [to_json_safe(v) for v in value]
    return value
