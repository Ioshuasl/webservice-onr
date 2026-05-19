#!/usr/bin/env python3
"""Lista pedidos de penhora online (ListPedidosPO) no webservice Penhora Online da ONR."""

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
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

# Ordem de ListPedidosPO_WSReq em wsdl/penhoraonline.wsdl
FIELD_ORDER = (
    "Hash",
    "MaxRowPerPage",
    "PageNumber",
    "Protocolo",
    "IDVara",
    "IDTipoPedido",
    "IDStatus",
    "DataSolicitacaoInicial",
    "DataSolicitacaoFinal",
    "DataRespostaInicial",
    "DataRespostaFinal",
)


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = [
        "PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL",
        "PENHORA_ONLINE_DATA_SOLICITACAO_FINAL",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    max_row = env_int("PENHORA_ONLINE_MAX_ROW_PER_PAGE", 50)
    if max_row is not None and max_row < 10:
        raise SystemExit(
            "PENHORA_ONLINE_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "max_row_per_page": max_row or 50,
        "page_number": env_int("PENHORA_ONLINE_PAGE_NUMBER", 1),
        "protocolo": env_str("PENHORA_ONLINE_PROTOCOLO") or None,
        "id_vara": env_int("PENHORA_ONLINE_ID_VARA", -1),
        "id_tipo_pedido": env_int("PENHORA_ONLINE_ID_TIPO_PEDIDO", -1),
        "id_status": env_int("PENHORA_ONLINE_ID_STATUS", -1),
        "data_solicitacao_inicial": env_str("PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL"),
        "data_solicitacao_final": env_str("PENHORA_ONLINE_DATA_SOLICITACAO_FINAL"),
        "data_resposta_inicial": env_str("PENHORA_ONLINE_DATA_RESPOSTA_INICIAL") or None,
        "data_resposta_final": env_str("PENHORA_ONLINE_DATA_RESPOSTA_FINAL") or None,
        **load_penhora_online_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    # Penhora Online (.NET): opcionais omitidos geram NullReferenceException no servidor.
    # Enviar Protocolo e datas de resposta como "" quando não filtrados.
    values = {
        "Hash": hash_value,
        "MaxRowPerPage": cfg["max_row_per_page"],
        "PageNumber": cfg["page_number"],
        "Protocolo": cfg["protocolo"] or "",
        "IDVara": cfg["id_vara"],
        "IDTipoPedido": cfg["id_tipo_pedido"],
        "IDStatus": cfg["id_status"],
        "DataSolicitacaoInicial": cfg["data_solicitacao_inicial"],
        "DataSolicitacaoFinal": cfg["data_solicitacao_final"],
        "DataRespostaInicial": cfg["data_resposta_inicial"] or "",
        "DataRespostaFinal": cfg["data_resposta_final"] or "",
    }
    return {key: values[key] for key in FIELD_ORDER}


def build_response(result) -> dict:
    return {
        "RETORNO": result.RETORNO,
        "CODIGOERRO": result.CODIGOERRO,
        "ERRODESCRICAO": result.ERRODESCRICAO,
        "QtdeRegistros": result.QtdeRegistros,
        "QtdePaginas": result.QtdePaginas,
        "Pedidos": serialize_zeep_list(result.Pedidos, "ListPedidosPO_Pedidos_WSResp"),
    }


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print("=== Parâmetros ListPedidosPO ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, "ListPedidosPO", o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\nListPedidosPO falhou: [{codigo}] {descricao}", file=sys.stderr)
        hint = hash_error_hint(codigo) if isinstance(codigo, int) else None
        if hint:
            print(hint, file=sys.stderr)
        return 1

    pedidos_count = len(response.get("Pedidos") or [])
    print(
        f"\nOK — {response.get('QtdeRegistros')} registro(s), "
        f"{response.get('QtdePaginas')} página(s), "
        f"{pedidos_count} pedido(s) nesta página."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
