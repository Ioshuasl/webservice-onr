#!/usr/bin/env node
/**
 * Dispara lote IA via Cursor SDK (local agent).
 * Requer: npm i @cursor/sdk && CURSOR_API_KEY
 *
 * Uso:
 *   node scripts/delphi-dispatch-cursor-sdk.mjs --product-slug imoveis
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    if (argv[i] === '--product-slug') args.productSlug = argv[++i];
    else if (argv[i] === '--help' || argv[i] === '-h') args.help = true;
  }
  return args;
}

function extractPromptBlock(md) {
  const m = md.match(/## Prompt \(copiar no Cursor\)\s*\n+```([\s\S]*?)```/);
  return m ? m[1].trim() : md;
}

async function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug) {
    console.log(`Uso: node scripts/delphi-dispatch-cursor-sdk.mjs --product-slug imoveis
Requer CURSOR_API_KEY e: npm i @cursor/sdk`);
    process.exit(args.help ? 0 : 1);
  }

  if (!process.env.CURSOR_API_KEY) {
    console.error('CURSOR_API_KEY não definida.');
    process.exit(1);
  }

  const promptPath = path.join(REPO_ROOT, 'registro-imoveis', 'runner-next-prompt.md');
  if (!fs.existsSync(promptPath)) {
    console.error(`Ausente: ${promptPath} — rode delphi:run-ecosystem primeiro.`);
    process.exit(1);
  }

  let Agent;
  try {
    ({ Agent } = await import('@cursor/sdk'));
  } catch {
    console.error('Instale: npm i @cursor/sdk');
    process.exit(1);
  }

  const md = fs.readFileSync(promptPath, 'utf8');
  const prompt = extractPromptBlock(md);

  console.error('→ Disparando Cursor SDK (local)…');
  const result = await Agent.prompt(prompt, {
    apiKey: process.env.CURSOR_API_KEY,
    model: { id: 'composer-2.5' },
    local: { cwd: REPO_ROOT },
  });

  console.log(JSON.stringify({ status: result.status, result: result.result?.slice?.(0, 500) }, null, 2));
  process.exit(result.status === 'completed' ? 0 : 1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
