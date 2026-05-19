/**
 * Lista status de um título (ListStatusAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadAcompanhamentoSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_acompanhamento.js";

function loadConfig() {
  const idTitulo = envInt("ACOMPANHAMENTO_TITULOS_ID_TITULO");
  if (idTitulo === undefined) {
    throw new Error(
      "Defina ACOMPANHAMENTO_TITULOS_ID_TITULO no .env com o ID do título."
    );
  }

  const dataInicio = envStr("ACOMPANHAMENTO_TITULOS_DATA_STATUS_INICIO");
  const dataFinal = envStr("ACOMPANHAMENTO_TITULOS_DATA_STATUS_FINAL");

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idTitulo,
    maxRowPerPage: envInt("ACOMPANHAMENTO_TITULOS_MAX_ROW_PER_PAGE", 50),
    pageNumber: envInt("ACOMPANHAMENTO_TITULOS_PAGE_NUMBER", 1),
    idTipoStatus: envInt("ACOMPANHAMENTO_TITULOS_ID_TIPO_STATUS", -1),
    dataStatusInicio: dataInicio || null,
    dataStatusFinal: dataFinal || null,
    ...loadAcompanhamentoSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const oRequest = {
    Hash: hashValue,
    MaxRowPerPage: cfg.maxRowPerPage,
    PageNumber: cfg.pageNumber,
    IDTitulo: cfg.idTitulo,
    IDTipoStatus: cfg.idTipoStatus,
  };
  if (cfg.dataStatusInicio) oRequest.DataStatusInicio = cfg.dataStatusInicio;
  if (cfg.dataStatusFinal) oRequest.DataStatusFinal = cfg.dataStatusFinal;
  return oRequest;
}

function serializeStatusList(status) {
  if (!status) return [];
  const items = status.ListStatusAT_Status_WSResp;
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
    IDTitulo: result.IDTitulo,
    IDCartorio: result.IDCartorio,
    Protocolo: result.Protocolo,
    ApresentanteNome: result.ApresentanteNome,
    Status: serializeStatusList(result.Status),
  };
}

async function listStatusAt(cfg, oRequest) {
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
    [response] = await client.ListStatusATAsync({ oRequest });
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
    response?.ListStatusATResult ??
    response?.ListStatusATResponse?.ListStatusATResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListStatusAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listStatusAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListStatusAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Título ${response.IDTitulo}: ` +
      `${response.QtdeRegistros} status no total, ` +
      `${response.QtdePaginas} página(s), ` +
      `${response.Status.length} status nesta página.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
