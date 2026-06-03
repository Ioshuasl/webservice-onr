/**
 * Gera postman/onr-webservice-n8n.postman_collection.json a partir dos workflows ONR
 * em workflows/n8n/extensao-n8n-teste (exclui CCN, CENSEC, DOI, SIGEF).
 * Preserva requests existentes quando o nome coincide; complementa os faltantes.
 */
const fs = require("fs");
const path = require("path");
const {
  parseWorkflowFields,
  buildBodyRaw: buildBodyFromWorkflow,
  isEmptyJsonBody: isEmptyBody,
  inferDomain: inferBodyDomain,
  findEnvVar,
} = require("./onr-postman-body.cjs");
const { normalizeLoginFolder } = require("./normalize-login-folder.cjs");
const {
  COLLECTION_NAME,
  COLLECTION_DESCRIPTION,
  POSTMAN: POSTMAN_DIR,
  collectionOutputPaths,
  writeCollectionJson,
} = require("./onr-postman-collection-meta.cjs");
const {
  buildExplicitCollectionVariables,
  webhookVarKey,
  listWorkflowVariableSources,
} = require("./onr-postman-variables.cjs");

const ROOT = path.resolve(__dirname, "../..");
const WORKFLOWS_DIR = path.join(ROOT, "workflows/n8n/extensao-n8n-teste");
const POSTMAN = path.join(ROOT, "postman");
const OUT = path.join(POSTMAN_DIR, "onr-webservice-n8n.postman_collection.json");
const ENV_EXAMPLE = path.join(ROOT, ".env.example");
const ENV_TEMPLATE = path.join(POSTMAN, "onr-webservice-n8n.postman_environment.template.json");

const SKIP_WORKFLOW = /^(CCN|CENSEC|DOI|Parse|SIGEF)/i;

const GET_VAR_HELPER = [
  "function getVar(key) {",
  "  const fromCollection = pm.collectionVariables.get(key);",
  "  if (fromCollection !== undefined && fromCollection !== null && String(fromCollection).length > 0) return fromCollection;",
  "  const fromEnv = pm.environment.get(key);",
  "  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).length > 0) return fromEnv;",
  "  const fromGlobals = pm.globals.get(key);",
  "  if (fromGlobals !== undefined && fromGlobals !== null && String(fromGlobals).length > 0) return fromGlobals;",
  "  return pm.variables.get(key);",
  "}",
];

const FIELD_ALIASES = {
  max_registros_por_pagina: "MAX_ROW_PER_PAGE",
  numero_pagina: "PAGE_NUMBER",
  data_protocolo_inicio: "DATA_PROTOCOLO_INICIO",
  data_protocolo_final: "DATA_PROTOCOLO_FINAL",
  id_tipo_status: "ID_TIPO_STATUS",
  data_status_inicio: "DATA_STATUS_INICIO",
  data_status_final: "DATA_STATUS_FINAL",
  id_titulo: "ID_TITULO",
  id_status: "ID_STATUS",
  id_pedido: "ID_PEDIDO",
  id_boleto: "ID_BOLETO",
  valor: "VALOR",
  id_vara: "ID_VARA",
  id_tipo_pedido: "ID_TIPO_PEDIDO",
  data_solicitacao_inicial: "DATA_SOLICITACAO_INICIAL",
  data_solicitacao_final: "DATA_SOLICITACAO_FINAL",
  data_resposta_inicial: "DATA_RESPOSTA_INICIAL",
  data_resposta_final: "DATA_RESPOSTA_FINAL",
  id_instituicao: "ID_INSTITUICAO",
  id_tipo_pesquisa: "ID_TIPO_PESQUISA",
  numero_prenotacao: "SET_PRENOTACAO_NUMERO",
  data_prenotacao: "SET_PRENOTACAO_DATA_PRENOTACAO",
  data_vencimento: "SET_PRENOTACAO_DATA_VENCIMENTO",
  id_tipo_status: "INSERT_STATUS_ID_TIPO_STATUS",
  data_status: "INSERT_STATUS_DATA_STATUS",
  descricao_status: "INSERT_STATUS_DESCRICAO_STATUS",
};

const REQUEST_SUFFIX = {
  "List Titulos AT": "Listar",
  "List Status AT": "Listar",
  "Get Titulo AT": "Consultar",
  "Get Status AT": "Consultar",
  "Insert Titulo AT": "Cadastrar",
  "Update Titulo AT": "Atualizar",
  "Delete Titulo AT": "Excluir",
  "Insert Status AT": "Cadastrar status",
  "Update Status AT": "Atualizar status",
  "List Pedidos PO": "Listar",
  "Get Pedido PO": "Consultar",
  "List Varas PO": "Listar varas",
  "List Pedidos Exportacao PO": "Listar exportação",
  "Set Prenotacao PO": "Prenotar",
  "Set Baixa Boleto PO": "Baixar",
  "Set Custas PO": "Informar",
  "Set Penhora Averbado PO": "Averbar penhora",
  "Set Penhora Exigencia PO": "Registrar exigência",
  "Set Pedido Pessoa Respondido PO": "Responder",
  "Set Pedido Pessoa Devolvido PO": "Devolver (pessoa)",
  "Set Pedido Matricula Respondido PO": "Responder (matrícula)",
  "Set Pedido Matricula Devolvido PO": "Devolver (matrícula)",
  "Set Pedido Negativa Lote PO": "Negativar",
  "Set Pedido Finalizar Prenotacao Vencida": "Finalizar prenotação vencida",
  "List Pedidos OE": "Listar",
  "List Pedidos OE V2": "Listar (v2)",
  "Get Pedido OE": "Consultar",
  "List Instituicoes OE": "Listar instituições",
  "Set Pedido Respondido OE": "Responder",
  "Set Pedido Devolvido OE": "Devolver",
  "Set Pedido Retransmitido OE": "Retransmitir",
  "Set Pedido Negativa Lote OE": "Negativar",
  "List Cartorios Restransmitir OE": "Listar cartórios",
};

