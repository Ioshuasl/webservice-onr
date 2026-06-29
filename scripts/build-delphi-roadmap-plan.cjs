#!/usr/bin/env node
/**
 * Gera ri-plan.json — plano quantitativo hands-off (domínios, tasks, fila, colisões).
 * Integra inventário + ecosystem + batch sem reescrever o runner.
 *
 * Uso:
 *   node scripts/build-delphi-roadmap-plan.cjs --product-slug imoveis
 *   node scripts/build-delphi-roadmap-plan.cjs --product-slug imoveis --sync-vault
 *   node scripts/build-delphi-roadmap-plan.cjs --product-slug imoveis --queue-size 100
 */
const fs = require('fs');
const path = require('path');
const {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
  VENDOR_UNIT_PATTERNS,
} = require('./delphi-batch-paths.cjs');
const {
  loadEcosystemState,
  loadBatchState,
  loadInventario,
  resolveFileTriage,
} = require('./delphi-triage-lib.cjs');

const SCHEMA_VERSION = '1.0.0';
const SPLIT_THRESHOLD = 250;
const SEGMENT_CHUNK = 200;
const TASKS_PARALLEL_MAX = 5;
const DEFAULT_QUEUE_SIZE = 50;

const SOURCE_EXTS = new Set(['.pas', '.dfm', '.dcu']);
const SKIP_DIRS = new Set(['__history', '__recovery']);

const { writeBatchProgressMd } = require('./delphi-batch-progress-md.cjs');

const REPO_ROOT = path.join(__dirname, '..');

