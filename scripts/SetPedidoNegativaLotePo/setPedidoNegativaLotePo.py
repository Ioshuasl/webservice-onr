#!/usr/bin/env python3
"""Negativa em lote de pedidos pessoa (SetPedidoNegativaLotePO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from typing import Any

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
from lib.onr_zeep_serialize import serialize_result, serialize_zeep_list  # noqa: E402

PREFIX = "PENHORA_ONLINE_SET_PEDIDO_NEGATIVA_LOTE_"
PEDIDO_ITEM = "SetPedidoNegativaLotePO_Pedido_WSReq"
RESP_PEDIDO_ITEM = "SetPedidoNegativaLotePO_Pedido_WSResp"
FIELD_ORDER = ("Hash", "Pedidos")


def _parse_id_pedido(value: Any, *, context: str) -> int:
    if isinstance(value, bool):
        raise SystemExit(f"{context}: valor booleano inválido para IDPedido.")
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip().isdigit():
        return int(value.strip())
    if isinstance(value, dict):
        raw = value.get("IDPedido") or value.get("idPedido") or value.get("id_pedido")
        if raw is not None:
            return _parse_id_pedido(raw, context=context)
    raise SystemExit(f"{context}: informe IDPedido numérico.")


def _load_pedidos() -> list[dict[str, int]]:
    json_raw = env_str(f"{PREFIX}PEDIDOS_JSON")
    if json_raw:
        try:
            data = json.loads(json_raw)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{PREFIX}PEDIDOS_JSON inválido: {exc}") from exc
        if not isinstance(data, list) or not data:
            raise SystemExit(f"{PREFIX}PEDIDOS_JSON deve ser um array JSON não vazio.")
        return [
            {"IDPedido": _parse_id_pedido(row, context=f"Item {i}")}
            for i, row in enumerate(data)
        ]

    ids_raw = env_str(f"{PREFIX}ID_PEDIDOS")
    if ids_raw:
        parts = [p for p in re.split(r"[,;\s]+", ids_raw.strip()) if p]
        if not parts:
            raise SystemExit(f"{PREFIX}ID_PEDIDOS está vazio.")
        return [{"IDPedido": _parse_id_pedido(p, context="ID_PEDIDOS")} for p in parts]

    single = env_int(f"{PREFIX}ID_PEDIDO")
    if single is None:
        single = env_int("PENHORA_ONLINE_ID_PEDIDO")
    if single is not None:
        return [{"IDPedido": single}]

    raise SystemExit(
        f"Defina {PREFIX}PEDIDOS_JSON, {PREFIX}ID_PEDIDOS ou "
        f"{PREFIX}ID_PEDIDO no .env (tipo Pessoa = IDTipoPedido 2)."
    )


def _build_pedidos(items: list[dict[str, int]]) -> dict[str, Any]:
    return {PEDIDO_ITEM: items}


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    pedidos = _load_pedidos()
    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "pedidos": pedidos,
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Pedidos": _build_pedidos(cfg["pedidos"]),
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
        12: "Informe ao menos um pedido em Pedidos.",
    }
    return hints.get(codigo)


def _pedido_error_hint(codigo: int) -> str | None:
    hints = {
        151: "IDPedido inválido.",
        152: "Pedido não é do tipo Pessoa (IDTipoPedido=2?).",
        153: "Sem permissão para negativar este pedido.",
        154: "Operação só para pedidos tipo Pessoa (IDTipoPedido=2).",
        155: "Não foi possível negativar o pedido.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPedidoNegativaLotePO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPedidoNegativaLotePO", o_request)
    response = to_json_safe(_normalize_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nSetPedidoNegativaLotePO falhou: [{codigo}] {descricao}",
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
