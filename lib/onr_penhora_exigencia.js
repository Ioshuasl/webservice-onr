/** Helpers para SetPenhoraExigenciaPO — envelope SOAP e validação de pedido. */

export const ANEXO_ITEM = "SetPenhoraExigenciaPO_Anexo_WSReq";
export const FIELD_ORDER = ["Hash", "IDPedido", "Resposta", "Anexos"];

const RESPONDED_STATUSES = new Set([2, 5, 14]);
const EXIGENCIA_JA_CADASTRADA = new Set([7]);

export function buildAnexoItems(anexos) {
  return anexos.map((item) => ({
    Nome: item.Nome,
    URLArquivo: item.URLArquivo,
  }));
}

/**
 * Monta oRequest na ordem do WSDL.
 * node-soap: array explícito no wrapper do item do WSDL.
 */
export function buildORequest(hashValue, idPedido, resposta, anexos) {
  const items = buildAnexoItems(anexos);
  const values = {
    Hash: hashValue,
    IDPedido: idPedido,
    Resposta: resposta,
    Anexos: {
      [ANEXO_ITEM]: items,
    },
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

export function validatePedidoForExigencia(pedido) {
  const warnings = [];
  if (pedido.IDTipoPedido !== 3) {
    warnings.push(
      `IDTipoPedido=${pedido.IDTipoPedido} — esperado 3 (Penhora).`
    );
  }
  if (EXIGENCIA_JA_CADASTRADA.has(pedido.IDStatus)) {
    warnings.push(
      `IDStatus=${pedido.IDStatus} — pedido já está com nota de exigência (spec: erro 502). ` +
        "Use outro IDPedido em status 9 (Prenotado) ou 10 (Aguardando Pagto)."
    );
  }
  if (RESPONDED_STATUSES.has(pedido.IDStatus)) {
    warnings.push(
      `IDStatus=${pedido.IDStatus} — pedido já respondido/finalizado ` +
        "(spec: erro 55). Use outro IDPedido (ex.: status 9 Prenotado ou 10 Aguardando Pagto)."
    );
  }
  if (pedido.Resposta && String(pedido.Resposta).trim()) {
    warnings.push(
      "Campo Resposta já preenchido no pedido — não é possível enviar nova nota de exigência."
    );
  }
  if (
    !pedido.NumeroPrenotacao &&
    ![9, 10, 11].includes(pedido.IDStatus)
  ) {
    warnings.push(
      "Pedido sem prenotação (spec: erro 54). Execute SetPrenotacaoPO antes."
    );
  }
  return warnings;
}

export function soapFaultHint(message) {
  const text = message || "";
  if (text.includes("T2_IDPedido") || text.includes("InvalidCastException")) {
    return (
      "Erro interno do servidor ONR ao processar anexos (InvalidCastException). " +
      "Confira: pedido tipo Penhora (3) ainda não respondido, prenotação e pagamento OK, " +
      "URLArquivo acessível com extensão .pdf ou .p7s. Se o XML estiver correto, " +
      "pode ser instabilidade da homologação — tente outro IDPedido ou contate a ONR."
    );
  }
  if (text.includes("NullReferenceException")) {
    return (
      "NullReferenceException no servidor — envie todos os campos (Resposta, Nome, URLArquivo) " +
      "e use URL pública válida."
    );
  }
  return null;
}
