/**
 * Lista varas judiciais (ListVarasPO) no webservice Penhora Online da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envInt, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadLoginConfig,
  loadPenhoraOnlineSoapConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_penhora_online.js";

const FIELD_ORDER = ["Hash", "IDEstado", "IDComarca", "IDForo"];

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idEstado: envInt("PENHORA_ONLINE_ID_ESTADO", -1),
    idComarca: envInt("PENHORA_ONLINE_ID_COMARCA", -1),
    idForo: envInt("PENHORA_ONLINE_ID_FORO", -1),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    IDEstado: cfg.idEstado,
    IDComarca: cfg.idComarca,
    IDForo: cfg.idForo,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializeVaras(varas) {
  if (!varas) return [];
  const items = varas.ListVarasPO_Vara_WSResp;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Varas: serializeVaras(result.Varas),
  };
}

async function listVarasPo(cfg, oRequest) {
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
    [response] = await client.ListVarasPOAsync({ oRequest });
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
    response?.ListVarasPOResult ??
    response?.ListVarasPOResponse?.ListVarasPOResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros ListVarasPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listVarasPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListVarasPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — ${response.Varas.length} vara(s) retornada(s).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
