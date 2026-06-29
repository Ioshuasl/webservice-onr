#!/usr/bin/env node
/**
 * Aplica triage T0–T4 aos símbolos no batch state + sync ecosystem file_progress.
 *
 * Uso:
 *   node scripts/apply-delphi-triage.cjs --product-slug imoveis
 *   node scripts/apply-delphi-triage.cjs --product-slug imoveis --file RegistroDeImoveis/dmPedido.pas
 *   node scripts/apply-delphi-triage.cjs --product-slug imoveis --dry-run
 */
const { loadBatchState, applyTriageToBatch } = require('./delphi-triage-lib.cjs');

function parseArgs(argv) {
  const args = { dryRun: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--batch-id') args.batchId = argv[++i];
    else if (a === '--file') args.file = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/apply-delphi-triage.cjs --product-slug <slug> [opções]

Opções:
  --batch-id <id>     Batch específico (default: active_batch_id)
  --file <path>       Só um arquivo no batch
  --dry-run           Não grava JSON

Slugs: imoveis, civil, protesto, rtd, caixa
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const { path: batchPath, state } = loadBatchState(args.productSlug);
  if (!state) {
    console.error(`Batch não encontrado: ${batchPath}`);
    process.exit(1);
  }

  const result = applyTriageToBatch(state, {
    productSlug: args.productSlug,
    batchId: args.batchId,
    fileFilter: args.file,
    dryRun: args.dryRun,
  });

  console.log(JSON.stringify({ batch_id: result.batchId, stats: result.stats }, null, 2));
  if (args.dryRun) {
    console.error('(dry-run — nenhum arquivo gravado)');
  } else {
    console.error(`Triage aplicado: ${batchPath}`);
    console.error(`Ecosystem: scripts/delphi-${args.productSlug}-ecosystem-state.json`);
  }
}

main();
