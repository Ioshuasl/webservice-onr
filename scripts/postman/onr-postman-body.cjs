/**
 * Geração de body JSON Postman a partir de workflows ONR (normalizar-entrada / jsonOutput).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const WORKFLOWS_DIR = path.join(ROOT, 'workflows/n8n/extensao-n8n-teste');
const ENV_EXAMPLE = path.join(ROOT, '.env.example');

const FIELD_ALIASES = {
  max_registros_por_pagina: 'MAX_ROW_PER_PAGE',
  numero_pagina: 'PAGE_NUMBER',
  data_protocolo_inicio: 'DATA_PROTOCOLO_INICIO',
  data_protocolo_final: 'DATA_PROTOCOLO_FINAL',
  id_tipo_status: 'ID_TIPO_STATUS',
  data_status_inicio: 'DATA_STATUS_INICIO',
  data_status_final: 'DATA_STATUS_FINAL',
  id_titulo: 'ID_TITULO',
  id_status: 'ID_STATUS',
  id_pedido: 'ID_PEDIDO',
  id_processo: 'ID_PROCESSO',
  id_boleto: 'ID_BOLETO',
  valor: 'VALOR',
  valor_custas: 'SET_CUSTAS_VALOR',
  id_vara: 'ID_VARA',
  id_tipo_pedido: 'ID_TIPO_PEDIDO',
  data_solicitacao_inicial: 'DATA_SOLICITACAO_INICIAL',
  data_solicitacao_final: 'DATA_SOLICITACAO_FINAL',
  data_resposta_inicial: 'DATA_RESPOSTA_INICIAL',
  data_resposta_final: 'DATA_RESPOSTA_FINAL',
  id_instituicao: 'ID_INSTITUICAO',
  id_tipo_pesquisa: 'ID_TIPO_PESQUISA',
  numero_prenotacao: 'SET_PRENOTACAO_NUMERO',
  data_prenotacao: 'SET_PRENOTACAO_DATA_PRENOTACAO',
  data_vencimento: 'SET_PRENOTACAO_DATA_VENCIMENTO',
  data_status: 'INSERT_STATUS_DATA_STATUS',
  descricao_status: 'INSERT_STATUS_DESCRICAO_STATUS',
  protocolo: 'PROTOCOLO',
  motivo_devolucao: 'MOTIVO_DEVOLUCAO',
  resposta: 'RESPOSTA',
  negativa: 'NEGATIVA',
  id_cartorio: 'ID_CARTORIO',
  exportado: 'EXPORTADO',
  apresentante: 'APRESENTANTE',
};

const DOMAIN_BODY = {
  AT: { prefix: 'ACOMPANHAMENTO_TITULOS_', urlVar: 'url_servico_acompanhamento_titulos' },
  PO: { prefix: 'PENHORA_ONLINE_', urlVar: 'url_servico_penhora_online' },
  OE: { prefix: 'OFICIOS_', urlVar: 'url_servico_oficios' },
  certidoes: { prefix: 'CERTIDOES_', urlVar: 'url_servico_certidoes' },
  MO: { prefix: 'MATRICULA_ONLINE_', urlVar: 'url_servico_matricula_online' },
  IN: { prefix: 'INTIMACOES_', urlVar: 'url_servico_intimacoes' },
  CTP: { prefix: 'COMUNICACAO_PREFEITURAS_', urlVar: 'url_servico_comunicacao_municipios' },
  AC: { prefix: 'E_PROTOCOLO_', urlVar: 'url_servico_e_protocolo' },
};

/** Variáveis da coleção para E-Protocolo (§ 3.10). */
const AC_FIELD_VARS = {
  protocolo: 'E_PROTOCOLO_PROTOCOLO',
  max_registros_por_pagina: 'E_PROTOCOLO_MAX_ROW_PER_PAGE',
  numero_pagina: 'E_PROTOCOLO_PAGE_NUMBER',
  instituicao: 'E_PROTOCOLO_INSTITUICAO',
  id_tipo_servico: 'E_PROTOCOLO_ID_TIPO_SERVICO',
  id_status: 'E_PROTOCOLO_ID_STATUS',
  data_solicitacao_inicial: 'E_PROTOCOLO_DATA_SOLICITACAO_INICIAL',
  data_solicitacao_final: 'E_PROTOCOLO_DATA_SOLICITACAO_FINAL',
  numero_banco: 'E_PROTOCOLO_NUMERO_BANCO',
  id_contrato: 'E_PROTOCOLO_ID_CONTRATO',
  id_boleto: 'E_PROTOCOLO_ID_BOLETO',
  convenio: 'E_PROTOCOLO_CONVENIO',
  tipo_documento: 'E_PROTOCOLO_TIPO_DOCUMENTO',
  apresentante_nome: 'E_PROTOCOLO_APRESENTANTE_NOME',
  apresentante_email: 'E_PROTOCOLO_APRESENTANTE_EMAIL',
  endereco_via: 'E_PROTOCOLO_ENDERECO_VIA',
  endereco_logradouro: 'E_PROTOCOLO_ENDERECO_LOGRADOURO',
  endereco_numero: 'E_PROTOCOLO_ENDERECO_NUMERO',
  endereco_complemento: 'E_PROTOCOLO_ENDERECO_COMPLEMENTO',
  endereco_bairro: 'E_PROTOCOLO_ENDERECO_BAIRRO',
  endereco_uf: 'E_PROTOCOLO_ENDERECO_UF',
  endereco_cidade: 'E_PROTOCOLO_ENDERECO_CIDADE',
  endereco_cep: 'E_PROTOCOLO_ENDERECO_CEP',
  contato_ddd: 'E_PROTOCOLO_CONTATO_DDD',
  contato_telefone: 'E_PROTOCOLO_CONTATO_TELEFONE',
  numero_prenotacao: 'E_PROTOCOLO_NUMERO_PRENOTACAO',
  data_prenotacao: 'E_PROTOCOLO_DATA_PRENOTACAO',
  data_vencimento: 'E_PROTOCOLO_DATA_VENCIMENTO',
  senha: 'E_PROTOCOLO_SENHA_PRENOTACAO',
  valor_custas: 'E_PROTOCOLO_VALOR_CUSTAS',
  resposta: 'E_PROTOCOLO_RESPOSTA',
  exigencia_final: 'E_PROTOCOLO_EXIGENCIA_FINAL',
  id_departamento: 'E_PROTOCOLO_ID_DEPARTAMENTO',
  cpf_vinculado: 'E_PROTOCOLO_CPF_VINCULADO',
  data_vencimento_inicial: 'E_PROTOCOLO_DATA_VENCIMENTO_INICIAL',
  data_vencimento_final: 'E_PROTOCOLO_DATA_VENCIMENTO_FINAL',
  url_arquivo: 'E_PROTOCOLO_URL_ARQUIVO',
};

