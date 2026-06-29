/**
 * Triage Delphi legado — glob, classificação T0–T4, nested skip, sync ecosystem.
 */
const fs = require('fs');
const path = require('path');
const { DELPHI_PRODUCTS, VAULT_ROOT } = require('./delphi-batch-paths.cjs');

const SPLIT_THRESHOLD = 250;

const DEFAULT_TRIAGE_RULES = [
  { glob: '**/dependencias/**', tier: 'T0', action: 'skip' },
  { glob: '**/*Cópia*', tier: 'T0', action: 'skip' },
  { glob: '**/*Copia*', tier: 'T0', action: 'skip' },
  { glob: '**/vendor/**', tier: 'T0', action: 'skip' },
  { glob: '**/*.dpr', tier: 'T0', action: 'index_only' },
  { glob: '**/sql*CalcFields*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*AfterScroll*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*BeforePost*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*AfterPost*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*BeforeInsert*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*AfterInsert*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*BeforeDelete*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*AfterDelete*', tier: 'T4', action: 'stub' },
  { glob: '**/sql*UpdateError*', tier: 'T4', action: 'stub' },
  { glob: '**/dm*.pas', tier: 'T1', action: 'full' },
  { glob: '**/ws*.pas', tier: 'T2', action: 'full' },
  { glob: '**/Frame*.pas', tier: 'T3', action: 'full' },
  { glob: '**/*.dfm', tier: 'T3', action: 'index_only' },
];

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Glob mínimo: **, *, ? — paths com / ou \ */
function globToRegExp(glob) {
  const norm = glob.replace(/\\/g, '/');
  let re = '^';
  for (let i = 0; i < norm.length; i++) {
    const c = norm[i];
    if (c === '*') {
      if (norm[i + 1] === '*') {
        re += '.*';
        i++;
        if (norm[i + 1] === '/') i++;
      } else {
        re += '[^/]*';
      }
    } else if (c === '?') {
      re += '[^/]';
    } else {
      re += escapeRe(c);
    }
  }
  re += '$';
  return new RegExp(re, 'i');
}

function matchesGlob(value, glob) {
  if (!glob || !value) return false;
  const v = value.replace(/\\/g, '/');
  const g = glob.replace(/\\/g, '/');
  if (!g.includes('/') && !g.includes('**')) {
    return globToRegExp(g).test(v);
  }
  return globToRegExp(g).test(v);
}

function isFileGlob(glob) {
  const g = glob.toLowerCase();
  return (
    g.includes('.pas')
    || g.includes('.dfm')
    || g.includes('.dpr')
    || g.includes('dependencias')
    || g.includes('cópia')
    || g.includes('copia')
    || g.includes('vendor')
  );
}

function loadEcosystemState(productSlug) {
  const ecoPath = path.join(__dirname, `delphi-${productSlug}-ecosystem-state.json`);
  if (!fs.existsSync(ecoPath)) return { path: ecoPath, state: null };
  return {
    path: ecoPath,
    state: JSON.parse(fs.readFileSync(ecoPath, 'utf8')),
  };
}

function loadBatchState(productSlug) {
  const profile = DELPHI_PRODUCTS[productSlug];
  if (!profile) throw new Error(`Slug desconhecido: ${productSlug}`);
  const batchPath = profile.batch_file;
  if (!fs.existsSync(batchPath)) {
    return { profile, path: batchPath, state: null };
  }
  return {
    profile,
    path: batchPath,
    state: JSON.parse(fs.readFileSync(batchPath, 'utf8')),
  };
}

