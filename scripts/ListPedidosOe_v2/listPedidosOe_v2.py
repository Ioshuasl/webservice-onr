#!/usr/bin/env python3
"""Lista pedidos de ofícios v2 (ListPedidosOE_V2) no webservice Ofícios da ONR."""

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
from lib.onr_oficios import (  # noqa: E402
    hash_error_hint,
    load_login_config,
    load_oficios_soap_config,
    load_serventia_chave,
    resolve_auth_hash,
)
from lib.onr_soap import call_operation_from_cfg  # noqa: E402
from lib.onr_zeep_serialize import serialize_zeep_list  # noqa: E402

OPERATION = "ListPedidosOE_V2"

FIELD_ORDER = (
    "Hash",
    "MaxRowPerPage",
    "PageNumber",
    "Protocolo",
    "IDInstituicao",
    "IDTipoPesquisa",
    "IDStatus",
    "DataSolicitacaoInicial",
    "DataSolicitacaoFinal",
    "DataRespostaInicial",
    "DataRespostaFinal",
)

PEDIDO_ITEM = "ListPedidosOE_V2_Pedidos_WSResp"


def load_config() -> dict:
    load_dotenv(ROOT / ".env")

    required = [
        "OFICIOS_DATA_SOLICITACAO_INICIAL",
        "OFICIOS_DATA_SOLICITACAO_FINAL",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        raise SystemExit(f"Variáveis ausentes no .env: {', '.join(missing)}")

    max_row = env_int("OFICIOS_MAX_ROW_PER_PAGE", 50)
    if max_row is not None and max_row < 10:
        raise SystemExit(
            "OFICIOS_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
        )

    return {
        "chave": load_serventia_chave(),
        "login_cfg": load_login_config(),
        "max_row_per_page": max_row or 50,
        "page_number": env_int("OFICIOS_PAGE_NUMBER", 1),
        "protocolo": env_str("OFICIOS_PROTOCOLO") or None,
        "id_instituicao": env_int("OFICIOS_ID_INSTITUICAO", -1),
        "id_tipo_pesquisa": env_int("OFICIOS_ID_TIPO_PESQUISA", -1),
        "id_status": env_int("OFICIOS_ID_STATUS", -1),
        "data_solicitacao_inicial": env_str("OFICIOS_DATA_SOLICITACAO_INICIAL"),
        "data_solicitacao_final": env_str("OFICIOS_DATA_SOLICITACAO_FINAL"),
        "data_resposta_inicial": env_str("OFICIOS_DATA_RESPOSTA_INICIAL") or None,
        "data_resposta_final": env_str("OFICIOS_DATA_RESPOSTA_FINAL") or None,
        **load_oficios_soap_config(),
    }


def build_request(cfg: dict, hash_value: str) -> dict:
    values = {
        "Hash": hash_value,
        "MaxRowPerPage": cfg["max_row_per_page"],
        "PageNumber": cfg["page_number"],
        "Protocolo": cfg["protocolo"] or "",
        "IDInstituicao": cfg["id_instituicao"],
        "IDTipoPesquisa": cfg["id_tipo_pesquisa"],
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
        "Pedidos": serialize_zeep_list(result.Pedidos, PEDIDO_ITEM),
    }


def _business_error_hint(codigo: int) -> str | None:
    hints = {
        12: "MaxRowPerPage inválido (mínimo 10).",
        13: "PageNumber inválido.",
        14: "Informe DataSolicitacaoInicial (aaaa-mm-dd).",
        15: "DataSolicitacaoInicial inválida.",
        16: "Informe DataSolicitacaoFinal (aaaa-mm-dd).",
        17: "DataSolicitacaoFinal inválida.",
        18: "Período de solicitação máximo 30 dias.",
        19: "DataRespostaInicial inválida.",
        20: "DataRespostaFinal inválida.",
        30: "Página além do máximo disponível.",
        51: "Não foi possível obter os pedidos.",
    }
    return hints.get(codigo)


def main() -> int:
    cfg = load_config()
    hash_value = resolve_auth_hash(cfg["chave"], cfg["login_cfg"])
    o_request = build_request(cfg, hash_value)

    print(f"=== Parâmetros {OPERATION} ===")
    print(json.dumps(o_request, ensure_ascii=False, indent=2))
    print(f"\nEndpoint: {cfg['endpoint']}")

    result = call_operation_from_cfg(cfg, OPERATION, o_request)
    response = to_json_safe(build_response(result))

    print("\n=== Resposta ===")
    print(json.dumps(response, ensure_ascii=False, indent=2))

    if not response.get("RETORNO"):
        codigo = response.get("CODIGOERRO", "?")
        descricao = response.get("ERRODESCRICAO", "")
        print(f"\n{OPERATION} falhou: [{codigo}] {descricao}", file=sys.stderr)
        if isinstance(codigo, int):
            hint = _business_error_hint(codigo) or hash_error_hint(codigo)
            if hint:
                print(hint, file=sys.stderr)
        return 1

    pedidos = response.get("Pedidos") or []
    print(
        f"\nOK — {response.get('QtdeRegistros')} registro(s), "
        f"{response.get('QtdePaginas')} página(s), "
        f"{len(pedidos)} pedido(s) nesta página."
    )
    for row in pedidos[:10]:
        print(
            f"  IDPedido={row.get('IDPedido')}: "
            f"status={row.get('IDStatus')}, "
            f"{row.get('Instituicao', '—')}, "
            f"protocolo={row.get('Protocolo', '—')}"
        )
    if len(pedidos) > 10:
        print(f"  ... e mais {len(pedidos) - 10}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
