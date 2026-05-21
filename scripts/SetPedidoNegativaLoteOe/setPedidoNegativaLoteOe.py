#!/usr/bin/env python3
"""Negativa em lote de pedidos de ofício (SetPedidoNegativaLoteOE) no webservice Ofícios da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any

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
from lib.onr_oficios_negativa_lote import (  # noqa: E402
    build_pedidos_array_of_int,
    load_pedido_ids,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result, serialize_zeep_list  # noqa: E402

PREFIX = "OFICIOS_SET_PEDIDO_NEGATIVA_LOTE_"
RESP_PEDIDO_ITEM = "SetPedidoNegativaLoteOE_Pedido_WSResp"
FIELD_ORDER = ("Hash", "Pedidos")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    pedido_ids = load_pedido_ids(PREFIX)
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "pedido_ids": pedido_ids,
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Pedidos": build_pedidos_array_of_int(cfg["pedido_ids"]),
    }
    return {key: values[key] for key in FIELD_ORDER}


def _normalize_response(result: Any) -> dict:
    data = serialize_result(result)
    pedidos_container = data.get("Pedidos")
    pedidos = (
        serialize_zeep_list(pedidos_container, RESP_PEDIDO_ITEM)
        if pedidos_container is not None
        else []
    )
    return {
        "RETORNO": data.get("RETORNO"),
        "CODIGOERRO": data.get("CODIGOERRO"),
        "ERRODESCRICAO": data.get("ERRODESCRICAO"),
        "Pedidos": pedidos,
    }


def _global_error_hint(codigo: int) -> str | None:
    hints = {
        12: "Informe ao menos um pedido em Pedidos (erro 12).",
    }
    return hints.get(codigo)


def _pedido_error_hint(codigo: int) -> str | None:
    hints = {
        151: "IDPedido inválido.",
        152: "Não foi possível obter dados do pedido.",
        153: "Sem permissão para negativar este pedido.",
        154: "Pedido já respondido.",
        155: "Não foi possível negativar o pedido.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPedidoNegativaLoteOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoNegativaLoteOE", o_request)
    response = to_json_safe(_normalize_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoNegativaLoteOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _global_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    pedidos_resp = response.get("Pedidos") or []
    falhas = [p for p in pedidos_resp if not p.get("RETORNO")]
    if falhas:
        print(f"\n{len(falhas)} pedido(s) com falha no lote:", file=sys.stderr)
        for p in falhas:
            codigo = p.get("CODIGOERRO", "?")
            print(
                f"  IDPedido {p.get('IDPedido')}: [{codigo}] {p.get('ERRODESCRICAO', '')}",
                file=sys.stderr,
            )
            if isinstance(codigo, int):
                hint = _pedido_error_hint(codigo)
                if hint:
                    print(f"    {hint}", file=sys.stderr)
        return 1

    ids = [p.get("IDPedido") for p in pedidos_resp]
    print(
        f"\nOK — Negativa em lote registrada para {len(pedidos_resp)} pedido(s): {ids}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
