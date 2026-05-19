#!/usr/bin/env python3
"""Consulta um pedido de penhora online (GetPedidoPO) no webservice Penhora Online da ONR."""

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


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    id_pedido = env_int("PENHORA_ONLINE_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            "Defina PENHORA_ONLINE_ID_PEDIDO no .env com o ID do pedido "
            "(obtido em ListPedidosPO)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": id_pedido,
        **load_penhora_online_soap_config(),
    }


def build_request(hash_value: str, id_pedido: int) -> dict:
    return {"Hash": hash_value, "IDPedido": id_pedido}


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(hash_value, cfg["id_pedido"])

    print("=== Parâmetros GetPedidoPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "GetPedidoPO", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nGetPedidoPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Pedido {cfg['id_pedido']}: protocolo {response.get('Protocolo', '—')}, "
        f"tipo {response.get('IDTipoPedido', '—')}, status {response.get('IDStatus', '—')}"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
