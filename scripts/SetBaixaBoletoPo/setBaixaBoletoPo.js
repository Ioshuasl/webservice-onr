/**
 * Efetua baixa de boleto (SetBaixaBoletoPO) no webservice Penhora Online da ONR.
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

const FIELD_ORDER = ["Hash", "IDBoleto"];

function resolveIdBoleto() {
  const id =
    envInt("PENHORA_ONLINE_SET_BAIXA_ID_BOLETO") ??
    envInt("PENHORA_ONLINE_ID_BOLETO");
  if (id === undefined) {
    throw new Error(
      "Defina PENHORA_ONLINE_SET_BAIXA_ID_BOLETO ou PENHORA_ONLINE_ID_BOLETO no .env " +
        "(IDBoleto retornado por ListBoletosPO)."
    );
  }
  return id;
}

function loadConfig() {
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    idBoleto: resolveIdBoleto(),
    ...loadPenhoraOnlineSoapConfig(),
  };
}

function buildRequest(hashValue, idBoleto) {
  const values = { Hash: hashValue, IDBoleto: idBoleto };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    12: "IDBoleto inválido — confira com ListBoletosPO.",
    51: "Não foi possível obter os dados do boleto.",
    52: "Não foi possível efetuar a baixa no boleto.",
    501: "Baixa já efetuada anteriormente neste boleto.",
  };
  return hints[codigo] ?? null;
}

async function setBaixaBoletoPo(cfg, oRequest) {
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
    [response] = await client.SetBaixaBoletoPOAsync({ oRequest });
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
    response?.SetBaixaBoletoPOResult ??
    response?.SetBaixaBoletoPOResponse?.SetBaixaBoletoPOResult ??
    response
  );
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(hash, cfg.idBoleto);

  console.log("=== Parâmetros SetBaixaBoletoPO ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await setBaixaBoletoPo(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nSetBaixaBoletoPO falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(`\nOK — Baixa registrada no boleto ${cfg.idBoleto}.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
