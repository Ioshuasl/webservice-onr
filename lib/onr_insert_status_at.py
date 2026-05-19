"""Montagem do oRequest InsertStatusAT (ordem e campos exigidos pelo WSDL/.NET)."""

from __future__ import annotations

# Ordem InsertStatusAT_WSReq — não reordenar.
INSERT_STATUS_FIELD_ORDER = (
    "Hash",
    "IDTitulo",
    "IDTipoStatus",
    "DataStatus",
    "DescricaoStatus",
)


def _str_field(value: str | None) -> str:
    return (value or "").strip()


def build_insert_status_request(hash_value: str, cfg: dict) -> dict:
    """
    Monta oRequest com todos os elementos do WSDL.

    Opcionais omitidos no XML podem gerar erro genérico (código 0) no .NET.
    """
    values = {
        "Hash": hash_value,
        "IDTitulo": cfg["id_titulo"],
        "IDTipoStatus": cfg["id_tipo_status"],
        "DataStatus": cfg["data_status"],
        "DescricaoStatus": _str_field(cfg.get("descricao_status")),
    }
    return {key: values[key] for key in INSERT_STATUS_FIELD_ORDER}
