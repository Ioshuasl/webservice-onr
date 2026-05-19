/**
 * Lista títulos (ListTitulosAT) no webservice Acompanhamento de Títulos da ONR.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import soap from "soap";
import { envInt, envStr, resolvePath, ROOT, stripQuotes } from "../../lib/onr_env.js";
import { computeOnrAuthHash, pickToken } from "../../lib/onr_hash.js";
import { loginTokens } from "../../lib/onr_login.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadChave() {
  const chave = envStr("ONR_SERVENTIA_CHAVE");
  if (!chave) {
    throw new Error(
      "Defina ONR_SERVENTIA_CHAVE no .env com a chave única da serventia " +
        "(fornecida pela ONR via oficioeletronico@onr.org)."
    );
  }
  return chave;
}

function loadConfig() {
  const required = [
    "ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_INICIO",
    "ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_FINAL",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Variáveis ausentes no .env: ${missing.join(", ")}`);
  }

  const autoLogin = ["1", "true", "yes"].includes(
    (process.env.ACOMPANHAMENTO_TITULOS_AUTO_LOGIN || "true").toLowerCase()
  );
  const hashOverride = envStr("ONR_HASH_OVERRIDE");
  const needsLogin = autoLogin && !hashOverride;

  let loginCfg = null;
  if (needsLogin) {
    const loginRequired = [
      "CERT_PATH",
      "CERT_PASSWORD",
      "CPF",
      "EMAIL",
      "ONR_SERVENTIA_ID",
    ];
    const loginMissing = loginRequired.filter((k) => !process.env[k]);
    if (loginMissing.length) {
      throw new Error(
        `Para login automático, preencha: ${loginMissing.join(", ")}`
      );
    }
    loginCfg = {
      certPath: stripQuotes(process.env.CERT_PATH),
      certPassword: stripQuotes(process.env.CERT_PASSWORD),
      cpf: process.env.CPF.replace(/\D/g, ""),
      email: process.env.EMAIL.trim(),
      idParceiroWs: Number(process.env.ONR_SERVENTIA_ID),
      wsdlPath:
        process.env.ONR_WSDL_LOGIN_PATH || path.join(ROOT, "wsdl", "login.wsdl"),
      endpoint:
        process.env.ONR_LOGIN_ENDPOINT ||
        "https://hml3-wsoficio.onr.org.br/login.asmx",
      publickeyFormat: process.env.PUBLICKEY_FORMAT || "base64_der",
      validuntilFormat: process.env.VALIDUNTIL_FORMAT || "iso",
    };
  }

  const protocolo = envStr("ACOMPANHAMENTO_TITULOS_PROTOCOLO");
  const apresentante = envStr("ACOMPANHAMENTO_TITULOS_APRESENTANTE");

  return {
    chave: loadChave(),
    hashOverride,
    needsLogin,
    loginCfg,
    hashTokenIndex: envInt("ONR_HASH_TOKEN_INDEX", 0),
    wsdlPath:
      process.env.ACOMPANHAMENTO_TITULOS_WSDL_PATH ||
      path.join(ROOT, "wsdl", "acompanhamentotitulos.wsdl"),
    endpoint:
      process.env.ACOMPANHAMENTO_TITULOS_ENDPOINT ||
      "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx",
    maxRowPerPage: envInt("ACOMPANHAMENTO_TITULOS_MAX_ROW_PER_PAGE", 50),
    pageNumber: envInt("ACOMPANHAMENTO_TITULOS_PAGE_NUMBER", 1),
    protocolo: protocolo || null,
    dataProtocoloInicio: envStr("ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_INICIO"),
    dataProtocoloFinal: envStr("ACOMPANHAMENTO_TITULOS_DATA_PROTOCOLO_FINAL"),
    idTipoStatus: envInt("ACOMPANHAMENTO_TITULOS_ID_TIPO_STATUS", -1),
    exportado: envInt("ACOMPANHAMENTO_TITULOS_EXPORTADO", -1),
    apresentante: apresentante || null,
  };
}

function buildRequest(cfg, hashValue) {
  const oRequest = {
    Hash: hashValue,
    MaxRowPerPage: cfg.maxRowPerPage,
    PageNumber: cfg.pageNumber,
    DataProtocoloInicio: cfg.dataProtocoloInicio,
    DataProtocoloFinal: cfg.dataProtocoloFinal,
    IDTipoStatus: cfg.idTipoStatus,
    Exportado: cfg.exportado,
  };
  if (cfg.protocolo) oRequest.Protocolo = cfg.protocolo;
  if (cfg.apresentante) oRequest.Apresentante = cfg.apresentante;
  return oRequest;
}

function serializeTitulos(titulos) {
  if (!titulos) return [];
  const items = titulos.ListTitulosAT_Titulos_WSResp;
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
    Titulos: serializeTitulos(result.Titulos),
  };
}

async function listTitulosAt(cfg, oRequest) {
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
    [response] = await client.ListTitulosATAsync({ oRequest });
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
    response?.ListTitulosATResult ??
    response?.ListTitulosATResponse?.ListTitulosATResult ??
    response;

  return normalizeResponse(result);
}

async function resolveHash(cfg) {
  if (cfg.hashOverride) {
    return { hash: cfg.hashOverride, token: null };
  }

  const tokens = await loginTokens(cfg.loginCfg);
  const token = pickToken(tokens, cfg.hashTokenIndex);
  const hash = computeOnrAuthHash(cfg.chave, token);
  console.log(
    `Token usado: ${token} (índice ${cfg.hashTokenIndex}, ${tokens.length} disponíveis)`
  );
  console.log(`Hash SHA-1(chave+token): ${hash}`);
  return { hash, token };
}

async function main() {
  const cfg = loadConfig();
  const { hash } = await resolveHash(cfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListTitulosAT ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listTitulosAt(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListTitulosAT falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    if (response.CODIGOERRO === 45) {
      console.error(
        "Dica: cada token só pode ser usado uma vez. Aumente ONR_HASH_TOKEN_INDEX " +
          "ou execute login novamente para obter novos tokens."
      );
    }
    process.exit(1);
  }

  console.log(
    `\nOK — ${response.QtdeRegistros} registro(s), ` +
      `${response.QtdePaginas} página(s), ` +
      `${response.Titulos.length} título(s) nesta página.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
