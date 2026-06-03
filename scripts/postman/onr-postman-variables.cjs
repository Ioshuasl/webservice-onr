/**
 * Monta o array `variable` da coleção ONR — substituição total a cada build.
 * Fonte: template + extras fixos + webhookId dos workflows + chaves usadas nos requests.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const ENV_TEMPLATE = path.join(ROOT, "postman", "onr-webservice-n8n.postman_environment.template.json");

/** Overrides HML (não vêm do template ou sobrescrevem o template). */
const COLLECTION_VARIABLE_EXTRAS = {
  url_servico_acompanhamento_titulos: "https://hml3-wsoficio.onr.org.br/acompanhamentotitulos.asmx",
  url_servico_penhora_online: "https://hml3-wsoficio.onr.org.br/penhoraonline.asmx",
  url_servico_oficios: "https://hml3-wsoficio.onr.org.br/oficios.asmx",
  url_servico_certidoes: "https://hml3-wsoficio.onr.org.br/Certidoes.asmx",
  onr_login_endpoint: "https://hml3-wsoficio.onr.org.br/login.asmx",
  onr_soap_action_login: "http://tempuri.org/WSOficio/LoginUsuarioCertificado",
  n8n_webhook_id_obter_xml_v6: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
  n8n_webhook_id_devolver_certidao: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
  n8n_webhook_id_insert_status: "c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f",
  n8n_webhook_id_update_status: "d8e9f0a1-b2c3-4d5e-8f90-a1b2c3d4e5f6",
  certidoes_protocolo: "",
  certidoes_motivo_devolucao: "Documentação incompleta para emissão da certidão.",
  certidoes_status_filtro: "1",
  certidoes_data_pedido_de: "2025-01-01",
  certidoes_data_pedido_ate: "2025-01-31",
};

const VAR_IN_BODY = /\{\{([A-Za-z0-9_]+)\}\}/g;

/** Nome do workflow n8n → variável Postman do webhookId. */
const WEBHOOK_VAR_KEY = {
  "Auth WebService ONR": "n8n_webhook_id_auth",
  "List Titulos AT": "n8n_webhook_id_list_titulos",
  "List Status AT": "n8n_webhook_id_list_status",
  "Get Titulo AT": "n8n_webhook_id_get_titulo",
  "Get Status AT": "n8n_webhook_id_get_status",
  "Insert Titulo AT": "n8n_webhook_id_insert_titulo",
  "Update Titulo AT": "n8n_webhook_id_update_titulo",
  "Delete Titulo AT": "n8n_webhook_id_delete_titulo",
  "Insert Status AT": "n8n_webhook_id_insert_status",
  "Update Status AT": "n8n_webhook_id_update_status",
  "List Pedidos PO": "n8n_webhook_id_list_pedidos",
  "Get Pedido PO": "n8n_webhook_id_get_pedido",
  "List Varas PO": "n8n_webhook_id_list_varas",
  "List Pedidos Exportacao PO": "n8n_webhook_id_list_pedidos_exportacao",
  "Set Prenotacao PO": "n8n_webhook_id_set_prenotacao",
  "Set Baixa Boleto PO": "n8n_webhook_id_set_baixa_boleto_po",
  "Set Custas PO": "n8n_webhook_id_set_custas_po",
  "Set Penhora Averbado PO": "n8n_webhook_id_set_penhora_averbado",
  "Set Penhora Exigencia PO": "n8n_webhook_id_set_penhora_exigencia",
  "Set Pedido Pessoa Respondido PO": "n8n_webhook_id_set_pedido_pessoa_respondido_po",
  "Set Pedido Pessoa Devolvido PO": "n8n_webhook_id_set_pedido_pessoa_devolvido",
  "Set Pedido Matricula Respondido PO": "n8n_webhook_id_set_pedido_matricula_respondido",
  "Set Pedido Matricula Devolvido PO": "n8n_webhook_id_set_pedido_matricula_devolvido",
  "Set Pedido Negativa Lote PO": "n8n_webhook_id_set_pedido_negativa_lote_po",
  "Set Pedido Finalizar Prenotacao Vencida": "n8n_webhook_id_set_pedido_finalizar_prenotacao_vencida",
  "List Pedidos OE": "n8n_webhook_id_list_pedidos_oe",
  "List Pedidos OE V2": "n8n_webhook_id_list_pedidos_oe_v2",
  "Get Pedido OE": "n8n_webhook_id_get_pedido_oe",
  "List Instituicoes OE": "n8n_webhook_id_list_instituicoes",
  "Set Pedido Respondido OE": "n8n_webhook_id_set_pedido_respondido",
  "Set Pedido Devolvido OE": "n8n_webhook_id_set_pedido_devolvido",
  "Set Pedido Retransmitido OE": "n8n_webhook_id_set_pedido_retransmitido",
  "Set Pedido Negativa Lote OE": "n8n_webhook_id_set_pedido_negativa_lote_oe",
  "List Cartorios Restransmitir OE": "n8n_webhook_id_list_cartorios_restransmitir",
  "Obter XML Solicitacoes V6": "n8n_webhook_id_obter_xml_v6",
  "Devolver Certidao": "n8n_webhook_id_devolver_certidao",
  "Enviar Anexos Certidao DocID V2": "n8n_webhook_id_enviar_anexos_certidao",
};