function anexosExigenciaBlock() {
  return `  "anexos": [
    {
      "nome": "{{E_PROTOCOLO_ANEXO_NOME}}",
      "url_arquivo": "{{E_PROTOCOLO_ANEXO_URL}}"
    }
  ]`;
}

function certidoesAverbacaoBlock() {
  return `  "certidoes_averbacao": [
    {
      "descricao": "{{E_PROTOCOLO_CERTIDAO_AVERBACAO_DESC}}",
      "url_arquivo": "{{E_PROTOCOLO_CERTIDAO_AVERBACAO_URL}}"
    }
  ]`;
}

/** Variáveis da coleção para Comunicação Prefeituras / CTP (§ 3.12). */
const CTP_FIELD_VARS = {
  formato: 'ctp_formato',
  nome_original_arquivo: 'ctp_nome_original_arquivo',
  url_callback: 'ctp_url_callback',
  id_processo: 'ctp_id_processo',
};

/** Variáveis da coleção para Matrícula Online (§ 3.9). */
const MO_FIELD_VARS = {
  protocolo: 'matricula_online_protocolo',
  data_inicial: 'matricula_online_data_inicial',
  data_final: 'matricula_online_data_final',
  id_pedido: 'matricula_online_id_pedido',
};

/** Variáveis da coleção para Intimações (§ 3.11). */
const IN_FIELD_VARS = {
  protocolo: 'intimacoes_protocolo',
  data_inicial: 'intimacoes_data_inicial',
  data_final: 'intimacoes_data_final',
  id_status: 'intimacoes_id_status',
  tipo_data_pesquisa: 'intimacoes_tipo_data_pesquisa',
  id_pedido: 'intimacoes_id_pedido',
  max_registros_por_pagina: 'intimacoes_max_registros_por_pagina',
  numero_pagina: 'intimacoes_numero_pagina',
  id_status_mensagem: 'intimacoes_id_status_mensagem',
  id_filtro: 'intimacoes_id_filtro',
  assunto: 'intimacoes_assunto',
  id_mensagem: 'intimacoes_id_mensagem',
  id_intimacao: 'intimacoes_id_intimacao',
  mensagem: 'intimacoes_mensagem',
  numero_prenotacao: 'intimacoes_numero_prenotacao',
  data_prenotacao: 'intimacoes_data_prenotacao',
  vencimento_prenotacao: 'intimacoes_vencimento_prenotacao',
  valor_prenotacao: 'intimacoes_valor_prenotacao',
  tipo_destinacao_mutuo: 'intimacoes_tipo_destinacao_mutuo',
  tipo_determinacao_judicial: 'intimacoes_tipo_determinacao_judicial',
  valor_servico: 'intimacoes_valor_servico',
  data_pagamento: 'intimacoes_data_pagamento',
  valor_pagamento: 'intimacoes_valor_pagamento',
  descricao: 'intimacoes_descricao_emolumento',
  valor: 'intimacoes_valor_emolumento',
  id_emolumento: 'intimacoes_id_emolumento',
  id_status_emolumento: 'intimacoes_id_status_emolumento',
  id_status_pagamento: 'intimacoes_id_status_pagamento',
  id_status_emolumentos: 'intimacoes_id_status_emolumentos',
  protocolo_pagamento: 'intimacoes_protocolo_pagamento',
  nosso_numero: 'intimacoes_nosso_numero',
  data_custas_inicial: 'intimacoes_data_custas_inicial',
  data_custas_final: 'intimacoes_data_custas_final',
  data_pagamento_inicial: 'intimacoes_data_pagamento_inicial',
  data_pagamento_final: 'intimacoes_data_pagamento_final',
};

