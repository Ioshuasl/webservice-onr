#!/usr/bin/env node
/**
 * Relatório de cobertura Delphi — JSON stdout ou markdown no vault (00-cobertura.md).
 *
 * Uso:
 *   node scripts/report-delphi-coverage.cjs --product-slug imoveis
 *   node scripts/report-delphi-coverage.cjs --product-slug imoveis --sync-vault
 */
const fs = require('fs');
const path = require('path');
const { VAULT_ROOT, DELPHI_PRODUCTS } = require('./delphi-batch-paths.cjs');
const {
  computeCoverageReport,
  formatCoverageMarkdown,
} = require('./delphi-triage-lib.cjs');

function parseArgs(argv) {
  const args = { syncVault: false, json: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--json') args.json = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/report-delphi-coverage.cjs --product-slug <slug> [opções]

Opções:
  --sync-vault   Grava ${'`'}.../produtos/<slug>/00-cobertura.md${'`'} no Obsidian Vault
  --json         Saída JSON (default se sem --sync-vault)
`);
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

  const report = computeCoverageReport(args.productSlug);

  if (args.syncVault) {
    const hub = path.join(VAULT_ROOT, profile.vault_hub.replace(/\//g, path.sep));
    fs.mkdirSync(hub, { recursive: true });
    const outPath = path.join(hub, '00-cobertura.md');
    fs.writeFileSync(outPath, formatCoverageMarkdown(report), 'utf8');
    console.error(`Vault: ${outPath}`);
    console.error(
      `Progresso: ${report.totals.symbols_done}/${report.totals.symbols_tracked - report.totals.symbols_skip} (${report.totals.analyze_progress_pct}%)`,
    );
  } else {
    console.log(JSON.stringify(report, null, 2));
  }
}

main();
