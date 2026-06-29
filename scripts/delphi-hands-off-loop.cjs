#!/usr/bin/env node
/**
 * Loop hands-off — ticks script até needs_ai ou complete.
 *
 * Uso:
 *   node scripts/delphi-hands-off-loop.cjs --product-slug imoveis
 *   node scripts/delphi-hands-off-loop.cjs --product-slug imoveis --scripts-only --loop 50
 *   node scripts/delphi-hands-off-loop.cjs --product-slug imoveis --max-ticks 200
 *
 * Exit:
 *   0 — ecossistema complete
 *   2 — needs_ai (supervisor ou SDK deve executar runner-next-prompt.md)
 *   1 — erro
 */
const { runTick } = require('./delphi-runner-lib.cjs');
const { runnerPromptFile } = require('./delphi-runner-paths.cjs');

function parseArgs(argv) {
  const args = {
    loop: Infinity,
    maxTicks: Infinity,
    scriptsOnly: false,
    init: false,
    initDomains: false,
    dryRun: false,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--loop') args.maxTicks = parseInt(argv[++i], 10) || 1;
    else if (a === '--max-ticks') args.maxTicks = parseInt(argv[++i], 10) || 1;
    else if (a === '--scripts-only') args.scriptsOnly = true;
    else if (a === '--init') args.init = true;
    else if (a === '--init-domains') args.initDomains = true;
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Hands-off loop — ticks automáticos até IA ou fim

  node scripts/delphi-hands-off-loop.cjs --product-slug imoveis [opções]

Opções:
  --max-ticks <n>     Máximo de ticks (default: ilimitado)
  --loop <n>          Alias de --max-ticks
  --scripts-only      Não gera fila IA; só index/triage/validate
  --init              Recria runner-state no primeiro tick
  --init-domains      Popula ri-eridf / ri-restante

Supervisor (mínima intervenção humana):
  Cole registro-imoveis/hands-off-supervisor.md num chat Cursor e deixe rodando.

SDK (sem chat):
  npm run delphi:hands-off:sdk -- --product-slug imoveis
`);
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  let init = args.init;
  let initDomains = args.initDomains;
  let ticks = 0;

  while (ticks < args.maxTicks) {
    const result = runTick({
      productSlug: args.productSlug,
      dryRun: args.dryRun,
      scriptsOnly: args.scriptsOnly,
      init,
      initDomains,
    });
    ticks++;
    init = false;
    initDomains = false;

    const summary = {
      tick: ticks,
      status: result.status,
      file: result.file,
      domain: result.domain,
      pending_ai: result.pending_ai_jobs,
      jobs: result.jobs?.length,
    };
    console.error(JSON.stringify(summary));

    if (result.status === 'needs_ai') {
      console.error(`\n→ IA: ${runnerPromptFile(args.productSlug)}`);
      console.error('→ Supervisor: registro-imoveis/hands-off-supervisor.md');
      process.exit(2);
    }
    if (result.status === 'error') {
      process.exit(1);
    }
    if (result.status === 'complete') {
      console.error('\n✓ Ecossistema completo');
      process.exit(0);
    }
  }

  console.error(`\n… parou após ${ticks} tick(s) (--max-ticks)`);
  process.exit(0);
}

main();
