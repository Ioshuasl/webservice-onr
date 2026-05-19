#!/usr/bin/env python3
"""Efetua baixa de boleto (SetBaixaBoletoPO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_penhora_online import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_penhora_online_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

FIELD_ORDER = ("Hash", "IDBoleto")


def _resolve_id_boleto() -> int:
    id_boleto = env_int("PENHORA_ONLINE_SET_BAIXA_ID_BOLETO")
    if id_boleto is None:
        id_boleto = env_int("PENHORA_ONLINE_ID_BOLETO")
    if id_boleto is None:
        raise SystemExit(
            "Defina PENHORA_ONLINE_SET_BAIXA_ID_BOLETO ou PENHORA_ONLINE_ID_BOLETO no .env "
            "(IDBoleto retornado por ListBoletosPO)."
        )
    return id_boleto


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_boleto": _resolve_id_boleto(),
        **load_penhora_online_soap_config(),
    }


def build_request(hash_value: str, id_boleto: int) -> dict:
    values = {"Hash": hash_value, "IDBoleto": id_boleto}
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDBoleto inválido — confira com ListBoletosPO.",
        51: "Não foi possível obter os dados do boleto.",
        52: "Não foi possível efetuar a baixa no boleto.",
        501: "Baixa já efetuada anteriormente neste boleto.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value, cfg["id_boleto"])

    print("=== Parâmetros SetBaixaBoletoPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetBaixaBoletoPO", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nSetBaixaBoletoPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(f"\nOK — Baixa registrada no boleto {cfg['id_boleto']}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
