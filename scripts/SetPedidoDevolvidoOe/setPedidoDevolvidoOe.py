#!/usr/bin/env python3
"""Devolve pedido de ofício (SetPedidoDevolvidoOE) no webservice Ofícios da ONR."""

from __future__ import annotations

import json
import sys
from pathlib import Path

from dotenv import load_dotenv

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT))

from lib.onr_env import env_int, env_str  # noqa: E402
from lib.onr_json import to_json_safe  # noqa: E402
from lib.onr_oficios import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_oficios_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_oficios_devolvido import validate_pedido_for_devolvido_oe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "OFICIOS_SET_PEDIDO_DEVOLVIDO_"
FIELD_ORDER = ("Hash", "IDPedido", "MotivoDevolucao")


def _resolve_id_pedido() -> int:
    id_pedido = env_int(f"{PREFIX}ID_PEDIDO")
    if id_pedido is None:
        id_pedido = env_int("OFICIOS_ID_PEDIDO")
    if id_pedido is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_PEDIDO ou OFICIOS_ID_PEDIDO no .env "
            "(IDPedido de ListPedidosOE_V2 / GetPedidoOE)."
        )
    return id_pedido


def _parse_skip_validar_status() -> bool:
    raw = env_str(f"{PREFIX}SKIP_VALIDAR_STATUS")
    if not raw:
        return False
    return raw.strip().lower() in ("1", "true", "yes", "sim", "s")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    motivo = env_str(f"{PREFIX}MOTIVO_DEVOLUCAO")
    if not motivo:
        raise SystemExit(f"Defina {PREFIX}MOTIVO_DEVOLUCAO no .env (motivo da devolução).")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "motivo_devolucao": motivo,
        "skip_validar_status": _parse_skip_validar_status(),
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "MotivoDevolucao": cfg["motivo_devolucao"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def _preflight_get_pedido_oe(cfg: dict) -> int:
    """GetPedidoOE antes da escrita. Retorna código de saída (0 = ok)."""
    if cfg["skip_validar_status"]:
        return 0

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    hash_value = resolve_auth_hash(
        cfg["chave"], cfg["login_cfg"], token_index=base_index
    )
    o_request = {"Hash": hash_value, "IDPedido": cfg["id_pedido"]}

    result = call_operation_from_cfg(cfg, "GetPedidoOE", o_request)
    pedido = to_json_safe(serialize_result(result))

    if not pedido.get("RETORNO"):
        codigo = pedido.get("CODIGOERRO", "?")
        descricao = pedido.get("ERRODESCRICAO", "")
        print(f"GetPedidoOE falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    warnings = validate_pedido_for_devolvido_oe(pedido)
    if not warnings:
        print(
            f"Pré-validação OK — pedido {cfg['id_pedido']}: "
            f"IDStatus={pedido.get('IDStatus', '—')} "
            f"(protocolo {pedido.get('Protocolo', '—')})."
        )
        return 0

    print(
        "=== Pré-validação GetPedidoOE — pedido inelegível para devolução ===",
        file=sys.stderr,
    )
    for w in warnings:
        print(f"  • {w}", file=sys.stderr)
    print(
        "\nSetPedidoDevolvidoOE não será chamado. Use pedido em status Aberto (IDStatus=1). "
        f"Para ignorar: {PREFIX}SKIP_VALIDAR_STATUS=true",
        file=sys.stderr,
    )
    return 1


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe MotivoDevolucao.",
        51: "Não foi possível obter dados do pedido.",
        52: "Sem permissão para devolver este pedido.",
        53: "Pedido já respondido.",
        54: "Não foi possível devolver o pedido.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()

    base_index = env_int("ONR_HASH_TOKEN_INDEX", 0) or 0
    preflight_ran = not cfg["skip_validar_status"]

    if preflight_ran and _preflight_get_pedido_oe(cfg) != 0:
        return 1

    hash_value = resolve_auth_hash(
        cfg["chave"],
        cfg["login_cfg"],
        token_index=base_index + 1 if preflight_ran else base_index,
    )
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPedidoDevolvidoOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoDevolvidoOE", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoDevolvidoOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Pedido {cfg['id_pedido']} devolvido "
        "(IDStatus passa a 3 após processamento)."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