function inferDomain(name) {
  if (name.includes('CTP') || name.includes('Arquivos CTP') || name.includes('Status Processo CTP')) return 'CTP';
  if (name.includes('Matricula Online')) return 'MO';
  if (/\sIN(\s| V\d|$)/.test(name) || name.includes('Intimac') || name.includes('Prenotacao IN')) return 'IN';
  if (name.endsWith(' AC') || /\sAC(\s| V\d|$)/.test(name)) return 'AC';
  if (name.endsWith(' AT') || name.includes(' Titulo') || name.includes(' Status AT')) return 'AT';
  if (name.endsWith(' PO') || name.includes(' PO ') || name.includes(' Prenotacao') || name.includes('Penhora')) return 'PO';
  if (/\sOE(\s| V\d|$)/.test(name) || name.endsWith(' OE') || name.includes('Instituicoes') || name.includes('Cartorios'))
    return 'OE';
  if (name.includes('Certidao') || name.includes('XML Solicitacoes')) return 'certidoes';
  if (name.startsWith('Auth')) return 'login';
  return 'AT';
}

function parseWorkflowFieldsFromCodeNormalizar(src) {
  const block = src.match(/name: 'normalizar-entrada'[\s\S]*?jsCode: `([\s\S]*?)`/);
  if (!block) return [];
  const fields = [];
  for (const line of block[1].split('\n')) {
    const m = line.trim().match(/^(\w+):\s*body\.(\w+)(.*)$/);
    if (!m) continue;
    const requiredFields = new Set(['hash', 'id_processo', 'formato', 'nome_original_arquivo']);
    const optional = m[3].includes('??') && !requiredFields.has(m[1]);
    const numeric = m[1] === 'formato';
    fields.push({
      name: m[1],
      expr: numeric && m[1] === 'formato' ? '1' : "''",
      optional,
    });
  }
  return fields;
}

function parseWorkflowFields(src) {
  const fields = [];
  const blockJson = src.match(/jsonOutput:\s*`=\{([\s\S]*?)\n\}\s*`,?/);
  if (blockJson) {
    for (const line of blockJson[1].split('\n')) {
      const m = line.trim().match(/^"([^"]+)":\s*(.+?),?\s*$/);
      if (m) {
        const expr = m[2].trim();
        fields.push({ name: m[1], expr, optional: expr.includes('??') });
      }
    }
    if (fields.length) return fields;
  }
  const blockExpr = src.match(/jsonOutput:\s*`\=\{\{([\s\S]*?)\n\}\}\s*`,?/);
  if (blockExpr) {
    for (const line of blockExpr[1].split('\n')) {
      const m = line.trim().match(/^(\w+):\s*(.+?),?\s*$/);
      if (!m || !m[2].includes('$json.body')) continue;
      const optional = m[2].includes('??');
      fields.push({ name: m[1], expr: m[2].trim(), optional });
    }
    if (fields.length) return fields;
  }
  return parseWorkflowFieldsFromCodeNormalizar(src);
}

