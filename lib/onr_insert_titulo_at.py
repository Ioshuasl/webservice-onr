"""Montagem do oRequest InsertTituloAT (ordem e campos exigidos pelo WSDL/.NET)."""

from __future__ import annotations

from decimal import Decimal

# Ordem InsertTituloAT_WSReq — não reordenar.
INSERT_TITULO_FIELD_ORDER = (
    "Hash",
    "Protocolo",
    "ApresentanteNome",
    "ApresentanteEmail",
    "ApresentanteDDDTelefone",
    "ApresentanteNumeroTelefone",
    "ApresentanteCPFCNPJ",
    "ValorDeposito",
    "ValorEmolumentos",
    "DataProtocolo",
    "DataPrevisaoEntrega",
    "ModoNotificacaoStatus",
    "InteressadoNome",
    "InteressadoCPFCNPJ",
    "NaturezaTitulo",
    "CodigoVerificador",
    "TipoSolicitacao",
    "IDTipoStatus",
    "DataStatus",
    "DescricaoStatus",
)


def _str_field(value: str | None) -> str:
    return (value or "").strip()


def _decimal_field(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"))


def build_insert_titulo_request(hash_value: str, cfg: dict) -> dict:
    """
    Monta oRequest com todos os elementos do WSDL.

    O serviço .NET falha com erro genérico (código 0) se elementos opcionais
    forem omitidos do XML — envie string vazia quando não houver valor.
    """
    values = {
        "Hash": hash_value,
        "Protocolo": cfg["protocolo"],
        "ApresentanteNome": cfg["apresentante_nome"],
        "ApresentanteEmail": _str_field(cfg.get("apresentante_email")),
        "ApresentanteDDDTelefone": _str_field(cfg.get("apresentante_ddd")),
        "ApresentanteNumeroTelefone": _str_field(cfg.get("apresentante_telefone")),
        "ApresentanteCPFCNPJ": _str_field(cfg.get("apresentante_cpfcnpj")),
        "ValorDeposito": _decimal_field(cfg["valor_deposito"]),
        "ValorEmolumentos": _decimal_field(cfg["valor_emolumentos"]),
        "DataProtocolo": cfg["data_protocolo"],
        "DataPrevisaoEntrega": cfg["data_previsao_entrega"],
        "ModoNotificacaoStatus": cfg["modo_notificacao"],
        "InteressadoNome": cfg["interessado_nome"],
        "InteressadoCPFCNPJ": _str_field(cfg.get("interessado_cpfcnpj")),
        "NaturezaTitulo": cfg["natureza_titulo"],
        "CodigoVerificador": cfg["codigo_verificador"],
        "TipoSolicitacao": cfg["tipo_solicitacao"],
        "IDTipoStatus": cfg["id_tipo_status"],
        "DataStatus": cfg["data_status"],
        "DescricaoStatus": _str_field(cfg.get("descricao_status")),
    }
    return {key: values[key] for key in INSERT_TITULO_FIELD_ORDER}
