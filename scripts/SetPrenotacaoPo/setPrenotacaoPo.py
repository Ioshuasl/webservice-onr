#!/usr/bin/env python3
"""Cadastra/atualiza prenotação de pedido penhora (SetPrenotacaoPO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import os
import sys
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

PREFIX = "PENHORA_ONLINE_SET_PRENOTACAO_"
FIELD_ORDER = (
    "Hash",
    "IDPedido",
    "NumeroPrenotacao",
    "DataPrenotacao",
    "DataVencimento",
)


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

    required = [
        f"{PREFIX}NUMERO",
        f"{PREFIX}DATA_PRENOTACAO",
        f"{PREFIX}DATA_VENCIMENTO",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "id_pedido": _resolve_id_pedido(),
        "numero_prenotacao": env_str(f"{PREFIX}NUMERO"),
        "data_prenotacao": env_str(f"{PREFIX}DATA_PRENOTACAO"),
        "data_vencimento": env_str(f"{PREFIX}DATA_VENCIMENTO"),
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": cfg["id_pedido"],
        "NumeroPrenotacao": cfg["numero_prenotacao"],
        "DataPrenotacao": cfg["data_prenotacao"],
        "DataVencimento": cfg["data_vencimento"],
    }
    return {key: values[key] for key in FIELD_ORDER}


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "IDPedido inválido.",
        13: "Informe NumeroPrenotacao.",
        14: "Informe DataPrenotacao (aaaa-mm-dd).",
        15: "DataPrenotacao inválida.",
        16: "Informe DataVencimento (aaaa-mm-dd).",
        17: "DataVencimento inválida.",
        18: "DataVencimento não pode ser anterior à DataPrenotacao.",
        51: "Não foi possível obter dados do pedido.",
        52: "Sem permissão para cadastrar prenotação neste pedido.",
        53: "Prenotação só para pedidos tipo Penhora (IDTipoPedido=3).",
        54: "Não foi possível cadastrar prenotação.",
        55: "Pedido já possui prenotação cadastrada.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros SetPrenotacaoPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "SetPrenotacaoPO", o_request)
    response = to_json_safe(serialize_result(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nSetPrenotacaoPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    print(
        f"\nOK — Prenotação {cfg['numero_prenotacao']} registrada no pedido {cfg['id_pedido']}."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