function webhookVarKey(workflowName) {
  if (WEBHOOK_VAR_KEY[workflowName]) return WEBHOOK_VAR_KEY[workflowName];
  const slug = workflowName
    .replace(/ AT$| OE$| PO$/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return `n8n_webhook_id_${slug}`;
}

function listWorkflowVariableSources() {
  const dir = path.join(ROOT, "workflows/n8n/extensao-n8n-teste");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".workflow.ts"))
    .map((f) => {
      const name = f.replace(".workflow.ts", "");
      const src = fs.readFileSync(path.join(dir, f), "utf8");
      const idMatch = src.match(/webhookId:\s*'([^']+)'/);
      return {
        name,
        webhookId: idMatch ? idMatch[1] : "",
        webhookVarKey: webhookVarKey(name),
      };
    });
}

function loadEnvTemplate() {
  if (!fs.existsSync(ENV_TEMPLATE)) return { values: [] };
  return JSON.parse(fs.readFileSync(ENV_TEMPLATE, "utf8"));
}

function extractUsedVariableKeys(collection) {
  const used = new Set();
  const walk = (node) => {
    if (!node || typeof node !== "object") return;
    const raw = JSON.stringify(node);
    for (const m of raw.matchAll(VAR_IN_BODY)) used.add(m[1]);
    if (Array.isArray(node)) node.forEach(walk);
    else {
      for (const v of Object.values(node)) walk(v);
    }
  };
  walk(collection.auth);
  walk(collection.item);
  walk(collection.variable);
  return used;
}

/**
 * @param {object} opts
 * @param {Array<{ name: string, webhookId?: string, webhookVarKey?: string }>} opts.workflows
 * @param {object} opts.collection — coleção com `item` (e opcionalmente auth) para varrer {{}}
 */
function buildExplicitCollectionVariables({ workflows = [], collection }) {
  const envTpl = loadEnvTemplate();
  const templateOrder = (envTpl.values || []).map((v) => v.key);
  const templateMap = new Map((envTpl.values || []).map((v) => [v.key, v.value ?? ""]));

  const used = collection ? extractUsedVariableKeys(collection) : new Set();

  const map = new Map();
  for (const key of templateOrder) map.set(key, templateMap.get(key) ?? "");

  for (const [key, value] of Object.entries(COLLECTION_VARIABLE_EXTRAS)) {
    map.set(key, value);
  }

  for (const wf of workflows) {
    const key = wf.webhookVarKey;
    if (key && wf.webhookId) map.set(key, wf.webhookId);
  }

  for (const key of used) {
    if (!map.has(key)) map.set(key, "");
  }

  const ordered = [];
  const seen = new Set();
  for (const key of templateOrder) {
    if (!map.has(key)) continue;
    ordered.push({ key, value: String(map.get(key)), type: "string" });
    seen.add(key);
  }
  const rest = [...map.keys()].filter((k) => !seen.has(k)).sort();
  for (const key of rest) {
    ordered.push({ key, value: String(map.get(key)), type: "string" });
  }

  return ordered;
}

module.exports = {
  COLLECTION_VARIABLE_EXTRAS,
  ENV_TEMPLATE,
  WEBHOOK_VAR_KEY,
  webhookVarKey,
  listWorkflowVariableSources,
  buildExplicitCollectionVariables,
  extractUsedVariableKeys,
};
