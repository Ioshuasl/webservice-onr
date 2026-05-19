/**
 * Apenas extrai e exibe os campos do certificado (sem chamar o WS).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { extractFromPfx } from "../../lib/cert_extract.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(ROOT, ".env") });

const certPath = process.env.CERT_PATH;
const certPassword = process.env.CERT_PASSWORD ?? "";

if (!certPath) {
  console.error("Defina CERT_PATH no arquivo .env");
  process.exit(1);
}

const fields = extractFromPfx(certPath, certPassword, {
  publickeyFormat: process.env.PUBLICKEY_FORMAT || "base64_der",
  validuntilFormat: process.env.VALIDUNTIL_FORMAT || "iso",
});

const preview = { ...fields };
preview.PUBLICKEY = `${preview.PUBLICKEY.slice(0, 48)}... (${preview.PUBLICKEY.length} chars)`;
delete preview._has_private_key;

console.log(JSON.stringify(preview, null, 2));

const outPath = path.join(ROOT, "cert-fields.json");
const full = { ...fields };
delete full._has_private_key;
fs.writeFileSync(outPath, JSON.stringify(full, null, 2), "utf-8");
console.log(`\nCampos completos salvos em: ${outPath}`);
