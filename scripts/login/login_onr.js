/**
 * Extrai dados do PFX e chama LoginUsuarioCertificado na ONR.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import soap from "soap";
import { extractFromPfx } from "../../lib/cert_extract.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(ROOT, ".env") });

function requireEnv(names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    throw new Error(
      `Variáveis ausentes no .env: ${missing.join(", ")}\nCopie .env.example para .env e preencha.`
    );
  }
}

function stripQuotes(value) {
  const trimmed = value.trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function loadConfig() {
  requireEnv(["CERT_PATH", "CERT_PASSWORD", "CPF", "EMAIL", "ONR_SERVENTIA_ID"]);

  return {
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
    dumpOnly: ["1", "true", "yes"].includes(
      (process.env.DUMP_CERT_ONLY || "").toLowerCase()
    ),
  };
}

function buildLoginRequest(certFields, cfg) {
  return {
    SUBJECTCN: certFields.SUBJECTCN,
    ISSUERO: certFields.ISSUERO,
    PUBLICKEY: certFields.PUBLICKEY,
    SERIALNUMBER: certFields.SERIALNUMBER,
    VALIDUNTIL: certFields.VALIDUNTIL,
    CPF: cfg.cpf,
    EMAIL: cfg.email,
    IDParceiroWS: cfg.idParceiroWs,
  };
}

function normalizeResponse(result) {
  const tokens = result?.Tokens?.string;
  return {
    RETORNO: result.RETORNO,
    CODIGOERRO: result.CODIGOERRO,
    ERRODESCRICAO: result.ERRODESCRICAO,
    IDUsuario: result.IDUsuario,
    IDInstituicao: result.IDInstituicao,
    Ativo: result.Ativo,
    Tokens: Array.isArray(tokens) ? tokens : tokens ? [tokens] : [],
  };
}

async function login(cfg, oRequest) {
  const wsdlPath = path.isAbsolute(cfg.wsdlPath)
    ? cfg.wsdlPath
    : path.join(ROOT, cfg.wsdlPath);

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
    [response] = await client.LoginUsuarioCertificadoAsync({ oRequest });
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
        `Servidor ONR indisponível (HTTP ${status ?? "?"}): ${body ?? err.message}\n` +
          `Tente ONR_LOGIN_ENDPOINT=https://hml3-wsoficio.onr.org.br/login.asmx no .env`
      );
    }
    throw err;
  }

  const result =
    response?.LoginUsuarioCertificadoResult ??
    response?.LoginUsuarioCertificadoResponse?.LoginUsuarioCertificadoResult ??
    response;

  if (result?.Fault || result?.faultcode) {
    throw new Error(
      `Falha SOAP: ${result.faultstring ?? result.Fault?.faultstring ?? "erro desconhecido"}`
    );
  }

  return normalizeResponse(result);
}

async function main() {
  const cfg = loadConfig();

  const certFields = extractFromPfx(cfg.certPath, cfg.certPassword, {
    publickeyFormat: cfg.publickeyFormat,
    validuntilFormat: cfg.validuntilFormat,
  });

  const oRequest = buildLoginRequest(certFields, cfg);

  console.log("=== Campos extraídos do certificado ===");
  const preview = { ...certFields };
  preview.PUBLICKEY = `${preview.PUBLICKEY.slice(0, 48)}... (${preview.PUBLICKEY.length} chars)`;
  delete preview._has_private_key;
  console.log(JSON.stringify(preview, null, 2));

  if (cfg.dumpOnly) {
    const outPath = path.join(ROOT, "cert-fields.json");
    const full = { ...certFields };
    delete full._has_private_key;
    Object.assign(full, {
      CPF: cfg.cpf,
      EMAIL: cfg.email,
      IDParceiroWS: cfg.idParceiroWs,
    });
    fs.writeFileSync(outPath, JSON.stringify(full, null, 2), "utf-8");
    console.log(`\nSomente extração (DUMP_CERT_ONLY). Salvo em: ${outPath}`);
    return;
  }

  console.log("\n=== Chamando LoginUsuarioCertificado ===");
  console.log(`Endpoint: ${cfg.endpoint}`);
  const response = await login(cfg, oRequest);
  console.log(JSON.stringify(response, null, 2));

  if (!response.RETORNO) {
    console.error(
      `\nLogin falhou: [${response.CODIGOERRO}] ${response.ERRODESCRICAO}`
    );
    process.exit(1);
  }

  console.log("\nLogin OK.");
  if (response.Tokens.length) {
    console.log(`Token(s): ${response.Tokens.join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
