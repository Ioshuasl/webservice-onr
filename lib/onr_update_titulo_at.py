"""Montagem do oRequest UpdateTituloAT (ordem e campos exigidos pelo WSDL/.NET)."""

from __future__ import annotations

from decimal import Decimal

# Ordem UpdateTituloAT_WSReq — não reordenar.
UPDATE_TITULO_FIELD_ORDER = (
    "Hash",
    "IDTitulo",
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
)


def _str_field(value: str | None) -> str:
    return (value or "").strip()


def _decimal_field(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"))


def build_update_titulo_request(hash_value: str, cfg: dict) -> dict:
    """
    Monta oRequest com todos os elementos do WSDL.

    Mesmo padrão do InsertTituloAT: opcionais omitidos no XML podem gerar
    erro genérico (código 0) no .NET — enviar string vazia quando vazio.
    """
    values = {
        "Hash": hash_value,
        "IDTitulo": cfg["id_titulo"],
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
        "CodigoVerificador": _str_field(cfg.get("codigo_verificador")),
        "TipoSolicitacao": cfg["tipo_solicitacao"],
    }
    return {key: values[key] for key in UPDATE_TITULO_FIELD_ORDER}