const DOMAINS = {
  AT: {
    folder: "3.2 Acompanhamento de Títulos",
    description: "Proxies do módulo 3.2 (`acompanhamentotitulos.asmx`). Requer `onr_hash` do login.",
    prefix: "ACOMPANHAMENTO_TITULOS_",
    urlVar: "url_servico_acompanhamento_titulos",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx",
    order: [
      "List Titulos AT",
      "List Status AT",
      "Get Titulo AT",
      "Get Status AT",
      "Insert Titulo AT",
      "Update Titulo AT",
      "Delete Titulo AT",
      "Insert Status AT",
      "Update Status AT",
    ],
  },
  PO: {
    folder: "3.3 Penhora Online",
    description: "Proxies do módulo 3.3 (`penhoraonline.asmx`). Requer `onr_hash` do login.",
    prefix: "PENHORA_ONLINE_",
    urlVar: "url_servico_penhora_online",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx",
    order: [
      "List Pedidos PO",
      "Get Pedido PO",
      "List Varas PO",
      "List Pedidos Exportacao PO",
      "Set Prenotacao PO",
      "Set Baixa Boleto PO",
      "Set Custas PO",
      "Set Penhora Averbado PO",
      "Set Penhora Exigencia PO",
      "Set Pedido Pessoa Respondido PO",
      "Set Pedido Pessoa Devolvido PO",
      "Set Pedido Matricula Respondido PO",
      "Set Pedido Matricula Devolvido PO",
      "Set Pedido Negativa Lote PO",
      "Set Pedido Finalizar Prenotacao Vencida",
    ],
  },
  OE: {
    folder: "3.5 Ofícios",
    description: "Proxies do módulo 3.5 (`oficios.asmx`). Requer `onr_hash` do login.",
    prefix: "OFICIOS_",
    urlVar: "url_servico_oficios",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/oficios.asmx",
    order: [
      "List Pedidos OE",
      "List Pedidos OE V2",
      "Get Pedido OE",
      "List Instituicoes OE",
      "Set Pedido Respondido OE",
      "Set Pedido Devolvido OE",
      "Set Pedido Retransmitido OE",
      "Set Pedido Negativa Lote OE",
      "List Cartorios Restransmitir OE",
    ],
  },
};

function loadJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function listOnrWorkflows() {
  return fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith(".workflow.ts") && !SKIP_WORKFLOW.test(f))
    .map((f) => f.replace(".workflow.ts", ""))
    .sort();
}

function inferDomain(name) {
  const d = inferBodyDomain(name);
  if (name.startsWith("Auth")) return "login";
  return d === "login" ? null : d;
}

function parseWorkflow(name) {
  const file = path.join(WORKFLOWS_DIR, `${name}.workflow.ts`);
  const src = fs.readFileSync(file, "utf8");
  const pathMatch = src.match(/path:\s*'([^']+)'/);
  const idMatch = src.match(/webhookId:\s*'([^']+)'/);
  return {
    name,
    domain: inferDomain(name),
    webhookPath: pathMatch ? pathMatch[1] : "",
    webhookId: idMatch ? idMatch[1] : "",
    webhookVarKey: webhookVarKey(name),
    fields: parseWorkflowFields(src),
  };
}

function requestDisplayName(name) {
  const suffix = REQUEST_SUFFIX[name];
  return suffix ? `${name} — ${suffix}` : name;
}

function loadEnvKeys() {
  const keys = new Set();
  const defaults = {};
  if (!fs.existsSync(ENV_EXAMPLE)) return { keys, defaults };
  for (const line of fs.readFileSync(ENV_EXAMPLE, "utf8").split("\n")) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)=(.*)$/);
    if (m) {
      keys.add(m[1]);
      defaults[m[1]] = m[2];
    }
  }
  return { keys, defaults };
}

function buildBodyRaw(wf, domain, envKeys) {
  return buildBodyFromWorkflow(wf, wf.domain || "AT", envKeys);
}

