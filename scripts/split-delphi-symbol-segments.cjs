#!/usr/bin/env node
/**
 * Divide um símbolo Delphi (.pas) em segmentos de N linhas para análise encadeada.
 *
 *   node scripts/split-delphi-symbol-segments.cjs --product-slug imoveis --symbol Prenotar
 *   node scripts/split-delphi-symbol-segments.cjs --product-slug imoveis --symbol Prenotar --sync-vault --update-batch
 */
const fs = require('fs');
const path = require('path');
const {
  CODE_ROOT,
  VAULT_ROOT,
  DELPHI_PRODUCTS,
} = require('./delphi-batch-paths.cjs');

const DEFAULT_CHUNK = 200;
const SPLIT_THRESHOLD = 250;

function parseArgs(argv) {
  const args = {
    productSlug: null,
    symbol: null,
    lineStart: null,
    lineEnd: null,
    filePath: null,
    chunkSize: DEFAULT_CHUNK,
    syncVault: false,
    updateBatch: false,
    batchId: null,
  };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--product-slug') args.productSlug = argv[++i];
    else if (a === '--symbol') args.symbol = argv[++i];
    else if (a === '--line-start') args.lineStart = Number(argv[++i]);
    else if (a === '--line-end') args.lineEnd = Number(argv[++i]);
    else if (a === '--file') args.filePath = argv[++i];
    else if (a === '--chunk-size') args.chunkSize = Number(argv[++i]);
    else if (a === '--batch-id') args.batchId = argv[++i];
    else if (a === '--sync-vault') args.syncVault = true;
    else if (a === '--update-batch') args.updateBatch = true;
    else if (a === '--help' || a === '-h') args.help = true;
  }
  return args;
}

function usage() {
  console.log(`Uso:
  node scripts/split-delphi-symbol-segments.cjs --product-slug imoveis --symbol Prenotar [opções]

Opções:
  --file RegistroDeImoveis/dmPedido.pas
  --line-start / --line-end   (se omitido: lê do batch JSON)
  --chunk-size 200            (padrão ${DEFAULT_CHUNK})
  --batch-id imoveis-dmPedido-poc
  --sync-vault                Grava _segment-plan.json no vault
  --update-batch              Atualiza símbolo no batch state
`);
}

function readLines(absPath) {
  return fs.readFileSync(absPath, 'latin1').split(/\r?\n/);
}

function isSoftBoundary(line) {
  const t = line.trim();
  if (!t) return true;
  if (/^\/\//.test(t)) return true;
  if (/^procedure\b/i.test(t)) return true;
  if (/^function\b/i.test(t)) return true;
  if (/^end\s*;?\s*$/i.test(t)) return true;
  if (/^begin\s*$/i.test(t)) return true;
  if (/^try\s*$/i.test(t)) return true;
  if (/^except\b/i.test(t)) return true;
  if (/^finally\b/i.test(t)) return true;
  if (/^case\b/i.test(t)) return true;
  if (/^else\b/i.test(t)) return true;
  return false;
}

function refineEnd(lines, proposedEnd, lineEndMax) {
  const searchStart = Math.max(0, proposedEnd - 15);
  const searchEnd = Math.min(lines.length - 1, proposedEnd + 5);
  for (let i = proposedEnd; i >= searchStart; i--) {
    if (isSoftBoundary(lines[i])) return i + 1;
  }
  for (let i = proposedEnd; i <= searchEnd; i++) {
    if (isSoftBoundary(lines[i])) return i + 1;
  }
  return Math.min(proposedEnd, lineEndMax);
}

function buildSegments(lineStart, lineEnd, chunkSize, lines) {
  const segments = [];
  let cur = lineStart;
  let idx = 1;

  while (cur <= lineEnd) {
    let end = Math.min(cur + chunkSize - 1, lineEnd);
    if (end < lineEnd && lines) {
      end = refineEnd(lines, end, lineEnd);
      if (end <= cur) end = Math.min(cur + chunkSize - 1, lineEnd);
    }
    const id = String(idx).padStart(2, '0');
    segments.push({
      id,
      segment_key: `segment-${id}`,
      line_start: cur,
      line_end: end,
      line_count: end - cur + 1,
      status: 'pending',
      vault_path: null,
      handoff_path: null,
    });
    cur = end + 1;
    idx++;
  }
  return segments;
}

function resolveFromBatch(profile, args) {
  const batchPath = profile.batch_file;
  if (!fs.existsSync(batchPath)) return null;
  const state = JSON.parse(fs.readFileSync(batchPath, 'utf8'));
  const batchId = args.batchId || state.active_batch_id;
  const batch = state.batches?.[batchId];
  if (!batch) return null;

  let fileKey = args.filePath;
  let sym = null;

  if (fileKey && batch.files?.[fileKey]?.symbols?.[args.symbol]) {
    sym = batch.files[fileKey].symbols[args.symbol];
  } else {
    for (const [fk, f] of Object.entries(batch.files || {})) {
      if (f.symbols?.[args.symbol]) {
        fileKey = fk;
        sym = f.symbols[args.symbol];
        break;
      }
    }
  }

  if (!sym) return null;
  return {
    batchPath,
    state,
    batchId,
    batch,
    fileKey,
    symbol: args.symbol,
    lineStart: sym.line_start,
    lineEnd: sym.line_end,
    class: sym.class,
    symbolType: sym.symbol_type,
  };
}

function unitFromPath(filePath) {
  return path.basename(filePath, '.pas');
}

function writeVaultPlan(profile, unit, symbol, plan) {
  const hub = path.join(
    VAULT_ROOT,
    profile.vault_hub.replace(/\//g, path.sep),
    'unidades',
    unit,
    symbol,
  );
  fs.mkdirSync(hub, { recursive: true });
  const planPath = path.join(hub, '_segment-plan.json');
  fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), 'utf8');

  const readme = `---
tipo: legado-delphi
area: orius
produto: ${profile.product_slug}
unit: ${unit}
simbolo: ${symbol}
status: segmentacao
fonte: split-delphi-symbol-segments
---

# Segmentos — \`${unit}.${symbol}\`

Plano: \`_segment-plan.json\` (${plan.segments.length} segmentos × ~${plan.chunk_size} linhas)

| # | Linhas | Status | Nota |
|---|--------|--------|------|
${plan.segments
  .map(
    (s) =>
      `| ${s.id} | ${s.line_start}–${s.line_end} | ${s.status} | [[segment-${s.id}]] |`,
  )
  .join('\n')}

Após todos \`done\`: rodar **merge** → [[../${symbol}]]
`;

  fs.writeFileSync(path.join(hub, '_segmentos.md'), readme, 'utf8');
  return {
    planPath,
    vaultRel: `${profile.vault_hub}/unidades/${unit}/${symbol}/_segment-plan.json`,
    segmentDir: `${profile.vault_hub}/unidades/${unit}/${symbol}`,
  };
}

