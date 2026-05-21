#!/usr/bin/env python3
"""Lista cartórios permitidos para retransmissão (ListCartoriosRestransmitirOE) no webservice Ofícios da ONR."""

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
CARTORIO_ITEM = "ListRIRetransOE_WSResp"


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        51: "Apenas usuários de cartórios são permitidos.",
        52: "Não foi possível obter os dados do cartório do usuário.",
        53: "Não foi possível obter os cartórios.",
    }
    return hints.get(codigo)


def load_config() -> dict:
    load_dotenv(ROOT / ".env")
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        **load_oficios_soap_config(),
    }


def build_request(hash_value: str) -> dict:
    return {key: hash_value for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "Cartorios": serialize_zeep_list(result.Cartorios, CARTORIO_ITEM),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value)

    print("=== Parâmetros ListCartoriosRestransmitirOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListCartoriosRestransmitirOE", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nListCartoriosRestransmitirOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    cartorios = response.get("Cartorios") or []
    print(f"\nOK — {len(cartorios)} cartório(s) permitido(s) para retransmissão.")
    for row in cartorios[:15]:
        print(
            f"  IDCartorio={row.get('IDCartorio')}: {row.get('Cartorio', '—')}"
        )
    if len(cartorios) > 15:
        print(f"  ... e mais {len(cartorios) - 15}")
    print(
        "\nUse IDCartorio em OFICIOS_SET_PEDIDO_RETRANSMITIDO_ID_CARTORIO "
        "(SetPedidoRetransmitidoOE)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
