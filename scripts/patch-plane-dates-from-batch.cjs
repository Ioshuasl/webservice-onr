#!/usr/bin/env node
/**
 * Preenche start_date e target_date nos cards Plane a partir do batch JSON.
 *
 * - Batch: started_at / completed_at em ISO8601 UTC
 * - Plane: start_date / target_date em YYYY-MM-DD (calendário America/Sao_Paulo)
 *
 * Uso:
 *   node scripts/patch-plane-dates-from-batch.cjs --batch scripts/autenot-batch-state.json
 *   node scripts/patch-plane-dates-from-batch.cjs --batch scripts/autenot-batch-state.json --plane-key AUTENOT-1
 *   node scripts/patch-plane-dates-from-batch.cjs --batch scripts/autenot-batch-state.json --dry-run
 */
const fs = require('fs');
const path = require('path');

const VAULT_PLANE_SCRIPTS = path.join(
  'C:',
  'Users',
  'kenio',
  'Obsidian Vault',
  'Meta',
  'integracoes',
  'plane',
  'scripts'
);

const { loadInstanceEnv, loadProject } = require(path.join(
  VAULT_PLANE_SCRIPTS,
  'lib',
  'plane-config'
));
const { patchWorkItem } = require(path.join(VAULT_PLANE_SCRIPTS, 'lib', 'plane-api'));
const { loadRegistry, getRegistryPath } = require(path.join(
  VAULT_PLANE_SCRIPTS,
  'lib',
  'plane-registry'
));

const BRAZIL_TZ = 'America/Sao_Paulo';

function parseArgs(argv) {
  const args = { dryRun: false, planeKeys: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const a = argv[i];
    if (a === '--batch') args.batchPath = argv[++i];
    else if (a === '--plane-key') args.planeKeys.push(argv[++i]);
    else if (a === '--dry-run') args.dryRun = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

/** ISO UTC → YYYY-MM-DD no fuso Brasil (Plane não usa hora em start/target). */
function toBrazilDateOnly(isoUtc) {
  if (!isoUtc) return null;
  return new Intl.DateTimeFormat('en-CA', { timeZone: BRAZIL_TZ }).format(new Date(isoUtc));
}

function usage() {
  console.log(`Uso:
  node scripts/patch-plane-dates-from-batch.cjs --batch <batch-state.json> [--plane-key AUTENOT-1] [--dry-run]

Converte started_at/completed_at (UTC) do batch em start_date/target_date (America/Sao_Paulo) no Plane.`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || !args.batchPath) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const batchAbs = path.resolve(args.batchPath);
  const batchRoot = JSON.parse(fs.readFileSync(batchAbs, 'utf8'));
  const batchId = batchRoot.active_batch_id;
  const batch = batchRoot.batches[batchId];
  if (!batch) {
    console.error(`Batch ativo "${batchId}" não encontrado em ${args.batchPath}`);
    process.exit(1);
  }

  const registryPath = getRegistryPath(batch.plane_project);
  const registry = loadRegistry(registryPath);
  if (!registry) {
    console.error(`Registry ausente: ${registryPath}`);
    process.exit(1);
  }

  const byPlaneKey = {};
  for (const item of Object.values(registry.items)) {
    if (item.plane_key) byPlaneKey[item.plane_key] = item;
  }

  const instance = loadInstanceEnv();
  const project = loadProject(batch.plane_project);

  const keys =
    args.planeKeys.length > 0
      ? args.planeKeys
      : (batch.execution_order || Object.keys(batch.cards));

  let updated = 0;
  let skipped = 0;

  for (const planeKey of keys) {
    const card = batch.cards[planeKey];
    const reg = byPlaneKey[planeKey];
    if (!card || !reg?.plane_work_item_id) {
      console.warn(`SKIP ${planeKey}: card ou registry ausente`);
      skipped += 1;
      continue;
    }
    if (card.status !== 'done' && !card.completed_at) {
      console.warn(`SKIP ${planeKey}: ainda não concluído no batch`);
      skipped += 1;
      continue;
    }

    const start_date = toBrazilDateOnly(card.started_at);
    const target_date = toBrazilDateOnly(card.completed_at);
    if (!start_date || !target_date) {
      console.warn(`SKIP ${planeKey}: started_at/completed_at ausente no batch`);
      skipped += 1;
      continue;
    }

    const line = `${planeKey}: ${start_date} → ${target_date} (UTC ${card.started_at} … ${card.completed_at})`;
    if (args.dryRun) {
      console.log(`[dry-run] ${line}`);
      updated += 1;
      continue;
    }

    await patchWorkItem(instance, project, reg.plane_work_item_id, {
      start_date,
      target_date,
    });
    console.log(`OK ${line}`);
    updated += 1;
    await new Promise((r) => setTimeout(r, 450));
  }

  console.log(
    `\n${args.dryRun ? 'Simulado' : 'Atualizado'}: ${updated} | Ignorados: ${skipped} | Batch: ${batchId}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
