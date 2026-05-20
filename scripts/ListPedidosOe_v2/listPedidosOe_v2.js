/**
 * Lista pedidos de ofícios v2 (ListPedidosOE_V2) no webservice Ofícios da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadOficiosSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_oficios.js";

const OPERATION = "ListPedidosOE_V2";

const FIELD_ORDER = [
  "Hash",
  "MaxRowPerPage",
  "PageNumber",
  "Protocolo",
  "IDInstituicao",
  "IDTipoPesquisa",
  "IDStatus",
  "DataSolicitacaoInicial",
  "DataSolicitacaoFinal",
  "DataRespostaInicial",
  "DataRespostaFinal",
];

const PEDIDO_ITEM = "ListPedidosOE_V2_Pedidos_WSResp";

function loadConfig() {
  const required = [
    "OFICIOS_DATA_SOLICITACAO_INICIAL",
    "OFICIOS_DATA_SOLICITACAO_FINAL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const maxRowPerPage = envInt("OFICIOS_MAX_ROW_PER_PAGE", 50);
  if (maxRowPerPage !== undefined && maxRowPerPage < 10) {
    throw new Error(
      "OFICIOS_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    maxRowPerPage: maxRowPerPage ?? 50,
    pageNumber: envInt("OFICIOS_PAGE_NUMBER", 1),
    protocolo: envStr("OFICIOS_PROTOCOLO") || null,
    idInstituicao: envInt("OFICIOS_ID_INSTITUICAO", -1),
    idTipoPesquisa: envInt("OFICIOS_ID_TIPO_PESQUISA", -1),
    idStatus: envInt("OFICIOS_ID_STATUS", -1),
    dataSolicitacaoInicial: envStr("OFICIOS_DATA_SOLICITACAO_INICIAL"),
    dataSolicitacaoFinal: envStr("OFICIOS_DATA_SOLICITACAO_FINAL"),
    dataRespostaInicial: envStr("OFICIOS_DATA_RESPOSTA_INICIAL") || null,
    dataRespostaFinal: envStr("OFICIOS_DATA_RESPOSTA_FINAL") || null,
    ...loadOficiosSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    MaxRowPerPage: cfg.maxRowPerPage,
    PageNumber: cfg.pageNumber,
    Protocolo: cfg.protocolo || "",
    IDInstituicao: cfg.idInstituicao,
    IDTipoPesquisa: cfg.idTipoPesquisa,
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
  const items = pedidos[PEDIDO_ITEM];
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

function businessErrorHint(codigo) {
  const hints = {
    12: "MaxRowPerPage inválido (mínimo 10).",
    13: "PageNumber inválido.",
    14: "Informe DataSolicitacaoInicial (aaaa-mm-dd).",
    15: "DataSolicitacaoInicial inválida.",
    16: "Informe DataSolicitacaoFinal (aaaa-mm-dd).",
    17: "DataSolicitacaoFinal inválida.",
    18: "Período de solicitação máximo 30 dias.",
    19: "DataRespostaInicial inválida.",
    20: "DataRespostaFinal inválida.",
    30: "Página além do máximo disponível.",
    51: "Não foi possível obter os pedidos.",
  };
  return hints[codigo] ?? null;
}

async function listPedidosOeV2(cfg, oRequest) {
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
    [response] = await client.ListPedidosOE_V2Async({ oRequest });
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
    response?.ListPedidosOE_V2Result ??
    response?.ListPedidosOE_V2Response?.ListPedidosOE_V2Result ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log(`=== Parâmetros ${OPERATION} ===`);
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listPedidosOeV2(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\n${OPERATION} falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — ${response.QtdeRegistros} registro(s), ` +
      `${response.QtdePaginas} página(s), ` +
      `${response.Pedidos.length} pedido(s) nesta página.`
  );
  for (const row of response.Pedidos.slice(0, 10)) {
    console.log(
      `  IDPedido=${row.IDPedido}: status=${row.IDStatus}, ` +
        `${row.Instituicao ?? "—"}, protocolo=${row.Protocolo ?? "—"}`
    );
  }
  if (response.Pedidos.length > 10) {
    console.log(`  ... e mais ${response.Pedidos.length - 10}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
