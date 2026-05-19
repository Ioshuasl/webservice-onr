#!/usr/bin/env python3
"""Informa valor de custas de pedido penhora (SetCustasPO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import sys
from decimal import Decimal
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int, env_str  # noqa: E402
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

PREFIX = "PENHORA_ONLINE_SET_CUSTAS_"
FIELD_ORDER = ("Hash", "IDPedido", "ValorCustas")


def _env_decimal(key: str) -> Decimal:
    raw = env_str(key)
    if raw is None or raw.strip() == "":
        raise SystemExit(f"Defina {key} no .env (valor decimal, ex.: 50.00).")
    text = raw.replace(",", ".").strip()
    try:
        return Decimal(text)
    except Exception:
        raise SystemExit(f"{key} deve ser um valor decimal (valor atual: {raw!r}).") from None


def _resolve_id_pedido() -> int:
    id_pedido = env_int(f"{PREFIX}ID_PEDIDO")
    if id_pedido is None:
        id_pedido = env_int("PENHORA_ONLINE_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_PEDIDO ou PENHORA_ONLINE_ID_PEDIDO no .env "
            "(IDPedido de ListPedidosPO / GetPedidoPO)."
        )
    return id_pedido


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "valor_custas": _env_decimal(f"{PREFIX}VALOR"),
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "ValorCustas": cfg["valor_custas"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "ValorCustas inválido.",
        51: "Não foi possível obter dados do pedido.",
        52: "Sem permissão para informar custas neste pedido.",
        53: "Custas só para pedidos tipo Penhora (IDTipoPedido=3).",
        54: "Pedido ainda sem prenotação — execute SetPrenotacaoPO antes.",
        55: "Valor das custas já informado.",
        56: "Pedido não exige emolumentos.",
        57: "Não foi possível obter dados do cartório.",
        58: "Cartório sem permissão para informar custas.",
        59: "Não foi possível informar custas.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetCustasPO ===")
    print(
        json.dumps(
            {k: (str(v) if isinstance(v, Decimal) else v) for k, v in o_request.items()},
            ensure_ascii=False,
            indent=2,
        )
    )
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetCustasPO", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nSetCustasPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Custas R$ {cfg['valor_custas']} informadas no pedido {cfg['id_pedido']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
