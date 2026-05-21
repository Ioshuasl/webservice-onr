"""Montagem de ObterXMLSolicitacoesv2_WSReq (v4–v6) a partir do .env."""

from __future__ import annotations

from lib.onr_env import env_str

OBTER_XML_V2_FIELD_ORDER = (
    "Hash",
    "Protocolo",
    "Solicitante",
    "TipoCertidao",
    "PesquisaPor",
    "Status",
    "TipoResposta",
    "DataPedidoDe",
    "DataPedidoAte",
    "DataConferenciaDe",
    "DataConferenciaAte",
)

_TIPO_RESPOSTA_VALIDOS = frozenset({"", "D", "C"})


def load_obter_xml_filters(prefix: str) -> dict:
    status = env_str(f"{prefix}STATUS") or ""
    tipo_resposta = env_str(f"{prefix}TIPO_RESPOSTA") or ""

    if tipo_resposta and tipo_resposta not in _TIPO_RESPOSTA_VALIDOS:
        raise SystemExit(
            f"{prefix}TIPO_RESPOSTA inválido ({tipo_resposta!r}). "
            'Use "" (todos), "D" (devolvidos) ou "C" (certidão) — somente com STATUS=3.'
        )

    if tipo_resposta and status != "3":
        raise SystemExit(
            f"{prefix}TIPO_RESPOSTA só é permitido quando {prefix}STATUS=3 (Respondido)."
        )

    return {
        "protocolo": env_str(f"{prefix}PROTOCOLO") or "",
        "solicitante": env_str(f"{prefix}SOLICITANTE") or "",
        "tipo_certidao": env_str(f"{prefix}TIPO_CERTIDAO") or "",
        "pesquisa_por": env_str(f"{prefix}PESQUISA_POR") or "",
        "status": status,
        "tipo_resposta": tipo_resposta,
        "data_pedido_de": env_str(f"{prefix}DATA_PEDIDO_DE") or "",
        "data_pedido_ate": env_str(f"{prefix}DATA_PEDIDO_ATE") or "",
        "data_conferencia_de": env_str(f"{prefix}DATA_CONFERENCIA_DE") or "",
        "data_conferencia_ate": env_str(f"{prefix}DATA_CONFERENCIA_ATE") or "",
        "xml_output_path": env_str(f"{prefix}XML_OUTPUT_PATH"),
    }


def build_obter_xml_solicitacoes_request(hash_value: str, filters: dict) -> dict:
    values = {
        "Hash": hash_value,
        "Protocolo": filters["protocolo"],
        "Solicitante": filters["solicitante"],
        "TipoCertidao": filters["tipo_certidao"],
        "PesquisaPor": filters["pesquisa_por"],
        "Status": filters["status"],
        "TipoResposta": filters["tipo_resposta"],
        "DataPedidoDe": filters["data_pedido_de"],
        "DataPedidoAte": filters["data_pedido_ate"],
        "DataConferenciaDe": filters["data_conferencia_de"],
        "DataConferenciaAte": filters["data_conferencia_ate"],
    }
    return {key: values[key] for key in OBTER_XML_V2_FIELD_ORDER}


def business_error_hint_obter_xml(codigo: int) -> str | None:
    hints = {
        18: "Status inválido.",
        19: "Data inválida em DataPedidoDe (formato aaaa-mm-dd).",
        20: "Data inválida em DataPedidoAte.",
        21: "Data inválida em DataConferenciaDe.",
        22: "Data inválida em DataConferenciaAte.",
        23: "TipoCertidao deve estar em branco ou conforme tabela da spec.",
        24: "PesquisaPor deve estar em branco ou conforme tabela da spec.",
        26: 'TipoResposta inválido — use "", "D" ou "C" com Status=3.',
        200: "Nenhum registro encontrado para os filtros informados.",
    }
    return hints.get(codigo)


def response_for_display(result: dict, *, xml_preview: int = 200) -> dict:
    xml = result.get("XML") or ""
    preview = (
        f"{xml[:xml_preview]}... ({len(xml)} caracteres)"
        if len(xml) > xml_preview
        else xml
    )
    return {
        "RETORNO": result.get("RETORNO"),
        "CODIGOERRO": result.get("CODIGOERRO"),
        "ERRODESCRICAO": result.get("ERRODESCRICAO"),
        "XML": preview,
        "XMLLength": len(xml),
    }
