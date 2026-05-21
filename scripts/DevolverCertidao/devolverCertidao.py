#!/usr/bin/env python3
"""Devolve solicitação de certidão (DevolverCertidao) no webservice Certidões da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_certidoes import (  # noqa: E402
    hash_error_hint,
    load_certidoes_soap_config,
    load_login_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "CERTIDOES_DEVOLVER_CERTIDAO_"
FIELD_ORDER = ("Hash", "Protocolo", "Motivo")


def _resolve_protocolo() -> str:
    protocolo = env_str(f"{PREFIX}PROTOCOLO")
    if not protocolo:
        protocolo = env_str("CERTIDOES_PROTOCOLO")
    if not protocolo:
        raise SystemExit(
            f"Defina {PREFIX}PROTOCOLO ou CERTIDOES_PROTOCOLO no .env "
            "(protocolo obtido em ObterXMLSolicitacoes_v6 / portal)."
        )
    return protocolo


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    motivo = env_str(f"{PREFIX}MOTIVO")
    if not motivo:
        raise SystemExit(f"Defina {PREFIX}MOTIVO no .env (razão da devolução).")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "protocolo": _resolve_protocolo(),
        "motivo": motivo,
        **load_certidoes_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Protocolo": cfg["protocolo"],
        "Motivo": cfg["motivo"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        13: "Informe Motivo (razão da devolução).",
        200: "Protocolo não localizado ou solicitação inelegível para devolução.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros DevolverCertidao ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "DevolverCertidao", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nDevolverCertidao falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(f"\nOK — Solicitação {cfg['protocolo']} marcada como devolvida no ONR.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
