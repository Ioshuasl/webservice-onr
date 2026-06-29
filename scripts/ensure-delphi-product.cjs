#!/usr/bin/env node
/**
 * Scaffold ecosystem + runner + popular domínios vazios.
 *
 * Uso:
 *   node scripts/ensure-delphi-product.cjs --product-slug imoveis
 *   node scripts/ensure-delphi-product.cjs --product-slug imoveis --init-domains
 */
const fs = require('fs');
const path = require('path');
const { DELPHI_PRODUCTS, CODE_ROOT } = require('./delphi-batch-paths.cjs');
const { loadInventario } = require('./delphi-triage-lib.cjs');
const { initRunnerState, populateDomainsFromInventario } = require('./delphi-runner-lib.cjs');

function parseArgs(argv) {
  const args = { initDomains: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--init-domains') args.initDomains = true;
  }
  return args;
}

function ecosystemScaffold(profile) {
  return {
    product_slug: profile.product_slug,
    product_path: profile.product_path,
    code_root: CODE_ROOT,
    ecosystem_state_file: `scripts/delphi-${profile.product_slug}-ecosystem-state.json`,
    vault_hub: profile.vault_hub,
    inventario_vault: `${profile.vault_hub}/inventario/inventario-fontes.json`,
    active_domain_id: null,
    status: 'pending',
    started_at: null,
    completed_at: null,
    triage_rules: [],
    domains: {},
    file_progress: {},
  };
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.productSlug) {
    console.error('Uso: --product-slug <slug> [--init-domains]');
    process.exit(1);
  }

  const profile = DELPHI_PRODUCTS[args.productSlug];
  if (!profile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  const ecoPath = path.join(__dirname, `delphi-${args.productSlug}-ecosystem-state.json`);
  let eco;
  if (fs.existsSync(ecoPath)) {
    eco = JSON.parse(fs.readFileSync(ecoPath, 'utf8'));
    console.error(`Ecosystem exists: ${ecoPath}`);
  } else {
    eco = ecosystemScaffold(profile);
    fs.writeFileSync(ecoPath, JSON.stringify(eco, null, 2) + '\n', 'utf8');
    console.error(`Created: ${ecoPath}`);
  }

  if (args.initDomains) {
    const inv = loadInventario(args.productSlug);
    const pop = populateDomainsFromInventario(eco, inv.data);
    fs.writeFileSync(ecoPath, JSON.stringify(eco, null, 2) + '\n', 'utf8');
    console.error(`Domains populated: ${JSON.stringify(pop)}`);
  }

  initRunnerState(args.productSlug);
  console.error(`Runner state initialized`);
}

main();
