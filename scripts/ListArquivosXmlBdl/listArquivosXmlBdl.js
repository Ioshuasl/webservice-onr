/**
 * Lista arquivos XML importados no BD Light (ListArquivosXMLBDL) no webservice ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadBdlightSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_bdlight.js";

const FIELD_ORDER = [
  "Hash",
  "MaxRowPerPage",
  "PageNumber",
  "DataInicial",
  "DataFinal",
];

const ARQUIVO_ITEM = "ListArquivosXMLBDL_Arquivos_WSResp";

function loadConfig() {
  const required = ["BDLIGHT_DATA_INICIAL", "BDLIGHT_DATA_FINAL"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const maxRowPerPage = envInt("BDLIGHT_MAX_ROW_PER_PAGE", 50);
  if (maxRowPerPage !== undefined && maxRowPerPage < 10) {
    throw new Error(
      "BDLIGHT_MAX_ROW_PER_PAGE deve ser >= 10 (regra do webservice)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    maxRowPerPage: maxRowPerPage ?? 50,
    pageNumber: envInt("BDLIGHT_PAGE_NUMBER", 1),
    dataInicial: envStr("BDLIGHT_DATA_INICIAL"),
    dataFinal: envStr("BDLIGHT_DATA_FINAL"),
    ...loadBdlightSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    MaxRowPerPage: cfg.maxRowPerPage,
    PageNumber: cfg.pageNumber,
    DataInicial: cfg.dataInicial,
    DataFinal: cfg.dataFinal,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializeArquivos(arquivos) {
  if (!arquivos) return [];
  const items = arquivos[ARQUIVO_ITEM];
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
    Arquivos: serializeArquivos(result.Arquivos),
  };
}

function businessErrorHint(codigo) {
  const hints = {
    12: "MaxRowPerPage inválido (mínimo 10).",
    13: "PageNumber inválido.",
    14: "Informe DataInicial (aaaa-mm-dd).",
    15: "Informe DataFinal (aaaa-mm-dd).",
    16: "DataInicial inválida.",
    17: "DataFinal inválida.",
    18: "Período de importação máximo 90 dias.",
    30: "Página além do máximo disponível.",
    51: "Não foi possível obter os arquivos.",
  };
  return hints[codigo] ?? null;
}

async function listArquivosXmlBdl(cfg, oRequest) {
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
    [response] = await client.ListArquivosXMLBDLAsync({ oRequest });
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
    response?.ListArquivosXMLBDLResult ??
    response?.ListArquivosXMLBDLResponse?.ListArquivosXMLBDLResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListArquivosXMLBDL ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listArquivosXmlBdl(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListArquivosXMLBDL falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — ${response.QtdeRegistros} registro(s), ` +
      `${response.QtdePaginas} página(s), ` +
      `${response.Arquivos.length} arquivo(s) nesta página.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
