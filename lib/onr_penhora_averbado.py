"""Helpers para SetPenhoraAverbadoPO — validação de pedido."""

from __future__ import annotations

CERT_ITEM = "SetPenhoraAverbadoPO_Certidao_WSReq"
FIELD_ORDER = ("Hash", "IDPedido", "Resposta", "CertidaoPenhora")

_RESPONDED_STATUSES = frozenset({2, 5, 14})
_UNPAID_STATUSES = frozenset({9, 10, 11, 12, 1})


def build_certidao_penhora(certidoes: list[dict[str, str]]) -> dict:
    items = [
        {"Matricula": c["Matricula"], "URLArquivo": c["URLArquivo"]}
        for c in certidoes
    ]
    return {CERT_ITEM: items}


def build_o_request_dict(
    hash_value: str,
    id_pedido: int,
    resposta: str,
    certidoes: list[dict[str, str]],
) -> dict:
    values = {
        "Hash": hash_value,
        "IDPedido": id_pedido,
        "Resposta": resposta,
        "CertidaoPenhora": build_certidao_penhora(certidoes),
    }
    return {key: values[key] for key in FIELD_ORDER}


def validate_pedido_for_averbado(pedido: dict) -> list[str]:
    """Retorna avisos se o pedido parece inelegível para resposta averbado."""
    warnings: list[str] = []
    if pedido.get("IDTipoPedido") != 3:
        warnings.append(
            f"IDTipoPedido={pedido.get('IDTipoPedido')} — esperado 3 (Penhora)."
        )
    status = pedido.get("IDStatus")
    if status in _RESPONDED_STATUSES:
        warnings.append(
            f"IDStatus={status} — pedido já respondido/finalizado (spec: erro 55)."
        )
    if status == 7:
        warnings.append(
            "IDStatus=7 — pedido em nota de exigência; use SetPenhoraExigenciaPO, não averbado."
        )
    resposta = pedido.get("Resposta")
    if resposta and str(resposta).strip():
        warnings.append("Campo Resposta já preenchido (spec: erro 55 ou 502).")
    if not pedido.get("NumeroPrenotacao"):
        warnings.append("Sem prenotação (spec: erro 54).")
    if not pedido.get("Pago"):
        warnings.append(
            f"Pago=false — pagamento não confirmado (spec: erro 56). "
            f"Status atual: {status}."
        )
    if status in _UNPAID_STATUSES:
        warnings.append(
            f"IDStatus={status} — aguardando pagamento/prenotação; "
            "averbado exige pagamento efetivado (status 13)."
        )
    return warnings
