#!/usr/bin/env python3
"""Consulta um pedido de ofício eletrônico (GetPedidoOE) no webservice Ofícios da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_oficios import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_oficios_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

FIELD_ORDER = ("Hash", "IDPedido")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    id_pedido = env_int("OFICIOS_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            "Defina OFICIOS_ID_PEDIDO no .env com o ID do pedido "
            "(obtido em ListPedidosOE / ListPedidosOE_V2)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": id_pedido,
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {"Hash": hash_value, "IDPedido": cfg["id_pedido"]}
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido ou inexistente.",
        51: "Não foi possível obter os dados do pedido.",
        56: "Usuário sem permissão para acessar o pedido informado.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros GetPedidoOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "GetPedidoOE", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nGetPedidoOE falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Pedido {cfg['id_pedido']}: "
        f"protocolo {response.get('Protocolo', '—')}, "
        f"IDStatus={response.get('IDStatus', '—')}, "
        f"instituição {response.get('Instituicao', '—')}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
