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
};

function inferDomain(name) {
  if (name.endsWith(' AT') || name.includes(' Titulo') || name.includes(' Status AT')) return 'AT';
  if (name.endsWith(' PO') || name.includes(' Prenotacao') || name.includes('Penhora')) return 'PO';
  if (/\sOE(\s| V\d|$)/.test(name) || name.endsWith(' OE') || name.includes('Instituicoes') || name.includes('Cartorios'))
    return 'OE';
  if (name.includes('Certidao') || name.includes('XML Solicitacoes')) return 'certidoes';
  if (name.startsWith('Auth')) return 'login';
  return 'AT';
}

function parseWorkflowFields(src) {
  const fields = [];
  const blockJson = src.match(/jsonOutput:\s*`=\{([\s\S]*?)\n\}\s*`,?/);
  if (blockJson) {
    for (const line of blockJson[1].split('\n')) {
      const m = line.trim().match(/^"([^"]+)":\s*(.+?),?\s*$/);
      if (m) fields.push({ name: m[1], expr: m[2].trim() });
    }
    if (fields.length) return fields;
  }
  const blockExpr = src.match(/jsonOutput:\s*`\=\{\{([\s\S]*?)\n\}\}\s*`,?/);
  if (blockExpr) {
    for (const line of blockExpr[1].split('\n')) {
      const m = line.trim().match(/^(\w+):\s*(.+?),?\s*$/);
      if (!m || !m[2].includes('$json.body')) continue;
      const fallback = m[2].includes('??') ? m[2].split('??').pop().trim() : m[2].trim();
      fields.push({ name: m[1], expr: fallback });
    }
  }
  return fields;
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
  DOMAIN_BODY,
};
