"""Pré-validação de negócio para SetPedidoRespondidoOE (GetPedidoOE)."""

from __future__ import annotations

from typing import Any

ID_STATUS_OE_RESPONDIDO = 2
ID_STATUS_OE_DEVOLVIDO = 3

_STATUS_LABELS = {
    1: "Aberto",
    2: "Respondido",
    3: "Devolvido",
    5: "Finalizado sem Pagamento",
    7: "Nota de Exigência",
}


def _status_label(id_status: int) -> str:
    return _STATUS_LABELS.get(id_status, f"status {id_status}")


def validate_pedido_for_respondido_oe(pedido: dict[str, Any]) -> list[str]:
    """Avisos quando o pedido não pode receber SetPedidoRespondidoOE (erros 53 / 502)."""
    warnings: list[str] = []
    id_status = pedido.get("IDStatus")

    if id_status == ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"IDStatus=2 ({_status_label(2)}) — SetPedidoRespondidoOE retornaria erro 53 "
            '"Pedido já respondido."'
        )

    if id_status == ID_STATUS_OE_DEVOLVIDO:
        warnings.append(
            f"IDStatus=3 ({_status_label(3)}) — pedido devolvido; "
            "não é possível registrar resposta."
        )

    data_resposta = pedido.get("DataResposta")
    if data_resposta and str(data_resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"DataResposta={data_resposta} já preenchida — resposta em processamento "
            "(possível erro 502 se reenviar)."
        )

    resposta = pedido.get("Resposta")
    if resposta and str(resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            "Campo Resposta já preenchido no pedido — aguarde download dos anexos pela ONR "
            "(erro 502 se reenviar)."
        )

    return warnings