function updateBatchSymbol(ctx, plan, vaultInfo) {
  const sym = ctx.batch.files[ctx.fileKey].symbols[ctx.symbol];
  sym.needs_split = true;
  sym.split_threshold = SPLIT_THRESHOLD;
  sym.chunk_size = plan.chunk_size;
  sym.segment_status = 'in_progress';
  sym.segments_total = plan.segments.length;
  sym.segments_done = plan.segments.filter((s) => s.status === 'done').length;
  sym.segment_plan_vault = vaultInfo.vaultRel;
  sym.segments = Object.fromEntries(
    plan.segments.map((s) => [
      s.segment_key,
      {
        id: s.id,
        line_start: s.line_start,
        line_end: s.line_end,
        status: s.status,
        vault_path: s.vault_path,
      },
    ]),
  );
  sym.merge_status = 'pending';
  fs.writeFileSync(ctx.batchPath, JSON.stringify(ctx.state, null, 2), 'utf8');
}

function main() {
  const args = parseArgs(process.argv);
  if (args.help || !args.productSlug || !args.symbol) {
    usage();
    process.exit(args.help ? 0 : 1);
  }

  const profile = DELPHI_PRODUCTS[args.productSlug];
  if (!profile) {
    console.error(`Slug desconhecido: ${args.productSlug}`);
    process.exit(1);
  }

  let lineStart = args.lineStart;
  let lineEnd = args.lineEnd;
  let filePath = args.filePath;
  let className = null;
  let batchCtx = null;

  if ((!lineStart || !lineEnd) && args.updateBatch) {
    batchCtx = resolveFromBatch(profile, args);
    if (batchCtx) {
      lineStart = batchCtx.lineStart;
      lineEnd = batchCtx.lineEnd;
      filePath = filePath || batchCtx.fileKey;
      className = batchCtx.class;
    }
  }

  if (!lineStart || !lineEnd) {
    console.error('Informe --line-start/--line-end ou use --update-batch com símbolo no batch.');
    process.exit(1);
  }

  const span = lineEnd - lineStart + 1;
  if (span <= SPLIT_THRESHOLD) {
    console.error(
      `Símbolo tem ${span} linhas (≤ ${SPLIT_THRESHOLD}). Use analisador simples, sem segmentos.`,
    );
    process.exit(0);
  }

  filePath = filePath || `${profile.product_path}/${args.symbol}.pas`;
  const absPath = path.join(CODE_ROOT, filePath.replace(/\//g, path.sep));
  const lines = fs.existsSync(absPath) ? readLines(absPath) : null;
  const unit = unitFromPath(filePath);

  const segments = buildSegments(lineStart, lineEnd, args.chunkSize, lines);

  const plan = {
    symbol: args.symbol,
    unit,
    class: className,
    file_path: filePath.replace(/\\/g, '/'),
    line_start: lineStart,
    line_end: lineEnd,
    line_count: span,
    chunk_size: args.chunkSize,
    split_threshold: SPLIT_THRESHOLD,
    generated_at: new Date().toISOString(),
    product_slug: args.productSlug,
    segments,
    handoff_vault: `${profile.vault_hub}/unidades/${unit}/${args.symbol}/_handoff.json`,
    merge_output_vault: `${profile.vault_hub}/unidades/${unit}/${args.symbol}.md`,
  };

  console.log(JSON.stringify(plan, null, 2));

  if (args.syncVault) {
    const vaultInfo = writeVaultPlan(profile, unit, args.symbol, plan);
    console.error(`Vault plan: ${vaultInfo.planPath}`);
    console.error(`Segmentos: ${segments.length} (${lineStart}–${lineEnd})`);

    if (args.updateBatch) {
      if (!batchCtx) batchCtx = resolveFromBatch(profile, args);
      if (batchCtx) {
        updateBatchSymbol(batchCtx, plan, vaultInfo);
        console.error(`Batch atualizado: ${batchCtx.batchPath}`);
      }
    }
  }
}

main();
