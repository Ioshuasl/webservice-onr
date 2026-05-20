#!/usr/bin/env python3
"""Marca o BD Light como atualizado (SetBDLightAtualizado) no webservice ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_bdlight import (  # noqa: E402
    hash_error_hint,
    load_bdlight_soap_config,
    load_login_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

FIELD_ORDER = ("Hash",)


def load_config() -> dict:
    load_dotenv(ROOT / ".env")
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        **load_bdlight_soap_config(),
    }


def build_request(hash_value: str) -> dict:
    return {"Hash": hash_value}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        51: "Não foi possível alterar o BD Light para atualizado.",
        502: (
            "Já existe resposta pendente; aguarde o download/processamento "
            "dos arquivos informados via ImportarArquivoBDL."
        ),
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value)

    print("=== Parâmetros SetBDLightAtualizado ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetBDLightAtualizado", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetBDLightAtualizado falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print("\nOK — BD Light marcado como atualizado para a serventia.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
