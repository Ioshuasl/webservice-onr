/**
 * Gera registro-imoveis/batch-progress.md — painel operacional para IA (padrão codigo-normas).
 * Sincroniza batch + plan + runner + notas existentes no Obsidian Vault.
 */
const fs = require('fs');
const path = require('path');
const { VAULT_ROOT, DELPHI_PRODUCTS, CODE_ROOT } = require('./delphi-batch-paths.cjs');
const {
  loadEcosystemState,
  loadBatchState,
  computeCoverageReport,
} = require('./delphi-triage-lib.cjs');
const { loadRiPlan } = require('./delphi-plan-lib.cjs');
const {
  runnerStateFile,
  runnerNextJobsFile,
  riPlanFile,
} = require('./delphi-runner-paths.cjs');

const REPO_ROOT = path.join(__dirname, '..');

function shortPath(fileKey, productPath) {
  const p = fileKey.replace(/\\/g, '/');
  const prefix = `${productPath}/`;
  return p.startsWith(prefix) ? p.slice(prefix.length) : p;
}

function loadJsonSafe(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function vaultAbs(vaultRel) {
  return path.join(VAULT_ROOT, vaultRel.replace(/\//g, path.sep));
}

function countVaultDirMd(vaultHub, vaultKey) {
  if (!vaultKey) return 0;
  const dir = vaultAbs(`${vaultHub}/${vaultKey}`);
  if (!fs.existsSync(dir)) return 0;
  let n = 0;
  try {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (ent.isFile() && ent.name.endsWith('.md')) n++;
    }
  } catch {
    return 0;
  }
  return n;
}

function countVaultSync(fileState) {
  const result = {
    actionable: 0,
    done_batch: 0,
    notes_on_disk: 0,
    validated: 0,
    missing_on_disk: [],
  };

  if (!fileState) return result;

  if (fileState.artifact === 'dfm') {
    for (const [handler, ev] of Object.entries(fileState.events || {})) {
      if (ev.status === 'skip' || ev.analyze_action === 'skip') continue;
      result.actionable++;
      if (ev.status === 'done') result.done_batch++;
      if (ev.status === 'done' && ev.validation_pass === true) result.validated++;
      if (ev.vault_path && fs.existsSync(vaultAbs(ev.vault_path))) {
        result.notes_on_disk++;
      } else if (ev.status === 'done' && ev.vault_path) {
        result.missing_on_disk.push(handler);
      }
    }
    return result;
  }

  for (const [name, sym] of Object.entries(fileState.symbols || {})) {
    if (sym.status === 'skip' || sym.analyze_action === 'skip' || sym.analyze_action === 'skip_analyze') {
      continue;
    }
    result.actionable++;
    if (sym.status === 'done') result.done_batch++;
    if (sym.status === 'done' && sym.validation_pass === true) result.validated++;
    if (sym.vault_path && fs.existsSync(vaultAbs(sym.vault_path))) {
      result.notes_on_disk++;
    } else if (sym.status === 'done' && sym.vault_path) {
      result.missing_on_disk.push(name);
    }
  }

  return result;
}

function resolveFileProgressStatus(fileState, planFile) {
  if (!fileState) {
    if (planFile?.pipeline_status === 'await_index') return 'pendente';
    return 'pendente';
  }
  if (fileState.index_status !== 'done') return 'pendente';
  if (fileState.analyze_status === 'done') {
    const remaining = planFile?.tasks?.remaining ?? 0;
    if (remaining > 0) return 'em_progresso';
    return 'concluido';
  }
  if (fileState.analyze_status === 'partial') return 'em_progresso';
  const pending = fileState.symbols_pending || fileState.events_pending || 0;
  if (pending > 0) return 'em_progresso';
  return 'em_progresso';
}

function deriveVaultKeyFromBatch(fileState, planVaultKey) {
  const paths = [];
  if (fileState?.symbols) {
    for (const sym of Object.values(fileState.symbols)) {
      if (sym.vault_path) paths.push(sym.vault_path);
    }
  }
  if (fileState?.events) {
    for (const ev of Object.values(fileState.events)) {
      if (ev.vault_path) paths.push(ev.vault_path);
    }
  }
  if (paths.length) {
    const rel = paths[0].replace(/\\/g, '/');
    const hubMatch = rel.match(/produtos\/[^/]+\/(.+)\/[^/]+\.md$/);
    if (hubMatch) return hubMatch[1];
  }
  return planVaultKey || '';
}

function progressLabel(status) {
  const map = {
    concluido: 'concluido',
    em_progresso: 'em_progresso',
    pendente: 'pendente',
    await_index: 'pendente',
  };
  return map[status] || status;
}

function formatJobsSummary(runnerNext) {
  if (!runnerNext?.jobs?.length) return '—';
  const types = {};
  for (const j of runnerNext.jobs) {
    types[j.type] = (types[j.type] || 0) + 1;
  }
  const parts = Object.entries(types).map(([t, n]) => `${n}× ${t}`);
  return `${runnerNext.jobs.length} jobs (${parts.join(', ')})`;
}

function buildPlanFileMap(plan) {
  const map = new Map();
  for (const f of plan?.files || []) map.set(f.file_key, f);
  return map;
}

function domainStatusFromFiles(rows) {
  if (rows.every((r) => r.status === 'concluido')) return 'concluido';
  if (rows.some((r) => r.status === 'em_progresso')) return 'em_progresso';
  if (rows.some((r) => r.status === 'concluido')) return 'em_progresso';
  return 'pendente';
}

/**
 * @param {object} ctx
 * @param {object} ctx.plan - ri-plan (opcional se já carregado)
 * @param {object} ctx.profile
 * @param {object} ctx.ecoState
 * @param {object} ctx.batchState
 * @param {object} ctx.runnerState
 * @param {object} ctx.runnerNext
 * @param {object} ctx.coverageReport
 */
function generateBatchProgressMd(ctx) {
  const {
    plan,
    profile,
    ecoState,
    batchState,
    runnerState,
    runnerNext,
    coverageReport,
  } = ctx;

  const productPath = profile.product_path;
  const activeBatchId = batchState?.active_batch_id || plan?.sources?.active_batch_id || '—';
  const batch = activeBatchId && batchState?.batches?.[activeBatchId]
    ? batchState.batches[activeBatchId]
    : null;

  const planFileMap = buildPlanFileMap(plan);
  const metrics = plan?.metrics || {};
  const generatedAt = new Date().toISOString();

  const m1Done = metrics.pas_analyze_done ?? 0;
  const m1Total = metrics.pas_canonical ?? 0;
  const m1Pct = metrics.coverage_pas_pct ?? 0;
  const m3Pct = coverageReport?.totals?.analyze_progress_pct ?? 0;
  const m3Done = coverageReport?.totals?.symbols_done ?? 0;
  const m3Total = coverageReport?.totals?.symbols_tracked ?? 0;

  const domainsDone = (plan?.domains || []).filter((d) => d.status === 'done').length;
  const domainsTotal = (plan?.domains || []).length;

  let vaultNotesTotal = 0;
  let vaultNotesDisk = 0;
  let vaultValidated = 0;

  const batchRows = [];
  if (batch?.files) {
    const order = batch.execution_order || Object.keys(batch.files);
    const seen = new Set();
    for (const fp of order) {
      if (seen.has(fp) || !batch.files[fp]) continue;
      seen.add(fp);
      const fs = batch.files[fp];
      const pf = planFileMap.get(fp);
      const vault = countVaultSync(fs);
      vaultNotesTotal += vault.actionable;
      vaultNotesDisk += vault.notes_on_disk;
      vaultValidated += vault.validated;
      const status = progressLabel(resolveFileProgressStatus(fs, pf));
      const symLabel = fs.artifact === 'dfm'
        ? `${fs.events_done || 0}/${fs.events_total || 0} evt`
        : `${fs.symbols_done || 0}/${fs.symbols_total || 0}`;
      const vaultKey = deriveVaultKeyFromBatch(fs, pf?.vault_key);
      batchRows.push({
        file: shortPath(fp, productPath),
        symbols: symLabel,
        vault: `${vault.notes_on_disk}/${vault.actionable}`,
        validated: `${vault.validated}/${vault.actionable}`,
        status,
        notes: vaultKey || (vault.missing_on_disk.length ? `faltam ${vault.missing_on_disk.length} no vault` : ''),
        fileKey: fp,
        vaultKey,
      });
    }
  }

  const activeFile = runnerState?.active_file || runnerNext?.file || batch?.current_file || null;
  const activeShort = activeFile ? shortPath(activeFile, productPath) : '—';
  const activePlan = activeFile ? planFileMap.get(activeFile) : null;
  const activeBatchFile = activeFile && batch?.files ? batch.files[activeFile] : null;
  const activeVaultKey = runnerNext?.vault_key
    || deriveVaultKeyFromBatch(activeBatchFile, activePlan?.vault_key)
    || '—';

  const productTitle = profile.product_path || 'Delphi';
  const codePath = `${CODE_ROOT}\\${profile.product_path}`;

  const lines = [
    `# Progresso ${productTitle} — destrinchar legado Delphi`,
    '',
    `Fonte máquina: \`scripts/delphi-${profile.product_slug || 'imoveis'}-ri-plan.json\` · Batch: \`${activeBatchId}\``,
    `Vault: \`${profile.vault_hub}\` · Código: \`${codePath}\``,
    `Atualizado: ${generatedAt} · Gerador: \`npm run delphi:build-roadmap-plan:${profile.product_slug || 'imoveis'}\``,
    '',
    `**M1** cobertura .pas: **${m1Done}/${m1Total}** (${m1Pct}%) · **M2** domínios: **${domainsDone}/${domainsTotal}** · **M3** batch ativo: **${m3Done}/${m3Total}** (${m3Pct}%)`,
    `**Vault sincronizado (batch indexado):** ${vaultNotesDisk}/${vaultNotesTotal} notas no disco · ${vaultValidated} validadas`,
    '',
    '## Agora',
    '',
    '| Campo | Valor |',
    '|-------|-------|',
    `| Runner | ${runnerState?.status || '—'} |`,
    `| Domínio | ${runnerState?.active_domain_id || runnerNext?.domain || '—'} |`,
    `| Arquivo | \`${activeShort}\` |`,
    `| Vault key | \`${activeVaultKey}\` |`,
    `| Próximo lote | ${formatJobsSummary(runnerNext)} |`,
    '',
    '## Batch ativo — arquivos indexados',
    '',
    '| # | Arquivo | Símbolos | Notas vault | Validadas | Status | Notas |',
    '|---|---------|----------|-------------|-----------|--------|-------|',
  ];

  batchRows.forEach((row, i) => {
    const mark = row.fileKey === activeFile ? ' ← **ativo**' : '';
    lines.push(
      `| ${i + 1} | \`${row.file}\`${mark} | ${row.symbols} | ${row.vault} | ${row.validated} | ${row.status} | ${row.notes || ''} |`,
    );
  });

  if (!batchRows.length) {
    lines.push('| — | _(nenhum arquivo indexado no batch)_ | — | — | — | — | — |');
  }

  lines.push('', '## Domínios (roadmap)', '');

  const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
  const domainList = Object.values(ecoState?.domains || {}).sort((a, b) => {
    const pa = priorityOrder.indexOf(a.priority);
    const pb = priorityOrder.indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return a.domain_id.localeCompare(b.domain_id);
  });

  for (const domain of domainList) {
    const fileKeys = domain.execution_order || [];
    if (!fileKeys.length) continue;

    const rows = fileKeys.map((fp) => {
      const fs = batch?.files?.[fp];
      const pf = planFileMap.get(fp);
      const status = progressLabel(resolveFileProgressStatus(fs, pf));
      const sym = fs
        ? (fs.artifact === 'dfm'
          ? `${fs.events_done || 0}/${fs.events_total || 0}`
          : `${fs.symbols_done || 0}/${fs.symbols_total || 0}`)
        : '—';
      return {
        file: shortPath(fp, productPath),
        symbols: sym,
        status,
        tasks: pf?.tasks?.remaining ?? (fs ? '—' : null),
        fileKey: fp,
      };
    });

    const dStatus = domainStatusFromFiles(rows);
    const doneCount = rows.filter((r) => r.status === 'concluido').length;
    const nextPending = rows.find((r) => r.status !== 'concluido');

    lines.push(`### ${domain.domain_id} (${domain.priority}) — ${dStatus}`);
    lines.push('');
    lines.push(`_${domain.label}_ · ${doneCount}/${rows.length} arquivos · tasks rest.: ${plan?.domains?.find((d) => d.domain_id === domain.domain_id)?.tasks_remaining ?? '—'}`);
    if (nextPending) lines.push(`Próximo: \`${nextPending.file}\``);
    lines.push('');
    lines.push('| # | Arquivo | Símbolos | Tasks rest. | Status |');
    lines.push('|---|---------|----------|-------------|--------|');

    rows.forEach((row, i) => {
      const mark = row.fileKey === activeFile ? ' ← **ativo**' : '';
      lines.push(
        `| ${i + 1} | \`${row.file}\`${mark} | ${row.symbols} | ${row.tasks ?? '—'} | ${row.status} |`,
      );
    });
    lines.push('');
  }

  lines.push('## Fila plano (próximos 20)', '', '| # | Arquivo | Tasks | Status | Motivo |', '|---|---------|-------|--------|--------|');
  for (const q of (plan?.execution_queue || []).slice(0, 20)) {
    const short = shortPath(q.file_key, productPath);
    lines.push(`| ${q.order} | \`${short}\` | ${q.tasks_remaining ?? '—'} | ${q.pipeline_status} | ${q.reason || ''} |`);
  }
  if (!(plan?.execution_queue || []).length) {
    lines.push('| — | _(fila vazia — regerar plano)_ | — | — | — |');
  }

  lines.push(
    '',
    '---',
    '',
    '**Destino vault:** `' + profile.vault_hub + '/unidades/` · `formularios/` · `frames/`',
    '',
    '**Supervisor:** [`hands-off-supervisor.md`](hands-off-supervisor.md) — @ este arquivo + `runner-next.json`',
    '',
    `**Regenerar:** \`npm run delphi:sync-tree -- --product-slug ${profile.product_slug}\` → \`npm run delphi:build-roadmap-plan:${profile.product_slug}\``,
    '',
    `Plano máquina (runner/scripts): \`scripts/delphi-${profile.product_slug}-ri-plan.json\` · Schema: [\`rc-plan-schema.md\`](rc-plan-schema.md)`,
    '',
  );

  return lines.join('\n');
}

function batchProgressRepoPath(productSlug) {
  return path.join(REPO_ROOT, 'registro-imoveis', 'batch-progress.md');
}

function batchProgressVaultPath(profile) {
  return path.join(
    VAULT_ROOT,
    profile.vault_hub.replace(/\//g, path.sep),
    'batch-progress.md',
  );
}

/**
 * Carrega fontes, gera e grava batch-progress.md (repo + vault opcional).
 */
function writeBatchProgressMd(productSlug, options = {}) {
  const profile = DELPHI_PRODUCTS[productSlug];
  if (!profile) throw new Error(`Slug desconhecido: ${productSlug}`);

  const { plan: planIn } = options;
  const { plan } = planIn ? { plan: planIn } : loadRiPlan(productSlug);
  const { state: ecoState } = loadEcosystemState(productSlug);
  const { state: batchState } = loadBatchState(productSlug);
  const runnerState = loadJsonSafe(runnerStateFile(productSlug));
  const runnerNext = loadJsonSafe(runnerNextJobsFile(productSlug));
  const coverageReport = computeCoverageReport(productSlug);

  const md = generateBatchProgressMd({
    plan,
    profile,
    ecoState,
    batchState,
    runnerState,
    runnerNext,
    coverageReport,
  });

  const repoPath = batchProgressRepoPath(productSlug);
  fs.writeFileSync(repoPath, md, 'utf8');

  let vaultPath = null;
  if (options.syncVault && profile.vault_hub) {
    vaultPath = batchProgressVaultPath(profile);
    fs.mkdirSync(path.dirname(vaultPath), { recursive: true });
    fs.writeFileSync(vaultPath, md, 'utf8');
  }

  return { repoPath, vaultPath, generated_at: new Date().toISOString() };
}

module.exports = {
  generateBatchProgressMd,
  writeBatchProgressMd,
  batchProgressRepoPath,
  batchProgressVaultPath,
  countVaultSync,
  shortPath,
};
