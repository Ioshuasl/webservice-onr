"""Hash de autenticação ONR: SHA-1(chave + token), UTF-8."""

from __future__ import annotations

import hashlib
import os


def compute_onr_auth_hash(chave: str, token: str) -> str:
    """
    Gera o Hash conforme documentação ONR:
    SHA-1 da concatenação chave + token, codificação UTF-8, saída hexadecimal.
    """
    payload = f"{chave}{token}"
    return hashlib.sha1(payload.encode("utf-8")).hexdigest().upper()


def pick_token(tokens: list[str], index: int | None = None) -> str:
    if not tokens:
        raise ValueError("Nenhum token disponível (faça login antes).")
    idx = index if index is not None else int(os.getenv("ONR_HASH_TOKEN_INDEX", "0"))
    if idx < 0 or idx >= len(tokens):
        raise ValueError(f"ONR_HASH_TOKEN_INDEX={idx} fora do intervalo (0..{len(tokens)-1}).")
    return tokens[idx]
