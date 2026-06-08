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
  resolvePostmanVar,
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
const { requestDisplayName } = require("./onr-postman-request-names.cjs");
const { stripAutonrPrefix } = require("./onr-postman-autonr-registry.cjs");

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
  protocolo: "E_PROTOCOLO_PROTOCOLO",
  max_registros_por_pagina: "E_PROTOCOLO_MAX_ROW_PER_PAGE",
  numero_pagina: "E_PROTOCOLO_PAGE_NUMBER",
  instituicao: "E_PROTOCOLO_INSTITUICAO",
  id_tipo_servico: "E_PROTOCOLO_ID_TIPO_SERVICO",
  id_status: "E_PROTOCOLO_ID_STATUS",
  data_solicitacao_inicial: "E_PROTOCOLO_DATA_SOLICITACAO_INICIAL",
  data_solicitacao_final: "E_PROTOCOLO_DATA_SOLICITACAO_FINAL",
  numero_banco: "E_PROTOCOLO_NUMERO_BANCO",
  id_contrato: "E_PROTOCOLO_ID_CONTRATO",
  id_processo: "ID_PROCESSO",
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
      "List Boletos PO",
      "List Pedidos Exportacao PO",
      "List Pedidos Exportacao PO V2",
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
  MO: {
    folder: "3.9 Matrícula Online",
    description:
      "Proxies do módulo 3.9 (`matriculaonline.asmx`). Requer `onr_hash` do login.\n\nDocumentação: `webservice-onr/metodos/ObterXMLSolicitacoes.md`.",
    prefix: "MATRICULA_ONLINE_",
    urlVar: "url_servico_matricula_online",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/matriculaonline.asmx",
    order: [
      "Obter XML Solicitacoes V2 Matricula Online",
      "Obter XML Solicitacoes Matricula Online",
    ],
  },
  IN: {
    folder: "3.11 Intimações",
    description:
      "Proxies do módulo 3.11 (`intimacoes.asmx`). Requer `onr_hash` do login.\n\nFase 1: status, listagem, mensagens e detalhe. Encadeamento: List Status IN → List Pedidos IN → List Mensagens Pedido IN → Get Mensagem IN / Get Detalhes IN V3.",
    prefix: "INTIMACOES_",
    urlVar: "url_servico_intimacoes",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/intimacoes.asmx",
    order: [
      "List Status IN",
      "Importar Prenotacao IN",
      "List Pedidos IN",
      "List Mensagens Pedido IN",
      "Get Detalhes IN V3",
      "Get Detalhes IN V2",
      "Get Mensagem IN",
      "Adicionar Mensagem IN",
      "Get Emolumentos IN",
      "Adicionar Emolumento IN",
      "Excluir Emolumento IN",
      "List Pagamentos IN",
    ],
  },
  AC: {
    folder: "3.10 E-Protocolo",
    description:
      "Proxies do módulo 3.10 (`eprotocolo.asmx`). Requer `onr_hash` do login.\n\nConsultas e movimentação de pedidos E-Protocolo.",
    prefix: "E_PROTOCOLO_",
    urlVar: "url_servico_e_protocolo",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx",
    order: ["Get Extrato XML AC", "List Pedidos AC", "Get Pedido AC V3", "Alterar Pedido AC", "Set Prenotacao AC", "Set Custas AC", "Set Prenotacao Exame Calculo AC", "Set Contrato Averbado AC", "Set Contrato Exigencia AC", "Set Contrato Devolvido AC", "List Documentos Repositorio AC", "List Anexos AC", "List Boletos AC", "Set Baixa Boleto AC", "Contrato XML to PDF AC"],
  },
  CTP: {
    folder: "3.12 Comunicação Prefeituras (CTP)",
    description:
      "Proxies do módulo 3.12 (`ComunicacaoMunicipios.asmx`). Requer `onr_hash` do login.\n\n`ImportacaoArquivos` retorna `id_processo` e `url_para_upload` — o upload do arquivo é HTTP direto na URL assinada (fora do SOAP).",
    prefix: "COMUNICACAO_PREFEITURAS_",
    urlVar: "url_servico_comunicacao_municipios",
    defaultUrl: "https://hml3-wsoficio.onr.org.br/ComunicacaoMunicipios.asmx",
    order: ["Importacao Arquivos CTP", "Atualizar Status Processo CTP"],
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

/** Variáveis que podem ficar vazias (filtros opcionais ONR). */
const OPTIONAL_POSTMAN_VARS = new Set([
  "PENHORA_ONLINE_PROTOCOLO",
  "PENHORA_ONLINE_DATA_RESPOSTA_INICIAL",
  "PENHORA_ONLINE_DATA_RESPOSTA_FINAL",
  "ACOMPANHAMENTO_TITULOS_PROTOCOLO",
  "ACOMPANHAMENTO_TITULOS_DATA_STATUS_INICIO",
  "ACOMPANHAMENTO_TITULOS_DATA_STATUS_FINAL",
  "OFICIOS_PROTOCOLO",
  "OFICIOS_DATA_RESPOSTA_INICIAL",
  "OFICIOS_DATA_RESPOSTA_FINAL",
  "ctp_url_callback",
]);

function isOptionalField(f) {
  return Boolean(f.optional || String(f.expr).includes("??"));
}

function requiredVars(wf, domain, envKeys) {
  const req = ["onr_hash"];
  const domainKey = wf.domain || inferBodyDomain(wf.name) || "AT";
  for (const f of wf.fields) {
    if (f.name === "url_servico_onr" || f.name === "hash") continue;
    if (isOptionalField(f)) continue;
    const k = resolvePostmanVar(f.name, domainKey, wf.name, envKeys);
    if (k && k !== "onr_hash" && !req.includes(k) && !OPTIONAL_POSTMAN_VARS.has(k)) {
      req.push(k);
    }
  }
  return req;
}

function prerequestScript(required) {
  const optional = [...OPTIONAL_POSTMAN_VARS];
  return [
    ...GET_VAR_HELPER,
    "function hasVar(key) {",
    "  const fromCollection = pm.collectionVariables.get(key);",
    "  if (fromCollection !== undefined && fromCollection !== null) return true;",
    "  const fromEnv = pm.environment.get(key);",
    "  if (fromEnv !== undefined && fromEnv !== null) return true;",
    "  const fromGlobals = pm.globals.get(key);",
    "  if (fromGlobals !== undefined && fromGlobals !== null) return true;",
    "  const fromVars = pm.variables.get(key);",
    "  return fromVars !== undefined && fromVars !== null;",
    "}",
    `const required = ${JSON.stringify(required)};`,
    `const optional = ${JSON.stringify(optional)};`,
    "const missing = required.filter((k) => {",
    "  if (optional.includes(k)) return !hasVar(k);",
    "  return !getVar(k);",
    "});",
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

function testScriptFor(wf) {
  const base = defaultTestScript();
  if (wf.name === "Importacao Arquivos CTP") {
    return [
      ...base,
      "if (pm.response.code === 200 && pm.response.json().sucesso) {",
      "  const dados = pm.response.json().dados || {};",
      "  if (dados.id_processo) {",
      "    pm.collectionVariables.set('ctp_id_processo', dados.id_processo);",
      "    pm.environment.set('ctp_id_processo', dados.id_processo);",
      "    console.log('ctp_id_processo:', dados.id_processo);",
      "  }",
      "  if (dados.url_para_upload) {",
      "    pm.collectionVariables.set('ctp_url_para_upload', dados.url_para_upload);",
      "    pm.environment.set('ctp_url_para_upload', dados.url_para_upload);",
      "    console.log('ctp_url_para_upload:', dados.url_para_upload);",
      "  }",
      "}",
    ];
  }
  if (wf.name === "Get Pedido AC V3") {
    return [
      ...base,
      "if (pm.response.code === 200 && pm.response.json().sucesso) {",
      "  const d = pm.response.json().dados || {};",
      "  const a = d.dados_apresentante || {};",
      "  const set = (k, v) => { if (v !== undefined && v !== null && String(v).length) { pm.collectionVariables.set(k, String(v)); pm.environment.set(k, String(v)); } };",
      "  if (d.tipo_documento) set('E_PROTOCOLO_TIPO_DOCUMENTO', d.tipo_documento);",
      "  set('E_PROTOCOLO_APRESENTANTE_NOME', a.nome);",
      "  set('E_PROTOCOLO_APRESENTANTE_EMAIL', a.email);",
      "  set('E_PROTOCOLO_ENDERECO_VIA', a.via);",
      "  set('E_PROTOCOLO_ENDERECO_LOGRADOURO', a.endereco);",
      "  if (a.numero !== undefined && a.numero !== '') set('E_PROTOCOLO_ENDERECO_NUMERO', parseInt(a.numero, 10) || 0);",
      "  set('E_PROTOCOLO_ENDERECO_COMPLEMENTO', a.complemento);",
      "  set('E_PROTOCOLO_ENDERECO_BAIRRO', a.bairro);",
      "  set('E_PROTOCOLO_ENDERECO_UF', a.estado);",
      "  set('E_PROTOCOLO_ENDERECO_CIDADE', a.cidade);",
      "  if (a.cep !== undefined && a.cep !== '') set('E_PROTOCOLO_ENDERECO_CEP', parseInt(String(a.cep).replace(/\\D/g, ''), 10) || 0);",
      "  set('E_PROTOCOLO_CONTATO_DDD', a.ddd);",
      "  set('E_PROTOCOLO_CONTATO_TELEFONE', a.telefone);",
      "  set('E_PROTOCOLO_NUMERO_PRENOTACAO', d.prenotacao_numero);",
      "  set('E_PROTOCOLO_DATA_PRENOTACAO', d.prenotacao_data_inclusao);",
      "  set('E_PROTOCOLO_DATA_VENCIMENTO', d.prenotacao_data_vencimento);",
      "  set('E_PROTOCOLO_SENHA_PRENOTACAO', d.prenotacao_senha);",
      "}",
    ];
  }
  if (wf.name === "List Boletos AC") {
    return [
      ...base,
      "if (pm.response.code === 200 && pm.response.json().sucesso) {",
      "  const boletos = (pm.response.json().dados || {}).boletos || [];",
      "  if (boletos.length && boletos[0].id_boleto) {",
      "    pm.collectionVariables.set('E_PROTOCOLO_ID_BOLETO', String(boletos[0].id_boleto));",
      "    pm.environment.set('E_PROTOCOLO_ID_BOLETO', String(boletos[0].id_boleto));",
      "    pm.collectionVariables.set('E_PROTOCOLO_CONVENIO', String(Boolean(boletos[0].convenio)));",
      "    pm.environment.set('E_PROTOCOLO_CONVENIO', String(Boolean(boletos[0].convenio)));",
      "    console.log('E_PROTOCOLO_ID_BOLETO:', boletos[0].id_boleto, 'convenio:', boletos[0].convenio);",
      "  }",
      "}",
    ];
  }
  if (wf.name === "List Pedidos AC") {
    return [
      ...base,
      "if (pm.response.code === 200 && pm.response.json().sucesso) {",
      "  const pedidos = (pm.response.json().dados || {}).pedidos || [];",
      "  if (pedidos.length && pedidos[0].id_contrato) {",
      "    pm.collectionVariables.set('E_PROTOCOLO_ID_CONTRATO', String(pedidos[0].id_contrato));",
      "    pm.environment.set('E_PROTOCOLO_ID_CONTRATO', String(pedidos[0].id_contrato));",
      "    console.log('E_PROTOCOLO_ID_CONTRATO:', pedidos[0].id_contrato);",
      "  }",
      "}",
    ];
  }
  if (wf.name === "Atualizar Status Processo CTP") {
    return [
      ...base,
      "if (pm.response.code === 200 && pm.response.json().sucesso) {",
      "  const dados = pm.response.json().dados || {};",
      "  if (dados.id_status !== undefined && dados.id_status !== '') {",
      "    pm.collectionVariables.set('ctp_id_status', String(dados.id_status));",
      "    pm.environment.set('ctp_id_status', String(dados.id_status));",
      "    console.log('ctp_id_status:', dados.id_status);",
      "  }",
      "}",
    ];
  }
  return base;
}

function makeRequest(wf, domain, existingByName, envKeys) {
  const display = requestDisplayName(wf.name);
  if (existingByName[display]) {
    const copy = JSON.parse(JSON.stringify(existingByName[display]));
    const varKey = webhookVarKey(wf.name);
    const required = requiredVars(wf, domain, envKeys);
    copy.request.url = `{{n8n_base_url}}/{{n8n_webhook_mode}}/{{${varKey}}}`;
    if (wf.fields.length) {
      copy.request.body = copy.request.body || { mode: "raw", options: { raw: { language: "json" } } };
      copy.request.body.raw = buildBodyRaw(wf, domain, envKeys);
    }
    copy.event = copy.event || [];
    const preIdx = copy.event.findIndex((e) => e.listen === "prerequest");
    const pre = { listen: "prerequest", script: { type: "text/javascript", exec: prerequestScript(required) } };
    if (preIdx >= 0) copy.event[preIdx] = pre;
    else copy.event.unshift(pre);
    const testIdx = copy.event.findIndex((e) => e.listen === "test");
    const test = { listen: "test", script: { type: "text/javascript", exec: testScriptFor(wf) } };
    if (testIdx >= 0) copy.event[testIdx] = test;
    else copy.event.push(test);
    return copy;
  }

  const required = requiredVars(wf, domain, envKeys);
  const varKey = webhookVarKey(wf.name);
  return {
    name: display,
    event: [
      { listen: "prerequest", script: { type: "text/javascript", exec: prerequestScript(required) } },
      { listen: "test", script: { type: "text/javascript", exec: testScriptFor(wf) } },
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
    if (it.request) {
      const bare = stripAutonrPrefix(it.name);
      out[bare] = it;
    }
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
  const matFolder = domainFolders.find((i) => i.name.startsWith('3.9'));
  const coreDomainFolders = domainFolders.filter((i) => !i.name.startsWith('3.9'));
  const item = [];
  if (loginFolderRaw) item.push(normalizeLoginFolder(loginFolderRaw));
  item.push(...coreDomainFolders);
  if (certFolder) item.push(certFolder);
  if (matFolder) item.push(matFolder);

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
