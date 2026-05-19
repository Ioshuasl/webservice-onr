"""Helpers para SetPenhoraExigenciaPO — envelope SOAP e validação de pedido."""

from __future__ import annotations

from typing import Any

from zeep import Client

NS = "{http://tempuri.org/WSOficio}"
ANEXO_ITEM = "SetPenhoraExigenciaPO_Anexo_WSReq"
FIELD_ORDER = ("Hash", "IDPedido", "Resposta", "Anexos")

# Status em que o pedido já foi respondido / finalizado (spec § 3.3.1)
_RESPONDED_STATUSES = frozenset({2, 5, 14})
# Status 7 = nota de exigência já cadastrada (não enviar SetPenhoraExigenciaPO de novo)
_EXIGENCIA_JA_CADASTRADA = frozenset({7})


def build_anexo_items(anexos: list[dict[str, str]]) -> list[dict[str, str]]:
    """Normaliza anexos com ordem WSDL: Nome, URLArquivo."""
    return [
        {"Nome": item["Nome"], "URLArquivo": item["URLArquivo"]}
        for item in anexos
    ]


def build_o_request_dict(hash_value: str, id_pedido: int, resposta: str, anexos: list[dict[str, str]]) -> dict:
    """Monta oRequest como dict (ordem WSDL) para zeep/node-soap."""
    items = build_anexo_items(anexos)
    values = {
        "Hash": hash_value,
        "IDPedido": id_pedido,
        "Resposta": resposta,
        "Anexos": {ANEXO_ITEM: items},
    }
    return {key: values[key] for key in FIELD_ORDER}


def build_o_request_typed(
    client: Client,
    hash_value: str,
    id_pedido: int,
    resposta: str,
    anexos: list[dict[str, str]],
) -> Any:
    """Monta oRequest com tipos zeep (ArrayOf explícito — lista direta em Anexos falha)."""
    anexo_type = client.get_type(f"{NS}SetPenhoraExigenciaPO_Anexo_WSReq")
    array_type = client.get_type(f"{NS}ArrayOfSetPenhoraExigenciaPO_Anexo_WSReq")
    req_type = client.get_type(f"{NS}SetPenhoraExigenciaPO_WSReq")
    anexo_objects = [
        anexo_type(Nome=item["Nome"], URLArquivo=item["URLArquivo"])
        for item in build_anexo_items(anexos)
    ]
    anexos_wrapped = array_type(SetPenhoraExigenciaPO_Anexo_WSReq=anexo_objects)
    return req_type(
        Hash=hash_value,
        IDPedido=id_pedido,
        Resposta=resposta,
        Anexos=anexos_wrapped,
    )


def validate_pedido_for_exigencia(pedido: dict) -> list[str]:
    """Retorna avisos se o pedido parece inelegível para nota de exigência."""
    warnings: list[str] = []
    if pedido.get("IDTipoPedido") != 3:
        warnings.append(
            f"IDTipoPedido={pedido.get('IDTipoPedido')} — esperado 3 (Penhora)."
        )
    status = pedido.get("IDStatus")
    if status in _EXIGENCIA_JA_CADASTRADA:
        warnings.append(
            f"IDStatus={status} — pedido já está com nota de exigência (spec: erro 502). "
            "Use outro IDPedido em status 9 (Prenotado) ou 10 (Aguardando Pagto)."
        )
    if status in _RESPONDED_STATUSES:
        warnings.append(
            f"IDStatus={status} — pedido já respondido/finalizado "
            "(spec: erro 55). Use outro IDPedido (ex.: status 9 Prenotado ou 10 Aguardando Pagto)."
        )
    resposta = pedido.get("Resposta")
    if resposta and str(resposta).strip():
        warnings.append(
            "Campo Resposta já preenchido no pedido — não é possível enviar nova nota de exigência."
        )
    if not pedido.get("NumeroPrenotacao") and status not in (9, 10, 11):
        warnings.append(
            "Pedido sem prenotação (spec: erro 54). Execute SetPrenotacaoPO antes."
        )
    return warnings


def soap_fault_hint(message: str) -> str | None:
    """Dicas para falhas SOAP comuns em SetPenhoraExigenciaPO."""
    text = message or ""
    if "T2_IDPedido" in text or "InvalidCastException" in text:
        return (
            "Erro interno do servidor ONR ao processar anexos (InvalidCastException). "
            "Confira: pedido tipo Penhora (3) ainda não respondido, prenotação e pagamento OK, "
            "URLArquivo acessível com extensão .pdf ou .p7s. Se o XML estiver correto, "
            "pode ser instabilidade da homologação — tente outro IDPedido ou contate a ONR."
        )
    if "NullReferenceException" in text:
        return (
            "NullReferenceException no servidor — envie todos os campos (Resposta, Nome, URLArquivo) "
            "e use URL pública válida."
        )
    return None
