#!/usr/bin/env python3
"""Lista varas judiciais (ListVarasPO) no webservice Penhora Online da ONR."""

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

FIELD_ORDER = ("Hash", "IDEstado", "IDComarca", "IDForo")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_estado": env_int("PENHORA_ONLINE_ID_ESTADO", -1),
        "id_comarca": env_int("PENHORA_ONLINE_ID_COMARCA", -1),
        "id_foro": env_int("PENHORA_ONLINE_ID_FORO", -1),
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDEstado": cfg["id_estado"],
        "IDComarca": cfg["id_comarca"],
        "IDForo": cfg["id_foro"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "Varas": serialize_zeep_list(result.Varas, "ListVarasPO_Vara_WSResp"),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListVarasPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListVarasPO", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nListVarasPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    varas_count = len(response.get("Varas") or [])
    print(f"\nOK — {varas_count} vara(s) retornada(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
