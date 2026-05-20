"""Pré-validação de negócio para SetPedidoDevolvidoOE (GetPedidoOE)."""

from __future__ import annotations

from typing import Any

from lib.onr_oficios_respondido import (
    ID_STATUS_OE_DEVOLVIDO,
    ID_STATUS_OE_RESPONDIDO,
)

_STATUS_LABELS = {1: "Aberto", 2: "Respondido", 3: "Devolvido"}


def _status_label(id_status: int) -> str:
    return _STATUS_LABELS.get(id_status, f"status {id_status}")


def validate_pedido_for_devolvido_oe(pedido: dict[str, Any]) -> list[str]:
    """Avisos quando o pedido não pode receber SetPedidoDevolvidoOE (erros 53 / status)."""
    warnings: list[str] = []
    id_status = pedido.get("IDStatus")

    if id_status == ID_STATUS_OE_DEVOLVIDO:
        warnings.append(
            f"IDStatus=3 ({_status_label(3)}) — pedido já devolvido; "
            "não é possível registrar nova devolução."
        )

    if id_status == ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"IDStatus=2 ({_status_label(2)}) — SetPedidoDevolvidoOE retornaria erro 53 "
            '"Pedido já respondido."'
        )

    data_resposta = pedido.get("DataResposta")
    if data_resposta and str(data_resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"DataResposta={data_resposta} já preenchida — "
            "pedido com resposta em processamento."
        )

    resposta = pedido.get("Resposta")
    if resposta and str(resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            "Campo Resposta já preenchido no pedido — "
            "não é possível devolver neste estado."
        )

    return warnings
