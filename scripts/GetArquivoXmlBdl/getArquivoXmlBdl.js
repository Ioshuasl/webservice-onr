/**
 * Consulta detalhes de um arquivo BD Light (GetArquivoXMLBDL) no webservice ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadBdlightSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_bdlight.js";

const FIELD_ORDER = ["Hash", "IDArquivo"];

const INVALIDO_ITEM = "GetArquivoXMLBDL_Invalido_WSResp";

function loadConfig() {
  const idArquivo = envInt("BDLIGHT_ID_ARQUIVO");
  if (idArquivo === undefined) {
    throw new Error(
      "Defina BDLIGHT_ID_ARQUIVO no .env com o código do arquivo (IDArquivo)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idArquivo,
    ...loadBdlightSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = { Hash: hashValue, IDArquivo: cfg.idArquivo };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializeInvalidos(invalidos) {
  if (!invalidos) return [];
  const items = invalidos[INVALIDO_ITEM];
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    IDStatus: result.IDStatus,
    IDUsuario: result.IDUsuario,
    DataImportacao: result.DataImportacao,
    QtdeRegistros: result.QtdeRegistros,
    QtdeInvalidos: result.QtdeInvalidos,
    URLArquivo: result.URLArquivo,
    ErrosImportacao: result.ErrosImportacao,
    Invalidos: serializeInvalidos(result.Invalidos),
  };
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDArquivo inválido ou inexistente.",
    30: "Não foi possível obter os dados do arquivo.",
    50: "Usuário sem permissão para acessar o arquivo informado.",
  };
  return hints[codigo] ?? null;
}

async function getArquivoXmlBdl(cfg, oRequest) {
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
    [response] = await client.GetArquivoXMLBDLAsync({ oRequest });
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
    response?.GetArquivoXMLBDLResult ??
    response?.GetArquivoXMLBDLResponse?.GetArquivoXMLBDLResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros GetArquivoXMLBDL ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await getArquivoXmlBdl(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nGetArquivoXMLBDL falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Arquivo ${cfg.idArquivo}: ` +
      `IDStatus=${response.IDStatus}, ` +
      `${response.QtdeRegistros} registro(s), ` +
      `${response.QtdeInvalidos} inválido(s), ` +
      `${response.Invalidos.length} item(ns) em Invalidos.`
  );
  if (response.URLArquivo) {
    console.log(`URLArquivo: ${response.URLArquivo}`);
  }
  if (response.ErrosImportacao) {
    console.log(`ErrosImportacao: ${response.ErrosImportacao}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
