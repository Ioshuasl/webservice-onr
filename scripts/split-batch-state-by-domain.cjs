#!/usr/bin/env node
/**
 * Migra scripts/autonr-batch-state.json monolítico → um JSON por domínio.
 * Uso: node scripts/split-batch-state-by-domain.cjs
 */
const fs = require('fs');
const path = require('path');
const { DOMAIN_BATCH_FILES, resolveDomainFromBatch, relativePath } = require('./batch-state-paths.cjs');

const LEGACY = path.join(__dirname, 'autonr-batch-state.json');
if (!fs.existsSync(LEGACY)) {
  console.error('Legacy file not found:', LEGACY);
  process.exit(1);
}

const legacy = JSON.parse(fs.readFileSync(LEGACY, 'utf8'));
const buckets = {};

for (const [batchKey, batch] of Object.entries(legacy.batches || {})) {
  const domain = resolveDomainFromBatch(batch);
  const rel = relativePath(domain.file);
  if (!buckets[rel]) buckets[rel] = { batches: {}, domain: domain.plane_identifier };
  buckets[rel].batches[batchKey] = batch;
}

for (const [rel, { batches, domain }] of Object.entries(buckets)) {
  const active =
    legacy.active_batch_id && batches[legacy.active_batch_id]
      ? legacy.active_batch_id
      : Object.keys(batches).find((k) => batches[k].status === 'in_progress') ||
        Object.keys(batches).pop() ||
        null;

  const out = {
    domain,
    batch_state_file: rel,
    active_batch_id: active,
    batches,
  };

  const abs = path.join(__dirname, '..', rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${rel} (${Object.keys(batches).length} batch(es), active=${active})`);
}

// autonr vazio se não havia batches ONR
const onrRel = relativePath(DOMAIN_BATCH_FILES.autonr.file);
if (!buckets[onrRel]) {
  const empty = {
    domain: 'AUTONR',
    batch_state_file: onrRel,
    active_batch_id: null,
    batches: {},
  };
  fs.writeFileSync(DOMAIN_BATCH_FILES.autonr.file, JSON.stringify(empty, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${onrRel} (empty scaffold)`);
}

console.log('Done. Legacy autonr-batch-state.json kept unchanged — remove manually after review.');
