#!/usr/bin/env python3
"""Lista pedidos para exportação (ListPedidosExportacaoPO) no webservice Penhora Online da ONR."""

from __future__ import annotations

import json
import os
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
from lib.onr_zeep_serialize import serialize_object, serialize_zeep_list  # noqa: E402

# Ordem de ListPedidosExportacaoPO_WSReq em wsdl/penhoraonline.wsdl
FIELD_ORDER = (
    "Hash",
    "Protocolo",
    "IDTipoPedido",
    "IDStatus",
    "IDVara",
    "DataSolicitacaoInicial",
    "DataSolicitacaoFinal",
    "DataRespostaInicial",
    "DataRespostaFinal",
)

PEDIDO_ITEM = "ListPedidosExportacaoPO_Pedidos_WSResp"
PARTE_ITEM = "ListPedidosExportacaoPO_Parte_WSResp"
IMOVEL_ITEM = "ListPedidosExportacaoPO_Imovel_WSResp"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = [
        "PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL",
        "PENHORA_ONLINE_DATA_SOLICITACAO_FINAL",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "protocolo": env_str("PENHORA_ONLINE_PROTOCOLO") or None,
        "id_tipo_pedido": env_int("PENHORA_ONLINE_ID_TIPO_PEDIDO", -1),
        "id_status": env_int("PENHORA_ONLINE_ID_STATUS", -1),
        "id_vara": env_int("PENHORA_ONLINE_ID_VARA", -1),
        "data_solicitacao_inicial": env_str("PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL"),
        "data_solicitacao_final": env_str("PENHORA_ONLINE_DATA_SOLICITACAO_FINAL"),
        "data_resposta_inicial": env_str("PENHORA_ONLINE_DATA_RESPOSTA_INICIAL") or None,
        "data_resposta_final": env_str("PENHORA_ONLINE_DATA_RESPOSTA_FINAL") or None,
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "Protocolo": cfg["protocolo"] or "",
        "IDTipoPedido": cfg["id_tipo_pedido"],
        "IDStatus": cfg["id_status"],
        "IDVara": cfg["id_vara"],
        "DataSolicitacaoInicial": cfg["data_solicitacao_inicial"],
        "DataSolicitacaoFinal": cfg["data_solicitacao_final"],
        "DataRespostaInicial": cfg["data_resposta_inicial"] or "",
        "DataRespostaFinal": cfg["data_resposta_final"] or "",
    }
    return {key: values[key] for key in FIELD_ORDER}


def _serialize_nested(container: Any, item_attr: str) -> list[dict]:
    return serialize_zeep_list(container, item_attr)


def _serialize_pedido(pedido: Any) -> dict:
    data = serialize_object(pedido)
    if not isinstance(data, dict):
        return data
    parte_raw = getattr(pedido, "Parte", None)
    imovel_raw = getattr(pedido, "Imovel", None)
    if parte_raw is not None:
        data["Parte"] = _serialize_nested(parte_raw, PARTE_ITEM)
    if imovel_raw is not None:
        data["Imovel"] = _serialize_nested(imovel_raw, IMOVEL_ITEM)
    return data


def _iter_pedidos(pedidos_container: Any) -> list[Any]:
    if pedidos_container is None:
        return []
    raw = getattr(pedidos_container, PEDIDO_ITEM, None)
    if raw is None:
        return []
    return raw if isinstance(raw, list) else [raw]


def build_response(result) -> dict:
    pedidos = [_serialize_pedido(p) for p in _iter_pedidos(result.Pedidos)]

    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "Pedidos": pedidos,
    }


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        14: "IDVara inválida (use ListVarasPO ou -1 para todas).",
        15: "IDTipoPedido inválido.",
        16: "IDStatus inválido.",
        17: "Informe DataSolicitacaoInicial.",
        18: "Informe DataSolicitacaoFinal.",
        19: "DataSolicitacaoInicial inválida.",
        20: "DataSolicitacaoFinal inválida.",
        21: "Período de solicitação máximo 30 dias.",
        22: "DataRespostaInicial inválida.",
        23: "DataRespostaFinal inválida.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListPedidosExportacaoPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListPedidosExportacaoPO", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(
            f"\nListPedidosExportacaoPO falhou: [{codigo}] {descricao}",
            file=sys.stderr,
        )
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    pedidos = response.get("Pedidos") or []
    print(f"\nOK — {len(pedidos)} pedido(s) para exportação.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