function parseWorkflow(name) {
  const file = path.join(WORKFLOWS_DIR, `${name}.workflow.ts`);
  const src = fs.readFileSync(file, 'utf8');
  return { name, domain: inferDomain(name), fields: parseWorkflowFields(src) };
}

function loadEnvKeys() {
  const keys = new Set();
  if (!fs.existsSync(ENV_EXAMPLE)) return keys;
  for (const line of fs.readFileSync(ENV_EXAMPLE, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z][A-Z0-9_]*)=/);
    if (m) keys.add(m[1]);
  }
  return keys;
}

function operationSegment(workflowName) {
  if (workflowName.startsWith('Set ')) {
    const inner = workflowName.slice(4).replace(/ PO$| OE$/, '');
    return `SET_${inner.replace(/\s+/g, '_').toUpperCase()}`;
  }
  if (workflowName.startsWith('Insert ')) return `INSERT${workflowName.includes('Status') ? '_STATUS' : ''}`;
  if (workflowName.startsWith('Update ')) return `UPDATE${workflowName.includes('Status') ? '_STATUS' : ''}`;
  if (workflowName.startsWith('Delete ')) return 'DELETE';
  if (workflowName.startsWith('List ')) return 'LIST';
  return '';
}

function findEnvVar(field, domainPrefix, workflowName, envKeys) {
  if (field === 'hash') return 'onr_hash';
  if (field === 'url_servico_onr') return null;
  const op = operationSegment(workflowName);
  const alias = FIELD_ALIASES[field] || field.toUpperCase();
  const tries = [];
  if (op) {
    tries.push(`${domainPrefix}${op}_${alias}`);
    tries.push(`${domainPrefix}${alias}`);
  }
  tries.push(`${domainPrefix}${op}_${field.toUpperCase()}`);
  for (const t of tries) if (envKeys.has(t)) return t;
  for (const k of envKeys) {
    if (!k.startsWith(domainPrefix)) continue;
    if (k.endsWith(`_${alias}`) || k.endsWith(`_${field.toUpperCase()}`)) return k;
  }
  return tries.find(Boolean) || `${domainPrefix}${alias}`;
}

function isNumericExpr(expr) {
  const t = String(expr).trim();
  if (t === '[]') return false;
  if (t === "''" || t === '""') return false;
  if (t.startsWith("'") || t.startsWith('"')) return false;
  if (t === 'null' || t === 'true' || t === 'false') return true;
  if (/^-?\d+(\.\d+)?$/.test(t)) return true;
  return !t.includes('"$json.body') && !t.includes('"{{');
}

function certidoesBlock(prefix, wfName, envKeys) {
  const mat = findEnvVar('matricula', prefix, wfName, envKeys);
  const url = findEnvVar('url_arquivo', prefix, wfName, envKeys);
  return `  "certidoes": [
    {
      "matricula": "{{${mat}}}",
      "url_arquivo": "{{${url}}}"
    }
  ]`;
}

function resolvePostmanVar(fieldName, domainKey, workflowName, envKeys) {
  if (domainKey === 'MO' && MO_FIELD_VARS[fieldName]) return MO_FIELD_VARS[fieldName];
  if (domainKey === 'IN' && IN_FIELD_VARS[fieldName]) return IN_FIELD_VARS[fieldName];
  if (domainKey === 'CTP' && CTP_FIELD_VARS[fieldName]) return CTP_FIELD_VARS[fieldName];
  if (domainKey === 'AC' && AC_FIELD_VARS[fieldName]) return AC_FIELD_VARS[fieldName];
  const domain = DOMAIN_BODY[domainKey] || DOMAIN_BODY.AT;
  return findEnvVar(fieldName, domain.prefix, workflowName, envKeys);
}

