/**
 * Lista pedidos para exportação (ListPedidosExportacaoPO) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

const FIELD_ORDER = [
  "Hash",
  "Protocolo",
  "IDTipoPedido",
  "IDStatus",
  "IDVara",
  "DataSolicitacaoInicial",
  "DataSolicitacaoFinal",
  "DataRespostaInicial",
  "DataRespostaFinal",
];

const PEDIDO_ITEM = "ListPedidosExportacaoPO_Pedidos_WSResp";
const PARTE_ITEM = "ListPedidosExportacaoPO_Parte_WSResp";
const IMOVEL_ITEM = "ListPedidosExportacaoPO_Imovel_WSResp";

function loadConfig() {
  const required = [
    "PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL",
    "PENHORA_ONLINE_DATA_SOLICITACAO_FINAL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    protocolo: envStr("PENHORA_ONLINE_PROTOCOLO") || null,
    idTipoPedido: envInt("PENHORA_ONLINE_ID_TIPO_PEDIDO", -1),
    idStatus: envInt("PENHORA_ONLINE_ID_STATUS", -1),
    idVara: envInt("PENHORA_ONLINE_ID_VARA", -1),
    dataSolicitacaoInicial: envStr("PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL"),
    dataSolicitacaoFinal: envStr("PENHORA_ONLINE_DATA_SOLICITACAO_FINAL"),
    dataRespostaInicial: envStr("PENHORA_ONLINE_DATA_RESPOSTA_INICIAL") || null,
    dataRespostaFinal: envStr("PENHORA_ONLINE_DATA_RESPOSTA_FINAL") || null,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Protocolo: cfg.protocolo || "",
    IDTipoPedido: cfg.idTipoPedido,
    IDStatus: cfg.idStatus,
    IDVara: cfg.idVara,
    DataSolicitacaoInicial: cfg.dataSolicitacaoInicial,
    DataSolicitacaoFinal: cfg.dataSolicitacaoFinal,
    DataRespostaInicial: cfg.dataRespostaInicial || "",
    DataRespostaFinal: cfg.dataRespostaFinal || "",
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializeNested(container, itemKey) {
  if (!container) return [];
  const items = container[itemKey];
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function serializePedido(row) {
  if (!row || typeof row !== "object") return row;
  return {
    ...row,
    Parte: serializeNested(row.Parte, PARTE_ITEM),
    Imovel: serializeNested(row.Imovel, IMOVEL_ITEM),
  };
}

function serializePedidos(pedidos) {
  return serializeNested(pedidos, PEDIDO_ITEM).map(serializePedido);
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Pedidos: serializePedidos(result.Pedidos),
  };
}

function businessErrorHint(codigo) {
  const hints = {
    14: "IDVara inválida (use ListVarasPO ou -1 para todas).",
    15: "IDTipoPedido inválido.",
    16: "IDStatus inválido.",
    17: "Informe DataSolicitacaoInicial.",
    18: "Informe DataSolicitacaoFinal.",
    19: "DataSolicitacaoInicial inválida.",
    20: "DataSolicitacaoFinal inválida.",
    21: "Período de solicitação máximo 30 dias.",
    22: "DataRespostaInicial inválida.",
    23: "DataRespostaFinal inválida.",
  };
  return hints[codigo] ?? null;
}

async function listPedidosExportacaoPo(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 120000 },
  });

  let response;
  try {
    [response] = await client.ListPedidosExportacaoPOAsync({ oRequest });
  } catch (err) {
    const status = err?.response?.status;
    const body =
      typeof err?.body === "string"
        ? err.body
        : typeof err?.response?.data === "string"
          ? err.response.data
          : null;

    if (status === 503 || (body && !body.trimStart().startsWith("<"))) {
      throw new Error(
        `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}`
      );
    }
    throw err;
  }

  const result =
    response?.ListPedidosExportacaoPOResult ??
    response?.ListPedidosExportacaoPOResponse?.ListPedidosExportacaoPOResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListPedidosExportacaoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listPedidosExportacaoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListPedidosExportacaoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — ${response.Pedidos.length} pedido(s) para exportação.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
