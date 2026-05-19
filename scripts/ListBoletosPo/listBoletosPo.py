#!/usr/bin/env python3
"""Lista boletos de um processo (ListBoletosPO) no webservice Penhora Online da ONR."""

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
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

FIELD_ORDER = ("Hash", "IDProcesso")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    id_processo = env_int("PENHORA_ONLINE_ID_PROCESSO")
    if id_processo is None:
        raise SystemExit(
            "Defina PENHORA_ONLINE_ID_PROCESSO no .env com o ID do processo "
            "(obtido em GetPedidoPO, campo IDProcesso)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_processo": id_processo,
        **load_penhora_online_soap_config(),
    }


def build_request(hash_value: str, id_processo: int) -> dict:
    values = {"Hash": hash_value, "IDProcesso": id_processo}
    return {key: values[key] for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "Boletos": serialize_zeep_list(result.Boletos, "ListBoletosPO_Boleto_WSResp"),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value, cfg["id_processo"])

    print("=== Parâmetros ListBoletosPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListBoletosPO", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nListBoletosPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    boletos_count = len(response.get("Boletos") or [])
    print(f"\nOK — {boletos_count} boleto(s) retornado(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
