#!/usr/bin/env node
/**
 * Runner autônomo do ecossistema Delphi — um tick por invocação.
 *
 * Uso:
 *   node scripts/delphi-ecosystem-runner.cjs --product-slug imoveis
 *   node scripts/delphi-ecosystem-runner.cjs --product-slug imoveis --init --init-domains
 *   node scripts/delphi-ecosystem-runner.cjs --product-slug imoveis --loop 5
 *   node scripts/delphi-ecosystem-runner.cjs --product-slug imoveis --scripts-only
 *
 * Exit codes:
 *   0 — tick ok / domínio completo / ecossistema completo
 *   2 — needs_ai (ver registro-imoveis/runner-next-prompt.md)
 *   1 — erro
 */
const { runTick } = require('./delphi-runner-lib.cjs');

function parseArgs(argv) {
  const args = {
    dryRun: false,
    scriptsOnly: false,
    init: false,
    initDomains: false,
    loop: 1,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--domain') args.domain = argv[++i];
    else if (a === '--loop') args.loop = parseInt(argv[++i], 10) || 1;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--scripts-only') args.scriptsOnly = true;
    else if (a === '--init') args.init = true;
    else if (a === '--init-domains') args.initDomains = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Runner autônomo Delphi legado

  node scripts/delphi-ecosystem-runner.cjs --product-slug imoveis [opções]

Opções:
  --init              Recria runner-state.json
  --init-domains      Popula ri-eridf / ri-restante do inventário
  --loop <n>          Até n ticks (para em needs_ai)
  --scripts-only      Só fases script (index, triage, validate) — não gera prompt IA
  --domain <id>       Forçar domínio
  --dry-run

Kickoff único:
  @registro-imoveis/runner-kickoff.md

Loop contínuo (PowerShell):
  while ($LASTEXITCODE -eq 0 -or $LASTEXITCODE -eq 2) {
    if ($LASTEXITCODE -eq 2) { /* colar prompt runner-next-prompt.md no Cursor */ break }
    npm run delphi:run-ecosystem -- --product-slug imoveis
  }
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  let lastResult = null;
  for (let i = 0; i < args.loop; i++) {
    lastResult = runTick({
      productSlug: args.productSlug,
      domainId: args.domain,
      dryRun: args.dryRun,
      scriptsOnly: args.scriptsOnly,
      init: args.init && i === 0,
      initDomains: args.initDomains && i === 0,
    });

    console.log(JSON.stringify(lastResult, null, 2));

    if (lastResult.status === 'needs_ai') {
      console.error('\n→ IA necessária: registro-imoveis/runner-next-prompt.md');
      process.exit(2);
    }
    if (lastResult.status === 'error') {
      process.exit(1);
    }
    if (lastResult.status === 'complete') {
      console.error('\n✓ Ecossistema completo');
      process.exit(0);
    }
    if (args.init) args.init = false;
    if (args.initDomains) args.initDomains = false;
  }

  process.exit(0);
}

main();
