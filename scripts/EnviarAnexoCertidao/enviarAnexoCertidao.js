/**
 * Envia anexo a solicitação de certidão (EnviarAnexoCertidao) no webservice Certidões da ONR.
 */
import fs from "node:fs";
import soap from "soap";
import { resolvePath } from "../../lib/onr_env.js";
import {
  businessErrorHintAnexo,
  loadAnexoArquivo,
  resolveCertidoesProtocolo,
} from "../../lib/onr_certidoes_anexo.js";
import {
  hashErrorHint,
  loadCertidoesSoapConfig,
  loadLoginConfig,
  loadServentiaChave,
  resolveAuthHash,
} from "../../lib/onr_certidoes.js";

const PREFIX = "CERTIDOES_ENVIAR_ANEXO_";
const FIELD_ORDER = ["Hash", "Protocolo", "NomeArquivo", "ArquivoBase64"];

function loadConfig() {
  const anexo = loadAnexoArquivo(PREFIX);
  return {
    chave: loadServentiaChave(),
    loginCfg: loadLoginConfig(),
    protocolo: resolveCertidoesProtocolo(PREFIX),
    nomeArquivo: anexo.nomeArquivo,
    arquivoBase64: anexo.arquivoBase64,
    arquivoBytes: anexo.bytes,
    ...loadCertidoesSoapConfig(),
  };
}

function buildRequest(cfg, hashValue) {
  const values = {
    Hash: hashValue,
    Protocolo: cfg.protocolo,
    NomeArquivo: cfg.nomeArquivo,
    ArquivoBase64: cfg.arquivoBase64,
  };
  return Object.fromEntries(FIELD_ORDER.map((key) => [key, values[key]]));
}

function requestForLog(oRequest) {
  const b64 = oRequest.ArquivoBase64 || "";
  const preview =
    b64.length > 80 ? `${b64.slice(0, 80)}... (${b64.length} chars base64)` : b64;
  return { ...oRequest, ArquivoBase64: preview };
}

function extractResult(response) {
  return (
    response?.EnviarAnexoCertidaoResult ??
    response?.EnviarAnexoCertidaoResponse?.EnviarAnexoCertidaoResult ??
    response
  );
}

async function enviarAnexoCertidao(cfg, oRequest) {
  const wsdlPath = resolvePath(cfg.wsdlPath);
  if (!fs.existsSync(wsdlPath)) {
    throw new Error(`WSDL não encontrado: ${wsdlPath}`);
  }

  const client = await soap.createClientAsync(wsdlPath, {
    endpoint: cfg.endpoint,
    forceSoap12Headers: false,
    wsdl_options: { timeout: 120000 },
  });

  let response;
  try {
    [response] = await client.EnviarAnexoCertidaoAsync({ oRequest });
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

  console.log("=== Parâmetros EnviarAnexoCertidao ===");
  console.log(JSON.stringify(requestForLog(oRequest), null, 2));
  if (cfg.arquivoBytes !== undefined) {
    console.log(`Arquivo: ${cfg.nomeArquivo} (${cfg.arquivoBytes} bytes → base64)`);
  }
  console.log(`\nEndpoint: ${cfg.endpoint}`);

  const response = await enviarAnexoCertidao(cfg, oRequest);
  console.log("\n=== Resposta ===");
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nEnviarAnexoCertidao falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    const hint =
      businessErrorHintAnexo(response.CODIGOERRO) ??
      hashErrorHint(response.CODIGOERRO);
    if (hint) console.error(hint);
    process.exit(1);
  }

  console.log(
    `\nOK — Anexo ${cfg.nomeArquivo} enviado ao protocolo ${cfg.protocolo}.`
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
