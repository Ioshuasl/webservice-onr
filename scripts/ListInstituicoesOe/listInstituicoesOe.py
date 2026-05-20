#!/usr/bin/env python3
"""Lista instituições solicitantes (ListInstituicoesOE) no webservice Ofícios da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_oficios import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_oficios_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

FIELD_ORDER = ("Hash",)
INSTITUICAO_ITEM = "ListInstOE_Inst_WSResp"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        **load_oficios_soap_config(),
    }


def build_request(hash_value: str) -> dict:
    return {"Hash": hash_value}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "Instituicoes": serialize_zeep_list(result.Instituicoes, INSTITUICAO_ITEM),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value)

    print("=== Parâmetros ListInstituicoesOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListInstituicoesOE", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nListInstituicoesOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    instituicoes = response.get("Instituicoes") or []
    print(f"\nOK — {len(instituicoes)} instituição(ões) retornada(s).")
    for row in instituicoes[:10]:
        print(
            f"  IDInstituicao={row.get('IDInstituicao')}: "
            f"{row.get('Instituicao', '—')}"
        )
    if len(instituicoes) > 10:
        print(f"  ... e mais {len(instituicoes) - 10}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