function buildBodyRaw(wf, domainKey, envKeys) {
  const domain = DOMAIN_BODY[domainKey] || DOMAIN_BODY.AT;
  const lines = [];
  for (const f of wf.fields) {
    if (f.name === 'url_servico_onr') {
      lines.push(`  "url_servico_onr": "{{${domain.urlVar}}}"`);
      continue;
    }
    if (f.name === 'hash') {
      lines.push('  "hash": "{{onr_hash}}"');
      continue;
    }
    if (domainKey === 'MO' && MO_FIELD_VARS[f.name]) {
      lines.push(`  "${f.name}": "{{${MO_FIELD_VARS[f.name]}}}"`);
      continue;
    }
    if (domainKey === 'IN' && IN_FIELD_VARS[f.name]) {
      lines.push(`  "${f.name}": "{{${IN_FIELD_VARS[f.name]}}}"`);
      continue;
    }
    if (domainKey === 'CTP' && CTP_FIELD_VARS[f.name]) {
      const varKey = CTP_FIELD_VARS[f.name];
      if (isNumericExpr(f.expr)) {
        lines.push(`  "${f.name}": {{${varKey}}}`);
      } else {
        lines.push(`  "${f.name}": "{{${varKey}}}"`);
      }
      continue;
    }
    if (domainKey === 'AC' && AC_FIELD_VARS[f.name]) {
      const varKey = AC_FIELD_VARS[f.name];
      const acNumeric = new Set([
        'id_contrato', 'id_departamento', 'tipo_documento', 'endereco_numero', 'endereco_cep', 'valor_custas',
        'id_boleto', 'numero_banco', 'max_registros_por_pagina', 'numero_pagina', 'id_status', 'id_tipo_servico',
      ]);
      if (acNumeric.has(f.name) || f.name === 'convenio' || f.name === 'exigencia_final') {
        lines.push(`  "${f.name}": {{${varKey}}}`);
      } else {
        lines.push(`  "${f.name}": "{{${varKey}}}"`);
      }
      continue;
    }
    if (f.name === 'urls_xml') {
      lines.push('  "urls_xml": ["{{intimacoes_url_xml_1}}"]');
      continue;
    }
    if (f.name === 'urls_anexos') {
      lines.push('  "urls_anexos": ["{{intimacoes_url_anexo_1}}"]');
      continue;
    }
    if (f.name === 'anexos' && (f.expr === '[]' || /\[\s*\]$/.test(f.expr) || f.expr.includes('?? []'))) {
      lines.push(anexosExigenciaBlock());
      continue;
    }
    if (f.name === 'certidoes_averbacao' && (f.expr === '[]' || /\[\s*\]$/.test(f.expr) || f.expr.includes('?? []'))) {
      lines.push(certidoesAverbacaoBlock());
      continue;
    }
    if (f.name === 'certidoes' && (f.expr === '[]' || /\[\s*\]$/.test(f.expr))) {
      lines.push(certidoesBlock(domain.prefix, wf.name, envKeys));
      continue;
    }
    if (f.expr === '[]' && f.name === 'anexos') {
      lines.push('  "anexos": []');
      continue;
    }
    const envKey = findEnvVar(f.name, domain.prefix, wf.name, envKeys);
    if (isNumericExpr(f.expr)) {
      lines.push(`  "${f.name}": {{${envKey}}}`);
    } else {
      lines.push(`  "${f.name}": "{{${envKey}}}"`);
    }
  }
  return `{\n${lines.join(',\n')}\n}`;
}

function bodyFromWorkflow(displayName) {
  const wf = parseWorkflow(displayName);
  if (!wf.fields.length) return null;
  const domainKey = wf.domain === 'login' ? 'AT' : wf.domain || 'AT';
  return buildBodyRaw(wf, domainKey, loadEnvKeys());
}

function isEmptyJsonBody(raw) {
  if (!raw || typeof raw !== 'string') return true;
  const compact = raw.replace(/[\s\n\r]/g, '');
  return compact === '{}' || compact.length < 2;
}

module.exports = {
  WORKFLOWS_DIR,
  parseWorkflow,
  parseWorkflowFields,
  buildBodyRaw,
  bodyFromWorkflow,
  isEmptyJsonBody,
  inferDomain,
  loadEnvKeys,
  findEnvVar,
  resolvePostmanVar,
  DOMAIN_BODY,
  MO_FIELD_VARS,
  IN_FIELD_VARS,
  CTP_FIELD_VARS,
  AC_FIELD_VARS,
};
