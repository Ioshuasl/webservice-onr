#!/usr/bin/env node
/**
 * Loop hands-off com Cursor SDK — zero chat (requer CURSOR_API_KEY + @cursor/sdk).
 *
 *   node scripts/delphi-hands-off-sdk-loop.cjs --product-slug imoveis
 *   node scripts/delphi-hands-off-sdk-loop.cjs --product-slug imoveis --max-ai-batches 5
 */
const { spawnSync } = require('child_process');
const path = require('path');

const SCRIPTS = path.join(__dirname);

function parseArgs(argv) {
  const args = { maxAiBatches: Infinity };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--max-ai-batches') args.maxAiBatches = parseInt(argv[++i], 10) || 1;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function run(cmd, cmdArgs) {
  const r = spawnSync(cmd, cmdArgs, { stdio: 'inherit', shell: true, cwd: path.join(__dirname, '..') });
  return r.status ?? 1;
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    console.log(`Uso: node scripts/delphi-hands-off-sdk-loop.cjs --product-slug imoveis [--max-ai-batches N]`);
    process.exit(args.help ? 0 : 1);
  }

  if (!process.env.CURSOR_API_KEY) {
    console.error('Defina CURSOR_API_KEY. Alternativa: registro-imoveis/hands-off-supervisor.md num chat Cursor.');
    process.exit(1);
  }

  let aiBatches = 0;
  while (aiBatches < args.maxAiBatches) {
    const tickStatus = run('node', [
      path.join(SCRIPTS, 'delphi-hands-off-loop.cjs'),
      '--product-slug',
      args.productSlug,
      '--max-ticks',
      '100',
    ]);

    if (tickStatus === 0) {
      console.error('\n✓ Ecossistema completo');
      process.exit(0);
    }
    if (tickStatus !== 2) {
      process.exit(tickStatus || 1);
    }

    aiBatches++;
    console.error(`\n=== Lote IA ${aiBatches} (SDK) ===`);
    const sdkStatus = run('node', [
      path.join(SCRIPTS, 'delphi-dispatch-cursor-sdk.mjs'),
      '--product-slug',
      args.productSlug,
    ]);
    if (sdkStatus !== 0) {
      console.error('SDK batch falhou');
      process.exit(sdkStatus);
    }
  }

  console.error(`Parou após ${aiBatches} lote(s) IA (--max-ai-batches)`);
  process.exit(0);
}

main();
