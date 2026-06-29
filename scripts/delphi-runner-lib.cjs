/**
 * Runner autônomo — tick, domínios, fila IA, prompts.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { CODE_ROOT, DELPHI_PRODUCTS, VAULT_ROOT } = require('./delphi-batch-paths.cjs');
const {
  loadEcosystemState,
  loadBatchState,
  loadInventario,
  applyTriageToBatch,
  syncEcosystemFileProgress,
  computeCoverageReport,
  formatCoverageMarkdown,
} = require('./delphi-triage-lib.cjs');
const { validateBatchSymbols } = require('./delphi-validate-lib.cjs');
const {
  runnerStateFile,
  runnerNextJobsFile,
  runnerPromptFile,
  DEFAULT_RUNNER_CONFIG,
} = require('./delphi-runner-paths.cjs');
const {
  loadRiPlan,
  buildPlanFileMap,
  resolvePlanHead,
  resolveAIJobs,
  buildRunnerNextPayload,
} = require('./delphi-plan-lib.cjs');
const { writeBatchProgressMd } = require('./delphi-batch-progress-md.cjs');

const SCRIPTS_DIR = __dirname;
const REPO_ROOT = path.join(__dirname, '..');

const PRIORITY_ORDER = ['P0', 'P1', 'P2', 'P3'];

function loadRunnerState(productSlug) {
  const p = runnerStateFile(productSlug);
  if (!fs.existsSync(p)) return { path: p, state: null };
  return { path: p, state: JSON.parse(fs.readFileSync(p, 'utf8')) };
}

function saveRunnerState(productSlug, state) {
  const p = runnerStateFile(productSlug);
  fs.writeFileSync(p, JSON.stringify(state, null, 2) + '\n', 'utf8');
  return p;
}

function initRunnerState(productSlug, config = {}) {
  const state = {
    product_slug: productSlug,
    runner_state_file: `scripts/${path.basename(runnerStateFile(productSlug))}`,
    status: 'running',
    started_at: new Date().toISOString(),
    last_tick_at: null,
    ticks: 0,
    active_domain_id: null,
    active_file: null,
    config: { ...DEFAULT_RUNNER_CONFIG, ...config },
    last_actions: [],
    history: [],
  };
  saveRunnerState(productSlug, state);
  return state;
}

function flushRunnerArtifacts(productSlug, runnerState, actions, dryRun) {
  if (dryRun) return;
  saveRunnerState(productSlug, runnerState);
  try {
    writeBatchProgressMd(productSlug);
  } catch (e) {
    actions.push({ action: 'batch_progress_error', error: e.message });
  }
}

function runNode(script, args, dryRun) {
  const cmd = `node "${path.join(SCRIPTS_DIR, script)}" ${args}`;
  if (dryRun) return { cmd, ok: true };
  try {
    execSync(cmd, { cwd: REPO_ROOT, stdio: 'pipe', encoding: 'utf8' });
    return { cmd, ok: true };
  } catch (e) {
    return { cmd, ok: false, error: e.stderr || e.message };
  }
}

function populateDomainsFromInventario(ecoState, invData) {
  if (!invData?.files) return { populated: false };

  const productPrefix = `${ecoState.product_path}/`;
  const files = invData.files.filter((f) => {
    const p = f.path.replace(/\\/g, '/');
    return (
      p.startsWith(productPrefix)
      || p.startsWith('geral_')
      || p.startsWith('eridf/')
    );
  });

  const normalizePath = (p) => {
    const n = p.replace(/\\/g, '/');
    if (n.startsWith(productPrefix)) return n;
    if (n.startsWith('eridf/')) return `${ecoState.product_path}/${n}`;
    return n;
  };

  const isT0Path = (p) => {
    const n = p.replace(/\\/g, '/');
    return (
      /\.old\//i.test(n)
      || /wsEmail\.old/i.test(n)
      || /baguncado/i.test(n)
      || /ultimo feito/i.test(n)
      || /\/dependencias\//i.test(n)
      || /c[oó]pia/i.test(n)
      || /_old\./i.test(n)
    );
  };

  const pasFiles = files
    .filter((f) => f.ext === '.pas' && !f.vendor && !f.duplicate)
    .map((f) => normalizePath(f.path))
    .filter((p) => !isT0Path(p));

  const dfmFiles = files
    .filter((f) => f.ext === '.dfm' && !f.vendor && !f.duplicate)
    .map((f) => normalizePath(f.path))
    .filter((p) => !isT0Path(p));

  const claimed = new Set();
  for (const d of Object.values(ecoState.domains)) {
    for (const fp of d.execution_order || []) claimed.add(fp);
  }

  const eridf = [...new Set(pasFiles.filter((p) => /\/eridf\//i.test(p)))].sort();
  const onrExtra = pasFiles.filter((p) =>
    /geral_sistemas\/wsgeral\//i.test(p) && /^(dmONR|dmPix|dmOnrPix|dmBoleto|ws)/i.test(path.basename(p)),
  );

  const eridfDomain = ecoState.domains['ri-eridf-prod'] || ecoState.domains['ri-eridf'];
  if (eridfDomain && eridf.length && !eridfDomain.execution_order?.length) {
    eridfDomain.execution_order = eridf.filter((p) => !isT0Path(p));
    eridfDomain.files_total = eridfDomain.execution_order.length;
  }

  const restPas = pasFiles.filter((p) => !claimed.has(p) && !eridf.includes(p)
    && !onrExtra.includes(p)
    && !/dmCNIB/i.test(p)
    && !/dmPedido|\/Pedido\.pas$/i.test(p));

  const restDfm = dfmFiles.filter((p) => {
    if (claimed.has(p)) return false;
    const base = path.basename(p, '.dfm');
    return !['Pedido', 'dmPedido'].includes(base);
  });

  const rest = sortExecutionOrder([...restPas, ...restDfm]);

  const restanteDomain = ecoState.domains['ri-dfm-deferred'] || ecoState.domains['ri-restante'];
  if (restanteDomain && rest.length && !restanteDomain.execution_order?.length) {
    restanteDomain.execution_order = rest.filter((p) => !isT0Path(p));
    restanteDomain.files_total = restanteDomain.execution_order.length;
    restanteDomain.notes = `Auto-populado do inventário (${restanteDomain.files_total} arquivos)`;
  }

  return { populated: true, eridf: eridf.length, restante: rest.length };
}

function sortExecutionOrder(paths) {
  const score = (p) => {
    const b = path.basename(p).toLowerCase();
    if (/^dm/.test(b)) return 0;
    if (/^ws/.test(b) || /\/ws/.test(p)) return 1;
    if (/^frame/.test(b)) return 2;
    if (p.endsWith('.dfm')) return 4;
    return 3;
  };
  return [...paths].sort((a, b) => score(a) - score(b) || a.localeCompare(b));
}

function sortedDomains(ecoState) {
  return Object.values(ecoState.domains || {}).sort((a, b) => {
    const pa = PRIORITY_ORDER.indexOf(a.priority);
    const pb = PRIORITY_ORDER.indexOf(b.priority);
    if (pa !== pb) return pa - pb;
    return a.domain_id.localeCompare(b.domain_id);
  });
}

function resolveActiveDomain(ecoState, runnerState, domainId) {
  if (domainId) return ecoState.domains[domainId] || null;
  if (runnerState?.active_domain_id && ecoState.domains[runnerState.active_domain_id]) {
    const d = ecoState.domains[runnerState.active_domain_id];
    if (d.status !== 'done') return d;
  }
  if (ecoState.active_domain_id && ecoState.domains[ecoState.active_domain_id]?.status !== 'done') {
    return ecoState.domains[ecoState.active_domain_id];
  }
  return sortedDomains(ecoState).find((d) => d.status !== 'done') || null;
}

function resolveTickTarget(ecoState, runnerState, batch, plan, domainId) {
  const planFileMap = buildPlanFileMap(plan);
  const config = runnerState.config;

  if (!domainId && plan) {
    const planHead = resolvePlanHead(plan, batch, isFileComplete, config);
    if (planHead) {
      const domain = ecoState.domains[planHead.domainId];
      if (domain) {
        return {
          domain,
          filePath: planHead.filePath,
          planHead,
          planFileMap,
          queueSource: 'ri-plan',
        };
      }
    }
  }

  const domain = resolveActiveDomain(ecoState, runnerState, domainId);
  if (!domain) return { domain: null, planFileMap, queueSource: 'ecosystem' };

  const filePath = resolveCurrentFile(domain, batch, ecoState, runnerState);
  return {
    domain,
    filePath,
    planHead: null,
    planFileMap,
    queueSource: 'ecosystem',
  };
}

function resolveCurrentFile(domain, batch, ecoState, runnerState) {
  const order = domain.execution_order || [];
  const hint = runnerState?.active_file || domain.current_file;

  if (hint && order.includes(hint)) {
    const fs = batch.files[hint];
    if (!isFileComplete(fs, true)) return hint;
  }

  for (const fp of order) {
    const fs = batch.files[fp];
    if (!fs) return fp;
    if (!isFileComplete(fs, true)) return fp;
    const prog = (ecoState.file_progress || {})[fp];
    if (!prog || prog.analyze_status !== 'done') return fp;
  }
  return null;
}

function isFileComplete(fileState, requireValidation) {
  if (!fileState) return false;
  if (fileState.index_status !== 'done') return false;

  if (fileState.artifact === 'dfm') {
    const events = Object.values(fileState.events || {});
    if (fileState.analyze_action === 'index_only') return true;
    const actionable = events.filter((e) => e.status !== 'skip');
    if (actionable.length === 0) return true;
    const pending = actionable.filter((e) => e.status === 'pending');
    if (pending.length > 0) return false;
    if (requireValidation) {
      return actionable.filter((e) => e.status === 'done').every((e) => e.validation_pass !== false);
    }
    return true;
  }

  const symbols = Object.values(fileState.symbols || {});
  const actionable = symbols.filter(
    (s) => s.status !== 'skip' && s.analyze_action !== 'skip_analyze',
  );
  if (actionable.length === 0) return true;

  const pending = actionable.filter((s) => s.status === 'pending');
  if (pending.length > 0) return false;

  if (requireValidation) {
    const done = actionable.filter((s) => s.status === 'done');
    return done.every((s) => s.validation_pass === true);
  }
  return true;
}

function collectAIJobs(fileState, filePath, config) {
  const jobs = [];

  if (!fileState || fileState.artifact === 'dfm') {
    const events = Object.entries(fileState?.events || {});
    const pending = events
      .filter(([, e]) => e.status === 'pending' && e.analyze_action !== 'skip')
      .sort((a, b) => (b[1].priority ? 1 : 0) - (a[1].priority ? 1 : 0));
    for (const [handler, ev] of pending.slice(0, config.events_per_ai_batch)) {
      jobs.push({
        type: 'event',
        file: filePath,
        handler,
        component: ev.component,
        event: ev.event,
        priority: ev.priority,
        lines: [ev.handler_line_start, ev.handler_line_end],
      });
    }
    return jobs;
  }

  const symbols = Object.entries(fileState.symbols || {});
  const failed = symbols.filter(
    ([, s]) => s.status === 'done' && s.validation_pass === false,
  );
  for (const [name, s] of failed.slice(0, 3)) {
    jobs.push({
      type: 'revalidate',
      file: filePath,
      symbol: name,
      reason: 'validation_pass false',
      lines: [s.line_start, s.line_end],
      priority: true,
    });
  }

  const pendingFull = symbols
    .filter(([, s]) => s.status === 'pending' && s.analyze_action === 'full')
    .sort((a, b) => {
      if (a[1].priority !== b[1].priority) return a[1].priority ? -1 : 1;
      if (a[1].needs_split !== b[1].needs_split) return a[1].needs_split ? -1 : 1;
      return (a[1].line_start || 0) - (b[1].line_start || 0);
    });

  const room = config.symbols_per_ai_batch - jobs.length;
  for (const [name, s] of pendingFull.slice(0, Math.max(0, room))) {
    jobs.push({
      type: s.needs_split ? 'segment' : 'symbol',
      file: filePath,
      symbol: name,
      needs_split: Boolean(s.needs_split),
      lines: [s.line_start, s.line_end],
      priority: Boolean(s.priority),
    });
  }

  const pendingStub = symbols
    .filter(([, s]) => s.status === 'pending' && s.analyze_action === 'stub')
    .slice(0, config.stub_per_ai_batch);
  if (jobs.length < config.symbols_per_ai_batch && pendingStub.length) {
    const stubRoom = Math.min(
      config.stub_per_ai_batch,
      config.symbols_per_ai_batch - jobs.length,
    );
    jobs.push({
      type: 'stub_batch',
      file: filePath,
      symbols: pendingStub.slice(0, stubRoom).map(([n]) => n),
    });
  }

  return jobs;
}

function indexFile(filePath, productSlug, dryRun) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.dfm') {
    return runNode(
      'extract-delphi-dfm.cjs',
      `--file "${filePath}" --product-slug ${productSlug} --sync-vault --update-batch`,
      dryRun,
    );
  }
  return runNode(
    'extract-delphi-symbols.cjs',
    `--file "${filePath}" --product-slug ${productSlug} --sync-vault --update-batch`,
    dryRun,
  );
}

function generatePromptMarkdown(ctx) {
  const { productSlug, domain, filePath, jobs, batchId, coveragePct, vaultKey } = ctx;
  const jobLines = jobs.map((j) => {
    if (j.type === 'stub_batch') {
      return `- **stub_batch** (${j.symbols.length}): ${j.symbols.slice(0, 5).join(', ')}${j.symbols.length > 5 ? '…' : ''}`;
    }
    if (j.type === 'event') {
      return `- **event** \`${j.handler}\` (${j.component}.${j.event}) L${j.lines[0]}–${j.lines[1]}`;
    }
    return `- **${j.type}** \`${j.symbol}\` L${j.lines[0]}–${j.lines[1]}${j.needs_split ? ' ⚠️ needs_split' : ''}${j.reason ? ` — ${j.reason}` : ''}`;
  });

  return `# Runner — próximo lote IA

Gerado: ${new Date().toISOString()}  
Produto: **${productSlug}** · Domínio: **${domain.domain_id}** · Arquivo: \`${filePath}\`  
Batch: \`${batchId}\` · Cobertura parcial: ${coveragePct ?? '—'}%${vaultKey ? ` · Vault: \`${vaultKey}\`` : ''}

## Prompt (copiar no Cursor)

\`\`\`
@.cursor/skills/agent-delphi-domain-orchestrator/SKILL.md
@registro-imoveis/runner-kickoff.md

Execute o lote abaixo (runner autônomo). Ao terminar, rode:
npm run delphi:run-ecosystem -- --product-slug ${productSlug}

Domínio: ${domain.domain_id}
Arquivo: ${filePath}
Batch: ${batchId}

## Jobs (${jobs.length})
${jobLines.join('\n')}

Regras:
- done só com validation_pass: true (npm run delphi:validate-symbol)
- needs_split → split-segments → segment série → merge
- T4 stub → nota mínima (1 parágrafo + dataset)
- Pular símbolos skip / nested_in
\`\`\`

## Jobs JSON

\`scripts/delphi-${productSlug}-runner-next.json\`
`;
}

function runTick(options) {
  const {
    productSlug,
    domainId = null,
    dryRun = false,
    scriptsOnly = false,
    init = false,
    initDomains = false,
    config = {},
  } = options;

  const profile = DELPHI_PRODUCTS[productSlug];
  if (!profile) throw new Error(`Slug desconhecido: ${productSlug}`);

  const eco = loadEcosystemState(productSlug);
  if (!eco.state) throw new Error(`Ecosystem ausente: ${eco.path}`);

  let { state: runnerState } = loadRunnerState(productSlug);
  if (!runnerState || init) {
    runnerState = initRunnerState(productSlug, config);
  } else {
    runnerState.config = { ...DEFAULT_RUNNER_CONFIG, ...runnerState.config, ...config };
  }

  const actions = [];

  if (initDomains) {
    const inv = loadInventario(productSlug);
    const pop = populateDomainsFromInventario(eco.state, inv.data);
    actions.push({ action: 'populate_domains', ...pop });
    if (!dryRun) fs.writeFileSync(eco.path, JSON.stringify(eco.state, null, 2) + '\n', 'utf8');
  }

  const { path: batchPath, state: batchState } = loadBatchState(productSlug);
  if (!batchState) throw new Error(`Batch ausente: ${batchPath}`);

  const batchId = batchState.active_batch_id;
  let batch = batchState.batches[batchId];
  if (!batch) throw new Error(`Batch ativo inválido: ${batchId}`);

  const { path: planPath, plan: riPlan, error: planError } = loadRiPlan(productSlug);
  if (planError) {
    actions.push({ action: 'plan_load_error', path: planPath, error: planError });
  }

  const {
    domain,
    filePath: planFilePath,
    planHead,
    planFileMap,
    queueSource,
  } = resolveTickTarget(eco.state, runnerState, batch, riPlan, domainId);

  if (!domain) {
    runnerState.status = 'complete';
    runnerState.last_tick_at = new Date().toISOString();
    flushRunnerArtifacts(productSlug, runnerState, actions, dryRun);
    return { status: 'complete', message: 'Todos os domínios concluídos', actions };
  }

  eco.state.active_domain_id = domain.domain_id;
  domain.status = domain.status === 'pending' ? 'in_progress' : domain.status;
  runnerState.active_domain_id = domain.domain_id;

  const filePath = planFilePath;
  if (planHead) {
    actions.push({
      action: 'plan_queue',
      source: queueSource,
      file: filePath,
      domain: domain.domain_id,
      reason: planHead.reason,
      plan_generated_at: riPlan?.generated_at ?? null,
    });
  }

  if (!filePath) {
    domain.status = 'done';
    if (runnerState.config.auto_grafo_on_domain_complete) {
      const g = runNode(
        'build-delphi-grafo.cjs',
        `--product-slug ${productSlug} --sync-vault`,
        dryRun,
      );
      actions.push({ action: 'build_grafo', ...g });
    }
    actions.push({ action: 'domain_complete', domain: domain.domain_id });
    runnerState.active_file = null;
    runnerState.last_tick_at = new Date().toISOString();
    runnerState.ticks++;
    if (!dryRun) {
      fs.writeFileSync(eco.path, JSON.stringify(eco.state, null, 2) + '\n', 'utf8');
    }
    flushRunnerArtifacts(productSlug, runnerState, actions, dryRun);
    return { status: 'domain_complete', domain: domain.domain_id, actions };
  }

  domain.current_file = filePath;
  runnerState.active_file = filePath;
  let fileState = batch.files[filePath];

  if (!fileState || fileState.index_status !== 'done') {
    const abs = path.join(CODE_ROOT, filePath);
    if (!fs.existsSync(abs)) {
      return { status: 'error', error: `Arquivo não encontrado: ${abs}`, actions };
    }
    const idx = indexFile(filePath, productSlug, dryRun);
    actions.push({ action: 'index', file: filePath, ...idx });
    if (!dryRun && idx.ok) {
      const reloaded = loadBatchState(productSlug).state;
      batchState.batches = reloaded.batches;
      batch = batchState.batches[batchId];
      fileState = batch.files[filePath];
    }
  }

  if (!dryRun && fileState) {
    applyTriageToBatch(batchState, {
      productSlug,
      batchId,
      fileFilter: filePath,
      dryRun: false,
    });
    actions.push({ action: 'triage', file: filePath });
    fileState = batchState.batches[batchId].files[filePath];
  }

  if (!dryRun && fileState && runnerState.config.auto_validate) {
    if (fileState.artifact !== 'dfm' && fileState.symbols) {
      const hasDone = Object.values(fileState.symbols).some((s) => s.status === 'done');
      if (hasDone) {
        validateBatchSymbols(batchState, {
          productSlug,
          fileFilter: filePath,
          updateBatch: true,
          batchId,
          batchPath,
        });
        actions.push({ action: 'validate', file: filePath });
        fileState = batchState.batches[batchId].files[filePath];
      }
    }
  }

  if (!dryRun) {
    syncEcosystemFileProgress(eco.state, batchState.batches[batchId], batchId);
    fs.writeFileSync(batchPath, JSON.stringify(batchState, null, 2) + '\n', 'utf8');
    fs.writeFileSync(eco.path, JSON.stringify(eco.state, null, 2) + '\n', 'utf8');
  }

  if (runnerState.config.auto_coverage_each_tick && !dryRun) {
    const report = computeCoverageReport(productSlug);
    const hub = path.join(VAULT_ROOT, profile.vault_hub.replace(/\//g, path.sep));
    fs.writeFileSync(
      path.join(hub, '00-cobertura.md'),
      formatCoverageMarkdown(report),
      'utf8',
    );
    actions.push({ action: 'coverage', pct: report.totals.analyze_progress_pct });
  }

  const planFileEntry = planFileMap.get(filePath) || null;
  const { jobs, source: jobSource } = resolveAIJobs(
    planFileEntry,
    fileState,
    filePath,
    runnerState.config,
    collectAIJobs,
  );

  if (jobs.length > 0 && !scriptsOnly) {
    const report = computeCoverageReport(productSlug);
    const prompt = generatePromptMarkdown({
      productSlug,
      domain,
      filePath,
      jobs,
      batchId,
      coveragePct: report.totals.analyze_progress_pct,
      vaultKey: planFileEntry?.vault_key ?? null,
    });
    const runnerNextPayload = buildRunnerNextPayload({
      productSlug,
      domainId: domain.domain_id,
      filePath,
      jobs,
      jobSource,
      plan: riPlan,
      planFileEntry,
    });
    if (!dryRun) {
      fs.writeFileSync(
        runnerNextJobsFile(productSlug),
        JSON.stringify(runnerNextPayload, null, 2) + '\n',
        'utf8',
      );
      fs.writeFileSync(runnerPromptFile(productSlug), prompt, 'utf8');
    }
    runnerState.status = 'needs_ai';
    runnerState.last_tick_at = new Date().toISOString();
    runnerState.ticks++;
    runnerState.last_actions = actions;
    flushRunnerArtifacts(productSlug, runnerState, actions, dryRun);
    return {
      status: 'needs_ai',
      file: filePath,
      domain: domain.domain_id,
      jobs,
      job_source: jobSource,
      queue_source: queueSource,
      actions,
    };
  }

  if (isFileComplete(fileState, runnerState.config.require_validation_pass)) {
    if (!dryRun && fileState) {
      fileState.analyze_status = 'done';
      syncEcosystemFileProgress(eco.state, batch, batchId);
      fs.writeFileSync(batchPath, JSON.stringify(batchState, null, 2) + '\n', 'utf8');
      fs.writeFileSync(eco.path, JSON.stringify(eco.state, null, 2) + '\n', 'utf8');
    }
    actions.push({ action: 'file_complete', file: filePath });
  }

  runnerState.status = 'running';
  runnerState.last_tick_at = new Date().toISOString();
  runnerState.ticks++;
  runnerState.last_actions = actions;
  flushRunnerArtifacts(productSlug, runnerState, actions, dryRun);

  return {
    status: jobs.length === 0 && isFileComplete(fileState, true) ? 'file_complete' : 'tick_ok',
    file: filePath,
    domain: domain.domain_id,
    pending_ai_jobs: jobs.length,
    queue_source: queueSource,
    actions,
  };
}

module.exports = {
  initRunnerState,
  loadRunnerState,
  saveRunnerState,
  populateDomainsFromInventario,
  runTick,
  collectAIJobs,
  isFileComplete,
  sortedDomains,
  resolveTickTarget,
};
