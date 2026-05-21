/** Pré-validação de negócio para SetPedidoRetransmitidoOE (GetPedidoOE). */

import {
  ID_STATUS_OE_DEVOLVIDO,
  ID_STATUS_OE_RESPONDIDO,
} from "./onr_oficios_respondido.js";

/** Spec § 3.5.4 / erro 54|503 — apenas estes tipos podem ser retransmitidos. */
export const ID_TIPO_PESQUISA_OE_RETRANSMITIVEL = new Set([1, 2, 3]);

const TIPO_PESQUISA_LABELS = {
  1: "Endereço Rua",
  2: "Endereço Edifício",
  3: "Endereço Loteamento",
  4: "Matrícula",
  5: "Transcrição",
  6: "Pessoa",
  7: "Registro",
  8: "Pactuantes",
};

const STATUS_LABELS = {
  1: "Aberto",
  2: "Respondido",
  3: "Devolvido",
};

function tipoPesquisaLabel(id) {
  return TIPO_PESQUISA_LABELS[id] ?? `tipo ${id}`;
}

function statusLabel(id) {
  return STATUS_LABELS[id] ?? `status ${id}`;
}

/**
 * Retorna avisos quando o pedido não pode receber SetPedidoRetransmitidoOE.
 */
export function validatePedidoForRetransmitidoOE(pedido) {
  const warnings = [];
  const idStatus = pedido?.IDStatus;
  const idTipoPesquisa = pedido?.IDTipoPesquisa;

  if (idStatus === ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      `IDStatus=2 (${statusLabel(2)}) — erro 53/502: pedido já respondido.`
    );
  }

  if (idStatus === ID_STATUS_OE_DEVOLVIDO) {
    warnings.push(
      `IDStatus=3 (${statusLabel(3)}) — pedido devolvido; não é possível retransmitir.`
    );
  }

  if (
    idTipoPesquisa !== undefined &&
    idTipoPesquisa !== null &&
    !ID_TIPO_PESQUISA_OE_RETRANSMITIVEL.has(idTipoPesquisa)
  ) {
    warnings.push(
      `IDTipoPesquisa=${idTipoPesquisa} (${tipoPesquisaLabel(idTipoPesquisa)}) — ` +
        "apenas tipos 1 (Rua), 2 (Edifício) e 3 (Loteamento) podem ser retransmitidos (erro 54/503)."
    );
  }

  if (pedido?.Retransmitido === true) {
    warnings.push("Retransmitido=true — pedido já foi retransmitido.");
  }

  const dataResposta = pedido?.DataResposta && String(pedido.DataResposta).trim();
  if (dataResposta && idStatus !== ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      `DataResposta=${dataResposta} já preenchida — pedido com resposta em processamento.`
    );
  }

  const resposta = pedido?.Resposta && String(pedido.Resposta).trim();
  if (resposta && idStatus !== ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      "Campo Resposta já preenchido — não é possível retransmitir neste estado."
    );
  }

  return warnings;
}
