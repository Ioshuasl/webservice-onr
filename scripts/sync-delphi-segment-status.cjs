#!/usr/bin/env node
/**
 * Marca segment-NN.md como status: referencia quando nota merge pai existe.
 */
const fs = require('fs');
const path = require('path');
const { VAULT_ROOT, DELPHI_PRODUCTS } = require('./delphi-batch-paths.cjs');
const { parseFrontmatter } = require('./delphi-validate-lib.cjs');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--unit') args.unit = argv[++i];
    else if (a === '--symbol') args.symbol = argv[++i];
    else if (a === '--dry-run') args.dryRun = true;
  }
  return args;
}

function updateFrontmatterStatus(content, status) {
  const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return content;
  let body = m[1];
  if (/^status:/m.test(body)) {
    body = body.replace(/^status:.*$/m, `status: ${status}`);
  } else {
    body += `\nstatus: ${status}`;
  }
  return content.replace(m[0], `---\n${body}\n---`);
}

function main() {
  const args = parseArgs(process.argv);
  if (!args.productSlug) {
    console.error('Uso: --product-slug <slug> [--unit U] [--symbol S] [--dry-run]');
    process.exit(1);
  }

  const profile = DELPHI_PRODUCTS[args.productSlug];
  const unidades = path.join(VAULT_ROOT, profile.vault_hub.replace(/\//g, path.sep), 'unidades');
  let updated = 0;

  const units = args.unit
    ? [args.unit]
    : fs.readdirSync(unidades, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);

  for (const unit of units) {
    const unitDir = path.join(unidades, unit);
    const symbols = args.symbol
      ? [`${args.symbol}.md`]
      : fs.readdirSync(unitDir).filter((f) => f.endsWith('.md'));

    for (const file of symbols) {
      const symbol = file.replace(/\.md$/, '');
      const mergePath = path.join(unitDir, file);
      if (!fs.existsSync(mergePath)) continue;

      const mergeContent = fs.readFileSync(mergePath, 'utf8');
      const { fields } = parseFrontmatter(mergeContent);
      if (fields.fonte !== 'agent-delphi-analyzer-merge' && fields.status !== 'revisado') {
        continue;
      }

      const segDir = path.join(unitDir, symbol);
      if (!fs.existsSync(segDir)) continue;

      for (const seg of fs.readdirSync(segDir)) {
        if (!/^segment-\d+\.md$/i.test(seg)) continue;
        const segPath = path.join(segDir, seg);
        const segContent = fs.readFileSync(segPath, 'utf8');
        const segFm = parseFrontmatter(segContent);
        if (segFm.fields.status === 'referencia') continue;

        const next = updateFrontmatterStatus(segContent, 'referencia');
        if (!args.dryRun) fs.writeFileSync(segPath, next, 'utf8');
        updated++;
        console.error(`${args.dryRun ? '[dry-run] ' : ''}${segPath}`);
      }
    }
  }

  console.log(JSON.stringify({ updated }, null, 2));
}

main();
