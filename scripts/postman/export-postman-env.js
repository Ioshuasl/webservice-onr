/**
 * Gera postman/ONR-Homologacao.postman_environment.json a partir de .env + cert-fields.json.
 * Uso: node scripts/extract_cert/extract_cert.js && node scripts/postman/export-postman-env.js
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(ROOT, ".env") });

function stripQuotes(value) {
  const trimmed = String(value ?? "").trim();
  if (
    trimmed.length >= 2 &&
    ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'")))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

const certPath = path.join(ROOT, "cert-fields.json");
if (!fs.existsSync(certPath)) {
  console.error(
    "cert-fields.json não encontrado. Rode primeiro:\n  node scripts/extract_cert/extract_cert.js"
  );
  process.exit(1);
}

const cert = JSON.parse(fs.readFileSync(certPath, "utf-8"));

const entries = [
  ["ONR_LOGIN_ENDPOINT", process.env.ONR_LOGIN_ENDPOINT || "https://hml3-wsoficio.onr.org.br/login.asmx", "default"],
  ["SUBJECTCN", cert.SUBJECTCN, "secret"],
  ["ISSUERO", cert.ISSUERO, "default"],
  ["PUBLICKEY", cert.PUBLICKEY, "secret"],
  ["SERIALNUMBER", cert.SERIALNUMBER, "default"],
  ["VALIDUNTIL", cert.VALIDUNTIL, "default"],
  ["CPF", (process.env.CPF || "").replace(/\D/g, ""), "default"],
  ["EMAIL", stripQuotes(process.env.EMAIL || ""), "default"],
  ["IDParceiroWS", String(process.env.ONR_SERVENTIA_ID || ""), "default"],
  ["ONR_SERVENTIA_CHAVE", stripQuotes(process.env.ONR_SERVENTIA_CHAVE || ""), "secret"],
  ["ONR_HASH_TOKEN_INDEX", process.env.ONR_HASH_TOKEN_INDEX || "0", "default"],
  ["onr_token", "", "default"],
  ["onr_tokens", "", "default"],
  ["onr_hash", "", "default"],
  ["onr_id_usuario", "", "default"],
  ["onr_id_instituicao", "", "default"],
];

const missing = entries
  .filter(([key, val]) => !["onr_token", "onr_tokens", "onr_hash", "onr_id_usuario", "onr_id_instituicao"].includes(key))
  .filter(([, val]) => !val)
  .map(([key]) => key);

if (missing.length) {
  console.error("Valores ausentes no .env ou cert-fields.json:", missing.join(", "));
  process.exit(1);
}

const env = {
  id: "onr-homologacao-local",
  name: "ONR Homologação",
  values: entries.map(([key, value, type]) => ({
    key,
    value,
    type,
    enabled: true,
  })),
  _postman_variable_scope: "environment",
  _postman_exported_at: new Date().toISOString(),
  _postman_exported_using: "export-postman-env.js",
};

const outPath = path.join(ROOT, "postman", "ONR-Homologacao.postman_environment.json");
fs.writeFileSync(outPath, JSON.stringify(env, null, 2), "utf-8");
console.log(`Ambiente Postman gerado: ${outPath}`);
console.log("Importe no Postman: Environments → Import → selecione o arquivo acima.");
