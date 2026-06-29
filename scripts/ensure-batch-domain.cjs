#!/usr/bin/env node
/**
 * Garante arquivo batch JSON por domínio + registra em batch-state-paths.cjs
 * + sincroniza markdown do skill agent-n8n-batch-orchestrator.
 *
 * Uso:
 *   node scripts/ensure-batch-domain.cjs --plane-identifier AUTCNIB
 *   node scripts/ensure-batch-domain.cjs --register --plane-identifier AUTSIGEF \
 *     --plane-slug autsigef --batch-id-prefix sigef- --integration sigef \
 *     --label "SIGEF" --upstream "REST (futuro)"
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { DOMAIN_BATCH_FILES, relativePath, findByPlaneIdentifier } = require('./batch-state-paths.cjs');

const PATHS_FILE = path.join(__dirname, 'batch-state-paths.cjs');
const SCRIPTS_DIR = path.join(__dirname);

function parseArgs(argv) {
  const out = { register: false };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--register') out.register = true;
    else if (a.startsWith('--')) {
      const key = a.slice(2).replace(/-/g, '_');
      out[key] = argv[++i];
    }
  }
  return out;
}

function slugFromIdentifier(id) {
  return id.toLowerCase().replace(/^aut/, 'aut');
}

function findByIdentifier(id) {
  return findByPlaneIdentifier(id);
}

function batchJsonScaffold(planeIdentifier, relFile) {
  return {
    domain: planeIdentifier,
    batch_state_file: relFile,
    active_batch_id: null,
    batches: {},
  };
}

function ensureBatchJson(meta) {
  const abs = meta.file;
  const rel = relativePath(abs);
  if (fs.existsSync(abs)) {
    console.log(`Batch JSON exists: ${rel}`);
    return rel;
  }
  fs.writeFileSync(abs, JSON.stringify(batchJsonScaffold(meta.plane_identifier, rel), null, 2) + '\n', 'utf8');
  console.log(`Created batch JSON: ${rel}`);
  return rel;
}

function appendDomainToPathsFile(entry) {
  let src = fs.readFileSync(PATHS_FILE, 'utf8');
  if (src.includes(`plane_identifier: '${entry.plane_identifier}'`)) {
    console.log(`Already in batch-state-paths.cjs: ${entry.plane_identifier}`);
    return;
  }
  const insertBefore = '\n};\n\nfunction resolveDomainFromBatch';
  const block = `  ${entry.key}: {
    file: path.join(ROOT, '${entry.filename}'),
    plane_identifier: '${entry.plane_identifier}',
    batch_id_prefix: '${entry.batch_id_prefix}',
    label: '${entry.label}',
    registry: '${entry.registry}',
    plane_slug: '${entry.plane_slug}',
    integration: '${entry.integration}',
    upstream: '${entry.upstream}',
    resolver_patterns: ${JSON.stringify(entry.resolver_patterns || [])},
  },`;
  if (!src.includes(insertBefore)) {
    throw new Error('Could not find insertion point in batch-state-paths.cjs');
  }
  src = src.replace(insertBefore, `\n${block}${insertBefore}`);
  fs.writeFileSync(PATHS_FILE, src, 'utf8');
  console.log(`Registered ${entry.plane_identifier} in batch-state-paths.cjs`);
  delete require.cache[require.resolve('./batch-state-paths.cjs')];
}

function syncSkillDocs() {
  execSync('node scripts/sync-batch-orchestrator-skill-docs.cjs', {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
  });
}

function main() {
  const args = parseArgs(process.argv);
  const planeIdentifier = args.plane_identifier;
  if (!planeIdentifier) {
    console.error('Required: --plane-identifier AUTXXX');
    process.exit(1);
  }

  let hit = findByIdentifier(planeIdentifier);

  if (!hit && args.register) {
    const planeSlug = args.plane_slug || slugFromIdentifier(planeIdentifier);
    const integration = args.integration || planeSlug.replace(/^aut/, '');
    const batchIdPrefix = args.batch_id_prefix || `${integration}-`;
    const filename = `${planeSlug}-batch-state.json`;
    appendDomainToPathsFile({
      key: planeSlug,
      filename,
      plane_identifier: planeIdentifier,
      batch_id_prefix: batchIdPrefix,
      label: args.label || planeIdentifier,
      registry: args.registry || `${planeSlug}-work-items.json`,
      plane_slug: planeSlug,
      integration,
      upstream: args.upstream || 'TBD',
      resolver_patterns: args.resolver_pattern ? [args.resolver_pattern] : [],
    });
    delete require.cache[require.resolve('./batch-state-paths.cjs')];
    const paths = require('./batch-state-paths.cjs');
    hit = paths.findByPlaneIdentifier(planeIdentifier);
  }

  if (!hit) {
    console.error(
      `Domain ${planeIdentifier} not in batch-state-paths.cjs. Re-run with --register and metadata.`
    );
    process.exit(1);
  }

  const [, meta] = hit;
  ensureBatchJson(meta);
  syncSkillDocs();
  console.log('Skill markdown synced.');
}

main();
