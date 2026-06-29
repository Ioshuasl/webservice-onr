#!/usr/bin/env node
/**
 * Marca símbolos dos lotes 13–17 (Pedido.pas) para re-análise full via Task.
 *
 * Uso:
 *   node scripts/reset-pedido-lotes-13-17.cjs --dry-run
 *   node scripts/reset-pedido-lotes-13-17.cjs --apply
 *   node scripts/reset-pedido-lotes-13-17.cjs --apply --write-manifest
 */
const fs = require('fs');
const path = require('path');
const { FILE, LOTS, P0_SYMBOLS, allSymbolsFlat, totalCount } = require('./pedido-lotes-13-17-symbols.cjs');
const { loadBatchState, syncEcosystemFileProgress, loadEcosystemState } = require('./delphi-triage-lib.cjs');
const { runnerStateFile } = require('./delphi-runner-paths.cjs');

const PRODUCT = 'imoveis';
const BATCH_ID = 'imoveis-dmPedido-poc';
const DOMAIN_ID = 'ri-core-pedido';
const REVIEW_REASON = 'gen-script-lote13-17';

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    apply: argv.includes('--apply'),
    writeManifest: argv.includes('--write-manifest') || argv.includes('--apply'),
  };
}

function loadJson(abs) {
  return JSON.parse(fs.readFileSync(abs, 'utf8'));
}

function saveJson(abs, data) {
  fs.writeFileSync(abs, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function recountPedidoFile(fileState) {
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
  const actionable = symbols.filter(
    (s) => s.analyze_action !== 'skip_analyze' && s.status !== 'skip',
  );
  const actionableDone = actionable.filter((s) => s.status === 'done').length;
  fileState.analyze_progress_pct = actionable.length
    ? Math.round((actionableDone / actionable.length) * 1000) / 10
    : 0;
  fileState.analyze_status =
    fileState.symbols_pending > 0 ? 'in_progress' : fileState.analyze_status;
}

function buildManifest(batchFileState) {
  const lots = {};
  for (const [lotNum, meta] of Object.entries(LOTS)) {
    lots[lotNum] = {
      priority: meta.priority,
      symbols: meta.symbols.map((name) => {
        const sym = batchFileState.symbols[name] || {};
        return {
          name,
          line_start: sym.line_start,
          line_end: sym.line_end,
          vault_path: sym.vault_path || null,
          p0: P0_SYMBOLS.has(name),
        };
      }),
    };
  }
  return {
    generated_at: new Date().toISOString(),
    product_slug: PRODUCT,
    file: FILE,
    batch_id: BATCH_ID,
    review_reason: REVIEW_REASON,
    total_symbols: totalCount(),
    lots,
    execution_order: Object.keys(LOTS)
      .sort((a, b) => Number(a) - Number(b))
      .flatMap((n) => LOTS[n].symbols),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.dryRun && !args.apply) {
    console.error('Use --dry-run ou --apply');
    process.exit(1);
  }

  const flat = allSymbolsFlat();
  const { path: batchPath, state: batchState } = loadBatchState(PRODUCT);
  const batch = batchState.batches[BATCH_ID];
  if (!batch) {
    console.error(`Batch ${BATCH_ID} não encontrado`);
    process.exit(1);
  }

  const fileState = batch.files[FILE];
  if (!fileState?.symbols) {
    console.error(`${FILE} ausente no batch`);
    process.exit(1);
  }

  const missing = flat.filter(({ name }) => !fileState.symbols[name]);
  if (missing.length) {
    console.error('Símbolos ausentes no batch:', missing.map((m) => m.name).join(', '));
    process.exit(1);
  }

  const changes = [];
  for (const { lot, name } of flat) {
    const sym = fileState.symbols[name];
    changes.push({
      lot,
      name,
      was: sym.status,
      lines: `${sym.line_start}-${sym.line_end}`,
      vault_path: sym.vault_path,
    });
    if (!args.apply) continue;

    sym.status = 'pending';
    sym.validation_pass = false;
    sym.validation_errors = [`revisão: ${REVIEW_REASON}`];
    sym.validated_at = null;
    sym.review_reason = REVIEW_REASON;
    sym.review_lot = lot;
    sym.review_requested_at = new Date().toISOString();
    if (sym.gates) {
      for (const k of Object.keys(sym.gates)) sym.gates[k] = false;
    }
  }

  if (args.apply) {
    recountPedidoFile(fileState);
    batch.current_file = FILE;
    batch.status = batch.status === 'complete' ? 'in_progress' : batch.status;
    saveJson(batchPath, batchState);

    const eco = loadEcosystemState(PRODUCT);
    if (eco.state) {
      syncEcosystemFileProgress(eco.state, batch, BATCH_ID);
      const domain = eco.state.domains?.[DOMAIN_ID];
      if (domain) {
        domain.status = 'in_progress';
        domain.current_file = FILE;
      }
      eco.state.active_domain_id = DOMAIN_ID;
      saveJson(eco.path, eco.state);
    }

    const runnerPath = runnerStateFile(PRODUCT);
    if (fs.existsSync(runnerPath)) {
      const runner = loadJson(runnerPath);
      runner.status = 'needs_ai';
      runner.active_domain_id = DOMAIN_ID;
      runner.active_file = FILE;
      runner.last_tick_at = new Date().toISOString();
      runner.last_actions = [
        { action: 'reset_revalidate', file: FILE, symbols: flat.length, reason: REVIEW_REASON },
      ];
      saveJson(runnerPath, runner);
    }
  }

  const manifest = buildManifest(fileState);
  const manifestPath = path.join(
    __dirname,
    '..',
    'registro-imoveis',
    'pedido-lotes-13-17-manifest.json',
  );

  if (args.writeManifest && args.apply) {
    saveJson(manifestPath, manifest);
  }

  console.log(
    JSON.stringify(
      {
        mode: args.apply ? 'apply' : 'dry-run',
        file: FILE,
        symbols_to_revalidate: flat.length,
        lots: Object.fromEntries(
          Object.entries(LOTS).map(([n, m]) => [n, m.symbols.length]),
        ),
        pedido_pas_after: args.apply
          ? {
              symbols_done: fileState.symbols_done,
              symbols_total: fileState.symbols_total,
              analyze_status: fileState.analyze_status,
            }
          : undefined,
        manifest_written: args.apply && args.writeManifest ? manifestPath : null,
        sample: changes.slice(0, 5),
      },
      null,
      2,
    ),
  );
}

main();
