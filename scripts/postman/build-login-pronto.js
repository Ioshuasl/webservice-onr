/**
 * Gera postman/ONR-Login-Pronto.postman_collection.json (sem scripts, dados no body).
 * Uso: node scripts/extract_cert/extract_cert.js && node scripts/postman/build-login-pronto.js
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");

dotenv.config({ path: path.join(ROOT, ".env") });

const certPath = path.join(ROOT, "cert-fields.json");
if (!fs.existsSync(certPath)) {
  console.error("Rode antes: node scripts/extract_cert/extract_cert.js");
  process.exit(1);
}

const cert = JSON.parse(fs.readFileSync(certPath, "utf-8"));
const endpoint =
  process.env.ONR_LOGIN_ENDPOINT || "https://hml3-wsoficio.onr.org.br/login.asmx";
const cpf = (process.env.CPF || "").replace(/\D/g, "");
const email = (process.env.EMAIL || "").trim();
const idParceiro = Number(process.env.ONR_SERVENTIA_ID);

const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const body = [
  '<?xml version="1.0" encoding="utf-8"?>',
  '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tns="http://tempuri.org/WSOficio">',
  "  <soap:Body>",
  "    <tns:LoginUsuarioCertificado>",
  "      <tns:oRequest>",
  `        <tns:SUBJECTCN>${esc(cert.SUBJECTCN)}</tns:SUBJECTCN>`,
  `        <tns:ISSUERO>${esc(cert.ISSUERO)}</tns:ISSUERO>`,
  `        <tns:PUBLICKEY>${esc(cert.PUBLICKEY)}</tns:PUBLICKEY>`,
  `        <tns:SERIALNUMBER>${esc(cert.SERIALNUMBER)}</tns:SERIALNUMBER>`,
  `        <tns:VALIDUNTIL>${esc(cert.VALIDUNTIL)}</tns:VALIDUNTIL>`,
  `        <tns:CPF>${esc(cpf)}</tns:CPF>`,
  `        <tns:EMAIL>${esc(email)}</tns:EMAIL>`,
  `        <tns:IDParceiroWS>${idParceiro}</tns:IDParceiroWS>`,
  "      </tns:oRequest>",
  "    </tns:LoginUsuarioCertificado>",
  "  </soap:Body>",
  "</soap:Envelope>",
].join("\n");

const collection = {
  info: {
    _postman_id: "onr-login-pronto-2026",
    name: "ONR Login — Pronto (Send)",
    description:
      "LoginUsuarioCertificado com dados do certificado e .env já no corpo XML. Importe e clique em Send — sem scripts e sem ambiente.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
  },
  item: [
    {
      name: "LoginUsuarioCertificado",
      request: {
        method: "POST",
        header: [
          { key: "Content-Type", value: "text/xml; charset=utf-8" },
          {
            key: "SOAPAction",
            value: "http://tempuri.org/WSOficio/LoginUsuarioCertificado",
          },
        ],
        body: { mode: "raw", raw: body, options: { raw: { language: "xml" } } },
        url: endpoint,
        description: `Homologação ONR. Gerado em ${new Date().toISOString().slice(0, 10)}.`,
      },
      response: [],
    },
  ],
};

const outPath = path.join(ROOT, "postman", "ONR-Login-Pronto.postman_collection.json");
fs.writeFileSync(outPath, JSON.stringify(collection, null, 2), "utf-8");
console.log(`Coleção gerada: ${outPath}`);
