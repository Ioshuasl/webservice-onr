"""Helpers para SetPedidoNegativaLoteOE — ArrayOfInt no envelope."""

from __future__ import annotations

import json
import re
from typing import Any

from lib.onr_env import env_int, env_str

ARRAY_OF_INT_ITEM = "int"


def parse_id_pedido(value: Any, *, context: str) -> int:
    if isinstance(value, bool):
        raise SystemExit(f"{context}: valor booleano inválido para IDPedido.")
    if isinstance(value, int):
        return value
    if isinstance(value, str) and value.strip().isdigit():
        return int(value.strip())
    if isinstance(value, dict):
        raw = value.get("IDPedido") or value.get("idPedido") or value.get("id_pedido")
        if raw is not None:
            return parse_id_pedido(raw, context=context)
    raise SystemExit(f"{context}: informe IDPedido numérico.")


def load_pedido_ids(prefix: str, fallback_id_env: str = "OFICIOS_ID_PEDIDO") -> list[int]:
    json_raw = env_str(f"{prefix}PEDIDOS_JSON")
    if json_raw:
        try:
            data = json.loads(json_raw)
        except json.JSONDecodeError as exc:
            raise SystemExit(f"{prefix}PEDIDOS_JSON inválido: {exc}") from exc
        if not isinstance(data, list) or not data:
            raise SystemExit(f"{prefix}PEDIDOS_JSON deve ser um array JSON não vazio.")
        return [parse_id_pedido(row, context=f"Item {i}") for i, row in enumerate(data)]

    ids_raw = env_str(f"{prefix}ID_PEDIDOS")
    if ids_raw:
        parts = [p for p in re.split(r"[,;\s]+", ids_raw.strip()) if p]
        if not parts:
            raise SystemExit(f"{prefix}ID_PEDIDOS está vazio.")
        return [parse_id_pedido(p, context="ID_PEDIDOS") for p in parts]

    single = env_int(f"{prefix}ID_PEDIDO")
    if single is None:
        single = env_int(fallback_id_env)
    if single is not None:
        return [single]

    raise SystemExit(
        f"Defina {prefix}PEDIDOS_JSON, {prefix}ID_PEDIDOS ou {prefix}ID_PEDIDO no .env."
    )


def build_pedidos_array_of_int(ids: list[int]) -> dict[str, list[int]]:
    return {ARRAY_OF_INT_ITEM: ids}
