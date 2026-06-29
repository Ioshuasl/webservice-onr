#!/usr/bin/env node
/**
 * Extração determinística de formulários Delphi 7 (.dfm) — Fase 0 DFM.
 *
 * Uso:
 *   node scripts/extract-delphi-dfm.cjs --file RegistroDeImoveis/Pedido.dfm --product-slug imoveis
 *   node scripts/extract-delphi-dfm.cjs --file ... --sync-vault --update-batch
 */
const fs = require('fs');
const path = require('path');
const {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
} = require('./delphi-batch-paths.cjs');
const {
  readDfmFile,
  parseDfm,
  findPasPair,
  loadPasManifest,
  crossRefHandlers,
  priorityEvents,
  generateFormIndexMd,
} = require('./delphi-dfm-lib.cjs');

function parseArgs(argv) {
  const args = {
    file: null,
    productSlug: null,
    syncVault: false,
    updateBatch: false,
    writeIndex: true,
    out: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--file') args.file = argv[++i];
    else if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--update-batch') args.updateBatch = true;
    else if (a === '--no-index') args.writeIndex = false;
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/extract-delphi-dfm.cjs --file <path-relativo> --product-slug <slug> [opções]

Opções:
  --sync-vault       Grava manifest + índice form no Obsidian Vault
  --update-batch     Atualiza scripts/delphi-<slug>-batch-state.json
  --no-index         Não gera formularios/<Form>.md
  --out <path>       JSON de saída

Slugs: ${Object.keys(DELPHI_PRODUCTS).join(', ')}
`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function extractDfm(absPath, productProfile, relPath) {
  const content = readDfmFile(absPath);
  const parsed = parseDfm(content);
  const formUnit = path.basename(absPath, path.extname(absPath));
  const pasPair = findPasPair(absPath, productProfile.product_path);
  const pasManifest = pasPair
    ? loadPasManifest(productProfile.vault_hub, formUnit)
    : null;

  const events = crossRefHandlers(parsed.events, pasManifest);

  return {
    form_unit: formUnit,
    form_class: parsed.root?.class || null,
    root_object: parsed.root?.name || null,
    path: relPath.replace(/\\/g, '/'),
    product_slug: productProfile.product_slug,
    delphi_version: 7,
    ide: 'Embarcadero RAD Studio',
    line_count: parsed.line_count,
    indexed_at: new Date().toISOString(),
    pas_pair: pasPair,
    pas_manifest_loaded: Boolean(pasManifest),
    components_total: parsed.components_total,
    events_total: events.length,
    components: parsed.components,
    data_sources: parsed.data_sources,
    frames: parsed.frames,
    events,
    priority_handlers: priorityEvents(events),
    handlers_missing: events.filter((e) => e.handler_missing).length,
  };
}

function writeVaultArtifacts(manifest, productProfile, writeIndex) {
  const hub = path.join(
    VAULT_ROOT,
    productProfile.vault_hub.replace(/\//g, path.sep),
  );
  const manifestDir = path.join(hub, 'manifest');
  ensureDir(manifestDir);

  const manifestFile = `${manifest.form_unit}.dfm.json`;
  const manifestPath = path.join(manifestDir, manifestFile);
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  const vaultManifestRel = `${productProfile.vault_hub}/manifest/${manifestFile}`;

  if (writeIndex) {
    const formsDir = path.join(hub, 'formularios');
    ensureDir(formsDir);
    const indexPath = path.join(formsDir, `${manifest.form_unit}.md`);
    fs.writeFileSync(indexPath, generateFormIndexMd(manifest), 'utf8');
  }

  return {
    manifestPath,
    vaultManifestRel,
    indexPath: writeIndex
      ? `${productProfile.vault_hub}/formularios/${manifest.form_unit}.md`
      : null,
  };
}

function updateBatchState(manifest, productProfile, vaultManifestRel, batchIdOverride) {
  const batchPath = productProfile.batch_file;
  let state;
  if (fs.existsSync(batchPath)) {
    state = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  } else {
    state = {
      product_slug: productProfile.product_slug,
      code_root: CODE_ROOT,
      product_path: productProfile.product_path,
      batch_state_file: `scripts/${path.basename(batchPath)}`,
      active_batch_id: null,
      batches: {},
    };
  }

  const batchId = batchIdOverride || state.active_batch_id || `${productProfile.product_slug}-core-pedido`;
  if (!state.batches[batchId]) {
    state.batches[batchId] = {
      batch_id: batchId,
      product_slug: productProfile.product_slug,
      product_path: productProfile.product_path,
      vault_hub: productProfile.vault_hub,
      started_at: new Date().toISOString(),
      completed_at: null,
      execution_order: [],
      current_file: null,
      status: 'in_progress',
      files: {},
    };
  }

  const batch = state.batches[batchId];
  state.active_batch_id = batchId;

  const fileKey = manifest.path;
  if (!batch.execution_order.includes(fileKey)) {
    batch.execution_order.push(fileKey);
  }

  const eventsMap = {};
  for (const ev of manifest.events) {
    eventsMap[ev.handler] = {
      component: ev.component,
      component_class: ev.component_class,
      event: ev.event,
      line_dfm: ev.line_dfm,
      handler_line_start: ev.handler_line_start,
      handler_line_end: ev.handler_line_end,
      handler_missing: ev.handler_missing,
      status: 'pending',
      priority: manifest.priority_handlers.includes(ev.handler),
      vault_path: null,
      analyze_tier: 'T3',
      analyze_action: 'full',
    };
  }

  batch.files[fileKey] = {
    artifact: 'dfm',
    index_status: 'done',
    analyze_status: 'pending',
    events_total: manifest.events.length,
    events_done: 0,
    handlers_missing: manifest.handlers_missing,
    manifest_vault: vaultManifestRel,
    pas_pair: manifest.pas_pair,
    priority_handlers: manifest.priority_handlers,
    form_class: manifest.form_class,
    form_unit: manifest.form_unit,
    events: eventsMap,
  };

  batch.current_file = fileKey;
  batch.status = 'in_progress';

  fs.writeFileSync(batchPath, JSON.stringify(state, null, 2), 'utf8');
  return { batchPath, batchId, eventsTracked: manifest.events.length };
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.file || !args.productSlug) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const productProfile = DELPHI_PRODUCTS[args.productSlug];
  if (!productProfile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  const relPath = args.file.replace(/\\/g, '/');
  const absPath = path.isAbsolute(args.file)
    ? args.file
    : path.join(CODE_ROOT, relPath);

  if (!fs.existsSync(absPath)) {
    console.error(`Arquivo não encontrado: ${absPath}`);
    process.exit(1);
  }

  const manifest = extractDfm(absPath, productProfile, relPath);

  let vaultInfo = null;
  if (args.syncVault) {
    vaultInfo = writeVaultArtifacts(manifest, productProfile, args.writeIndex);
    console.error(`Vault manifest: ${vaultInfo.manifestPath}`);
    if (vaultInfo.indexPath) console.error(`Vault form: ${vaultInfo.indexPath}`);
  }

  if (args.out) {
    ensureDir(path.dirname(path.resolve(args.out)));
    fs.writeFileSync(args.out, JSON.stringify(manifest, null, 2), 'utf8');
    console.error(`JSON: ${args.out}`);
  }

  let batchInfo = null;
  if (args.updateBatch) {
    if (!vaultInfo) {
      console.error('--update-batch requer --sync-vault');
      process.exit(1);
    }
    batchInfo = updateBatchState(manifest, productProfile, vaultInfo.vaultManifestRel);
    console.error(`Batch: ${batchInfo.batchPath} (${batchInfo.batchId})`);
    console.error(`Eventos rastreados: ${batchInfo.eventsTracked}`);
  }

  if (!args.syncVault && !args.out) {
    console.log(JSON.stringify(manifest, null, 2));
  }

  console.error(
    `\nResumo: ${manifest.form_unit}.dfm — ${manifest.components_total} componentes, ${manifest.events_total} eventos, ${manifest.handlers_missing} handlers ausentes no PAS`,
  );
}

main();
