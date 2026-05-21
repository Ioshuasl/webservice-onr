"""Pré-validação de negócio para SetPedidoRetransmitidoOE (GetPedidoOE)."""

from __future__ import annotations

from typing import Any

from lib.onr_oficios_respondido import (
    ID_STATUS_OE_DEVOLVIDO,
    ID_STATUS_OE_RESPONDIDO,
)

# Spec § 3.5.4 / erro 54|503
ID_TIPO_PESQUISA_OE_RETRANSMITIVEL = frozenset({1, 2, 3})

_TIPO_PESQUISA_LABELS = {
    1: "Endereço Rua",
    2: "Endereço Edifício",
    3: "Endereço Loteamento",
    4: "Matrícula",
    5: "Transcrição",
    6: "Pessoa",
    7: "Registro",
    8: "Pactuantes",
}

_STATUS_LABELS = {1: "Aberto", 2: "Respondido", 3: "Devolvido"}


def _tipo_pesquisa_label(id_tipo: int) -> str:
    return _TIPO_PESQUISA_LABELS.get(id_tipo, f"tipo {id_tipo}")


def _status_label(id_status: int) -> str:
    return _STATUS_LABELS.get(id_status, f"status {id_status}")


def validate_pedido_for_retransmitido_oe(pedido: dict[str, Any]) -> list[str]:
    """Avisos quando o pedido não pode receber SetPedidoRetransmitidoOE."""
    warnings: list[str] = []
    id_status = pedido.get("IDStatus")
    id_tipo_pesquisa = pedido.get("IDTipoPesquisa")

    if id_status == ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"IDStatus=2 ({_status_label(2)}) — erro 53/502: pedido já respondido."
        )

    if id_status == ID_STATUS_OE_DEVOLVIDO:
        warnings.append(
            f"IDStatus=3 ({_status_label(3)}) — pedido devolvido; "
            "não é possível retransmitir."
        )

    if (
        id_tipo_pesquisa is not None
        and id_tipo_pesquisa not in ID_TIPO_PESQUISA_OE_RETRANSMITIVEL
    ):
        warnings.append(
            f"IDTipoPesquisa={id_tipo_pesquisa} ({_tipo_pesquisa_label(id_tipo_pesquisa)}) — "
            "apenas tipos 1 (Rua), 2 (Edifício) e 3 (Loteamento) podem ser "
            "retransmitidos (erro 54/503)."
        )

    if pedido.get("Retransmitido") is True:
        warnings.append("Retransmitido=true — pedido já foi retransmitido.")

    data_resposta = pedido.get("DataResposta")
    if data_resposta and str(data_resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            f"DataResposta={data_resposta} já preenchida — "
            "pedido com resposta em processamento."
        )

    resposta = pedido.get("Resposta")
    if resposta and str(resposta).strip() and id_status != ID_STATUS_OE_RESPONDIDO:
        warnings.append(
            "Campo Resposta já preenchido — não é possível retransmitir neste estado."
        )

    return warnings
