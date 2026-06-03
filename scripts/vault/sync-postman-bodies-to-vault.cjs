#!/usr/bin/env node
/**
 * Sincroniza bodies JSON da coleção postman/onr-webservice-n8n.postman_collection.json
 * para utilizacao/*.md e auth-n8n.md no vault Obsidian (webservice ONR).
 *
 * Bodies vazios na coleção são preenchidos a partir dos workflows n8n (mesma lógica do builder Postman).
 *
 * Uso:
 *   node scripts/vault/sync-postman-bodies-to-vault.cjs
 *   node scripts/vault/sync-postman-bodies-to-vault.cjs --dry-run
 */
const fs = require('fs');
const path = require('path');
const { OP_POSTMAN_REQUEST } = require('./postman-n8n-doc.cjs');

const REPO_ROOT = path.resolve(__dirname, '../..');
const POSTMAN_COLLECTION = path.join(REPO_ROOT, 'postman/onr-webservice-n8n.postman_collection.json');
const WORKFLOWS_DIR = path.join(REPO_ROOT, 'workflows/n8n/extensao-n8n-teste');
const { bodyFromWorkflow, isEmptyJsonBody } = require('../postman/onr-postman-body.cjs');
const VAULT_UTIL = path.join(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault/Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao/utilizacao',
);
const VAULT_AUTH = path.join(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault/Orius/integracoes/registro-imoveis/onr/webservice-wsoficio/automacao/auth-n8n.md',
);

const DRY_RUN = process.argv.includes('--dry-run');
const SKIP_WORKFLOW = /^(CCN|CENSEC|DOI|Parse|SIGEF)/i;

const FILE_TO_OP = {
  'Auth WebService ONR.workflow.ts': 'LoginUsuarioCertificado',
  'Obter XML Solicitacoes V6.workflow.ts': 'ObterXMLSolicitacoes_v6',
  'Devolver Certidao.workflow.ts': 'DevolverCertidao',
};

function workflowFileNameToOp(fileName) {
  if (FILE_TO_OP[fileName]) return FILE_TO_OP[fileName];
  const base = fileName.replace(/\.workflow\.ts$/i, '').trim();
  if (/auth\s*onr/i.test(base)) return 'LoginUsuarioCertificado';
  const parts = base.split(/\s+/);
  let op = '';
  for (let i = 0; i < parts.length; i += 1) {
    const p = parts[i];
    if (p.toUpperCase() === 'V2' && i === parts.length - 1) {
      op += '_V2';
      continue;
    }
    if (/^(PO|OE|AT)$/i.test(p)) {
      op += p.toUpperCase();
      continue;
    }
    op += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }
  return op;
}

function postmanRequestToOp(requestName) {
  if (!requestName || /SOAP/i.test(requestName)) return null;
  if (/Auth ONR.*Login/i.test(requestName) && !/inválido|ausente/i.test(requestName)) {
    return 'LoginUsuarioCertificado';
  }
  if (/CPF inválido|CPF ausente|por protocolo/i.test(requestName)) return null;
  const inv = Object.entries(OP_POSTMAN_REQUEST).find(([, v]) => v === requestName);
  if (inv) return inv[0];
  const base = requestName.split(' — ')[0].trim();
  return workflowFileNameToOp(`${base}.workflow.ts`);
}

function inferDomain(name) {
  if (name.startsWith('Auth')) return 'login';
  if (name.endsWith(' AT') || name.includes(' Titulo') || name.includes(' Status AT')) return 'AT';
  if (name.endsWith(' PO') || name.includes(' Prenotacao') || name.includes('Penhora')) return 'PO';
  if (/\sOE(\s| V\d|$)/.test(name) || name.endsWith(' OE') || name.includes('Instituicoes') || name.includes('Cartorios'))
    return 'OE';
  if (name.includes('Certidao') || name.includes('XML Solicitacoes')) return 'certidoes';
  return 'AT';
}

function buildOpToWorkflowMap() {
  const map = new Map();
  for (const f of fs.readdirSync(WORKFLOWS_DIR)) {
    if (!f.endsWith('.workflow.ts') || SKIP_WORKFLOW.test(f)) continue;
    const op = workflowFileNameToOp(f);
    map.set(op, f.replace('.workflow.ts', ''));
  }
  return map;
}

