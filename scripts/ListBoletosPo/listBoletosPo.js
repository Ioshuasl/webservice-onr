/**
 * Lista boletos de um processo (ListBoletosPO) no webservice Penhora Online da ONR.
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

const FIELD_ORDER = ["Hash", "IDProcesso"];

function loadConfig() {
  const idProcesso = envInt("PENHORA_ONLINE_ID_PROCESSO");
  if (idProcesso === undefined) {
    throw new Error(
      "Defina PENHORA_ONLINE_ID_PROCESSO no .env com o ID do processo " +
        "(obtido em GetPedidoPO, campo IDProcesso)."
    );
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idProcesso,
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(hashValue, idProcesso) {
  const values = { Hash: hashValue, IDProcesso: idProcesso };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function serializeBoletos(boletos) {
  if (!boletos) return [];
  const items = boletos.ListBoletosPO_Boleto_WSResp;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

function normalizeResponse(result) {
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    Boletos: serializeBoletos(result.Boletos),
  };
}

async function listBoletosPo(cfg, oRequest) {
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
    [response] = await client.ListBoletosPOAsync({ oRequest });
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
    response?.ListBoletosPOResult ??
    response?.ListBoletosPOResponse?.ListBoletosPOResult ??
    response;

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash, cfg.idProcesso);

  console.log("=== Parâmetros ListBoletosPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await listBoletosPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nListBoletosPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint = hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — ${response.Boletos.length} boleto(s) retornado(s).`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
