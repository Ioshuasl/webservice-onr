#!/usr/bin/env node
/**
 * Baixa JSON nativo de todos os workflows n8n e organiza em projetos-orius/N8N.
 *
 * Uso (a partir da raiz do repo automacoes e testes):
 *   node scripts/n8n/sync-orius-n8n-repo.cjs
 *   node scripts/n8n/sync-orius-n8n-repo.cjs --dry-run
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '../..');
const DEFAULT_ORIUS_N8N = path.resolve(process.env.USERPROFILE || '', 'projetos-orius/N8N');
const VAULT_ENV = path.resolve(
  process.env.USERPROFILE || '',
  'OneDrive/Documentos/Obsidian Vault/env.md',
);

function parseArgs(argv) {
  const names = [];
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--name' && argv[i + 1]) {
      names.push(argv[++i]);
    }
  }
  return {
    dryRun: argv.includes('--dry-run'),
    names: names.length ? names : null,
    mergeManifest: argv.includes('--merge-manifest'),
    outDir: (() => {
      const i = argv.indexOf('--out');
      return i >= 0 && argv[i + 1] ? path.resolve(argv[i + 1]) : DEFAULT_ORIUS_N8N;
    })(),
  };
}

function readEnvFromVault() {
  if (!fs.existsSync(VAULT_ENV)) {
    throw new Error(`env.md não encontrado: ${VAULT_ENV}`);
  }
  const text = fs.readFileSync(VAULT_ENV, 'utf8');
  const env = {};
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^([A-Z0-9_]+)=(.+)$/);
    if (m) env[m[1]] = m[2];
  }
  if (!env.N8N_BASE_URL || !env.N8N_API_KEY) {
    throw new Error('N8N_BASE_URL e N8N_API_KEY são obrigatórios em env.md');
  }
  return env;
}

async function listWorkflows(baseUrl, apiKey) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/workflows?limit=250`, {
    headers: { 'X-N8N-API-KEY': apiKey, Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET /workflows → ${res.status}: ${body.slice(0, 200)}`);
  }
  const data = await res.json();
  const rows = Array.isArray(data) ? data : data.data ?? [];
  return rows.filter((w) => !w.isArchived);
}

function listWorkflowsViaN8nacFallback() {
  const result = spawnSync('npx', ['--yes', 'n8nac', 'list', '--json'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    shell: true,
  });
  const raw = (result.stdout || '') + (result.stderr || '');
  const start = raw.indexOf('[');
  if (start < 0) throw new Error('n8nac list --json não retornou JSON');
  return JSON.parse(raw.slice(start)).filter((w) => !w.isArchived);
}

function resolveFolder(name) {
  if (name === 'Auth WebService ONR') return 'WebService ONR/Auth';
  if (name.startsWith('CCN')) return 'CCN';
  if (name.startsWith('CENSEC')) return 'Censec';
  if (name.startsWith('DOI')) return 'DOI';
  if (/SIGEF|Memorial/i.test(name)) return 'SIGEF';

  if (/\bOE\b| OE$| OE V2$|Restransmitir OE|Instituicoes OE/i.test(name)) {
    return 'WebService ONR/Oficios';
  }
  if (/\bPO\b| PO$|Exportacao PO|Prenotacao Vencida/i.test(name)) {
    return 'WebService ONR/Penhora Online';
  }
  if (/\bAT\b| AT$/.test(name)) {
    return 'WebService ONR/Acompanhamento de titulos';
  }
  if (/Certidao|Obter XML Solicitacoes|XML Solicitacoes/i.test(name)) {
    return 'WebService ONR/Certidoes';
  }
  return '';
}

function sanitizeFilename(name) {
  return `${name}.json`.replace(/[<>:"/\\|?*]/g, '_');
}

/** Campos compatíveis com export nativo do n8n (UI Download). */
function toNativeExport(workflow) {
  const exported = {
    name: workflow.name,
    nodes: workflow.nodes,
    pinData: workflow.pinData ?? {},
    connections: workflow.connections,
    active: workflow.active,
    settings: workflow.settings ?? { executionOrder: 'v1' },
    versionId: workflow.versionId,
    meta: workflow.meta ?? {
      instanceId: workflow.meta?.instanceId ?? undefined,
    },
    id: workflow.id,
    tags: workflow.tags ?? [],
  };

  if (workflow.staticData != null) exported.staticData = workflow.staticData;
  if (workflow.updatedAt) exported.updatedAt = workflow.updatedAt;
  if (typeof workflow.triggerCount === 'number') exported.triggerCount = workflow.triggerCount;

  if (exported.meta && Object.keys(exported.meta).length === 0) {
    delete exported.meta;
  }
  if (exported.meta == null) delete exported.meta;

  return exported;
}

