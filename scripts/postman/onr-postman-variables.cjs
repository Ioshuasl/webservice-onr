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
  url_servico_matricula_online: "https://hml3-wsoficio.onr.org.br/matriculaonline.asmx",
  matricula_online_data_inicial: "2025-01-01",
  matricula_online_data_final: "2025-01-31",
  matricula_online_id_pedido: "",
  matricula_online_protocolo: "",
  url_servico_intimacoes: "https://hml3-wsoficio.onr.org.br/intimacoes.asmx",
  intimacoes_data_inicial: "2025-01-01",
  intimacoes_data_final: "2025-01-31",
  intimacoes_id_status: "0",
  intimacoes_tipo_data_pesquisa: "P",
  intimacoes_protocolo: "",
  intimacoes_id_pedido: "945040",
  intimacoes_max_registros_por_pagina: "50",
  intimacoes_numero_pagina: "1",
  intimacoes_id_status_mensagem: "0",
  intimacoes_id_filtro: "1",
  intimacoes_assunto: "",
  intimacoes_id_mensagem: "",
  intimacoes_id_intimacao: "",
  intimacoes_mensagem: "",
  intimacoes_url_xml_1: "",
  intimacoes_url_anexo_1: "",
  intimacoes_numero_prenotacao: "",
  intimacoes_data_prenotacao: "",
  intimacoes_vencimento_prenotacao: "",
  intimacoes_valor_prenotacao: "",
  intimacoes_tipo_destinacao_mutuo: "",
  intimacoes_tipo_determinacao_judicial: "",
  intimacoes_valor_servico: "",
  intimacoes_data_pagamento: "",
  intimacoes_valor_pagamento: "",
  intimacoes_id_status_emolumento: "2",
  intimacoes_descricao_emolumento: "",
  intimacoes_valor_emolumento: "",
  intimacoes_id_emolumento: "",
  intimacoes_id_status_pagamento: "0",
  intimacoes_id_status_emolumentos: "0",
  intimacoes_protocolo_pagamento: "",
  intimacoes_nosso_numero: "",
  intimacoes_data_custas_inicial: "2025-01-01",
  intimacoes_data_custas_final: "2025-01-31",
  intimacoes_data_pagamento_inicial: "",
  intimacoes_data_pagamento_final: "",
  url_servico_e_protocolo: "https://hml3-wsoficio.onr.org.br/eprotocolo.asmx",
  E_PROTOCOLO_PROTOCOLO: "",
  E_PROTOCOLO_MAX_ROW_PER_PAGE: "50",
  E_PROTOCOLO_PAGE_NUMBER: "1",
  E_PROTOCOLO_INSTITUICAO: "",
  E_PROTOCOLO_ID_TIPO_SERVICO: "-1",
  E_PROTOCOLO_ID_STATUS: "-1",
  E_PROTOCOLO_DATA_SOLICITACAO_INICIAL: "2025-01-01",
  E_PROTOCOLO_DATA_SOLICITACAO_FINAL: "2025-01-31",
  E_PROTOCOLO_NUMERO_BANCO: "-1",
  E_PROTOCOLO_ID_CONTRATO: "0",
  E_PROTOCOLO_ID_BOLETO: "0",
  E_PROTOCOLO_CONVENIO: "false",
  E_PROTOCOLO_TIPO_DOCUMENTO: "1",
  E_PROTOCOLO_APRESENTANTE_NOME: "",
  E_PROTOCOLO_APRESENTANTE_EMAIL: "",
  E_PROTOCOLO_ENDERECO_VIA: "",
  E_PROTOCOLO_ENDERECO_LOGRADOURO: "",
  E_PROTOCOLO_ENDERECO_NUMERO: "0",
  E_PROTOCOLO_ENDERECO_COMPLEMENTO: "",
  E_PROTOCOLO_ENDERECO_BAIRRO: "",
  E_PROTOCOLO_ENDERECO_UF: "",
  E_PROTOCOLO_ENDERECO_CIDADE: "",
  E_PROTOCOLO_ENDERECO_CEP: "0",
  E_PROTOCOLO_CONTATO_DDD: "",
  E_PROTOCOLO_CONTATO_TELEFONE: "",
  E_PROTOCOLO_NUMERO_PRENOTACAO: "",
  E_PROTOCOLO_DATA_PRENOTACAO: "",
  E_PROTOCOLO_DATA_VENCIMENTO: "",
  E_PROTOCOLO_SENHA_PRENOTACAO: "",
  E_PROTOCOLO_VALOR_CUSTAS: "0",
  E_PROTOCOLO_RESPOSTA: "",
  E_PROTOCOLO_CERTIDAO_AVERBACAO_DESC: "XMLRETORNO",
  E_PROTOCOLO_CERTIDAO_AVERBACAO_URL: "",
  E_PROTOCOLO_EXIGENCIA_FINAL: "false",
  E_PROTOCOLO_ANEXO_NOME: "",
  E_PROTOCOLO_ANEXO_URL: "",
  E_PROTOCOLO_ID_DEPARTAMENTO: "0",
  E_PROTOCOLO_CPF_VINCULADO: "",
  E_PROTOCOLO_DATA_VENCIMENTO_INICIAL: "",
  E_PROTOCOLO_DATA_VENCIMENTO_FINAL: "",
  E_PROTOCOLO_URL_ARQUIVO: "",
  url_servico_comunicacao_municipios: "https://hml3-wsoficio.onr.org.br/ComunicacaoMunicipios.asmx",
  ctp_formato: "1",
  ctp_nome_original_arquivo: "declaracao.json",
  ctp_url_callback: "",
  ctp_id_processo: "",
  ctp_id_status: "",
  ctp_url_para_upload: "",
  onr_login_endpoint: "https://hml3-wsoficio.onr.org.br/login.asmx",
  onr_soap_action_login: "http://tempuri.org/WSOficio/LoginUsuarioCertificado",
  PENHORA_ONLINE_PROTOCOLO: "",
  PENHORA_ONLINE_ID_VARA: "-1",
  PENHORA_ONLINE_ID_TIPO_PEDIDO: "-1",
  PENHORA_ONLINE_ID_STATUS: "-1",
  PENHORA_ONLINE_DATA_SOLICITACAO_INICIAL: "2025-04-01",
  PENHORA_ONLINE_DATA_SOLICITACAO_FINAL: "2025-04-28",
  PENHORA_ONLINE_DATA_RESPOSTA_INICIAL: "",
  PENHORA_ONLINE_DATA_RESPOSTA_FINAL: "",
  PENHORA_ONLINE_ID_PROCESSO: "2642149",
  PENHORA_ONLINE_MAX_ROW_PER_PAGE: "50",
  PENHORA_ONLINE_PAGE_NUMBER: "1",
  n8n_webhook_id_obter_xml_v6: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
  n8n_webhook_id_devolver_certidao: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
  n8n_webhook_id_finalizar_resposta_certidao: "c3d4e5f6-a7b8-4901-c234-567890abcdef",
  n8n_webhook_id_informar_custas_certidao: "d4e5f6a7-b8c9-4012-d345-678901abcdef",
  n8n_webhook_id_get_extrato_xml_ac: "e7f8a9b0-c1d2-4e3f-8a9b-0c1d2e3f4a5b",
  n8n_webhook_id_list_pedidos_ac: "a8b9c0d1-e2f3-4a5b-9c0d-1e2f3a4b5c6d",
  n8n_webhook_id_insert_status: "c6d7e8f9-a0b1-4c2d-3e4f-5a6b7c8d9e0f",
  n8n_webhook_id_update_status: "d8e9f0a1-b2c3-4d5e-8f90-a1b2c3d4e5f6",
  certidoes_protocolo: "",
  certidoes_motivo_devolucao: "Documentação incompleta para emissão da certidão.",
  certidoes_interesse_social: "false",
  certidoes_matriculas: "",
  certidoes_valor_custas: "150.00",
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
  "List Boletos PO": "n8n_webhook_id_list_boletos",
  "List Pedidos Exportacao PO": "n8n_webhook_id_list_pedidos_exportacao",
  "List Pedidos Exportacao PO V2": "n8n_webhook_id_list_pedidos_exportacao_po_v2",
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
  "Finalizar Resposta Certidao": "n8n_webhook_id_finalizar_resposta_certidao",
  "Informar Custas Certidao": "n8n_webhook_id_informar_custas_certidao",
  "Get Extrato XML AC": "n8n_webhook_id_get_extrato_xml_ac",
  "List Pedidos AC": "n8n_webhook_id_list_pedidos_ac",
  "Enviar Anexos Certidao DocID V2": "n8n_webhook_id_enviar_anexos_certidao",
  "Obter XML Solicitacoes Matricula Online": "n8n_webhook_id_obter_xml_matricula_online",
  "Obter XML Solicitacoes V2 Matricula Online": "n8n_webhook_id_obter_xml_matricula_online_v2",
  "Importar Prenotacao IN": "n8n_webhook_id_importar_prenotacao_in",
  "List Pedidos IN": "n8n_webhook_id_list_pedidos_in",
  "Get Detalhes IN V3": "n8n_webhook_id_get_detalhes_in_v3",
  "List Status IN": "n8n_webhook_id_list_status_in",
  "List Mensagens Pedido IN": "n8n_webhook_id_list_mensagens_pedido_in",
  "Get Mensagem IN": "n8n_webhook_id_get_mensagem_in",
  "Adicionar Mensagem IN": "n8n_webhook_id_adicionar_mensagem_in",
  "Get Detalhes IN V2": "n8n_webhook_id_get_detalhes_in_v2",
  "Get Emolumentos IN": "n8n_webhook_id_get_emolumentos_in",
  "Adicionar Emolumento IN": "n8n_webhook_id_adicionar_emolumento_in",
  "Excluir Emolumento IN": "n8n_webhook_id_excluir_emolumento_in",
  "List Pagamentos IN": "n8n_webhook_id_list_pagamentos_in",
  "Importacao Arquivos CTP": "n8n_webhook_id_importacao_arquivos_ctp",
  "Atualizar Status Processo CTP": "n8n_webhook_id_atualizar_status_processo_ctp",
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
