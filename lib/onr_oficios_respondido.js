/** Pré-validação de negócio para SetPedidoRespondidoOE (GetPedidoOE). */

export const ID_STATUS_OE_RESPONDIDO = 2;
export const ID_STATUS_OE_DEVOLVIDO = 3;

const STATUS_LABELS = {
  1: "Aberto",
  2: "Respondido",
  3: "Devolvido",
  5: "Finalizado sem Pagamento",
  7: "Nota de Exigência",
};

function statusLabel(idStatus) {
  return STATUS_LABELS[idStatus] ?? `status ${idStatus}`;
}

/**
 * Retorna avisos quando o pedido não pode receber SetPedidoRespondidoOE.
 * Espelha erros 53 e 502 da spec antes de consumir o hash da operação de escrita.
 */
export function validatePedidoForRespondidoOE(pedido) {
  const warnings = [];
  const idStatus = pedido?.IDStatus;

  if (idStatus === ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      `IDStatus=2 (${statusLabel(2)}) — SetPedidoRespondidoOE retornaria erro 53 ` +
        `"Pedido já respondido."`
    );
  }

  if (idStatus === ID_STATUS_OE_DEVOLVIDO) {
    warnings.push(
      `IDStatus=3 (${statusLabel(3)}) — pedido devolvido; não é possível registrar resposta.`
    );
  }

  const dataResposta = pedido?.DataResposta && String(pedido.DataResposta).trim();
  if (dataResposta && idStatus !== ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      `DataResposta=${dataResposta} já preenchida — resposta em processamento ` +
        "(possível erro 502 se reenviar)."
    );
  }

  const resposta = pedido?.Resposta && String(pedido.Resposta).trim();
  if (resposta && idStatus !== ID_STATUS_OE_RESPONDIDO) {
    warnings.push(
      "Campo Resposta já preenchido no pedido — aguarde download dos anexos pela ONR " +
        "(erro 502 se reenviar)."
    );
  }

  return warnings;
}