async function fetchWorkflow(baseUrl, apiKey, id) {
  const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/v1/workflows/${id}`, {
    headers: { 'X-N8N-API-KEY': apiKey, Accept: 'application/json' },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GET /workflows/${id} → ${res.status}: ${body.slice(0, 200)}`);
  }
  return res.json();
}

function loadExistingManifest(outDir) {
  const manifestPath = path.join(outDir, 'manifest.json');
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch {
    return null;
  }
}

function mergeManifestEntries(existing, incoming) {
  const byId = new Map((existing?.workflows || []).map((w) => [w.id, w]));
  for (const w of incoming) byId.set(w.id, w);
  return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
}

async function main() {
  const { dryRun, outDir, names, mergeManifest } = parseArgs(process.argv.slice(2));
  const { N8N_BASE_URL, N8N_API_KEY } = readEnvFromVault();
  let workflows;
  try {
    workflows = await listWorkflows(N8N_BASE_URL, N8N_API_KEY);
  } catch {
    console.warn('API list falhou; usando n8nac list --json como fallback…');
    workflows = listWorkflowsViaN8nacFallback();
  }

  if (names) {
    const wanted = new Set(names.map((n) => n.toLowerCase()));
    workflows = workflows.filter((w) => wanted.has((w.name || '').toLowerCase()));
    if (!workflows.length) {
      throw new Error(`Nenhum workflow encontrado para --name: ${names.join(', ')}`);
    }
  }

  console.log(`Instância: ${N8N_BASE_URL}`);
  console.log(`Destino:   ${outDir}`);
  console.log(`Workflows: ${workflows.length}${dryRun ? ' (dry-run)' : ''}\n`);

  const manifest = [];
  const written = [];

  for (const item of workflows) {
    const folder = resolveFolder(item.name);
    const relPath = path.join(folder, sanitizeFilename(item.name));
    const absPath = path.join(outDir, relPath);

    const remote = await fetchWorkflow(N8N_BASE_URL, N8N_API_KEY, item.id);
    const payload = JSON.stringify(toNativeExport(remote), null, 2) + '\n';

    manifest.push({
      id: item.id,
      name: item.name,
      active: item.active,
      folder: folder || '.',
      file: relPath.replace(/\\/g, '/'),
    });

    if (dryRun) {
      console.log(`[dry-run] ${relPath}`);
      continue;
    }

    fs.mkdirSync(path.dirname(absPath), { recursive: true });
    fs.writeFileSync(absPath, payload, 'utf8');
    written.push(relPath);
    console.log(`✓ ${relPath}`);
  }

  if (!dryRun) {
    const manifestPath = path.join(outDir, 'manifest.json');
    const existing = mergeManifest ? loadExistingManifest(outDir) : null;
    const workflowsMerged = mergeManifest
      ? mergeManifestEntries(existing, manifest)
      : manifest;
    fs.writeFileSync(
      manifestPath,
      JSON.stringify(
        {
          syncedAt: new Date().toISOString(),
          instance: N8N_BASE_URL,
          source: 'scripts/n8n/sync-orius-n8n-repo.cjs',
          count: workflowsMerged.length,
          workflows: workflowsMerged,
        },
        null,
        2,
      ) + '\n',
      'utf8',
    );
    console.log(`\nmanifest.json (${workflowsMerged.length} workflows)`);
  }

  return { written, manifest };
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