function parseArgs(argv) {
  const args = { syncVault: false, queueSize: DEFAULT_QUEUE_SIZE };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--queue-size') args.queueSize = parseInt(argv[++i], 10);
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/build-delphi-roadmap-plan.cjs --product-slug imoveis [opções]

Opções:
  --sync-vault       Grava ri-plan-resumo.md + batch-progress.md no vault
  --queue-size N     Tamanho execution_queue (default ${DEFAULT_QUEUE_SIZE})
`);
}

function isVendorName(name) {
  const base = path.basename(name, path.extname(name));
  return VENDOR_UNIT_PATTERNS.some((re) => re.test(base));
}

function countLines(absPath) {
  try {
    const buf = fs.readFileSync(absPath);
    let n = 0;
    for (let i = 0; i < buf.length; i++) {
      if (buf[i] === 0x0a) n++;
    }
    if (buf.length > 0 && buf[buf.length - 1] !== 0x0a) n++;
    return n;
  } catch {
    return null;
  }
}

function fileBytes(absPath) {
  try {
    return fs.statSync(absPath).size;
  } catch {
    return 0;
  }
}

function categorize(relPath, ext) {
  const base = path.basename(relPath, ext);
  const lower = relPath.replace(/\\/g, '/').toLowerCase();
  if (ext === '.dfm') return 'form';
  if (ext === '.dcu') return 'compiled';
  if (/^dm/i.test(base)) return 'datamodule';
  if (/^frame/i.test(base) || lower.includes('/frame/')) return 'frame';
  if (/^ws/i.test(base) || lower.includes('/ws')) return 'webservice';
  if (/^u[A-Z]/.test(base)) return 'unit';
  if (/c[oó]pia de/i.test(base)) return 'duplicate';
  if (isVendorName(base)) return 'vendor';
  if (lower.includes('dependencias')) return 'dependency';
  if (/^teste$/i.test(base)) return 'harness';
  return 'other';
}

function isT0Path(relPath, triage) {
  if (triage.action === 'skip') return true;
  const n = relPath.replace(/\\/g, '/');
  return (
    /\.old\//i.test(n)
    || /wsEmail\.old/i.test(n)
    || /baguncado/i.test(n)
    || /ultimo feito/i.test(n)
    || /\/dependencias\//i.test(n)
    || /c[oó]pia/i.test(n)
    || /_old\./i.test(n)
  );
}

function parentProjectFolder(relPath) {
  const parts = relPath.replace(/\\/g, '/').split('/');
  if (parts.length < 2) return parts[0] || 'root';
  return parts[parts.length - 2];
}

function deriveVaultKey(relPath, ext, unitName, category) {
  const norm = relPath.replace(/\\/g, '/');
  if (ext === '.dcu') return null;
  if (ext === '.dfm') {
    return `formularios/${unitName}`;
  }
  if (/^teste$/i.test(unitName) && category === 'harness') {
    const parent = parentProjectFolder(norm);
    const slug = parent.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `formularios/teste-${slug}`;
  }
  if (/^dm/i.test(unitName) || /^ws/i.test(unitName) || category === 'datamodule' || category === 'webservice') {
    return `unidades/${unitName}`;
  }
  if (/^frame/i.test(unitName) || category === 'frame') {
    return `frames/${unitName}`;
  }
  return `unidades/${unitName}`;
}

function spanLines(sym) {
  if (!sym?.line_start || !sym?.line_end) return 0;
  return sym.line_end - sym.line_start + 1;
}

function estimateSymbolTasks(sym, splitThreshold, chunkSize) {
  if (!sym) return { estimated: 0, done: 0, breakdown: {} };
  const action = sym.analyze_action || 'full';
  if (action === 'skip' || action === 'skip_analyze' || action === 'skip_alias') {
    return { estimated: 0, done: 0, breakdown: {} };
  }
  if (sym.status === 'skip') {
    return { estimated: 0, done: 0, breakdown: {} };
  }

  const span = spanLines(sym);
  const needsSplit = Boolean(sym.needs_split) || (action === 'full' && span > splitThreshold);
  let unitTasks = 1;
  let kind = action === 'stub' ? 'stub' : 'symbol_full';

  if (needsSplit && action === 'full') {
    unitTasks = Math.max(1, Math.ceil(span / chunkSize));
    kind = 'segment';
  }

  const done =
    sym.status === 'done'
    && sym.validation_pass !== false
    && (!needsSplit || sym.segment_status === 'done' || sym.merge_status === 'done');

  const revalidate = sym.status === 'done' && sym.validation_pass === false;

  if (revalidate) {
    return {
      estimated: 1,
      done: 0,
      remaining: 1,
      breakdown: { revalidate: 1 },
    };
  }

  if (done) {
    return {
      estimated: unitTasks,
      done: unitTasks,
      remaining: 0,
      breakdown: { [kind]: unitTasks },
    };
  }

  return {
    estimated: unitTasks,
    done: 0,
    remaining: unitTasks,
    breakdown: { [kind]: unitTasks },
  };
}

function mergeBreakdown(target, src) {
  for (const [k, v] of Object.entries(src || {})) {
    target[k] = (target[k] || 0) + v;
  }
}

function buildDomainMaps(ecoState) {
  const fileToDomain = new Map();
  const domains = [];

  for (const domain of Object.values(ecoState?.domains || {})) {
    const order = domain.execution_order || [];
    const domainEntry = {
      domain_id: domain.domain_id,
      label: domain.label,
      priority: domain.priority,
      status: domain.status,
      batch_id_recommended: `${ecoState?.product_slug || 'imoveis'}-${domain.domain_id.replace(/^(ri|rc)-/, '')}`,
      files_planned: order.length,
      files_done: 0,
      files_remaining: 0,
      tasks_estimated: 0,
      tasks_done: 0,
      tasks_remaining: 0,
    };
    domains.push(domainEntry);

    order.forEach((fileKey, idx) => {
      fileToDomain.set(fileKey, {
        domain_id: domain.domain_id,
        domain_order: idx + 1,
        priority: domain.priority,
      });
    });
  }

  const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
  domains.sort((a, b) => {
    const pa = priorityOrder.indexOf(a.priority);
    const pb = priorityOrder.indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return a.domain_id.localeCompare(b.domain_id);
  });

  return { fileToDomain, domains };
}

function walkProductFiles(productPath) {
  const absRoot = path.join(CODE_ROOT, productPath);
  const nodes = [];

  function walk(dir, rel = '') {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const ent of entries) {
      const name = ent.name;
      if (ent.isDirectory()) {
        if (SKIP_DIRS.has(name)) continue;
        walk(path.join(dir, name), rel ? `${rel}/${name}` : name);
      } else if (ent.isFile()) {
        const ext = path.extname(name).toLowerCase();
        if (!SOURCE_EXTS.has(ext)) continue;
        const relPath = (rel ? `${rel}/${name}` : name).replace(/\\/g, '/');
        const abs = path.join(dir, name);
        nodes.push({
          relPath,
          ext,
          abs,
          bytes: fileBytes(abs),
          lines: ext === '.dcu' ? null : countLines(abs),
        });
      }
    }
  }

  walk(absRoot);
  nodes.sort((a, b) => a.relPath.localeCompare(b.relPath, 'pt-BR'));
  return nodes;
}

function buildPendingJobs(fileState, splitThreshold) {
  const jobs = [];
  if (!fileState?.symbols) return jobs;

  for (const [symbolName, sym] of Object.entries(fileState.symbols)) {
    if (sym.status !== 'done' && sym.status !== 'pending') continue;
    if (sym.analyze_action === 'skip' || sym.analyze_action === 'skip_analyze') continue;

    if (sym.status === 'done' && sym.validation_pass === false) {
      jobs.push({
        type: 'revalidate',
        symbol: symbolName,
        lines: [sym.line_start, sym.line_end],
        needs_split: false,
        priority: true,
        reason: 'validation_pass false',
      });
      continue;
    }

    if (sym.status === 'done') continue;

    const span = spanLines(sym);
    const needsSplit = sym.needs_split || span > splitThreshold;

    if (needsSplit && sym.segments) {
      for (const [segId, seg] of Object.entries(sym.segments)) {
        if (seg.status === 'done') continue;
        jobs.push({
          type: 'segment',
          symbol: symbolName,
          segment_id: segId,
          lines: [seg.line_start, seg.line_end],
          needs_split: true,
          priority: false,
        });
      }
    } else if (sym.status === 'pending' || !sym.vault_path) {
      jobs.push({
        type: needsSplit ? 'segment' : 'symbol',
        symbol: symbolName,
        lines: [sym.line_start, sym.line_end],
        needs_split: needsSplit,
        priority: false,
      });
    }
  }

  jobs.sort((a, b) => (b.priority ? 1 : 0) - (a.priority ? 1 : 0));
  return jobs;
}

function resolvePipelineStatus(entry) {
  if (entry.tier === 'T0' || entry.action === 'skip') return 't0_skip';
  if (entry.ext === '.dcu') return 't0_skip';
  if (entry.index_status === 'pending' || entry.index_status === 'unknown') return 'await_index';
  if (entry.analyze_status === 'done') return 'done';
  if (entry.analyze_status === 'partial' || entry.tasks?.remaining > 0) return 'in_progress';
  if (entry.index_status === 'done') return 'await_analyze';
  return 'await_index';
}

function generateSummaryMd(plan) {
  const m = plan.metrics;
  const lines = [
    `# RI Plan — resumo (${plan.product_slug})`,
    '',
    `Gerado: ${plan.generated_at} · Schema ${plan.schema_version}`,
    '',
    '## Métricas',
    '',
    '| Métrica | Valor |',
    '|---------|-------|',
    `| Arquivos total | ${m.files_total} |`,
    `| .pas / .dfm / .dcu | ${m.files_by_ext['.pas'] || 0} / ${m.files_by_ext['.dfm'] || 0} / ${m.files_by_ext['.dcu'] || 0} |`,
    `| .pas canônicos | ${m.pas_canonical} |`,
    `| .pas analyze done | ${m.pas_analyze_done} (${m.coverage_pas_pct}%) |`,
    `| Tasks estimadas | ${m.tasks_estimated_total} |`,
    `| Tasks restantes | **${m.tasks_remaining}** |`,
    `| Colisões unit | ${plan.unit_collisions.length} |`,
    '',
    '## Domínios',
    '',
    '| Domínio | Arquivos | Tasks restantes | Status |',
    '|---------|----------|-----------------|--------|',
  ];

  for (const d of plan.domains) {
    lines.push(`| ${d.domain_id} | ${d.files_done}/${d.files_planned} | ${d.tasks_remaining} | ${d.status} |`);
  }

  lines.push('', '## Próximos 15 (execution_queue)', '', '| # | Arquivo | Tasks | Status |', '|---|---------|-------|--------|');
  for (const q of plan.execution_queue.slice(0, 15)) {
    const short = q.file_key.replace(`${plan.product_path}/`, '');
    lines.push(`| ${q.order} | \`${short}\` | ${q.tasks_remaining} | ${q.pipeline_status} |`);
  }

  lines.push('', '---', `Plano completo: \`${plan.plan_file}\` · Schema: [ri-plan-schema.md](../registro-imoveis/ri-plan-schema.md)`);
  return lines.join('\n') + '\n';
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const profile = DELPHI_PRODUCTS[args.productSlug];
  if (!profile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  const { state: ecoState } = loadEcosystemState(args.productSlug);
  const { state: batchState } = loadBatchState(args.productSlug);
  const { data: inventario } = loadInventario(args.productSlug);

  const triageRules = ecoState?.triage_rules || [];
  const { fileToDomain, domains } = buildDomainMaps(ecoState || { domains: {} });

  const activeBatchId = batchState?.active_batch_id || null;
  const batch = activeBatchId && batchState?.batches?.[activeBatchId]
    ? batchState.batches[activeBatchId]
    : null;

  const physical = walkProductFiles(profile.product_path);
  const invByPath = new Map();
  if (inventario?.files) {
    for (const f of inventario.files) {
      invByPath.set(f.path.replace(/\\/g, '/'), f);
    }
  }

  const fileKeysSeen = new Set();
  const files = [];
  const unitPaths = new Map();

  for (const node of physical) {
    const fileKey = `${profile.product_path}/${node.relPath}`;
    fileKeysSeen.add(fileKey);

    const unitName = path.basename(node.relPath, node.ext);
    const category = categorize(node.relPath, node.ext);
    const triage = resolveFileTriage(fileKey, triageRules);
    const domainInfo = fileToDomain.get(fileKey) || null;
    const vaultKey = deriveVaultKey(node.relPath, node.ext, unitName, category);
    const batchFile = batch?.files?.[fileKey] || null;

    if (!unitPaths.has(unitName)) unitPaths.set(unitName, []);
    unitPaths.get(unitName).push({ fileKey, vaultKey });

    const entry = {
      file_key: fileKey,
      rel_path: node.relPath,
      ext: node.ext,
      unit_name: unitName,
      vault_key: vaultKey,
      bytes: node.bytes,
      lines: node.lines ?? invByPath.get(node.relPath)?.lines ?? null,
      category,
      tier: triage.tier,
      action: node.ext === '.dcu' ? 'skip' : triage.action,
      domain_id: domainInfo?.domain_id ?? null,
      domain_order: domainInfo?.domain_order ?? null,
      duplicate_of: null,
      in_batch: Boolean(batchFile),
      index_status: batchFile?.index_status ?? 'unknown',
      analyze_status: batchFile?.analyze_status ?? 'unknown',
      symbols: null,
      tasks: {
        estimated: 0,
        done: 0,
        remaining: 0,
        parallel_max: TASKS_PARALLEL_MAX,
        breakdown: {},
      },
      pending_jobs: [],
    };

    if (node.ext === '.pas' && batchFile?.symbols) {
      const symStats = {
        total: 0,
        done: 0,
        pending: 0,
        skip: 0,
        stub_pending: 0,
        needs_split: 0,
        revalidate: 0,
      };
      const breakdown = {};

      for (const sym of Object.values(batchFile.symbols)) {
        symStats.total++;
        if (sym.status === 'done') symStats.done++;
        else if (sym.status === 'pending') symStats.pending++;
        else if (sym.status === 'skip') symStats.skip++;
        if (sym.analyze_action === 'stub' && sym.status !== 'done') symStats.stub_pending++;
        if (sym.needs_split) symStats.needs_split++;
        if (sym.status === 'done' && sym.validation_pass === false) symStats.revalidate++;

        const est = estimateSymbolTasks(sym, SPLIT_THRESHOLD, SEGMENT_CHUNK);
        entry.tasks.estimated += est.estimated;
        entry.tasks.done += est.done;
        mergeBreakdown(breakdown, est.breakdown);
      }

      entry.tasks.remaining = Math.max(0, entry.tasks.estimated - entry.tasks.done);
      entry.tasks.breakdown = breakdown;
      entry.symbols = symStats;
      entry.pending_jobs = entry.tasks.remaining > 0 ? buildPendingJobs(batchFile, SPLIT_THRESHOLD) : [];
    } else if (node.ext === '.dfm' && batchFile?.events) {
      const events = Object.values(batchFile.events);
      const pending = events.filter((e) => e.status === 'pending').length;
      const doneEv = events.filter((e) => e.status === 'done').length;
      entry.symbols = {
        total: events.length,
        done: doneEv,
        pending,
        skip: events.filter((e) => e.status === 'skip').length,
        events: events.length,
      };
      entry.tasks.estimated = pending;
      entry.tasks.remaining = pending;
      entry.tasks.breakdown = pending ? { event_dfm: pending } : {};
    }

    entry.pipeline_status = resolvePipelineStatus(entry);
    if (isT0Path(node.relPath, triage) || node.ext === '.dcu') {
      entry.pipeline_status = 't0_skip';
      entry.action = 'skip';
      entry.tier = 'T0';
    }

    files.push(entry);
  }

  // Batch files not on disk walk (edge case)
  if (batch?.files) {
    for (const fileKey of Object.keys(batch.files)) {
      if (fileKeysSeen.has(fileKey)) continue;
      const bf = batch.files[fileKey];
      files.push({
        file_key: fileKey,
        rel_path: fileKey.replace(`${profile.product_path}/`, ''),
        ext: bf.artifact === 'dfm' ? '.dfm' : '.pas',
        unit_name: path.basename(fileKey, path.extname(fileKey)),
        vault_key: null,
        bytes: 0,
        lines: null,
        category: 'orphan_batch',
        tier: 'T0',
        action: 'skip',
        domain_id: fileToDomain.get(fileKey)?.domain_id ?? null,
        domain_order: fileToDomain.get(fileKey)?.domain_order ?? null,
        in_batch: true,
        index_status: bf.index_status,
        analyze_status: bf.analyze_status,
        pipeline_status: 't0_skip',
        note: 'orphan_in_batch_only',
        tasks: { estimated: 0, done: 0, remaining: 0, parallel_max: TASKS_PARALLEL_MAX, breakdown: {} },
        pending_jobs: [],
      });
    }
  }

  const unitCollisions = [];
  for (const [unitName, paths] of unitPaths.entries()) {
    if (paths.length < 2) continue;
    const pasPaths = paths.filter((p) => p.fileKey.endsWith('.pas'));
    if (pasPaths.length < 2) continue;
    unitCollisions.push({
      unit_name: unitName,
      paths: pasPaths.map((p) => p.fileKey),
      vault_keys: [...new Set(pasPaths.map((p) => p.vaultKey).filter(Boolean))],
      resolution: 'one_vault_key_per_path',
    });
  }

  // Domain aggregates
  for (const d of domains) {
    const domainFiles = files.filter((f) => f.domain_id === d.domain_id);
    d.files_done = domainFiles.filter((f) => f.analyze_status === 'done').length;
    d.files_remaining = d.files_planned - d.files_done;
    d.tasks_estimated = domainFiles.reduce((s, f) => s + (f.tasks?.estimated || 0), 0);
    d.tasks_done = domainFiles.reduce((s, f) => s + (f.tasks?.done || 0), 0);
    d.tasks_remaining = domainFiles.reduce((s, f) => s + (f.tasks?.remaining || 0), 0);
  }

  const priorityOrder = ['P0', 'P1', 'P2', 'P3'];
  const queueCandidates = files
    .filter((f) => f.domain_id && f.pipeline_status !== 't0_skip' && f.tasks?.remaining > 0)
    .sort((a, b) => {
      const da = fileToDomain.get(a.file_key);
      const db = fileToDomain.get(b.file_key);
      const pa = priorityOrder.indexOf(da?.priority ?? 'P3');
      const pb = priorityOrder.indexOf(db?.priority ?? 'P3');
      if (pa !== pb) return pa - pb;
      if (a.domain_order !== b.domain_order) return (a.domain_order || 999) - (b.domain_order || 999);
      return a.file_key.localeCompare(b.file_key);
    });

  const executionQueue = queueCandidates.slice(0, args.queueSize).map((f, i) => ({
    order: i + 1,
    file_key: f.file_key,
    domain_id: f.domain_id,
    domain_order: f.domain_order,
    tasks_remaining: f.tasks.remaining,
    pipeline_status: f.pipeline_status,
    reason: 'next_in_plan',
  }));

  // Fallback: files in domain awaiting index
  if (executionQueue.length < args.queueSize) {
    const seen = new Set(executionQueue.map((q) => q.file_key));
    const awaitIndex = files
      .filter(
        (f) =>
          f.domain_id
          && !seen.has(f.file_key)
          && f.pipeline_status === 'await_index'
          && f.action !== 'skip',
      )
      .sort((a, b) => {
        const pa = priorityOrder.indexOf(fileToDomain.get(a.file_key)?.priority ?? 'P3');
        const pb = priorityOrder.indexOf(fileToDomain.get(b.file_key)?.priority ?? 'P3');
        if (pa !== pb) return pa - pb;
        return (a.domain_order || 999) - (b.domain_order || 999);
      });

    for (const f of awaitIndex) {
      if (executionQueue.length >= args.queueSize) break;
      executionQueue.push({
        order: executionQueue.length + 1,
        file_key: f.file_key,
        domain_id: f.domain_id,
        domain_order: f.domain_order,
        tasks_remaining: null,
        pipeline_status: f.pipeline_status,
        reason: 'needs_index',
      });
      seen.add(f.file_key);
    }
  }

  const filesByExt = { '.pas': 0, '.dfm': 0, '.dcu': 0 };
  for (const f of files) {
    filesByExt[f.ext] = (filesByExt[f.ext] || 0) + 1;
  }

  const pasCanonical = files.filter(
    (f) => f.ext === '.pas' && f.tier !== 'T0' && f.action !== 'skip' && f.category !== 'vendor',
  );
  const pasAnalyzeDone = pasCanonical.filter((f) => f.analyze_status === 'done').length;

  const metrics = {
    files_total: files.length,
    files_by_ext: filesByExt,
    files_t0_skip: files.filter((f) => f.pipeline_status === 't0_skip').length,
    pas_canonical: pasCanonical.length,
    pas_analyze_done: pasAnalyzeDone,
    tasks_estimated_total: files.reduce((s, f) => s + (f.tasks?.estimated || 0), 0),
    tasks_done: files.reduce((s, f) => s + (f.tasks?.done || 0), 0),
    tasks_remaining: files.reduce((s, f) => s + (f.tasks?.remaining || 0), 0),
    coverage_pas_pct: pasCanonical.length
      ? Math.round((pasAnalyzeDone / pasCanonical.length) * 1000) / 10
      : 0,
    unit_collisions: unitCollisions.length,
    execution_queue_size: executionQueue.length,
  };

  const planFile = `scripts/delphi-${args.productSlug}-ri-plan.json`;
  const plan = {
    schema_version: SCHEMA_VERSION,
    product_slug: args.productSlug,
    product_path: profile.product_path,
    code_root: CODE_ROOT,
    generated_at: new Date().toISOString(),
    plan_file: planFile,
    sources: {
      inventario_vault: inventario
        ? `${profile.vault_hub}/inventario/inventario-fontes.json`
        : null,
      inventario_loaded: Boolean(inventario),
      ecosystem_state: ecoState ? `scripts/delphi-${args.productSlug}-ecosystem-state.json` : null,
      batch_state: batchState ? path.basename(profile.batch_file) : null,
      active_batch_id: activeBatchId,
    },
    pipeline: {
      stages: ['inventory', 'plan', 'triage', 'index', 'analyze', 'validate'],
      tasks_parallel_max: TASKS_PARALLEL_MAX,
      split_threshold_lines: SPLIT_THRESHOLD,
      segment_chunk_lines: SEGMENT_CHUNK,
      require_validation_pass: true,
      task_mode: 'cursor_native',
    },
    metrics,
    domains,
    unit_collisions: unitCollisions,
    execution_queue: executionQueue,
    files,
  };

  const outPath = path.join(__dirname, `delphi-${args.productSlug}-ri-plan.json`);
  fs.writeFileSync(outPath, JSON.stringify(plan, null, 2) + '\n', 'utf8');

  const summaryMd = generateSummaryMd(plan);
  const summaryRepo = path.join(REPO_ROOT, 'registro-imoveis', 'ri-plan-summary.md');
  fs.writeFileSync(summaryRepo, summaryMd, 'utf8');

  const progress = writeBatchProgressMd(args.productSlug, { plan, syncVault: args.syncVault });

  if (args.syncVault && profile.vault_hub) {
    const invDir = path.join(
      VAULT_ROOT,
      profile.vault_hub.replace(/\//g, path.sep),
      'inventario',
    );
    fs.mkdirSync(invDir, { recursive: true });
    fs.writeFileSync(path.join(invDir, 'ri-plan-resumo.md'), summaryMd, 'utf8');
  }

  console.log(JSON.stringify({
    plan: outPath,
    summary: summaryRepo,
    batch_progress: progress.repoPath,
    batch_progress_vault: progress.vaultPath,
    metrics,
    execution_queue_head: executionQueue.slice(0, 5),
    unit_collisions: unitCollisions.length,
  }, null, 2));
}

main();
