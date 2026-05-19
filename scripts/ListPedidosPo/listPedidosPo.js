/**
 * Lista pedidos de penhora online (ListPedidosPO) no webservice Penhora Online da ONR.
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
  "MaxRowPerPage",
  "PageNumber",
  "Protocolo",
  "IDVara",
  "IDTipoPedido",
  "IDStatus",
  "DataSolicitacaoInicial",
  "DataSolicitacaoFinal",
  "DataRespostaInicial",
  "DataRespostaFinal",
];

function loadConfig() {
  const required = [
    "PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL",
    "PENHORA_ONLINE_DATA_SOLICITACAO_FINAL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const maxRowPerPage = envInt("PENHORA_ONLINE_MAX_ROW_PER_PAGE", 50);
  if (maxRowPerPage !== undefined && maxRowPerPage < 10) {
    throw new Error(
      "PENHORA_ONLINE_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
    );
  }

  const protocolo = envStr("PENHORA_ONLINE_PROTOCOLO");

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    maxRowPerPage: maxRowPerPage ?? 50,
    pageNumber: envInt("PENHORA_ONLINE_PAGE_NUMBER", 1),
    protocolo: protocolo || null,
    idVara: envInt("PENHORA_ONLINE_ID_VARA", -1),
    idTipoPedido: envInt("PENHORA_ONLINE_ID_TIPO_PEDIDO", -1),
    idStatus: envInt("PENHORA_ONLINE_ID_STATUS", -1),
    dataSolicitacaoInicial: envStr("PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL"),
    dataSolicitacaoFinal: envStr("PENHORA_ONLINE_DATA_SOLICITACAO_FINAL"),
    dataRespostaInicial: envStr("PENHORA_ONLINE_DATA_RESPOSTA_INICIAL") || null,
    dataRespostaFinal: envStr("PENHORA_ONLINE_DATA_RESPOSTA_FINAL") || null,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  // Penhora Online (.NET): opcionais omitidos geram NullReferenceException no servidor.
  const values = {
    Hash: hashValue,
    MaxRowPerPage: cfg.maxRowPerPage,
    PageNumber: cfg.pageNumber,
    Protocolo: cfg.protocolo || "",
    IDVara: cfg.idVara,
    IDTipoPedido: cfg.idTipoPedido,
    IDStatus: cfg.idStatus,
    DataSolicitacaoInicial: cfg.dataSolicitacaoInicial,
    DataSolicitacaoFinal: cfg.dataSolicitacaoFinal,
    DataRespostaInicial: cfg.dataRespostaInicial || "",
    DataRespostaFinal: cfg.dataRespostaFinal || "",
  };

  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializePedidos(pedidos) {
  if (!pedidos) return [];
  const items = pedidos.ListPedidosPO_Pedidos_WSResp;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    QtdeRegistros: result.QtdeRegistros,
    QtdePaginas: result.QtdePaginas,
    Pedidos: serializePedidos(result.Pedidos),
  };
}

async function listPedidosPo(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 60000 },
  });

  let response;
  try {
    [response] = await client.ListPedidosPOAsync({ oRequest });
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
    response?.ListPedidosPOResult ??
    response?.ListPedidosPOResponse?.ListPedidosPOResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListPedidosPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listPedidosPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListPedidosPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — ${response.QtdeRegistros} registro(s), ` +
      `${response.QtdePaginas} página(s), ` +
      `${response.Pedidos.length} pedido(s) nesta página.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
