/**
 * Importa arquivo(s) XML no BD Light (ImportarArquivoBDL) no webservice ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadBdlightSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_bdlight.js";
import { validateImportInputs } from "../../lib/onr_bdlight_xml.js";

const PREFIX = "BDLIGHT_IMPORTAR_";
const ARQUIVO_ITEM = "ImportarArquivoBDL_Arquivo_WSReq";
const FIELD_ORDER = ["Hash", "Arquivos"];

function parseUrlArquivo(value, context) {
  let url;
  if (typeof value === "string" && value.trim()) {
    url = value.trim();
  } else if (value && typeof value === "object") {
    const raw = value.URLArquivo ?? value.urlArquivo ?? value.url_arquivo;
    if (raw === undefined) {
      throw new Error(`${context}: informe URLArquivo.`);
    }
    url = String(raw).trim();
  } else {
    throw new Error(`${context}: informe URL pública do arquivo .xml.`);
  }

  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) {
      throw new Error("scheme/host");
    }
  } catch {
    throw new Error(`${context}: URL inválida (${url}). Use http(s)://...`);
  }
  return url;
}

function loadArquivos() {
  const jsonRaw = envStr(`${PREFIX}ARQUIVOS_JSON`);
  if (jsonRaw) {
    let data;
    try {
      data = JSON.parse(jsonRaw);
    } catch (err) {
      throw new Error(`${PREFIX}ARQUIVOS_JSON inválido: ${err.message}`);
    }
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${PREFIX}ARQUIVOS_JSON deve ser um array JSON não vazio.`);
    }
    return data.map((row, i) => ({
      URLArquivo: parseUrlArquivo(row, `Item ${i}`),
    }));
  }

  const urlsRaw = envStr(`${PREFIX}URLS`);
  if (urlsRaw) {
    const parts = urlsRaw
      .split(/[,;\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    if (!parts.length) {
      throw new Error(`${PREFIX}URLS está vazio.`);
    }
    return parts.map((p) => ({ URLArquivo: parseUrlArquivo(p, "URLS") }));
  }

  const single = envStr(`${PREFIX}URL_ARQUIVO`);
  if (single) {
    return [{ URLArquivo: parseUrlArquivo(single, "URL_ARQUIVO") }];
  }

  throw new Error(
    `Defina ${PREFIX}URL_ARQUIVO, ${PREFIX}URLS ou ` +
      `${PREFIX}ARQUIVOS_JSON no .env. ` +
      "A URL deve apontar para um .xml público (máx. 5MB, modelo spec § 4.1)."
  );
}

function buildArquivos(items) {
  return { [ARQUIVO_ITEM]: items };
}

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    arquivos: loadArquivos(),
    ...loadBdlightSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Arquivos: buildArquivos(cfg.arquivos),
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "Nenhum arquivo informado no envelope.",
    50: "Usuário sem permissão para o arquivo informado.",
    60: "Não foi possível desbloquear os arquivos.",
    101: "Não foi possível cadastrar o arquivo.",
    102: "Arquivo não encontrado na URL informada.",
    103: "Não foi possível verificar se o arquivo existe.",
    104: "Extensão não permitida — apenas .xml.",
    105: "Aplicação inválida (conteúdo XML fora do modelo BANCOLIGHT).",
    106: "Arquivo maior que 5MB.",
    501: "Campos obrigatórios não informados no XML.",
    502: "Resposta já existente; aguarde download dos arquivos pela ONR.",
  };
  return hints[codigo] ?? null;
}

async function importarArquivoBdl(cfg, oRequest) {
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
    [response] = await client.ImportarArquivoBDLAsync({ oRequest });
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

  return (
    response?.ImportarArquivoBDLResult ??
    response?.ImportarArquivoBDLResponse?.ImportarArquivoBDLResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();

  const checks = await validateImportInputs(cfg.arquivos);
  for (const check of checks) {
    console.log(
      `XML OK (${check.source}): ${check.individuos} INDIVIDUO(s) — padrão BANCOLIGHT.`
    );
  }

  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ImportarArquivoBDL ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await importarArquivoBdl(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nImportarArquivoBDL falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — ${cfg.arquivos.length} arquivo(s) enfileirado(s) para importação. ` +
      "Consulte o status com ListArquivosXMLBDL após o processamento."
  );
  for (const row of cfg.arquivos) {
    console.log(`  - ${row.URLArquivo}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
