/** Montagem de ObterXMLSolicitacoesv2_WSReq (v4–v6) a partir do .env. */

import { envStr } from "./onr_env.js";

export const OBTER_XML_V2_FIELD_ORDER = [
  "Hash",
  "Protocolo",
  "Solicitante",
  "TipoCertidao",
  "PesquisaPor",
  "Status",
  "TipoResposta",
  "DataPedidoDe",
  "DataPedidoAte",
  "DataConferenciaDe",
  "DataConferenciaAte",
];

const TIPO_RESPOSTA_VALIDOS = new Set(["", "D", "C"]);

/**
 * Carrega filtros de exportação XML (prefixo ex.: CERTIDOES_OBTER_XML_V6_).
 */
export function loadObterXmlFilters(prefix) {
  const status = envStr(`${prefix}STATUS`) ?? "";
  const tipoResposta = envStr(`${prefix}TIPO_RESPOSTA`) ?? "";

  if (tipoResposta && !TIPO_RESPOSTA_VALIDOS.has(tipoResposta)) {
    throw new Error(
      `${prefix}TIPO_RESPOSTA inválido (${JSON.stringify(tipoResposta)}). ` +
        'Use "" (todos), "D" (devolvidos) ou "C" (certidão) — somente com STATUS=3.'
    );
  }

  if (tipoResposta && status !== "3") {
    throw new Error(
      `${prefix}TIPO_RESPOSTA só é permitido quando ${prefix}STATUS=3 (Respondido).`
    );
  }

  return {
    protocolo: envStr(`${prefix}PROTOCOLO`) ?? "",
    solicitante: envStr(`${prefix}SOLICITANTE`) ?? "",
    tipoCertidao: envStr(`${prefix}TIPO_CERTIDAO`) ?? "",
    pesquisaPor: envStr(`${prefix}PESQUISA_POR`) ?? "",
    status,
    tipoResposta,
    dataPedidoDe: envStr(`${prefix}DATA_PEDIDO_DE`) ?? "",
    dataPedidoAte: envStr(`${prefix}DATA_PEDIDO_ATE`) ?? "",
    dataConferenciaDe: envStr(`${prefix}DATA_CONFERENCIA_DE`) ?? "",
    dataConferenciaAte: envStr(`${prefix}DATA_CONFERENCIA_ATE`) ?? "",
    xmlOutputPath: envStr(`${prefix}XML_OUTPUT_PATH`),
  };
}

/** Envelope na ordem WSDL; filtros vazios como "" (spec § 3.6.5). */
export function buildObterXmlSolicitacoesRequest(hashValue, filters) {
  const values = {
    Hash: hashValue,
    Protocolo: filters.protocolo,
    Solicitante: filters.solicitante,
    TipoCertidao: filters.tipoCertidao,
    PesquisaPor: filters.pesquisaPor,
    Status: filters.status,
    TipoResposta: filters.tipoResposta,
    DataPedidoDe: filters.dataPedidoDe,
    DataPedidoAte: filters.dataPedidoAte,
    DataConferenciaDe: filters.dataConferenciaDe,
    DataConferenciaAte: filters.dataConferenciaAte,
  };
  return Object.fromEntries(
    OBTER_XML_V2_FIELD_ORDER.map((key) => [key, values[key]])
  );
}

export function businessErrorHintObterXml(codigo) {
  const hints = {
    18: "Status inválido.",
    19: "Data inválida em DataPedidoDe (formato aaaa-mm-dd).",
    20: "Data inválida em DataPedidoAte.",
    21: "Data inválida em DataConferenciaDe.",
    22: "Data inválida em DataConferenciaAte.",
    23: "TipoCertidao deve estar em branco ou conforme tabela da spec.",
    24: "PesquisaPor deve estar em branco ou conforme tabela da spec.",
    26: 'TipoResposta inválido — use "", "D" ou "C" com Status=3.',
    200: "Nenhum registro encontrado para os filtros informados.",
  };
  return hints[codigo] ?? null;
}

export function responseForDisplay(result, { xmlPreview = 200 } = {}) {
  const xml = result.XML ?? "";
  const preview =
    xml.length > xmlPreview
      ? `${xml.slice(0, xmlPreview)}... (${xml.length} caracteres)`
      : xml;
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    XML: preview,
    XMLLength: xml.length,
  };
}
