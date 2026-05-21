/**
 * Devolve solicitação de certidão (DevolverCertidao) no webservice Certidões da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { envStr, resolvePath } from "../../lib/onr_env.js";
import {
  hashErrorHint,
  loadCertidoesSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_certidoes.js";

const PREFIX = "CERTIDOES_DEVOLVER_CERTIDAO_";
const FIELD_ORDER = ["Hash", "Protocolo", "Motivo"];

function resolveProtocolo() {
  const protocolo =
    envStr(`${PREFIX}PROTOCOLO`) ?? envStr("CERTIDOES_PROTOCOLO");
  if (!protocolo) {
    throw new Error(
      `Defina ${PREFIX}PROTOCOLO ou CERTIDOES_PROTOCOLO no .env ` +
        "(protocolo obtido em ObterXMLSolicitacoes_v6 / portal)."
    );
  }
  return protocolo;
}

function loadConfig() {
  const motivo = envStr(`${PREFIX}MOTIVO`);
  if (!motivo) {
    throw new Error(`Defina ${PREFIX}MOTIVO no .env (razão da devolução).`);
  }

  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    protocolo: resolveProtocolo(),
    motivo,
    ...loadCertidoesSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Protocolo: cfg.protocolo,
    Motivo: cfg.motivo,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function businessErrorHint(codigo) {
  const hints = {
    13: "Informe Motivo (razão da devolução).",
    200: "Protocolo não localizado ou solicitação inelegível para devolução.",
  };
  return hints[codigo] ?? null;
}

function extractResult(response) {
  return (
    response?.DevolverCertidaoResult ??
    response?.DevolverCertidaoResponse?.DevolverCertidaoResult ??
    response
  );
}

async function devolverCertidao(cfg, oRequest) {
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
    [response] = await client.DevolverCertidaoAsync({ oRequest });
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

  return extractResult(response);
}

async function main() {
  const cfg = loadConfig();
  const hash = await resolveAuthHash(cfg.chave, cfg.loginCfg);
  const oRequest = buildRequest(cfg, hash);

  console.log("=== Parâmetros DevolverCertidao ===");
  console.log(JSON.stringify(oRequest, null, 2));
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await devolverCertidao(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nDevolverCertidao falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHint(response.CODIGOERRO) ?? hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Solicitação ${cfg.protocolo} marcada como devolvida no ONR.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
