/** Pré-validação de negócio para SetPedidoDevolvidoOE (GetPedidoOE). */

import {
  ID_STATUS_OE_DEVOLVIDO,
  ID_STATUS_OE_RESPONDIDO,
} from "./onr_oficios_respondido.js";

const STATUS_LABELS = {
  1: "Aberto",
  2: "Respondido",
  3: "Devolvido",
};

function statusLabel(idStatus) {
  return STATUS_LABELS[idStatus] ?? `status ${idStatus}`;
}

/**
 * Retorna avisos quando o pedido não pode receber SetPedidoDevolvidoOE.
 * Espelha erros 53 e status final antes de consumir hash da escrita.
 */
export function validatePedidoForDevolvidoOE(pedido) {
  const warnings = [];
  const idStatus = pedido?.IDStatus;

  if (idStatus === ID_STATUS_OE_DEVOLVIDO) {
    warnings.push(
      `IDStatus=3 (${statusLabel(3)}) — pedido já devolvido; ` +
        "não é possível registrar nova devolução."
    );
  }

  if (idStatus === ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      `IDStatus=2 (${statusLabel(2)}) — SetPedidoDevolvidoOE retornaria erro 53 ` +
        '"Pedido já respondido."'
    );
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
      "Campo Resposta já preenchido no pedido — não é possível devolver neste estado."
    );
  }

  return warnings;
}
