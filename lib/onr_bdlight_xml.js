/**
 * Validação do XML BANCOLIGHT (BD Light) — modelo spec § 4.1 / bdlight-exemplo-1.xml.
 */
import fs from "node:fs";

export const ROOT_TAG = "BANCOLIGHT";
export const INDIVIDUO_TAG = "INDIVIDUO";
export const REQUIRED_FIELDS = [
  "NOME",
  "CNPJCPF",
  "NMATRICULA",
  "TIPODEATO",
  "DTREGAVERB",
  "DTVENDA",
];
export const MAX_BYTES = 5 * 1024 * 1024;
const DATE_RE = /^\d{8}$/;
const CPF_CNPJ_RE = /^\d{11}$|^\d{14}$/;
const FETCH_TIMEOUT_MS = 60_000;

export class BdlightXmlValidationError extends Error {
  constructor(source, errors) {
    const detail = errors.map((e) => `  - ${e}`).join("\n");
    super(`XML BD Light inválido (${source}):\n${detail}`);
    this.name = "BdlightXmlValidationError";
    this.source = source;
    this.errors = errors;
  }
}

function validationEnabled() {
  const raw = (process.env.BDLIGHT_IMPORTAR_VALIDAR_XML || "true").trim().toLowerCase();
  return ["1", "true", "yes"].includes(raw);
}

function decodeXml(buffer) {
  if (buffer.length > MAX_BYTES) {
    throw new BdlightXmlValidationError("conteúdo", [
      `Tamanho ${buffer.length} bytes excede o máximo de ${MAX_BYTES} (5MB).`,
    ]);
  }
  for (const encoding of ["utf8", "latin1"]) {
    try {
      return buffer.toString(encoding);
    } catch {
      /* try next */
    }
  }
  throw new BdlightXmlValidationError("conteúdo", [
    "Não foi possível decodificar o XML (utf-8 / iso-8859-1).",
  ]);
}

function stripCdata(text) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)]]>/g, "$1").trim();
}

function tagText(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const match = block.match(re);
  if (!match) return "";
  return stripCdata(match[1]).trim();
}

function validateDate(value, field, { required }) {
  if (!value) {
    return required ? [`${field} é obrigatório.`] : [];
  }
  if (!DATE_RE.test(value)) {
    return [`${field} deve ter 8 dígitos (DDMMAAAA), recebido: ${JSON.stringify(value)}.`];
  }
  return [];
}

function extractIndividuoBlocks(xml) {
  const re = /<INDIVIDUO\b[^>]*>([\s\S]*?)<\/INDIVIDUO>/gi;
  const blocks = [];
  let match;
  while ((match = re.exec(xml)) !== null) {
    blocks.push(match[0]);
  }
  return blocks;
}

function validateIndividuo(block, index) {
  const errors = [];
  const label = `INDIVIDUO[${index}]`;

  for (const field of REQUIRED_FIELDS) {
    if (!new RegExp(`<${field}\\b`, "i").test(block)) {
      errors.push(`${label}: campo obrigatório ausente: ${field}.`);
    }
  }

  const nome = tagText(block, "NOME");
  if (!nome) errors.push(`${label}: NOME não pode ser vazio.`);

  const cpfRaw = tagText(block, "CNPJCPF");
  const cpfDigits = cpfRaw.replace(/\D/g, "");
  if (!CPF_CNPJ_RE.test(cpfDigits)) {
    errors.push(
      `${label}: CNPJCPF deve ter 11 (CPF) ou 14 (CNPJ) dígitos, recebido: ${JSON.stringify(cpfRaw)}.`
    );
  }

  if (!tagText(block, "NMATRICULA")) {
    errors.push(`${label}: NMATRICULA não pode ser vazio.`);
  }
  if (!tagText(block, "TIPODEATO")) {
    errors.push(`${label}: TIPODEATO não pode ser vazio.`);
  }

  errors.push(
    ...validateDate(tagText(block, "DTREGAVERB"), `${label}.DTREGAVERB`, { required: true })
  );
  const dtvenda = tagText(block, "DTVENDA");
  if (dtvenda) {
    errors.push(...validateDate(dtvenda, `${label}.DTVENDA`, { required: false }));
  }

  return errors;
}

/**
 * Valida estrutura BANCOLIGHT/INDIVIDUO conforme bdlight-exemplo-1.xml.
 * @param {Buffer|string} content
 * @param {{ source?: string }} [opts]
 */
export function validateBdlightXml(content, { source = "XML" } = {}) {
  const buffer = Buffer.isBuffer(content)
    ? content
    : Buffer.from(String(content), "utf8");
  const text = decodeXml(buffer).trim();
  if (!text) {
    throw new BdlightXmlValidationError(source, ["Arquivo XML vazio."]);
  }

  const errors = [];
  if (!/<BANCOLIGHT\b/i.test(text)) {
    errors.push(`Elemento raiz deve ser ${ROOT_TAG}.`);
  }

  const blocks = extractIndividuoBlocks(text);
  if (!blocks.length) {
    errors.push(`É necessário ao menos um ${INDIVIDUO_TAG}.`);
  }

  blocks.forEach((block, i) => {
    errors.push(...validateIndividuo(block, i + 1));
  });

  if (errors.length) {
    throw new BdlightXmlValidationError(source, errors);
  }

  return { valid: true, individuos: blocks.length, source };
}

export function validateBdlightXmlFile(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new BdlightXmlValidationError(filePath, ["Arquivo não encontrado."]);
  }
  return validateBdlightXml(fs.readFileSync(filePath), { source: filePath });
}

export async function validateBdlightXmlUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let response;
  try {
    response = await fetch(url, { signal: controller.signal });
  } catch (err) {
    const msg =
      err.name === "AbortError"
        ? "Timeout ao baixar URL."
        : `Erro ao baixar URL: ${err.message}`;
    throw new BdlightXmlValidationError(url, [msg]);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    throw new BdlightXmlValidationError(url, [
      `HTTP ${response.status} ao baixar URL.`,
    ]);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  return validateBdlightXml(buffer, { source: url });
}

export function loadXmlPathsFromEnv() {
  const raw = (process.env.BDLIGHT_IMPORTAR_XML_PATH || "").trim();
  if (!raw) return [];
  return raw
    .split(/[,;]+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/**
 * Valida paths locais (BDLIGHT_IMPORTAR_XML_PATH) e URLs do envelope.
 */
export async function validateImportInputs(arquivos, { xmlPaths } = {}) {
  if (!validationEnabled()) return [];

  const results = [];
  const paths = xmlPaths ?? loadXmlPathsFromEnv();

  for (const path of paths) {
    results.push(validateBdlightXmlFile(path));
  }

  for (const row of arquivos) {
    const url = row.URLArquivo;
    if (url) {
      results.push(await validateBdlightXmlUrl(url));
    }
  }

  return results;
}