function loadInventario(productSlug) {
  const profile = DELPHI_PRODUCTS[productSlug];
  const invPath = path.join(
    VAULT_ROOT,
    profile.vault_hub.replace(/\//g, path.sep),
    'inventario',
    'inventario-fontes.json',
  );
  if (!fs.existsSync(invPath)) return { path: invPath, data: null };
  return { path: invPath, data: JSON.parse(fs.readFileSync(invPath, 'utf8')) };
}

function resolveFileTriage(filePath, rules) {
  let result = { tier: 'T2', action: 'full', matched_rule: null };
  for (const rule of rules) {
    if (!isFileGlob(rule.glob)) continue;
    if (matchesGlob(filePath, rule.glob)) {
      result = { tier: rule.tier, action: rule.action, matched_rule: rule.glob };
    }
  }
  return result;
}

function resolveSymbolTriage(filePath, symbolName, rules, fileTriage) {
  let result = {
    tier: fileTriage.tier,
    action: fileTriage.action,
    matched_rule: fileTriage.matched_rule,
  };

  for (const rule of rules) {
    if (isFileGlob(rule.glob)) continue;
    if (matchesGlob(symbolName, rule.glob) || matchesGlob(`${filePath}/${symbolName}`, rule.glob)) {
      result = { tier: rule.tier, action: rule.action, matched_rule: rule.glob };
    }
  }

  if (fileTriage.action === 'skip' || fileTriage.action === 'index_only') {
    return { ...fileTriage, matched_rule: fileTriage.matched_rule };
  }

  return result;
}

function spanLines(symbol) {
  if (!symbol.line_start || !symbol.line_end) return 0;
  return symbol.line_end - symbol.line_start + 1;
}

function detectNestedSymbols(symbolsMap) {
  const entries = Object.entries(symbolsMap).map(([name, sym]) => ({
    name,
    ...sym,
    span: spanLines(sym),
  }));

  entries.sort((a, b) => {
    if (a.line_start !== b.line_start) return a.line_start - b.line_start;
    return b.span - a.span;
  });

  for (let i = 0; i < entries.length; i++) {
    const inner = entries[i];
    if (!inner.line_start || !inner.line_end || inner.span < 5) continue;

    for (let j = 0; j < entries.length; j++) {
      if (i === j) continue;
      const outer = entries[j];
      if (outer.span <= inner.span) continue;
      if (
        inner.line_start >= outer.line_start
        && inner.line_end <= outer.line_end
        && inner.name !== outer.name
      ) {
        const sym = symbolsMap[inner.name];
        if (sym.status === 'done') continue;
        sym.nested_in = outer.name;
        sym.analyze_action = 'skip_analyze';
        sym.analyze_tier = 'T0';
        sym.triage_note = `nested em ${outer.name} (L${outer.line_start}–${outer.line_end})`;
        break;
      }
    }
  }
}

function applyTriageToBatch(batchState, options = {}) {
  const {
    productSlug,
    batchId = null,
    fileFilter = null,
    rules = null,
    dryRun = false,
  } = options;

  if (!batchState) throw new Error('batch state ausente');

  const eco = loadEcosystemState(productSlug);
  const triageRules = rules
    || (eco.state && eco.state.triage_rules)
    || DEFAULT_TRIAGE_RULES;

  const activeBatchId = batchId || batchState.active_batch_id;
  const batch = batchState.batches[activeBatchId];
  if (!batch) throw new Error(`Batch não encontrado: ${activeBatchId}`);

  const stats = {
    files_processed: 0,
    symbols_total: 0,
    symbols_updated: 0,
    by_tier: {},
    by_action: {},
    needs_split: 0,
    nested_skip: 0,
    file_skips: 0,
  };

  const filePaths = fileFilter
    ? [fileFilter]
    : Object.keys(batch.files);

  for (const filePath of filePaths) {
    const fileState = batch.files[filePath];
    if (!fileState) continue;

    stats.files_processed++;
    const fileTriage = resolveFileTriage(filePath, triageRules);

    fileState.tier_default = fileTriage.tier;
    fileState.analyze_action = fileTriage.action;
    fileState.triage_rule = fileTriage.matched_rule;
    fileState.triaged_at = new Date().toISOString();

    if (fileTriage.action === 'skip') {
      fileState.index_status = fileState.index_status || 'skip';
      fileState.analyze_status = 'skip';
      stats.file_skips++;
      continue;
    }

    if (fileState.artifact === 'dfm') {
      if (fileState.events) {
        for (const [handler, ev] of Object.entries(fileState.events)) {
          stats.symbols_total++;
          ev.analyze_tier = ev.analyze_tier || 'T3';
          ev.analyze_action = fileTriage.action === 'index_only' ? 'index_only' : 'full';
          if (ev.status === 'pending' && fileTriage.action === 'index_only') {
            ev.status = 'skip';
          }
          stats.by_tier[ev.analyze_tier] = (stats.by_tier[ev.analyze_tier] || 0) + 1;
        }
      }
      recountFileEvents(fileState);
      continue;
    }

    if (!fileState.symbols) continue;

    detectNestedSymbols(fileState.symbols);

    for (const [symbolName, sym] of Object.entries(fileState.symbols)) {
      stats.symbols_total++;

      if (sym.nested_in && sym.analyze_action === 'skip_analyze') {
        stats.nested_skip++;
        stats.by_tier.T0 = (stats.by_tier.T0 || 0) + 1;
        stats.by_action.skip_analyze = (stats.by_action.skip_analyze || 0) + 1;
        if (sym.status === 'pending') {
          sym.status = 'skip';
        }
        continue;
      }

      const symTriage = resolveSymbolTriage(filePath, symbolName, triageRules, fileTriage);
      const prevTier = sym.analyze_tier;
      const prevAction = sym.analyze_action;

      sym.analyze_tier = symTriage.tier;
      sym.analyze_action = symTriage.action;
      sym.triage_rule = symTriage.matched_rule;

      const lines = spanLines(sym);
      if (lines > SPLIT_THRESHOLD) {
        sym.needs_split = true;
        sym.split_threshold = SPLIT_THRESHOLD;
        stats.needs_split++;
      } else if (sym.needs_split == null) {
        sym.needs_split = false;
      }

      if (symTriage.action === 'stub' && sym.status === 'pending') {
        sym.stub = true;
      }

      if (prevTier !== sym.analyze_tier || prevAction !== sym.analyze_action) {
        stats.symbols_updated++;
      }

      stats.by_tier[sym.analyze_tier] = (stats.by_tier[sym.analyze_tier] || 0) + 1;
      stats.by_action[sym.analyze_action] = (stats.by_action[sym.analyze_action] || 0) + 1;
    }

    recountFileSymbols(fileState);
  }

  if (!dryRun) {
    fs.writeFileSync(
      loadBatchState(productSlug).path,
      JSON.stringify(batchState, null, 2) + '\n',
      'utf8',
    );
    if (eco.state) {
      syncEcosystemFileProgress(eco.state, batch, activeBatchId);
      fs.writeFileSync(eco.path, JSON.stringify(eco.state, null, 2) + '\n', 'utf8');
    }
  }

  return { stats, triageRules, batchId: activeBatchId };
}

function recountFileSymbols(fileState) {
  if (fileState.artifact === 'dfm') {
    recountFileEvents(fileState);
    return;
  }
  const symbols = Object.values(fileState.symbols || {});
  fileState.symbols_total = symbols.length;
  fileState.symbols_done = symbols.filter((s) => s.status === 'done').length;
  fileState.symbols_pending = symbols.filter((s) => s.status === 'pending').length;
  fileState.symbols_skip = symbols.filter((s) => s.status === 'skip').length;
  fileState.symbols_stub_pending = symbols.filter(
    (s) => s.status === 'pending' && s.analyze_action === 'stub',
  ).length;
  fileState.symbols_full_pending = symbols.filter(
    (s) => s.status === 'pending' && s.analyze_action === 'full',
  ).length;

  const actionable = symbols.filter((s) => s.analyze_action !== 'skip_analyze' && s.status !== 'skip');
  const actionableDone = actionable.filter((s) => s.status === 'done').length;
  fileState.analyze_progress_pct = actionable.length
    ? Math.round((actionableDone / actionable.length) * 1000) / 10
    : 0;

  if (fileState.symbols_done === fileState.symbols_total && fileState.symbols_total > 0) {
    fileState.analyze_status = 'done';
  } else if (fileState.symbols_done > 0) {
    fileState.analyze_status = 'partial';
  }
}

function recountFileEvents(fileState) {
  const events = Object.values(fileState.events || {});
  fileState.events_total = events.length;
  fileState.events_done = events.filter((e) => e.status === 'done').length;
  fileState.events_pending = events.filter((e) => e.status === 'pending').length;
  fileState.analyze_progress_pct = events.length
    ? Math.round((fileState.events_done / events.length) * 1000) / 10
    : 0;
  if (fileState.events_done === fileState.events_total && fileState.events_total > 0) {
    fileState.analyze_status = 'done';
  } else if (fileState.events_done > 0) {
    fileState.analyze_status = 'partial';
  }
}

function syncEcosystemFileProgress(ecoState, batch, batchId) {
  if (!ecoState.file_progress) ecoState.file_progress = {};

  for (const [filePath, fileState] of Object.entries(batch.files)) {
    ecoState.file_progress[filePath] = {
      batch_id: batchId,
      artifact: fileState.artifact || 'pas',
      index_status: fileState.index_status,
      analyze_status: fileState.analyze_status,
      symbols_done: fileState.symbols_done || 0,
      symbols_total: fileState.symbols_total || 0,
      symbols_pending: fileState.symbols_pending || 0,
      symbols_skip: fileState.symbols_skip || 0,
      symbols_stub_pending: fileState.symbols_stub_pending || 0,
      symbols_full_pending: fileState.symbols_full_pending || 0,
      events_done: fileState.events_done || 0,
      events_total: fileState.events_total || 0,
      analyze_progress_pct: fileState.analyze_progress_pct || 0,
      tier_default: fileState.tier_default || null,
      triaged_at: fileState.triaged_at || null,
    };
  }

  for (const domain of Object.values(ecoState.domains || {})) {
    const order = domain.execution_order || [];
    const done = order.filter((fp) => {
      const p = ecoState.file_progress[fp];
      return p && p.analyze_status === 'done';
    }).length;
    domain.files_done = done;
    domain.files_total = order.length || domain.files_total;
  }
}

function computeCoverageReport(productSlug) {
  const { profile, state: batchState } = loadBatchState(productSlug);
  const eco = loadEcosystemState(productSlug);
  const inv = loadInventario(productSlug);

  const report = {
    product_slug: productSlug,
    generated_at: new Date().toISOString(),
    inventario: null,
    batches: [],
    domains: [],
    totals: {
      files_inventario: 0,
      pas_inventario: 0,
      symbols_tracked: 0,
      symbols_done: 0,
      symbols_pending: 0,
      symbols_skip: 0,
      symbols_stub_pending: 0,
      symbols_full_pending: 0,
      analyze_progress_pct: 0,
    },
  };

  if (inv.data) {
    const files = inv.data.files || [];
    report.inventario = {
      path: inv.path,
      total_files: files.length,
      pas: files.filter((f) => f.ext === '.pas').length,
      dfm: files.filter((f) => f.ext === '.dfm').length,
      categories: inv.data.categories || {},
      pas_line_count_sum: inv.data.pas_line_count_sum || 0,
    };
    report.totals.files_inventario = files.length;
    report.totals.pas_inventario = report.inventario.pas;
  }

  if (batchState && batchState.batches) {
    for (const [id, batch] of Object.entries(batchState.batches)) {
      const batchSummary = {
        batch_id: id,
        status: batch.status,
        files: [],
        symbols_total: 0,
        symbols_done: 0,
        symbols_pending: 0,
        symbols_skip: 0,
        symbols_stub_pending: 0,
        symbols_full_pending: 0,
        analyze_progress_pct: 0,
      };

      for (const [filePath, fileState] of Object.entries(batch.files || {})) {
        const isDfm = fileState.artifact === 'dfm';
        const symbols = Object.values(fileState.symbols || {});
        const events = Object.values(fileState.events || {});
        const fileSummary = {
          path: filePath,
          artifact: fileState.artifact || 'pas',
          index_status: fileState.index_status,
          analyze_status: fileState.analyze_status,
          tier_default: fileState.tier_default,
          symbols_total: fileState.symbols_total || symbols.length,
          symbols_done: fileState.symbols_done || 0,
          symbols_pending: fileState.symbols_pending || 0,
          symbols_skip: fileState.symbols_skip || 0,
          symbols_stub_pending: fileState.symbols_stub_pending || 0,
          symbols_full_pending: fileState.symbols_full_pending || 0,
          events_total: fileState.events_total || events.length,
          events_done: fileState.events_done || 0,
          analyze_progress_pct: fileState.analyze_progress_pct || 0,
          by_tier: {},
        };

        if (isDfm) {
          for (const ev of events) {
            const tier = ev.analyze_tier || '?';
            fileSummary.by_tier[tier] = (fileSummary.by_tier[tier] || 0) + 1;
          }
          batchSummary.files.push(fileSummary);
          batchSummary.symbols_total += fileSummary.events_total;
          batchSummary.symbols_done += fileSummary.events_done;
          batchSummary.symbols_pending += fileSummary.events_total - fileSummary.events_done;
          continue;
        }

        for (const sym of symbols) {
          const tier = sym.analyze_tier || '?';
          fileSummary.by_tier[tier] = (fileSummary.by_tier[tier] || 0) + 1;
        }

        batchSummary.files.push(fileSummary);
        batchSummary.symbols_total += fileSummary.symbols_total;
        batchSummary.symbols_done += fileSummary.symbols_done;
        batchSummary.symbols_pending += fileSummary.symbols_pending;
        batchSummary.symbols_skip += fileSummary.symbols_skip;
        batchSummary.symbols_stub_pending += fileSummary.symbols_stub_pending;
        batchSummary.symbols_full_pending += fileSummary.symbols_full_pending;
      }

      const actionableTotal = batchSummary.symbols_total - batchSummary.symbols_skip;
      batchSummary.analyze_progress_pct = actionableTotal
        ? Math.round((batchSummary.symbols_done / actionableTotal) * 1000) / 10
        : 0;

      report.batches.push(batchSummary);
      report.totals.symbols_tracked += batchSummary.symbols_total;
      report.totals.symbols_done += batchSummary.symbols_done;
      report.totals.symbols_pending += batchSummary.symbols_pending;
      report.totals.symbols_skip += batchSummary.symbols_skip;
      report.totals.symbols_stub_pending += batchSummary.symbols_stub_pending;
      report.totals.symbols_full_pending += batchSummary.symbols_full_pending;
    }
  }

  const actionable = report.totals.symbols_tracked - report.totals.symbols_skip;
  report.totals.analyze_progress_pct = actionable
    ? Math.round((report.totals.symbols_done / actionable) * 1000) / 10
    : 0;

  if (eco.state && eco.state.domains) {
    for (const domain of Object.values(eco.state.domains)) {
      const files = (domain.execution_order || []).map((fp) => {
        const p = (eco.state.file_progress || {})[fp];
        return { path: fp, ...(p || { analyze_status: 'not_started' }) };
      });
      report.domains.push({
        domain_id: domain.domain_id,
        label: domain.label,
        priority: domain.priority,
        status: domain.status,
        files_total: domain.files_total,
        files_done: domain.files_done,
        files,
      });
    }
  }

  report.vault_hub = profile.vault_hub;
  return report;
}

function formatCoverageMarkdown(report) {
  const t = report.totals;
  const inv = report.inventario;
  const date = report.generated_at.slice(0, 10);

  const batchRows = report.batches.flatMap((b) =>
    b.files.map((f) => {
      if (f.artifact === 'dfm') {
        return `| ${b.batch_id} | \`${f.path}\` (dfm) | ${f.tier_default || '—'} | ${f.events_done}/${f.events_total} evt | — | — | — | **${f.analyze_progress_pct}%** | ${f.analyze_status} |`;
      }
      return `| ${b.batch_id} | \`${f.path}\` | ${f.tier_default || '—'} | ${f.symbols_done}/${f.symbols_total} | ${f.symbols_full_pending} | ${f.symbols_stub_pending} | ${f.symbols_skip} | **${f.analyze_progress_pct}%** | ${f.analyze_status} |`;
    }),
  );

  const domainRows = report.domains.map((d) =>
    `| ${d.domain_id} | ${d.priority} | ${d.status} | ${d.files_done}/${d.files_total} | ${d.label} |`,
  );

  const pasCoveragePct = inv && t.symbols_tracked
    ? Math.round((t.symbols_done / Math.max(inv.pas, 1)) * 1000) / 10
    : 0;

  return `---
tipo: documentacao
area: orius
produto: ${report.product_slug}
tags: [orius, delphi7, legado, cobertura, metricas]
status: revisado
fonte: report-delphi-coverage
atualizado: ${date}
---

# Cobertura — ${report.product_slug}

Gerado por \`npm run delphi:report-coverage -- --product-slug ${report.product_slug}\`

## Resumo executivo

| Métrica | Valor |
|---------|-------|
| Arquivos no inventário | ${inv ? inv.total_files : '—'} |
| Units \`.pas\` no inventário | ${inv ? inv.pas : '—'} |
| Linhas \`.pas\` (soma) | ${inv ? inv.pas_line_count_sum.toLocaleString('pt-BR') : '—'} |
| Símbolos rastreados (batch) | **${t.symbols_tracked}** |
| Símbolos \`done\` | **${t.symbols_done}** |
| Pendentes \`full\` | ${t.symbols_full_pending} |
| Pendentes \`stub\` (T4) | ${t.symbols_stub_pending} |
| Skip (nested/T0) | ${t.symbols_skip} |
| **Progresso análise** (excl. skip) | **${t.analyze_progress_pct}%** |
| Símbolos done / units inventário | ${pasCoveragePct}% (proxy grosso) |

## Batches

| Batch | Arquivo | Tier | Done/Total | Pend. full | Pend. stub | Skip | Progresso | Status |
|-------|---------|------|------------|------------|------------|------|-----------|--------|
${batchRows.length ? batchRows.join('\n') : '| — | — | — | — | — | — | — | — | — |'}

## Domínios (ecosystem)

| Domínio | Prioridade | Status | Arquivos | Label |
|---------|------------|--------|----------|-------|
${domainRows.length ? domainRows.join('\n') : '| — | — | — | — | — |'}

## Inventário por categoria

${inv ? Object.entries(inv.categories).map(([k, v]) => `- **${k}:** ${v}`).join('\n') : '_Inventário não encontrado — rode `npm run delphi:sync-tree`_'}

## Como atualizar

\`\`\`bash
npm run delphi:apply-triage -- --product-slug ${report.product_slug}
npm run delphi:report-coverage -- --product-slug ${report.product_slug} --sync-vault
\`\`\`

Hub: [[${report.vault_hub}/00-indice]] · Inventário: [[${report.vault_hub}/inventario/00-resumo-inventario]]
`;
}

module.exports = {
  SPLIT_THRESHOLD,
  DEFAULT_TRIAGE_RULES,
  matchesGlob,
  resolveFileTriage,
  loadEcosystemState,
  loadBatchState,
  loadInventario,
  applyTriageToBatch,
  syncEcosystemFileProgress,
  computeCoverageReport,
  formatCoverageMarkdown,
};
