"""Configuração e Hash compartilhados — webservice BD Light."""

from __future__ import annotations

import os
from pathlib import Path

from lib.onr_env import env_int, env_str, strip_quotes
from lib.onr_hash import compute_onr_auth_hash, pick_token
from lib.onr_login import login_tokens

ROOT = Path(__file__).resolve().parents[1]


def load_serventia_chave() -> str:
    chave = env_str("ONR_SERVENTIA_CHAVE")
    if not chave:
        raise SystemExit(
            "Defina ONR_SERVENTIA_CHAVE no .env com a chave única da serventia "
            "(fornecida pela ONR via oficioeletronico@onr.org)."
        )
    return chave


def load_login_config() -> dict | None:
    auto_login = os.getenv("BDLIGHT_AUTO_LOGIN", "true").lower() in (
        "1",
        "true",
        "yes",
    )
    hash_override = env_str("ONR_HASH_OVERRIDE")
    if not auto_login or hash_override:
        return None

    login_required = [
        "CERT_PATH",
        "CERT_PASSWORD",
        "CPF",
        "EMAIL",
        "ONR_SERVENTIA_ID",
    ]
    login_missing = [k for k in login_required if not os.getenv(k)]
    if login_missing:
        raise SystemExit(f"Para login automático, preencha: {', '.join(login_missing)}")

    return {
        "cert_path": strip_quotes(os.environ["CERT_PATH"]),
        "cert_password": strip_quotes(os.environ["CERT_PASSWORD"]),
        "cpf": os.environ["CPF"].strip().replace(".", "").replace("-", ""),
        "email": os.environ["EMAIL"].strip(),
        "id_parceiro_ws": int(os.environ["ONR_SERVENTIA_ID"]),
        "wsdl_path": os.getenv("ONR_WSDL_LOGIN_PATH", str(ROOT / "wsdl" / "login.wsdl")),
        "endpoint": os.getenv(
            "ONR_LOGIN_ENDPOINT",
            "https://hml3-wsoficio.onr.org.br/login.asmx",
        ),
        "publickey_format": os.getenv("PUBLICKEY_FORMAT", "base64_der"),
        "validuntil_format": os.getenv("VALIDUNTIL_FORMAT", "iso"),
    }


def load_bdlight_soap_config() -> dict:
    return {
        "wsdl_path": os.getenv(
            "BDLIGHT_WSDL_PATH",
            str(ROOT / "wsdl" / "bdlight.wsdl"),
        ),
        "endpoint": os.getenv(
            "BDLIGHT_ENDPOINT",
            "https://hml3-wsoficio.onr.org.br/bdlight.asmx",
        ),
    }


def resolve_auth_hash(
    chave: str,
    login_cfg: dict | None,
    *,
    token_index: int | None = None,
) -> str:
    hash_override = env_str("ONR_HASH_OVERRIDE")
    if hash_override:
        return hash_override

    if not login_cfg:
        raise SystemExit(
            "Defina ONR_HASH_OVERRIDE ou BDLIGHT_AUTO_LOGIN=true "
            "com credenciais de login."
        )

    tokens = login_tokens(login_cfg)
    if token_index is None:
        token_index = env_int("ONR_HASH_TOKEN_INDEX", 0)
    token = pick_token(tokens, token_index)
    hash_value = compute_onr_auth_hash(chave, token)
    print(f"Token usado: {token} (índice {token_index}, {len(tokens)} disponíveis)")
    print(f"Hash SHA-1(chave+token): {hash_value}")
    return hash_value


def hash_error_hint(codigo_erro: int) -> str | None:
    if codigo_erro == 45:
        return (
            "Dica: cada token só pode ser usado uma vez. Aumente ONR_HASH_TOKEN_INDEX "
            "ou execute login novamente para obter novos tokens."
        )
    return None
