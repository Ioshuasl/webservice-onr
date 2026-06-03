#!/usr/bin/env node
/**
 * Renomeia workflows n8n-as-code para:
 *   [AUTONR-n] (integração) Operacao - Domínio
 *
 * Uso:
 *   node scripts/n8n/rename-workflows-plane-pattern.cjs
 *   node scripts/n8n/rename-workflows-plane-pattern.cjs --dry-run
 *   node scripts/n8n/rename-workflows-plane-pattern.cjs --push
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../..');
const WORKFLOWS_DIR = path.join(REPO_ROOT, 'workflows', 'n8n', 'extensao-n8n-teste');
const REGISTRY_PATH = path.resolve(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault/Meta/integracoes/plane/maps/autonr-work-items.json',
);

const DOMAIN_LABEL = {
  auth: 'Autenticação',
  PO: 'Penhora Online',
  OE: 'Ofício Eletrônico',
  AT: 'Acompanhamento de Títulos',
  AC: 'E-Protocolo',
  IN: 'Intimações',
  certidoes: 'Certidões',
  matricula: 'Matrícula Online',
  CTP: 'CTP',
  CENSEC: 'CENSEC',
  CCN: 'CCN',
  DOI: 'DOI',
  SIGEF: 'SIGEF',
  BDL: 'BD Light',
  geral: 'Geral',
};

const INTEGRATION_LABEL = {
  auth: 'webservice ONR',
  PO: 'webservice ONR',
  OE: 'webservice ONR',
  AT: 'webservice ONR',
  AC: 'webservice ONR',
  IN: 'webservice ONR',
  certidoes: 'webservice ONR',
  matricula: 'webservice ONR',
  CTP: 'webservice ONR',
  BDL: 'webservice ONR',
  geral: 'webservice ONR',
  CENSEC: 'CENSEC',
  CCN: 'CCN',
  DOI: 'DOI',
  SIGEF: 'SIGEF',
};

const OP_DOMAIN_OVERRIDE = {
  LoginUsuarioCertificado: 'auth',
  CENSEC_UploadJSON: 'CENSEC',
  SetPedidoFinalizarPrenotacaoVencida: 'PO',
  DOI_ValidateJSON: 'DOI',
  CCN_Uploads: 'CCN',
  CCN_ImportsGet: 'CCN',
  CCN_ImportsErros: 'CCN',
  ParseMemorialSIGEF: 'SIGEF',
};

const FILE_TO_OP = {
  'Auth WebService ONR.workflow.ts': 'LoginUsuarioCertificado',
  'Obter XML Solicitacoes V6.workflow.ts': 'ObterXMLSolicitacoes_v6',
  'Devolver Certidao.workflow.ts': 'DevolverCertidao',
  'CCN Upload XML.workflow.ts': 'CCN_Uploads',
  'CCN Get Import Status.workflow.ts': 'CCN_ImportsGet',
  'CCN Get Import Erros.workflow.ts': 'CCN_ImportsErros',
  'CENSEC Upload JSON Gateway.workflow.ts': 'CENSEC_UploadJSON',
  'DOI Validate JSON.workflow.ts': 'DOI_ValidateJSON',
  'Parse Memorial SIGEF.workflow.ts': 'ParseMemorialSIGEF',
};

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    push: argv.includes('--push'),
  };
}

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
    if (/^(PO|OE|AT|AC|IN)$/i.test(p)) {
      op += p.toUpperCase();
      continue;
    }
    op += p.charAt(0).toUpperCase() + p.slice(1).toLowerCase();
  }
  return op;
}

function inferModule(op) {
  if (OP_DOMAIN_OVERRIDE[op]) return OP_DOMAIN_OVERRIDE[op];
  if (
    op.includes('Certidao') ||
    /^ObterXMLSolicitacoes_v[456]$/i.test(op) ||
    (op.startsWith('Enviar') && op.includes('Certidao')) ||
    op.startsWith('DevolverCertidao') ||
    op.startsWith('FinalizarRespostaCertidao') ||
    op.startsWith('InformarCustasCertidao')
  ) {
    return 'certidoes';
  }
  if (op === 'ObterXMLSolicitacoes' || op === 'ObterXMLSolicitacoesV2') return 'matricula';
  if (op.endsWith('AC') || /AC_V\d+$/i.test(op)) return 'AC';
  if (op.endsWith('IN') || /IN_V\d+$/i.test(op)) return 'IN';
  if (op.includes('BDL') || op.includes('BDLight')) return 'BDL';
  if (op === 'ImportacaoArquivos' || op === 'AtualizarStatusProcesso') return 'CTP';
  if (op.endsWith('PO') || /PO_v\d+$/i.test(op) || op.includes('ExportacaoPO')) return 'PO';
  if (op.endsWith('OE') || /OE_V\d+$/i.test(op)) return 'OE';
  if (op.endsWith('AT')) return 'AT';
  return 'geral';
}

function buildWorkflowName(planeKey, op) {
  const mod = inferModule(op);
  const integration = INTEGRATION_LABEL[mod] || 'webservice ONR';
  const domain = DOMAIN_LABEL[mod] || DOMAIN_LABEL.geral;
  return `[${planeKey}] (${integration}) ${op} - ${domain}`;
}

function loadRegistry() {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error(`Registry não encontrado: ${REGISTRY_PATH}`);
  }
  const registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
  const byOp = {};
  for (const entry of Object.values(registry.items || {})) {
    byOp[entry.operacao] = entry;
  }
  return byOp;
}

function updateWorkflowName(filePath, newName, dryRun) {
  let content = fs.readFileSync(filePath, 'utf8');
  const re = /(@workflow\(\{[\s\S]*?name:\s*)'([^']*)'/;
  const m = content.match(re);
  if (!m) {
    return { ok: false, reason: 'decorator @workflow name não encontrado' };
  }
  const oldName = m[2];
  if (oldName === newName) {
    return { ok: true, skipped: true, oldName, newName };
  }
  if (!dryRun) {
    content = content.replace(re, `$1'${newName.replace(/'/g, "\\'")}'`);
    fs.writeFileSync(filePath, content, 'utf8');
  }
  return { ok: true, skipped: false, oldName, newName };
}

function main() {
  const { dryRun, push } = parseArgs(process.argv.slice(2));
  const byOp = loadRegistry();

  const files = fs
    .readdirSync(WORKFLOWS_DIR)
    .filter((f) => f.endsWith('.workflow.ts'))
    .sort();

  const results = { updated: [], skipped: [], missing: [], errors: [] };

  for (const file of files) {
    const op = workflowFileNameToOp(file);
    const entry = byOp[op];
    if (!entry?.plane_key) {
      results.missing.push({ file, op });
      continue;
    }

    const newName = buildWorkflowName(entry.plane_key, op);
    const filePath = path.join(WORKFLOWS_DIR, file);
    const r = updateWorkflowName(filePath, newName, dryRun);

    if (!r.ok) {
      results.errors.push({ file, op, ...r });
      continue;
    }
    if (r.skipped) {
      results.skipped.push({ file, op, name: newName });
    } else {
      results.updated.push({ file, op, plane_key: entry.plane_key, oldName: r.oldName, newName: r.newName });
      console.log(`${dryRun ? '[dry-run] ' : ''}${file}`);
      console.log(`  ${r.oldName}`);
      console.log(`  → ${r.newName}\n`);
    }
  }

  console.log(JSON.stringify({ summary: {
    updated: results.updated.length,
    skipped: results.skipped.length,
    missing: results.missing.length,
    errors: results.errors.length,
  }, missing: results.missing, errors: results.errors }, null, 2));

  if (results.missing.length) {
    console.warn('\nSem AUTONR no registry (não renomeados):');
    for (const m of results.missing) console.warn(`  - ${m.file} → ${m.op}`);
  }

  if (push && !dryRun && results.updated.length) {
    console.log('\nEnviando workflows para n8n…');
    for (const u of results.updated) {
      const rel = `workflows/n8n/extensao-n8n-teste/${u.file}`;
      const r = spawnSync('npx', ['--yes', 'n8nac', 'push', rel, '--verify'], {
        cwd: REPO_ROOT,
        encoding: 'utf8',
        shell: true,
        stdio: 'inherit',
      });
      if (r.status !== 0) {
        console.error(`Falha push: ${u.file}`);
      }
    }
  }
}

main();
