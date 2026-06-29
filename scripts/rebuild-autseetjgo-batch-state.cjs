#!/usr/bin/env node
/**
 * Reconstrói scripts/autseetjgo-batch-state.json — modelo 1:1 (25 endpoints / plane keys).
 * Preserva progresso do lote legado seetjgo-1-13 (match por operacao).
 *
 * Uso:
 *   node scripts/rebuild-autseetjgo-batch-state.cjs
 *   node scripts/rebuild-autseetjgo-batch-state.cjs --dry-run
 */
const fs = require('fs');
const path = require('path');
const {
  PLANE_SEQ_OPERACAO,
  BATCH_EXECUTION_ORDER,
  cardTitle,
  planeKeyFromSeq,
  specFilename,
  workflowFilename,
  byPlaneSeq,
} = require('./see-tjgo-endpoints.cjs');

const BATCH_PATH = path.join(__dirname, 'autseetjgo-batch-state.json');
const VAULT_BASE = 'Orius/integracoes/see-tjgo';
const dryRun = process.argv.includes('--dry-run');

const DEFAULT_GATES = {
  vault: false,
  workflow: false,
  push: false,
  postman: false,
  sync: false,
  docs: false,
  payload: false,
};

function loadLegacyProgress() {
  const byOperacao = new Map();
  if (!fs.existsSync(BATCH_PATH)) return byOperacao;
  try {
    const state = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));
    const legacy = state.batches['seetjgo-1-13'] || state.batches[state.active_batch_id];
    if (!legacy?.cards) return byOperacao;
    for (const card of Object.values(legacy.cards)) {
      if (card?.operacao) byOperacao.set(card.operacao, card);
    }
  } catch {
    /* ignore */
  }
  return byOperacao;
}

function buildCard(planeSeq, legacyByOp) {
  const ep = byPlaneSeq(planeSeq);
  if (!ep) throw new Error(`sem endpoint para plane seq ${planeSeq}`);
  const key = planeKeyFromSeq(planeSeq);
  const legacy = legacyByOp.get(ep.operacao);
  const card = {
    operacao: ep.operacao,
    dominio: ep.dominio,
    direcao: ep.direcao,
    method: ep.method,
    canonical_seq: ep.seq,
    plane_sequence_id: planeSeq,
    status: legacy?.status || 'pending',
    card_title: cardTitle(ep, planeSeq),
    webhook: ep.webhook,
    upstream: `${ep.method} ${ep.upstream}`,
    see_spec: `${VAULT_BASE}/${specFilename(ep)}`,
    utilizacao: `${VAULT_BASE}/automacao/utilizacao/${ep.operacao}.md`,
    desenvolvimento: `${VAULT_BASE}/automacao/desenvolvimento/${ep.operacao}.md`,
    workflow_path: `workflows/n8n/extensao-n8n-teste/${workflowFilename(ep)}`,
    priority: ep.priority,
    gates: legacy?.gates ? { ...legacy.gates } : { ...DEFAULT_GATES },
  };
  if (ep.anchor) card.anchor = true;
  if (legacy?.started_at) card.started_at = legacy.started_at;
  if (legacy?.completed_at) card.completed_at = legacy.completed_at;
  if (legacy?.workflow_id_n8n) card.workflow_id_n8n = legacy.workflow_id_n8n;
  if (legacy?.status === 'done') card.status = 'done';
  return { key, card };
}

function nextCurrent(cards) {
  for (const key of BATCH_EXECUTION_ORDER) {
    const c = cards[key];
    if (c && (c.status === 'pending' || c.status === 'in_progress')) return key;
  }
  return null;
}

function main() {
  const legacyByOp = loadLegacyProgress();
  const cards = {};
  for (let planeSeq = 1; planeSeq <= 25; planeSeq++) {
    const { key, card } = buildCard(planeSeq, legacyByOp);
    cards[key] = card;
  }

  const doneCount = Object.values(cards).filter((c) => c.status === 'done').length;
  const allDone = doneCount === 25;
  const startedAt = legacyByOp.get('Sessions')?.started_at || null;

  const batch = {
    batch_id: 'seetjgo-1-25',
    plane_project: 'autseetjgo',
    plane_identifier: 'AUTSEETJGO',
    endpoint_model: '1:1-openapi-v0.4.2',
    catalog_script: 'scripts/see-tjgo-endpoints.cjs',
    started_at: startedAt,
    completed_at: allDone ? new Date().toISOString() : null,
    context_root: 'c:\\Users\\kenio\\automacoes e testes',
    workflows_path: 'workflows/n8n/extensao-n8n-teste',
    integration: 'see tjgo',
    adapter: null,
    postman_collection: 'postman/see-tjgo/collection_postman.json',
    postman_environment: 'postman/see-tjgo/environment_postman.json',
    env_section: 'SEE TJGO — API Sistema Extrajudicial (CGJ GO)',
    range: { from: 'AUTSEETJGO-1', to: 'AUTSEETJGO-25' },
    execution_order: [...BATCH_EXECUTION_ORDER],
    current: allDone ? null : nextCurrent(cards),
    status: allDone ? 'complete' : (startedAt ? 'in_progress' : 'pending'),
    cards,
  };

  const state = {
    domain: 'AUTSEETJGO',
    batch_state_file: 'scripts/autseetjgo-batch-state.json',
    active_batch_id: 'seetjgo-1-25',
    batches: {
      'seetjgo-1-25': batch,
      'seetjgo-1-13': {
        ...(JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8')).batches?.['seetjgo-1-13'] || {}),
        batch_id: 'seetjgo-1-13',
        status: 'superseded',
        superseded_by: 'seetjgo-1-25',
        superseded_at: new Date().toISOString(),
      },
    },
  };

  if (dryRun) {
    console.log(JSON.stringify({ active_batch_id: state.active_batch_id, cards: Object.keys(cards).length, execution_order: batch.execution_order, current: batch.current, done: doneCount }, null, 2));
    return;
  }

  fs.writeFileSync(BATCH_PATH, JSON.stringify(state, null, 2) + '\n');
  console.log(`rebuilt ${BATCH_PATH} — seetjgo-1-25 (${doneCount}/25 done, current=${batch.current})`);
}

main();