function requiredVars(wf, domain, envKeys) {
  const req = ["onr_hash"];
  for (const f of wf.fields) {
    if (f.name === "url_servico_onr" || f.name === "hash") continue;
    if (!f.expr.includes("??")) {
      const k = findEnvVar(f.name, domain.prefix, wf.name, envKeys);
      if (k && k !== "onr_hash" && !req.includes(k)) req.push(k);
    }
  }
  return req;
}

function prerequestScript(required) {
  return [
    ...GET_VAR_HELPER,
    `const required = ${JSON.stringify(required)};`,
    "const missing = required.filter((k) => !getVar(k));",
    "if (missing.length) {",
    "  throw new Error('Variáveis ausentes: ' + missing.join(', ') + '. Execute Auth ONR — Login antes.');",
    "}",
  ];
}

function defaultTestScript() {
  return [
    "pm.test('HTTP 200', () => pm.response.to.have.status(200));",
    "const json = pm.response.json();",
    "pm.test('status_http espelha HTTP', () => {",
    "  pm.expect(json.status_http).to.eql(pm.response.code);",
    "});",
  ];
}

function makeRequest(wf, domain, existingByName, envKeys) {
  const display = requestDisplayName(wf.name);
  if (existingByName[display]) {
    const copy = JSON.parse(JSON.stringify(existingByName[display]));
    const varKey = webhookVarKey(wf.name);
    copy.request.url = `{{n8n_base_url}}/{{n8n_webhook_mode}}/{{${varKey}}}`;
    if (wf.fields.length) {
      copy.request.body = copy.request.body || { mode: "raw", options: { raw: { language: "json" } } };
      copy.request.body.raw = buildBodyRaw(wf, domain, envKeys);
    }
    return copy;
  }

  const required = requiredVars(wf, domain, envKeys);
  const varKey = webhookVarKey(wf.name);
  return {
    name: display,
    event: [
      { listen: "prerequest", script: { type: "text/javascript", exec: prerequestScript(required) } },
      { listen: "test", script: { type: "text/javascript", exec: defaultTestScript() } },
    ],
    request: {
      method: "POST",
      header: [{ key: "Content-Type", value: "application/json" }],
      body: {
        mode: "raw",
        raw: buildBodyRaw(wf, domain, envKeys),
        options: { raw: { language: "json" } },
      },
      url: `{{n8n_base_url}}/{{n8n_webhook_mode}}/{{${varKey}}}`,
    },
  };
}

function flattenRequests(items, out = {}) {
  for (const it of items || []) {
    if (it.request) out[it.name] = it;
    if (it.item) flattenRequests(it.item, out);
  }
  return out;
}

function buildDomainFolders(workflows, existingByName, envKeys) {
  const byName = Object.fromEntries(workflows.map((w) => [w.name, w]));
  const folders = [];

  for (const [key, domain] of Object.entries(DOMAINS)) {
    const items = [];
    for (const wfName of domain.order) {
      const wf = byName[wfName];
      if (!wf) continue;
      items.push(makeRequest(wf, domain, existingByName, envKeys));
    }
    folders.push({ name: domain.folder, description: domain.description, item: items });
  }
  return folders;
}


function main() {
  const names = listOnrWorkflows();
  const workflows = names.map(parseWorkflow).filter((w) => w.domain && w.domain !== "login" && w.domain !== "certidoes");

  const existing = fs.existsSync(OUT) ? loadJson(OUT) : { info: {}, item: [], variable: [] };
  const existingByName = flattenRequests(existing.item);
  const loginFolderRaw = existing.item.find((i) => i.name && i.name.startsWith("3.1"));
  const certFolder = existing.item.find((i) => i.name && i.name.startsWith("3.6"));

  const { keys: envKeys } = loadEnvKeys();
  const domainFolders = buildDomainFolders(workflows, existingByName, envKeys);
  const item = [];
  if (loginFolderRaw) item.push(normalizeLoginFolder(loginFolderRaw));
  item.push(...domainFolders);
  if (certFolder) item.push(certFolder);

  const dupPaths = workflows.reduce((acc, w) => {
    acc[w.webhookPath] = acc[w.webhookPath] || [];
    acc[w.webhookPath].push(w.name);
    return acc;
  }, {});
  const dups = Object.entries(dupPaths).filter(([, a]) => a.length > 1);
  if (dups.length) {
    console.warn("AVISO — paths de webhook duplicados:", dups);
  }

  const collection = {
    info: {
      ...existing.info,
      name: COLLECTION_NAME,
      description: COLLECTION_DESCRIPTION,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: existing.auth,
    variable: [],
    item,
  };

  collection.variable = buildExplicitCollectionVariables({
    workflows: listWorkflowVariableSources(),
    collection,
  });

  let requestCount = 0;
  const walk = (items) => {
    for (const it of items || []) {
      if (it.request) requestCount++;
      if (it.item) walk(it.item);
    }
  };
  walk(collection.item);

  writeCollectionJson(collection);
  console.log("OK —", collectionOutputPaths().join(" + "));
  console.log("Workflows ONR:", names.length);
  console.log("Requests na coleção:", requestCount);
  console.log("Variáveis:", collection.variable.length);
  console.log("Pastas:", collection.item.map((i) => i.name).join(", "));
}

main();