function walkPostmanItems(items, out) {
  for (const item of items || []) {
    if (item.item) {
      walkPostmanItems(item.item, out);
      continue;
    }
    if (!item.request?.body?.raw) continue;
    const raw = item.request.body.raw;
    if (!raw.trim().startsWith('{')) continue;
    const op = postmanRequestToOp(item.name);
    if (!op) continue;
    out.push({ requestName: item.name, op, raw });
  }
}

function resolveBody(row, opToWorkflow) {
  if (!isEmptyJsonBody(row.raw)) {
    return { body: row.raw.trim(), source: 'postman' };
  }
  const wfName =
    opToWorkflow.get(row.op) || row.requestName.split(' — ')[0];
  const fromWf = wfName ? bodyFromWorkflow(wfName) : null;
  if (fromWf && !isEmptyJsonBody(fromWf)) {
    return { body: fromWf.trim(), source: 'workflow' };
  }
  return null;
}

function buildOpBodyMap() {
  const collection = JSON.parse(fs.readFileSync(POSTMAN_COLLECTION, 'utf8'));
  const extracted = [];
  walkPostmanItems(collection.item, extracted);
  const opToWorkflow = buildOpToWorkflowMap();
  const byOp = new Map();

  for (const row of extracted) {
    const resolved = resolveBody(row, opToWorkflow);
    if (!resolved) continue;
    const prev = byOp.get(row.op);
    if (!prev || prev.source !== 'postman') {
      byOp.set(row.op, {
        body: resolved.body,
        requestName: row.requestName,
        source: resolved.source,
      });
    }
  }
  return byOp;
}

function bodiesEqual(a, b) {
  return a.replace(/\s+/g, '') === b.replace(/\s+/g, '');
}

function updateJsonExample(content, newBody) {
  const marker = /\*\*Exemplo \([^)]+\):\*\*\s*\n\n```json\n([\s\S]*?)```/;
  const m = content.match(marker);
  if (!m) return { content, updated: false };
  if (bodiesEqual(m[1].trim(), newBody.trim())) return { content, updated: false };
  const newContent = content.replace(marker, `**Exemplo (raw JSON):**\n\n\`\`\`json\n${newBody.trim()}\n\`\`\``);
  return { content: newContent, updated: true };
}

function touchFrontmatterDate(content) {
  const today = new Date().toISOString().slice(0, 10);
  if (/^atualizado:/m.test(content)) {
    return content.replace(/^atualizado:.*$/m, `atualizado: ${today}`);
  }
  return content.replace(/^---\n/, `---\natualizado: ${today}\n`);
}

function main() {
  if (!fs.existsSync(VAULT_UTIL)) {
    console.error('Vault utilizacao não encontrado:', VAULT_UTIL);
    process.exit(1);
  }
  if (!fs.existsSync(POSTMAN_COLLECTION)) {
    console.error('Coleção não encontrada:', POSTMAN_COLLECTION);
    process.exit(1);
  }

  const byOp = buildOpBodyMap();
  let updated = 0;
  let skipped = 0;
  let missing = 0;

  for (const file of fs.readdirSync(VAULT_UTIL).filter((f) => f.endsWith('.md'))) {
    const op = file.replace(/\.md$/, '');
    const meta = byOp.get(op);
    if (!meta) {
      missing += 1;
      continue;
    }
    const filePath = path.join(VAULT_UTIL, file);
    let content = fs.readFileSync(filePath, 'utf8');
    const result = updateJsonExample(content, meta.body);
    if (result.updated) {
      content = touchFrontmatterDate(result.content);
      if (!DRY_RUN) fs.writeFileSync(filePath, content, 'utf8');
      console.log(`OK ${op} ← ${meta.requestName} [${meta.source}]`);
      updated += 1;
    } else {
      skipped += 1;
    }
  }

  const loginMeta = byOp.get('LoginUsuarioCertificado');
  if (loginMeta && fs.existsSync(VAULT_AUTH)) {
    let content = fs.readFileSync(VAULT_AUTH, 'utf8');
    const result = updateJsonExample(content, loginMeta.body);
    if (result.updated) {
      content = touchFrontmatterDate(result.content);
      if (!DRY_RUN) fs.writeFileSync(VAULT_AUTH, content, 'utf8');
      console.log(`OK auth-n8n.md ← ${loginMeta.requestName} [${loginMeta.source}]`);
      updated += 1;
    }
  }

  console.log(
    `\n${DRY_RUN ? '[dry-run] ' : ''}Atualizados: ${updated} · Sem mudança: ${skipped} · Ops sem body na coleção: ${missing} · Mapeados: ${byOp.size}`,
  );
}

main();
