#!/usr/bin/env python3
"""Retransmite pedido de ofício (SetPedidoRetransmitidoOE) no webservice Ofícios da ONR."""

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
from lib.onr_oficios_retransmitido import validate_pedido_for_retransmitido_oe  # noqa: E402
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_result  # noqa: E402

PREFIX = "OFICIOS_SET_PEDIDO_RETRANSMITIDO_"
FIELD_ORDER = ("Hash", "IDPedido", "IDCartorio", "Observacoes")


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


def _resolve_id_cartorio() -> int:
    id_cartorio = env_int(f"{PREFIX}ID_CARTORIO")
    if id_cartorio is None:
        raise SystemExit(
            f"Defina {PREFIX}ID_CARTORIO no .env "
            "(obtido em ListCartoriosRestransmitirOE)."
        )
    return id_cartorio


def _parse_skip_validar_status() -> bool:
    raw = env_str(f"{PREFIX}SKIP_VALIDAR_STATUS")
    if not raw:
        return False
    return raw.strip().lower() in ("1", "true", "yes", "sim", "s")


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "id_cartorio": _resolve_id_cartorio(),
        "observacoes": env_str(f"{PREFIX}OBSERVACOES") or "",
        "skip_validar_status": _parse_skip_validar_status(),
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "IDCartorio": cfg["id_cartorio"],
        "Observacoes": cfg["observacoes"],
    }
    keys = (
        FIELD_ORDER
        if cfg["observacoes"]
        else tuple(k for k in FIELD_ORDER if k != "Observacoes")
    )
    return {key: values[key] for key in keys}


def _preflight_get_pedido_oe(cfg: dict) -> int:
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

    warnings = validate_pedido_for_retransmitido_oe(pedido)
    if not warnings:
        print(
            f"Pré-validação OK — pedido {cfg['id_pedido']}: "
            f"IDStatus={pedido.get('IDStatus', '—')}, "
            f"IDTipoPesquisa={pedido.get('IDTipoPesquisa', '—')} "
            f"(protocolo {pedido.get('Protocolo', '—')})."
        )
        return 0

    print(
        "=== Pré-validação GetPedidoOE — pedido inelegível para retransmissão ===",
        file=sys.stderr,
    )
    for w in warnings:
        print(f"  • {w}", file=sys.stderr)
    print(
        "\nSetPedidoRetransmitidoOE não será chamado. Use pedido Aberto com IDTipoPesquisa 1–3. "
        "Cartórios permitidos: ListCartoriosRestransmitirOE. Para ignorar: "
        f"{PREFIX}SKIP_VALIDAR_STATUS=true",
        file=sys.stderr,
    )
    return 1


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "IDCartorio inválido — confira ListCartoriosRestransmitirOE (erro 504 se não permitido).",
        51: "Não foi possível obter dados do pedido.",
        52: "Sem permissão para retransmitir este pedido.",
        53: "Pedido já respondido.",
        54: "Apenas Endereço Rua/Edifício/Loteamento (IDTipoPesquisa 1–3).",
        55: "Não foi possível retransmitir o pedido.",
        501: "Não retransmitir para o cartório de origem do pedido.",
        502: "Pedido já respondido.",
        503: "Tipo de pesquisa não permite retransmissão.",
        504: "Cartório informado não é permitido para este pedido.",
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

    print("=== Parâmetros SetPedidoRetransmitidoOE ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoRetransmitidoOE", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoRetransmitidoOE falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Pedido {cfg['id_pedido']} retransmitido para cartório "
        f"{cfg['id_cartorio']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
