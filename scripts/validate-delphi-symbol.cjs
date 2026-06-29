#!/usr/bin/env node
/**
 * Valida notas vault vs gates (evidencia, sql, chamadas, briefing).
 *
 * Uso:
 *   node scripts/validate-delphi-symbol.cjs --product-slug imoveis --symbol Prenotar --file RegistroDeImoveis/dmPedido.pas
 *   node scripts/validate-delphi-symbol.cjs --product-slug imoveis --file RegistroDeImoveis/dmPedido.pas --all-done --update-batch
 */
const fs = require('fs');
const {
  validateVaultNote,
  validateBatchSymbols,
  resolveVaultAbs,
} = require('./delphi-validate-lib.cjs');
const { loadBatchState } = require('./delphi-triage-lib.cjs');

function parseArgs(argv) {
  const args = { allDone: false, updateBatch: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--file') args.file = argv[++i];
    else if (a === '--symbol') args.symbol = argv[++i];
    else if (a === '--vault') args.vault = argv[++i];
    else if (a === '--batch-id') args.batchId = argv[++i];
    else if (a === '--all-done') args.allDone = true;
    else if (a === '--update-batch') args.updateBatch = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/validate-delphi-symbol.cjs --product-slug <slug> [opções]

Opções:
  --symbol <nome>       Um símbolo (com --file)
  --file <path>         Arquivo .pas no batch
  --vault <path>        Nota vault relativa (sem --symbol)
  --all-done            Todos símbolos status=done no batch ativo
  --update-batch        Grava gates + validation_* no batch JSON
  --batch-id <id>
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  if (args.allDone || (args.file && !args.symbol)) {
    const { path: batchPath, state } = loadBatchState(args.productSlug);
    const report = validateBatchSymbols(state, {
      productSlug: args.productSlug,
      fileFilter: args.file,
      updateBatch: args.updateBatch,
      batchId: args.batchId,
      batchPath,
    });
    if (args.updateBatch) {
      fs.writeFileSync(batchPath, JSON.stringify(state, null, 2) + '\n', 'utf8');
    }
    console.log(JSON.stringify(report, null, 2));
    process.exit(report.failed > 0 ? 1 : 0);
  }

  if (!args.symbol && !args.vault) {
    console.error('Informe --symbol + --file, --vault, ou --all-done');
    process.exit(1);
  }

  const { state } = loadBatchState(args.productSlug);
  const batch = state.batches[args.batchId || state.active_batch_id];
  let sym = null;
  if (args.file && args.symbol && batch?.files[args.file]?.symbols) {
    sym = batch.files[args.file].symbols[args.symbol];
  }

  const vaultRel = args.vault || sym?.vault_path;
  if (!vaultRel) {
    console.error('vault_path não encontrado');
    process.exit(1);
  }

  const result = validateVaultNote({
    vaultPath: resolveVaultAbs(vaultRel),
    symbolName: args.symbol || sym?.symbol,
    pasPath: args.file,
    lineStart: sym?.line_start,
    lineEnd: sym?.line_end,
    mode: sym?.analyze_action === 'stub' ? 'stub' : 'full',
  });

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.pass ? 0 : 1);
}

main();
