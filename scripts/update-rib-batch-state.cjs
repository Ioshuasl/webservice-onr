#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const { DOMAIN_BATCH_FILES } = require('./batch-state-paths.cjs');

const BATCH_PATH = DOMAIN_BATCH_FILES.autorib.file;
const REG_PATH = path.join(
  process.env.USERPROFILE || '',
  'Obsidian Vault/Meta/integracoes/plane/maps/autorib-work-items.json',
);
const state = JSON.parse(fs.readFileSync(BATCH_PATH, 'utf8'));

const LEGACY_TO_SEQ = {};
for (let i = 91; i <= 126; i++) LEGACY_TO_SEQ[`AUTONR-${i}`] = `AUTORIB-${i - 90}`;

function migrateTitle(t) {
  if (!t) return t;
  let s = t.replace(/\(integração\)/gi, '(rib)').replace(/\(RIB\)/g, '(rib)');
  for (const [leg, neo] of Object.entries(LEGACY_TO_SEQ)) {
    s = s.replace(new RegExp(`\\[${leg}\\]`, 'g'), `[${neo}]`);
    s = s.replace(new RegExp(leg, 'g'), neo);
  }
  return s;
}

const oldCards = {};
for (const batch of Object.values(state.batches)) {
  if (!batch.cards) continue;
  for (const [k, v] of Object.entries(batch.cards)) {
    if (LEGACY_TO_SEQ[k]) oldCards[k] = v;
  }
}

let reg = { items: {} };
if (fs.existsSync(REG_PATH)) reg = JSON.parse(fs.readFileSync(REG_PATH, 'utf8'));

const newCards = {};
for (const [legKey, card] of Object.entries(oldCards)) {
  const neoKey = LEGACY_TO_SEQ[legKey];
  const op = card.operacao || legKey.replace('AUTONR-', '');
  const regEntry = Object.values(reg.items).find((e) => e.plane_legacy_key === legKey) ||
    reg.items[Object.keys(reg.items).find((k) => reg.items[k].plane_legacy_key === legKey)];
  newCards[neoKey] = {
    ...card,
    plane_legacy_key: legKey,
    card_title: migrateTitle(card.card_title),
    workflow_id_n8n: card.workflow_id_n8n || regEntry?.workflow_id_n8n,
  };
}

for (const [op, entry] of Object.entries(reg.items)) {
  const neoKey = entry.plane_key;
  if (newCards[neoKey]) continue;
  newCards[neoKey] = {
    operacao: op,
    status: entry.automation_status === 'done' ? 'done' : 'pending',
    plane_legacy_key: entry.plane_legacy_key,
    card_title: entry.card_name,
    workflow_id_n8n: entry.workflow_id_n8n,
  };
}

const newBatch = {
  batch_id: 'rib-1-36',
  plane_project: 'autorib',
  plane_identifier: 'AUTORIB',
  started_at: state.batches['rib-109-126']?.started_at || new Date().toISOString(),
  completed_at: state.batches['rib-109-126']?.completed_at || new Date().toISOString(),
  context_root: state.batches['rib-109-126']?.context_root,
  workflows_path: 'workflows/n8n/extensao-n8n-teste',
  integration: 'rib',
  postman_collection: 'postman/RIB-n8n.postman_collection.json',
  range: { from: 'AUTORIB-1', to: 'AUTORIB-36' },
  status: 'complete',
  cards: newCards,
};

delete state.batches['rib-109-126'];
state.batches['rib-1-36'] = newBatch;
fs.writeFileSync(BATCH_PATH, JSON.stringify(state, null, 2) + '\n');
console.log('updated batch rib-1-36 with', Object.keys(newCards).length, 'cards');
